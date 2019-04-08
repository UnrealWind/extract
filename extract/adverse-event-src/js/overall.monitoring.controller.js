angular.module('infi-basic').controller('OverallMonitoringController', ['$scope', 'SYS', '$location', 'Utils','OverallMonitoringService','$filter', function ($scope, SYS, $location, Utils,OverallMonitoringService,$filter) {

    $scope.screenConditions = null; //筛选条件
    $scope.kpiList = null;          //kpi数据
    $scope.currentTab = "";         //当前选中的tab
    $scope.currentTabObj = null;
    $scope.SYS = SYS;
    $scope.adverseSelection = {     //科室分析中不良事件选择下拉框
        value:"",
        label:"",
        option:[]
    };
    $scope.params = {     //全局筛选条件
        filter_startTime:'',
        filter_endTime:'',
        filter_deptId:'',
        filter_wardId:'',
        filter_diseaseSeed:''
    };

    $scope.lineTitle = {    //折线图一级和二级标题,一级标题固定为全部不良事件，二级标题为选中的项
        firstLevel:'全部不良事件',
        secondLevel:''
    };
    $scope.eventTable = null;//事件级别table
    $scope.badTable = null;//不良事件选择table


    //总体趋势的tab  json
    $scope.tabs = [
        {
            label:"按日",
            active:true,
            name:"day"
        },{
            label:"按周",
            active:false,
            name:"week"
        },{
            label:"按月",
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
        OverallMonitoringService.getKpi(params).then(function(msg){
            if(msg.status == SYS.STATUS_SUCCESS){
                $scope.kpiList = msg.data;
            }
        });
        //总体趋势
        angular.forEach($scope.tabs,function(tab){
            if(tab.active){
                $scope.switchTab(tab);
            }
        });
        //三环图
        drawThreeGraph(params);
        //折线图
        var lineFilter = {
            filter_eventName:"全部不良事件",
            filter_type:0
        };
        drawBreakLine(params,lineFilter);
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
            $scope.screenConditions.startTime = $filter('date')(firstdate,'yyyy-MM-dd');
            $scope.screenConditions.endTime = $filter('date')(enddate,'yyyy-MM-dd');
            //获取下拉列表
            OverallMonitoringService.getScreen().then(function(msg){
                angular.forEach($scope.screenConditions,function(conditions,key){
                    angular.forEach(msg,function(value,key2){
                        if(key == key2){
                            conditions.options = value;
                            if(key2 == 'diseaseSeed'){//给下边的不良事件选择赋值,'diseaseSeed'是病种的字段名,之前病种和不良事件用一个接口,现在病种在界面隐掉,不良事件仍然用病种的接口
                                $scope.adverseSelection.options = value;
                                var length = $scope.adverseSelection.options.length;
                                // $scope.adverseSelection.value = $scope.adverseSelection.options[length-1].label;
                                $scope.adverseSelection.value = "管路事件";//zyz_debug 暂时管路事件有数据,所以默认一下
                            }
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
                //zyz_debug 因为当时页面有bug，所以这个div重新绘制
                $('#threeGraph').html('<div id="threeGraphBox" style="height:inherit;"></div>');
                var myChart = echarts.init(document.getElementById('threeGraphBox'));
                console.log(msg.regionData)
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
        OverallMonitoringService.getEventTable(params).then(function(msg){
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
        var filter = {
            filter_eventType:entity.eventType
        };
        if(entity){
            drawRingGraph($scope.params,filter);
        }else{
            $("#ringGraph").html("<span class='danger-tip'>暂无数据</span>");
        }
    };
    /**
     * 绘制二环图
     * @param params
     * @param filter
     */
    function drawRingGraph(params,filter){
        filter = Object.assign(filter,params);
        OverallMonitoringService.getRingGraph(filter).then(function(msg){
            $('#ringGraph').removeAttr('_echarts_instance_');
            if(msg.status == SYS.STATUS_SUCCESS){
                $('#ringGraph').html('<div id="ringGraphBox" style="height:inherit;"></div>')
                var myChart = echarts.init(document.getElementById('ringGraphBox'));
                myChart.setOption(JSON.parse(msg.regionData));
            }else{
                $("#ringGraph").html("<span class='danger-tip'>暂无数据</span>");
            }
        })
    }

    /**
     * 不良事件选择
     * @param value
     */
    $scope.choseEvent = function(value){
        angular.forEach($scope.adverseSelection.options,function(option){
            if(option.label == value){
                $scope.adverseSelection.label = option.label;
            }
        });
        var tableFilter = {
            filter_badEvent:value
        };
        getDepartTable($scope.params,tableFilter);
    };
    /**
     * 获取科室分析表格
     */
    function getDepartTable(params,filter){
        filter = Object.assign(filter,params);
        OverallMonitoringService.getDepartTable(filter).then(function(msg){
            $scope.badTable = msg.data;
        })
    }

    /**
     * 查看报表
     */
    $scope.showReport = function(){
        $scope.screenConditions.type = 'total';
        sessionStorage.setItem('screenOverall',JSON.stringify($scope.screenConditions));
        $location.path("report-total-details");
    }
}]);