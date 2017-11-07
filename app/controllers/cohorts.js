import Ember from 'ember';

export default Ember.Controller.extend({
    ajax: Ember.inject.service(),
    loading: false,
    init: function() {
        this._super();
        this.get('ajax').request('health-analytics-api/stats')
            .then((result) => {
                this.set('stats', result);
            });
    },
    toECL: function (conceptString) {
        if (conceptString.indexOf('|') !== -1) {
            // Has label
            // Strip and label and convert to descendants and self
            return "<<" + conceptString.split(" ")[0];
        } else {
            // Assume ECL already
            return conceptString;
        }
    },
    
    actions: {
        fetchCohort() {
            this.set('loading', true);
            console.log(this.get('model'));
            var gender;
            let primaryExposure = this.get('model.primaryExposure');
            let primaryExposureECL = this.toECL(primaryExposure);
            this.set('model.gender', $('#genderSelect').find(":selected").text());
            if(this.get('model.gender') !== null && this.get('model.gender') !== undefined){
                gender = this.get('model.gender').toUpperCase();
            }

            let inclusionCriteria = this.get('model.inclusionCriteria');
            console.log("inclusionCriteria = " + inclusionCriteria);

            let inclusionCriteriaData = null;
            let postData = null;
            if (Ember.isPresent(inclusionCriteria)) {
                if(inclusionCriteria.indexOf("<<") === -1 && inclusionCriteria.indexOf(">>") === -1){
                    inclusionCriteria = "<< " + inclusionCriteria;
                }
                inclusionCriteriaData = {
                    ecl: this.toECL(inclusionCriteria),
                };
                if(this.get('model.includeDaysInPast') !== null && this.get('model.includeDaysInPast') !== undefined){
                    inclusionCriteriaData.includeDaysInPast = this.get('model.includeDaysInPast');
                }
                if(this.get('model.includeDaysInFuture') !== null && this.get('model.includeDaysInFuture') !== undefined){
                    inclusionCriteriaData.includeDaysInFuture = this.get('model.includeDaysInPast');
                }
            }
            console.log("fetch cohort for " + primaryExposureECL + " with inclusionCriteria" + inclusionCriteriaData);
            if(primaryExposure.indexOf("<<") === -1 && primaryExposure.indexOf(">>") === -1){
                primaryExposure = "<< " + primaryExposure;
            }
            postData = {
                    primaryCriterion:  {
                        "ecl": primaryExposure
                      },
                    inclusionCriteria: inclusionCriteriaData
                };
            if(this.get('model.gender') !== null && this.get('model.gender') !== undefined && this.get('model.gender').length !== 0){
                postData.gender = this.get('model.gender').toUpperCase();
            }
            if(this.get('model.ageMin') !== null && this.get('model.ageMin') !== undefined){
                postData.minAge = this.get('model.ageMin');
            }
            if(this.get('model.ageMax') !== null && this.get('model.ageMax') !== undefined){
                postData.maxAge = this.get('model.ageMax');
            }
            var data = 
            this.get('ajax').post('/health-analytics-api/cohorts/select', {
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(postData)})
                .then((result) => {
                    this.set('loading', false);
                    this.set('model.cohortData', result);
                });
        },
        updateGender(){
            console.log(this);
        },
    }
});