import DS from 'ember-data';

export default DS.JSONSerializer.extend(
    DS.EmbeddedRecordsMixin, {
        normalizeArrayResponse(store, clazz, payload) {
            payload = payload.content;
            payload.forEach(function (item) {
                item.eclOption = [
                    {
                        name:'Self',
                        value:''
                    },
                    {
                        name:'Descendant of',
                        value:'<'
                    },
                    {
                        name:'Descendant of or self',
                        value:'<<'
                    }
                ];
                if(item.eclModel !== null && item.eclModel !== "")
                    {
                        item.eclObjects = JSON.parse(item.eclModel);
                    }
                
            });
            return this._super(store, clazz, payload);
        },
        normalizeSingleResponse(store, clazz, item) {
            item.eclOption = [
                    {
                        name:'Self',
                        value:''
                    },
                    {
                        name:'Descendant of',
                        value:'<'
                    },
                    {
                        name:'Descendant of or self',
                        value:'<<'
                    }
            ];
            item.eclObjects = JSON.parse(item.eclModel);
            return this._super(store, clazz, item);
        }
    }
);
