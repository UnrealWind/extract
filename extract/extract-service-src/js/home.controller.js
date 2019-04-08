angular.module('infi-basic')
    .controller('HomeController', ['$rootScope','$scope','$location','Session','SYS','AuthService','naviServices',function ($rootScope,$scope,$location,Session,SYS,AuthService,naviServices) {
        $scope.extract_navigation = null;
        function init() {
            //注:init方法在页面发生变化时就会执行,所以有的初始化方法只用执行一次的最好做一下判断,数据存在就不必每次都调用了
            //homecontroller初始化要进行的方法
            if(!$scope.extract_navigation){
                DataService.ajaxHome().then(function (msg){
                    $scope.extract_navigation = msg.data;

                    //防止左侧列表项选中再次刷新后选中项的背景发生变化
                    if(sessionStorage["nav"]&&msg.status == SYS.STATUS_SUCCESS){
                        $scope.extract_navigation[sessionStorage["nav"]].active = "list-group-active";
                    }else if(msg.status == SYS.STATUS_SUCCESS){
                        $scope.extract_navigation[0].active = "list-group-active";
                    }
                });
            }
        }
        
        $scope.extract_nav = function(nav,index){
            angular.forEach( $scope.extract_navigation , function(data,i){
                $scope.extract_navigation[i].active = '';
            });
            nav.active = 'list-group-active';
            sessionStorage["nav"] = index;
        }

        $scope.num = 1;
        $scope.liHover = function(){
            if($scope.num == 1){
                $('nav > .list-group .list-group-item').mouseover(function () {
                    $(this).animate({paddingLeft: '40px'}, 100).animate({paddingLeft: '34px'}, 100);
                });
                $scope.num++;
            }
        };

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
                // init();  //自己页面需要的初始化方法
            }
        });
    }]);