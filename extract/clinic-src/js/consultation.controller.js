angular.module('infi-basic').controller('ConsultationController',['$scope','DataService','$filter','SYS','DataAdapter',function ($scope,DataService,$filter,SYS,DataAdapter) {
    $scope.SYS = SYS;
    $scope.selectOptions = [{
        label:"内科组合",
        value:0
    },{
        label:"外科组合",
        value:1
    },{
        label:"内外科组合",
        value:2
    }
    ];
    $scope.recordData = {
        startTime : "",
        endTime:"",
        selectedCombination:sessionStorage["selectedCombination"]?sessionStorage["selectedCombination"]:'0',
        arcData:null,
        nodeData:null
    }
    $scope.options = {
        finish:false
    };
    
    function init() {
        var today = new Date();
        var endTime = $filter('date')(today, 'yyyy-MM-dd');
        // var startTime = $filter('date')(today, 'yyyy-MM') + "-01";
        var startTime = "2017-05-01";
        $scope.recordData.startTime = sessionStorage["startTime"]?sessionStorage["startTime"]:startTime;
        $scope.recordData.endTime = sessionStorage["endTime"]?sessionStorage["endTime"]:endTime;
        drawChart();
    }
    
    $scope.changeData = function () {
        sessionStorage["startTime"] = $scope.recordData.startTime;
        sessionStorage["endTime"] = $scope.recordData.endTime;
        sessionStorage["selectedCombination"] = $scope.recordData.selectedCombination;
        sessionStorage["num"] = sessionStorage["num"]?++sessionStorage["num"]:1;
        window.location.href = "#/consultation/"+sessionStorage["num"];
    }
    
    function drawChart() {
        DataService.getDepartmentName().then(function (msg) {
            if(msg.status == SYS.STATUS_SUCCESS&&msg.data.result.length>0){
                DataAdapter.setCategory($scope.options,msg.data.result);
                DataAdapter.executeCallBack($scope.options);

                DataService.getCombinationData($scope.recordData.startTime,$scope.recordData.endTime).then(function (msg) {
                    if(msg.status == SYS.STATUS_SUCCESS&&msg.data.result.length>0){
                        DataAdapter.setTotalAnalysis($scope.options,msg.data.result);
                        DataAdapter.executeCallBack($scope.options);

                        //注:arc中Amount数值不能为0,否则项目报错无法绘图.数据按照Amount倒序排序,否则环与线不匹配
                        DataService.getArcAnalysisData($scope.recordData.startTime,$scope.recordData.endTime,$scope.recordData.selectedCombination).then(function (msg) {
                            if(msg.status == SYS.STATUS_SUCCESS&&msg.data.result.length>0){
                                $scope.options.arcs = msg.data.result;
                                DataAdapter.setArcsSum($scope.options);
                                DataAdapter.executeCallBack($scope.options);
                            }
                        });

                        DataService.getNodeAnalysisData($scope.recordData.startTime,$scope.recordData.endTime,$scope.recordData.selectedCombination).then(function (msg) {
                            if(msg.status == SYS.STATUS_SUCCESS&&msg.data.result.length>0){
                                $scope.options.nodes = msg.data.result;
                                DataAdapter.setNodesId($scope.options);
                                DataAdapter.executeCallBack($scope.options);
                            }
                        });
                    }
                });
            }
        });
    }

    init();
}]);