angular.module('infi-basic').controller('HomeController', ['$scope','DataService','$rootScope','Session',function ($scope,DataService,$rootScope,Session) {
    $scope.record301_navigation = [
      {'name':'入院列表','cls':'-list-alt','route':'list','active':'list-group-active'}
        // , {'name':'入院录入','cls':'-barcode','route':'input','active':''}
    ];

    $scope.infi_301_nav = function(nav){
      angular.forEach( $scope.record301_navigation , function(data,i) {
        $scope.record301_navigation[i].active = '';
      });
      nav.active = 'list-group-active';
    };

    $scope.num = 1;
    $scope.liHover = function(){
        if($scope.num == 1){
          $('nav > .list-group .list-group-item').mouseover(function () {
            $(this).animate({paddingLeft: '40px'}, 100).animate({paddingLeft: '34px'}, 100);
          });
            $scope.num++;
        }
    };

    DataService.ajaxDimensions().then(function (data) {
      $scope.dimensions = data;
    });

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
