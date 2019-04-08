angular.module('infi-basic')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/info', {
            templateUrl: '/iDiagnosis-src/index/html/info-tab.html',
            controller: 'InfoTabContoller'
        }).
        when('/symptoms', {
            templateUrl: '/iDiagnosis-src/index/html/symptoms-tab.html',
            controller: 'InfoTabContoller'
        }).
        when('/history', {
            templateUrl: '/iDiagnosis-src/index/html/history.html',
            controller: 'InfoTabContoller'
        }).
        when('/check', {
            templateUrl: '/iDiagnosis-src/index/html/check.html',
            controller: 'InfoTabContoller'
        }).
        when('/checkout', {
            templateUrl: '/iDiagnosis-src/index/html/checkout.html',
            controller: 'InfoTabContoller'
        }).
        when('/detail', {
            templateUrl: '/iDiagnosis-src/index/html/detail.html',
            controller: 'DetailContoller'
        }).
        otherwise({
            redirectTo: '/info'
        });
}]);