angular.module('infi-basic').controller('TimeBaseController', ['$scope', '$routeParams', 'RecordService', 'OverviewService', function ($scope, $routeParams, RecordService, OverviewService) {
    /**
     * ljy_debug,controller职责说明
     * 为时间周页面controller,主要功能为：
     * 1 获取时间轴基本信息
     * 2 获取产科档案信息
     * 3 获取住院以及门诊信息，用来实现时间轴功能
     */


    $scope.queryParams = {
        patientId: $routeParams.id,
        xlPatientId: $routeParams.xlPatientId
    };

    /**
     * 获取时间轴页面--基本信息
     */
    RecordService.getInfo('', '', 'timeList', $scope.queryParams.patientId, 57).then(function success(msg) {
        $scope.baseInfo = msg.data.data.result[0];
        $scope.baseInfoWrap = msg.data;
    });

    /**
     * 获取时间轴页面---产科档案信息
     */
    RecordService.getInfo('', '', 'timeList', $scope.queryParams.patientId, 58).then(function success(msg) {
        $scope.archives = msg.data.data.result;
        $scope.archivesWrap = msg.data;
    });

    /**
     * 获取门诊以及住院信息(时间轴控件数据);
     */
    OverviewService.ajaxOverviews($scope.queryParams.xlPatientId).then(function (msg) {
        $scope.timelineDatas = msg;
    });
}]);
