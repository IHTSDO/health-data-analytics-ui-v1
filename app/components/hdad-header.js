import Ember from 'ember';
import {isAjaxError, isNotFoundError, isForbiddenError} from 'ember-ajax/errors';

export default Ember.Component.extend({
    ajax: Ember.inject.service(),
    init: function() {
        this._super();
        this.get('ajax').request('/mrcm/domain-attributes?parentIds=' + this.get('*') + '&expand=fsn()&offset=0&limit=50')
            .then((result) => {
        }).catch(function(error) {
            if (isForbiddenError(error)) {
                location.href = '/login?serviceReferer=' + encodeURI(location.href);
                console.log('403');
              // handle 403 errors here
              return;
            }
            // other errors are handled elsewhere
            throw error;
          });
    }
});
