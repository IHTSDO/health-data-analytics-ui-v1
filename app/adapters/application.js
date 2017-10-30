import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
    namespace: 'health-analytics-api',
    pathForType(type) {
        return Ember.String.dasherize(type) + 's';
    }
});

export default DS.JSONAPIAdapter.extend({
  handleResponse(status, headers, payload, requestData) {
    if(status === 403) {
        var current = window.location;
        window.location.replace("https://ims.ihtsdotools.org/#/login?serviceReferer=" + current);
    }

    return this._super(status, headers, payload, requestData);
  }
});
