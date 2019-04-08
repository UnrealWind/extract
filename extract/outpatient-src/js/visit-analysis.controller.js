angular.module('infi-basic').controller('VisitAnalysisController', ['$scope', 'DataService', 'SYS','DrawEchartService','DataAdapter','PageInteractiveService','KpiColumnService','PrintListService', function ($scope, DataService, SYS,DrawEchartService,DataAdapter,PageInteractiveService,KpiColumnService,PrintListService) {
    $scope.SYS = SYS;
    $scope.searchDate = PageInteractiveService.setTimeRange();
    $scope.hospitalAdmissions = { //全院接诊状况数据
        number:"",  //号类
        staType:"day",  //统计类型
        selectType:'1'  //指标
    };
    $scope.deptAdmissions = { //科室接诊概况数据
        number:"",  //号类
        staType:"day",  //统计类型
        selectType:'1' //指标
    };
    $scope.doctorAdmissions = { //医生接诊概况数据
        number:"",  //号类
        staType:"day",  //统计类型
        department:"",
        selectType:'1' //指标
    };

    /**
     * 折柱混合图数据配置以及绘图
     * @param id  绘图的id
     * @param entity  配置的存储数据
     * @param isRadio  标示是否是点击的指标绘制,若是指标则不会向后台请求数据,直接用上次数据
     * @param filter  向后台请求数据的filter
     * @param urlId  向后台请求数据的id
     */
    function setLineBarChart(id,entity,isRadio,filter,urlId) {
        if(isRadio){  //指标选择后,不会向后台取数据,用当前数据
            drawLineBarChart(entity['recordData']);
        }else{
            DataService.requestData(urlId,'get',undefined,filter).then(function (msg) {
                entity['recordData'] = msg;
                drawLineBarChart(msg);
            });
        }
        //绘图
        function drawLineBarChart(data) {
            var title = [
                {
                    label:entity.selectType == '1'?'接诊人次':'次均接诊次数', //不同的指标,绘制不同的图形
                    key:entity.selectType == '1'?'zjzrc_size':'cjjzrc_size',
                    type:'bar'
                },{label:'出诊次数',key:'zczcs_size',type:'line'}];
            data.$title = title;  //柱状图,折线图的title标示
            data.$xAxis = 'visit_date';  //x轴显示的内容对应的后台给的key
            data.yAxis = [{name:entity.selectType == '1'?'接诊人次':'次均接诊次数'},{name:'出诊次数'}];  //y轴显示的名称和最大值\最小值
            data.$minMax = 'no'; //不需要最大值,最小值
            data.$staType = entity.staType;  //选择不同的统计类型,tooltip显示不同
            data.$projectType = 'hospitalAdmissions';  //此处折柱混合图tooltip要做出修改,要重写绘图的formatter方法
            DrawEchartService.getChartData('line-bar',id,data);
        }
    }

    /**
     * 全院接诊概况
     * @param isRadio  标示是否是点击的指标绘制,若是指标则不会向后台请求数据,直接用上次数据
     */
    $scope.getHospitalAdmissions = function (isRadio) {
        var filter={startDate: $scope.searchDate.startDate,endDate : $scope.searchDate.endDate,
            number:$scope.hospitalAdmissions.number,staType:$scope.hospitalAdmissions.staType};
        setLineBarChart('lineBarhospitalAdmissions',$scope.hospitalAdmissions,isRadio,filter,'67');
    }

    /**
     * 科室接诊排行
     * @param type 表格title选择的排序方式
     */
    $scope.getDeptAdmissions = function (type) {
        type?$scope.deptAdmissions.range = type:undefined;  //选择的某个次数排行
        var filter = {number:$scope.deptAdmissions.number,startDate : $scope.searchDate.startDate,
            endDate : $scope.searchDate.endDate,rankType:type};
        DataService.requestData('68','get',undefined,filter).then(function (msg) {
            $scope.deptAdmissions.searchedData = msg;
            if(msg.status == $scope.SYS.STATUS_SUCCESS&&msg.data.result&&msg.data.result.length>0){
                $scope.selectOneDept(msg.data.result[0]);
            }else{
                $scope.selectOneDept();
            }
        });
    }

    /**
     * 同时获取'骨科专家接诊患者分布'与'骨科接诊趋势',方便选择不同的科室进行切换
     * @param list  选择的科室情况
     */
    $scope.selectOneDept = function (list) {
        $scope.deptAdmissions.dept = list;  //选择的科室
        $scope.getDeptReceiveDistribution();  //骨科专家接诊患者分布
        $scope.getDeptReceiveTrend();  //骨科接诊趋势
    }

    /**
     *某科室专家接诊患者分布
     */
    $scope.getDeptReceiveDistribution = function () {
        if($scope.deptAdmissions.dept){  //是否有正确的科室,不是正确的则不绘图
            var filter = {number:$scope.deptAdmissions.number,startDate : $scope.searchDate.startDate,
                endDate : $scope.searchDate.endDate,department:$scope.deptAdmissions.dept.dept_id};
            DataService.requestData('69','get',undefined,filter).then(function (msg) {
                DrawEchartService.getChartData('region','regionDeptReceive',msg);
            });
        }else{
            $("#regionDeptReceive").text('服务器忙,请稍后再试');
        }
    }

    /**
     *某科室接诊趋势
     *@param isRadio  标示是否是点击的指标绘制,若是指标则不会向后台请求数据,直接用上次数据
     */
    $scope.getDeptReceiveTrend = function (isRadio) {
        if($scope.deptAdmissions.dept){ //是否有正确的科室,不是正确的则不绘图
            var filter = {number:$scope.deptAdmissions.number,startDate : $scope.searchDate.startDate,
                endDate : $scope.searchDate.endDate,department:$scope.deptAdmissions.dept.dept_id,staType:$scope.deptAdmissions.staType};
            setLineBarChart('lineBardeptAdmissions',$scope.deptAdmissions,isRadio,filter,'70');
        }else{
            $("#lineBardeptAdmissions").text('服务器忙,请稍后再试');
        }
    }
    
    /**
     * 医生接诊排行
     * @param type 表格title选择的排序方式
     */
    $scope.getDoctorAdmissions = function (type) {
        type?$scope.doctorAdmissions.range = type:undefined;  //选择的某个次数排行
        var filter = {number:$scope.doctorAdmissions.number,startDate : $scope.searchDate.startDate,
            endDate : $scope.searchDate.endDate,department:$scope.doctorAdmissions.department,rankType:type};
        DataService.requestData('71','get',undefined,filter).then(function (msg) {
            $scope.doctorAdmissions.searchedData = msg;
            if(msg.status == $scope.SYS.STATUS_SUCCESS&&msg.data.result&&msg.data.result.length>0){
                $scope.selectOneDoc(msg.data.result[0]);
            }else{
                $scope.selectOneDoc();
            }
        });
    }

    /**
     * 同时获取'某医生接诊患者分布'与'某医生出诊详情',方便选择不同的医生进行切换
     * @param list  选择的医生情况
     */
    $scope.selectOneDoc = function (list) {
        $scope.doctorAdmissions.doc = list;  //选择的医生
        $scope.getDocReceiveDistribution();  //医生接诊患者分布
        $scope.getDocReceiveDetail();  //医生出诊详情
    }
  
    /**
     * 某医生接诊患者分布
     */
    $scope.getDocReceiveDistribution = function () {
        if($scope.doctorAdmissions.doc){  //是否有正确的医生,不是正确的则不绘图
            var filter = {number:$scope.doctorAdmissions.number,startDate : $scope.searchDate.startDate,
                endDate : $scope.searchDate.endDate,docName:$scope.doctorAdmissions.doc.doc_name};
            DataService.requestData('72','get',undefined,filter).then(function (msg) {
                DrawEchartService.getChartData('region','regionDocReceive',msg);
            });
        }else{
            $("#regionDocReceive").text('服务器忙,请稍后再试');
        }
    }
    
    /**
     * 某医生出诊详情
     */
    $scope.getDocReceiveDetail = function () {
        if($scope.doctorAdmissions.doc) {  //是否有正确的医生,不是正确的则不绘图
            var filter = {number:$scope.doctorAdmissions.number,startDate : $scope.searchDate.startDate,
                endDate : $scope.searchDate.endDate,docName:$scope.doctorAdmissions.doc.doc_name,
                staType:$scope.doctorAdmissions.staType};
            DataService.requestData('73','get',undefined,filter).then(function (msg) {
                var title = [{label:'接诊人次',key:'jzrc_size',type:'bar'}];
                msg.$title = title;  //柱状图,折线图的title标示
                msg.$xAxis = 'visit_date';  //x轴显示的内容对应的后台给的key
                msg.yAxis = [{name:'接诊人次'}];  //y轴显示的名称和最大值\最小值
                msg.$minMax = 'no'; //不需要最大值,最小值
                msg.$staType = $scope.doctorAdmissions.staType;  //选择不同的统计类型,tooltip显示不同
                msg.$projectType = 'hospitalAdmissions';  //此处折柱混合图tooltip要做出修改,要重写绘图的formatter方法
                DrawEchartService.getChartData('line-bar','lineBarDocVisit',msg);
            });
        }else{
            $("#lineBarDocVisit").text('服务器忙,请稍后再试');
        }
    }

    /**
     * 页面中所有图形的绘制,方便切换时间绘制所有图形
     */
    $scope.getChartList = function () {
        var timer = PageInteractiveService.setTimeInterval($scope.searchDate);
        $scope.hospitalAdmissions.staType = timer;
        $scope.deptAdmissions.staType = timer;
        $scope.doctorAdmissions.staType = timer;

        //接诊总体情况
        DataService.requestData('66','get',undefined,$scope.searchDate).then(function (msg) {
            $scope.overallKpi = DataAdapter.transformKpi(KpiColumnService.kpiTotalVisit(),msg);
        });
        $scope.getHospitalAdmissions();  //全院接诊概况
        $scope.getDeptAdmissions('cz_desc');  //科室接诊概况
        $scope.getDoctorAdmissions('cz_desc');  //医生接诊概况
    }

    $(".infi-main").scrollTop(0);
    $scope.init = function () {
        //获取打印列表集合，并与allList匹配
        $scope.ids = PrintListService.getVisAnaIds($scope.printAllList);
        //获取科室名称
        DataService.requestData('15','get').then(function (msg) {
            $scope.deptList = msg;
            msg.status == SYS.STATUS_SUCCESS&&msg.data.status == SYS.STATUS_SUCCESS ? $scope.deptList.data.result.unshift({
                dept_id:"",dept_name:"全院"
            }): undefined;
        });
        $scope.getChartList();
    };
    $scope.init();

    /**
     * 页面中btn组合的操作方法
     * @param entity 要修改的总数据
     * @param type 数据中要修改的key
     * @param value  要修改的key的值
     * @param callback  修改后要执行的方法
     */
    $scope.changeBtnData = function (entity,type,value,callback) {
        entity[type] = value;
        callback();
    }
    /**
     * 页面中btn组合的操作方法
     * @param entity 要修改的总数据
     * @param value  要修改的key的值
     * @param callback  修改后要执行的方法
     */
    $scope.changeRadioData = function (value,entity,callback) {
        entity.selectType = value;
        callback('no');  //参数标示是点击ratio切换的数据,不必要再向后台请求数据
    }
}]);