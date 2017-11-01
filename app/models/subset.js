import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr(),
    ecl: DS.attr(),
    eclModel: DS.attr(),

    // Transient - created from eclModel
    eclObjects: DS.attr(),
    eclOption: DS.attr(),
    operatorOptions : DS.attr()
});
