angular.module('infi-basic')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/mind',{
            templateUrl: '/mind-map/html/mind.html',
            controller: 'MindController'
        }).
        when('/mind/:id/:name/:tableName',{
            templateUrl: '/mind-map/html/mind.html',
            controller: 'MindController'
        }).
        when('/mind-detail/:type/:tableName',{
            templateUrl: '/mind-map/html/mind-detail.html',
            controller: 'MindDetailController'
        }).
        when('/mind-detail/:id/:type/:tableName',{
            templateUrl: '/mind-map/html/mind-detail.html',
            controller: 'MindDetailController'
        }).
        otherwise({
            redirectTo: '/mind'
        });
    }]);