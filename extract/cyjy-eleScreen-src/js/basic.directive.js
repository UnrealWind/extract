angular.module("infi-basic")
    .directive("timeWeather",['$timeout','$http','$interval',function ($timeout,$http,$interval) {
        return{
            restrict:"ECMA",
            templateUrl:"../html/tpl/time-weather.html",
            link:function(scope){
                scope.now = new Date();//日期
                scope.weather = null;//天气
                scope.week = "";//星期几

                var myddy=scope.now.getDay();//获取存储当前日期
                var weekday=["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
                scope.week = weekday[myddy];


                setTimeout(function(){
                    scope.now = new Date();
                },1000*60);

                setTimeout(function () {
                    $.getJSON('http://wthrcdn.etouch.cn/weather_mini?citykey=101010100&name=getjson&callback=?', function(data){  //没有回调函数，直接处理
                       if(data && data.data){
                           scope.weather = filter(data.data);
                           scope.$apply();
                       }
                       else{
                           getWeatherRefresh();
                       }
                    });
                },1000*60*60);
                $.getJSON('http://wthrcdn.etouch.cn/weather_mini?citykey=101010100&name=getjson&callback=?', function(data){  //没有回调函数，直接处理
                    if(data && data.data){
                        scope.weather = filter(data.data);
                        scope.$apply();
                    }else{
                        getWeatherRefresh();
                    }
                });

                function getWeatherRefresh(){
                    var inter = $interval(function () {
                        $.getJSON('http://wthrcdn.etouch.cn/weather_mini?citykey=101010100&name=getjson&callback=?', function(data){  //没有回调函数，直接处理
                            if(data && data.data){
                                scope.weather = filter(data.data);
                                $interval.cancel(inter);
                            }
                        });
                    },5000);
                }
                function filter(data){
                    var list = {
                        wendu:null,//温度
                        status:null,//晴雨
                        aqi:null,//空气质量指数
                        aqiStatus:null,//空气质量指数状态
                        todayRange:null,//今日温度范围
                        tomorrowRange:null,//明日温度范围
                        todayStatus:null,//今日晴雨状态
                        tomorrowStatus:null//明日晴雨状态
                    }
                    list.wendu = data.wendu;
                    list.status = data.forecast[0].type;
                        list.aqi = data.aqi;
                    if(data.aqi>0 && data.aqi<=50){
                        list.aqiStatus = "优";
                    }else if(data.aqi>50 && data.aqi<=100){
                        list.aqiStatus = "良";
                    }else if(data.aqi>100 && data.aqi<=150){
                        list.aqiStatus = "轻度污染";
                    }else if(data.aqi>150 && data.aqi<=200){
                        list.aqiStatus = "中度污染";
                    }else if(data.aqi>200 && data.aqi<=300){
                        list.aqiStatus = "重度污染";
                    }else if(data.aqi>300){
                        list.aqiStatus = "严重污染";
                    }
                    data.forecast[0].highArr = data.forecast[0].high.split(' ');
                    data.forecast[0].lowArr = data.forecast[0].low.split(' ');
                    list.todayRange = data.forecast[0].lowArr[1]+"~"+data.forecast[0].highArr[1];
                    data.forecast[1].highArr = data.forecast[1].high.split(' ');
                    data.forecast[1].lowArr = data.forecast[1].low.split(' ');
                    list.tomorrowRange = data.forecast[1].lowArr[1]+"~"+data.forecast[1].highArr[1];
                    list.todayStatus = data.forecast[0].type;
                    list.tomorrowStatus = data.forecast[1].type;

                    if(list.status == '晴'){
                        $('.weather-img').append('<img src="../img/sun.png"/>');
                    }else if(list.status == '多云'){
                        $('.weather-img').append('<img src="../img/cloud.png"/>');
                    }else if(list.status == '阴'){
                        $('.weather-img').append('<img src="../img/overcast.png"/>');
                    }else if(list.status == '雨'){
                        $('.weather-img').append('<img src="../img/rain.png"/>');
                    }else if(list.status == '扬沙'){
                        $('.weather-img').append('<img src="../img/blowing.png"/>');
                    }else if(list.status == '浮沉'){
                        $('.weather-img').append('<img src="../img/floating.png"/>');
                    }else if(list.status == '沙尘暴'){
                        $('.weather-img').append('<img src="../img/sand.png"/>');
                    }else if(list.status == '强沙尘暴'){
                        $('.weather-img').append('<img src="../img/severeSand.png"/>');
                    }
                    return list;
                }
            }
        }
    }]).filter('to_trusted', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        }
    }]);
    