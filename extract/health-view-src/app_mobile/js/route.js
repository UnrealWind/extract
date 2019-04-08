angular.module('infi-basic')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        //列表页
        when('/list',{
            templateUrl:'../../health-view-src/html/list.html',
            controller:'ListController'
        }).
        when('/details',{
            templateUrl:'../../health-view-src/html/healthy.html',
            controller:'DetailsController'
        }).
        when('/unscramble/:patiId/:patiVisitId/:operation',{
            templateUrl:'../../health-view-src/html/unscramble.html',
            controller:'UnscrambleController'
        }).
        when('/login',{
            templateUrl: '../src/widget/system/html/login.html',
            controller:'LoginController'
        }).
        otherwise({
            redirectTo: '/list'
        });
    }]);