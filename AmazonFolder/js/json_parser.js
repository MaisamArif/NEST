// global variables

var jsonURL = "https://meme-stone-methologic.c9users.io/FrontEndV2/js/json/response_format.json";
var frameIndex = 0;
var numberOfFrames = 1;
var storedData = undefined;

// httpGetAsync()
// generic javascript GET function with callback

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {

        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", jsonURL, true); // true for asynchronous
    xmlHttp.send(null);
}

// applyData()
// responsible for adding the appropriate image, text, and
// class data to the HTML template

function applyData(json) {
    document.getElementById('C1TextBox').innerHTML = json.Frames[frameIndex].Characters[0].Text
    document.getElementById('C2TextBox').innerHTML = json.Frames[frameIndex].Characters[1].Text
    document.getElementById('LeftImage').src = "images/Alternative/" + json.Frames[frameIndex].Characters[0].URL
    document.getElementById('RightImage').src = "images/Alternative/" + json.Frames[frameIndex].Characters[1].URL
}

// loadNextFrame()
// loads the next frame in the sequence from json and
// re-applies the image, text, and class data

function loadNextFrame() {
    if (numberOfFrames > (frameIndex + 1)) {
        // console.log('here')
        frameIndex++;
        applyData(storedData);
    }
}

// parseResponse()
// loads the next frame in the sequence from json and
// re-applies the image, text, and class data

function parseResponse(jsonText) {
    var jsonData = JSON.parse(jsonText);
    storedData = jsonData;
    numberOfFrames = jsonData.Frames.length;
    // console.log(numberOfFrames)
    applyData(jsonData);
}

// initial GET request

function loadNextFrame2(){
    httpGetAsync(jsonURL, parseResponse);
}

//httpGetAsync(jsonURL, parseResponse)



//##################################### FRONT END ##############################################


var showingRightTextBox = false;
var showingLeftTextBox = false;
var rightSpeechBub = document.getElementById('C2TextBox');
var leftSpeechBub = document.getElementById('C1TextBox');

var rightH = document.getElementById("RightChar").height;
var rightW = document.getElementById("RightChar").width;
var leftH = document.getElementById("LeftChar").height;
var leftW = document.getElementById("LeftChar").width;

var leftChar = document.getElementById("LeftChar");
var leftFrame = document.getElementById("LeftFrame");

var rightChar = document.getElementById("RightChar");
var rightFrame = document.getElementById("RightFrame");

var $focusPointFrames;
$focusPointFrames = $('.focuspoint');

updateImageHeight();

$( document ).ready(function() {
$('.focuspoint').focusPoint();
});

window.addEventListener("resize", checkRatio);
window.addEventListener("resize", updateImageHeight);

function checkRatio() {
  leftChar = document.getElementById("LeftChar");
  leftFrame = document.getElementById("LeftFrame");
  rightChar = document.getElementById("RightChar");
  rightFrame = document.getElementById("RightFrame");
  var leftCharSize = leftChar.height * leftChar.width;
  var rightCharSize = rightChar.height * leftChar.width;

  var ratio = leftCharSize / rightCharSize;

  if(leftCharSize > rightCharSize) {
    leftChar.style.zIndex = 1;
    rightChar.style.zIndex = 0;
  } else {
    leftChar.style.zIndex = 0;
    rightChar.style.zIndex = 1;
  }


  if($('#LeftFrame').height() > $('#RightFrame').height()) {
    //rightFrame.style.marginBottom = "5vh";
    //leftFrame.style.marginBottom = "0px";
    console.log("LEFT");
    //console.log("leftTaller");
    //var newMargin = ( ( 1-(1/ratio) ) * 100) + "% 0px";
    //var newMargin = $('#LeftFrame').height() / $('#RightFrame').height();
  } else {
    //leftFrame.style.marginBottom = "5vh";
    //rightFrame.style.marginBottom = "0px";
    //console.log(newMargin);
    console.log("RIGHT");
    //console.log("rightTaller");
  }
}

function updateImageHeight() {

  leftH = document.getElementById("LeftChar").naturalHeight;
  leftW = document.getElementById("LeftChar").naturalWidth;

  rightH = document.getElementById("RightChar").naturalHeight;
  rightW = document.getElementById("RightChar").naturalWidth;



  leftFrame.setAttribute("data-focus-w", leftW);
  leftFrame.setAttribute("data-focus-h", leftH);

  rightFrame.setAttribute("data-focus-w", rightW);
  rightFrame.setAttribute("data-focus-h", rightH);

  //focuspoint call
}

function setRightText() {
  var oldText = $("div.speech-bub-right").text();
  var RTextBox = $("div.speech-bub-right");
  //rightSpeechBub.innerHTML = '<textarea class="rightTextInputBoxC" id="rightTextInputBox" onClick="event.cancelBubble=true;">' + oldText + '</textarea>';
  //rightSpeechBub.innerHTML = '<div contenteditable class="rightTextInputBoxC" id="rightTextInputBox" onClick="event.cancelBubble=true;">' + oldText + '</div>';


}
/*
document.addEventListener('click', function(event) {
  var specifiedElement = document.getElementById('rightTextInputBox');
  if(specifiedElement){
    var isClickInside = specifiedElement.contains(event.target);

    var textArea = document.getElementById('rightTextInputBox');
    if (!isClickInside && showingRightTextBox) {

      rightSpeechBub.innerHTML = $("#rightTextInputBox").text();

      updateTextOnBackEnd();
      specifiedElement.remove();
      showingRightTextBox = false;
    } else if(!showingRightTextBox) {
      showingRightTextBox = true;
    }
  }
});
*/
function setLeftText() {
  var oldText = $("div.speech-bub-left").text();
  //leftSpeechBub.innerHTML = '<textarea class="leftTextInputBoxC" id="leftTextInputBox" onClick="event.cancelBubble=true;">' + oldText + '</textarea>';
}
/*

document.addEventListener('click', function(event) {
  var specifiedElement = document.getElementById('leftTextInputBox');
  if(specifiedElement){
    var isClickInside = specifiedElement.contains(event.target);

    var textArea = document.getElementById('leftTextInputBox');
    if (!isClickInside && showingLeftTextBox) {

      leftSpeechBub.innerHTML = $("#leftTextInputBox").val();

      updateTextOnBackEnd();
      specifiedElement.remove();
      showingLeftTextBox = false;
    } else if(!showingLeftTextBox) {
      showingLeftTextBox = true;
    }
  }
});*/


