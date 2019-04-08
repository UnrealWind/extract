angular.module('infi-basic')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/data.select/:id', {
            templateUrl: '/analysis-tools-src/html/data.select.html',
            controller: 'DataSelectController'
        }).
        when('/data.select', {
            templateUrl: '/analysis-tools-src/html/data.select.html',
            controller: 'DataSelectController'
        }).
        when('/data.select1', {
            templateUrl: '/analysis-tools-src/html/data.select1.html',
            controller: 'DataSelect1Controller'
        }).
        when('/data.select2', {
            templateUrl: '/analysis-tools-src/html/data.select2.html',
            controller: 'DataSelect2Controller'
        }).
        when('/variable.set', {
            templateUrl: '/analysis-tools-src/html/variable.set.html',
            controller: 'VariableSetController'
        }).
        when('/data.pretreatment', {
            templateUrl: '/analysis-tools-src/html/data.pretreatment.html',
            controller: 'DataPretreatmentController'
        }).
        when('/filter.set', {
            templateUrl: '/analysis-tools-src/html/filter.set.html',
            controller: 'FilterSetController'
        }).
        when('/filter.set1', {
            templateUrl: '/analysis-tools-src/html/filter.set1.html',
            controller: 'FilterSet1Controller'
        }).
        when('/model', {
            templateUrl: '/analysis-tools-src/html/model.html',
            controller: 'ModelController'
        }).
        when('/model/:id', {
            templateUrl: '/analysis-tools-src/html/model.html',
            controller: 'ModelController'
        }).
        when('/complete', {
            templateUrl: '/analysis-tools-src/html/complete.html',
            controller: 'CompleteController'
        }).
        when('/exploration1', {
            templateUrl: '/analysis-tools-src/html/exploration1.html',
            controller: 'explorationController'
        }).
        when('/exploration2', {
            templateUrl: '/analysis-tools-src/html/exploration2.html',
            controller: 'explorationsController'
        }).
        otherwise({
            redirectTo: 'data.select'
        });
    }]);
