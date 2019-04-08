angular.module("infi-basic")
    .directive("chartWidth",['$timeout',function ($timeout) {
        return{  //总量分析中比例左侧,右侧占比区分显示
            restrict:"A",
            link:function (scope,element,attrs) {
                $timeout(function() {
                    var percent = (scope.$eval(attrs.chartWidth)*100).toFixed(2)+"%";
                    element.css("width",percent);
                });
            }
        }
    }])
    