angular.module('infi-basic')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/login',{
            templateUrl: '../src/widget/system/html/login.html',
            controller:'LoginController'
        }).when('/daily-report',{
            templateUrl: '/daily-shift-src/html/daily-report.html',
            controller:'dailyReportController'
        }).when('/module-statistics',{
            templateUrl: '/daily-shift-src/html/module-statistics.html',
            controller:'moduleStatisticsController'
        }).when('/report-view/:date',{
            templateUrl: '/daily-shift-src/html/report-view.html',
            controller:'reportViewController'
        }).when('/report-view/:date/:wardId',{
            templateUrl: '/daily-shift-src/html/report-view.html',
            controller:'reportViewController'
        }).when('/second-format/:date',{
            templateUrl: '/daily-shift-src/html/second-format.html',
            controller:'secondFormatController'
        }).
        otherwise({
            redirectTo: '/daily-report'
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