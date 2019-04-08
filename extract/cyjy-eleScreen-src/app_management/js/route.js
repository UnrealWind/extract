angular.module('infi-basic').config(['$routeProvider',function ($routeProvider) {
    $routeProvider.
        //新增文章页
    when('/rich-text',{
        templateUrl:'/cyjy-eleScreen-src/html/rich-text.html',
        controller:'RichTextController'
    }).
        //编辑文章
    when('/rich-text/:id',{
        templateUrl:'/cyjy-eleScreen-src/html/rich-text.html',
        controller:'RichTextController'
    }).
        //新增视频
    when('/update-video',{
        templateUrl:'/cyjy-eleScreen-src/html/update-video.html',
        controller:'UpdateVideoController'
    }).
        //新增轮播图
    when('/update-rollImg',{
        templateUrl:'/cyjy-eleScreen-src/html/update-rollImg.html',
        controller:'UpdateRollImgController'
    }).
        //表格展示页
    when('/management-index',{
        templateUrl:'/cyjy-eleScreen-src/html/management-index.html',
        controller:'ManagementIndexController'
    }).
    otherwise({
        redirectTo: '/management-index'
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