angular.module('infi-basic')
    .controller('filterSetExplorationController',[ '$scope','DataService','$routeParams','SYS',function ($scope,DataService,$routeParams,SYS) {

        $scope.trThree = [
            {name:'属性'},
            {name:'均值'},
            {name:'标准差'},
            {name:'下限'},
            {name:'上限'},
            {name:'中位数'},
            {name:'25'},
            {name:'75'},
            {name:'最小值'},
            {name:'最大值'},
            {name:'均值'},
            {name:'标准差'},
            {name:'下限'},
            {name:'上限'},
            {name:'中位数'},
            {name:'25'},
            {name:'75'},
            {name:'最小值'},
            {name:'最大值'},
            {name:'P值'},
            {name:'方差齐性'}
        ];

        $scope.tablesWuxu = [];
        $scope.tablesLianxu = [];

        //已选变量的名称
        // $scope.selectedData = $scope.condition[0].name + ' , ' + $scope.condition[1].name + ' , ';
        $scope.selectedData = '';
        //搜索关键字
        $scope.searchData = '';
        //搜索方法
        $scope.search = function(){
            DataService.ajaxVariableSetDataSearch($routeParams.id,$scope.searchData).then(function(data) {
                $scope.condition = [];
                if(data.data !== null) {
                    for (var i = 0; i < data.data.length; i++) {
                        $scope.condition.push({
                            name: data.data[i].name,
                            active: '',
                            ruleCode: data.data[i].ruleCode
                        });
                    }
                    $scope.title = data.data
                }
            })
        }

        $scope.selectLeftData = {
            value:'',
            data:[
                {name:'全部',value:'全部'},
                {name:'分类变量',value:'分类变量'},
                {name:'连续变量',value:'连续变量'}
            ]
        }

        $scope.initialize = function(){
            $scope.tablesWuxu = [];

            //连续变量数据结构
            $scope.tablesLianxu = [];
            //表格头数组
            $scope.selectedData = [];
        }
        // 分类连续变量选择
        $scope.selectLeft = function(){
            DataService.ajaxVariableSetData($routeParams.id).then(function(data){
                $scope.condition = [];
                // $scope.initialize();
                for(var i = 0 ; i < data.data.length ; i++){
                    if($scope.selectLeftData.value == '全部'){
                        $scope.condition.push({name:data.data[i].name,active:'',ruleCode:data.data[i].ruleCode,type:data.data[i].type});
                    }else if($scope.selectLeftData.value == data.data[i].type){
                        $scope.condition.push({name:data.data[i].name,active:'',ruleCode:data.data[i].ruleCode,type:data.data[i].type});
                    }
                }
            });
        }

        //点击数据选择
        $scope.conditionClick = function(data){
            // $scope.H5();
            if($scope.factorDisplay == false){
                return
            }
            if(data.active !== ''){
                data.active = '';
                $scope.selectedData = $scope.selectedData.replace(data.name+" , ",'');
                for(var i = 0 ; i < $scope.tablesWuxu.length ; i++){
                    if($scope.tablesWuxu[i].label == data.name){
                        $scope.tablesWuxu.splice(i,1);
                    }
                }
                for(var i = 0 ; i < $scope.tablesLianxu.length ; i++){
                    if($scope.tablesLianxu[i].name == data.name){
                        $scope.tablesLianxu.splice(i,1);
                    }
                }
            }else{
                data.active = 'infi-analysis-background';
                $scope.selectedData = $scope.selectedData + data.name + ' , ';
                DataService.ajaxModelDataLeft($routeParams.id,data.ruleCode).then(function(datas){
                    DataService.ajaxSingleFactor($scope.title,datas.data.exp,datas.data.ctrl,$scope.groupCompare).then(function(data){


                        if(data.data.classify.length > 0){

                            data.data.classify[0].data = []
                            angular.forEach(data.data.classify[0].exp,function(value,key){
                                data.data.classify[0].data.push({name:key,valueExp:value.f,valuesExp:value.fp,valueCtrl:'',valuesCtrl:''});
                            });
                            var a = 0;
                            angular.forEach(data.data.classify[0].ctrl,function(value,key){
                                data.data.classify[0].data[a].valueCtrl = value.f
                                data.data.classify[0].data[a].valuesCtrl = value.fp
                                a++;
                                // $scope.tablesWuxu[0].data.push({valueCtrl:value.f,valuesCtrl:value.fp});
                                // for(var i = 0 ; i <  ; i++){
                                //
                                // }
                            });
                            $scope.tablesWuxu.push(data.data.classify[0]);

                            setTimeout(function () {
                                $scope.barEchartExp(data.data.classify[0])
                                $scope.barEchartCtrl(data.data.classify[0])
                            },100)
                        }
                        if(data.data.continuity.length > 0){
                            $scope.tablesLianxu.push(
                                {
                                    name:data.data.continuity[0].label,
                                    zs:data.data.continuity[0].exp.mean.value,
                                    bs:data.data.continuity[0].exp.std.value,
                                    ss:data.data.continuity[0].exp.confidence_min.value,
                                    xs:data.data.continuity[0].exp.confidence_max.value,
                                    zwss:data.data.continuity[0].exp.median.value,
                                    sas:data.data.continuity[0].exp.quartile_min.value,
                                    szs:data.data.continuity[0].exp.quartile_max.value,
                                    zxs:data.data.continuity[0].exp.min.value,
                                    zds:data.data.continuity[0].exp.max.value,
                                    QQexp:data.data.continuity[0].exp.qq_plot,

                                    zd:data.data.continuity[0].ctrl.mean.value,
                                    bd:data.data.continuity[0].ctrl.std.value,
                                    sd:data.data.continuity[0].ctrl.confidence_min.value,
                                    xd:data.data.continuity[0].ctrl.confidence_max.value,
                                    zwsd:data.data.continuity[0].ctrl.median.value,
                                    sad:data.data.continuity[0].ctrl.quartile_min.value,
                                    szd:data.data.continuity[0].ctrl.quartile_max.value,
                                    zxd:data.data.continuity[0].ctrl.min.value,
                                    zdd:data.data.continuity[0].ctrl.max.value,
                                    P:data.data.continuity[0].p,
                                    fc:data.data.continuity[0].chi_value,
                                    QQctrl:data.data.continuity[0].ctrl.qq_plot,
                                }
                            );
                            setTimeout(function () {
                                $scope.xiangEchartExp(data.data.continuity[0])
                                $scope.xiangEchartCtrl(data.data.continuity[0])
                            },100)
                        }
                    });
                })
            }
        }

        $scope.switch = function(data,type,position){
            if(position == 'left'){
                if(type == 'bar'){
                    $scope.barEchartExp(data)
                }else{
                    $scope.pieEchartExp(data)
                }
            }else{
                if(type == 'bar'){
                    $scope.barEchartCtrl(data)
                }else{
                    $scope.pieEchartCtrl(data)
                }
            }
        }
        $scope.swithBottom = function(data,type,position){
            if(position == 'left'){

                if(type == 'shadow'){
                    // var datas = datas
                    var datas = {
                        label:data.name,
                        exp:{
                            min:{value:data.zxs},
                            quartile_min:{value:data.sas},
                            median:{value:data.zwss},
                            quartile_max:{value:data.szs},
                            max:{value:data.zds}
                        }
                    }
                    $scope.xiangEchartExp(datas)
                }else{
                    $scope.QQEchartExp(data)
                }
            }else{
                if(type == 'shadow'){
                    var datas = {
                        label:data.name,
                        exp:{
                            min:{value:data.zxd},
                            quartile_min:{value:data.sad},
                            median:{value:data.zwsd},
                            quartile_max:{value:data.szd},
                            max:{value:data.zdd}
                        }
                    }
                    $scope.xiangEchartCtrl(datas)
                }else{
                    $scope.QQEchartCtrl(data)
                }
            }
        }

        $scope.xiangEchartExp = function(datas){
            var myChartsAfter = echarts.init(document.getElementById('lianxu_left_'+datas.label));

            var option = {
                title : {
                    text: datas.label+'[实验组]',
                    x:'left'
                },
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '15%'
                },
                xAxis: {
                    type: 'category',
                    data: [0],
                    boundaryGap: true,
                    nameGap: 30,
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        formatter:  datas.label
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    splitArea: {
                        show: true
                    }
                },
                series: [
                    {
                        name: 'boxplot',
                        type: 'boxplot',
                        data: [[datas.exp.min.value,datas.exp.quartile_min.value,datas.exp.median.value,datas.exp.quartile_max.value,datas.exp.max.value]],
                        tooltip: {
                            formatter: function (param) {
                                return [
                                    '详细说明 ' + param.name + ': ',
                                    '最大值: ' + param.data[4],
                                    '75: ' + param.data[3],
                                    '中位数: ' + param.data[2],
                                    '25: ' + param.data[1],
                                    '最小值: ' + param.data[0]
                                ].join('<br/>')
                            }
                        }
                    }
                ]
            };
            myChartsAfter.setOption(option);
        }

        $scope.xiangEchartCtrl = function(datas){
            var myChartsAfter = echarts.init(document.getElementById('lianxu_right_'+datas.label));

            var option = {
                title : {
                    text: datas.label+'[对照组]',
                    x:'left'
                },
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '15%'
                },
                xAxis: {
                    type: 'category',
                    data: [0],
                    boundaryGap: true,
                    nameGap: 30,
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        formatter:  datas.label+'[对照组]'
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    splitArea: {
                        show: true
                    }
                },
                series: [
                    {
                        name: 'boxplot',
                        type: 'boxplot',
                        data: [[datas.ctrl.min.value,datas.ctrl.quartile_min.value,datas.ctrl.median.value,datas.ctrl.quartile_max.value,datas.ctrl.max.value]],
                        tooltip: {
                            formatter: function (param) {
                                return [
                                    '详细说明 ' + param.name + ': ',
                                    '最大值: ' + param.data[4],
                                    '75: ' + param.data[3],
                                    '中位数: ' + param.data[2],
                                    '25: ' + param.data[1],
                                    '最小值: ' + param.data[0]
                                ].join('<br/>')
                            }
                        }
                    }
                ]
            };
            myChartsAfter.setOption(option);
        }

        $scope.QQEchartCtrl = function(datas){

            var myChartsAfter = echarts.init(document.getElementById('lianxu_right_'+datas.name));
            var dataAlls = [];
            var dataAll = []
            for(var i = 0  ; i < datas.QQctrl.osm.length ; i++){
                dataAlls.push([datas.QQctrl.osm[i],datas.QQctrl.osr[i]]);
            }
            dataAll.push(dataAlls);
            var markLineOpt = {
                animation: false,
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                data: [[{
                    coord: [datas.QQctrl.osm[0],datas.QQctrl.soi[0]],
                    symbol: 'none'
                }, {
                    coord: [datas.QQctrl.osm[datas.QQctrl.osm.length-1],datas.QQctrl.soi[datas.QQctrl.soi.length-1]],
                    symbol: 'none'
                }]]
            };
            var option = {
                title: {
                    text: datas.name+'[对照组]',
                    x: 'left',
                    y: 0
                },
                grid: [
                    {x: '7%', y: '7%', width: '80%', height: '80%'}
                ],
                tooltip: {
                    formatter: 'Group {a}: ({c})'
                },
                xAxis: [
                    {gridIndex: 0, min: parseInt(datas.QQctrl.osm[0]-2) , max: parseInt(datas.QQctrl.osm[datas.QQctrl.osm.length-1]+2) }
                ],
                yAxis: [
                    {gridIndex: 0, min: parseInt(datas.QQctrl.soi[0]-2), max: parseInt(datas.QQctrl.soi[datas.QQctrl.soi.length-1]+2) }
                ],
                series: [
                    {
                        name: 'I',
                        type: 'scatter',
                        xAxisIndex: 0,
                        yAxisIndex: 0,
                        data: dataAll[0],
                        markLine: markLineOpt
                    }
                ]
            };
            myChartsAfter.setOption(option);
        }

        $scope.QQEchartExp = function(datas){
            var myChartsAfter = echarts.init(document.getElementById('lianxu_left_'+datas.name));
            var dataAlls = [];
            var dataAll = []
            for(var i = 0  ; i < datas.QQexp.osm.length ; i++){
                dataAlls.push([datas.QQexp.osm[i],datas.QQexp.osr[i]]);
            }
            dataAll.push(dataAlls);
            var markLineOpt = {
                animation: false,
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                data: [[{
                    coord: [datas.QQexp.osm[0],datas.QQexp.soi[0]],
                    symbol: 'none'
                }, {
                    coord: [datas.QQexp.osm[datas.QQexp.osm.length-1],datas.QQexp.soi[datas.QQexp.soi.length-1]],
                    symbol: 'none'
                }]]
            };
            var option = {
                title: {
                    text: datas.name+'[实验组]',
                    x: 'left',
                    y: 0
                },
                grid: [
                    {x: '7%', y: '7%', width: '80%', height: '80%'}
                ],
                tooltip: {
                    formatter: 'Group {a}: ({c})'
                },
                xAxis: [
                    {gridIndex: 0, min: parseInt(datas.QQexp.osm[0]-2) , max: parseInt(datas.QQexp.osm[datas.QQexp.osm.length-1]+2) }
                ],
                yAxis: [
                    {gridIndex: 0, min: parseInt(datas.QQexp.soi[0]-2), max: parseInt(datas.QQexp.soi[datas.QQexp.soi.length-1]+2) }
                ],
                series: [
                    {
                        name: 'I',
                        type: 'scatter',
                        xAxisIndex: 0,
                        yAxisIndex: 0,
                        data: dataAll[0],
                        markLine: markLineOpt
                    }
                ]
            };
            myChartsAfter.setOption(option);
        }



        //
        $scope.pieEchartCtrl = function(datas){
            var pieData = [];
            for(var i = 0 ; i < datas.data.length ; i++){
                pieData.push({value:datas.data[i].valuesCtrl,name:datas.data[i].name});
            }
            // var myChartsBefore = echarts.init(document.getElementById('main'));
            var myChartsAfter = echarts.init(document.getElementById('wuxu_right_'+datas.label));
            myChartsAfter.clear();
            var options = {
                title : {
                    text: datas.label+'[对照组]',
                    x:'left'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name:  datas.label,
                        type: 'pie',
                        radius : '70%',
                        center: ['50%', '50%'],
                        data:pieData,
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
            myChartsAfter.setOption(options);
        }

        $scope.pieEchartExp = function(datas){
            var pieData = [];
            for(var i = 0 ; i < datas.data.length ; i++){
                pieData.push({value:datas.data[i].valueCtrl,name:datas.data[i].name});
            }
            // var myChartsBefore = echarts.init(document.getElementById('main'));
            var myChartsAfter = echarts.init(document.getElementById('wuxu_left_'+datas.label));
            myChartsAfter.clear();
            var options = {
                title : {
                    text: datas.label+'[实验组]',
                    x:'left'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: datas.label,
                        type: 'pie',
                        radius : '70%',
                        center: ['50%', '50%'],
                        data:pieData,
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
            myChartsAfter.setOption(options);
        }

        $scope.barEchartExp = function(datas){
            var barData = [];
            var barName = [];
            for(var i = 0 ; i < datas.data.length ; i++){
                barData.push(datas.data[i].valueExp);
                barName.push(datas.data[i].name);
            }
            // var myChartsBefore = echarts.init(document.getElementById('main'));
            var myChartsAfter = echarts.init(document.getElementById('wuxu_left_'+datas.label));
            myChartsAfter.clear();
            var options = {
                title : {
                    text: datas.label+'[实验组]',
                    x:'left'
                },
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
                        data : barName,
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
                        name:'数量',
                        type:'bar',
                        barWidth: '60%',
                        data:barData
                    }
                ]
            };
            myChartsAfter.setOption(options);
        }
        $scope.barEchartCtrl = function(datas){
            var barData = [];
            var barName = [];
            for(var i = 0 ; i < datas.data.length ; i++){
                barData.push(datas.data[i].valueCtrl);
                barName.push(datas.data[i].name);
            }
            // var myChartsBefore = echarts.init(document.getElementById('main'));
            var myChartsAfter = echarts.init(document.getElementById('wuxu_right_'+datas.label));
            myChartsAfter.clear();
            var options = {
                title : {
                    text: datas.label+'[对照组]',
                    x:'left'
                },
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
                        data : barName,
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
                        name:'数量',
                        type:'bar',
                        barWidth: '60%',
                        data:barData
                    }
                ]
            };
            myChartsAfter.setOption(options);
        }

        $scope.dataLeftNav = function(){
            DataService.ajaxVariableSetData($routeParams.id).then(function(data){
                $scope.condition = [];
                for(var i = 0 ; i < data.data.length ; i++){
                    $scope.condition.push({name:data.data[i].name,active:'',ruleCode:data.data[i].ruleCode});
                }
                $scope.title = data.data;
            });
        }
        DataService.ajaxCompleteData($routeParams.id).then(function(data){
            $scope.groupCompare = data.data.groupCompare
        })
        $scope.dataLeftNav();

    }]);