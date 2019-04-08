angular.module("infi-basic").controller("HomeController", [
  "$scope",
  "$rootScope",
  "momentService",
  function($scope, $rootScope, momentService) {
    
    momentService.momentInit()              // 初始化日期选择控件配置
    
    
    
    
    
    
    
    // 放开这段注释前记得先注入 Session factory
    /**
     * 用户登录成功之后重新请求用户信息,解决用户名不同步的情况
     */
    // $rootScope.$on('$routeChangeSuccess', function (event,current,previous) {
    //   //初始化方法的调用
    //   if(current&&current.loadedTemplateUrl&&current.loadedTemplateUrl.indexOf('login.html')>-1){
    //       //退出后清空所有homecontroller判断项
    //       $scope.name = null;  //必清项
    //   }else{
    //       //解决重新登录用户名不同步问题
    //       if(!$scope.name){
    //           var user = Session.getUser();
    //           if(user){
    //               $scope.name = user.name;
    //           }
    //       }
    //   }
    // });
  }
]);
