angular.module("infi-basic").controller("HistoryCountController", [
    "$scope",
    'HistoryCountService',
    "APIService",
    "Utils",
    function ($scope, HistoryCountService, APIService, Utils) {
        var $pieGraph = $('#pie-graph') // 饼图容器
        // var $columnGraph = $('#column-graph') // 柱状图容器
        var currGroup = JSON.parse(sessionStorage.getItem('currGroup'))

        $scope.kpiAllData = []                                                 // kpi 数据和饼图数据                                 

        $scope.rangeBind = [] // 日期范围绑定
        $scope.dateRangeOpts = { // 日期范围配置
            singleDatePicker: false,
            autoUpdateInput: true,
        }


        $scope.defaultFilterkind = 0
        $scope.filterKind = [{
                label: '按日统计'
            },
            {
                label: '按周统计'
            },
            {
                label: '按月统计'
            },
        ]

        /**
         * 将总数据过滤成为适合饼图的数据
         * 其实就是去除 “总人数”
         * @param {*} org 原始总数据
         * @returns {array} filtedData 过滤后的数据
         */
        var filtPieData = function(org) {
            var inGroupCount = 0
            var notInGroupCount = 0
            var allCount = 0
            var allCountInd = null


            org.forEach((ele, ind) => {
                if(ele.name === '总人数') {
                    allCount = (+ele.value)
                    allCountInd = ind
                } else {
                    inGroupCount += (ele.value)
                }
            })

            notInGroupCount = allCount - inGroupCount

            org.splice(allCountInd, 1)

            org.push({
                'name': '未入组',
                'value': notInGroupCount
            })

            return org
        }

        // 画饼图
        var drawPieGraph = function(graphDom, data) {
            graphDom.setOption({
                series: [{
                    data: data,
                }]
            })
        }

        /**
         * 切换柱状图数据粒度。按日、周、月
         */
        $scope.changeFilter = (ind) => {
            $scope.defaultFilterkind = ind
        }



        ;
        (function init() {
            var pieGraph = echarts.init($pieGraph[0]);
            // var columnGraph = echarts.init($columnGraph[0]);

            APIService.getHistoryKpi({
                'groupId': currGroup.id
            })
                .then(function(msg) {
                    $scope.kpiAllData = msg

                    var pieData = filtPieData(angular.copy(msg))

                    drawPieGraph(pieGraph ,pieData)
                })


            // 饼图初始化
            pieGraph.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    data: [],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            })

            // 柱状图
            // columnGraph.setOption({
            //     tooltip: {
            //         trigger: 'axis',
            //         axisPointer: { // 坐标轴指示器，坐标轴触发有效
            //             type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            //         }
            //     },
            //     legend: {
            //         data: ['支气管扩张', 'COPD', '哮喘', '间歇性肺疾病', '未分组']
            //     },
            //     grid: {
            //         left: '3%',
            //         right: '4%',
            //         bottom: '3%',
            //         containLabel: true
            //     },
            //     xAxis: {
            //         type: 'category',
            //         data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            //     },
            //     yAxis: {
            //         type: 'value'
            //     },
            //     series: [{
            //             name: '支气管扩张',
            //             type: 'bar',
            //             stack: '总量',
            //             label: {
            //                 normal: {
            //                     show: true,
            //                     position: 'insideRight'
            //                 }
            //             },
            //             data: [320, 302, 301, 334, 390, 330, 320]
            //         },
            //         {
            //             name: 'COPD',
            //             type: 'bar',
            //             stack: '总量',
            //             label: {
            //                 normal: {
            //                     show: true,
            //                     position: 'insideRight'
            //                 }
            //             },
            //             data: [120, 132, 101, 134, 90, 230, 210]
            //         },
            //         {
            //             name: '哮喘',
            //             type: 'bar',
            //             stack: '总量',
            //             label: {
            //                 normal: {
            //                     show: true,
            //                     position: 'insideRight'
            //                 }
            //             },
            //             data: [220, 182, 191, 234, 290, 330, 310]
            //         },
            //         {
            //             name: '间歇性肺疾病',
            //             type: 'bar',
            //             stack: '总量',
            //             label: {
            //                 normal: {
            //                     show: true,
            //                     position: 'insideRight'
            //                 }
            //             },
            //             data: [150, 212, 201, 154, 190, 330, 410]
            //         },
            //         {
            //             name: '未分组',
            //             type: 'bar',
            //             stack: '总量',
            //             label: {
            //                 normal: {
            //                     show: true,
            //                     position: 'insideRight'
            //                 }
            //             },
            //             data: [820, 832, 901, 934, 1290, 1330, 1320]
            //         }
            //     ]
            // })

            $(window).on('resize', function () {
                pieGraph.resize();
                // columnGraph.resize();
            })
        })()
    }
]);