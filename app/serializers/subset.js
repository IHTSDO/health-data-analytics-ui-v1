import DS from 'ember-data';

export default DS.JSONSerializer.extend(
    DS.EmbeddedRecordsMixin, {
        normalizeArrayResponse(store, clazz, payload) {
            payload = payload.content;
            payload.forEach(function (item) {
                item.eclObjects = JSON.parse(item.eclModel);
            });
            return this._super(store, clazz, payload);
        },
        normalizeSingleResponse(store, clazz, item) {
            item.eclObjects = JSON.parse(item.eclModel);
            return this._super(store, clazz, item);
        }
    }
);
