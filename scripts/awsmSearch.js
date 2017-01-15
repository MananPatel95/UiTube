var $searchResult;
var showingResultsFor;
var nextLink;
var loadingPage = false;
onDocumentReady();

function onDocumentReady() {
    var awsmSearch = '<div id="awsm-masthead-search" class="search-form consolidated-form"><button id="awsm-search-btn" class="yt-uix-button yt-uix-button-size-default yt-uix-button-default search-btn-component search-button" tabindex="2"><span class="yt-uix-button-content">Search</span></button><div id="awsm-masthead-search-terms" class="masthead-search-terms-border " dir="ltr"><input id="awsm-masthead-search-term" autocomplete="off" class="search-term masthead-search-renderer-input yt-uix-form-input-bidi" type="text" tabindex="1" title="Search" dir="ltr" spellcheck="true" style="outline: none;"></div></div>';

    $("#yt-masthead-content")
        .append(awsmSearch);
    initAwsmSearch();
}

function initAwsmSearch() {
    if ('/watch' === location.pathname && searchOnSamePageV) {
        loadAwsmSearch();
        if ($searchResult != null) {
            $("#searchResults").html($searchResult);
            $("#searchTab").show();
            $("#searchSpinnerContainer").hide();
            $("#searchString").text(showingResultsFor);
        }
        onClickST();

    } else {
        $searchResult = null;
        loadOrignalSearch();

    }
}

function loadAwsmSearch() {
    $("#awsm-masthead-search").show();
    $("#masthead-search").hide();
    loadDataOnSearch();
}

function loadOrignalSearch() {
    $("#masthead-search").show();
    $("#awsm-masthead-search").hide();
    $(".branded-page-gutter-padding").show();
}

function loadDataOnSearch() {
    var $input = $("#awsm-masthead-search-term");
    $input.keydown(function (event) {
        if (event.keyCode == 13) {
            $searchResult = null;
            searchScrollPos = 0;
            loadData();
        }
    });
    $("#awsm-search-btn").click(function () {
        $searchResult = null;
        searchScrollPos = 0;
        loadData()
    });

    //load search data
    function loadData() {
        showingResultsFor = $input.val();
        var query = "/results?search_query=" + encodeURIComponent(showingResultsFor);
        $("#searchString").text(showingResultsFor);
        $("#searchTab").show();
        $("#searchSpinnerContainer").show();
        $("#searchTab span").trigger("click", ["Not"]);
        $("#searchResultsCont").hide();
        var results;

        $.ajax({
            url: query,
            type: "post",
            dataType: "html",
            success: function (responseData) {
                var data = $('<div/>').append($.parseHTML(responseData));
                $searchResult = data.find("#results");
                nextLink = data.find(".branded-page-box  a:last").attr("href");

                $("#searchResults").html($searchResult);
                $("#searchResultsCont").show();
                $(".branded-page-gutter-padding").hide();
                $("#searchSpinnerContainer").hide();

            },
        });
    }
}


function awsmSrchInfinteScroll() {
    if ($searchResult != null && !loadingPage) {
        loadingPage = true;
        $("#loadNewResultSpinContainer").show();
        infiniteSrchLoadData();

    }
}


function infiniteSrchLoadData() {
    var query = nextLink;
    $.ajax({
        url: "https://www.youtube.com" + query,
        type: "GET",
        dataType: "html",
        success: function (responseData) {
            loadingPage = false;
            var data = $('<div/>').append($.parseHTML(responseData));

            $searchResult = $("#searchResults").append(data.find("#results"));
            $searchResult.append(data.find("#results"));

            nextLink = data.find(".branded-page-box.search-pager.spf-link>a:last").attr("href");

            $("#searchResultsCont").show();
            $(".branded-page-gutter-padding").hide();
            $("#loadNewResultSpinContainer").hide();
        },
    });
}

function onClickST() {
    $("#searchTab span").click(function (event, param1) {
        if (param1 != "Not") {
            var t = setTimeout(function () {
                $("#TabBody").scrollTo(searchScrollPos, 800, {
                    axis: 'y'
                });
                clearTimeout(t);
            }, 100);
        }
    });
}
