angular.module('infi-basic')
    .controller('HomeController', ['$scope', 'SYS', '$rootScope','naviServices','Session','IntervalService', function ($scope, SYS,$rootScope,naviServices,Session,IntervalService) {
        $rootScope.targetTemplate = null;
        $rootScope.intervalFun = null;
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

        document.onscroll = function(){
            $rootScope.intervalFun = IntervalService.setIntervalData($rootScope.intervalFun);
        };
        document.onclick = function(){
            $rootScope.intervalFun = IntervalService.setIntervalData($rootScope.intervalFun);
        };
        document.ondblclick = function(){
            $rootScope.intervalFun = IntervalService.setIntervalData($rootScope.intervalFun);
        };
        document.onkeydown = function(){
            $rootScope.intervalFun = IntervalService.setIntervalData($rootScope.intervalFun);
        };
        document.onkeypress = function(){
            $rootScope.intervalFun = IntervalService.setIntervalData($rootScope.intervalFun);
        };
        document.onkeyup = function(){
            $rootScope.intervalFun = IntervalService.setIntervalData($rootScope.intervalFun);
        }
    }]);
