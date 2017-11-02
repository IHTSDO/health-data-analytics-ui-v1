import Ember from 'ember';

export default Ember.Controller.extend({
    ajax: Ember.inject.service(),
    actions: {
        update() {
            let eclObjects = this.get("model.eclObjects");
            let eclModel = JSON.stringify(eclObjects);
            this.set("model.eclModel", eclModel);

            let ecl = "";
            let focusConcepts = eclObjects.focusConcepts;
            for (let i = 0; i < focusConcepts.length; i++) {
                if (i > 0) {
                    ecl += " OR ";
                }
                ecl += focusConcepts[i].conceptId;
            }

            console.log("ECL - " + ecl);
            this.set("model.ecl", ecl);
        },
        addEclObject() {
            this.get("model.eclObjects").pushObject(
                {
                    "operator": "OR",
                    "ecl": "<<",
                    "focusConcept": {
                        "id": "",
                        "fsn": "Any"
                    },
                    "refinements": [{
                        "type": {
                            "id": "",
                            "fsn": "Any",
                            "ecl": "<<"
                        },
                        "target": {
                            "id": "",
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
                        "id": "",
                        "fsn": "Any",
                        "ecl": "<<"
                    },
                    "target": {
                        "id": "",
                        "fsn": "Any",
                        "ecl": "<<"
                    }
                }
            );
        },
        saveSubset() {
            var ecl = "";
            var eclObjects = this.get("model.eclObjects");
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
                description : this.get("model.name"),
                name : this.get("model.name"),
                eclModel : JSON.stringify(this.get("model.eclObjects")),
                ecl : ecl
            }
            this.get('ajax').delete('/health-analytics-api/subsets/' + this.get("model.id"))
                .then(() => {
                });
            this.get('ajax').post('/health-analytics-api/subsets',
                {
                    contentType: 'application/json; charset=utf-8',
                    data: JSON.stringify(postData)
                })
                .then((result) => {
                    this.store.deleteRecord(this.get('model'));
                    this.set('saving', false);
                this.get('target.router').refresh();
                    this.transitionToRoute('subsets.edit', result.id);
                });
            
            
        },
        deleteSubset() {
            this.set('saving', true);
            this.get('ajax').delete('/health-analytics-api/subsets/' + this.get("model.id"))
                .then((result) => {
                    this.set('saving', false);
                this.store.deleteRecord(this.get('model'));
            this.get('target.router').refresh();
                });
            
            this.transitionToRoute('subsets');
        },
        deleteRefinement(index, refinements) {
            refinements.removeAt(index);
        },
        deleteFocusConcept(index, eclObjects) {
            eclObjects.removeAt(index);
        },
          updateValue(model) {
               console.log(model);
            model = event.target.value;
              console.log(this.get("model"));
          },
    }
});
