angular.module('infi-basic').controller('MonitorController', ['$scope', '$filter', 'MonitorService', 'SYS', '$interval', function ($scope, $filter, MonitorService, SYS, $interval) {


    //页面每五分钟刷新一次，页面刷新之后默认显示为当前
    function timerRefresh(){
        $scope.timer = $interval(function () {
            $scope.requestDate = $filter('date')(new Date(), 'yyyy-MM-dd');
            $scope.getOnDayData($scope.requestDate);
            $scope.total();
        }, 300000);
    }


    /**
     * 数据获取,当用户未选择时间或选择当天时为当前时间
     * @param requestDate
     */
    $scope.getOnDayData = function (requestDate) {
        // 统计日期截止时间
        $scope.abortTime = $filter('date')(new Date(), 'yyyy-MM-dd hh:mm:ss');
        //未传值则为当前时间
        $scope.requestDate = requestDate || $filter('date')(new Date(), 'yyyy-MM-dd');

        MonitorService.getDataUrl().then(function success(msg) {
            //获取本地的json数据,包括前后台交互的url，以及对应页面显示的类型
            var requestInfo = msg.data;
            requestInfo.forEach(function (entity) {
                MonitorService.getInfoData({
                    url: entity.url,
                    date: $scope.requestDate,
                    value: entity.value,
                    elementId: entity.elementId,
                    title: entity.name,
                    type:entity.type
                }).then(function success(msg) {
                    typeJudgment(msg)
                })
            })
        });
        $scope.total();
        // 点击切换时间的时候应该先清除计时器重新开始记时
        $interval.cancel($scope.timer);
        timerRefresh();
    };

    /**
     * 根据场景不同分别进行绘图,赋值
     * @param msg
     */
    function typeJudgment(msg) {
        switch (msg.type) {
            case 'Single'://挂号总体情况,以及预约总体情况，[0]==>这是因为后台返回来的是数组的形式
                $scope[msg.value] = msg.data.data.result[0];
                break;
            case 'dbPie'://挂号类型分布
                $scope.registeredType = msg.data.data.result;
                drawDbPieCharts($scope.registeredType, msg.title, msg.elementId);
                break;
            case 'optPie'://预约途径分布
                $scope.way = msg.data.data.result;
                drawPieCharts($scope.way, msg.title, msg.elementId,true,$scope.requestDate);
                break;
            case 'pie'://付费类型分布
                $scope.payType = msg.data.data.result;
                drawPieCharts($scope.payType, msg.title, msg.elementId);
                break;
            case 'bar'://两个重点科室的柱状图
                $scope[msg.value] = msg.data.data.result;
                drawBarCharts($scope[msg.value], msg.title, msg.elementId);
                break;
            default://门诊统计报表
                $scope.statistics = msg.data.data.result;
        }
    }

    //获取所有预约途径的就诊情况统计,并绘制echarts图
    $scope.total = function(){
        MonitorService.getInfoData({
            url: '10',
            date: $scope.requestDate,
            type: 'totalData',
            elementId: 'infi-opt-zj',
            title: '总计'
        }).then(function success(msg){
            $scope.totalData = msg.data.data.result;
            drawPieCharts($scope.totalData, msg.title, msg.elementId);
        })
    };



    //页面初始化,默认请求当天数据,以及预约就诊情况统计数据
    $scope.getOnDayData();
    $scope.total();
    /**
     * 绘制嵌套饼图
     * @param data
     * @param title
     * @param elementId
     */
    function drawDbPieCharts(data, title, elementId) {
        if (data && data.length > 0) {
            //zyz_debug 暂时加上应对升级，因为急诊数据不好
            for(var idx = 0;idx<data.length;idx++){
                if(data[idx].name == "急诊"){
                    data.splice(idx,1);
                    break;
                }
            }
            MonitorService.setRegisteredType(data, title, elementId);
        } else {
            $("#" + elementId).text('暂无数据')
        }

    }

    /**
     * 绘制饼图
     * @param data
     * @param title
     * @param elementId
     * @param opt
     * @param date
     */
    function drawPieCharts(data, title, elementId, opt, date) {
        if (data && data.length > 0) {
            MonitorService.setPieEcharts(data, title, elementId,opt,date);
        } else {
            $("#" + elementId).text('暂无数据')
        }
    }

    /**
     * 绘制柱状图
     * @param data
     * @param title
     * @param elementId
     */
    function drawBarCharts(data, title, elementId) {
        if(elementId != 'infi-opt-mz-ks'){
            if (data && data.length > 0) {
                MonitorService.setOptionDepartment(data, title, elementId);
            } else {
                $("#" + elementId).text('暂无数据')
            }
        }
    }
}]);