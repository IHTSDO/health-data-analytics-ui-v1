import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    namespace: 'api',
    pathForType(type) {
        return Ember.String.dasherize(type) + 's';
    }
});
