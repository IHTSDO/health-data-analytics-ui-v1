import DS from 'ember-data';

export default DS.Model.extend({
    chance: DS.attr()
    // operation: DS.attr(),
    // exclusiveChildren: DS.hasMany('rule'),
    // independentChildren: DS.hasMany('rule')
});
