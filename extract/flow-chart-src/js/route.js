angular.module('infi-basic')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/flowChart', {
            templateUrl: 'html/flowChart.html',
            controller: 'FlowChartController'
        })/*.
        when('/login',{
             templateUrl: '../src/widget/system/html/login.html',
             controller:'LoginController'
         })*/
        .otherwise({
            redirectTo: 'flowChart'
        });
    }]);

 angular.module('infi-basic').run(['$rootScope', 'Session', 'SYS', function ($rootScope, Session, SYS) {
     $rootScope.$on('$routeChangeSuccess', checkUserAuth);

     function checkUserAuth() {
         return;
        if (!Session.isAuthenticated()) {
             $rootScope.$broadcast(SYS.STATUS_DO_LOGIN, true);
        }
     }
 }]);
