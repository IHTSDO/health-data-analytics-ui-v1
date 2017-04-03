import Ember from 'ember';

export default Ember.Component.extend({
    ajax: Ember.inject.service(),
    filter: null,
    filteredList: null,
    actions: {
        autoComplete(param) {
            if(param !== "") {
                this.get('ajax').request('/api/concepts', {data: {prefix: param}})
                    .then((result) => {
                    this.set('filteredList', result);
                });
            }
            else {
                this.set('filteredList').clear();
            }
        },
        choose(concept) {
            this.set('filter', concept.id + " | " + concept.fsn);
            this.set('filteredList', null);
            // Call parent choose action
            this.get('choose')(this.get('filter'));
        }
    }
});
