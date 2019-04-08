angular.module('infi-basic').controller('RealTimeController', ['$scope', 'SYS', '$location', 'Utils','OverallMonitoringService','$filter','RealTimeService', function ($scope, SYS, $location, Utils,OverallMonitoringService,$filter,RealTimeService) {

    $scope.screenConditions = null; //筛选条件
    $scope.kpiList = null;          //kpi数据
    $scope.currentTab = "";         //当前选中的tab
    $scope.currentTabObj = null;
    $scope.SYS = SYS;
    $scope.adverseSelection = {     //科室分析中不良事件选择下拉框
        value:"压疮",
        label:"压疮",
        options:[
            {
                label:"压疮",
                value:"压疮"
            },
            {
                label:"静脉外渗",
                value:"静脉外渗"
            }
        ]
    };
    $scope.params = {     //全局筛选条件
        filter_startTime:'',
        filter_endTime:'',
        filter_deptId:'',
        filter_wardId:'',
        filter_diseaseSeed:''
    };

    $scope.lineTitle = {    //折线图一级和二级标题
        firstLevel:'全部不良事件',
        secondLevel:''
    };
    $scope.eventTable = null;//事件级别table
    $scope.badTable = null;//不良事件选择table


    //概率分析图的tab  json
    $scope.tabs = [
        {
            label:"75%-100%概率",
            active:true,
            name:"day"
        },{
            label:"50%-75%概率",
            active:false,
            name:"week"
        },{
            label:"25%-50%概率",
            active:false,
            name:"month"
        },{
            label:"25%-0%概率",
            active:false,
            name:"month"
        }
    ];
    /**
     * 切换科室
     * @param value
     */
    $scope.changeDept = function(value){
        OverallMonitoringService.changeDept(value).then(function(msg){
            $scope.screenConditions.wardId.options = msg.data.result;
            $scope.screenConditions.wardId.value = "";
            $scope.refresh($scope.screenConditions);
        })
    };
    /**
     * 刷新页面(也是筛选条件切换的触发事件)
     * @param screenConditions
     */
    $scope.refresh = function(screenConditions){
        var params = $scope.params = {
            filter_startTime:screenConditions.startTime,
            filter_endTime:screenConditions.endTime,
            filter_deptId:screenConditions.deptId.value,
            filter_wardId:screenConditions.wardId.value,
            filter_diseaseSeed:screenConditions.diseaseSeed.value
        };

        //获取kpi
        RealTimeService.getKpi(params).then(function(msg){
            if(msg.status == SYS.STATUS_SUCCESS){
                $scope.kpiList = msg.data[0];
            }
        });
        //总体趋势
        // angular.forEach($scope.tabs,function(tab){
        //     if(tab.active){
        //         $scope.switchTab(tab);
        //     }
        // });
        //三环图
        // drawThreeGraph(params);
        // //折线图
        // var lineFilter = {
        //     filter_eventName:encodeURIComponent("全部不良事件"),
        //     filter_type:0
        // };
        // drawBreakLine(params,lineFilter);
        //绘制表格
        getEventTable(params);
        //绘制二环图
        // $scope.tableClick($scope.eventTable[0])
        //绘制科室
        $scope.choseEvent($scope.adverseSelection.value);
    };
    /**
     * 初始化方法
     */
    function getScreen(){
        //获取上个月第一天
        var firstdate = new Date(new Date().getFullYear(), new Date().getMonth()-12, 1);
        //获取上个月最后一天
        var date = new Date();
        var day = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
        var enddate = new Date(new Date().getFullYear(), new Date().getMonth()-1, day);
        //加载筛选条件json
        OverallMonitoringService.getScreenJson().then(function(msg){
            $scope.screenConditions = msg.data;
            // $scope.screenConditions.startTime = $filter('date')(firstdate,'yyyy-MM-dd');
            $scope.screenConditions.startTime = "2010-07-01";
            $scope.screenConditions.endTime = $filter('date')(enddate,'yyyy-MM-dd');
            //获取下拉列表
            OverallMonitoringService.getScreen().then(function(msg){
                angular.forEach($scope.screenConditions,function(conditions,key){
                    angular.forEach(msg,function(value,key2){
                        if(key == key2){
                            conditions.options = value;
                        }
                    })
                });
                $scope.refresh($scope.screenConditions);
            });
        })
    }
    getScreen();

    /**
     * 切换tab(按日/周/月)
     * @param tab
     */
    $scope.switchTab = function(tab){
        angular.forEach($scope.tabs,function(tabs){
            tabs.active = false;
            if(tabs.label == tab.label){
                tabs.active = true;
                $scope.currentTab = tabs.name;
            }
        });
        var filter = {
            filter_timeType:$scope.currentTab
        };
        filter = Object.assign(filter,$scope.params);//将两个object合并在一起
        OverallMonitoringService.getBarGraph(filter).then(function(msg){
            // $('#barGraph').removeAttr('_echarts_instance_');
            if(msg.status == SYS.STATUS_SUCCESS){
                $('#barGraph').html('<div id="barGraphBox" style="height:inherit;"></div>');
                var myChart = echarts.init(document.getElementById('barGraphBox'));
                myChart.setOption(msg.data,true);
            }
            else{
                $("#barGraph").html("<span class='danger-tip'>暂无数据</span>");
            }
        })
    };

    /**
     * 绘制三环图
     */
    function drawThreeGraph(params){
        OverallMonitoringService.getThreeGraph(params).then(function(msg){
            // $('#threeGraph').removeAttr('_echarts_instance_');
            if(msg.status == SYS.STATUS_SUCCESS){
                $('#threeGraph').html('<div id="threeGraphBox" style="height:inherit;"></div>');
                var myChart = echarts.init(document.getElementById('threeGraphBox'));
                myChart.setOption(JSON.parse(msg.regionData));
                // myChart.setOption(msg.regionData);
                myChart.on('click',function(p){
                    $scope.lineTitle.secondLevel = p.name;
                    var lineFilter ={
                        filter_eventName:p.name,
                        filter_type:p.seriesIndex
                    };
                    drawBreakLine(params,lineFilter);
                });
            }else{
                $("#threeGraph").html("<span class='danger-tip'>暂无数据</span>")
            }
        })
    }

    /**
     * 绘制折线图
     * @param params
     * @param filter  这是环形图的参数
     */
    function drawBreakLine(params,filter){
        filter = Object.assign(filter,params);//将两个object合并在一起
        OverallMonitoringService.getBreakLine(filter).then(function(msg){
            // $('#breakLine').removeAttr('_echarts_instance_');
            if(msg.status == SYS.STATUS_SUCCESS){
                $('#breakLine').html('<div id="breakLineBox" style="height:inherit;"></div>')
                var myChart = echarts.init(document.getElementById('breakLineBox'));
                myChart.setOption(msg.data);
            }else{
                $scope.lineTitle.firstLevel = '';//没有数据的话记得把标题清空
                $("#breakLine").html("<span class='danger-tip'>暂无数据</span>")
            }
        })
    }

    /**
     * 事件总体情况表格获取
     * @param params
     */
    function getEventTable(params){
        RealTimeService.getEventTable(params).then(function(msg){
            $scope.eventTable = msg.data;
            if(msg.status == SYS.STATUS_SUCCESS){
                //绘制二环图
                $scope.tableClick($scope.eventTable[0]);
            }else{
                $("#ringGraph").html("<span class='danger-tip'>暂无数据</span>");
            }
        })
    }

    /**
     * 点击table中的一类触发事件(二环图)
     */
    $scope.tableClick = function(entity){
        if(entity){
            drawRingGraph(entity);
        }else{
            $("#ringGraph").html("<span class='danger-tip'>暂无数据</span>");
        }
    };
    /**
     * 绘制二环图
     * @param entity
     */
    function drawRingGraph(entity){
        $('#ringGraph').removeAttr('_echarts_instance_');
        $('#ringGraph').html('<div id="ringGraphBox" style="height:inherit;"></div>')
        var myChart = echarts.init(document.getElementById('ringGraphBox'));
        var option = {
            title : {
                text: entity.eventName,
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{b} : {c} ({d}%)"
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[
                        {value:entity.event7Num, name:'75-100%'},
                        {value:entity.event5Num, name:'50-75%'},
                        {value:entity.event2Num, name:'25-50%'},
                        {value:entity.event0Num, name:'25-0%'}
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    }

    /**
     * 不良事件选择
     * @param value
     */
    $scope.choseEvent = function(value){
        angular.forEach($scope.adverseSelection.options,function(option){
            if(option.value == value){
                $scope.adverseSelection.value = option.value;
            }
        });
        getDepartTable($scope.params);
    };
    /**
     * 获取科室分析表格
     */
    function getDepartTable(params){
        RealTimeService.getDepartTable(params).then(function(msg){
            $scope.badTable = msg.data;
        })
    }

    /**
     * 查看报表
     */
    $scope.showReport = function(){
        sessionStorage.setItem('screenOverall',JSON.stringify($scope.screenConditions));
        $location.path("report-details");
    }
}]).service('RealTimeService',['$http','SYS',function($http,SYS){
    /**
     * 获取kpi
     */
    this.getKpi = function(params){
        return $http({
            method:'get',
            url:SYS.url + 'adverse/prediction/analysis/kpi',
            params:params
        }).then(function(msg){
            return msg.data;
        });
    }

    /**
     * 获取事件总体情况表格数据
     * @param params
     * @returns {*}
     */
    this.getEventTable = function(params){
        return $http({
            method:'get',
            url:SYS.url + 'adverse/prediction/analysis/eventLevel',
            params:params
        }).then(function(msg){
            return msg.data;
        })
    };

    /**
     * 获取科室列表
     * @returns {*}
     */
    this.getDepartTable = function(params){
        return $http({
            method:'get',
            url:SYS.url + 'adverse/prediction/analysis/deptAnalysis',
            params:params
        }).then(function(msg){
            return msg.data;
        })
    }
    /**
     * 获取科室报表
     * @returns {*}
     */
    this.getDepartAllTable = function(params){
        return $http({
            method:'get',
            url:SYS.url + 'adverse/prediction/analysis/deptAnalysisAll',
            params:params
        }).then(function(msg){
            return msg.data;
        })
    }
}]);