function showLoading() {
    // remove existing loaders
    $('.loading-container').remove();
    $('<div id="orrsLoader" class="loading-container"><div><div class="mdl-spinner mdl-js-spinner is-active"></div></div></div>').appendTo("body");

    componentHandler.upgradeElements($('.mdl-spinner').get());
    setTimeout(function () {
        $('#orrsLoader').css({
            opacity: 1
        });
    }, 1);
}

function hideLoading() {
    $('#orrsLoader').css({
        opacity: 0
    });
    setTimeout(function () {
        $('#orrsLoader').remove();
    }, 400);
}

function showDialog(options) {
    options = $.extend({
        id: 'orrsDiag',
        title: null,
        text: null,
        neutral: false,
        negative: false,
        positive: false,
        cancelable: true,
        contentStyle: null,
        onLoaded: false,
        hideOther: true,
        neverShow: false
    }, options);

    if (options.hideOther) {
        // remove existing dialogs
        $('.dialog-container').remove();
        $(document).unbind("keyup.dialog");
    }

    $('<div id="' + options.id + '" class="dialog-container"><div class="mdl-card mdl-shadow--16dp" id="' + options.id + '_content"></div></div>').appendTo("body");
    var dialog = $('#' + options.id);
    var content = dialog.find('.mdl-card');
    if (options.contentStyle != null) content.css(options.contentStyle);
    if (options.title != null) {
        $('<h5>' + options.title + '</h5>').appendTo(content);
    }
    if (options.text != null) {
        $('<div>' + options.text + '</div').appendTo(content);
    }
    if (options.neutral || options.negative || options.positive) {
        var buttonBar = $('<div class="mdl-card__actions dialog-button-bar"></div>');
        if (options.neverShow) {

            var neverShowCB = $('<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox-2" id="neverShow"><input type="checkbox" id="checkbox-2" class="mdl-checkbox__input"><span class="mdl-checkbox__label">Don&#39;t show this again</span></label><div class="mdl-layout-spacer"></div>');
            $(document).on("click", "#neverShow", function () {
                var isChecked = !$(this).hasClass("is-checked");
                if (isChecked) {
                    console.log("checked");
                    chrome.storage.local.set({
                        ExtUpdated: 0
                    }, function () {});
                } else {
                    
                    chrome.storage.local.set({
                        ExtUpdated: 1
                    }, function () {});
                }
            });
            neverShowCB.appendTo(buttonBar);
        }
        if (options.neutral) {
            options.neutral = $.extend({
                id: 'neutral',
                title: 'Neutral',
                onClick: null
            }, options.neutral);
            var neuButton = $('<button class="mdl-button mdl-js-button mdl-js-ripple-effect" id="' + options.neutral.id + '">' + options.neutral.title + '</button>');
            neuButton.click(function (e) {
                e.preventDefault();
                if (options.neutral.onClick == null || !options.neutral.onClick(e))
                    hideDialog(dialog)
            });
            neuButton.appendTo(buttonBar);
        }
        if (options.negative) {
            options.negative = $.extend({
                id: 'negative',
                title: 'Cancel',
                onClick: null
            }, options.negative);
            var negButton = $('<button class="mdl-button mdl-js-button mdl-js-ripple-effect" id="' + options.negative.id + '">' + options.negative.title + '</button>');
            negButton.click(function (e) {
                e.preventDefault();
                if (options.negative.onClick == null || !options.negative.onClick(e))
                    hideDialog(dialog)
            });
            negButton.appendTo(buttonBar);
        }
        if (options.positive) {
            options.positive = $.extend({
                id: 'positive',
                title: 'OK',
                onClick: null
            }, options.positive);
            var posButton = $('<button class="mdl-button mdl-js-button mdl-button--raised" id="' + options.positive.id + '">' + options.positive.title + '</button>');
            posButton.click(function (e) {
                e.preventDefault();
                if (options.positive.onClick == null || !options.positive.onClick(e))
                    hideDialog(dialog)
            });
            posButton.appendTo(buttonBar);
        }

        buttonBar.appendTo(content);
    }
    componentHandler.upgradeDom();
    if (options.cancelable) {
        dialog.click(function () {
            hideDialog(dialog);
        });
        $(document).bind("keyup.dialog", function (e) {
            if (e.which == 27)
                hideDialog(dialog);
        });
        content.click(function (e) {
            e.stopPropagation();
        });
    }
    setTimeout(function () {
        dialog.css({
            opacity: 1
        });
        if (options.onLoaded)
            options.onLoaded();
    }, 1);
}

function hideDialog(dialog) {
    $(document).unbind("keyup.dialog");
    dialog.css({
        opacity: 0
    });
    setTimeout(function () {
        dialog.remove();
    }, 400);
}
