angular.module('infi-basic')
    .controller('HomeController',[ '$scope','$routeParams','$rootScope','DataService','SYS','Session',
        function ($scope,$routeParams,$rootScope,DataService,SYS,Session) {
            $rootScope.$on('$routeChangeSuccess', function (event,current,previous) {
                //初始化方法的调用
                if(current&&current.loadedTemplateUrl&&current.loadedTemplateUrl.indexOf('login.html')>-1){
                    //退出后清空所有homecontroller判断项
                    $scope.name = null;  //必清项
                }else{
                    //解决重新登录用户名不同步问题
                    if(!$scope.name){
                        var user = Session.getUser();
                        if(user){
                            $scope.name = user.name;
                            $scope.userId = user.id;
                        }

                    }
                }
            });
}]);