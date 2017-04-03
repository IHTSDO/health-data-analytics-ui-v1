import Ember from 'ember';

export function yearToAge(param) {
  return new Date().getFullYear() - param;
}

export default Ember.Helper.helper(yearToAge);
