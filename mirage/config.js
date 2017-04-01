export default function() {

    this.namespace = '/api';

    this.get('/cohorts', function() {
        return [
            {
                id: 'type-1-diabetes',
                title: 'Type 1 Diabetes',
            },
            {
                id: 'type-2-diabetes',
                title: 'Type 2 Diabetes',
            },
            {
                id: 'males-over-80',
                title: 'Males over 80',
            }
        ];
    });

    let ruleSets = [
        {
            id: 'set-1',
            title: '30-85 10% Diabetes',
            rootRule: {
                "id" : "9f46a56c-81a9-43f5-8a3e-100a5e318991",
                "chance" : 1.0,
                "independentChildren" : [ {
                    "id" : "ebf4fa05-47f8-43fa-ae8d-d7bb67f0968a",
                    "chance" : 0.1,
                    "operation" : {
                        "conceptId" : "420868002 | Disorder due to type 1 diabetes mellitus"
                    },
                    "independentChildren" : [ {
                        "id" : "a19d3995-0b79-4b90-80a2-a7efc8dbcaaf",
                        "chance" : 0.07,
                        "operation" : {
                            "conceptId" : "302226006 | Peripheral Neuropathy"
                        }
                    }, {
                        "id" : "2f0c368c-4c3b-4335-a55b-f9f3bde787cb",
                        "chance" : 0.1,
                        "operation" : {
                            "conceptId" : "22298006 | Myocardial Infarction"
                        }
                    } ],
                    "otherwise" : {
                        "id" : "cee04cbd-25e0-47f8-b11b-337e3d71c1b7",
                        "chance" : 0.01,
                        "operation" : {
                            "conceptId" : "302226006 | Peripheral Neuropathy"
                        }
                    }
                }, {
                    "id" : "557834e2-7e5b-4666-a934-18c54bf2649e",
                    "clauses" : [ {
                        "property" : "age",
                        "comparator" : "GREATER",
                        "value" : "40"
                    } ],
                    "chance" : 0.3,
                    "operation" : {
                        "conceptId" : "38341003 | Hypertension"
                    }
                }, {
                    "id" : "f5d7afd0-2c73-4db2-a16e-147af18fdf4b",
                    "chance" : 0.08,
                    "operation" : {
                        "conceptId" : "22298006 | Myocardial Infarction"
                    }
                }, {
                    "id" : "bb600dbd-6875-4ed3-86c3-105daf0a18a1",
                    "clauses" : [ {
                        "property" : "age",
                        "comparator" : "GREATER",
                        "value" : "55"
                    } ],
                    "chance" : 0.05,
                    "operation" : {
                        "conceptId" : "22298006 | Myocardial Infarction"
                    }
                } ]
            }
        }
        ];


    this.get('/rule-sets', function() {
        return ruleSets;
    });

    // Find and return the provided rule-set from our rule-set list above
    this.get('/rule-sets/:id', function (db, request) {
        return ruleSets.find((ruleSet) => request.params.id === ruleSet.id);
    });

    this.passthrough();

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.2.x/shorthands/
  */
}
