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