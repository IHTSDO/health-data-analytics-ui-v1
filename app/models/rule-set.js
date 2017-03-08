import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr(),
    rootRule: DS.hasMany('rule')
    // rootRule: DS.belongsTo('rule')
});
