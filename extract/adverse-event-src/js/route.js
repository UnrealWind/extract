angular.module('infi-basic')
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    //总体分析
    when('/overall-monitoring',{
        templateUrl:'../adverse-event-src/html/overall-monitoring.html',
        controller:'OverallMonitoringController'
    }).
    //患者列表页
    when('/monitoring-list',{
        templateUrl:'../adverse-event-src/html/monitoring-list.html',
        controller:'MonitoringListController'
    }).
    //患者列表详情页
    when('/patient-details/:patientId',{
        templateUrl:'../adverse-event-src/html/patient-details.html',
        controller:'MonitoringListController'
    }).
    //总体分析的  查看报表页
    when('/report-total-details',{
        templateUrl:'../adverse-event-src/html/report-total-details.html',
        controller:'ReportDetailsController'
    }).
    //预测分析 的  查看报表页
    when('/report-details',{
        templateUrl:'../adverse-event-src/html/report-details.html',
        controller:'ReportDetailsController'
    }).
    //实时预测
    when('/real-time',{
        templateUrl:'../adverse-event-src/html/real-time.html',
        controller:'RealTimeController'
    }).
    //预测详情
    when('/patient-list',{
        templateUrl:'../adverse-event-src/html/patient-list.html',
        controller:'PatientListController'
    }).
    //预测列表
    when('/prediction-list/:patientId',{
        templateUrl:'../adverse-event-src/html/prediction-list.html',
        controller:'PredictionListController'
    }).
    //预测列表详情
    when('/prediction-details/:patientId/:date',{
        templateUrl:'../adverse-event-src/html/prediction-details.html',
        controller:'PredictionDetailsController'
    }).
    //pdf显示
    when('/adverse-pdf/:id',{
        templateUrl:'../adverse-event-src/html/adverse-pdf.html',
        controller:'AdversePdfController'
    }).
    when('/login',{
        templateUrl: '../src/widget/system/html/login.html',
        controller:'LoginController'
    }).
    otherwise({
        redirectTo: '/overall-monitoring'
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
