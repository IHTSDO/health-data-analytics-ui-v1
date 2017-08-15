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
            this.send("fetchCohort");
        },
        fetchCohort() {
            let concept = this.get('concept');
            console.log("fetch cohort for " + concept);
            this.set('loading', true);
            this.get('ajax').request('/api/cohort', {data: {ecl: "<<" + concept.split(" ")[0]}})
                .then((result) => {
                    this.set('loading', false);
                    this.set('cohortData', result);
                });
        }
    }
});
