angular.module('infi-basic').controller('HomeController',['$scope','DataService','$location','Session','SYS','AuthService','$rootScope','naviServices',function ($scope,DataService,$location,Session,SYS,AuthService,$rootScope,naviServices) {
    $scope.extract_navigation = null;
    function init() {
        //注:init方法在页面发生变化时就会执行,所以有的初始化方法只用执行一次的最好做一下判断,数据存在就不必每次都调用了
        //homecontroller初始化要进行的方法
        if(!$scope.extract_navigation){
            DataService.getMenu().then(function (msg) {
                $scope.extract_navigation = msg;
            });
        }
    }

    $scope.optChildMenu = function (opt) {
        opt.show = !opt.show;
    }

    $scope.choseNavi = function (entity) {
        if(entity.href != ""){
            $location.path(entity.href);
            angular.forEach( $scope.extract_navigation , function(navi){
                navi.active = '';
                if(navi.child != ""){
                    angular.forEach( navi.child , function(child){
                        child.active = "";
                    })
                }
            });
            entity.active = 'list-group-active';
        }
        else{
            entity.show = !entity.show;
        }
    }

    /**
     * 切换多科就诊与门诊监控的title名称
     */
    $scope.$on("$routeChangeSuccess",function(event,current,previous){
        //初始化方法的调用
        if(current&&current.loadedTemplateUrl&&current.loadedTemplateUrl.indexOf('login.html')>-1){
            //退出后清空所有homecontroller判断项
            $scope.name = null;  //必清项
            $scope.extract_navigation = null;
        }else{
            //解决重新登录用户名不同步问题
            if(!$scope.name){
                var user = Session.getUser();
                if(user){
                    $scope.name = user.name;
                }
            }
            init();  //自己页面需要的初始化方法
        }
    });
}]);