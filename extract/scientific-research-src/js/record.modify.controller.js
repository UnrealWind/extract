
angular.module("infi-basic").controller('RecordModifyController',
    ['$scope','SYS','$http','RecordListServices','$routeParams',
        function ($scope,SYS,$http,RecordListServices,$routeParams) {
            RecordListServices.getModifyRecord($routeParams).then(function (data) {
                if(data.status == SYS.STATUS_SUCCESS){
                    $scope.modifyRecord = data.data;
                }
            })
            $scope.goToRecordInput = function () {
                location.href = '#/record-input/'+$routeParams.subjectId+'/'+$routeParams.groupId+'/'+$routeParams.recordId;
            }
        }]);

