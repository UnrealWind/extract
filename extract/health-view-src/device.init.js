// //动态加载css或者js
// var dynamicLoading = {
//     css: function(path){
//         if(!path || path.length === 0){
//             throw new Error('argument "path" is required !');
//         }
//         var head = document.getElementsByTagName('head')[0];
//         var link = document.createElement('link');
//         link.href = path;
//         link.rel = 'stylesheet';
//         link.type = 'text/css';
//         head.appendChild(link);
//     },
//     js: function(path){
//         if(!path || path.length === 0){
//             throw new Error('argument "path" is required !');
//         }
//         var head = document.getElementsByTagName('head')[0];
//         var script = document.createElement('script');
//         script.src = path;
//         script.type = 'text/javascript';
//         head.appendChild(script);
//     }
// };

function check() {
    var device = 'pc';
    if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
        if(window.location.href.indexOf("?mobile")<0){
            try{
                if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)){
                    device = 'mobile';
                }
            }
            catch(e){}
        }
    }
    return device;
}
function init(){
    if(check() == 'mobile'){
        window.location.href = "http://"+location.hostname+":"+location.port+"/health-view-src/app_mobile/index.html";
    }else{
        window.location.href = "./app_pc/index.html";
    }
}
init();