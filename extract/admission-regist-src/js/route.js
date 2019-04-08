angular.module('infi-basic')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/view', {
            templateUrl: '/admission-regist-src/html/view.html',
            controller: 'ViewController'
        }).
        when('/dataExport', {
            templateUrl: '/admission-regist-src/html/data-export.html',
            controller: 'DataExportController'          
        }).
        when('/entryRegist', {
            templateUrl: '/admission-regist-src/html/entry-regist.html',
            controller: 'EntryExitRegController'          
        }).
        when('/exitRegist', {
            templateUrl: '/admission-regist-src/html/exit-regist.html',
            controller: 'EntryExitRegController'             
        }).
        when('/login',{
            templateUrl: '../src/widget/system/html/login.html',
            controller:'LoginController'
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