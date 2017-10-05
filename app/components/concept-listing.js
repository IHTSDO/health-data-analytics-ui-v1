import Ember from 'ember';

export default Ember.Component.extend({
    ajax: Ember.inject.service(),
    conceptFsn: null,
    conceptId: null,
    filteredList: null,
    init: function() {
        this._super();
        let conceptId = this.get('conceptId');
        if (!Ember.isBlank(conceptId)) {
            console.log("concept list component, fetching fsn " + conceptId);
            this.get('ajax').request('/health-analytics-api/concepts/' + conceptId)
                .then((concept) => {
                    this.set('conceptFsn', concept.fsn);
                })
                .catch((concept) => {
                    this.set('conceptFsn', conceptId);
                });
        }
    },
    actions: {
        autoComplete(param) {
            if(param !== "") {
                this.get('ajax').request('/health-analytics-api/concepts', {data: {prefix: param}})
                    .then((result) => {
                    this.set('filteredList', result);
                });
            }
            else {
                this.set('filteredList').clear();
            }
        },
        choose(concept) {
            this.set('conceptFsn', concept.fsn);
            this.set('conceptId', concept.id);
            this.set('filteredList', null);
            // Call parent choose action
            this.get('choose')(this.set('filter', concept.id));
        }
    }
});
