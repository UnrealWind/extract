angular.module('infi-basic')
    .controller('VariableSetController',[ '$scope','DataService','MethodService','$location','$routeParams',function ($scope,DataService,MethodService,$location,$routeParams) {
        $('body').removeClass("modal-open");
        $(".modal-backdrop").remove();

        //搜索关键字
        $scope.keyword = '';

        //变量名
        $scope.variableName = [];
        //变量选项
        $scope.variableValue = [];

        //搜索按钮
        $scope.search = function(){
            DataService.ajaxVariableSetDataSearch($routeParams.id,$scope.keyword).then(function(data){
                //变量名
                $scope.variableName = [];
                //变量选项
                $scope.variableValue = [];
                if(data.data == null){
                    return
                }
                $scope.data = data.data;
                for(var i = 0 ; i < data.data.length ; i++){
                    $scope.variableName.push({name:data.data[i].name})
                    $scope.variableValue.push(
                        {
                            value:data.data[i].type,
                            select:[
                                {name:'请选择',value:null},
                                {name:'分类变量',value:'分类变量'},
                                {name:'连续变量',value:'连续变量'},
                                {name:'时间变量',value:'时间变量'}
                            ]
                        }
                    );
                }
            });
        }
        //搜索框获得焦点事件
        $scope.keywordBlur = function(){
            if($scope.variableName == []){
                return
            }
            var data = MethodService.variableSetProcessData($scope.data,$scope.variableName,$scope.variableValue);
            DataService.ajaxVariableSetDataSave($routeParams.id,data).then(function(data){
            });
        }

        //总数据
        $scope.dataList = function(){
            DataService.ajaxVariableSetData($routeParams.id).then(function(data){
                $scope.data = data.data;
                for(var i = 0 ; i < data.data.length ; i++){
                    $scope.variableName.push({name:data.data[i].name})
                    $scope.variableValue.push(
                        {
                            value:data.data[i].type,
                            select:[
                                {name:'请选择',value:null},
                                {name:'分类变量',value:'分类变量'},
                                {name:'连续变量',value:'连续变量'},
                                {name:'时间变量',value:'时间变量'}
                            ]
                        }
                    );
                }
            });
        }
        $scope.dataList();

        $scope.variableSetProcessData =function(){
            for(var i = 0 ; i < $scope.data.length ; i++){
                $scope.data[i].name =  $scope.variableName[i].name;
                $scope.data[i].type =  $scope.variableValue[i].value;
            }
        }

        //保存
        $scope.save = function(){
            var data = MethodService.variableSetProcessData($scope.data,$scope.variableName,$scope.variableValue);
            DataService.ajaxVariableSetDataSave($routeParams.id,data).then(function(data){
                $location.path('data.pretreatment/'+$routeParams.id);
            });
        }

        $scope.reset = function(){

        }
    }]);