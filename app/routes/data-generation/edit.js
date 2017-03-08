import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return this.get('store').findRecord('rule-set', params.rule_set_id);
    }
});
