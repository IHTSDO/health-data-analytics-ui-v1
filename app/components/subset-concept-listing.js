import Ember from 'ember';
import {isAjaxError, isNotFoundError, isForbiddenError} from 'ember-ajax/errors';

export default Ember.Component.extend({
    ajax: Ember.inject.service(),
    conceptFsn: null,
    conceptId: null,
    filteredList: null,
    mrcmType: null,
    mrcmTarget: null,
    parentId: null,
    typeId: null,
    init: function() {
        this._super();
        let conceptId = this.get('conceptId');
        let mrcmType = this.get('mrcmType');
        let mrcmTarget = this.get('mrcmTarget');
        let typeId = this.get('typeId');
        if (!Ember.isBlank(conceptId)) {
            if(conceptId !== '*'){
                console.log("concept list component, fetching fsn " + conceptId);
                this.get('ajax').request('/health-analytics-api/concepts/' + conceptId)
                    .then((concept) => {
                        this.set('conceptFsn', concept.fsn);
                    })
                    .catch(() => {
                        this.set('conceptFsn', conceptId);
                    });
            }
        }
    },
    actions: {
        autoComplete(param) {
            var run = function(scope) {
                    if(param !== "" && param !== '*' && scope.get('mrcmType') === null && (scope.get('typeId') === null || scope.get('typeId') === '*')) {
                            scope.get('ajax').request('/health-analytics-api/concepts', {data: {prefix: param}})
                                .then((result) => {
                                var list = {};
                                var any = {};
                                any.fsn = "Any";
                                any.id = "*";
                                any.subset = true;
                                var filteredSubsets = [];
                                filteredSubsets.push(any);
                                list.items= filteredSubsets.concat(result.items);
                                scope.set('filteredList', list);
                            });
                        }
                        else if(scope.get('mrcmType') && scope.get('parentId') === null || scope.get('parentId') === '*'){
                            scope.get('ajax').request('/health-analytics-api/concepts?ecQuery=%3C%20410662002&limit=50')
                                .then((result) => {
                                var filteredAttrs = [];
                                result.items.forEach(function(item){
                                    if(item.fsn.toLowerCase().indexOf(param.toLowerCase()) !== -1){
                                        filteredAttrs.push(item);
                                    }
                                });
                                var list = {};
                                var any = {};
                                any.fsn = "Any";
                                any.id = "*";
                                any.subset = true;
                                var filteredSubsets = [];
                                filteredSubsets.push(any);
                                list.items= filteredSubsets.concat(filteredAttrs);
                                console.log(list);
                                scope.set('filteredList', list);
                            }).catch(function(response, jqXHR, payload) {
                                console.log(response);
                                if (isNotFoundError(error)) {
                                  // handle 404 errors here
                                  return;
                                }

                                if (isForbiddenError(error)) {
                                    location.href = '/login?serviceReferer=' + encodeURI(location.href);
                                  // handle 403 errors here
                                  return;
                                }

                                if(isAjaxError(error)) {
                                    console.log('broken');
                                  // handle all other AjaxErrors here
                                  return;
                                }

                                // other errors are handled elsewhere
                                throw error;
                              });
                        }
                        else if(scope.get('mrcmTarget') && scope.get('typeId') !== null && scope.get('typeId') !== '*'){
                            scope.get('ajax').request('/mrcm/attribute-values/'+scope.get('typeId')+'?termPrefix='+ param + '*&expand=fsn()&offset=0&limit=50')
                                .then((result) => {
                                var filteredAttrs = [];
                                result.items.forEach(function(item){
                                    item.fsn = item.fsn.term;
                                    item.id = item.id;
                                    if(item.fsn.toLowerCase().indexOf(param.toLowerCase()) !== -1){
                                        filteredAttrs.push(item);
                                    }
                                });
                                var list = {};
                                var any = {};
                                any.fsn = "Any";
                                any.id = "*";
                                any.subset = true;
                                var filteredSubsets = [];
                                filteredSubsets.push(any);
                                list.items= filteredSubsets.concat(filteredAttrs);
                                scope.set('filteredList', list);
                            });
                        }
                        else if(scope.get('mrcmType') && scope.get('parentId')){
                            scope.get('ajax').request('/mrcm/domain-attributes?parentIds=' + scope.get('parentId') + '&expand=fsn()&offset=0&limit=50')
                                .then((result) => {
                                var filteredAttrs = [];
                                result.items.forEach(function(item){
                                    item.fsn = item.fsn.term;
                                    item.id = item.id;
                                    if(item.fsn.toLowerCase().indexOf(param.toLowerCase()) !== -1){
                                        filteredAttrs.push(item);
                                    }
                                });
                                var list = {};
                                var any = {};
                                any.fsn = "Any";
                                any.id = "*";
                                any.subset = true;
                                var filteredSubsets = [];
                                filteredSubsets.push(any);
                                list.items= filteredSubsets.concat(filteredAttrs);
                                console.log(list);
                                scope.set('filteredList', list);
                            }).catch(function(error) {
                                if (isForbiddenError(error)) {
                                    location.href = '/login?serviceReferer=' + encodeURI(location.href);
                                  // handle 403 errors here
                                  return;
                                }
                                // other errors are handled elsewhere
                                throw error;
                              });
                        }
                };
            if(param.length >= 3)
                {
                    clearTimeout(this.timeout);
                    var scope = this;
                    this.timeout = setTimeout(function () {
                        run(scope);
                    }, 2000);
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