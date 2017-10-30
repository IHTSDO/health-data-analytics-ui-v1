import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL,
    model(params) {
    return this.get('store').findAll('privileged-model');
  },
  actions: {
    error(error, transition) {
      if (error.status === '403') {
        this.replaceWith('login');
      } else {
        // Let the route above this handle the error.
        return true;
      }
    }
  }
});

Router.map(function() {
  this.route('cohorts');
  this.route('subsets', function() {
      this.route('edit', { path: '/:subset_id' });
  });
});

export default Router;
