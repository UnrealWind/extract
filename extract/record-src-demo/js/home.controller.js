angular.module('infi-basic')
    .controller('HomeController', ['$scope', 'SYS', '$rootScope','Session',function ($scope, SYS,$rootScope,Session) {
         $rootScope.targetTemplate = null;
         /**
          * 用户登录成功之后重新请求用户信息,解决用户名不同步的情况
          */
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
                     }
                 }
             }
         });

    }]);
