

$('.grid').masonry({
  itemSelector: '.grid-item',
  columnWidth: '.grid-sizer',
  percentPosition: true
});

function C1Text() {
  var inputBoxValue = document.getElementById("C1InputBox").value;
  document.getElementById("C1TextBox").innerHTML = inputBoxValue;
}

function C2Text() {
  var inputBoxValue = document.getElementById("C2InputBox").value;
  document.getElementById("C2TextBox").innerHTML = inputBoxValue;
}

function RecieveJSON(JSONText) {
  var json = $.getJSON("js/json/response_format.json");
  /*var data = eval("(" + json.reponseText + ")");*/
  $.getJSON("test.json", function(json) {
    console.log(json); // this will show the info it in firebug console
});
  var comic = JSON.parse()
}