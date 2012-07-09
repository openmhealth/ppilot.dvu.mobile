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
        var scrollLeft = $(this).scrollLeft()  
        $("#detail").css('left',scrollLeft)
    //var menu = $("#menu")
    //menu.css('left',scrollLeft-menu.width())
    })
})