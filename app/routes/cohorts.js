import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.get('store').findAll('cohort');
        // return Ember.$.getJSON('https://gist.githubusercontent.com/kaicode/49a0e1a00e61dc3f57332f3fe0d47cf6/raw/1997bca229ce70583fa37549569e7658a5a422ef/json-api-example.json');
        // return ['Marie Curie', 'Mae Jemison', 'Albert Hofmann'];
    }
});
