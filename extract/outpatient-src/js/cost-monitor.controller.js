angular.module('infi-basic').controller('CostMonitorController', ['$scope', 'DataService', 'SYS','DrawEchartService','PageInteractiveService','DataAdapter','KpiColumnService','ChartColumnService','PrintListService','$interval', function ($scope, DataService, SYS,DrawEchartService,PageInteractiveService,DataAdapter,KpiColumnService,ChartColumnService,PrintListService,$interval) {
    $scope.SYS = SYS;
    
    $scope.dimension = {
        deptList:null,//科室列表
        identityList:null//身份列表
    };
    $scope.overallKpi = null;
    $scope.paymentType = {  //收费构成监控
        department:""
    };
    $scope.payService = {  //收费项目排行监控
        department:"",
        identity:"",
        common:[  //三个图各自的选项 排行类型/显示个数/绘图的id/调取后台的id
            {rank:'fy_size',displayNumber:'5',id:'barDrugFee',urlId:77},
            {rank:'fy_size',displayNumber:'5',id:'barCheckCharges',urlId:78},
            {rank:'fy_size',displayNumber:'5',id:'barInspectionFee',urlId:79}
        ]
    };
    $scope.doctorFee = {  //医生收费监控
        department:"",
        identity:"",
        number:"",
        changedData:{}
    };
    $scope.patientRetreatFee = { //患者退费情况监控
        department:"",
        identity:"",
        number:""
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
        $scope.ids = PrintListService.getCosMonIds($scope.printAllList);
        //获取科室名称
        DataService.requestData('15','get').then(function (msg) {
            $scope.dimension.deptList = msg;
            msg.status == SYS.STATUS_SUCCESS&&msg.data.status == SYS.STATUS_SUCCESS ? $scope.dimension.deptList.data.result.unshift({
                dept_id:"",dept_name:"全院"
            }): undefined;
        });
        //获取身份
        DataService.requestData('39','get').then(function (msg) {
            $scope.dimension.identityList = msg;
        });
        $scope.changeList();
    }
    /**
     * 付费类型构（人次)
     */
    $scope.getPaymentType = function () {
        var filter = {department:$scope.paymentType.department};
        DataService.requestData('75','get',$scope.visitData,filter).then(function (msg) {
            DrawEchartService.getChartData('nested','nestedPaymentType',msg,$scope.getPaymentProject,'type');
        });
    }
    /**
     * 付费项目
     */
    $scope.getPaymentProject = function (type) {
        if(type){
            $scope.paymentType.costType = type;
            var filter = {department:$scope.paymentType.department,type:type};
            DataService.requestData('76','get',$scope.visitData,filter).then(function (msg) {
                DrawEchartService.getChartData('pie','piePayItem',msg);
            });
        }else{
            $('#piePayItem').text('服务器忙,请稍后再试');
        }
    }
    /**
     * 收费项目排行监控
     */
    $scope.getPayService = function () {
        angular.forEach($scope.payService.common,function (common,idx) {
            PageInteractiveService.searchCostRanking($scope.payService,idx,$scope.visitData);
        });
    }
    /**
     *医生收费监控
     */
    $scope.getDoctorFee = function () {
        var filter={department:$scope.doctorFee.department,doctorType:$scope.doctorFee.number,
            patientIdentity:$scope.doctorFee.identity};
        //kpi数据
        DataService.requestData('80','get',$scope.visitData,filter).then(function (msg) {
            $scope.doctorFee.kpi = msg;
        });
        //图形数据
        DataService.requestData('81','get',$scope.visitData,filter).then(function (msg) {
            var xAxis = [{label:'药品收费',key:'ypsf_size'},{label:'检查收费',key:'jcsf_size'},
                {label:'检验收费',key:'jysf_size'},{label:'医事服务费',key:'ysfwf_size'},{label:'治疗收费',key:"zlsf_size"}];
            msg.$xAxis = xAxis;  //y轴显示的不同柱堆叠的标识
            msg.$yName = "元";
            
            DrawEchartService.getChartData('verticalStackBar','verticalDoctorFee',msg,$scope.getDocPerFee,'type');
        });
    }
    /**
     * 某医生患者人均次均费用
     * @param type
     */
    $scope.getDocPerFee = function (type) {
        $scope.doctorFee.docName = type;
        if(type){
            var filter={department:$scope.doctorFee.department,doctorType:$scope.doctorFee.number,
                patientIdentity:$scope.doctorFee.identity,docName:type};
            DataService.requestData('112','get',$scope.visitData,filter).then(function (msg) {
                msg.$yName = '人次';
                DrawEchartService.getChartData('verticalBar','verticalBarPatient',msg,$scope.getpatientPerFee,'type');
            });
        }else{
            $('#verticalBarPatient').text("服务器忙,请稍后再试");
        }
    }
    /**
     * 某医生患者人均次均费用下的患者列表
     * @param type
     */
    $scope.getpatientPerFee = function (type) {
        if(type){
            var filter={department:$scope.doctorFee.department,doctorType:$scope.doctorFee.number,
                patientIdentity:$scope.doctorFee.identity,detailType:type,docName:$scope.doctorFee.docName};
            $scope.doctorFee.rightTable = ChartColumnService.tableCostPatient();
            if(type == '次均费用'){
                setPerFeeTitle('','次均');
            }else if(type == '次均药品费用'){
                setPerFeeTitle('药品','药');
            }else if(type == '次均检验费用'){
                setPerFeeTitle('检验','检验');
            }else if(type == '次均检查费用'){
                setPerFeeTitle('检查','检查');
            }else if(type == '次均治疗费用'){
                setPerFeeTitle('治疗','治疗');
            }
            DataService.requestData('113','get',$scope.visitData,filter).then(function (msg) {
                $scope.doctorFee.changedData = msg;
            });
        }else{
            $scope.doctorFee.changedData.data = null;
            $scope.doctorFee.changedData.description = "系统繁忙,请稍后重试";
        }
    }
    function setPerFeeTitle(fee,radio){
        //这个把次均费用去掉
        if(fee == ''){
            $scope.doctorFee.rightTable.child[4].name = radio+'占比';
            $scope.doctorFee.rightTable.child.pop();
        }else{
            $scope.doctorFee.rightTable.child[4].name = fee+'费用';
            $scope.doctorFee.rightTable.child[5].name = radio+'占比';
        }
    }

    /**
     *患者退费情况监控
     */
    $scope.getPatientRetreatFee = function () {
        var filter={department:$scope.patientRetreatFee.department,doctorType:$scope.patientRetreatFee.number,
            patientIdentity:$scope.patientRetreatFee.identity};
        //kpi数据
        DataService.requestData('114','get',$scope.visitData,filter).then(function (msg) {
            $scope.patientRetreatFee.kpi = msg;
        });
        //图形数据
        DataService.requestData('115','get',$scope.visitData,filter).then(function (msg) {
            var xAxis = [{label:'今日总退费',key:'jrztf_size'},{label:'医事服务费',key:'ysfwf_size'},{label:'药品退费',key:'yptf_size'},
                {label:'检查退费',key:'jctf_size'},{label:'检验退费',key:'jytf_size'},{label:'治疗退费',key:'zltf_size'}];
            msg.$xAxis = xAxis;  //y轴显示的不同柱堆叠的标识
            msg.$yName = "元";
            DrawEchartService.getChartData('verticalStackBar','verticalPatientFee',msg);
        });
    }

    //获取页面中所有需要的数据
    $scope.changeList = function () {
        //收费总体情况
        DataService.requestData('74','get',$scope.visitData).then(function (msg) {
            $scope.overallKpiTop = DataAdapter.transformKpi(KpiColumnService.kpiTotalChargeTop(),$.extend(true,{},msg));
            $scope.overallKpiBottom = DataAdapter.transformKpi(KpiColumnService.kpiTotalChargeBottom(),$.extend(true,{},msg));
        });
        $scope.getPaymentType();
        $scope.getPayService();
        $scope.getDoctorFee();
        $scope.getPatientRetreatFee();
    }

    $scope.init();

    //实时请求数据
    $scope.intervalFun = PageInteractiveService.setIntervalData($scope.init);
    $scope.$on("$destroy", function() {
        PageInteractiveService.clearInterval($scope.intervalFun);
    })
}]);