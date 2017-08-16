import Ember from 'ember';

export default Ember.Controller.extend({
    ajax: Ember.inject.service(),
    loading: false,
    init: function() {
        this._super();
        this.get('ajax').request('/api/stats')
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
            let primaryExposure = this.get('model.primaryExposure');
            console.log("primaryExposure = " + primaryExposure);
            let primaryExposureECL = this.toECL(primaryExposure);

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
            this.get('ajax').post('/api/cohort', {
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({
                    primaryExposureECL: primaryExposureECL,
                    inclusionCriteria: inclusionCriteriaData
                })})
                .then((result) => {
                    this.set('loading', false);
                    this.set('model.cohortData', result);
                });
        }
    }
});
