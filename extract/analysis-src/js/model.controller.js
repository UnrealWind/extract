angular.module('infi-basic')
    .controller('ModelController',[ '$scope','DataService','$routeParams','$location',function ($scope,DataService,$routeParams,$location) {

        $('body').removeClass("modal-open");
        $(".modal-backdrop").remove();
        
        $scope.content = {
            "page":{
                "totalPages": 5,
                "firstPage": true,
                "lastPage": true,
                "numberOfElements": 10,
                "totalElements": 50,
                "size": 10,
                "number": 0
            }
        }


        $scope.groupCompareSY = '';
        $scope.groupCompareDZ = '';
        $scope.groupCompareSYa = {value:'1'};
        $scope.groupCompareDZa = {value:'4'};
        $scope.tableData = [        ];
        $scope.tableDataSY = [        ];
        $scope.tableDataDZ = [        ];
        $scope.widthDiv = {
            'width':$scope.tableData.length*145+'px'
        }

        $scope.factorDisplay = true;
        $scope.condition = [        ]

        $scope.navigation = [
            {name:'模型选择',active:'infi-analysis-modifyed'},
            {name:'变量选择',active:'infi-header-active'},
            {name:'模型执行',active:''}
        ]

        $scope.modelsData = {
            value:'',
            data:[
                {
                    name:'逻辑回归',value:'逻辑回归'
                },
                {
                    name:'支持向量机',value:'支持向量机'
                },
                {
                    name:'贝叶斯分类模型',value:'贝叶斯分类模型'
                }
            ]
        }
        $scope.name = $scope.modelsData.name;
        $scope.groups = [
            {name:'实验组',active:'infi-model-fenzhu'},
            {name:'对照组',active:''}
        ]
        //实验组对照组切换
        $scope.zubie = function(data){
            console.log(data);
            console.log($scope.tableDataSY);
            console.log($scope.tableDataDZ);
            if($scope.factorDisplay == false){
                return
            }
            if(data == '实验组'){
                $scope.groups[0].active = 'infi-model-fenzhu';
                $scope.groups[1].active = '';
                $scope.tableData = $scope.tableDataSY;
            }else if(data == '对照组'){
                $scope.groups[0].active = '';
                $scope.groups[1].active = 'infi-model-fenzhu';
                $scope.tableData = $scope.tableDataDZ;
            }
        }
        //逻辑回归分类
        $scope.classIfication = function(data){
            $scope.name = data;
            console.log(data);
        }

        //搜索关键字
        $scope.searchData = '';
        //搜索方法
        $scope.search = function(){
            console.log($scope.searchData);
            DataService.ajaxVariableSetDataSearch($routeParams.id,$scope.searchData).then(function(data){
                console.log(data);
                $scope.condition = [];
                if(data.data == null){
                    return
                }
                for(var i = 0 ; i < data.data.length ; i++){
                    $scope.condition.push({name:data.data[i].name,active:'',ruleCode:data.data[i].ruleCode});
                }
            })
        }

        $scope.selectLeftData = {
            value: '全部',
            data: [
                {name: '全部', value: '全部'},
                {name: '分类变量', value: '分类变量'},
                {name: '连续变量', value: '连续变量'}
            ]
        }
        $scope.aaa = true;
        //点击数据选择
        $scope.conditionClick = function(data){
            console.log(data);

            if($scope.factorDisplay == false || $scope.aaa == false){
                return
            }else if(data.active !== ''){
                data.active = '';

                for(var i = 0 ; i < $scope.tableData.length ; i++){
                    if($scope.tableData[i].name == data.name){
                        //console.log(i);
                        // console.log($scope.tableDataSY ,222);
                        // console.log($scope.tableDataDZ ,333);
                        if($scope.tableDataSY[i].Has == 1){
                            DataService.ajaxModelUnchecked($routeParams.id,data.ruleCode).then(function(data){
                                console.log(data);
                            });
                        }
                        // $scope.tableData.splice(i,1);
                        console.log($scope.tableDataSY[i]);
                        $scope.tableDataSY.splice(i,1);
                        $scope.tableDataDZ.splice(i,1);
                        // console.log($scope.tableData ,888);
                        // console.log($scope.tableDataSY ,222);
                        // console.log($scope.tableDataDZ ,333);

                    }
                }
            }else{
                data.active = 'infi-analysis-background';
                $scope.ajaxData($routeParams.id,data.ruleCode,data.name,'exp');
                $scope.aaa = false
            }
        }

        // 分类连续变量选择
        $scope.selectLeft = function(){
            console.log($scope.selectLeftData.value);

            DataService.ajaxVariableSetData($routeParams.id).then(function(data){
                console.log(data.data);
                $scope.condition = [];
                for(var i = 0 ; i < data.data.length ; i++){
                    if($scope.selectLeftData.value == '全部'){
                        $scope.condition.push({name:data.data[i].name,active:'',ruleCode:data.data[i].ruleCode});
                    }else if($scope.selectLeftData.value == data.data[i].type){
                        $scope.condition.push({name:data.data[i].name,active:'',ruleCode:data.data[i].ruleCode});
                    }
                }
            });
        }

        //获得数据
        $scope.ajaxData = function(id,ruleCode,name,type){
            DataService.ajaxModelDataLeft(id,ruleCode).then(function(datas){

                console.log(datas,555);
                var Has = 0;
                if(datas.data.ctrlHasNull.length !== 0 || datas.data.expHasNull.length !== 0 ){
                    Has = 1;
                }
                for(var p in datas.data){
                    var tbody = []
                    var data = []
                    for(var i = 0 ; i < datas.data[p].length ; i++){
                        tbody.push({name:datas.data[p][i].value})
                        data.push(datas.data[p][i])
                    }
                    if(p == 'exp'){
                        $scope.tableDataSY.push({
                            name:name,
                            tbody:tbody,
                            data:data,
                            Has:Has
                        });
                    }else if(p == 'ctrl'){
                        $scope.tableDataDZ.push({
                            name:name,
                            tbody:tbody,
                            data:data,
                            Has:Has
                        });
                    }
                }
                if($scope.groups[1].active !== 'infi-model-fenzhu'){
                    $scope.tableData = $scope.tableDataSY;
                    console.log(22);
                }else{
                    $scope.tableData = $scope.tableDataDZ;
                }

                $scope.widthDiv = {
                    'width':$scope.tableData.length*145+'px'
                }
                $scope.aaa = true
            })
        }

        //单因素分析方法
        $scope.singleFactor = function(){
            for(var i = 0 ; i < $scope.tableDataSY.length ; i++){
                if($scope.tableDataSY[i].Has == 1){
                    $('#single-factor').modal({backdrop:'static'});
                    return
                }
            }
            $scope.singleFactorSave()
        }
        //单因素分析方法确定
        $scope.singleFactorSave = function(){
            $scope.tableDataSYS = [];
            $scope.tableDataDZS = [];
            for(var i = 0 ; i < $scope.tableDataSY.length ; i++){
                $scope.tableDataSYS.push($scope.tableDataSY[i].data);
                $scope.tableDataDZS.push($scope.tableDataDZ[i].data);
            }

            for(var i = 0 ; i < $scope.tableDataSY.length ; i++){
                if($scope.tableDataSY[i].Has == 1){
                    DataService.ajaxModelNullProcess($routeParams.id).then(function(data){
                        console.log(data.exp);
                        $scope.tableDataSYS = data.exp
                        $scope.tableDataDZS = data.ctrl
                        DataService.ajaxSingleFactor($scope.title,$scope.tableDataSYS,$scope.tableDataDZS,$scope.groupCompare).then(function(data){
                            $scope.dataProcess(data);
                        });
                    });
                    return
                }
            }
            DataService.ajaxSingleFactor($scope.title,$scope.tableDataSYS,$scope.tableDataDZS,$scope.groupCompare).then(function(data){
                console.log(data.data,888888);
                $scope.dataProcess(data);
            });
            $('#single-factor').modal('hide');
        }

        //处理单因数分析返回数据的数据
        $scope.dataProcess =function(data){
            if(data.data !== undefined){
                if(data.data.classify.length > 0){
                    for(var i = 0 ; i < data.data.classify.length ; i++){
                        var checkData = data.data.classify[i].p < 0.05?true:false;
                        $scope.singleFactorData.push({name:data.data.classify[i].label,value:data.data.classify[i].p,check:checkData})
                    }
                }
                if(data.data.continuity.length > 0){
                    for(var i = 0 ; i < data.data.continuity.length ; i++){
                        var checkDatas = data.data.continuity[i].p < 0.05?true:false;
                        $scope.singleFactorData.push({name:data.data.continuity[i].label,value:data.data.continuity[i].p,check:checkDatas})
                    }
                }
                $scope.navigation = [
                    {name:'模型选择',active:'infi-analysis-modifyed'},
                    {name:'变量选择',active:'infi-analysis-modifyed'},
                    {name:'模型执行',active:'infi-header-active'}
                ]
                $scope.factorDisplay = false;
                $('#single-factor').modal('hide');
            }else{
                $('#non-compliant').modal({backdrep:'static'})
                $('#single-factor').modal('hide');
            }
        }

        $scope.modelName = '';
        $scope.buildResult = []
        //确认保存
        $scope.trueSave = function(){
            $scope.groupCompare = $scope.groupCompareSYa.value+':'+$scope.groupCompareDZa.value;
            $scope.buildResult.push($scope.singleFactorData);
            $scope.buildResult.push($scope.computeData);
            $scope.buildResult.push($scope.accurate);
            $scope.buildResult.push($scope.coincidence_matrix);
            $scope.buildResult.push($scope.coefficient);
            $scope.buildResult.push($scope.QQEchartData);
            $scope.buildResult.push($scope.groupCompare);
            DataService.ajaxTrueSave($routeParams.id,$scope.buildResult,$scope.modelName).then(function(data){
                $location.path('complete');
            });
        }

        //保存
        $scope.modelSave = function(){
            // if($routeParams.view){
            //     $('#modal-save').modal({backdrop: 'static'});
            // }else {
            //     $('#modal-save').modal({backdrop: 'static'});
            // }
            $('#modal-save').modal({backdrop: 'static'});
        }
        // 单因素分析数据结构
        $scope.singleFactorData = [];
        // 多重线性分析
        $scope.computeData = []

        //不共线性计算
        $scope.collinearityNo = function(){
            $('#modal-collinearity').modal('hide');
            $scope.train = false;
            $scope.tableDataSYS = [];
            $scope.tableDataDZS = [];
            $scope.computeData = [];
            $scope.tableTrainSY = [];
            $scope.tableTrainDZ = [];
            //筛选被选中的数据
            for(var i = 0 ; i < $scope.singleFactorData.length ; i++){
                if($scope.singleFactorData[i].check == true){
                    for(var j = 0 ; j < $scope.tableDataSY.length ; j++){
                        if($scope.singleFactorData[i].name == $scope.tableDataSY[j].name){
                            $scope.tableDataSYS.push($scope.tableDataSY[j].data);
                            $scope.tableDataDZS.push($scope.tableDataDZ[j].data);
                            $scope.tableTrainSY.push($scope.tableDataSY[j]);
                            $scope.tableTrainDZ.push($scope.tableDataDZ[j]);
                        }
                    }
                    // $scope.tableDataSYS.push($scope.tableDataSY[i].data);
                    // $scope.tableDataDZS.push($scope.tableDataDZ[i].data);
                }

            }
            DataService.modelTrain($scope.title,$scope.tableDataSYS,$scope.tableDataDZS,'1:4').then(function(data){
                $scope.accurate = {};
                $scope.coincidence_matrix = {};
                $scope.coefficient = [];
                $scope.QQEchartData = {};
                $scope.accurate =data.data.accuracy;
                $scope.coincidence_matrix =data.data.coincidence_matrix;
                $scope.QQEchartData =data.data.ROS;
                for(var i = 0 ; i < data.data.coefficient.length ; i++){
                    $scope.coefficient.push(data.data.coefficient[i]);
                }
                $('#model-train').modal('hide');
                $scope.trainData = true;
                setTimeout(function () {
                    $scope.QQEchartLeft($scope.QQEchartData);
                    $scope.QQEchartRight($scope.QQEchartData);
                },100)
            });
        }
        //确定共线性计算
        $scope.collinearityYes = function(){
            $('#modal-collinearity').modal('hide');
            $scope.trainData = false;
            $scope.tableDataSYS = [];
            $scope.tableDataDZS = [];
            $scope.computeData = [];
            $scope.tableTrainSY = [];
            $scope.tableTrainDZ = [];
            //筛选被选中的数据
            for(var i = 0 ; i < $scope.singleFactorData.length ; i++){
                if($scope.singleFactorData[i].check == true){
                    for(var j = 0 ; j < $scope.tableDataSY.length ; j++){
                        if($scope.singleFactorData[i].name == $scope.tableDataSY[j].name){
                            $scope.tableDataSYS.push($scope.tableDataSY[j].data);
                            $scope.tableDataDZS.push($scope.tableDataDZ[j].data);
                            $scope.tableTrainSY.push($scope.tableDataSY[j]);
                            $scope.tableTrainDZ.push($scope.tableDataDZ[j]);
                        }
                    }
                    // $scope.tableDataSYS.push($scope.tableDataSY[i].data);
                    // $scope.tableDataDZS.push($scope.tableDataDZ[i].data);
                }

            }
            DataService.ssss($scope.title, $scope.tableDataSYS, $scope.tableDataDZS, $scope.groupCompare).then(function (data) {
                if(data.info == '请求数据成功!'){
                    for (var i = 0; i < data.data.length; i++) {
                        var check = false
                        if(data.data[i].vif < 10){
                            check = true
                        }
                        $scope.computeData.push({
                            name: data.data[i].label,
                            value: data.data[i].vif,
                            values: data.data[i].tolerance,
                            check: check
                        });
                    }
                    $scope.train = true;
                }else{
                    alert('连续'+data.info);
                    $scope.train = false;
                    return
                }
            });
        }
        // 多重线性分析按钮
        $scope.compute = function(){
            //区分查看和建立模型
            if($routeParams.view){

            }else {
                $('#modal-collinearity').modal({backdrop:'static'});
            }
        }
        //模型训练
        $scope.modelTrain = function(){
            if($routeParams.view){

            }else{
                $('#model-train').modal({backdrop:'static'});
            }
        }

        //暂时不需要
        $scope.modelTrainSave = function(){
            $scope.tableDataSYS = [];
            $scope.tableDataDZS = [];
            for(var i = 0 ; i < $scope.computeData.length ; i++){
                if($scope.computeData[i].check == true){
                    for(var j = 0 ; j < $scope.tableDataSY.length ; j++){
                        if($scope.computeData[i].name == $scope.tableDataSY[j].name){
                            $scope.tableDataSYS.push($scope.tableDataSY[j].data);
                            $scope.tableDataDZS.push($scope.tableDataDZ[j].data);
                        }
                    }
                }

            }

            if($scope.tableDataSYS.length < 2){
                alert('选择两个以上变量');
                $scope.trainData = false;
                $('#model-train').modal('hide');
                return
            }
            $scope.groupCompare = $scope.groupCompareSYa.value+':'+$scope.groupCompareDZa.value;
            DataService.modelTrain($scope.title,$scope.tableDataSYS,$scope.tableDataDZS,$scope.groupCompare).then(function(data){
                $scope.accurate = {};
                $scope.coincidence_matrix = {};
                $scope.coefficient = [];
                $scope.QQEchartData = {};
                $scope.accurate =data.data.accuracy;
                $scope.coincidence_matrix =data.data.coincidence_matrix;
                $scope.QQEchartData =data.data.ROS;
                for(var i = 0 ; i < data.data.coefficient.length ; i++){
                    $scope.coefficient.push(data.data.coefficient[i]);
                }
                $('#model-train').modal('hide');
                $scope.trainData = true;
                setTimeout(function () {
                    $scope.QQEchartLeft($scope.QQEchartData);
                    $scope.QQEchartRight($scope.QQEchartData);
                },100)
            });

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
        $scope.dataLeftNav();
        $scope.a = ''

        $scope.QQEchartLeft = function(datas){
            var myChartsAfter = echarts.init(document.getElementById('model-left'));
            var dataAlls = [];
            var dataAll = []
            for(var i = 0  ; i < datas.learn.x.length ; i++){
                dataAlls.push([datas.learn.x[i],datas.learn.y[i]]);
            }
            dataAll.push(dataAlls);
            var markLineOpt = {
                animation: false,
                label: {
                    normal: {
                        textStyle: {
                            align: 'right'
                        }
                    }
                },
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                data: [[{
                    coord: [0, 0],
                    symbol: 'none'
                }, {
                    coord: [1, 1],
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
                    formatter: '位置 {a}: ({c})'
                },
                xAxis: [
                    {gridIndex: 0, min: 0, max: 1}
                ],
                yAxis: [
                    {gridIndex: 0, min: 0, max: 1}
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
        $scope.QQEchartRight = function(datas){
            var myChartsAfter = echarts.init(document.getElementById('model-right'));
            var dataAlls = [];
            var dataAll = []
            for(var i = 0  ; i < datas.test.x.length ; i++){
                dataAlls.push([datas.test.x[i],datas.test.y[i]]);
            }
            dataAll.push(dataAlls);
            var markLineOpt = {
                animation: false,
                label: {
                    normal: {
                        textStyle: {
                            align: 'right'
                        }
                    }
                },
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                data: [[{
                    coord: [0, 0],
                    symbol: 'none'
                }, {
                    coord: [1, 1],
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
                    formatter: '位置 {a}: ({c})'
                },
                xAxis: [
                    {gridIndex: 0, min: 0, max: 1}
                ],
                yAxis: [
                    {gridIndex: 0, min: 0, max: 1}
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
        DataService.ajaxCompleteData($routeParams.id).then(function(data){
            $scope.groupCompare = data.data.groupCompare
            $scope.groupCompareSY = $scope.groupCompare.split(':')[0] ;
            $scope.groupCompareDZ = $scope.groupCompare.split(':')[1];
        })
        DataService.ajaxModelF5Data($routeParams.id).then(function(data){
            // console.log(data);
        })
        
        if($routeParams.view){
            DataService.ajaxCompleteData($routeParams.id).then(function(data){

                if(JSON.parse(data.data.buildResult)[0] !== null){
                    $scope.factorDisplay = false;
                }
                $scope.train = true;
                if(JSON.parse(data.data.buildResult)[1] == 0){
                    $scope.train = false;
                }
                if(JSON.parse(data.data.buildResult)[2] !== null){
                    $scope.trainData = true;
                    setTimeout(function () {
                        $scope.QQEchartLeft($scope.QQEchartData);
                        $scope.QQEchartRight($scope.QQEchartData);
                    },100)
                }
                if(data.data.buildResult == null){
                    return
                }
                $scope.singleFactorData = JSON.parse(data.data.buildResult)[0];
                $scope.computeData = JSON.parse(data.data.buildResult)[1];
                $scope.accurate = JSON.parse(data.data.buildResult)[2];
                $scope.coincidence_matrix = JSON.parse(data.data.buildResult)[3];
                $scope.coefficient = JSON.parse(data.data.buildResult)[4];
                $scope.QQEchartData = JSON.parse(data.data.buildResult)[5];
                $scope.groupCompare = JSON.parse(data.data.buildResult)[6];
                $scope.groupCompareSYa.value = $scope.groupCompare.split(':')[0] ;
                $scope.groupCompareDZa.value = $scope.groupCompare.split(':')[1];
            });
        }
    }]);