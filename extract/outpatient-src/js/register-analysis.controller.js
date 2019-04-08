angular.module('infi-basic').controller('RegisterAnalysisController', ['$scope', 'DataService', 'SYS','DrawEchartService','DataAdapter','PageInteractiveService','KpiColumnService','PrintListService', function ($scope, DataService, SYS,DrawEchartService,DataAdapter,PageInteractiveService,KpiColumnService,PrintListService) {
    $scope.SYS = SYS;
    $scope.searchDate = PageInteractiveService.setTimeRange();//获取时间范围
    $scope.deptList = null;  //科室列表
    $scope.typeTrends = {  //门急诊挂号类型趋势
        select:[],  //门诊类型
        selectType:[],  //指标
        department:"",  //选择的科室
        staType:"day",  //统计类型
        ids:[53],  //需要访问的id数组,有的图两行筛选条件（访问的后台接口）
        htmlId:"lineRegisterType",  //盛放图形的div的id
        recordData:[]  //盛放查找返回的数据
    };
    $scope.channelTrends = {  //门急诊挂号渠道趋势
        select:[],
        selectType:[],
        department:"",
        staType:"day",
        ids:[54,55],
        htmlId:"lineRegisterChannel",
        recordData:[]
    };
    $scope.outpatientMiss = {  //门诊爽约情况
        select:[],
        selectType:[],
        department:"",
        staType:"day",
        ids:[56,57],
        htmlId:"lineOutpatientMiss",
        recordData:[]
    };
    $scope.outpatientBackNumber = {  //门诊退号情况
        select:[],
        selectType:[],
        department:"",
        staType:"day",
        ids:[58],
        htmlId:"lineBackNumber",
        recordData:[]
    };
    $scope.departmentRanking = {
        recordData:null,  //后台返回的所有数据
        showData:null,  //页面是上用到的数据
        type:'number',
        viewSize:'5'
    }
    $(".infi-main").scrollTop(0);
    /**
     * 初始化--获取科室,指标等checkbox维表
     */
    $scope.init = function() {
        $scope.ids = PrintListService.getRegAnaIds($scope.printAllList);//获取打印需要的id集合,并与allList匹配
        //科室
        DataService.requestData('15','get').then(function (msg) {
            $scope.deptList = msg;
            msg.status == SYS.STATUS_SUCCESS&&msg.data.status == SYS.STATUS_SUCCESS ? $scope.deptList.data.result.unshift({
                dept_id:"",dept_name:"全院"
            }): undefined;
        });
        //获取页面上所有左侧checkbox选项集合
        //筛选的左侧复选框的值,采用深拷贝,只拷贝数据,否则生成的checkbox列表数据相同
        DataService.requestData('51','get').then(function (msg) {
            $scope.typeTrends.select.push($.extend(true,{},DataAdapter.getAnalysisCheckbox('1',msg,'left')));
            $scope.channelTrends.select.push($.extend(true,{},DataAdapter.getAnalysisCheckbox('2',msg,'left')));
            $scope.channelTrends.select.push($.extend(true,{},DataAdapter.getAnalysisCheckbox('3',msg,'left')));
            $scope.outpatientMiss.select.push($.extend(true,{},DataAdapter.getAnalysisCheckbox('4',msg,'left')));
            $scope.outpatientMiss.select.push($.extend(true,{},DataAdapter.getAnalysisCheckbox('5',msg,'left')));
            $scope.outpatientBackNumber.select.push($.extend(true,{},DataAdapter.getAnalysisCheckbox('6',msg,'left')));
            $scope.getChartList();  //维表获取成功后绘制初始化的数据
        });
        //获取页面上所有右侧checkbox选项集合
        //筛选的右侧指标复选框的值,采用深拷贝,只拷贝数据,否则生成的checkbox列表数据相同
        DataService.requestData('52','get').then(function (msg) {
            $scope.typeTrends.selectType.push($.extend(true,{},DataAdapter.getAnalysisCheckbox('1',msg,'right')));
            $scope.channelTrends.selectType.push($.extend(true,{},DataAdapter.getAnalysisCheckbox('2',msg,'right')));
            $scope.channelTrends.selectType.push($.extend(true,{},DataAdapter.getAnalysisCheckbox('3',msg,'right')));
            $scope.outpatientMiss.selectType.push($.extend(true,{},DataAdapter.getAnalysisCheckbox('4',msg,'right')));
            $scope.outpatientMiss.selectType.push($.extend(true,{},DataAdapter.getAnalysisCheckbox('5',msg,'right')));
            $scope.outpatientBackNumber.selectType.push($.extend(true,{},DataAdapter.getAnalysisCheckbox('6',msg,'right')));
            $scope.getChartList();  //维表获取成功后绘制初始化的数据
        });
    }

    /**
     * 获取'门急诊总体情况'数据
     */
    $scope.getOverallKpi = function () {
        DataService.requestData('50','get',undefined,$scope.searchDate).then(function (msg) {
            $scope.overallKpi = DataAdapter.transformKpi(KpiColumnService.kpiTotalOutpatient(),msg);
        });
    }

    /**
     * 获取科室排行情况
     * type  当查询时间改变时才重新请求数据,否则只是切换数据
     */
    $scope.getDepartmentRanking = function (type) {
        if(type == ""){
            var filter = {startDate:$scope.searchDate.startDate,endDate:$scope.searchDate.endDate,viewSize:$scope.departmentRanking.viewSize};
            DataService.requestData('59','get',undefined,filter).then(function (msg) {
                $scope.departmentRanking.recordData = msg;
                drawBarChart();
            });
        }else{
            $scope.departmentRanking.type = type;
            drawBarChart();
        }

        //绘制条形图
        function drawBarChart() {
            //$valueType是为了区分柱状图中采用原始数据中不同的可以作为绘图的value,为了代码复用性
            $scope.departmentRanking.type == 'ratio' ? $scope.departmentRanking.recordData.$valueType = 'ratio'
                : $scope.departmentRanking.recordData.$valueType = undefined;
            $scope.departmentRanking.showData = DataAdapter.transformBar($scope.departmentRanking.recordData,'horizontal');
            if($scope.departmentRanking.showData.status == 'ok'){
                $scope.departmentRanking.showData.$tooltipName = $scope.departmentRanking.type == 'ratio' ? '比率(%)':undefined;
                $scope.departmentRanking.showData.$xName = $scope.departmentRanking.type == 'ratio' ? '%':"人次";
                DrawEchartService.drawChart('bar','barDeptRanking',$scope.departmentRanking.showData);
            }else{
                $('#barDeptRanking').text($scope.departmentRanking.showData.description);
            }
        }
    }

    $scope.init();

    /**
     * 用作初始化和时间时间修改后绘制所有图形
     * type--初始化时'门急诊总体情况'与'科室排行情况'不用请求两次
     */
    $scope.getChartList = function (type) {
        var timer = PageInteractiveService.setTimeInterval($scope.searchDate);
        $scope.typeTrends.staType = timer;
        $scope.channelTrends.staType = timer;
        $scope.outpatientMiss.staType = timer;
        $scope.outpatientBackNumber.staType = timer;

        !$scope.overallKpi || type ? $scope.getOverallKpi() : undefined;  //获取'门急诊总体情况'数据
        $scope.getInitialChart($scope.typeTrends);  //门急诊挂号类型趋势
        $scope.getInitialChart($scope.channelTrends);  //门急诊挂号渠道趋势
        $scope.getInitialChart($scope.outpatientMiss);  //门诊挂爽约情况  
        $scope.getInitialChart($scope.outpatientBackNumber);  //门诊退号情况
        !$scope.departmentRanking.recordData || type ? $scope.getDepartmentRanking("") : undefined;  //获取'科室排行情况'数据
    }

    /**
     * 初始化时,左右侧筛选条件准备完毕后绘制图形
     * @param original
     */
    $scope.getInitialChart =function (original) {
        if(original.select.length > 0 && original.selectType.length > 0){
            PageInteractiveService.searchAnalysisData(original,$scope.searchDate);
        }
    }

    /**
     * 重置数据
     * @param entity
     */
    $scope.clearSelected = function (entity) {
        PageInteractiveService.clearSelected(entity,$scope.searchDate);
    }
}]);