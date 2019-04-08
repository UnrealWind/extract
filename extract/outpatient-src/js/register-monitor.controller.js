angular.module('infi-basic').controller('RegisterMonitorController', ['PrintListService','PageInteractiveService','$scope', 'DataService', 'SYS','DrawEchartService','DataAdapter','KpiColumnService','ChartColumnService','$interval',function (PrintListService,PageInteractiveService,$scope, DataService, SYS,DrawEchartService,DataAdapter,KpiColumnService,ChartColumnService,$interval) {
    $scope.SYS = SYS;
    $scope.dimension = {
        deptList:null,//科室列表
        identityList:null//身份列表
    }
    
    $scope.tableColumn = {  //现场预约他日号源监控左右侧table的id
        leftTable:"leftTableNum",
        rightTable:"rightTableNum"
    }
    
    function Initialization() {
        $scope.overallKpi = null;  //今日挂号总体情况
        $scope.constitutionMonitor = {  //今日挂号构成监控数据
            staticData:null,  //挂号时段构成
            type:"0"  //挂号时段构成选择的类型
        }
        $scope.statusMonitor = {  //今日挂号情况监控
            type:"0",  //挂号类型
            department:""  //科室
        }
        $scope.channelMonitor = {  //门诊挂号渠道监控
            outpatient:null,
            self:null,
            identity:"",   //选择的身份
            number:""  //选择的号类
        }
        $scope.todayNumResource = {  //现场预约今日号源监控
            kpi:null,
            identity:"",   //选择的身份
            number:""  //选择的号类
        }
        $scope.otherNumResource = {   //现场预约他日号源监控
            kpi:null,   //变化的kpi数据
            searchedData:null,  //变化的左侧数据
            otherDate:"",    //预约的他日时间
            changedData:null,  //变化的右侧数据
            region:""   //选择的地域
        }
        $scope.missOverall = {   //今日爽约总体情况
            number:"",  //选择的号类
            noNoData:null,  //查询到的预约未取号数据
            noDiagnosisData:null  //查询到的挂号未诊分布数据
        }
        $scope.retreatOverall = {  //今日退号总体情况
            kpi:null,  //kpi数据
            department:"",   //选择的科室
            number:"",  //选择的号类
            channel:""  //选择的挂号途径
        }
    }
    $(".infi-main").scrollTop(0);  //跳转到此页面,从页面头部开始浏览
    //设置当前时间，用于打印显示
    $scope.now = new Date();
    $interval(function () {
        $scope.now = new Date();
    }, 1000);
    $scope.init = function() {
        //当前时间
        $scope.visitData = PageInteractiveService.getTodayTime();

        //获取打印id列表，并与allList匹配
        $scope.ids = PrintListService.getRegMonIds($scope.printAllList);
        //获取身份
        DataService.requestData('39','get').then(function (msg) {
            $scope.dimension.identityList = msg;
        });
        //获取科室名称
        DataService.requestData('15','get').then(function (msg) {
            $scope.dimension.deptList = msg;
            msg.status == SYS.STATUS_SUCCESS&&msg.data.status == SYS.STATUS_SUCCESS ? $scope.dimension.deptList.data.result.unshift({
                dept_id:"",dept_name:"全院"
            }): undefined;
        });
        //获取'今日挂号总体情况'与'预约今日号源监控'数据
        DataService.requestData('21','get',$scope.visitData).then(function (msg) {
            $scope.overallKpi = DataAdapter.transformKpi(KpiColumnService.kpiRegisterToday(),msg);
        });
        //获取'今日挂号构成监控'数据
        $scope.changeConstitutionData();
        //获取'今日挂号情况监控'数据
        $scope.changeStatusData();
        //获取'门诊挂号渠道监控'数据
        $scope.changeChannelData();
        //获取'现场预约今日号源监控'数据
        DataService.requestData('27','get',$scope.visitData).then(function (msg) {
            $scope.todayNumResource.kpi = DataAdapter.transformKpi(KpiColumnService.kpiBookingToday(),msg);
        });
        $scope.changeTodayNumData();
        //获取'现场预约他日号源监控'数据
        $scope.changeOtherNumData();
        //获取'今日爽约总体情况'数据
        $scope.changeMissOverallData();
        //获取'今日退号总体情况'数据
        $scope.changeRetreatOverallData();
    }

    /**
     * 
     * 挂号时段构成/首次挂号患者情况图形绘制
     * @param {*} urlId   请求的接口
     * @param {*} filter  筛选条件
     * @param {*} original 
     * @param {*} id     html的id
     * @param {*} callback 
     */
    function drawRegisterTodayData(urlId,filter,original,id,callback) {
        DataService.requestData(urlId,'get',$scope.visitData,filter).then(function (msg) {
            //根据选择的不同的诊断类型绘制不同的图形
            var originalMsg = angular.copy(msg);//这个是为了获取原始数据的第一个type，因为后来会对msg格式化
            original.type == "0"?DataAdapter.transformNested(msg):DataAdapter.transformPie(msg);
            if(msg.status == $scope.SYS.STATUS_SUCCESS){
                original.type == "0"?DrawEchartService.drawChart('nested',id,msg,callback):DrawEchartService.drawChart('pie',id,msg,callback);
                callback?callback(originalMsg.data.result[0].type):undefined;  //联动,获取下级数据.开始获取所有数据
            }else{
                callback?callback():undefined;  //上次数据不成功->联动,获取下级数据
                $("#"+id).text(msg.description);
            }
        });
    }

    /**
     * 获取'今日挂号构成监控'数据
     */
    $scope.changeConstitutionData = function () {
        var filter = {diagType:$scope.constitutionMonitor.type};
        drawRegisterTodayData(22,filter,$scope.constitutionMonitor,'nestedTimeInterval',getRegisterType);
    }
    /**
     * 获取'今日挂号情况监控'数据
     */
    $scope.changeStatusData = function () {
        var filter = {diagType:$scope.statusMonitor.type,department:$scope.statusMonitor.department};
        //首次挂号患者情况
        drawRegisterTodayData(104,filter,$scope.statusMonitor,'nestedFirstRegistration');
        //再次挂号患者情况
        drawRegisterTodayData(105,filter,$scope.statusMonitor,'nestedAgainRegistration');
    }

    /**
     * 获取'门诊挂号渠道监控'数据
     */
    $scope.changeChannelData = function () {
        var filter = {identity:$scope.channelMonitor.identity,number:$scope.channelMonitor.number};
        DataService.requestData('25','get',$scope.visitData,filter).then(function (msg) {
            DrawEchartService.getChartData('nested','nestedEmergencyRegistration',msg);
        });
        DataService.requestData('26','get',$scope.visitData,filter).then(function (msg) {
            DrawEchartService.getChartData('nested','nestedAutonomyRegistration',msg);
        });
    }
    /**
     * 获取'预约今日号源监控'数据
     */
    $scope.changeTodayNumData = function () {
        var filter = {identity:$scope.todayNumResource.identity,number:$scope.todayNumResource.number};
        DataService.requestData('28','get',$scope.visitData,filter).then(function (msg) {
            DataAdapter.transformBar(msg,'horizontal');
            if(msg.status == $scope.SYS.STATUS_SUCCESS){
                $("#barChannel").removeAttr('_echarts_instance_');
                msg.$xName = "人次";  //x轴单位
                msg.$tooltipName = "人次";  //tooltip单位
                DrawEchartService.drawChart('bar','barChannel',msg,getTakeNoData);
                var last = msg.dataAxis.length-1;
                getTakeNoData(msg.dataAxis[last].type);
            }else{
                $("#barChannel").text(msg.description);
                getTakeNoData();//上次数据不成功->联动,获取下级数据
            }
        });
    }
    /**
     * 获取'现场预约他日号源监控'数据
     */
    $scope.changeOtherNumData = function () {
        var filter = {region:$scope.otherNumResource.region};
        //获取kpi数据
        DataService.requestData('30','get',$scope.visitData,filter).then(function (msg) {
            $scope.otherNumResource.kpi = msg;
        });
        $scope.changeOtherNumDateData();
    }
    /**
     * 获取'现场预约他日号源监控'中他日时间的数据
     */
    $scope.changeOtherNumDateData = function () {
        var filter = {region:$scope.otherNumResource.region,otherDate:$scope.otherNumResource.otherDate}
        DataService.requestData('31','get',$scope.visitData,filter).then(function (msg) {
            $scope.otherNumResource.searchedData = msg;
            if(msg.status == $scope.SYS.STATUS_SUCCESS&&msg.data.result.length>0){
                $scope.getOtherListData(msg.data.result[0].dept);
            }else{
                $scope.getOtherListData(); //上次数据不成功->联动,获取下级数据
            }
        });
    }

    /**
     * 查看全部的'现场预约他日号源监控'
     */
    $scope.selectAllOtherNum = function () {
        $scope.otherNumResource.otherDate = "";
        $scope.changeOtherNumDateData();
    }
    
    /**
     * 获取'今日爽约总体情况'数据
     */
    $scope.changeMissOverallData = function () {
        var filter = {number:$scope.missOverall.number};
        DataService.requestData('33','get',$scope.visitData,filter).then(function (msg) {
            $scope.missOverall.kpi = DataAdapter.transformKpi(KpiColumnService.kpiMissToday(),msg);
        });
        DataService.requestData('34','get',$scope.visitData,filter).then(function (msg) {
            DrawEchartService.getChartData('pie','pieNoTakeNo',msg);
        });
        DataService.requestData('35','get',$scope.visitData,filter).then(function (msg) {
            DrawEchartService.getChartData('pie','pieNoDiagnosis',msg);
        });
    }
    /**
     * 获取'今日退号总体情况'数据
     */
    $scope.changeRetreatOverallData = function () {
        var filter = {department:$scope.retreatOverall.department,number:$scope.retreatOverall.number,
            channel:$scope.retreatOverall.channel};
        DataService.requestData('36','get',$scope.visitData,filter).then(function (msg) {
            $scope.retreatOverall.kpi = DataAdapter.transformKpi(KpiColumnService.kpiBackNoToday(),msg);
        });
        DataService.requestData('37','get',$scope.visitData,filter).then(function (msg) {
            msg.$xName = "时间";
            msg.$yName = "人次";
            msg.$tooltipName = "次数";
            DrawEchartService.getChartData('verticalBar','barBackNumber',msg,getRetreatChannel,'type');
        });
    }

    Initialization();
    $scope.init();

    /**
     * 挂号类型构成与挂号身份构成图形绘制
     * @param type  选择的类型
     */
    function getRegisterType(type) {
        if(type||type==""){
            var filter = {type:type};
            DataService.requestData('23','get',$scope.visitData,filter).then(function (msg) {
                DrawEchartService.getChartData('pie','pieType',msg);
            });
            DataService.requestData('24','get',$scope.visitData,filter).then(function (msg) {
                DrawEchartService.getChartData('pie','pieIdentity',msg);
            });
        }else{
            $("#pieType").text('服务器忙,请稍后再试');
            $("#pieIdentity").text('服务器忙,请稍后再试');
        }
    }

    /**
     * 取号方式图形绘制
     * @param type  选择的类型
     */
    function getTakeNoData(type) {
        if(type){
            var filter = {identity:$scope.todayNumResource.identity,number:$scope.todayNumResource.number,type:type};
            DataService.requestData('29','get',$scope.visitData,filter).then(function (msg) {
                $scope.todayNumResource.takeNoType = type;   //取号情况'全部'后面显示的左侧点击的name
                DrawEchartService.getChartData('pie','pieTakeNo',msg);
            });
        }else{
            $("#pieTakeNo").text('服务器忙,请稍后再试');
            $scope.todayNumResource.takeNoType = "";
        }
    }

    /**
     * 退号途径图形绘制
     * @param type
     */
    function getRetreatChannel(type) {
        if(type){
            var filter = {department:$scope.retreatOverall.department,number:$scope.retreatOverall.number,
                channel:$scope.retreatOverall.channel,type:type};
            DataService.requestData('45','get',$scope.visitData,filter).then(function (msg) {
                DrawEchartService.getChartData('pie','pieBackNumber',msg);
            });
        }else{
            $("#pieBackNumber").text("服务器忙,请稍后再试");
        }
    }

    /**
     * 获取'预约他日号源清单'
     * @param department
     */
    $scope.getOtherListData = function(department) {
        if(department){
            var filter = {region:$scope.otherNumResource.region,otherDate:$scope.otherNumResource.otherDate,department:department};
            DataService.requestData('32','get',$scope.visitData,filter).then(function (msg) {
                $scope.otherNumResource.changedData = msg;
                $scope.otherNumResource.rightColumn = ChartColumnService.tableOhterDayNum();
            });
        }else{
            $scope.otherNumResource.changedData = null;
        }
    }

    //实时请求数据
    $scope.intervalFun = PageInteractiveService.setIntervalData($scope.init);
    //页面离开时清除监控,否则会一直执行
    $scope.$on("$destroy", function() {
        PageInteractiveService.clearInterval($scope.intervalFun);
    })
}]);