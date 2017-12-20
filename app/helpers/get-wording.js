import Ember from 'ember';

export function getWording(typeId) {
        var disorder = "64572001";
        var product = "373873005";
        var procedure = "71388002";
        var conceptType = typeId[0];
        var useType = typeId[1];
        if(conceptType === disorder && useType === "past")
            {
                return "had";
            }
        else if(conceptType === disorder && useType === "and")
            {
                return "developed";
            }
        else if(conceptType === disorder && useType === "present")
            {
                return "have";
            }
        else if(conceptType === disorder && useType === "verb")
            {
                return "developing";
            }
        else if(conceptType === product && useType === "past")
            {
                return "took";
            }
        else if(conceptType === product && useType === "and")
            {
                return "had taken";
            }
        else if(conceptType === product && useType === "present")
            {
                return "take";
            }
        else if(conceptType === product && useType === "verb")
            {
                return "taking";
            }
        else if(conceptType === procedure && useType === "past")
            {
                return "had undergone";
            }
        else if(conceptType === procedure && useType === "and")
            {
                return "also underwent";
            }
        else if(conceptType === procedure && useType === "present")
            {
                return "underwent";
            }
        else if(conceptType === procedure && useType === "verb")
            {
                return "undergoing";
            }
        else{return "";}
}

export default Ember.Helper.helper(getWording);
