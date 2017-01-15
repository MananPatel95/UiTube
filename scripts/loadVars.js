var lightsOffV;
var lightsOffOpacityV;
var lightsOffDelayV;
var tabsV;
var tabsInfoV;
var tabsCommentsV;
var searchOnSamePageV;
var volumeControlV;
var volumeControlStepsV;
var tagsV;
var extUpdated;
var volume;
var Annotation;

/**
 * init some vars
 */
loadVars();

function loadVars() {
    chrome.storage.local.get(null, function (obj) {
        console.log(obj);
        //Load Variables
        lightsOffV = checkForUndefined(obj.LightsOff, 1);
        lightsOffOpacityV = checkForUndefined(obj.LightsOffOpacity, 90);
        lightsOffDelayV = checkForUndefined(obj.LightsOffDelay, 2);
        tabsV = checkForUndefined(obj.Tabs, 1);
        tabsInfoV = checkForUndefined(obj.TabsInfo, 1);
        tabsCommentsV = checkForUndefined(obj.TabsComments, 1);
        searchOnSamePageV = checkForUndefined(obj.SearchOnSamePage, 1);
        volumeControlV = checkForUndefined(obj.VolumeControl, 1);
        tagsV = checkForUndefined(obj.Tags, 1);
        extUpdated = checkForUndefined(obj.ExtUpdated, 1);
        volume = checkForUndefined(obj.Volume, 50);
        Annotation = checkForUndefined(obj.Annotaion,1);
        volumeControlStepsV = checkForUndefined(obj.volumeControlStepsV,5);
       afterVarsLoad();
    });
}

function checkForUndefined(variable, defaultVal) {
    var returnVar;
    if (typeof variable === 'undefined')
        returnVar = defaultVal;
    else
        returnVar = variable;

    return returnVar;

}