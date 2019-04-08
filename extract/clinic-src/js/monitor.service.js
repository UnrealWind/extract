angular.module('infi-basic').service('MonitorService', ['$http', 'SYS', function ($http, SYS) {

    var that = this;
    /**
     * 获取数据请求的信息数据，包括url以及$scope绑定的值
     * @returns {*}
     */
    this.getDataUrl = function () {
        return $http({
            url: SYS.localUrl + 'dataUrl.json',
            method: 'get'
        }).then(function success(msg) {
            return msg.data;
        })
    };

    /**
     * 获取数据
     * @param filter
     * @returns {*}
     */
    this.getInfoData = function (filter) {
        return $http({
            url: SYS.url + 'unite/resource/single/' + filter.url,
            method: 'get',
            params: {
                filter__dataTime: filter.date
            }
        }).then(function success(msg) {
            return {
                value: filter.value,
                data: msg.data,
                elementId:filter.elementId,
                title:filter.title,
                type:filter.type
            }
        })
    };

    /**
     * 获取就诊情况统计数据,需要带上具体那个预约方式
     * @param name
     * @param date
     * @returns {*}
     */
    function getDiagnoseData(name,date){
        return $http({
            url:SYS.url + 'unite/resource/single/9',
            methods:'get',
            params:{
                filter__dataTime:date,
                filter__name:name
            }
        }).then(function(msg){
            return msg.data
        })
    }

    /**
     * 绘制饼图
     * @param data
     * @param title
     * @param elementId
     * @param opt  控制是否有操作
     * @param date 获取数据时间参数
     */
    this.setPieEcharts = function (data, title, elementId,opt,date) {
        echartsOptions = getPieOption(title);
        echartsOptions.series[0].data = data;
        var myChart = echarts.init(document.getElementById(elementId));
        $(window).resize(function () {
            myChart.resize(echartsOptions);
        });
        
        myChart.setOption(echartsOptions);

        //饼图操作
        if(opt){
            myChart.on('click', function eConsole(param) {
                getDiagnoseData(param.data.name,date).then(function success(msg){
                    that.setPieEcharts(msg.data.result,param.data.name,'infi-opt-zj');
                });
            });
        }
    };

    /**
     * 绘制饼图对应数据结构
     * @param title
     * @returns {{title: {text: *, x: string}, tooltip: {trigger: string, formatter: string}, series: *[]}|*}
     */
    function getPieOption(title) {
        echartsOptions = {
            title: {
                text: title,
                x: 'left'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series: [
                {
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [],
                    roseType: 'range',
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        },//显示百分比的设置
                        normal: {
                            label: {
                                show: true,
                                formatter: '{b} : {c} ({d}%)'
                            }
                        }
                    }
                }
            ]
        };
        return echartsOptions;
    }


    /**
     * 嵌套饼图
     * @param data
     */
    this.setRegisteredType = function (data) {
        optionNested = {
            title: {
                text: '挂号类型分布图',
                x: 'left'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            series: [
                {
                    type: 'pie',
                    selectedMode: 'single',
                    radius: [0, '30%'],

                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    data: []
                },
                {
                    type: 'pie',
                    radius: ['40%', '55%'],
                    data: [],
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: '{b} : {c} ({d}%)'
                            }
                        }
                    }
                }
            ]
        };
        var CategoriesArray = [],
            subclassArray = [];
        data.forEach(function (entity) {
            if (entity.name === '门诊'||entity.name === '急诊') {
                CategoriesArray.push(entity)
            }
            if(entity.name !== '门诊'){
                subclassArray.push(entity);
            }
        });
        optionNested.series[0].data = CategoriesArray;
        optionNested.series[1].data = subclassArray;
        var myChart = echarts.init(document.getElementById('infi-opt-gh'));
        $(window).resize(function () {
            myChart.resize(echartsOptions);
        });
        myChart.setOption(optionNested);
    };

    /**
     * 柱状图
     * @param data
     * @param title
     * @param elementId
     */
    this.setOptionDepartment = function (data, title, elementId) {
        optionDepartment = {
            title: {
                text: title
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            yAxis: {
                type: 'category',
                data: []
            },
            series: [
                {
                    name: '问诊人次',
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'insideRight'
                        }
                    },
                    data: []
                }
            ]
        };
        var dataNameArray = [],
            dataValueArray = [];
        data.forEach(function (entity) {
            dataNameArray.push(entity.name);
            dataValueArray.push(entity.value);
        });
        optionDepartment.yAxis.data = dataNameArray;
        optionDepartment.series[0].data = dataValueArray;
        var myChartDepartment = echarts.init(document.getElementById(elementId));
        // resize 可以根据视口大小改变图的大小
        $(window).resize(function () {
            myChartDepartment.resize(optionDepartment);
        });
        myChartDepartment.setOption(optionDepartment);
    };
}]);