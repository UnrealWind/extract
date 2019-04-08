angular.module('infi-basic')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/topics', {
            templateUrl: '/study-src/html2/topics.html',
            controller: 'TopicsController'
        }).
        when('/topics.input/:id', {
            templateUrl: '/study-src/html2/topics.input.html',
            controller: 'TopicsInputController'
        }).
        when('/topics.input', {
            templateUrl: '/study-src/html2/topics.input.html',
            controller: 'TopicsInputController'
        }).
        when('/topics.input.group/:id',{
            templateUrl: '/study-src/html2/topics.input.group.html',
            controller: 'TopicsInputGroupController'
        }).
        when('/topics.input.task/:id',{
            templateUrl: '/study-src/html2/topics.input.task.html',
            controller: 'TopicsInputTaskController'
        }).
        when('/overview/:id', {
            templateUrl: '/study-src/html/overview.html',
            controller: 'OverviewController'
        }).
        when('/CRF-template', {
            templateUrl: '/study-src/html/CRF-template.html',
            controller: 'CRFtemplateController'
        }).
        when('/data-list', {
            templateUrl: '/study-src/html/data-list.html',
            controller: 'DataListController'
        }).
        when('/new-data', {
            templateUrl: '/study-src/html/new-data.html',
            controller: 'NewDataController'
        }).
        when('/audit-list', {
            templateUrl: '/study-src/html/audit-list.html',
            controller: 'AuditListController'
        }).
        when('/cases-input/:id', {
            templateUrl: '/study-src/html/cases-input.html',
            controller: 'CasesInputController'
        }).
        when('/audit-case/:id', {
            templateUrl: '/study-src/html/audit-case.html',
            controller: 'AuditCaseController'
        }).
        when('/management/:id', {
            templateUrl: '/study-src/html2/topics.input.group.html',
            controller: 'TopicsInputGroupController'
        }).
        when('/CRF-system', {
            templateUrl: '/study-src/html/CRF-system.html',
            controller: 'CRFSystemController'
        }).
        when('/CRF-details', {
            templateUrl: '/study-src/html/CRF-details.html',
            controller: 'CRFDetailsController'
        }).
        when('/CRF-modify', {
            templateUrl: '/study-src/html/CRF-modify.html',
            controller: 'CRFModifyController'
        }).
        when('/data-details', {
            templateUrl: '/study-src/html/data-details.html',
            controller: 'DataDetailsController'
        }).
        when('/audit-details', {
            templateUrl: '/study-src/html/audit-details.html',
            controller: 'AuditDetailsController'
        }).
        when('/excel-export',{
            templateUrl: '/study-src/html/excel-export.html',
            controller: 'ExcelExportController'
        }).
        when('/excel-import',{
            templateUrl: '/study-src/html/excel-import.html',
            controller: 'ExcelImportController'
        }).
        when('/excel-check',{
            templateUrl: '/study-src/html/excel-check.html',
            controller: 'ExcelCheckController'
        }).
        when('/excel-preview/:id/:groupId',{
            templateUrl: '/study-src/html/excel-preview.html',
            controller: 'ExcelPreviewController'
        }).
        when('/audit-case-details',{
            templateUrl: '/study-src/html/audit-case-details.html',
            controller: 'AuditCaseDetailsController'
        }).
        when('/project-data',{
            templateUrl: '/study-src/html/project-data.html',
            controller: 'ProjectDataController'
        }).
        when('/project-data-details',{
            templateUrl: '/study-src/html/project-data-details.html',
            controller: 'ProjectDataDetailsController'
        }).
        when('/topics-modify',{
            templateUrl: '/study-src/html/topics-modify.html',
            controller: 'TopicsModifyController'
        }).
        when('/topics-modify-invite',{
            templateUrl: '/study-src/html/topics-modify-invite.html',
            controller: 'TopicsModifyInviteController'
        }).
        when('/topics-modify-set',{
            templateUrl: '/study-src/html/topics-modify-set.html',
            controller: 'TopicsModifySetController'
        }).
        when('/new-cases',{
            templateUrl: '/study-src/html/new-cases.html',
            controller: 'NewCasesController'
        }).
        when('/conversion',{
            templateUrl: '/study-src/html/conversion.html',
            controller: 'ConversionController'
        }).
        when('/conversion-configuration',{
            templateUrl: '/study-src/html/conversion-configuration.html',
            controller: 'ConversionConfigurationController'
        }).
        when('/conversion-export',{
            templateUrl: '/study-src/html/conversion-export.html',
            controller: 'ConversionExportController'
        }).
        when('/conversion-excel-export',{
            templateUrl: '/study-src/html/conversion-excel-export.html',
            controller: 'ConversionExcelExportController'
        }).
        when('/conversion-excel-import',{
            templateUrl: '/study-src/html/conversion-excel-import.html',
            controller: 'ConversionExcelImportController'
        }).
        when('/cases-input-details',{
            templateUrl: '/study-src/html/cases-input-details.html',
            controller: 'CasesInputDetailsController'
        }).
        when('/input-data/:id/:projectName/:recordId',{
            templateUrl:'/study-src/html3/form-data.html',
            controller:'FormController'
        }).
        when('/input-details/:id/:projectName/:recordId',{
            templateUrl:'/study-src/html3/form-details.html',
            controller:'FormController'
        }).
        when('/login',{
            templateUrl: '../src/widget/system/html/login.html',
            controller:'LoginController'
        }).
        when('/updateScale',{
            templateUrl:'/study-src/html3/update.scale.html',
            controller:'UpdateScaleController'
        }).
        when('/crfList',{
            templateUrl: '/study-src/html4/crfList.html',
            controller: 'CrfListController'
        }).
        when('/crfCustomize/:id',{
            templateUrl: '/study-src/html4/crfCustomize.html',
            controller: 'CrfCustomizeController'
        }).
        when('/propertyPage/:crfId/:id/:way',{
            templateUrl: '/study-src/html4/propertyPage.html',
            controller: 'PropertyController'
        }).
        when('/crfView/:id',{
            templateUrl: '/study-src/html4/crfView.html',
            controller: 'CrfViewController'
        }).
        otherwise({
            redirectTo: 'topics'
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
