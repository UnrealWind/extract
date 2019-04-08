angular.module('infi-basic').controller('ProportionController',['$scope','DataService','$filter','DataAdapter','SYS',function ($scope,DataService,$filter,DataAdapter,SYS) {
    $scope.SYS = SYS;
    $scope.departments = null;
    $scope.recordData = {
        pageResult:null,
        departments : null,
        deptName : "中医科",
        startTime : "2017-05-01",
        endTime:""
    }
    DataService.getDepartmentName().then(function (msg) {
        $scope.recordData.departments = msg;
    });

    function init() {
        var today = new Date();
        $scope.recordData.endTime = $filter('date')(today, 'yyyy-MM-dd');
        // $scope.recordData.startTime = $filter('date')(today, 'yyyy-MM') + "-01";
        $scope.changeData();
    }

    $scope.changeData = function () {
        DataService.getProportionData($scope.recordData.deptName,$scope.recordData.startTime,$scope.recordData.endTime).then(function (msg) {
            $scope.recordData.pageResult = msg;
            if(msg.status == $scope.SYS.STATUS_SUCCESS && msg.data.result.length > 0){
                DataAdapter.setProportionChart(msg.data.result);
            }
        });
    }
    init();
}]);