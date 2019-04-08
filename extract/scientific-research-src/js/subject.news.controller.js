angular.module("infi-basic").controller('SubjectNewsController',
    ['$scope','SYS','$http','$routeParams','$timeout','subjectNewsService',function ($scope,SYS,$http,$routeParams,$timeout,subjectNewsService) {
        $scope.notInvited = false;
        $scope.accept = function (status,data,ev) {
            subjectNewsService.accept(status,data.id).then(function (data) {
                if(data.status == SYS.STATUS_SUCCESS){
                    subjectNewsService.getSubjectNews($scope.userId).then(function (data) {
                        $scope.acceptData = [];
                        if(data.status == SYS.STATUS_SUCCESS){
                            $scope.acceptData = data.data;
                        }else{
                            $scope.notInvited = true;
                        }
                    })
                }
            })
        }
        subjectNewsService.getSubjectNews($scope.userId).then(function (data) {
            if(data.status == SYS.STATUS_SUCCESS){
                $scope.acceptData = data.data;
            }
        })
    }])

