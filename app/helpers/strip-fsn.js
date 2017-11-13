import Ember from 'ember';

export function stripFsn(fsn) {
        return fsn[0].replace(/ *\([^)]*\) */g, "");
}

export default Ember.Helper.helper(stripFsn);