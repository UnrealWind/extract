angular.module('infi-basic')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/list', {
            templateUrl: '/iDiagnosis-src/config/html/list.html',
            controller: 'ListController'
        }).
        when('/config/:tempId', {
            templateUrl: '/iDiagnosis-src/config/html/config.html',
            controller: 'ConfigController'
        }).
        otherwise({
            redirectTo: '/list'
        });
}]);