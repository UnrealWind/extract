angular.module('infi-basic')
    .controller('HomeController',[ '$scope','$routeParams','$rootScope','DataService','naviServices','SYS','Session',function ($scope,$routeParams,$rootScope,DataService,naviServices,SYS,Session) {

        //副导航
        $scope.researchNavs = [];
        SYS.imgBack = 'eu='+Session.getUser().eu+'&ep='+Session.getUser().ep;
        
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

        $rootScope.$on('$routeChangeSuccess', function (newValue, oldValue) {

            DataService.ajaxUserInfo().then(function(data){
                if(data.data.data !== undefined){
                    $scope.loginName =data.data.data.name;
                    $scope.loginDetails = data.data.data;
                    $scope.loginDetails = [
                        {name:'姓名 :',value:data.data.data.name},
                        {name:'医院 :',value:data.data.data.companyName},
                        {name:'科室 :',value:data.data.data.officeName},
                        {name:'工号 :',value:data.data.data.no},
                        {name:'电话 :',value:data.data.data.phone},
                        {name:'邮箱 :',value:data.data.data.email}
                    ];
                }

            });

            $routeParams.id?DataService.ajaxPermissions($routeParams.id).then(function(data){
                if(data.data.data == 'manager'){
                    $scope.modify = true;
                }else if(data.data.data == 'general'){
                    $scope.modify = false;
                }
            }):undefined;

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