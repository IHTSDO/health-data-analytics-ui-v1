import Ember from 'ember';
import {isAjaxError, isNotFoundError, isForbiddenError, isServerError} from 'ember-ajax/errors';

export default Ember.Controller.extend({
    ajax: Ember.inject.service(),
    loading: false,
    error: false,
    init: function() {
        this._super();
        this.get('ajax').request('health-analytics-api/stats')
            .then((result) => {
                this.set('stats', result);
            });
    },
    toECL: function (conceptString) {
        if (conceptString != null && conceptString.length > 0 && conceptString.indexOf('|') !== -1) {
            // Has label
            // Strip and label and convert to descendants and self
            return "<<" + conceptString.split(" ")[0];
        } else {
            // Assume ECL already
            return conceptString;
        }
    },
    getWording : function (typeId, tense){
        
        
    },
    actions: {
        addQueryRefinement(model){
            model.pushObject(
                {
                    "ecl": "",
                    "has": true,
                    "includeDaysInFuture": '*',
                    "includeDaysInPast": '*',
                    "limitation": "64572001",
                    "fsn": ""
                }
            );
        },
        deleteRefinement(index, refinements) {
            refinements.removeAt(index);
        },
        addTests(model){
            var testOutcome = {
                "ecl": "",
                "has": true,
                "includeDaysInFuture": '*',
                "includeDaysInPast": 0,
                "limitation": "64572001"
              };
            this.set('model.testOutcome', testOutcome);
            var testVariable = {
                "ecl": "",
                "has": true,
                "includeDaysInFuture": '*',
                "includeDaysInPast": 0,
                "limitation": "64572001"
              };
            this.set('model.testVariable', testVariable);
        },
        removeTests(model){
            this.set('model.testOutcome', null);
            this.set('model.testVariable', null);
        },
        fetchCohort() {
            this.set('loading', true);
            this.set('error', false); 
            console.log(this.get('model'));
            var gender;
            let primaryExposure = this.get('model.primaryExposure');
            let primaryExposureECL = this.toECL(primaryExposure);
            this.set('model.gender', $('#genderSelect').find(":selected").text());
            if(this.get('model.gender') !== null && this.get('model.gender') !== undefined){
                gender = this.get('model.gender').toUpperCase();
            }

            let inclusionCriteria = this.get('model.inclusionCriteria');

            let postData = {
                baseCriteria: {
                    encounterCriteria: [
                    ]
                }
            };

            if (primaryExposure != null && primaryExposure.length > 0) {
                if (primaryExposure.indexOf("<<") === -1 && primaryExposure.indexOf(">>") === -1) {
                    primaryExposure = "<< " + primaryExposure;
                }
                postData.baseCriteria.encounterCriteria.push({
                    "has": true,
                    "conceptECL": primaryExposure
                })
            }

            if (Ember.isPresent(inclusionCriteria)) {
                inclusionCriteria.forEach(function (item){
                    var encounterCriteriaData = {};
                    if(item.ecl !== ""){
                        if(item.ecl.indexOf("<<") === -1 && item.ecl.indexOf(">>") === -1){
                            encounterCriteriaData.conceptECL = "<< " + item.ecl;
                        }
                        else{
                            encounterCriteriaData.conceptECL = item.ecl;
                        }
                        if (item.timeConstraint !== null) {
                            if (item.timeConstraint == "after") {
                                encounterCriteriaData.withinDaysAfterPreviouslyMatchedEncounter = -1;
                            }
                        }
                        encounterCriteriaData.has = item.has;
                        postData.baseCriteria.encounterCriteria.push(encounterCriteriaData);
                    }
                });
            }
            
            if(this.get('model.gender') !== null && this.get('model.gender') !== undefined && this.get('model.gender').length !== 0){
                postData.baseCriteria.gender = this.get('model.gender').toUpperCase();
            }
            if(this.get('model.ageMin') !== null && this.get('model.ageMin') !== undefined){
                postData.baseCriteria.minAgeNow = this.get('model.ageMin');
            }
            if(this.get('model.ageMax') !== null && this.get('model.ageMax') !== undefined){
                postData.baseCriteria.maxAgeNow = this.get('model.ageMax');
            }
            let testOutcome = this.get('model.testOutcome');
            let testVariable = this.get('model.testVariable');
            var loading = this.get('loading');
            var error = this.get('error');
            if (Ember.isPresent(testOutcome)) {

                var treatmentCriterion = {

                }
                if (testVariable.includeDaysInFuture != '*') {
                    treatmentCriterion.withinDaysBeforePreviouslyMatchedEncounter = testVariable.includeDaysInFuture;
                }
                treatmentCriterion.conceptECL = testVariable.ecl.indexOf("<<") === -1 && testVariable.ecl.indexOf(">>") === -1 ? "<<" + testVariable.ecl : testVariable.ecl;

                var negativeOutcomeCriterion = {

                }
                if (testOutcome.includeDaysInFuture != '*') {
                    negativeOutcomeCriterion.withinDaysBeforePreviouslyMatchedEncounter = testOutcome.includeDaysInFuture;
                }
                negativeOutcomeCriterion.conceptECL = testOutcome.ecl.indexOf("<<") === -1 && testOutcome.ecl.indexOf(">>") === -1 ? "<<" + testOutcome.ecl : testOutcome.ecl;


                postData.treatmentCriterion = treatmentCriterion;
                postData.negativeOutcomeCriterion = negativeOutcomeCriterion;
                this.get('ajax').post(
                    '/health-analytics-api/statistical-correlation-report',
                    {
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify(postData)
                    })
                    .then((result) => {
                        this.set('loading', false);
                        this.set('model.cohortData', result);
                    }).catch(function(error) {
                        if (isServerError(error)) {
                            loading = false;
                            error = 'There has been a problem with your request - please check your input.';
                            // handle 5xx errors here
                            return;
                        }
                        // other errors are handled elsewhere
                        throw error;
                    });
            } else {
                this.get('ajax').post(
                    '/health-analytics-api/cohorts/select',
                    {
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify(postData.baseCriteria)
                    })
                    .then((result) => {
                        result.totalElementsFormatted = result.totalElements.toLocaleString();
                        this.set('loading', false);
                        this.set('model.cohortData', result);
                    })
                    .catch(function(error) {
                        if (isServerError(error)) {
                            Ember.set(loading, false);
                            Ember.set(error, 'There has been a problem with your request - please check your input.');
                            // handle 5xx errors here
                            return;
                        }
                        // other errors are handled elsewhere
                        throw error;
                    });
                this.set('loading', loading); 
                this.set('error', error);
            }
        },
        updateGender(){
            console.log(this);
        },
    }
});