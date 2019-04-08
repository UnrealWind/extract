angular.module('infi-basic').controller('VisitMonitorController', ['PageInteractiveService','$scope', 'DataService', 'SYS','DrawEchartService','DataAdapter','ChartColumnService','PrintListService','$interval', function (PageInteractiveService,$scope, DataService, SYS,DrawEchartService,DataAdapter,ChartColumnService,PrintListService,$interval) {
    $scope.SYS = SYS;
    $scope.deptList = null;  //科室列表
    $scope.overallKpi = null;  //就诊总体情况
    $scope.patientAllocation = {  //医患配置数据
        department:"",  //选择的科室
        number:"", //选择的号类
        count:null,  //今日统计数据
        meanValue:null //历史均值数据
    }
    $scope.departmentVisits = {  //科室就诊情况监控
        department:"",  //选择的科室
        visitType:"上午",  //科室就诊情况选择的时间
        workType:"上午"  //专家工作情况选择的时间
    }
    $scope.docVisits = {  //医生接诊情况监控
        department:"",  //选择的科室
        number:"", //选择的号类
        visitType:"上午",  //科室就诊情况选择的时间
        searchedData:null,  //医生接诊情况
        changedData:{},  //患者情况数据
        tableColumn:{
            leftTable:"leftTableNum",
            rightTable:"rightTableNum"
        }
    }
    $scope.patientReport = {  //患者报到情况监控
        department:"",  //选择的科室
        number:"", //选择的号类
        visitType:"上午",  //科室就诊情况选择的时间
        changedData:{}  //患者情况数据
    }
    $scope.patientVisits = {  //患者就诊情况监控
        department:"",  //选择的科室
        number:"", //选择的号类
        visitType:"上午",  //科室就诊情况选择的时间
        changedData:{}  //患者情况数据
    }
    //设置当前时间，用于打印显示
    $scope.now = new Date();
    $interval(function () {
        $scope.now = new Date();
    }, 1000);

    //医患配置数据
    $scope.changePatientAllocation = function () {
        var filter = {department:$scope.patientAllocation.department,number:$scope.patientAllocation.number};
        //今日统计数据
        DataService.requestData('61','get',$scope.visitData,filter).then(function (msg) {
            $scope.patientAllocation.count = msg;
        });
        //历史均值数据
        DataService.requestData('62','get',$scope.visitData,filter).then(function (msg) {
            $scope.patientAllocation.meanValue = msg;
        });
        //医患比
        DataService.requestData('63','get',$scope.visitData,filter).then(function (msg) {
            var title = [{label:'今日统计',key:'outpatient_size_total',type:'bar'},{label:'历史均值',key:'outpatient_history_total',type:'bar'}];
            msg.$title = title;  //柱状图,折线图的title标示
            msg.$xAxis = 'time';  //x轴显示的内容对应的后台给的key
            msg.yAxis = [{name:'门急诊量'}];  //y轴显示的名称和最大值\最小值
            msg.$minMax = 'no'; //不需要最大值,最小值
            DrawEchartService.getChartData('line-bar','lineBarPatientRatio',msg);
        });
    }

    /**
     * 获取就诊科室情况数据
     * @param type  选择的时间类型
     */
    $scope.changeVisit = function (type) {
        $scope.departmentVisits.visitType = type;
        var filter = {department:$scope.departmentVisits.department,time:type};
        DataService.requestData('64','get',$scope.visitData,filter).then(function (msg) {
            $scope.departmentVisits.leftTable=ChartColumnService.tableVisitSituation();
            $scope.departmentVisits.deptList = {};
            if(msg.status==SYS.STATUS_SUCCESS&&msg.data.status==SYS.STATUS_SUCCESS){
                $scope.departmentVisits.deptList = {status:'ok',data:{result:[{name:'普通'},{name:'专家'}]}};
                var demission = [{name:'已诊人数',key:'already'},{name:'未诊人数',key:'noAlready'},{name:'医生数',key:'doc'}];
                angular.forEach(msg.data.result,function (entity) {
                    angular.forEach(demission,function (dem) {
                        if(dem.name == entity.name){
                            $scope.departmentVisits.deptList.data.result[entity.type][dem.key] = entity.value;
                        }
                    });
                });
            }else{
                $scope.departmentVisits.deptList.status = 'error';
            }
        });
    }

    /**
     * 获取专家工作情况数据
     * @param type  选择的时间类型
     */
    $scope.changeWork = function (type) {
        $scope.departmentVisits.workType = type;
        var filter = {department:$scope.departmentVisits.department,time:type};
        DataService.requestData('65','get',$scope.visitData,filter).then(function (msg) {
            msg.$projectType = 'departmentVisits';  //此处垂直柱状图tooltip要显示列表,要重写绘图的formatter方法
            msg.$yName = "人次";
            DrawEchartService.getChartData('verticalBar','verticalBarWork',msg);
        });
    }
    
    /**
     * 获取医接诊时间监控-患者情况
     */
    $scope.changeTimePatient = function (doctype) {
        var filter = {department:$scope.docVisits.department,number:$scope.docVisits.number,
            time:$scope.docVisits.visitType,docName:doctype};
        if(doctype){
            DataService.requestData('107','get',$scope.visitData,filter).then(function (msg) {
                $scope.docVisits.rightTable = ChartColumnService.tableDocVisitTimePatient();
                $scope.docVisits.changedData = msg;
            });
        }else{
            $scope.docVisits.changedData.data.result.length = 0;
            $scope.docVisits.changedData.description = "服务器忙,请稍后再试";
        }
    }
    /**
     * 未报到患者详情
     */
    $scope.changeNoReport = function (num) {
        $scope.patientReport.selectName = num;
        var filter = {department:$scope.patientReport.department,number:$scope.patientReport.number,
            time:$scope.patientReport.visitType,detailType:num};
        $scope.patientReport.rightTable = ChartColumnService.tableNoVisit();
        if(num){
            if(num == "已就诊人数"){
                $scope.patientReport.rightTable.child.push({name:"就诊时长",key:"visit_time"});
            }else if(num == "候诊人数"){
                $scope.patientReport.rightTable.child.push({name:"候诊时长",key:"wait_time"});
            }
            DataService.requestData('109','get',$scope.visitData,filter).then(function (msg) {
                $scope.patientReport.changedData = msg;
            });
        }else{
            $scope.patientReport.changedData.description = "服务器忙,请稍后再试";
        }
    }
    /**
     * 初诊患者详情
     */
    $scope.changeFirstVisit = function (num) {
        $scope.patientVisits.selectName = num;
        var filter = {department:$scope.patientVisits.department,number:$scope.patientVisits.number,
            time:$scope.patientVisits.visitType,detailType:num};
        $scope.patientVisits.rightTable = ChartColumnService.tableFirstVisit();
        if(num){
            DataService.requestData('111','get',$scope.visitData,filter).then(function (msg) {
                $scope.patientVisits.changedData = msg;
            });
        }else{
            $scope.patientVisits.changedData.description = "服务器忙,请稍后再试";
        }
    }

    //科室就诊情况监控
    $scope.changeDepartmentVisits = function () {
        var filter = {department:$scope.departmentVisits.department};
        $scope.changeVisit($scope.departmentVisits.visitType);
        $scope.changeWork($scope.departmentVisits.workType);
    }
    //医生接诊情况
    $scope.changeDocVisits = function (type) {
        type?$scope.docVisits.visitType = type:undefined;
        //获取医接诊时间监控-医生情况
        var filter = {department:$scope.docVisits.department,number:$scope.docVisits.number,time:$scope.docVisits.visitType};
        DataService.requestData('106','get',$scope.visitData,filter).then(function (msg) {
            $scope.docVisits.leftTable = ChartColumnService.tableDocVisitTime();
            $scope.docVisits.searchedData = msg;
            if(msg.status == SYS.STATUS_SUCCESS&&msg.data.status == SYS.STATUS_SUCCESS){
                $scope.changeTimePatient(msg.data.result[0].name);
            }else{
                $scope.changeTimePatient();
            }
        });
    }
    //患者报到情况监控
    $scope.changePatientReport = function (type) {
        type||type==""?$scope.patientReport.visitType = type:undefined;
        //获取医接诊时间监控-医生情况
        var filter = {department:$scope.patientReport.department,number:$scope.patientReport.number,time:$scope.patientReport.visitType};
        DataService.requestData('108','get',$scope.visitData,filter).then(function (msg) {
            msg.$yName = '人次';
            DrawEchartService.getChartData('verticalBar','verticalBarPatient',msg,$scope.changeNoReport,'type');
        });
    }
    //患者就诊情况监控
    $scope.changePatientVisits = function (type) {
        type||type==""?$scope.patientVisits.visitType = type:undefined;
        //获取医接诊时间监控-医生情况
        var filter = {department:$scope.patientVisits.department,number:$scope.patientVisits.number,time:$scope.patientVisits.visitType};
        DataService.requestData('110','get',$scope.visitData,filter).then(function (msg) {
            DrawEchartService.getChartData('pie','piePatient',msg,$scope.changeFirstVisit,'type');
        });
    }

    /**
     * 盛放所有调用数据的方法,方便时间修改所有数据改变
     */
    $scope.changeDataList = function () {
        //就诊总体情况
        DataService.requestData('60','get',$scope.visitData).then(function (msg) {
            $scope.overallKpi = msg;
        });
        $scope.changePatientAllocation();  //医患配置数据
        $scope.changeDepartmentVisits();  //科室就诊情况监控
        $scope.changeDocVisits();  //医生接诊情况监控
        $scope.changePatientReport();  //患者报到情况监控
        $scope.changePatientVisits();  //患者报到情况监控
    }

    $(".infi-main").scrollTop(0);
    $scope.init = function () {
        $scope.visitData = PageInteractiveService.getTodayTime();
        
        //获取打印列表集合，并与allList匹配
        $scope.ids = PrintListService.getVisMonIds($scope.printAllList);
        //获取科室名称
        DataService.requestData('15','get').then(function (msg) {
            $scope.deptList = msg;
            msg.status == SYS.STATUS_SUCCESS&&msg.data.status == SYS.STATUS_SUCCESS ? $scope.deptList.data.result.unshift({
                dept_id:"",dept_name:"全院"
            }): undefined;
        });
        $scope.changeDataList();
    }
    $scope.init();

    //实时请求数据
    $scope.intervalFun = PageInteractiveService.setIntervalData($scope.init);
    $scope.$on("$destroy", function() {
        PageInteractiveService.clearInterval($scope.intervalFun);
    })
}]);