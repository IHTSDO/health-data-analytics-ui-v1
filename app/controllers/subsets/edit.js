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
        addFocusConcept() {
            this.get("model.eclObjects.focusConcepts").pushObject({conceptId: ""});
        },
        saveSubset() {
            console.log("saveSubset");
            console.log(this.get("model"));
//            this.set('saving', true);
//            this.get('ajax').post('/health-analytics-api/subsets',
//                {
//                    contentType: 'application/json; charset=utf-8',
//                    data: JSON.stringify(this.get("model"))
//                })
//                .then((result) => {
//                    this.set('saving', false);
//                    this.set('model', result);
//                });
        },
          setValue(model, event) {
            model = event.target.value;
          },
        loadValue(model, event) {
            event.target.value = model;
          }
    }
});
