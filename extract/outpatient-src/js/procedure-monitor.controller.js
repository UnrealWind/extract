angular.module('infi-basic').controller('ProcedureMonitorController', ['PageInteractiveService','$scope', 'DataService', 'SYS','ChartColumnService','PrintListService','$interval', function (PageInteractiveService,$scope, DataService, SYS,ChartColumnService,PrintListService,$interval) {
    $scope.SYS = SYS;

    $scope.dimension = {
        deptList:null, //科室列表
        checkTypeList:null //检查类别
    };
    $scope.waitSituation = {  //候诊情况监控
        department:"",
        number:""
    };
    $scope.inspectSituation = {  //检查情况监控
        examType:''
    };
    $scope.bloodSituation = {}; //采血情况监控

    $scope.medicineSituation = {  //取药情况监控
        drugType:'中药房'  //药房类别
    };
    $(".infi-main").scrollTop(0);
    //设置当前时间，用于打印显示
    $scope.now = new Date();
    $interval(function () {
        $scope.now = new Date();
    }, 1000);
    $scope.init = function () {
        $scope.visitData = PageInteractiveService.getTodayTime();
        //获取打印列表集合，并与allList匹配
        $scope.ids = PrintListService.getProMonIds($scope.printAllList);
        //获取科室名称
        DataService.requestData('15','get').then(function (msg) {
            $scope.dimension.deptList = msg;
            msg.status == SYS.STATUS_SUCCESS&&msg.data.status == SYS.STATUS_SUCCESS ? $scope.dimension.deptList.data.result.unshift({
                dept_id:"",dept_name:"全院"
            }): undefined;
        });
        //检查类别
        DataService.requestData('41','get').then(function (msg) {
            $scope.dimension.checkTypeList = msg;
        });
        $scope.changeDataList();
    }

    /**
     * 获取kpi/表格数据
     * @param kpiId  kpi的id
     * @param tableId  表格的id
     * @param filter  链接参数
     * @param original 绑定的数据
     */
    function getData(kpiId,tableId,filter,original) {
        DataService.requestData(kpiId,'get',$scope.visitData,filter).then(function (msg) {
            original.kpi = msg;
        });
        //检查类别
        DataService.requestData(tableId,'get',$scope.visitData,filter).then(function (msg) {
            original.recordData = msg;
        });
    }

    /**
     * 候诊情况监控
     */
    $scope.getWaitSituation = function () {
        var filter = {department:$scope.waitSituation.department,doctorType:$scope.waitSituation.number};
        $scope.waitSituation.tableColumn = ChartColumnService.tableWaiting();
        getData(82,83,filter,$scope.waitSituation);
    }

    /**
     * 检查情况监控
     */
    $scope.getInspectSituation = function () {
        var filter = {examType:$scope.inspectSituation.examType};
        $scope.inspectSituation.tableColumn = ChartColumnService.tableChecking();
        getData(84,85,filter,$scope.inspectSituation);
    }

    /**
     * 采血情况监控
     */
    $scope.getBloodSituation = function () {
        $scope.bloodSituation.tableColumn = ChartColumnService.tableBooding();
        getData(86,87,undefined,$scope.bloodSituation);
    }

    /**
     * 取药情况监控
     */
    $scope.getMedicineSituation = function () {
        var filter = {drugType:$scope.medicineSituation.drugType};
        $scope.medicineSituation.tableColumn = ChartColumnService.tableDruging();
        getData(88,89,filter,$scope.medicineSituation);
    }
    
    $scope.changeDataList = function () {
        $scope.getWaitSituation();  //候诊情况监控
        $scope.getInspectSituation();  //检查情况监控
        $scope.getBloodSituation();  //采血情况监控
        $scope.getMedicineSituation();  //取药情况监控
        
    }

    $scope.init();

    //实时请求数据
    $scope.intervalFun = PageInteractiveService.setIntervalData($scope.init);
    $scope.$on("$destroy", function() {
        PageInteractiveService.clearInterval($scope.intervalFun);
    })
}]);