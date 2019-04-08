//动态加载css或者js
var dynamicLoading = {
    css: function(path){
        if(!path || path.length === 0){
            throw new Error('argument "path" is required !');
        }
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    },
    js: function(path){
        if(!path || path.length === 0){
            throw new Error('argument "path" is required !');
        }
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        head.appendChild(script);
    }
};

if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))){
    if(window.location.href.indexOf("?mobile")<0){
        try{
            if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)){
                // 判断访问环境是 Android|webOS|iPhone|iPod|BlackBerry 则加载以下样式
                dynamicLoading.css('../../src/scss/infi-ele-phone.css')
            }
            // else if(/iPad/i.test(navigator.userAgent)){
            //     // 判断访问环境是 iPad 则加载以下样式
            //     setActiveStyleSheet("style_mobile_iPad.css");
            // }
            else{
                // 判断访问环境是 其他移动设备 则加载以下样式
                dynamicLoading.css('../../src/scss/infi-ele.css')
            }
        }
        catch(e){}
    }
}
else{
// 如果以上都不是，则加载以下样式
//     setActiveStyleSheet("../../src/scss/infi-ele.scss");
    dynamicLoading.css('../../src/scss/infi-ele.css')
}
