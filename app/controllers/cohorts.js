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
            let primaryExposure = this.get('model.primaryExposure');
            let primaryExposureECL = this.toECL(primaryExposure);
            let gender = this.get('model.gender').toUpperCase();
            let ageMin = this.get('model.ageMin');
            let ageMax = this.get('model.ageMax');

            let inclusionCriteria = this.get('model.inclusionCriteria');
            console.log("inclusionCriteria = " + inclusionCriteria);

            let inclusionCriteriaData = null;
            if (Ember.isPresent(inclusionCriteria)) {
                inclusionCriteriaData = {
                    selectionECL: this.toECL(inclusionCriteria),
                    includeDaysInPast: this.get('model.includeDaysInPast'),
                    includeDaysInFuture: this.get('model.includeDaysInFuture')
                };
            }

            console.log("fetch cohort for " + primaryExposureECL + " with inclusionCriteria" + inclusionCriteriaData);
            this.get('ajax').post('/health-analytics-api/cohorts/select', {
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({
                    gender: gender,
                    minAge: ageMin,
                    maxAge: ageMax,
                    primaryExposure:  {
    "ecl": "<< " + primaryExposure
  },
                    inclusionCriteria: inclusionCriteriaData
                })})
                .then((result) => {
                    this.set('loading', false);
                    this.set('model.cohortData', result);
                });
        }
    }
});
