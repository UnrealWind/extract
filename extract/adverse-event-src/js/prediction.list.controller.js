angular.module('infi-basic').controller('PredictionListController', ['$scope', 'SYS', '$location','PredictionListService','$filter','$routeParams','Utils', function($scope,SYS,$location,PredictionListService,$filter,$routeParams,Utils){

    $scope.params = {
        patientId:$routeParams.patientId
    };

    $scope.basic = "";

    $scope.columns = "";
    $scope.content = "";
    $scope.currentTab = "doctor";
    $scope.nowTime = $filter('date')(new Date(),'yyyy-MM-dd');
    $scope.historyTime = $filter('date')(new Date(new Date()-8*24*60*60*1000),'yyyy-MM-dd')+' - '+$filter('date')(new Date(new Date()-24*60*60*1000),'yyyy-MM-dd');
    $scope.orderTime = $filter('date')(new Date(),'yyyy-MM-dd')+' - '+$filter('date')(new Date(),'yyyy-MM-dd');

    $scope.presentContent = "";
    $scope.historyContent = "";
    $scope.SYS = SYS;

    $scope.tabs = [
        {
            label:"医嘱信息",
            active:true,
            name:"doctor",
            // url:"doctor.json"
            url:"adverse/prediction/advice",
            lineUrl: ""
        },{
            label:"出入量信息",
            active:false,
            name:"output",
            // url:"output.json"
            url:"adverse/prediction/amount",
            lineUrl: "adverse/prediction/amountList"
        },{
            label:"体征信息",
            active:false,
            name:"physical",
            // url:"physical.json"
            url:"adverse/prediction/sign",
            lineUrl: "adverse/prediction/signList"
        }
    ];

    /**
     * 切换tab
     * @param tab
     */
    $scope.switchTab = function(tab) {
        var arr = $scope.orderTime.split(' - ');
        angular.forEach($scope.tabs,function(tabs){
            tabs.active = false;
            if(tabs.label == tab.label){
                tabs.active = true;
                $scope.currentTab = tabs.name;
                PredictionListService.getDoctorContent({
                    url:tab.url,
                    patientId:$scope.params.patientId,
                    page:SYS.DEFAULT_PAGE_NUMBER,
                    size:SYS.DEFAULT_PAGE_SIZE,
                    startDateTime:arr[0],
                    endDateTime:arr[1]
                }).then(function(msg){
                    $scope.content = msg;
                    if(msg.status == SYS.STATUS_SUCCESS){
                        $scope.content.page.number ++ ;
                    }
                });
                if($scope.currentTab == 'output'){
                    PredictionListService.getOutputBreakLine({
                        url: tabs.lineUrl,
                        startDateTime: arr[0],
                        endDateTime: arr[1],
                        patientId: $scope.params.patientId
                    }).then(function (msg) {
                        if(msg.status == 200 && msg.success == true) {
                            $('#outputLine').html('<div id="breakLineBox" style="height:inherit;"></div>');
                            var myChart = echarts.init(document.getElementById('breakLineBox'));
                            myChart.setOption(msg.data,true);
                        } else {
                            $("#outputLine").html("<span class='danger-tip'>暂无数据</span>");
                        }
                    });
                }
                else if ($scope.currentTab == 'physical'){
                    PredictionListService.getPhysicalBreakLine({
                        url: tabs.lineUrl,
                        startDateTime: arr[0],
                        endDateTime: arr[1],
                        patientId: $scope.params.patientId
                    }).then(function (msg) {
                        if(msg.success == true && msg.status == 200){
                            $('#physicalFever').html('<div id="breakLineBox1" style="height:inherit;"></div>');
                            var myChart = echarts.init(document.getElementById('breakLineBox1'));
                            myChart.setOption(msg.data,true);
                        }else {
                            $("#physicalFever ").html("<span class='danger-tip'>暂无数据</span>")
                        }
                    });
                }

            }
        });
    };

    /**
     * 医嘱信息分页
     * @param page
     */
    $scope.updatePage = function(page,orderTime){
        if(orderTime){
            var arr = orderTime.split(' - ');
        }
        angular.forEach($scope.tabs,function(tabs){
            if(tabs.active){
                PredictionListService.getDoctorContent({
                    url:tabs.url,
                    patientId:$scope.params.patientId,
                    page:page,
                    size:SYS.DEFAULT_PAGE_SIZE,
                    startDateTime:arr[0],
                    endDateTime:arr[1]
                }).then(function(msg){
                    $scope.content = msg;
                    if(msg.status == SYS.STATUS_SUCCESS){
                        $scope.content.page.number ++ ;
                    }
                });
                if(tabs.lineUrl != '' && $scope.currentTab == 'output'){
                    PredictionListService.getOutputBreakLine({
                        url: tabs.lineUrl,
                        startDateTime: arr[0],
                        endDateTime: arr[1],
                        patientId: $scope.params.patientId
                    }).then(function (msg) {
                        if(msg.status == 200 && msg.success == true) {
                            $('#outputLine').html('<div id="breakLineBox" style="height:inherit;"></div>');
                            var myChart = echarts.init(document.getElementById('breakLineBox'));
                            myChart.setOption(msg.data,true);
                        } else {
                            $("#outputLine").html("<span class='danger-tip'>暂无数据</span>")
                        }
                    });
                }
                else if(tabs.lineUrl != '' && $scope.currentTab == 'physical'){
                    PredictionListService.getPhysicalBreakLine({
                        url: tabs.lineUrl,
                        startDateTime: arr[0],
                        endDateTime: arr[1],
                        patientId: $scope.params.patientId
                    }).then(function (msg) {
                        if(msg.status == 200 && msg.success == true) {
                            $('#physicalFever').html('<div id="breakLineBox1" style="height:inherit;"></div>');
                            var myChart = echarts.init(document.getElementById('breakLineBox1'));
                            myChart.setOption(msg.data,true);
                        }else {
                            $("#physicalFever").html("<span class='danger-tip'>暂无数据</span>")
                        }
                    });
                }
            }
        })
    };

    function init(){
        PredictionListService.getColumns().then(function(msg){
            $scope.columns = msg.data;
        });
        PredictionListService.getBasic($scope.params.patientId).then(function(msg){
            $scope.basic = msg.data[0];
        });
        $scope.switchTab($scope.tabs[0]);
        PredictionListService.getPresent($scope.params.patientId).then(function(msg){
            $scope.presentContent = filterContent(msg.data);
        });
        PredictionListService.getHistory($scope.params.patientId,$scope.historyTime).then(function(msg){
            $scope.historyContent = filterContent(msg.data,'history');
        })
    }
    init();
    
    $scope.getHistory = function (patientId,date) {
        PredictionListService.getHistory(patientId,date).then(function(msg){
            $scope.historyContent = msg.data;
        })
    };

    /**
     * 给预测情况设置状态
     * @param content
     * @returns {*}
     */
    function filterContent(content,type){
        angular.forEach(content,function(entity){
            if(Number(entity.occurPro) <25 || entity.occurPro==""){
                entity.status = 'dark';
            }else if(Number(entity.occurPro)>=25 && Number(entity.occurPro)<50){
                entity.status = 'green';
            }else if(Number(entity.occurPro)>=50 && Number(entity.occurPro)<75){
                entity.status = 'orange';
            }else if(Number(entity.occurPro)>=75){
                entity.status = 'red';
            }
            if(type && type =='history'){
                var arr = $scope.historyTime.split(' - ');
                entity.startTime = arr[0];
                entity.endTime = arr[1];
            }
        });
        return content;
    }

    /**
     * 给预测最后一个单元格设置一个空的点击事件,阻止冒泡排序
     */
    $scope.emptyClick = function(){
        if (event && event.stopPropagation) {
            event.stopPropagation();
        } else if (window.event) {
            window.event.cancelBubble = true;
        }
    };

    /**
     * 确认按钮
     */
    $scope.confirm = function(entity,type,event){
        // if (event && event.stopPropagation) {
        //     event.stopPropagation();
        // } else if (window.event) {
        //     window.event.cancelBubble = true;
        // }
        var request = angular.copy(entity);
        request.patiId = $scope.params.patientId;
        if(type == 'confirm'){
            request.flagState = '1';
        }else if(type == 'revoke'){
            request.flagState = '0';
        }else if(type == 'cancel'){
            request.flagState = '2';
        }
        PredictionListService.confirm(request).then(function(msg){
            Utils.sysTip($scope,msg);
            if(msg.status == SYS.STATUS_SUCCESS){
                setTimeout(function(){
                    PredictionListService.getPresent($scope.params.patientId).then(function(msg){
                        $scope.presentContent = filterContent(msg.data);
                    });
                    PredictionListService.getHistory($scope.params.patientId,$scope.historyTime).then(function(msg){
                        $scope.historyContent = filterContent(msg.data);
                    })
                },1000);
            }
        })
    };

    /**
     * 点击跳转
     */
    $scope.skip = function(type){
        if(type == 'history'){
            $location.path("prediction-details/"+$scope.params.patientId+"/"+$scope.historyTime);
        }else if(type == 'today'){
            $location.path("prediction-details/"+$scope.params.patientId+"/"+$scope.nowTime);
        }
    };

    /**
     * 展示模态框 +  获取数据
     */
    $scope.getHistoryList = function(data){
        $('#historyEvent').modal('show');
        PredictionListService.getHistoryList(data).then(function(msg){
            $scope.historyListDate = msg;
            console.log(msg)
        });

    };

    /**
     * 历史跳转
     */
    $scope.skipHistory = function(){
        $('#historyEvent').modal('hide');
        $('#historyEvent').on('hidden.bs.modal', function (e) {
            window.location.href = "#prediction-details/"+$scope.params.patientId+"/"+$scope.historyListDate[0].startDateTime.split(' ')[0];
            // $location.path("prediction-details/"+$scope.params.patientId+"/"+$scope.historyTime); //这个会出现跳转bug，不能跳转，再点击一下才能跳转
        })
    };

    $('input[name="daterange"]').daterangepicker({
        showDropdowns: true,
        showWeekNumbers: false, //是否显示第几周

        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary blue',
        cancelClass: 'btn-small',
        format: 'yyyy-MM-dd', //控件中from和to 显示的日期格式
        opens:'left',
        // separator: ' to ',
        locale:{
            applyLabel: '确认',
            cancelLabel: '取消',
            format: 'YYYY-MM-DD',
            // fromLabel: '从',
            // toLabel: '到',
            // weekLabel: 'W',
            // customRangeLabel: 'Custom Range',
            daysOfWeek:["日","一","二","三","四","五","六"],
            monthNames: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"]
        }
    }, function (start, end, label) {
        // alert('A date range was chosen: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    });

}]).service('PredictionListService',['$http','SYS',function($http,SYS){
    /**
     * 获取表格标题
     * @returns {*}
     */
    this.getColumns = function(){
        return $http.get(SYS.jsonUrl+'order-columns.json').then(function(msg){
            return msg.data;
        })
    };

    /**
     * 获取基本信息
     * @returns {}
     */
    this.getBasic = function (patientId) {
        return $http.get(SYS.url + 'adverse/prediction/basic?filter_patiId='+patientId).then(function (msg) {
            return msg.data;
        })
    };

    /**
     * 获取医嘱信息表格内容
     * @returns {*}
     */
    this.getDoctorContent = function(filter){
        return $http({
            url:SYS.url+filter.url,
            method:'get',
            params:{
                filter_patiId:filter.patientId,
                filter_pageNo:filter.page,
                filter_pageSize:filter.size,
                filter_startDateTime:filter.startDateTime,
                filter_endDateTime:filter.endDateTime
            }
        }).then(function(msg){
            return msg.data;
        })
    };
    /**
     * 获取今日预测
     */
    this.getPresent = function(patiId){
        return $http.get(SYS.url+'adverse/prediction/today?filter_patiId='+patiId).then(function(msg){
        // return $http.get(SYS.jsonUrl+'today.json').then(function(msg){
            return msg.data;
        })
    };
    /**
     * 确认
     * @param request
     */
    this.confirm = function(request){
        return $http.put(SYS.url+'adverse/prediction/today/'+request.id,request).then(function(msg){
            return msg.data;
        })
    };
    /**
     * 获取历史预测
     */
    this.getHistory = function(patiId,date){
        var arrDate = date.split(' - '),
            filter_startDateTime = arrDate[0],
            filter_endDateTime = arrDate[1];
        return $http.get(SYS.url+'adverse/prediction/history?filter_patiId='+patiId+"&filter_startDateTime="+ filter_startDateTime +'&filter_endDateTime=' + filter_endDateTime).then(function(msg){
        // return $http.get(SYS.jsonUrl+'history.content.json').then(function(msg){
            return msg.data;
        })
    }
    
    this.getHistoryList = function (data) {
        var url = SYS.url + 'adverse/prediction/historyDetail';
        return $http({
            url: url,
            method: 'get',
            params: {
                filter_patiId: data.patiId,
                filter_startDateTime: data.startDateTime,
                filter_endDateTime: data.endDateTime,
                filter_eventName: data.eventName
            }
        }).then(function (msg) {
            return msg.data.data;
        })
    }

    /**
     * 获取入量数据
     * @param filter
     * @returns {*}
     */
    this.getOutputBreakLine = function (filter) {
        return $http({
            url: SYS.url + filter.url,
            method: 'get',
            params: {
                filter_patiId: filter.patientId,
                filter_startDateTime: filter.startDateTime,
                filter_endDateTime: filter.endDateTime
            }
        }).then(function (msg) {
            var line = {
                data: filterOutputBreakLine(msg.data),
                status: msg.status,
                success: msg.data.success
            }
            return line;
        })
    }
    // 绘制入量折线图
    function filterOutputBreakLine(msg) {
        var arr = msg.data;
        var xAxis = [], series = [];
        angular.forEach(arr,function (entity) {
            xAxis.push(entity.measureTime)
            series.push(entity.amountIn)
        });
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            xAxis:  {
                type: 'category',
                boundaryGap: false,
                data: xAxis
            },
            yAxis: {
                type: 'value',
                name:"入量（单位：ml）",
                axisLabel: {
                    formatter: '{value} ml'
                }
            },
            series: [
                {
                    name:'入量',
                    type:'line',
                    data:series
                }
            ]
        };
        return option;
    }

    /**
     * 获取体征信息数据
     */
    this.getPhysicalBreakLine = function (filter) {
        return $http({
            url: SYS.url + filter.url,
            method: 'get',
            params: {
                filter_patiId: filter.patientId,
                filter_startDateTime: filter.startDateTime,
                filter_endDateTime: filter.endDateTime
            }
        }).then(function (msg) {
            var line = {
                data: filterPhysicalBreakLine(msg.data),
                status: msg.status,
                success: msg.data.success
            }
            return line;
        });
    }
    // 绘制体征信息折线图
    function filterPhysicalBreakLine(msg) {
        var arr = msg.data;
        var arr1=[];
        var s=[];
        var xAxis = [], fever = [], pulse = [], breathe = [];
        angular.forEach(arr,function (entity) {
            arr1.push(entity.measureTime);
            if(entity.infoName == '体温') {
                fever.push(entity.num);
            }else if(entity.infoName == '脉搏'){
                pulse.push(entity.num);
            }else if(entity.infoName == '呼吸'){
                breathe.push(entity.num);
            }
        });
        for(var i = 0;i<arr1.length;i++){
            if(s.indexOf(arr1[i]) == -1){  //判断在s数组中是否存在，不存在则push到s数组中
                s.push(arr1[i]);
            }
        }
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['体温（度）','呼吸（次/分）','脉搏（次/分）']
            },
            xAxis:  {
                type: 'category',
                boundaryGap: false,
                data: s
            },
            yAxis: [
                {
                    type: 'value',
                    name: "体温/呼吸",
                    position: 'left',
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: "脉搏（次/分)",
                    position: 'right',
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [
                {
                    name: '体温（度）',
                    type: 'line',
                    data: fever
                },
                {
                    name: '脉搏（次/分）',
                    type: 'line',
                    yAxisIndex: 1,
                    data: pulse
                },
                {
                    name: '呼吸（次/分）',
                    type: 'line',
                    data: breathe
                }
            ]
        };
        return option;
    }
}]);