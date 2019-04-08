angular.module('infi-basic')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        //列表页
        when('/list',{
            templateUrl:'../../health-view-src/html/list.html',
            controller:'ListController'
        }).
        when('/details',{
            templateUrl:'../../health-view-src/html/details.html',
            controller:'DetailsController'
        }).
        when('/login',{
            templateUrl: '../src/widget/system/html/login.html',
            controller:'LoginController'
        }).
        otherwise({
            redirectTo: '/list'
        });
    }]);