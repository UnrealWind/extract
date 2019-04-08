angular.module('infi-basic').controller('DemoController', ['$scope', 'DataService', 'SYS','DrawEchartService','DataAdapter','PageInteractiveService','KpiColumnService','PrintListService','DemoService', function ($scope, DataService, SYS,DrawEchartService,DataAdapter,PageInteractiveService,KpiColumnService,PrintListService,DemoService) {
    $scope.SYS = SYS;
    (function lineRegisterType() {
        var myChart = echarts.init(document.getElementById('lineRegisterType'));
        option = {

            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['2017-6-1','2017-6-3','2017-6-5','2017-6-7','2017-6-9',
                    '2017-6-11','2017-6-13','2017-6-15','2017-6-17','2017-6-19',
                    '2017-6-21','2017-6-23','2017-6-25','2017-6-27','2017-6-29']
            },
            yAxis: {
                type: 'value',
                min:0,
                max:35000
            },
            series: [
                {
                    name:'青海省人民医院',
                    type:'line',
                    stack: '总量',
                    data:[31250, 30987, 25489, 29456, 24569,
                        33269, 30478 , 30987, 24987, 33187,
                        31250, 30987, 25489, 29456, 24569]
                }
            ]
        };
        myChart.setOption(option);
    })();

    (function lineRegisterType() {
        var myChart = echarts.init(document.getElementById('lineBackNumber'));
        option = {

            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['2017-6-1','2017-6-3','2017-6-5','2017-6-7','2017-6-9',
                    '2017-6-11','2017-6-13','2017-6-15','2017-6-17','2017-6-19',
                    '2017-6-21','2017-6-23','2017-6-25','2017-6-27','2017-6-29']
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    name:'好转率',
                    type:'line',
                    stack: '总量',
                    data:[31250, 30987, 25489, 29456, 24569,
                        33269, 30478 , 30987, 24987, 33187,
                        31250, 30987, 25489, 29456, 24569]
                },
                {
                    name:'治愈率',
                    type:'line',
                    stack: '总量',
                    data:[31250, 30987, 25489, 29456, 24569,
                        33269, 30478 , 30987, 24987, 33187,
                        31250, 30987, 25489, 29456, 24569]
                },
                {
                    name:'死亡率',
                    type:'line',
                    stack: '总量',
                    data:[1223, 1142, 1825, 1233, 3221,
                        2313, 4221 , 12, 3222, 11,
                        2, 5, 22, 4434, 113]
                }
            ]
        };
        myChart.setOption(option);
    })();

    (function barDeptRanking() {
        var myChart = echarts.init(document.getElementById('barDeptRanking'));
        option = {
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
                data: ['高血压','急性上呼吸道感染','正常妊娠监督','糖尿病','急性支气管炎','高脂血症'
                    ,'慢性胃炎','支气管炎','感冒','2型糖尿病']
            },
            series: [
                {
                    name: '2011年',
                    type: 'bar',
                    data: [3103,3203,4203, 4489, 5034,7034,9034,10970, 11744, 12230],
                    barWidth: '60%'
                }
            ]
        };

        myChart.setOption(option);
    })();

    (function zhigong() {
        var myChart = echarts.init(document.getElementById('zhigong'));
        option = {
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['总职工人数', '注册医护人数', '在编医护人数', '全科医师人数'],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'直接访问',
                    type:'bar',
                    barWidth: '60%',
                    data:[15000, 13000, 10000, 3000]
                }
            ]
        };


        myChart.setOption(option);
    })();

    (function fufeirenci() {
        var myChart = echarts.init(document.getElementById('fufeirenci'));
        option = { title: {
            text: '付费类型构成（人次）'
        },"color":["#ff6666","#9999cc","#61a0a8","#d48265","#91c7ae","#749f83","#ca8622","#bda29a","#6e7074","#546570","#c4ccd3"],"tooltip":{"trigger":"item","formatter":"{a} <br/>{b}: {c} ({d}%)"},"legend":{"orient":"vertical","x":"left","data":[]},"series":[{"name":"","type":"pie","selectedMode":"single","radius":[0,"40%"],"label":{"normal":{"position":"inner"}},"labelLine":{"normal":{"show":false}},"data":[]},{"name":"","type":"pie","radius":["50%","65%"],"data":[{"visit_date":"2016-2-1","name":"全费","value":26085,"level":"1","type":"全费"},{"visit_date":"2016-2-1","name":"军队医改","value":9407,"level":"1","type":"军队医改"},{"visit_date":"2016-2-1","name":"地方医保","value":6025,"level":"1","type":"地方医保"},{"visit_date":"2016-2-1","name":"地方公疗","value":2266,"level":"1","type":"地方公疗"},{"visit_date":"2016-2-1","name":"新农合","value":546,"level":"1","type":"新农合"},{"visit_date":"2016-2-1","name":"公费","value":43,"level":"1","type":"公费"}]}]}
        myChart.setOption(option);
    })();

    (function fufeiwanyuan() {
        var myChart = echarts.init(document.getElementById('fufeiwanyuan'));
        option = { title: {
            text: '付费项目（万元）',
            subtext:"今日收费：全费"
        },"color":["#ff6666","#9999cc","#61a0a8","#d48265","#91c7ae","#749f83","#ca8622","#bda29a","#6e7074","#546570","#c4ccd3"],"tooltip":{"trigger":"item","formatter":"{a} <br/>{b} : {c} ({d}%)"},"legend":{"orient":"vertical","left":"left","data":[]},"series":[{"name":"","type":"pie","radius":"60%","center":["50%","50%"],"data":[{"visit_date":"2016-2-1","pay_type":"全费","name":"西药","value":6864.29},{"visit_date":"2016-2-1","pay_type":"全费","name":"化验","value":3456.1},{"visit_date":"2016-2-1","pay_type":"全费","name":"检验","value":2908.18},{"visit_date":"2016-2-1","pay_type":"全费","name":"治疗","value":758.64},{"visit_date":"2016-2-1","pay_type":"全费","name":"材料","value":725.64},{"visit_date":"2016-2-1","pay_type":"全费","name":"手术","value":216.45},{"visit_date":"2016-2-1","pay_type":"全费","name":"中药","value":91.01},{"visit_date":"2016-2-1","pay_type":"全费","name":"麻醉","value":23.15},{"visit_date":"2016-2-1","pay_type":"全费","name":"血费","value":7.31},{"visit_date":"2016-2-1","pay_type":"全费","name":"床位","value":4.62},{"visit_date":"2016-2-1","pay_type":"全费","name":"护理","value":1.73},{"visit_date":"2016-2-1","pay_type":"全费","name":"膳食","value":0.45}],"itemStyle":{"emphasis":{"shadowBlur":10,"shadowOffsetX":0,"shadowColor":"rgba(0, 0, 0, 0.5)"}}}]}

        myChart.setOption(option);
    })();

    (function fufeiwanyuan1() {
        var myChart = echarts.init(document.getElementById('fufeiwanyuan1'));
        option = { title: {
            text: '付费项目（万元）',
            subtext:"今日收费：全费"
        },"color":["#ff6666","#9999cc","#61a0a8","#d48265","#91c7ae","#749f83","#ca8622","#bda29a","#6e7074","#546570","#c4ccd3"],"tooltip":{"trigger":"item","formatter":"{a} <br/>{b} : {c} ({d}%)"},"legend":{"orient":"vertical","left":"left","data":[]},"series":[{"name":"","type":"pie","radius":"60%","center":["50%","50%"],"data":[{"visit_date":"2016-2-1","pay_type":"全费","name":"西药","value":6864.29},{"visit_date":"2016-2-1","pay_type":"全费","name":"化验","value":3456.1},{"visit_date":"2016-2-1","pay_type":"全费","name":"检验","value":2908.18},{"visit_date":"2016-2-1","pay_type":"全费","name":"治疗","value":758.64},{"visit_date":"2016-2-1","pay_type":"全费","name":"材料","value":725.64},{"visit_date":"2016-2-1","pay_type":"全费","name":"手术","value":216.45},{"visit_date":"2016-2-1","pay_type":"全费","name":"中药","value":91.01},{"visit_date":"2016-2-1","pay_type":"全费","name":"麻醉","value":23.15},{"visit_date":"2016-2-1","pay_type":"全费","name":"血费","value":7.31},{"visit_date":"2016-2-1","pay_type":"全费","name":"床位","value":4.62},{"visit_date":"2016-2-1","pay_type":"全费","name":"护理","value":1.73},{"visit_date":"2016-2-1","pay_type":"全费","name":"膳食","value":0.45}],"itemStyle":{"emphasis":{"shadowBlur":10,"shadowOffsetX":0,"shadowColor":"rgba(0, 0, 0, 0.5)"}}}]}

        myChart.setOption(option);
    })();

    (function fufeiyiyuan() {
        var myChart = echarts.init(document.getElementById('fufeiyiyuan'));
        option = option = {
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
                data: ['青海省人民医院','青海省中医院','青海大学附属医院','青海省妇女儿童医院','青海省藏医院','青海省第三人民医院'
                    ,'青海省心血管病专科医院','青海省第五人民医院','西宁东方医院','青海省海东地区人民医院']
            },
            series: [
                {
                    name: '2011年',
                    type: 'bar',
                    data: [3103,3203,4203, 4489, 5034,7034,9034,10970, 11744, 12230],
                    barWidth: '60%'
                }
            ]
        };
        myChart.setOption(option);
    })();

    function init(){
        //消耗品收支排行
        drawConsumables();
        //患者费用
        drawCost();
        //医生收费监控
        drawDoctorCharge();
        //患者人均次均费用
        getAverageCost();
    }
    init();
    
    function drawConsumables() {
        var myChart = echarts.init(document.getElementById('consumables'));
        var option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data:['利润', '支出', '收入']
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
                    data : ['药品','耗材','检查','治疗']
                }
            ],
            series : [
                {
                    name:'利润',
                    type:'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    },
                    data:[1000, 850, 600, 500]
                },
                {
                    name:'收入',
                    type:'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true
                        }
                    },
                    data:[2472.34, 2897, 1289.21, 950]
                },
                {
                    name:'支出',
                    type:'bar',
                    stack: '总量',
                    label: {
                        normal: {
                            show: true,
                            position: 'left'
                        }
                    },
                    data:[-1472.34, -2047, -689.21, -450]
                }
            ]
        };
        myChart.setOption(option);
        $('.infi-main').resize(function(){
            myChart.resize(option);
        });
    }
    function drawCost(){
        DemoService.getCost().then(function (msg) {
            DrawEchartService.getChartData('pie','costDetails',msg);
        });
        DemoService.getPatientCost().then(function (msg) {
            DataAdapter.transformBar(msg,'horizontal');
            if(msg.status == $scope.SYS.STATUS_SUCCESS){
                msg.$xName = "元";  //x轴单位
                msg.$tooltipName = "费用（元）";  //tooltip单位
                DrawEchartService.drawChart('bar','patientCost',msg);
            }else{
                $("#patientCost").text(msg.description);
            }
        });
    }

    function drawDoctorCharge(){
        var myChart = echarts.init(document.getElementById('doctorCharge'));
        var option = {
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis:  {
                type: 'category',
                data: ['冯*明','刘*缘','孙*颖','张*平','王*璇','王*航','胡*庆']

            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '药品收费',
                    type: 'bar',
                    stack: '总量',
                    data: [20000, 18900, 16909, 16909, 14909, 13909, 12909]
                },
                {
                    name: '检查收费',
                    type: 'bar',
                    stack: '总量',
                    data: [15000, 14780, 13750, 12760, 10760, 9760, 8760]
                },
                {
                    name: '检验收费',
                    type: 'bar',
                    stack: '总量',
                    data: [10000, 9200, 8200, 8200, 8200, 8200, 8400]
                },
                {
                    name: '医事服务费',
                    type: 'bar',
                    stack: '总量',
                    data: [5000, 6789, 6089, 5089, 4689, 4489, 4289]
                },
                {
                    name: '治疗费用',
                    type: 'bar',
                    stack: '总量',
                    data: [2500, 3000, 2000, 2000, 2300, 2200, 2300]
                }
            ]
        };
        myChart.setOption(option);
        $('.infi-main').resize(function(){
            myChart.resize(option);
        });
    }

    function getAverageCost(){
        var myChart = echarts.init(document.getElementById('averageCost'));
        var option = {
            color: ['#3398DB'],
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['次均费用', '次均药品费用', '次均检验费用', '次均检查费用', '次均治疗费用']
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'人均费用',
                    type:'bar',
                    barWidth: '60%',
                    data:[1200, 500, 200, 400, 100]
                }
            ]
        };
        myChart.setOption(option);
        $('.infi-main').resize(function(){
            myChart.resize(option);
        });
    }

}]).service('DemoService',['$http','SYS',function($http,SYS){
    //获取患者费用排行（柱状图）
    this.getPatientCost = function(){
        return $http.get(SYS.infiUrl + 'patient.cost.demo.json').then(function(msg){
            return msg.data;
        })
    };
    //获取花费详情（饼图）
    this.getCost = function(){
        return $http.get(SYS.infiUrl + 'cost.demo.json').then(function(msg){
            return msg.data;
        })
    }
}]);
