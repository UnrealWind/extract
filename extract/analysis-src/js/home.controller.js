angular.module('infi-basic')
    .controller('HomeController',['$scope','$rootScope','MethodService','$routeParams','$location','DataService','naviServices','AuthService','Session',function ($scope,$rootScope,MethodService,$routeParams,$location,DataService,naviServices,AuthService,Session) {
        $scope.navHeader = [
            {navName:'数据选择',navUrl:'data.select',className:'infi-header-active'},
            {navName:'变量设置',navUrl:'variable.set',className:''},
            {navName:'数据处理',navUrl:'data.pretreatment',className:''},
            {navName:'筛选设置',navUrl:'filter.set',className:''},
            {navName:'建立模型',navUrl:'model',className:''},
            {navName:'已建模型',navUrl:'complete',className:''}
        ];
        $scope.navUrl = function(data){
            if(data == 'model' && window.location.href.indexOf('data.select') < 0 && window.location.href.indexOf('complete') < 0){
                DataService.ajaxFilterSetDetailNext($routeParams.id).then(function(datas){
                    $location.path(data+'/'+$routeParams.id+'/'+ datas.data.filterRecordIds.substring(0,datas.data.filterRecordIds.indexOf(','))+'/'+datas.data.filterRecordIds.substring(datas.data.filterRecordIds.indexOf(',')+1,datas.data.filterRecordIds.length));
                });

            }else if(window.location.href.indexOf('data.select') < 0 && window.location.href.indexOf('complete') < 0){
                $location.path(data+'/'+$routeParams.id);
            }
            if(data == 'complete' || data == 'data.select'){
                $location.path(data);
            }
        }

        function init() {
            MethodService.homeNavHeader(window.location.href,$scope.navHeader);
            if(window.location.href.indexOf('filter.set.exploration') > 0 || window.location.href.indexOf('data.select.exploration') > 0){
                $scope.navShow = false;
            }else{
                $scope.navShow = true;
            }
        }

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
                init();  //自己页面需要的初始化方法
            }
        })
    }]);
