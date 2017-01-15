

$(document).ready(function () {
    $("#opacityText").text($("#LightsOffOpacity").val());
    $("#DelayText").text($("#LightsOffDelay").val());

});

function afterVarsLoad(){
      setUiState();
}
function setUiState() {
    checkboxToggle("#LightsOffInp", lightsOffV);
    checkboxToggle("#TabsInp", tabsV);
    checkboxToggle("#InfoInp", tabsInfoV);
    checkboxToggle("#CommentsInp", tabsCommentsV);
    checkboxToggle("#SearchOnSamePageInp", searchOnSamePageV);
    checkboxToggle("#MouseVolumeControlInp", volumeControlV);
    checkboxToggle("#TagsInp", tagsV);

    if (lightsOffV) {
        $("#AutoLightsOffMore").show();
       
    } else {
        $("#AutoLightsOffMore").hide();
      
    }
    
    if (tabsV) {
        $("#TabsMore").show();
       
    } else {
        $("#TabsMore").hide();
      
    }
    
    timer = setTimeout(function () {
        $("#LightsOffDelay").get(0).MaterialSlider.change(lightsOffDelayV);
        $("#DelayText").text(lightsOffDelayV);
        $("#LightsOffOpacity").get(0).MaterialSlider.change(lightsOffOpacityV);
        $("#opacityText").text(lightsOffOpacityV);
         $("#MouseVolumeControlSteps").get(0).MaterialSlider.change(volumeControlStepsV);
        $("#MVCStepsText").text(volumeControlStepsV);
        clearTimeout(timer);

    }, 1200);
    // $("#LightsOffOpacity").MaterialSlider.change(55);
    //$("#LightsOffDelay").value=5;

}

function checkboxToggle($checkbox, value) {
    if (!value) {
        $($checkbox).prop("checked", false).parent().removeClass('is-checked');
    } else {
        if (!$($checkbox).parent().hasClass('is-checked'))
            $($checkbox).prop("checked", true).parent().addClass('is-checked');
    }
}


//Auto Lights Off Settings
$(document).on("click", "#LightsOffSB", function () {
    shoeRedInfo();
    var isChecked = !$(this).hasClass("is-checked");
    if (isChecked) {
        $("#AutoLightsOffMore").show();
        chrome.storage.local.set({
            LightsOff: 1
        }, function () {});

    } else {
        $("#AutoLightsOffMore").hide();
        chrome.storage.local.set({
            LightsOff: 0
        }, function () {});

    }
});

$(document).on("input", "#LightsOffOpacity", function () {
    $("#opacityText").text(this.value);
});
$(document).on("change", "#LightsOffOpacity", function () {
    shoeRedInfo();
    chrome.storage.local.set({
        LightsOffOpacity: this.value
    }, function () {});
});

$(document).on("input", "#LightsOffDelay", function () {
    $("#DelayText").text(this.value);
});
$(document).on("change", "#LightsOffDelay", function () {
    shoeRedInfo();
    chrome.storage.local.set({
        LightsOffDelay: this.value
    }, function () {});
});

//Tabs Settings
$(document).on("click", "#TabsSB", function () {
    shoeRedInfo();
    var isChecked = !$(this).hasClass("is-checked");
    if (isChecked) {
        $("#TabsMore").show();
        chrome.storage.local.set({
            Tabs: 1
        }, function () {});
    } else {
        $("#TabsMore").hide();
        chrome.storage.local.set({
            Tabs: 0
        }, function () {});
    }
});

//Tabs Settings
$(document).on("click", "#MouseVolumeControlSB", function () {
    shoeRedInfo();
    var isChecked = !$(this).hasClass("is-checked");
    if (isChecked) {
        $("#MouseVolumeControlMore").show();
        chrome.storage.local.set({
            VolumeControl: 1
        }, function () {});
    } else {
        $("#MouseVolumeControlMore").hide();
        chrome.storage.local.set({
            VolumeControl: 0
        }, function () {});
    }
});

$(document).on("input", "#MouseVolumeControlSteps", function () {
    $("#MVCStepsText").text(this.value);
});
$(document).on("change", "#MouseVolumeControlSteps", function () {
    shoeRedInfo();
    chrome.storage.local.set({
        volumeControlStepsV: this.value
    }, function () {});
});

onClickSwitch("#InfoSB", "TabsInfo");
onClickSwitch("#CommentsSB", "TabsComments");
onClickSwitch("#SearchOnSamePageSB", "SearchOnSamePage");
onClickSwitch("#TagsSB", "Tags");


function onClickSwitch($switchId, switchName) {
    $(document).on("click", $switchId, function () {
        shoeRedInfo();
        var isChecked = !$(this).hasClass("is-checked");
        var obj = {};
        if (isChecked) {
            obj[switchName] = 1;
            chrome.storage.local.set(obj, function () {});
        } else {
            obj[switchName] = 0;
            chrome.storage.local.set(obj, function () {});
        }
    });
}

function shoeRedInfo(){
    $(".redInfo").show();
}