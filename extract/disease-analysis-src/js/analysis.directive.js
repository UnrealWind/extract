angular.module('infi-basic').directive('weather', ['$http','SYS','AnalysisServices',
function ($http,SYS,AnalysisServices) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/weather.template.html',
        scope: {
            params:'=',
            analysisType:'='
        },
        link: function (scope,element,attrs) {

            (function init(){
                var typeDiscribe = '';
                scope.analysisType.forEach(function(n,i){
                   n.value == scope.params.filter_type_id?typeDiscribe = n.label:undefined;
                });

                AnalysisServices.getWeather(scope.params).then(function(msg){
                    AnalysisServices.drawCharts(msg.data,typeDiscribe);
                })
            })();

        }
    }
}]);
