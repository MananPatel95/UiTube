"use strict";

window.addEventListener("message", function (event) {
    if (event.source != window) return;
    var player = document.getElementById("movie_player");

    if (event.data.type && (event.data.type == "FROM_CONTENTSCRIPT_VOLUME")) {
        if (player.hasOwnProperty('unMute')) player.unMute();

        if (player.hasOwnProperty('setVolume')) {

            player.setVolume(event.data.value);

        }
    }

}, false);


function main(typeName) {
    var player = document.getElementById("movie_player");
    if (player) {
        if (player.hasOwnProperty('getVolume')) {
            var volume = player.getVolume();
            window.postMessage({
                type: typeName,
                volume: volume
            }, "*");
        }
    }

}
main("FROM_PAGE");

