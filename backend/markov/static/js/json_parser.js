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

