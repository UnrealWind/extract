angular.module('infi-basic')
    .controller('HomeController', ['$rootScope','$scope','$location','Session','DataService','naviServices',function ($rootScope,$scope,$location,Session,DataService,naviServices) {
        $scope.extract_navigation = [
            {
                "name": "用户",
                "href": "user",
                "icon": "-list-alt"
            },
            {
                "name": "角色",
                "href": "role",
                "icon": "-barcode"
            },
            {
                "name": "菜单",
                "href": "menu",
                "icon": "-check"
            },
            {
                "name": "机构",
                "href": "mechanism",
                "icon": "-check"
            }
        ];
        function init() {
            //注:init方法在页面发生变化时就会执行,所以有的初始化方法只用执行一次的最好做一下判断,数据存在就不必每次都调用了
            //homecontroller初始化要进行的方法
            if(!$scope.extract_navigation){
                DataService.getMenus().then(function (msg) {
                    if(msg.data && msg.data.length>0 ){
                        angular.forEach(msg.data,function (entity) {
                            var hrefs = entity.href.split('/');
                            entity.$href = hrefs[hrefs.length-1];
                        });
                        msg.data[0].active = "list-group-active";
                    }
                    $scope.extract_navigation = msg.data;
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