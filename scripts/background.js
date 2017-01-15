"use strict";
 
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type == 'GET_URL') {
        getTabUrl();
 
        if (localStorage['tab_url'] !== undefined) sendResponse({
            url: localStorage['tab_url']
        });
    }
});
 
function getTabUrl() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        if (tabs[0] !== undefined) localStorage['tab_url'] = tabs[0].url;
    });
}
 
function searchOnYoutube(info) {
    var txt = info.selectionText;
    chrome.tabs.create({
        url: "http://www.youtube.com/results?search_query=" + txt
    })
}
chrome.contextMenus.create({
    title: 'Search YouTube for "%s"',
    contexts: ["selection"],
    onclick: searchOnYoutube
});