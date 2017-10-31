import Ember from 'ember';

export default Ember.Route.extend({
    ajax: Ember.inject.service(),
    model() {
        var subsets = [];
        this.get('ajax').request('/health-analytics-api/subsets?page=0&size=100')
            .then((results) => {
            console.log(results);
                subsets = results.content;
            })
            .catch((results) => {
                subsets = results.content;
            });
        return subsets;
    }
});
