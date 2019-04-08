angular.module('infi-basic').config(['$routeProvider',function ($routeProvider) {
    $routeProvider.
        //轮播图
    when('/broadcast',{
        templateUrl:'/cyjy-eleScreen-src/html/broadcast.html',
        controller:'BroadcastController'
    }).
        //首页
    when('/first-page',{
        templateUrl:'/cyjy-eleScreen-src/html/first-page.html',
        controller:'FirstPageController'
    }).
        //从首页进入文章列表页
    when('/article-list/:moduleType',{
        templateUrl:'/cyjy-eleScreen-src/html/article-list.html',
        controller:'ArticleListController'
    }).
        //从文章详情页进入文章列表页，需要加上当前tab，用于选中
    when('/article-list/:moduleType/:currentTab',{
        templateUrl:'/cyjy-eleScreen-src/html/article-list.html',
        controller:'ArticleListController'
    }).
    when('/article-details/:moduleType/:aSort/:title',{
        templateUrl:'/cyjy-eleScreen-src/html/article-details.html',
        controller:'ArticleDetailsController'
    }).
    when('/article-details/:moduleType/:aSort/:title/:currentTab',{
        templateUrl:'/cyjy-eleScreen-src/html/article-details.html',
        controller:'ArticleDetailsController'
    }).
    when('/video-show/:vSort/:title',{
        templateUrl:'/cyjy-eleScreen-src/html/video-show.html',
        controller:'VideoShowController'
    }).
    when('/video-show/:moduleType/:vSort/:title/:currentTab',{
        templateUrl:'/cyjy-eleScreen-src/html/video-show.html',
        controller:'VideoShowController'
    }).
    otherwise({
        redirectTo: '/broadcast'
    });
}]);

angular.module('infi-basic').run(['$rootScope','Session','SYS',function ($rootScope,Session,SYS) {
    $rootScope.$on('$routeChangeSuccess'/*, checkUserAuth*/);

    function checkUserAuth() {
        if( !Session.isAuthenticated() ){
            $rootScope.$broadcast(SYS.STATUS_DO_LOGIN,true);
        }
    }
}]);