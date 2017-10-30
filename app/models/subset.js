import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    ecl: DS.attr(),
    description: DS.attr(),

    // Transient - created from eclModel
    eclObjects: DS.attr()
});
