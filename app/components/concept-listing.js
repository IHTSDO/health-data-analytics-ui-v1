import Ember from 'ember';

export default Ember.Component.extend({
    ajax: Ember.inject.service(),
    conceptFsn: null,
    conceptId: null,
    subsets: null,
    filteredList: null,
    limitedRange: null,
    typeId: null,
    init: function() {
        this._super();
        let conceptId = this.get('conceptId');
        this.get('ajax').request('/health-analytics-api/subsets?page=0&size=100')
            .then((results) => {
                    var subsetArray = [];
                    results.content.forEach(function(item){
                        var subset = {};
                        subset.fsn = item.name;
                        subset.id = item.ecl;
                        subset.subset = true;
                        subsetArray.push(subset);
                    });
                    this.set('subsets', subsetArray);
                
                })
                .catch((results) => {
                    this.set('subsets', results.content);
                });
        
        if (!Ember.isBlank(conceptId)) {
            console.log("concept list component, fetching fsn " + conceptId);
            this.get('ajax').request('/health-analytics-api/concepts/' + conceptId)
                .then((concept) => {
                    this.set('conceptFsn', concept.fsn);
                })
                .catch(() => {
                    this.set('conceptFsn', conceptId);
                });
        }
    },
    actions: {
        autoComplete(param) {
            if(param !== "") {
                if(this.get('limitedRange')) {
                    var range = '<<' + this.get('typeId');
                    if(this.get('typeId') !== ""){
                        this.get('ajax').request('/health-analytics-api/concepts', {data: {prefix: param, ecQuery: range}})
                            .then((result) => {
                            var list = {};
                            var subsets = this.get('subsets');
                            console.log(subsets);
                            var filteredSubsets = [];
                            subsets.forEach(function(item){
                                if(item.fsn.toLowerCase().indexOf(param.toLowerCase()) !== -1){
                                    filteredSubsets.push(item);
                                }
                            });
                            list.items= filteredSubsets.concat(result.items);
                            this.set('filteredList', list);
                        });
                    }
                }
                else{
                    this.get('ajax').request('/health-analytics-api/concepts', {data: {prefix: param}})
                        .then((result) => {
                        var list = {};
                        var subsets = this.get('subsets');
                        var filteredSubsets = [];
                        subsets.forEach(function(item){
                            if(item.fsn.toLowerCase().indexOf(param.toLowerCase()) !== -1){
                                filteredSubsets.push(item);
                            }
                        });
                        list.items= filteredSubsets.concat(result.items);
                        this.set('filteredList', list);
                    });
                }
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
