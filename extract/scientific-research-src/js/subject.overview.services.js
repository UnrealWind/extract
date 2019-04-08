angular.module('infi-basic')
    .service('subjectOverviewService',['$http','SYS',function($http,SYS){

        this.getOverviewData = function (subjectId,time) {
            return $http({
                url: SYS.url + 'subject/kpi/' + subjectId +'/' + time,
                method: 'get'
            }).then(function (msg) {
                return msg.data;
            });
        }
        //获取第一个图的数据
        this.getColumnChart = function (subjectId) {
            return $http({
                url: SYS.url + 'subject/features/column/' + subjectId,
                method: 'get',
            }).then(function (msg) {
                var bar = {
                    data: filterOutputBarLine(msg.data),
                    status: msg.data.status,
                    success: msg.data.success
                }
                return bar;
            })
        }
        function filterOutputBarLine(msg) {
            var json = msg.data;
            var xAxis = [], series = [], temp = [], total = [], percent = [], realRecordSize = [];
            for(var key in json) {
                xAxis.push(key);
                temp.push(json[key])
            }
            angular.forEach(temp,function (item) {
                total.push(item.total);
                percent.push(item.realRecordSize);
                realRecordSize.push(item.percent);
            });
            var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: '{a0}:{c0}<br />{a1}:{c1}<br />{a2}:{c2}%'
                },

                xAxis:  {
                    type: 'category',
                    data: xAxis
                },
                yAxis: {
                    type: 'value',
                },
                legend:{
                    data:['计划数量','完成数量','完成百分比'],
                    bottom: 'bottom'
                },
                series: [
                    {
                        type:'bar',
                        name: '计划数量',
                        barWidth: 20,
                        data: total,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    position: 'outside',
                                    formatter:'{c}'
                                }
                            }
                        },
                    },
                    {
                        type:'bar',
                        name: '完成数量',
                        barWidth: 20,
                        data: percent,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    position: 'outside',
                                    formatter:'{c}'
                                }
                            }
                        },
                    },
                    {
                        type:'bar',
                        name: '完成百分比',
                        barWidth: 20,
                        data: realRecordSize,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    position: 'outside',
                                    formatter:'{c}%'
                                }
                            }
                        },

                    }
                ],
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: 'black'
                        }
                    }
                }
            };
            return option;
        }
        //获取第二个图的数据
        this.getLineChart = function (subjectId) {
            return $http({
                url: SYS.url + 'subject/features/line/' + subjectId,
                method: 'get',
            }).then(function (msg) {
                if(msg.data.status == SYS.STATUS_SUCCESS){
                    var bar = {
                        data: filterOutputLine(msg.data),
                        status: msg.data.status,
                        success: msg.data.success
                    };
                    return bar;
                }
            });
        };
        function filterOutputLine(msg) {
            var data = msg.data;
            var xAxis = [], name = [], time= [],series = [], tempData = [], datas = [];
            for(var i=0,dataLength = data.length; i< dataLength;i++){
                tempData = [];
                name.push(data[i].name);
                time = data[i].time;
                datas = data[i].data;

                for(var j = 0; j< time.length;j++){
                    tempData.push([time[j],datas[j]]);
                }
                series.push({type: 'line',name: name[i],data:tempData});
            }
            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                xAxis:  {
                    type: 'category',
                    data: time
                },
                legend: {
                    data: name,
                    bottom: 'bottom'
                },
                yAxis: {
                    type: 'value',
                },
                series: series
            };
            return option;
        }
        //获取第三个图的数据
        this.getRateChart = function (subjectId) {
            return $http({
                url: SYS.url + 'subject/features/rate/' + subjectId,
                method: 'get',
            }).then(function (msg) {
                var bar = {
                    data: filterOutputRate(msg.data),
                    status: msg.data.status,
                    success: msg.data.success
                };
                return bar;
            });
        };
        function filterOutputRate(msg) {
            var json = msg.data;
            var xAxis = [], series = [];
            for(var key in json){
                xAxis.push(key);
                series.push(json[key]);
            }
            var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter: '{b}:{c}'
                },
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        textStyle: {
                            color: 'black'
                        },
                        formatter: '{c}%'
                    }
                },
                xAxis:  {
                    type: 'category',
                    data: xAxis
                },
                color:['#5b85b0'],
                yAxis: {
                    type: 'value',
                    axisLabel: {
                        show: true,
                        interval: 'auto',
                        formatter: '{value} %'
                    }
                },
                series: [
                    {
                        type:'bar',
                        name: '完成比率',
                        barWidth: 30,
                        data:series
                    }
                ]
            };
            return option;
        }
        //获取第四个图的数据
        this.getBarChart = function (subjectId) {
            return $http({
                url: SYS.url + 'subject/features/bar/' + subjectId,
                method: 'get',
            }).then(function (msg) {
                var bar = {
                    data: filterOutputBar(msg.data),
                    status: msg.data.status,
                    success: msg.data.success
                };
                return bar;
            });
        };
        function filterOutputBar(msg) {
            var json = msg.data;
            var xAxis = [], temp = [], finish = [], ready = [];
            for(var key in json){
                xAxis.push(key);
                temp.push(json[key]);
            }
            angular.forEach(temp,function (item) {
                finish.push(item.finish);
                ready.push(item.ready);
            });
            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                xAxis:  {
                    type: 'category',
                    data: xAxis
                },
                legend: {
                    data: ['完成访视','未完成访视'],
                    bottom: 'bottom'
                },
                color:['#5b85b0','#dc143c'],
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        type:'bar',
                        name: '完成访视',
                        barWidth: 20,
                        data:finish
                    },
                    {
                        type:'bar',
                        barWidth: 20,
                        name: '未完成访视',
                        data:ready
                    },

                ]
            };
            return option;
        }

        //获取课题基本信息
        this.getSubjectDetail = function (subjectId) {
            return $http({
                url: SYS.url + 'subject/' + subjectId,
                method: 'get',
            }).then(function (msg) {
                return msg.data;
            });
        };

        //获取各中心情况数据
        this.getGroupData = function (subjectId) {
            return $http({
                url: SYS.url + 'subject/group/' + subjectId,
                method: 'get',
            }).then(function (msg) {
                return msg.data;
            })
        }

        //获取科室/医院数据
        this.getHosDeptData = function (subjectId) {
            return $http({
                url: SYS.url + 'subject/member/attend/' + subjectId,
                method: 'get',
            }).then(function (msg) {
                return msg.data;
            });
        };
    }]);