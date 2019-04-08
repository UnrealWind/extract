angular.module('infi-basic')
    .controller('dataSelectExplorationController',[ '$scope','DataService','$routeParams','SYS',function ($scope,DataService,$routeParams,SYS) {

        //表格头数组
        $scope.title = [];
        //无序变量数据结构
        $scope.tablesWuxu = [];

        //连续变量数据结构
        $scope.tablesLianxu = [];
        $scope.condition = [];
        //已选变量的名称
        // $scope.selectedData = $scope.condition[0].name + ' , ' + $scope.condition[1].name + ' , ';
        $scope.selectedData = '';
        //搜索关键字
        $scope.searchData = '';
        //搜索方法
        //搜索按钮
        $scope.search = function(){
            if($routeParams.modify){
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
                        for (var i = 0; i < $scope.condition.length; i++) {
                        }
                        $scope.title = data.data
                    }
                })
            }else{
                DataService.ajaxExplorationSetDataSearch($routeParams.id,$scope.searchData).then(function(data){
                    if(data.data !== null){
                        $scope.condition = [];
                        for(var i = 0 ; i < data.data.length ; i++){
                            $scope.condition.push({name:data.data[i].name,active:'',ruleCode:data.data[i].ruleCode,type:data.data[i].type});
                        }
                        $scope.title = data.data
                    }else{
                        $scope.condition = [];
                    }
                })
            }
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
            if($routeParams.modify){
                DataService.ajaxVariableSetData($routeParams.id).then(function(data){
                    $scope.condition = [];
                    $scope.initialize();
                    for(var i = 0 ; i < data.data.length ; i++){
                        if($scope.selectLeftData.value == '全部'){
                            $scope.condition.push({name:data.data[i].name,active:'',ruleCode:data.data[i].ruleCode,type:data.data[i].type});
                        }else if($scope.selectLeftData.value == data.data[i].type){
                            $scope.condition.push({name:data.data[i].name,active:'',ruleCode:data.data[i].ruleCode,type:data.data[i].type});
                        }
                    }
                });
            }else{
                DataService.ajaxDataSelectExploration($routeParams.id).then(function(data){
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

        }
        //点击数据选择
        $scope.conditionClick = function(data){
            if($scope.factorDisplay == false){
                return
            }
            if(data.active !== ''){
                data.active = '';
                $scope.selectedData = $scope.selectedData.replace(data.name+" , ",'');
                if(true){
                    for(var i = 0 ; i < $scope.tablesLianxu.length ; i++){
                        if($scope.tablesLianxu[i].label == data.name){
                            $scope.tablesLianxu.splice(i,1);
                        }
                    }
                }
                if(true){
                    for(var i = 0 ; i < $scope.tablesWuxu.length ; i++){
                        if($scope.tablesWuxu[i].label == data.name){
                            $scope.tablesWuxu.splice(i,1);
                        }
                    }
                }

                return
            }else{
                data.active = 'infi-analysis-background';
                $scope.selectedData = $scope.selectedData + data.name + ' , ';
            }


            if($routeParams.modify){
                DataService.ajaxConditionXiuGaiData($routeParams.id,data.ruleCode).then(function(data){
                    DataService.ajaxDataDeals($scope.title,data.data).then(function(data){
                        if(data.data.continuity.length !== 0){
                            $scope.tablesLianxu.push(data.data.continuity[0]);
                            setTimeout(function () {
                                $scope.xiangEchart(data.data.continuity[0])
                            },100)

                        }
                        if(data.data.classify.length !== 0){
                            $scope.tablesWuxu.push(data.data.classify[0]);
                            $scope.tablesWuxu[$scope.tablesWuxu.length-1].exps = []
                            angular.forEach($scope.tablesWuxu[$scope.tablesWuxu.length-1].exp,function(value,key){
                                $scope.tablesWuxu[$scope.tablesWuxu.length-1].exps.push({name:key,value:value.f,values:value.fp})
                            });
                            setTimeout(function () {
                                $scope.barEchart(data.data.classify[0])
                            },100)


                        }

                    });
                });
            }else{
                DataService.ajaxConditionData($routeParams.id,data.ruleCode).then(function(data){
                    DataService.ajaxDataDeals($scope.title,data.data).then(function(data){
                        if(data.data.continuity.length !== 0){
                            $scope.tablesLianxu.push(data.data.continuity[0]);
                            setTimeout(function () {
                                $scope.xiangEchart(data.data.continuity[0])
                            },100)

                        }
                        if(data.data.classify.length !== 0){

                            $scope.tablesWuxu.push(data.data.classify[0]);
                            $scope.tablesWuxu[$scope.tablesWuxu.length-1].exps = [];
                            angular.forEach($scope.tablesWuxu[$scope.tablesWuxu.length-1].exp,function(value,key){
                                $scope.tablesWuxu[$scope.tablesWuxu.length-1].exps.push({name:key,value:value.f,values:value.fp})
                            });
                            setTimeout(function () {
                                $scope.barEchart(data.data.classify[0])
                            },100)

                        }

                    });
                });
            }
        }

        $scope.switch = function(data,type){
            if( type == 'pie' ){
                $scope.pieEchart(data);
            }else if( type == 'bar' ){
                $scope.barEchart(data);
            }
        }
        $scope.swithBottom = function(data,type){
            if( type == 'shadow' ){
                $scope.xiangEchart(data);
            }else if( type == 'solid' ){
                $scope.QQEchart(data);
            }
        }

        //
        $scope.pieEchart = function(datas){
            var pieData = [];
            for(var i = 0 ; i < datas.exps.length ; i++){
                pieData.push({value:datas.exps[i].value,name:datas.exps[i].name});
            }
            // var myChartsBefore = echarts.init(document.getElementById('main'));
            var myChartsAfter = echarts.init(document.getElementById('wuxu_'+datas.label));
            myChartsAfter.clear();
            var options = {
                title : {
                    text: datas.exps.label,
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

        $scope.barEchart = function(datas){
            var barData = [];
            var barName = [];
            for(var i = 0 ; i < datas.exps.length ; i++){
                barData.push(datas.exps[i].value);
                barName.push(datas.exps[i].name);
            }
            // var myChartsBefore = echarts.init(document.getElementById('main'));
            var myChartsAfter = echarts.init(document.getElementById('wuxu_'+datas.label));
            myChartsAfter.clear();
            var options = {
                title : {
                    text: datas.label,
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
        $scope.xiangEchart = function(datas){
            var myChartsAfter = echarts.init(document.getElementById('lianxu_'+datas.label));

            var option = {
                title : {
                    text: datas.label,
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

        $scope.QQEchart = function(datas){
            var myChartsAfter = echarts.init(document.getElementById('lianxu_'+datas.label));
            var dataAlls = [];
            var dataAll = []
            for(var i = 0  ; i < datas.exp.qq_plot.osm.length ; i++){
                dataAlls.push([datas.exp.qq_plot.osm[i],datas.exp.qq_plot.osr[i]]);
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
                    coord: [datas.exp.qq_plot.osm[0],datas.exp.qq_plot.soi[0]],
                    symbol: 'none'
                }, {
                    coord: [datas.exp.qq_plot.osm[datas.exp.qq_plot.osm.length-1],datas.exp.qq_plot.soi[datas.exp.qq_plot.soi.length-1]],
                    symbol: 'none'
                }]]
            };
            var option = {
                title: {
                    text: datas.label,
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
                    {gridIndex: 0, min: parseInt(datas.exp.qq_plot.osm[0]-2) , max: parseInt(datas.exp.qq_plot.osm[datas.exp.qq_plot.osm.length-1]+2) }
                ],
                yAxis: [
                    {gridIndex: 0, min: parseInt(datas.exp.qq_plot.soi[0]-2), max: parseInt(datas.exp.qq_plot.soi[datas.exp.qq_plot.soi.length-1]+2) }
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

        angular.element(document).ready(function(){
            // $scope.barEchart();
            // $scope.xiangEchart()
        })

        $scope.dataLeftNav = function(){
            if($routeParams.modify){
                DataService.ajaxVariableSetData($routeParams.id).then(function(data){
                    $scope.condition = [];
                    for(var i = 0 ; i < data.data.length ; i++){
                        $scope.condition.push({name:data.data[i].name,active:'',ruleCode:data.data[i].ruleCode});
                    }
                    $scope.title = data.data
                    $scope.conditionClick($scope.condition[0]);
                });
            }else{
                DataService.ajaxDataSelectExploration($routeParams.id).then(function(data){
                    $scope.condition = [];
                    for(var i = 0 ; i < data.data.length ; i++){
                        $scope.condition.push({name:data.data[i].name,active:'',ruleCode:data.data[i].ruleCode,type:data.data[i].type});
                    }
                    $scope.title = data.data
                    $scope.conditionClick($scope.condition[0]);
                });
            }

        }
        $scope.dataLeftNav();


    }]);