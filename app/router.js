import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: 'auto',
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('cohorts');
  this.route('subsets', function() {
      this.route('edit', { path: '/:subset_id' });
  });
});

export default Router;
