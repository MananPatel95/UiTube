'use strict';
var volChangeTime;
var searchScrollPos = 0;
var videoScrollPos = 0;
var commentsScrollPos = 0;
var infoScrollPos = 0;

afterNavigate();

window.addEventListener("spfdone", function (e) {
    if ($("#lights-off").length) {
        $("#lights-off").hide();
    }

    afterNavigate();

    // Initialize awsmSearch on another script
    initAwsmSearch();
});

function afterNavigate() {
    if ('/watch' === location.pathname) {
        videoScrollPos = 0;
        commentsScrollPos = 0;
        infoScrollPos = 0;
        makeYoutubeBetter();


    }
}

function makeYoutubeBetter() {
    if (tabsV)
        AddTabPanel();
    hideSearchIcon();
    addPlaylist();
    AddPublishedDateText();
    changeTabPanelHeight();
    if (lightsOffV)
        lightsOff();

    checkCommentsLoaded();
    removeAdds();
    AddAnnotationUI();
    var t = setTimeout(function () {
        onClickTabs();
        clearTimeout(t);
    }, 500);

    //  checkCommentsLoaded();
    if (!(typeof (componentHandler) == 'undefined')) {
        componentHandler.upgradeAllRegistered();
    }

    //detect onScroll content div 
    $('.mdl-layout__content').on('mousewheel', function (e) {
        var event = e.originalEvent,
            d = event.wheelDelta || -event.detail;
        this.scrollTop += (d < 0 ? 1 : -1) * 50;
        window.dispatchEvent(new Event('scroll'));
        e.preventDefault();
    });

    $('.mdl-layout__content').on('scroll', function (e) {
        window.dispatchEvent(new Event('scroll'));
    });
} //End makeYoutubeBetter()

function initVolume() {
    if (volumeControlV) {
        mouseWheelVolumeControl();
        window.postMessage({
            type: "FROM_CONTENTSCRIPT_VOLUME",
            key: 'volume',
            value: volume
        }, "*");
    }

}

