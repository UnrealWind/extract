angular.module('infi-basic').service('OverallMonitoringService', ['$http', 'SYS', function ($http, SYS) {
    /**
     * 获取筛选条件json文件
     * @returns {*}
     */
    this.getScreenJson = function(){
        return $http.get(SYS.jsonUrl + 'constantly-screen.json').then(function(msg){
            return msg.data;
        })
    };
    /**
     * 获取筛选条件下拉列表
     */
    this.getScreen = function(){
        return $http.get(SYS.url + 'monitoring/conditions').then(function(msg){
            return msg.data;
        })
    };

    /**
     * 切换科室同时获取对应病区
     * @param deptId
     */
    this.changeDept = function(deptId){
        return $http.get(SYS.url + 'unite/resource/single/1?filter__deptId='+deptId).then(function(msg){
            return msg.data;
        })
    };

    /**
     * 获取kpi
     * @returns {*}
     */
    this.getKpi = function(params){
        return $http({
            method:'get',
            url:SYS.url + 'monitoring/overall',
            params:params
        }).then(function(msg){
            return msg.data;
        });
    };

    /**
     * 获取把柱状图(总体分析)
     * @param params
     * @returns {*}
     */
    this.getBarGraph = function(params){
        return $http({
            method:'get',
            url:SYS.url + 'monitoring/overallTrend',
            params:params
        }).then(function(msg){
            var mss = {
                data:filterBarGraph(msg.data),
                status:msg.data.status
            };
            return mss;
        });
    };

    /**
     * 获取三环图数据
     * @param params
     */
    this.getThreeGraph = function(params){
        var url = SYS.url + 'monitoring/overallSituation';
        // var url = SYS.jsonUrl + 'three-graph.json'
        return $http({
            method:'get',
            url:url,
            params:params
        }).then(function(msg){
            return msg.data;
        })
    };
    /**
     * 获取折线图数据
     * @param params
     */
    this.getBreakLine = function(params){
        return $http({
            method:'get',
            url:SYS.url + 'monitoring/situationLine',
            params:params
        }).then(function(msg){
            var mss = {
                data:filterBreakLine(msg.data),
                status:msg.data.status
            };
            return mss;
        })
    };
    /**
     * 获取事件总体情况表格数据
     * @param params
     * @returns {*}
     */
    this.getEventTable = function(params){
        return $http({
            method:'get',
            url:SYS.url + 'monitoring/levelInfo',
            params:params
        }).then(function(msg){
            return msg.data;
        })
    };
    /**
     * 获取二环图数据
     */
    this.getRingGraph = function(params){
        return $http({
            method:'get',
            url:SYS.url + 'monitoring/levelDetails',
            params:params
        }).then(function(msg){
            return msg.data;
        })
    };
    /**
     * 获取科室分析表格
     * @param params
     */
    this.getDepartTable = function(params){
        return $http({
            method:'get',
            url:SYS.url + 'monitoring/analysis',
            params:params
        }).then(function(msg){
            return msg.data;
        })
    };

    /**
     * 绘制柱状图数据
     * @param msg
     */
    function filterBarGraph(msg){
        var arr = msg.data;
        var legendData = ['总病历数','不良事件数'];
        var xAxis = [],totalData = [],recordData = [];
        angular.forEach(arr,function(entity){
            xAxis.push(entity.statisticalDate);
            totalData.push(entity.totalMedicalRecord);
            recordData.push(entity.unhealthyRecord);
        });
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                },
                formatter:"{b}<br />{a0}: {c0}<br />{a1}: {c1}"
            },
            legend: {
                data:legendData
            },
            xAxis: [
                {
                    type: 'category',
                    data: xAxis,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '病历数(单位:份)',
                    min: 0,
                    axisLabel: {
                        formatter: '{value} 份'
                    }
                },
                {
                    type: 'value',
                    name: '病历数(单位:份)',
                    min: 0,
                    axisLabel: {
                        formatter: '{value} 份'
                    }
                }
            ],
            series: [
                {
                    name:'总病历数',
                    type:'bar',
                    data:totalData
                },
                {
                    name:'不良事件数',
                    type:'bar',
                    data:recordData
                },
                {
                    name:'不良事件数',
                    type:'line',
                    yAxisIndex: 1,
                    data:recordData
                }
            ]
        };
        return option;
    }

    /**
     * 绘制折线图
     */
    function filterBreakLine(msg){
        var arr= msg.data;
        var xAxis = [],series = [];
        angular.forEach(arr,function(entity){
            xAxis.push(entity.label);
            series.push(entity.value);
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
                name:"病历数",
                axisLabel: {
                    formatter: '{value} 份'
                }
            },
            series: [
                {
                    name:'病历数',
                    type:'line',
                    data:series
                }
            ]
        };
        return option;
    }
}]);