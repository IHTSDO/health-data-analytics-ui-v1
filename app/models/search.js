import DS from 'ember-data';

export default DS.Model.extend({
    gender: DS.attr(),
    ageMin: DS.attr(),
    ageMax: DS.attr(),
    primaryExposure: DS.attr(),
    primaryLimitation: DS.attr(),
    inclusionCriteria: DS.attr(),
    includeDaysInPast: DS.attr(),
    includeDaysInFuture: DS.attr(),
    cohortData: DS.attr(),
});

                