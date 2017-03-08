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
                "chance" : 1.0//,
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
