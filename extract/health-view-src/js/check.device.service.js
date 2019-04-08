angular.module('infi-basic').service('CheckDeviceService',['$http','SYS',function($http,SYS){
    this.checkDevice = function () {
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
}]);