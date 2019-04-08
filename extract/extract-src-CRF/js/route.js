/**
 * Created by geqimeng on 17-11-13.
 */
angular.module('infi-basic')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/init/:id/:groupId',{
            templateUrl: '/extract-src-CRF/html/init.html',
            controller: 'fetchData'
        }).
        when('/login',{
            templateUrl: '../src/widget/system/html/login.html',
            controller:'LoginController'
        }).
        when('/search/:id',{
            templateUrl: '/extract-src-CRF/html/search.html',
            controller: 'SearchController'
        }).
        when('/list/:type/:id',{
            templateUrl: '/extract-src-CRF/html/list.html',
            controller: 'genInfoInput'
        }).
        when('/detail/:id',{
            templateUrl: '/extract-src-CRF/html/detail.html',
            controller: 'genDetail'
        }).
        when('/topics',{  //默认进入study-src
            templateUrl: '/study-src/html/topics.html',
            controller:function () {
                //默认跳转到科研分析中心
                var path = 'http://'+window.location.hostname+':'+window.location.port;
                window.location.href = path + '/' + 'scientific-research-src/#/subject-list';
            }
        }).
        otherwise({
            redirectTo: '/topics'
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