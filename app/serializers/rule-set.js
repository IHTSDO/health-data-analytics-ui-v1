import DS from 'ember-data';

export default DS.JSONSerializer.extend(
    DS.EmbeddedRecordsMixin,{
        attrs: {
            rootRule: {embedded: 'always'}
        },
        normalizeArrayResponse(store, clazz, payload) {
            // payload.id = id();
            payload.forEach(function (item) {
                addId(item.rootRule);
            });
            return this._super(store, clazz, payload);
        },
        normalizeSingleResponse(store, clazz, payload) {
            addId(payload.rootRule);
            return this._super(store, clazz, payload);
        }
    }
);

function addId(rule) {
    rule.id = randomId();
}

// Generates an identifier that looks like a UUID
function randomId() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
