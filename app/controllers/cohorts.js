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
    actions: {
        chooseConcept(concept) {
            console.log(concept);
            this.set('concept', concept);
        },
        fetchCohort() {
            let concept = this.get('concept');
            console.log("fetch cohort for " + concept);
            this.set('loading', true);
            this.get('ajax').request('/api/cohort', {data: {ecl: "<<" + concept.split(" ")[0]}})
                .then((result) => {
                    this.set('loading', false);
                    this.set('cohortData', result);
                    result.aggregations.asMap.patient_birth_dates.buckets.reverseObjects();
                    var patientBirthDateValues = result.aggregations.asMap.patient_birth_dates.buckets.map(function(item) {
                        return {label: new Date().getFullYear() - item.key.year, value: item.docCount};
                    });
                    this.set('patientBirthDateValues', patientBirthDateValues);
                });
        }
    }
});
