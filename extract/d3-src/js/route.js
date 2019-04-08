angular.module('infi-basic')
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    //svg
    when('/svg',{
        templateUrl: '../d3-src/html/svg.html',
        controller:''
    }).
    //svg
    when('/list',{
        templateUrl: '../d3-src/html/svg-test.html',
        controller:'SvgController'
    }).
    when('/login',{
        templateUrl: '../src/widget/system/html/login.html',
        controller:'LoginController'
    }).
    otherwise({
        redirectTo: '/list'
    });
}]);

// angular.module('infi-basic').run(['$rootScope','Session','SYS',function ($rootScope,Session,SYS) {
//     $rootScope.$on('$routeChangeSuccess', checkUserAuth);
//
//     function checkUserAuth() {
//         if( !Session.isAuthenticated() ){
//             $rootScope.$broadcast(SYS.STATUS_DO_LOGIN,true);
//         }
//     }
// }]);
