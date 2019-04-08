angular.module('infi-basic').controller('CombinationController',['$scope','$filter','DataService','DataAdapter','SYS',function ($scope,$filter,DataService,DataAdapter,SYS) {
    $scope.SYS = SYS;
    $scope.recordData = {
        startTime : "2017-05-01",
        endTime:"",
        pageResult:null
    }
    function init() {
        var today = new Date();
        $scope.recordData.endTime = $filter('date')(today, 'yyyy-MM-dd');
        // $scope.recordData.startTime = $filter('date')(today, 'yyyy-MM') + "-01";
        $scope.changeData();
    }

    $scope.changeData = function () {
        DataService.getCombinationData($scope.recordData.startTime,$scope.recordData.endTime).then(function (msg) {
            $scope.recordData.pageResult = msg;
        });
    }
    init();
}]);