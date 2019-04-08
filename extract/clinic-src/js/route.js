angular.module('infi-basic').config(['$routeProvider',function ($routeProvider) {
    $routeProvider.
    when('/monitor',{
        templateUrl:'/clinic-src/html/monitor.html',
        controller:'MonitorController'
    }).
    when('/combination',{
        templateUrl:'/clinic-src/html/combination-analysis.html',
        controller:'CombinationController'
    }).
    when('/consultation',{
        templateUrl:'/clinic-src/html/consultation-analysis.html',
        controller:'ConsultationController'
    }).
    when('/consultation/:startTime',{
        templateUrl:'/clinic-src/html/consultation-analysis.html',
        controller:'ConsultationController'
    }).
    when('/proportion',{
        templateUrl:'/clinic-src/html/proportion-analysis.html',
        controller:'ProportionController'
    }).
    when('/login',{
        templateUrl:'../src/widget/system/html/login.html',
        controller:'LoginController'
    }).
    otherwise({
        redirectTo: '/combination'
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