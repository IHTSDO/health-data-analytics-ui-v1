export default function() {

    this.namespace = '/health-analytics-api';

    // let subsets = [
    //     {
    //         id: 'one',
    //         name: 'One',
    //         eclModel: '{ "focusConcepts": [{"conceptId":"51774004"}, {"conceptId":"456"}] }'
    //     }
    // ];

    // this.get('/subsets', function() {
    //     return subsets;
    // });
    //
    // this.get('subsets/:id', function (db, request) {
    //     return subsets.find((subset) => request.params.id === subset.id);
    // });

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
