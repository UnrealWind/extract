angular.module('infi-basic').controller('ChargeAnalysisController', ['$scope', 'DataService', 'SYS','DrawEchartService','PageInteractiveService','DataAdapter','ChartColumnService','KpiColumnService','PrintListService', function ($scope, DataService, SYS,DrawEchartService,PageInteractiveService,DataAdapter,ChartColumnService,KpiColumnService,PrintListService) {
    $scope.SYS = SYS;
    $scope.searchDate = PageInteractiveService.setTimeRange();
    $scope.deptList = null;  //科室列表
    $scope.hospitalCharge = {  //全院收费概况
        patientIdentity:'',  //患者身份
        staType:"day",  //收费趋势统计类型
        recordData:null,  //收费趋势返回的数据
        itemType:'testItem',  //排行类型
        rankType:'fy_size',  //收费/人次
        viewSize:'5'  //显示个数
    };
    $scope.deptCharge = {  //科室收费概况
        patientIdentity:'',  //患者身份
        range:'zsf_desc',  //表格选择的排行
        staType:"day",  //收费趋势统计类型
        recordData:null,  //收费趋势返回的数据
        itemType:'testItem',  //排行类型
        rankType:'fy_size',  //收费/人次
        viewSize:'5'  //显示个数
    };
    $scope.docCharge = {  //医生收费概况
        patientIdentity:'',  //患者身份
        doctorType:'',  //医生类型
        department:'',  //科室
        staType:"day",  //收费趋势统计类型
        range:'zsf_desc',  //表格选择的排行
        recordData:null,  //收费趋势返回的数据
        itemType:'testItem',  //排行类型
        rankType:'fy_size',  //收费/人次
        viewSize:'5'  //显示个数
    };
    $(".infi-main").scrollTop(0);
    $scope.init = function () {
        //获取打印列表集合，并与allList匹配
        $scope.ids = PrintListService.getChaAnaIds($scope.printAllList);
        $scope.daysbtnList = ChartColumnService.filterDaysBtnList();  //按天/周/月统计按钮列表
        $scope.projectbtnList = ChartColumnService.filterProjectBtnList(); //检验项目,检查项目,药品按钮列表  
        $scope.chartbtnList = ChartColumnService.filterChartBtnList(); //按收费/人次排行列表
        //科室
        DataService.requestData('15','get').then(function (msg) {
            $scope.deptList = msg;
            msg.status == SYS.STATUS_SUCCESS&&msg.data.status == SYS.STATUS_SUCCESS ? $scope.deptList.data.result.unshift({
                dept_id:"",dept_name:"全院"
            }): undefined;
        });
        //指标
        DataService.requestData('93','get').then(function (msg) {
            if(msg.status==SYS.STATUS_SUCCESS&&msg.data.status==SYS.STATUS_SUCCESS){
                angular.forEach(msg.data.result,function (result) {
                    result.checked == 'true'?result.$checked = true:result.$checked = false;
                });
            }
            $scope.hospitalCharge.selectTypeList = $.extend(true,{},msg);  //全院收费概况-指标列表
            $scope.getChargingTrends();  //全院收费趋势,指标列表获取到再一次绘图
            $scope.deptCharge.selectTypeList = $.extend(true,{},msg);  //科室收费概况-指标列表
            $scope.getDeptChargingTrends(); //科室收费趋势,指标列表获取到再一次绘图
            $scope.docCharge.selectTypeList = $.extend(true,{},msg);  //医生收费概况-指标列表
            $scope.getDocChargingTrends(); //科室收费趋势,指标列表获取到再一次绘图
        });
        $scope.getChartList();
    };

    /**
     * 绘制环形图
     * @param filter  筛选条件
     * @param id  要绘图的id
     * @param urlId  后台请求的id
     * @param callback 联动的另外一个图绘制方法
     * @param isSelectChild 科室等环形嵌套图需要选择科室等,没有科室则不绘图
     */
    function drawNestChart(filter,id,urlId,callback,isSelectChild) {
        if((isSelectChild&&isSelectChild!='')||!isSelectChild){
            DataService.requestData(urlId,'get',undefined,filter).then(function (msg) {
                DrawEchartService.getChartData('nested',id,msg,callback,'type');
            });
        }else{
            $('#'+id).text('服务器忙,请稍后再试');
            callback();
        }
    }

    /**
     * 绘制饼图
     * @param filter
     * @param id
     * @param urlId
     * @param type 选择的环形图的某一项
     */
    function drawPieChart(filter,id,urlId,type) {
        if(type){  //环形图正常选择才会绘制饼图
            DataService.requestData(urlId,'get',undefined,filter).then(function (msg) {
                DrawEchartService.getChartData('pie',id,msg);
            });
        }else{
            $('#'+id).text('服务器忙,请稍后再试');
        }
    }

    /**
     * 线图绘制
     * @param isSelectType 标示是否点击指标绘图,点击指标则不用重新向后台请求数据
     * @param original  记录的原始数据
     * @param filter
     * @param id
     * @param urlId
     */
    function drawLineChart(isSelectType,original,filter,id,urlId,isSelectChild) {
        if((isSelectChild&&isSelectChild!='')||!isSelectChild){
            if(isSelectType){
                drawChart(original.recordData);
            }else{
                DataService.requestData(urlId,'get',undefined,filter).then(function (msg) {
                    original.recordData = msg;
                    drawChart(msg);
                });
            }
        }else{
            $('#'+id).text('服务器忙,请稍后再试');
        }


        function drawChart(msg) {
            if(original.selectTypeList.data.status==SYS.STATUS_SUCCESS){//指标有数据才能绘图
                msg.chartData = { //盛放拼写的折线图的数据
                    xAxis : [],  //x轴
                    xAxisMapping:{}, //x轴的mapping数据
                    data:{}  //绘制图形的线数据
                };
                msg.$selectType = original.selectTypeList.data.result;
                msg.$staType = original.staType;  //图形tooltip根据选择的不同'统计类型'显示不同的提示
                msg.$yName = "元";
                DrawEchartService.getChartData('line',id,msg);
            }else{
                $('#'+id).text('服务器忙,请稍后再试');
            }
        }
    }

    /**
     * 条形图绘制
     * @param filter
     * @param id
     * @param urlId
     */
    function drawBarChart(filter,id,urlId,isSelectChild) {
        if((isSelectChild&&isSelectChild!='')||!isSelectChild){
            DataService.requestData(urlId,'get',undefined,filter).then(function (msg) {
                DataAdapter.transformBar(msg,'horizontal');
                if(msg.status == SYS.STATUS_SUCCESS){
                    $('#'+id).removeAttr('_echarts_instance_');
                    // PageInteractiveService.transformCostRankName(msg);  //去掉了收费条形图左侧名称部分显示
                    msg.$tooltipName = filter.rankType == 'fy_size'?'收费':'人次';
                    msg.$xName = filter.rankType == 'fy_size'?"元":"人";
                    DrawEchartService.drawChart('bar',id,msg);
                }else{
                    $('#'+id).text(msg.description);
                }
            });
        }else{
            $('#'+id).text('服务器忙,请稍后再试');
        }
    }

    /**
     * 表格绘制
     * @param original  保存的原始数据
     * @param filter
     * @param urlId
     */
    function drawTable(original,filter,urlId,callback) {
        DataService.requestData(urlId,'get',undefined,filter).then(function (msg) {
            original.tableData = msg;
            //默认取表格第一行联动其他图形
            original.selectedColumn = msg.status == SYS.STATUS_SUCCESS&&msg.data.status == SYS.STATUS_SUCCESS?msg.data.result[0]:null;
            callback(original.selectedColumn);
        });
    }
    /**
     * 堆叠图的绘制
     * @param original  保存的原始数据
     * @param filter
     * @param urlId
     */
    function drawStackBar(original,filter,urlId,id,isSelectType) {
        if(filter.docName){  //医生姓名存在才绘图
            if(isSelectType){
                drawChart(original.recordData);
            }else{
                DataService.requestData(urlId,'get',undefined,filter).then(function (msg) {
                    original.recordData = msg;
                    drawChart(msg);
                });
            }
        }else{
            $('#'+id).text('服务器忙,请稍后再试');
        }

        function drawChart(msg) {
            if(original.selectTypeList.data.status==SYS.STATUS_SUCCESS) {//指标有数据才能绘图
                var xAxis = [];
                angular.forEach(original.selectTypeList.data.result,function (result) {
                    if(result.$checked){
                        xAxis.push(result);
                    }
                });
                msg.$xAxis = xAxis;  //y轴显示的不同柱堆叠的标识
                msg.$projectType = 'docPaymentType';  //标示柱状堆叠图的tooltip需要重新
                msg.$yName = "元";
                DrawEchartService.getChartData('verticalStackBar',id,msg);
            }else{
                $('#'+id).text('服务器忙,请稍后再试');
            }
        }
    }

    //所有接口调用,方便时间选择
    $scope.getChartList = function () {
        DataService.requestData('90','get',undefined,$scope.searchDate).then(function (msg) {
            $scope.overallKpiTop = DataAdapter.transformKpi(KpiColumnService.kpiTotalChargeTop(),$.extend(true,{},msg));
            $scope.overallKpiBottom = DataAdapter.transformKpi(KpiColumnService.kpiTotalChargeBottom(),$.extend(true,{},msg));
        });
        $scope.getHospitalCharge();  //全院收费概况
        $scope.getDeptCharge();  //科室收费概况
        $scope.getDocCharge();  //科室收费概况
    };

    /**
     * 全院收费概况
     */
    $scope.getHospitalCharge = function () {
        var filter = {patientIdentity:$scope.hospitalCharge.patientIdentity,startDate:$scope.searchDate.startDate,
            endDate:$scope.searchDate.endDate};
        drawNestChart(filter,'nestedPaymentType',91,$scope.getHospitalPaymentProject);  //付费类型构成
        $scope.getChargingTrends();  //全院收费趋势
        $scope.getPayService();  //全院收费项目排行
    };

    /**
     * 医院付费项目
     * @param type  选择的付费类型
     */
    $scope.getHospitalPaymentProject = function (type) {
        var filter = {patientIdentity:$scope.hospitalCharge.patientIdentity,startDate:$scope.searchDate.startDate,
            endDate:$scope.searchDate.endDate,type:type};
        drawPieChart(filter,'piePayItem',92,type);
    };

    /**
     * 全院收费趋势
     * @param isSelectType  标示是点击的指标,不用向后台重新读取数据
     */
    $scope.getChargingTrends = function (isSelectType) {
        var filter={patientIdentity:$scope.hospitalCharge.patientIdentity,startDate:$scope.searchDate.startDate,
            endDate:$scope.searchDate.endDate,staType:$scope.hospitalCharge.staType};
        drawLineChart(isSelectType,$scope.hospitalCharge,filter,'lineChargingTrends',94);
    };
    /**
     * 全院收费项目排行
     */
    $scope.getPayService = function () {
        var filter={patientIdentity:$scope.hospitalCharge.patientIdentity,startDate:$scope.searchDate.startDate,
            endDate:$scope.searchDate.endDate,itemType:$scope.hospitalCharge.itemType,
            rankType:$scope.hospitalCharge.rankType,viewSize:$scope.hospitalCharge.viewSize};
        drawBarChart(filter,'barPayService',95);
    };
    //科室收费概况
    $scope.getDeptCharge = function (type) {
        $scope.deptCharge.range = type?type:$scope.deptCharge.range;  //表格表头小箭头点击切换数据
        var filter = {patientIdentity:$scope.deptCharge.patientIdentity,startDate:$scope.searchDate.startDate,
            endDate:$scope.searchDate.endDate,rankType:$scope.deptCharge.range};
        drawTable($scope.deptCharge,filter,96,$scope.getDeptLinkage);
    };
    //科室一系列联动方法
    $scope.getDeptLinkage = function (entity) {
        $scope.deptCharge.selectedColumn = entity;
        var filter = {patientIdentity:$scope.deptCharge.patientIdentity,startDate:$scope.searchDate.startDate,
            endDate:$scope.searchDate.endDate,department:$scope.deptCharge.selectedColumn?$scope.deptCharge.selectedColumn.deptName:null};
        drawNestChart(filter,'nestedDeptPaymentType',97,$scope.getDeptPaymentProject,filter.department?filter.department:'');  //科室付费类型构成
        $scope.getDeptChargingTrends();
        $scope.getDeptPayService();
    };
    //科室付费项目
    $scope.getDeptPaymentProject = function (type) {
        var filter = {patientIdentity:$scope.deptCharge.patientIdentity,startDate:$scope.searchDate.startDate,
            endDate:$scope.searchDate.endDate,department:$scope.deptCharge.selectedColumn?$scope.deptCharge.selectedColumn.deptName:null,type:type};
        drawPieChart(filter,'pieDeptPayItem',98,type&&filter.department);
    };

    /**
     * 科室收费趋势
     * @param isSelectType  标示是点击的指标,不用向后台重新读取数据
     */
    $scope.getDeptChargingTrends = function (isSelectType) {
        var filter={patientIdentity:$scope.deptCharge.patientIdentity,startDate:$scope.searchDate.startDate,
            endDate:$scope.searchDate.endDate,staType:$scope.deptCharge.staType,
            department:$scope.deptCharge.selectedColumn?$scope.deptCharge.selectedColumn.deptName:null};
        drawLineChart(isSelectType,$scope.deptCharge,filter,'lineDeptChargingTrends',99,filter.department?filter.department:'');
    };
    /**
     * 科室收费项目排行
     */
    $scope.getDeptPayService = function () {
        var filter={patientIdentity:$scope.deptCharge.patientIdentity,startDate:$scope.searchDate.startDate,
            endDate:$scope.searchDate.endDate,itemType:$scope.deptCharge.itemType,
            rankType:$scope.deptCharge.rankType,viewSize:$scope.deptCharge.viewSize,
            department:$scope.deptCharge.selectedColumn?$scope.deptCharge.selectedColumn.deptName:null};
        drawBarChart(filter,'barDeptPayService',100,filter.department?filter.department:'');
    };
    //医生收费概况
    $scope.getDocCharge = function (type) {
        $scope.docCharge.range = type?type:$scope.docCharge.range;  //表格表头小箭头点击切换数据
        var filter = {patientIdentity:$scope.docCharge.patientIdentity,startDate:$scope.searchDate.startDate,
            endDate:$scope.searchDate.endDate,rankType:$scope.docCharge.range,department:$scope.docCharge.department,
            doctorType:$scope.docCharge.doctorType};
        drawTable($scope.docCharge,filter,101,$scope.getDocLinkage);
    };
    //医生一系列联动方法
    $scope.getDocLinkage = function (entity) {
        $scope.docCharge.selectedColumn = entity;
        $scope.getDocChargingTrends();
        $scope.getDocPayService();
    };
    /**
     * 科室收费趋势
     * @param isSelectType  标示是点击的指标,不用向后台重新读取数据
     */
    $scope.getDocChargingTrends = function (isSelectType) {
        var filter = {patientIdentity:$scope.docCharge.patientIdentity,startDate:$scope.searchDate.startDate,
            endDate:$scope.searchDate.endDate,department:$scope.docCharge.department,doctorType:$scope.docCharge.doctorType,
            staType:$scope.docCharge.staType,docName:$scope.docCharge.selectedColumn?$scope.docCharge.selectedColumn.doc_name:null};
        drawStackBar($scope.docCharge,filter,102,'barDocPaymentType',isSelectType);
    };
    /**
     * 科室收费项目排行
     */
    $scope.getDocPayService = function () {
        var filter={patientIdentity:$scope.docCharge.patientIdentity,startDate:$scope.searchDate.startDate,
            endDate:$scope.searchDate.endDate,itemType:$scope.docCharge.itemType,
            rankType:$scope.docCharge.rankType,viewSize:$scope.docCharge.viewSize,
            department:$scope.docCharge.department,docName:$scope.docCharge.selectedColumn?$scope.docCharge.selectedColumn.doc_name:null};
        drawBarChart(filter,'barDocPayService',103,filter.deparment?filter.deparment:'');
    };

    $scope.init();
}]);