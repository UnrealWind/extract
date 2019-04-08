angular.module('infi-basic').service("TaskMapping",['$http','SYS',function ($http,SYS){
    /**
     * 筛选逻辑配置页面图形的数据处理
     * @param originalData
     */
    function chartMapping(originalData) {
        var chartsData = [];
        //当返回的数据不是空时才绘图
        if(originalData.sex && originalData.sex.buckets.length > 0){
            chartsData.push({type:"infi-chart-small",detail:setPicOption(originalData.sex.buckets,"性别")});
        }
        if(originalData.age && originalData.age.buckets.length > 0){
            chartsData.push({type:"infi-chart-small",detail:setPicOption(originalData.age.buckets,"年龄")});
        }
        if(originalData.marr && originalData.marr.buckets.length > 0){
            chartsData.push({type:"infi-chart-small",detail:setPicOption(originalData.marr.buckets,"婚姻状况")});
        }
        if(originalData.region && originalData.region.buckets.length > 0){
            chartsData.push({type:"infi-chart-big",detail:setRegionOption(originalData.region.buckets)});
        }

        /**
         * 饼图数据处理
         * @param sexData
         */
        function setPicOption(data,title) {
            var optionData = [];
            angular.forEach(data,function (entity) {
                optionData.push({
                    name:entity.key,
                    value:entity.doc_count
                });
            });
            var option = {
                "calculable": false,
                "title": {
                    "text": title
                },
                "tooltip": {
                    "trigger": "item",
                    "formatter": "{b}:{d}%"
                },
                "series": [
                    {
                        "data": optionData,
                        "type": "pie",
                        "radius": "37%"
                    }
                ]
            }
            return option;
        }

        /**
         * 地域图数据处理
         * @param data
         */
        function setRegionOption(data) {
            var optionData = [],
                max=0,
                min=data[0].doc_count;
            angular.forEach(data,function (entity) {
                if(max<entity.doc_count){
                    max=entity.doc_count;
                }
                if(min>entity.doc_count){
                    min=entity.doc_count;
                }
                optionData.push({
                    name:entity.key,
                    value:entity.doc_count
                });
            });
            var option = {
                "title": {
                    "text": "地域分布"
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
                        "data": optionData,
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
        return chartsData;
    }

    function uploadMapping(originalData) {
        var optionNested = {
            title: {
                text: '',
                x: 'left'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {c} ({d}%)"
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
                                formatter: '{b}'
                            }
                        }
                    }
                }
            ]
        };

        optionNested.series[0].data = [{
            name:"无效病例",
            value:originalData["uselessCaseNumber"]
        },{
            name:"有效病例",
            value:originalData["effectiveCaseNumber"]
        }];
        optionNested.series[1].data = [{
            name:"无效病例",
            value:originalData["uselessCaseNumber"]
        },{
            name:"可导出病例",
            value:originalData["exportCaseNumber"]
        },{
            name:"无法导出病例",
            value:originalData["cantExportCaseNumber"]
        }];
        var myChart = echarts.init(document.getElementById('infi-opt-gh'));
        myChart.setOption(optionNested);

        //页面大小发生改变时重新绘制图形,引用外部文件'html-resize.js',绘图div大小改变则重新绘图
        $('.infi-main').resize(function(){
            myChart.resize(optionNested);
        });
    }
    return{
        chartMapping:chartMapping,
        uploadMapping:uploadMapping
    }
}])