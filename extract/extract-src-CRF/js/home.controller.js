angular.module('infi-basic')
    .controller('HomeController', ['$rootScope','$scope','naviServices','Session',function ($rootScope,$scope,naviServices,Session) {
        $scope.extract_navigation = null;
        $rootScope.$on('$routeChangeSuccess', function (event,current,previous) {

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
            }
        });
    }]);