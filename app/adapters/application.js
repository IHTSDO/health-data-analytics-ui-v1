import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    namespace: 'health-analytics-api',
    pathForType(type) {
        return Ember.String.dasherize(type) + 's';
    }
});
