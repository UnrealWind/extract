angular.module('infi-basic').directive('basicAttr', ['$http','SYS','FlowChartServices',
function ($http,SYS,FlowChartServices) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/basicAttr.template.html',
        scope: {
            datas:'='
        },
        link: function (scope,element,attrs) {
            scope.chose = function (opt) {
                opt.active = !opt.active;
            }
        }
    }
}]);
