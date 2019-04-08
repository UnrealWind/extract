angular.module('infi-basic')
    .controller('TagOperationController', ['$scope','TaskService','SYS','DataAdapter','$location','$routeParams','Utils',function ($scope,TaskService,SYS,DataAdapter,$location,$routeParams,Utils) {
        $scope.SYS = SYS;
        //用于显示左侧tab的数据
        $scope.summaryData = null;
        //用于显示右侧性别、年龄等信息
        $scope.allData = null;

        function init() {
            var subject = {subjectId:"",subjectGroupId:""};  //课题、模板id,目前没有使用

            TaskService.getSummaryList("filter",subject).then(function (msg) {
                $scope.summaryData = msg;
            });
            TaskService.getInfoDetailData("filter",subject).then(function (msg) {
                $scope.allData = msg;
            });
        }

        init();
    }]);