var framestart = undefined;
var frameend = undefined;
var curr_username = undefined;
var curr_story = undefined;

function initialize() {
    var form = $('#comicform');
    console.log('its happening')
    var json_objects = form.serializeArray();
    // console.log(json_objects);
    var username = json_objects[0].value;
    var story = json_objects[1].value;
    var name1 = json_objects[2].value;
    var name2 = json_objects[3].value;
    var emotion1 = json_objects[4].value;
    var emotion2 = json_objects[5].value;
    var social1 = json_objects[6].value;
    var social2 = json_objects[7].value;
    var json = {"Details" : {"Username": username, "Story": story}};
    var characters = [{"Name": name1, "Position": "Left", "Social": social1, "Emotion": emotion1},
                      {"Name": name2, "Position": "Right", "Social": social2, "Emotion": emotion2}];
    json["Characters"] = characters;
    curr_username = username;
    curr_story = story;
    var formData = JSON.stringify(json);
    $.ajax({
    url : "https://responsivewebcomics.me/polls/initialization",
    type: "POST",
    dataType: "json",
    data : formData,
    success: function(data, textStatus, jqXHR)
    {
        console.log(formData);
        console.log(data);
        framestart = data['Details']['Frame_start'];
        frameend = data['Details']['Frame_end'];
        continueStory(username, story, framestart, frameend);
        //window.location.replace("index.html");
    },
    error: function (jqXHR, textStatus, errorThrown)
    {
       var errMsg = jQuery.parseJSON(jqXHR.responseText)['Error'];
       $('#error-myModal').html("Error: " + errMsg);
        console.log('you failed bruh');
        //window.location.replace("index.html");
    }
});
}

function continueStory(username, story, start, end) {
    framestart = start;
    frameend = end;
    var json = {"Details" : {"Story": story, "Username": username, "Frame_start": framestart, "Frame_end": frameend}};
    var formData = JSON.stringify(json);
    $.ajax({
    url : "https://responsivewebcomics.me/polls/continue",
    type: "POST",
    dataType: "json",
    data : formData,
    success: function(data, textStatus, jqXHR)
    {
        clearForm('myModal');
        showNextButton();
        loadFrame(data);
    },
    error: function (jqXHR, textStatus, errorThrown)
    {
        var errMsg = jQuery.parseJSON(jqXHR.responseText)['Error'];
        $('#error-myModal').html("Error: " + errMsg);
        console.log(formData);
        console.log('you failed to continue bruh');
    }
});
}

$(document).ready(function() {
    console.log('ready fam')
    console.log( document.getElementById('comicform') );
});

function loadFrame(data) {
    console.log('data with text');
    console.log(data);
    $('#title').text(data['Details']['Story']);
    $('#number').text((frameend+1).toString());
    $('#LeftChar').attr('src', data['Frames'][0]['Characters'][0]['URL']);
    $('#RightChar').attr('src', data['Frames'][0]['Characters'][1]['URL']);
    var leftText = data['Frames'][0]['Characters'][0]['Text'];
    var rightText = data['Frames'][0]['Characters'][1]['Text'];
    console.log(leftText);
    console.log(framestart);
    console.log(frameend);
    if (leftText=="") {
        leftText="Enter Text for Character 1";
    }
    if (rightText=="") {
        rightText="Enter Text for Character 2";
    }
    $('#c1text').text(leftText);
    $('#c2text').text(rightText);
}


function next() {
    var json = {"Details" : {"Story": curr_story, "Username": curr_username, "Frame_start": ++framestart, "Frame_end": ++frameend}};
    var formData = JSON.stringify(json);
    console.log('next');
    console.log(formData);
    $.ajax({
    url : "https://responsivewebcomics.me/polls/continue",
    type: "POST",
    dataType: "json",
    data : formData,
    success: function(data, textStatus, jqXHR)
    {
        loadFrame(data);
    },
    error: function (jqXHR, textStatus, errorThrown)
    {
        console.log(formData);
        console.log('you failed to continue bruh');
    }
});
}

function continueExistingStory() {
    var form = $('#continueform');
    console.log('its happening again')
    var json_objects = form.serializeArray();

    // console.log(json_objects);
    var username = json_objects[0].value;
    var story = json_objects[1].value;
    var startingframe = parseInt(json_objects[2].value)-1;
    var json = {"Details" : {"Story": story, "Username": username, "Frame_start": startingframe, "Frame_end": startingframe}};
    framestart = startingframe;
    frameend   = startingframe;
    curr_username = username;
    curr_story = story;
    var formData = JSON.stringify(json);
    $.ajax({
        url : "https://responsivewebcomics.me/polls/continue",
        type: "POST",
        dataType: "json",
        data : formData,
        success: function(data, textStatus, jqXHR)
        {
            clearForm("continueModal");
            showNextButton();
            loadFrame(data);
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            var errMsg = jQuery.parseJSON(jqXHR.responseText)['Error'];
            $('#error-continueModal').html("Error: " + errMsg);
            console.log(formData);
            console.log('you failed to continue bruh');
        }
    });
    setTimeout(updateImageHeight, 1500);
}

function updateTextOnBackEnd() {
  //temp store text in boxes
  //construct json
  var json = {"Details" : {"Username": curr_username, "Story": curr_story, "Frame_start": framestart+1, "Frame_end": frameend+1}};
  var characters = [{"Text": $('#c1text').text()},
                    {"Text": $('#c2text').text()}];
  console.log('updateBE');
  console.log($('#c1text').text());
  console.log($('#c2text').text());
  json['Frames'] = [{"Characters": characters}]
  var textData = JSON.stringify(json);
  $.ajax({
    url : "https://responsivewebcomics.me/polls/update_text",
    type: "POST",
    dataType: "json",
    data : textData,
    success: function(data, textStatus, jqXHR)
    {
        next();
        console.log('text submitted with success, loading next frame');
        console.log(textData);
        console.log('^thats text request');
    },
    error: function (jqXHR, textStatus, errorThrown)
    {
        // var errMsg = jQuery.parseJSON(jqXHR.responseText)['Error'];
        // $('#error-myModal').html("Error: " + errMsg);
        //console.log('you failed to continue bruh');
        console.log(textData);
        console.log('you failed to submit text bruh');
    }
});
}

function clearForm(modalName) {
    $('#' + modalName).hide();
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    $('#error-' + modalName).html('');
};

function showNextButton() {
    $('#next-button').attr('style', 'display: block;');
};
