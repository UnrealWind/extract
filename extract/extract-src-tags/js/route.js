/**
 * Created by geqimeng on 17-11-13.
 */
angular.module('infi-basic')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/tags',{
            templateUrl: '/extract-src-tags/html/tags.html',
            controller: 'TagsController'
        }).
        when('/login',{
            templateUrl: '../src/widget/system/html/login.html',
            controller:'LoginController'
        }).
        otherwise({
            redirectTo: '/tags'
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