import Ember from 'ember';

export default Ember.Controller.extend({
    ajax: Ember.inject.service(),
    actions: {
        addSubset(model) {
            var newSubset = {
                name:"New Subset",
                description:"",
                ecl:"",
                eclModel:"",
                eclOption: [
                    {
                        name:'Self',
                        value:''
                    },
                    {
                        name:'Descendant of',
                        value:'<'
                    },
                    {
                        name:'Descendant of or self',
                        value:'<<'
                    }
                ],
                operatorOptions: [
                    {
                        name:'Or',
                        value:'OR'
                    },
                    {
                        name:'And',
                        value:'AND'
                    },
                    {
                        name:'Minus',
                        value:'MINUS'
                    }
                ],
                eclObjects: [
                    {
                        "operator": "",
                        "ecl": "<<",
                        "focusConcept": {
                            "id": "*",
                            "fsn": "Any"
                        },
                        "refinements": [{
                            "type": {
                                "id": "*",
                                "fsn": "Any",
                                "ecl": "<<"
                            },
                            "target": {
                                "id": "*",
                                "fsn": "Any",
                                "ecl": "<<"
                            }
                        }]

                    }
                ]
            }
            var ecl = "";
            var eclObjects = newSubset.eclObjects;
            eclObjects.forEach(function(item){
                if(item.refinements.length > 0)
                    {
                        ecl = ecl + "(";
                    }
                ecl = ecl + " " + item.operator + " ";
                ecl = ecl + item.ecl + " ";
                ecl = ecl + item.focusConcept.id;
                item.refinements.forEach(function(refinement){
                    if(refinement === item.refinements[0])
                        {
                            ecl = ecl + " : ";
                        }
                    else{
                            ecl = ecl + " , ";
                        }
                    ecl = ecl + refinement.type.ecl + " ";
                    ecl = ecl + refinement.type.id + " = ";
                    ecl = ecl + refinement.target.ecl + " ";
                    ecl = ecl + refinement.target.id;
                });
                if(item.refinements.length > 0)
                    {
                        ecl = ecl + ")";
                    }
            });
            
            
            this.set('saving', true);
            var postData = {
                description : newSubset.name,
                name : newSubset.name,
                eclModel : JSON.stringify(newSubset.eclObjects),
                ecl : ecl
            }
            this.get('ajax').post('/health-analytics-api/subsets',
                {
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(postData)
                })
                .then((result) => {
                this.get('target.router').refresh();
                    this.set('saving', false);
                    this.transitionToRoute('subsets.edit', result.id);
                });
        },
        addEclObject() {
            this.get("model.eclObjects").pushObject(
                {
                    "operator": "OR",
                    "ecl": "<<",
                    "focusConcept": {
                        "id": "*",
                        "fsn": "Any"
                    },
                    "refinements": [{
                        "type": {
                            "id": "*",
                            "fsn": "Any",
                            "ecl": "<<"
                        },
                        "target": {
                            "id": "*",
                            "fsn": "Any",
                            "ecl": "<<"
                        }
                    }]

                }
            );
        },
        addRefinement(model){
            model.pushObject(
                {
                    "type": {
                        "id": "*",
                        "fsn": "Any",
                        "ecl": "<<"
                    },
                    "target": {
                        "id": "*",
                        "fsn": "Any",
                        "ecl": "<<"
                    }
                }
            );
        },
    }
});
