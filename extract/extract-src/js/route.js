angular.module('infi-basic')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/task-configuration/:groupId', {
            templateUrl: '/extract-src/html/task-configuration.html',
            controller: 'TaskConfigurationController'
        }).
        when('/task-export/:type/:groupId', {
            templateUrl: '/extract-src/html/task-export.html',
            controller: 'TaskExportController'
        }).
        when('/view', {
            templateUrl: '/extract-src/html/view.html',
            controller: 'ViewController'
        }).
        when('/view/:taskName', {
            templateUrl: '/extract-src/html/view.html',
            controller: 'ViewController'
        }).
        when('/audit',{
            templateUrl: '/extract-src/html/audit.html',
            controller: 'AuditController'
        }).
        when('/task-detail/:viewType/:taskId',{
            templateUrl: '/extract-src/html/task-detail.html',
            controller:'TaskDetailController'
        }).
        when('/excel-export',{
            templateUrl: '/extract-src/html/excel-export.html',
            controller: 'ExcelExportController'
        }).
        when('/excel-import/:id',{
            templateUrl: '/extract-src/html/excel-import.html',
            controller: 'ExcelImportController'
        }).
        when('/classify',{
            templateUrl: '/extract-src/html/data-classify.html',
            controller: 'ClassifyController'
        }).
        when('/classify-create',{
            templateUrl: '/extract-src/html/data-classify-create.html',
            controller: 'ClassifyCreateController'
        }).
        when('/classify-create/:type/:id',{
            templateUrl: '/extract-src/html/data-classify-create.html',
            controller: 'ClassifyCreateController'
        }).
        when('/tag-source',{
            templateUrl: '/extract-src/html/data-source.html',
            controller: 'SourceController'
        }).
        when('/tag-source-create',{
            templateUrl: '/extract-src/html/data-source-create.html',
            controller: 'SourceCreateController'
        }).
        when('/tag-source-create/:type/:id',{
            templateUrl: '/extract-src/html/data-source-create.html',
            controller: 'SourceCreateController'
        }).
        when('/tag',{
            templateUrl: '/extract-src/html/data-tag.html',
            controller: 'TagController'
        }).
        when('/tag-create',{
            templateUrl: '/extract-src/html/data-tag-create.html',
            controller: 'TagCreateController'
        }).
        when('/tag-create/:type/:id',{
            templateUrl: '/extract-src/html/data-tag-create.html',
            controller: 'TagCreateController'
        }).
        when('/retrieval',{
            templateUrl: '/extract-src/html/retrieval.html',
            controller: 'RetrievalController'
        }).
        when('/retrieval-search',{
            templateUrl: '/extract-src/html/retrieval-search.html',
            controller: 'RetrievalSearchController'
        }).
        when('/retrieval-search/:keyword',{
            templateUrl: '/extract-src/html/retrieval-search.html',
            controller: 'RetrievalSearchController'
        }).
        when('/mind',{
            templateUrl: '/extract-src/html/mind.html',
            controller: 'MindController'
        }).
        when('/mind/:id/:name/:tableName',{
            templateUrl: '/extract-src/html/mind.html',
            controller: 'MindController'
        }).
        when('/mind-detail/:type/:tableName',{
            templateUrl: '/extract-src/html/mind-detail.html',
            controller: 'MindDetailController'
        }).
        when('/mind-detail/:id/:type/:tableName',{
            templateUrl: '/extract-src/html/mind-detail.html',
            controller: 'MindDetailController'
        }).
        when('/tag-operation',{
            templateUrl: '/extract-src/html/tag-operation.html',
            controller: 'TagOperationController'
        }).
        when('/login',{
            templateUrl:'../src/widget/system/html/login.html',
            controller:'LoginController'
        }).
        when('/task', {
            templateUrl: '/extract-src/html/task.html',
            controller: 'TaskController'
        }).
        when('/task/:groupId', {
            templateUrl: '/extract-src/html/task.html',
            controller: 'TaskController'
        }).
        otherwise({
            redirectTo: '/view'
        });
    }]);

angular.module('infi-basic').run(['$rootScope','Session','SYS',function ($rootScope,Session,SYS) {
    $rootScope.$on('$routeChangeSuccess', checkUserAuth);

    function checkUserAuth() {
        if( !Session.isAuthenticated() ){
            $rootScope.$broadcast(SYS.STATUS_DO_LOGIN,true);
        }
    }
}]);