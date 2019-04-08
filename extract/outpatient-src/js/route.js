angular.module('infi-basic').config(['$routeProvider',function ($routeProvider) {
    $routeProvider.
    when('/register-monitor',{  //实时监控-挂号监控
        templateUrl:'/outpatient-src/html/register-monitor.html',
        controller:'RegisterMonitorController'
    }).
    when('/visit-monitor',{  //实时监控-就诊监控
        templateUrl:'/outpatient-src/html/visit-monitor.html',
        controller:'VisitMonitorController'
    }).
    when('/cost-monitor',{  //实时监控-费用监控
        templateUrl:'/outpatient-src/html/cost-monitor.html',
        controller:'CostMonitorController'
    }).
    when('/procedure-monitor',{  //实时监控-流程监控
        templateUrl:'/outpatient-src/html/procedure-monitor.html',
        controller:'ProcedureMonitorController'
    }).
    when('/register-analysis',{ //历史分析-挂号分析
        templateUrl:'/outpatient-src/html/register-analysis.html',
        controller:'RegisterAnalysisController'
    }).
    when('/visit-analysis',{ //历史分析-接诊分析
        templateUrl:'/outpatient-src/html/visit-analysis.html',
        controller:'VisitAnalysisController'
    }).
    when('/charge-analysis',{ //收费分析-接诊分析
        templateUrl:'/outpatient-src/html/charge-analysis.html',
        controller:'ChargeAnalysisController'
    }).
    when('/filter',{  //智能服务-手动筛查
        templateUrl:'/outpatient-src/html/filter.html',
        controller:'FilterController'
    }).


    when('/demo',{  //智能服务-手动筛查
        templateUrl:'/outpatient-src/html/demo.html',
        controller:'DemoController'
    }).


    when('/login',{
        templateUrl:'../src/widget/system/html/login.html',
        controller:'LoginController'
    }).
    otherwise({
        redirectTo: '/register-monitor'
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