angular.module('infi-basic')
    .controller('HomeController',[ '$scope','$routeParams','$rootScope','naviServices','Session',function ($scope,$routeParams,$rootScope,naviServices,Session) {

        function init() {
            
        }

        $scope.researchNavs = [];
        
        $scope.userInfo = function(){
            $('#user-info').modal({backdarop:'static'})
        }

        $scope.Jump = function(data){
            if($routeParams.id){
                location.href = data.url+$routeParams.id;
            }
            data.active = 'infi-nav-active';
        };

        $scope.infi_study_nav = function(data){
            if(data.display == "display-none"){
                data.display = "display-block";
                data.icon = "down";
            }else if(data.display == "display-block"){
                data.display = "display-none";
                data.icon = "right";
            }
            
        }

       
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
                init();  //自己页面需要的初始化方法
            }

        });

        $scope.hospital = 'xxx';
        $scope.showDrops = false;
        $scope.showDrop = function(){
            $scope.showDrops = true;
        };
        $scope.closeDrop = function(){
            $scope.showDrops = false;
        };
        $scope.showOtherModal = function(mark){
            $('#'+mark).modal('show');
        };
    }])