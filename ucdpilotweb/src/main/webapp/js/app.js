var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
if(isAndroid) {
  console.log = function(string){}
  $.getScript("js/cordova-1.7.0.js", function() {
    $.getScript("js/phone.js", function() {
      init()
    });
  });
}

$(document).ready(function(){
  $(window).scroll(function(){
    $("#detail").css("left",$(window).scrollLeft())
  })
})