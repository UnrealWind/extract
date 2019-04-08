angular.module('infi-basic')
    .controller('DataPretreatmentController',[ '$scope','DataService','$routeParams','$location',function ($scope,DataService,$routeParams,$location) {
        var myChartsBefore = echarts.init(document.getElementById('main'));
        var myChartsAfter = echarts.init(document.getElementById('mains'));
        //控制处理前的样式显示
        $scope.before = false;
        //已选变量的名称
        $scope.name = '';
        //控制处理前的样式显示
        $scope.after = false;
        // 可选项
        $scope.condition = [];

        //变量选择
        $scope.selectLeftData = {
            value:'',
            data:[
                {name:'全部',value:''},
                {name:'分类变量',value:'分类变量'},
                {name:'连续变量',value:'连续变量'}
            ]
        }

        //处理策略 -- 连续选项
        $scope.LXData = {
            value:'',
            data:[
                {name:'请选择',value:''},
                {name:'删除',value:'删除'},
                {name:'中位数插值',value:'中位数插值'},
                {name:'众数插值',value:'众数插值'},
                {name:'回归插值',value:'回归插值'},
                {name:'拉格朗日',value:'拉格朗日'}
            ]
        }
        //处理策略 -- 分类选项
        $scope.FLData = {
            value:'',
            data:[
                {name:'请选择',value:''},
                {name:'删除',value:'删除'}
            ]
        }

        //分类总容器
        $scope.selectMethodData = {
            value:'',
            data:[
                {name:'请选择',value:''},
                {name:'删除',value:'删除'},
                {name:'中位数插值',value:'中位数插值'},
                {name:'众数插值',value:'众数插值'},
                {name:'回归插值',value:'回归插值'},
                {name:'拉格朗日',value:'拉格朗日'}
            ]
        }

        //处理前后的list数据
        $scope.beforeContent = [        ]
        $scope.afterContent = [        ]
        //处理前后的样本量数据
        $scope.beforeNumber = '1';
        $scope.afterNumber = '1';

        //搜索关键字
        $scope.searchData = '';
        //搜索
        $scope.search = function(){
            DataService.ajaxVariableSetDataSearch($routeParams.id,$scope.searchData).then(function(data){
                $scope.condition = [];
                if(data.data == null){
                    return
                }else{
                    for(var i = 0 ; i < data.data.length ; i++){
                        $scope.condition.push({name:data.data[i].name,active:'',ruleCode:data.data[i].ruleCode});
                    }
                }

            });
        }

        //确认处理按钮
        $scope.process = function(){
            if($scope.selectMethodData.value){
                DataService.ajaxDataPretreatmentDataProcess($routeParams.id,$scope.dataRuleCode,$scope.selectMethodData.value,$scope.dataType).then(function(data){
                    $scope.afterContent = []
                    $scope.afterNumber = 0;
                    $scope.after = true;
                    if($scope.dataType == '分类变量'){
                        for(var i = 0 ; i < data.data.length ; i++){
                            $scope.afterContent.unshift({name:data.data[i].name,value:data.data[i].cont});
                            $scope.afterNumber = $scope.afterNumber + data.data[i].cont;
                        }
                        var options = {
                            tooltip : {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c} ({d}%)"
                            },
                            series : [
                                {
                                    name: $scope.name,
                                    type: 'pie',
                                    radius : '55%',
                                    center: ['50%', '40%'],
                                    data:$scope.afterContent,
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
                    }else if($scope.dataType == '连续变量'){
                        $scope.afterNumber = data.data[0].countnum;
                        $scope.afterContent = [
                            {name:'最大值',value:data.data[0].max},
                            {name:'最小值',value:data.data[0].min},
                            {name:'平均值',value:data.data[0].avg},
                            {name:'空值',value:data.data[0].count}
                        ]
                    }
                });
            }else{

            }
        }


        //处理策略方法
        $scope.processMethod = function(){
        }

        // 分类连续变量选择
        $scope.selectLeft = function(){
            DataService.ajaxVariableSetData($routeParams.id).then(function(data){
                $scope.condition = [];
                $scope.initialize();
                for(var i = 0 ; i < data.data.length ; i++){
                    if($scope.selectLeftData.value == ''){
                        $scope.condition.push({name:data.data[i].name,active:'',ruleCode:data.data[i].ruleCode,type:data.data[i].type});
                    }else if($scope.selectLeftData.value == data.data[i].type){
                        $scope.condition.push({name:data.data[i].name,active:'',ruleCode:data.data[i].ruleCode,type:data.data[i].type});
                    }
                }
            });
        }

        $scope.conditionClick = function(data){
            $scope.initialize();
            $scope.name = data.name;
            $scope.dataRuleCode = data.ruleCode;
            $scope.dataType = data.type;
            for(var i = 0 ; i < $scope.condition.length ; i++){
                if($scope.condition[i].name == data.name){
                    data.active = 'infi-analysis-background';
                }else{
                    $scope.condition[i].active = '';
                }
            }
            DataService.ajaxDataPretreatmentDataDK($routeParams.id,$scope.dataRuleCode,$scope.dataType).then(function(data){
                $scope.beforeContent = []
                $scope.before = true;
                $scope.beforeNumber = 0;
                if($scope.dataType == '分类变量'){
                    for(var i = 0 ; i < data.data.length ; i++){
                        if(data.data[i].name == '' || data.data[i].name == ' ' ){
                            data.data[i].name = '空值'
                        }
                        $scope.beforeContent.unshift({name:data.data[i].name,value:data.data[i].cont});
                        $scope.beforeNumber = $scope.beforeNumber + data.data[i].cont;
                    }
                    var options = {
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        series : [
                            {
                                name: $scope.name,
                                type: 'pie',
                                radius : '55%',
                                center: ['50%', '40%'],
                                data:$scope.beforeContent,
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
                    myChartsBefore.setOption(options);
                }else if($scope.dataType == '连续变量'){
                    $scope.beforeNumber = data.data[0].countnum;
                    $scope.beforeContent = [
                        {name:'最大值',value:data.data[0].max},
                        {name:'最小值',value:data.data[0].min},
                        {name:'平均值',value:data.data[0].avg},
                        {name:'空值',value:data.data[0].count}
                    ]
                }
            });

        }

        $scope.dataLeftNav = function(){
            DataService.ajaxVariableSetData($routeParams.id).then(function(data){
                $scope.condition = [];
                for(var i = 0 ; i < data.data.length ; i++){
                    $scope.condition.push({name:data.data[i].name,active:'',ruleCode:data.data[i].ruleCode,type:data.data[i].type});
                }
                $scope.conditionClick($scope.condition[0]);
            });
        }
        $scope.dataLeftNav();
        $scope.next = function(){
            DataService.ajaxVariableSetDatanext($routeParams.id).then(function(data){
                $location.path('filter.set/'+$routeParams.id)
            });
            // $location.path('filter.set'+$routeParams.id);
        }

        $scope.initialize = function(){
            //控制处理前的样式显示
            $scope.before = false;
            //已选变量的名称
            $scope.name = '';
            //控制处理前的样式显示
            $scope.after = false;
            myChartsBefore.clear();
            myChartsAfter.clear();
        }
    }]);