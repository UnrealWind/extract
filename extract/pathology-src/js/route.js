angular.module('infi-basic')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/list', {
            templateUrl: '/pathology-src/html/list.html',
            controller: 'ListController'
        }).
        when('/applyForm', {
            templateUrl: '/pathology-src/html/applyForm.html',
            controller: 'ApplyFormController'
        }).
        when('/report', {
            templateUrl: '/pathology-src/html/pathology-report.html',
            controller: 'PaReportController'
        }).
        when('/dataExport', {
            templateUrl: '/pathology-src/html/dataExport.html',
            controller: 'DataExportController'
        }).
        when('/reportGened', {
            templateUrl: '/pathology-src/html/report-generated.html',
            controller: 'ReportGenedController'
        }).
        otherwise({
            redirectTo: '/list'
        });
    }]);

angular.module('infi-basic').run(['$rootScope','Session','SYS',function ($rootScope,Session,SYS) {
    $rootScope.$on('$routeChangeSuccess', checkUserAuth);

    function checkUserAuth() {
        return;
        if( !Session.isAuthenticated() ){
            $rootScope.$broadcast(SYS.STATUS_DO_LOGIN,true);
        }
    }
}]);