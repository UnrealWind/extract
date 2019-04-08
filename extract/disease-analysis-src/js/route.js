angular.module('infi-basic')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/analysis', {
            templateUrl: 'html/analysis.html',
            controller: 'AnalysisController'
        }).
        when('/login',{
             templateUrl: '../src/widget/system/html/login.html',
             controller:'LoginController'
         })
        .otherwise({
            redirectTo: 'analysis'
        });
    }]);

 angular.module('infi-basic').run(['$rootScope', 'Session', 'SYS', function ($rootScope, Session, SYS) {
     $rootScope.$on('$routeChangeSuccess', checkUserAuth);

     function checkUserAuth() {
        if (!Session.isAuthenticated()) {
             $rootScope.$broadcast(SYS.STATUS_DO_LOGIN, true);
        }
     }
 }]);
