import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr(),
    rootRule: DS.belongsTo('rule')
    // rootRule: DS.belongsTo('rule')
});
