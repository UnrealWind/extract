angular.module('infi-basic')
    .directive('menuChose',['$http',function ($http) {
        return {
            restrict: 'ECMA',
            templateUrl:'./js/menu.chose/dist/menu-chose.html',
            scope: {
                menuList:'=',
                callBack:'&',
                type:"="
            },
            replace: true,
            link: function (scope, element,attr,rootCtrl) {

            }
        }
    }]);