angular.module('infi-basic').controller('RecordController', ['$scope', '$routeParams', 'RecordService', 'OverviewService', 'Utils', 'SYS','$http',
    function ($scope, $routeParams, RecordService, OverviewService, Utils, SYS,$http) {

    RecordService.getNumApi($routeParams.filter__xlPatientId,null,57).then(function success(msg) {
        $scope.baseInfo = msg.data.result;
        $scope.baseInfoWrap = msg.data;
    });
    $scope.goBack = function(){
        history.go(-1);
    };
    /**
     * 获取门诊以及住院信息(时间轴控件数据);
     */

    $scope.param = {
        type:'time',
        disease:null
    };


    (function getDiseaseList() {
        $http.get(SYS.url+'unite/resource/single/73').success(function (msg) {
            $scope.diseaseList = msg.data.result;
            $scope.param.disease = msg.data.result[0].disease_id+'';
        });
    })();

    $scope.changeTimeLine = function () {
        OverviewService.ajaxOverviews($routeParams.filter__xlPatientId,$scope.param).then(function (msg) {
            $scope.timelineDatas = msg;
        });
    };

    $scope.chose  = function(mark){
        $scope.param.type = mark;
        $scope.changeTimeLine();
    };

    $scope.choseDisease = function(mark){
        $scope.param.disease = mark;
        $scope.changeTimeLine();
    };

    $scope.changeTimeLine();


}]);
