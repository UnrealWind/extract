angular.module("infi-basic").service('EchartOptionService',[function () {
    //自定义页面中图形的显示颜色
    var color = ['#ff6666','#9999cc', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
    /**
     * 嵌套图形option设置
     * @param data 绘制图形数据
     * @returns 
     */
    this.setNestedRingOption = function (data) {
        var option = {
            color:color,
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data:[]
            },
            series: [
                {
                    name:'',
                    type:'pie',
                    selectedMode: 'single',
                    radius: [0, '40%'],

                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:data.inner
                },
                {
                    name:'',
                    type:'pie',
                    radius: ['50%', '65%'],
                    data:data.outer
                }
            ]
        };
        return option;
    }

    /**
     * 饼图option设置
     * @param data 绘制图形数据
     * @returns
     */
    this.setPieOption = function (data) {
        var option = {
            color:color,
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: []
            },
            series : [
                {
                    name: '',
                    type: 'pie',
                    radius : '60%',
                    center: ['50%', '50%'],
                    data:data.outer,
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
        return option;
    }

    /**
     * 横向条形图option设置
     * @param data 绘制图形数据
     * @returns
     */
    this.setBarOption = function (data) {
        var barWidth = getBarWidth(data.dataAxis);
        var option = {
            color:color,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: []
            },
            grid: {
                top:'40px',
                left: '3%',
                right: '40px',
                bottom: '6%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                name:data.$xName
                // splitLine: {
                //     show: false
                // }
            },
            yAxis: {
                type: 'category',
                data:  data.titleAxis,
                name:data.$yName,
                splitLine: {
                    show: false
                }
            },
            series: [
                {
                    //tooltip的name显示不同的数量级
                    name: data.$tooltipName,
                    type: 'bar',
                    barWidth:barWidth,
                    data: data.dataAxis
                }
            ]
        };
        return option;
    }

    /**
     * 纵向条形图option设置
     * @param data 绘制图形数据
     * @returns
     */
    this.setVerticalBarOption = function (data) {
        var barWidth = getBarWidth(data.dataAxis);
        var option = {
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                top:'40px',
                left: '3%',
                right: '40px',
                bottom: '6%',  //调整左侧,右侧,下侧距离容器各边的百分比
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : data.titleAxis,
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLabel:{
                        interval:0,//横轴信息全部显示
                        rotate:10//-10度角倾斜显示
                    },
                    name:data.$xName
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name:data.$yName
                }
            ],
            series : [
                {
                    name:data.$tooltipName,
                    type:'bar',
                    barWidth: barWidth,
                    data:data.dataAxis
                }
            ]
        };
        //垂直条形图tooltip做出修改
        if(data.$projectType&&data.$projectType == 'departmentVisits'){  //就诊监控-专家工作情况tooltip修改
            option.tooltip.formatter = function (pattem) {
                var tooltip = [];
                tooltip.push(pattem[0].name);
                tooltip.push('专家数:'+pattem[0].value);
                // if(pattem[0].dataIndex == '2' || pattem[0].dataIndex == '3'){  //柱状图的后两个才显示表格数据
                //     //下面列表是死数据,目前后台没有给列表数据
                //     var tableList = [{name:'张三'},{name:'李四'},{name:'王五'}];
                //     angular.forEach(tableList,function (list) {
                //         tooltip.push(list.name);
                //     });
                // }
                return tooltip.join('<br />');
            };
        }
        return option;
    }

    /**
     * 折线图option设置
     */
    this.setLineOption = function (data) {
        var datas = [];  //盛放所有线的数据
        angular.forEach(data.chartData.data,function (entity) {  //配置每一条线的数据
            datas.push({
                name:entity.name,
                type:'line',
                data:entity.values
            });
        });
        //给数据排序,只按照数组中第一个数据大小排序,无法全部排序,这样线图由大到小展示
        datas.sort(function (a,b) {
            var aList = a.data[0].value,
                bList = b.data[0].value;
            return aList < bList?1 : aList > bList?-1:0;
        });
        
        var option = {
            title: {
                text: ''
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:[]
            },
            grid: {
                top:'40px',
                left: '3%',
                right: '40px',
                bottom: '6%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: data.chartData.xAxis,
                name:data.$xName
            },
            yAxis: {
                type: 'value',
                name:data.$yName
            },
            series: datas
        };
        if(data.$staType){  //折线图显示比例的提示要重写
            option.tooltip.formatter = function (pattem) {
                return setStaTypeTooltip(data,pattem).join('<br />');
            };
        }
        return option;
    }

    /**
     * 折线图,柱状图混合option
     * @param data
     */
    this.setLineBarOption = function (data) {
        var value = null,
            length = 0;  //此数据类型需要根据子数据中value的个数来判断
        angular.forEach(data.dataAxis,function (yAxis){
            value = yAxis.values;
            yAxis.type == "bar" ? length++ : undefined; //类型为bar的数据可能在一个图形位置放置多个图
        });
        var yAxisData = [],
            yAxisTitle = [],
            barWidth = getBarWidth(value,length);
        angular.forEach(data.dataAxis,function (axis) {  //获取series数据,折现,柱图数据
            var x = {
                name:axis.name,
                type:axis.type,
                data:axis.values
            };
            axis.type == 'line' ? x.yAxisIndex=1 : x.barWidth=barWidth;
            yAxisData.push(x);
        });
        angular.forEach(data.yAxis,function (yAxis) {  //获取yAxis数据,y坐标左侧,右侧显示
            var y = {
                type: 'value',
                name:yAxis.name,
                min:yAxis.min,
                max:yAxis.max,
                axisLabel: {
                    formatter: '{value}'
                }
            };
            yAxisTitle.push(y);
        });
        var option = {
            color:color,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            legend: {
                data:data.title
            },
            xAxis: [
                {
                    type: 'category',
                    data: data.xAxisTitle,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: yAxisTitle,
            series: yAxisData
        };
        //接诊分析-全院接诊概况
        if(data.$projectType&&data.$projectType=='hospitalAdmissions'){
            option.tooltip.formatter = function (pattem) {
                return setStaTypeTooltip(data,pattem).join('<br />');
            };
        }
        // else if(data.$projectType&&data.$projectType=='patientAllocation'){  //急诊监控-医患比
        //     option.tooltip.formatter = function (pattem) {
        //         var tooltip = [];
        //         angular.forEach(pattem,function (entity) {
        //             var value = entity.seriesType == 'line'?'1:'+entity.value:entity.value;  //医患比要显示1:XXX形式
        //             tooltip.push(entity.seriesName+':'+value);
        //         });
        //         return tooltip.join('<br />');
        //     };
        // }
        return option;
    }

    /**
     * 纵向堆叠柱状图
     * @param data
     */
    this.setVerticalStackBarOption = function (data) {
        var value = null;  //此数据类型需要根据子数据中value的个数来判断
        angular.forEach(data.dataAxis,function (yAxis){
            value = yAxis.value;
        });
        var yData = [],
            barWidth = getBarWidth(value);
        angular.forEach(data.dataAxis,function (yAxis) {
            yData.push({
                name:yAxis.name,
                type:'bar',
                barWidth:barWidth,
                stack: yAxis.stack,
                data:yAxis.value
            });
        });
        var option = {
            color:color,
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data:[]
            },
            grid: {
                top:"40px",
                left: '3%',
                right: '4%',
                bottom: '6%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : data.xAxisTitle,
                    name : data.$xName
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name : data.$yName
                }
            ],
            series : yData
        };
        if(data.$projectType&&data.$projectType=='docPaymentType'){  //历史分析-费用分析-医生收费趋势tooltip重写
            option.tooltip.formatter = function (pattem) {
                return setStaTypeTooltip(data,pattem).join('<br />');
            };
        }
        return option;
    }

    /**
     * 地域图option
     * @param data
     */
    this.setRegionOption = function (data) {
        var min,max;  //找到地域图的最大值和最小值
        angular.forEach(data.data.result,function (entity,idx) {
            if(idx == 0){
                min = entity.value;
                max = entity.value;
            }
            min > entity.value ? min = entity.value : undefined;
            max < entity.value ? max = entity.value : undefined;
        });
        var option = {
            "title": {
                "text": ""
            },
            "tooltip": {
                "trigger": "item"
            },
            "dataRange": {
                "x": "left",
                "y": "bottom",
                "min": min,
                "max": max,
                "calculable": true
            },
            "series": [
                {
                    "data": data.data.result,
                    "name": "人次",
                    "type": "map",
                    "itemStyle": {
                        "normal": {
                            "label": {
                                "show": true
                            },
                            "borderColor": "rgba(30,144,255,1)",
                            "borderWidth": 0.5
                        },
                        "emphasis": {
                            "label": {
                                "show": true
                            }
                        }
                    },
                    "mapType": "china",
                    "roam": false
                }
            ]
        }
        return option;
    }

    /**
     * 按天统计,按月统计等绘图的tooltip重写
     * @param data 绘图的数据
     * @param pattem 鼠标进入后返回的数据
     * @returns {Array}
     */
    function setStaTypeTooltip(data,pattem) {
        var tooltip = [],
        //不同的统计类型显示的比率名称不同
            ratioTip = data.$staType == 'day' ? '同上周同天比较' : data.$staType == 'week' ? '同上月同周比较' :'同上年同月比较';
        angular.forEach(pattem,function (entity) {
            var  circle = '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + entity.color + '"></span>';
            tooltip.push(circle + entity.seriesName +':' + entity.value);

            //折线图的tooltip按月统计要加一个提示
            if(entity.data.hb_ratio && entity.data.nonths != '1'){
                setStaTypetip(entity,'ratio',tooltip,ratioTip,'');
                var ratioTipOth = "同年上月比较";
                setStaTypetip(entity,'hb_ratio',tooltip,ratioTipOth,'<br />');
            }else{
                setStaTypetip(entity,'ratio',tooltip,ratioTip,'<br />');
            }
        });
        return tooltip;
    }

    function setStaTypetip(entity,key,toolTip,ratioTip,br) {
        var isGreaterThan = +entity.data[key] >= 0,  //比率是否大于0
            tip =  isGreaterThan ? '增加' : '减少' +':',  //比率大于0'增加'小于0'减少'
            ratio = isGreaterThan ? +entity.data[key] : (entity.data[key]).toString().split('-')[1],
            ratioNum =  parseFloat(ratio*100).toFixed(2)+'%';  //转换成百分比的数据
        toolTip.push(ratioTip +tip+ ratioNum+br);
    }

    /**
     * 动态修改柱状图的柱的宽度
     * @param data
     * @param len  有的柱状图一个位置放置多个图
     * @returns {*}
     */
    function getBarWidth(data,len) {
        var length = Object.keys(data).length,  //有的数据是object类型
            length = len && len > 0 ? length*len : length;
        if(length <= 2){
            return "10%";
        }else if(length <= 4){
            return "30%";
        }else if(length > 4 && length <= 5){
            return "50%";
        }else if(length > 5 && length <= 10){
            return "40%";
        }else{
            return "auto";
        }
    }
}]);