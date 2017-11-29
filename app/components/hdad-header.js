import Ember from 'ember';
import {isAjaxError, isNotFoundError, isForbiddenError, isServerError} from 'ember-ajax/errors';

export default Ember.Component.extend({
    ajax: Ember.inject.service(),
    init: function() {
        this._super();
        this.get('ajax').request('/ims-api/account')
            .then((result) => {
        }).catch(function(error) {
            if (isForbiddenError(error)) {
                location.href = '/login?serviceReferer=' + encodeURI(location.href);
              // handle 403 errors here
              return;
            }
            if (isServerError(error)) {
                location.href = '/login?serviceReferer=' + encodeURI(location.href);
              // handle 5xx errors here
              return;
            }ServerError
            // other errors are handled elsewhere
            throw error;
          });
    }
});