//control Volume Using Mouse Wheel
function mouseWheelVolumeControl() {
    var timer;
    var player = document.getElementById("movie_player");
    var $playerApi = $('#player-api');
    var $player = $(player);
    var pid = $playerApi.length ? $playerApi : $player;
    //Add Volume UI
    var UI = '<span id="volumeUI"></span>';
    $(UI).appendTo("#movie_player");

    if (player) {
        pid.on('mousewheel', function (e) {
            if (e.deltaY == 1) {
                console.log(volumeControlStepsV);
                volume = volume >= 100 ? 100 : volume + parseInt(volumeControlStepsV);

            }
            if (e.deltaY == -1) {
                volume = volume <= 0 ? 0 : volume - volumeControlStepsV;

            }
            chrome.storage.local.set({
                Volume: volume
            });
            $("#volumeUI").fadeIn(400);
            $("#volumeUI").text(volume);
            volChangeTime = new Date().getTime();
            clearTimeout(timer);
            timer = setTimeout(function () {
                $("#volumeUI").fadeOut(500);
                clearTimeout(timer);
            }, 1000);
            window.postMessage({
                type: "FROM_CONTENTSCRIPT_VOLUME",
                key: 'volume',
                value: volume
            }, "*");

            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    }
}
//End mouseWheelVolumeControl()


//inject script to youtube
var interval = setInterval(injectScript, 1000);

function injectScript() {
    var player = document.getElementById("movie_player");
    if (player) {
        var link = chrome.extension.getURL('scripts/injectedScript.js');
        $('<script type="text/javascript" src="' + link + '"/>').appendTo($('head'));
        clearInterval(interval);
    }
} //End injectScript()


//listen for events form the injected script
window.addEventListener("message", function (event) {
    if (event.source != window) return;

    if (event.data.type && (event.data.type == "FROM_PAGE")) {
        initVolume();

    }

}, false);



//Add tabs
function AddTabPanel() {
    var tabInfo = '<a href="#scroll-tab-3" id="infoTab" class="mdl-layout__tab"><i class="fa fa-info-circle" aria-hidden="true"></i><span class="tab-title">Info</span></a>';
    var tabComments = ' <a href="#scroll-tab-2" id="commentsTab" class="mdl-layout__tab"><span id="commentsText" class="tab-title"><p class="mdl-\spinner mdl-js-spinner mdl-spinner--single-color is-active" id="commentsSpinner"></p>Comments</span></a>';
    var tabVideos = '<a href="#scroll-tab-1" id="videoTab" class="mdl-layout__tab is-active"><i class="fa fa-film" aria-hidden="true"></i><span class="tab-title">Videos</span></a>';
    var playlist = '<a href="#scroll-tab-5" id="playlistTab" class="mdl-layout__tab"><i class="fa fa-list" aria-hidden="true"></i><span class="tab-title"></span></a>';
    var tabSearch = '<a href="#scroll-tab-4" id="searchTab" class="mdl-layout__tab"><i class="fa fa-search" aria-hidden="true"></i><span class="tab-title"></span></a>';
    var Header = '<header class="mdl-layout__header"><div class="mdl-layout__tab-bar mdl-js-ripple-effect">' + (tabsInfoV == 1 ? tabInfo : "") + '' + (tabsCommentsV == 1 ? tabComments : "") + '' + tabVideos + '' + playlist + '' + tabSearch + '</div></header>';

    var searchResultDiv = '<div id="searchSpinnerContainer">\
     <div class="mdl-spinner mdl-js-spinner is-active" id="searchSpinner"></div></div>\
<div id="searchResultsCont"><div style="margin: 8px 8px 12px 8px;"><span style="color: #919090;font-size: 12px;">Search results for "<span id="searchString" style="color: #6b6b6b;font-style: italic;font-weight: 500;font-size: 14px;"></span>"</span></div><div id="searchResults"></div></div>\
<div id="loadNewResultSpinContainer">\
     <div class="mdl-spinner mdl-js-spinner is-active" id="loadNewResultSpin"></div>\
    </div>';

    var UI = '<div class="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-tabs">' + Header + '<main class="mdl-layout__content scroll scroll1" id= "TabBody">\
    <section class="mdl-layout__tab-panel is-active" id="scroll-tab-1">\
    </section>\
    <section class="mdl-layout__tab-panel" id="scroll-tab-2">\
      <div class="page-content"></div>\
    </section>\
<section class="mdl-layout__tab-panel" id="scroll-tab-3">\
      <div class="page-content"><span class="yt-uix-checkbox-on-off "></div>\
    </section>\
<section class="mdl-layout__tab-panel" id="scroll-tab-5">\
    </section>\
<section class="mdl-layout__tab-panel" id="scroll-tab-4">' + searchResultDiv + '</section></main>\
</div>';


    $(UI).appendTo('#watch7-sidebar-contents');


    $("#watch7-sidebar-modules").appendTo('#scroll-tab-1');

    if (tabsCommentsV)
        $("#watch-discussion").appendTo('#scroll-tab-2');

    if (tabsInfoV)
        $("#action-panel-details").appendTo('#scroll-tab-3');

    $("#watch7-sidebar-contents").css('padding', '0px');

    infiniteScroll();
} //End AddTabPanel()

function hideSearchIcon() {
    if (!$("#results>ol").length) {
        $("#searchTab").hide();
    }

}

function addPlaylist() {
    var currentPlaying = '<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" id="playlistCP">Currently Playing</button>';
    if ($("#watch-appbar-playlist").length) {
        $("#watch-appbar-playlist").appendTo('#scroll-tab-5');

        var t = setTimeout(function () {
            $("body").scrollTo('0px', 400, {
                axis: 'y'
            });

            $("#playlistTab span").click();
            $(currentPlaying).appendTo('.playlist-nav-controls');

            $("#playlistCP").click(function () {
                console.log("hello");
                $("#playlist-autoscroll-list").scrollTo('li.currently-playing', 500, {
                    axis: 'y'
                });
            });
            clearTimeout(t);
        }, 500);
        $("#playlist-autoscroll-list").scrollTo('li.currently-playing', 500, {
            axis: 'y'
        });
    } else {
        $("#playlistTab").hide();
    }


}
//Change Tab Panel Height
function changeTabPanelHeight() {
    var height = $("#watch-header").outerHeight() + $("#player-api").outerHeight() + 204;
    if (height > $(window).height() - 80) {
        $("#watch7-sidebar-contents").height($(window).height() - 90);
        $("#watch-appbar-playlist .playlist-videos-list").height($(window).height() - 212);

    } else {
        $("#watch7-sidebar-contents").height(height);
        $("#watch-appbar-playlist .playlist-videos-list").height(height - 122);
    }


    if ($(window).width() > 1800) {
        $("#watch7-sidebar-contents").width(510);
    } else {
        $("#watch7-sidebar-contents").width(424);
    }


}

// Add published to the title text
function AddPublishedDateText() {
    var UI = '<span id="PublishedDateText">(' + $(".watch-time-text").text() + ')</span>';
    $(UI).appendTo("#eow-title");
}


function removeAdds() {
    $("#watch7-sidebar-ads").css("display", "none");
    $("#watch7-sidebar-offer").css("display", "none");

}

//Turn-Off Lights Automatically 
function lightsOff() {
    var timer;
    var UI = '<div id="lights-off" style ="width: 100%; height: 100%; left: 0px; top: 0px; position: fixed; background-color: rgba(0, 0, 0,' + lightsOffOpacityV / 100 + ');z-index: 10000000000; display:none"></div>';




    $("#player-api").mouseenter(function () {
        if ('/watch' === location.pathname) {
            if (!$("#lights-off").length)
                $(UI).prependTo("body");

            timer = setTimeout(function () {
                fadein();
            }, lightsOffDelayV * 1000);
        }
    });

    $("#player-api").mouseleave(function () {
        if ('/watch' === location.pathname) {
            clearTimeout(timer);
            fadeout();
        }
    });

    function fadein() {

        console.log("fade In");
        $("#player-api").css("z-index", "100000000001");
        $("#lights-off").fadeIn(1000);
        clearTimeout(timer);
    }

    function fadeout() {
        // $("#lights-off").css("display","none");
        $("#player-api").css("z-index", "5");
        console.log("fade out");
        $("#lights-off").fadeOut(600);
    }
} //end lights off

//Add annotation to the player toolbar
function AddAnnotationUI() {
    var myVar = setInterval(function () {

        var UI;
        if (Annotation == 0) {
            UI = '<span id="annotation-label" style="display: none;"></span><div id="settings" class="">\
<input type="checkbox" name="check-3" id="annotation" value="6" class="lcs_check lcs_tt1" checked="checked" autocomplete="off">\
</div>';
        } else {
            UI = '<span id="annotation-label" style="display: none;"></span><div id="settings" class="">\
<input type="checkbox" name="check-1" id="annotation"  value="4" class="lcs_check" autocomplete="off">\
</div>';


            $(".video-annotations, .ytp-iv-player-content").css("display", "none");


        }

        if (!$("#settings").length) {
            $(UI).prependTo(".ytp-right-controls");
            $('#annotation').lc_switch();

        }

        // triggered each time a field is checked
        $('body').delegate('.lcs_check', 'lcs-on', function () {

            $(".video-annotations, .ytp-iv-player-content").css("display", "block");
            chrome.storage.local.set({
                annotation: 1
            }, function () {});
            console.log("annotation on");

        });

        // triggered each time a is unchecked
        $('body').delegate('.lcs_check', 'lcs-off', function () {

            $(".video-annotations, .ytp-iv-player-content").css("display", "none");
            chrome.storage.local.set({
                annotation: 0
            }, function () {});
            console.log("annotation off");

        });


        $("#settings").mouseover(function () {
            $("#annotation-label").css("display", "inline-block");
            $("#annotation-label").text("Annotations");

        });
        $("#settings").mouseout(function () {
            $("#annotation-label").css("display", "none");
        });


        clearInterval(myVar);
    }, 1500);

} //end addAnnotation()

//Write the number of comments on the comments tab title 
function checkCommentsLoaded() {
    var myVar = setInterval(function () {
        if ($(".comment-section-header-renderer").length) {

            $("#commentsText").html('<i class="fa fa-comment" aria-hidden="true"></i> ' + $(".comment-section-header-renderer").text().replace(/\bCOMMENTS •/gi, ''));

            $(".comment-replies-renderer-expander-down").click(function () {
                $(this).parent().next().css("display", "block");
                $(this).parent().css("display", "none");

                $(".comment-replies-renderer-expander-up").click(function () {
                    $(this).parent().prev().css("display", "block");
                    $(this).parent().css("display", "none");

                });
            });
            clearInterval(myVar);

            $('.comment-renderer-text-content').each(function (index) {
                $(this).css('max-height', 'none');
            });

            //check for commentsHighlighted

            if ($(".comment-renderer-linked-comment").length) {
                $("#commentsTab span").trigger("click", ["Not"]);
                var t = setTimeout(function () {
                    $("body").scrollTo('0px', 400, {
                        axis: 'y'
                    });
                    $("#TabBody").scrollTo('.comment-renderer-linked-comment', 500, {
                        axis: 'y',
                        offset: -20
                    });

                    clearTimeout(t);
                }, 300);

            }
        }
    }, 1000);
} //end checkCommentsLoaded




//on window resize
$(window).resize(function () {
    if ($("#watch7-sidebar-contents").length) {
        changeTabPanelHeight();
    }
});


//infinteScroll for tabs
function infiniteScroll() {
    $('#TabBody').on('scroll', function () {
        var scrollPos = $(this).scrollTop();
        if ($("#searchTab").hasClass("is-active")) {
            searchScrollPos = scrollPos;
        } else if ($("#commentsTab").hasClass("is-active")) {
            commentsScrollPos = scrollPos;
        }
        if (scrollPos + $(this).innerHeight() + 30 >= $(this)[0].scrollHeight) {
            if ($("#searchTab").hasClass("is-active"))
                awsmSrchInfinteScroll();
            if ($("#commentsTab").hasClass("is-active"))
                commentsInfiniteScroll();
            if ($("#videoTab").hasClass("is-active"))
                videosInfiniteScroll();
        }

    });
}

//load commentsInfiniteScroll

function commentsInfiniteScroll() {
    if (!$("button.load-more-button").hasClass(".yt-uix-load-more-loading")) {
        $("button.load-more-button").click();
    }


}

//on tabs scroll stop
function videosInfiniteScroll() {
    if (!$("#watch-more-related-button").hasClass(".hid")) {
        $("#watch-more-related-button").click();
    }
}

function onClickTabs() {
    $("#commentsTab span").click(function (event, param1) {
        if (param1 != "Not") {
            var t1 = setTimeout(function () {
                $("#TabBody").scrollTo(commentsScrollPos, 800, {
                    axis: 'y'
                });
                clearTimeout(t1);
            }, 40);
        }


    });
    $("#videoTab span").click(function () {
        var t2 = setTimeout(function () {
            $("#TabBody").scrollTo(0, 5, {
                axis: 'y'
            });
            clearTimeout(t2);
        }, 5);
    });
    $("#infoTab span").click(function () {
        var t3 = setTimeout(function () {
            $("#TabBody").scrollTo(0, 5, {
                axis: 'y'
            });
            clearTimeout(t3);
        }, 5);
    });
}
