angular.module('infi-basic').service('AnalysisServices', ['$http', 'SYS',
 function ($http, SYS) {
    this.getDiseases = function () {
        return $http.get(SYS.url+'disease/condition/disease').then(function (msg) {
            return msg.data;
        });
    };

    this.getType = function () {
        return $http.get(SYS.url+'disease/condition/meteorological').then(function (msg) {
            return msg.data;
        });
    };

    this.getWeather = function (params) {
        return $http({
            method : 'GET',
            url : SYS.url+'disease/meteorological/analysis',
            params: params
        }).then(function (msg) {
            return msg.data;
        });
    };

    this.drawCharts = function(msg,typeDiscribe){
        var avg = [];
        var values = [];
        msg.forEach(function(n,i){
            //avg.push(n.pathogenesisNum);
            //values.push(n.monthMean);
            avg.push({value:n.pathogenesisNum,unit:n.pathogenesisNumUnit});
            values.push({value:n.monthMean,unit:n.monthMeanUnit});
        })
        var myChart = echarts.init(document.getElementById('weather'));
        var option = {
            title: {
                text: '列联相关系数'+msg[0].related
            },
            tooltip: {
                trigger: 'axis',
                formatter:  function(a){
                    var str = '';
                    a.forEach(function(n,i){
                        i == 0?str+=a[i].seriesName+'：'+a[i].data.value+a[i].data.unit:
                        str+='<br/>'+a[i].seriesName+'：'+a[i].data.value+a[i].data.unit
                    });
                    return (str);
                 }

            },
            legend: {
                data:['发病人数','月均最高温度','月均最低温度','月均温','月均PM2.5','月均PM10']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['2016-11','2016-12','2017-01','2017-02','2017-03','2017-04','2017-05','2017-06']
            },
            yAxis: [{
                     type: 'value',
                     name:'发病人数'
                　},{
                     type: 'value',
                     name:typeDiscribe
                 }],
            dataZoom: [
                {
                    show: true,
                    start: 0,
                    end: 100
                },
                {
                    type: 'inside',
                    start: 0,
                    end: 100
                }
            ],
            series: [
                {
                    name:'发病人数',
                    type:'line',
                    data:avg
                },
                {
                    name:typeDiscribe,
                    type:'line',
                    yAxisIndex:1,
                    data:values
                }
            ]
        };
        myChart.setOption(option);
    }

    this.getBasicAttr　=　function(params){
        var that = this;
        return $http({
            method : 'GET',
            url : SYS.url+'disease/basic/attribute',
            params: params
        }).then(function (msg) {
            that.drawBasicCharts(msg.data,params);
        });
    }

    this.drawBasicCharts = function(msg,params){
        var tagId = null;
        params.filter_factor_type_id == 7 || params.filter_factor_type_id == 8?
        tagId=params.filter_factor_type_id-2:tagId = params.filter_factor_type_id

        var myChart = echarts.init(document.getElementById('basicAttr-'+tagId));
        var factorTypeValue = [];
        var countPercent = [];
        var noCountPercent = [];
        msg.data.forEach(function(n,i){
            factorTypeValue.push(n.factorTypeValue);
            countPercent.push(n.countPercent.split('%')[0]);
            noCountPercent.push(n.noCountPercent.split('%')[0]);
        });
        option = {
            title: {
                text: msg.data[0].factorTypeName
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
               formatter:  '{a0}: {c0}%<br />{a1}: {c1}%'
            },
            legend: {
                data:[params.targetLabel, '非'+params.targetLabel]
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'value'
                }
            ],
            yAxis : [
                {
                    type : 'category',
                    axisTick : {show: false},
                    data : factorTypeValue
                }
            ],
            series : [
                {
                    name:params.targetLabel,
                    type:'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'right'
                        }
                    },
                    data:countPercent
                },
                {
                    name:'非'+params.targetLabel,
                    type:'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'right'
                        }
                    },
                    data:noCountPercent
                }
            ]
        };
        myChart.setOption(option);

    }

}]);
