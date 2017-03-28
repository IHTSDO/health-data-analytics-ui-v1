import DS from 'ember-data';

export default DS.Model.extend({
    chance: DS.attr(),
    independentChildren: DS.hasMany('rule'),
    operation: DS.attr()
    // exclusiveChildren: DS.hasMany('rule'),
});
