angular.module('infi-basic')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        //列表页
        when('/list',{
            templateUrl:'/portray-src/html/list.html',
            controller:'ListController'
        }).
        when('/details',{
            templateUrl:'/portray-src/html/details.html',
            controller:'DetailsController'
        }).when('/portrait',{
            templateUrl:'/portray-src/html/portrait.html',
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