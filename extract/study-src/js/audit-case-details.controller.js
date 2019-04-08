angular.module('infi-basic')
    .controller('AuditCaseDetailsController', ['$scope','DataService',function ($scope,DataService) {
        $scope.auditBy = function(){
            $('#auditBy').modal({backdrap:'static'});
        }
        $scope.num=1;
        $scope.dataReference = function(){
            if($scope.num==0){
                $('#dataReference').css("right","-50%");
                $scope.num=1;
            }else{
                $('#dataReference').css("right","0");
                $scope.num=0;
            }

        }
    }]);