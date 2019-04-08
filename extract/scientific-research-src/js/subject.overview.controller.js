angular.module("infi-basic").controller('SubjectOverviewController',
    ['$scope','SYS','$http','$filter','$routeParams','$timeout','subjectOverviewService','naviServices','$rootScope','subjectCreateService','subjectCreateService'
        ,function ($scope,SYS,$http,$filter,$routeParams,$timeout,subjectOverviewService,naviServices,$rootScope,subjectCreateService,subjectCreateService) {
        subjectCreateService.getSubjectInfo($routeParams.subjectId).then(function (data) {
            $scope.subjectInfo = data.data.name;
        })
        naviServices.getNaviData().then(function(msg){
            msg.data?$rootScope.naviData = msg.data.menus:undefined;
            var strIdx = naviServices.getIndex(window.location.href,$rootScope.naviData);
            var callback = naviServices.restoreNavi($rootScope.naviData,strIdx);
            $rootScope.naviData = callback.naviData;
            $rootScope.secondNavi = callback.second;
            $rootScope.secondTitleOpt = callback.secondTitleOpt;
            $rootScope.shrinkfirst = naviServices.judgeShrink($rootScope.secondNavi);
        });

    $scope.switchTab = function (item) {
        angular.forEach($scope.tabData,function (tabs) {
            tabs.active = false;
            if(tabs.label == item.label){
                tabs.active = true;
            }
            $scope.selectTime = false;
        });

        $('.selectTime span').html('选择时间');
        getOverviewData($routeParams.subjectId,item.filterTime);
    }
    $scope.selectTime = false;
    $scope.selectTimes= function(){
        angular.forEach($scope.month,function (date) {
            if($scope.dataRange.substring(5) == date.value){
                $scope.dataRange = $scope.dataRange.substring(0,5) + date.label;
            }
        })
        getOverviewData($routeParams.subjectId,$scope.dataRange);
        $scope.selectTime = true;
        $('.selectTime span').html($scope.dataRange);
        angular.forEach($scope.tabData,function (tabs) {
            tabs.active = false;
        });
    }
    //获取附件列表
    $scope.getUploadList = function(pageNum,pageSize){
        subjectCreateService.getUploadList(pageNum,pageSize,$routeParams.subjectId).then(function (data) {
            if(data.status == SYS.STATUS_SUCCESS){
                $scope.fileData = data.page.content;
                $scope.filePage = data.page;
                $scope.filePage.number ++;
            }
        });
    }

    $scope.updatePageAttend = function(pageNum){
        $scope.getUploadList(pageNum,10);
    }

    function getTime(){
        var oDate = new Date(),
            thisMonth = $filter('date')(oDate,'yyyy-MM'),
            lastMonth = '';
        if(thisMonth.split('-')[1] == '01') {
            lastMonth = (parseInt(thisMonth.split('-')[0])-1) + '-12';
        }else if(parseInt(thisMonth.split('-')[1])<=10){
            lastMonth = (parseInt(thisMonth.split('-')[0])-1) + '-0' + (parseInt(thisMonth.split('-')[1])-1);
        }else {
            lastMonth = parseInt(thisMonth.split('-')[0]) + '-' + (parseInt(thisMonth.split('-')[1])-1);
        }
        $scope.filterTime = thisMonth;
        $scope.timeArr = [thisMonth,lastMonth];
    }
    function init() {
        getTime();
        $http.get('data/subject-overview.json').success(function (data) {
            $scope.tabData = data.tabData;
            $scope.month = data.month;
            angular.forEach($scope.timeArr,function (date,index) {
                $scope.tabData[index].filterTime = date;
            });
        });
        getOverviewData($routeParams.subjectId,$scope.timeArr[0]);
        $scope.getUploadList(1,10);
    };
    init();
    //获取顶部概况数据
    function getOverviewData(subjectId,filterTime) {
        subjectOverviewService.getOverviewData(subjectId,filterTime).then(function (data) {
            if(data.status == SYS.STATUS_SUCCESS){
                $scope.total = data.data.total;
                $scope.addNum = data.data.addNum;
                $scope.finish = data.data.finish;
                $scope.ready = data.data.ready;
            }
        })
    };

    //四个图
    subjectOverviewService.getColumnChart($routeParams.subjectId).then(function(msg){
        if(msg.status == SYS.STATUS_SUCCESS){
            $('#columnGraph').html('<div id="columnGraphBox" style="height:inherit;"></div>');
            var myChart = echarts.init(document.getElementById('columnGraphBox'));
            myChart.setOption(msg.data,true);
        }
        else{
            $("#columnGraph").html("<span class='danger-tip'>暂无数据</span>");
        }
    });
    subjectOverviewService.getLineChart($routeParams.subjectId).then(function(msg){
        if(msg != undefined && msg.status == SYS.STATUS_SUCCESS){
            $('#lineGraph').html('<div id="lineGraphBox" style="height:inherit;"></div>');
            var myChart = echarts.init(document.getElementById('lineGraphBox'));
            myChart.setOption(msg.data,true);
        }
        else{
            $("#lineGraph").html("<span class='danger-tip'>暂无数据</span>");
        }
    });

    subjectOverviewService.getRateChart($routeParams.subjectId).then(function(msg){
        if(msg.status == SYS.STATUS_SUCCESS){
            $('#rateGraph').html('<div id="rateGraphBox" style="height:inherit;"></div>');
            var myChart = echarts.init(document.getElementById('rateGraphBox'));
            myChart.setOption(msg.data,true);
        }
        else{
            $("#rateGraph").html("<span class='danger-tip'>暂无数据</span>");
        }
    });
    subjectOverviewService.getBarChart($routeParams.subjectId).then(function(msg){
        if(msg.status == SYS.STATUS_SUCCESS){
            $('#barGraph').html('<div id="barGraphBox" style="height:inherit;"></div>');
            var myChart = echarts.init(document.getElementById('barGraphBox'));
            myChart.setOption(msg.data,true);
        }
        else{
            $("#barGraph").html("<span class='danger-tip'>暂无数据</span>");
        }
    });

    //获取详情

    $scope.showModifyButton = false; //是否显示修改按钮
    subjectOverviewService.getSubjectDetail($routeParams.subjectId).then(function (data) {
        if(data.status == SYS.STATUS_SUCCESS){
            $scope.basic = angular.copy(data.data)
            if($scope.basic.userId == $scope.userId){
                $scope.showModifyButton = true;
            }
        }
    });

    $scope.tabs = [];
    $scope.data = [];
    $scope.centerTabs = [];
    $scope.centerData = [];
    //获取各中心数据采集情况
    $scope.switchTabs = function(tab){
        angular.forEach($scope.centerTabs,function(tabs,index){
           angular.forEach($scope.centerData,function (item,index) {
               $scope.centerData[index].active = false;
           })
            tabs.active = false;
            $timeout(function () {
                if(tabs.label == tab.label){
                    $scope.centerData[index].active = true;
                    tabs.active = true;
                }
            },0)
        });
     }
    subjectOverviewService.getGroupData($routeParams.subjectId).then(function (data) {
        if(data.status == SYS.STATUS_SUCCESS){
            var group = [];
            for (var key in data.data){
                group.push(key);
                $scope.centerData.push(data.data[key]);
            }
            for(var i=0; i< group.length;i++){
                if(i==0){
                    $scope.centerData[i].active = 'true';
                    $scope.centerTabs.push({label:group[i],active: true});
                }else{
                    $scope.centerData[i].active = 'false';
                    $scope.centerTabs.push({label:group[i],active: false});
                }
            }
        }
    });
    $scope.title = ['序号','合作医院','科室','任务量','采集数','进度'];

    $scope.showHospital = false;
    subjectOverviewService.getHosDeptData($routeParams.subjectId).then(function (data) {
        if(data.status == SYS.STATUS_SUCCESS){
            $scope.hosDeptData = data.data;
            $scope.showHospital = false;
        }else {
            $scope.showHospital = true;
        }
    })
    $scope.downLoad = function (data) {
        subjectCreateService.downLoad(data.id);
    }
    $scope.subjectCreate = function () {
        location.href = '#/subject-create/' + $routeParams.subjectId;
    }
}]);


