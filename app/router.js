import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('cohorts', function() {});
  this.route('data-generation', function () {
      this.route('edit', { path: '/:rule_set_id' });
  });
});

export default Router;
