import Ember from 'ember';

export default Ember.Route.extend({
    ajax: Ember.inject.service(),
    model() {
        return {
            concept: null,
            cohortData: null,
            cohorts: this.get('store').findAll('cohort')
        };
    }
});
