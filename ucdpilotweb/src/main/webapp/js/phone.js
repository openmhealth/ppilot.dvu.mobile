function init() {
    document.addEventListener("deviceready", startup, false);
}
function startup() {
    document.addEventListener("menubutton", doMenu, false);
}
function doMenu() {
    var menu = document.getElementById('menu')
    if(menu.style.display=== 'none')
        menu.style.display='inline';
    else
        menu.style.display= 'none'
}

function refresh(){
    window.location = window.location
}