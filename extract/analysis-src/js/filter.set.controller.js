angular.module('infi-basic')
    .controller('FilterSetController',[ '$scope','SYS','DataService','$location','$routeParams','$interval',function ($scope,SYS,DataService,$location,$routeParams,$interval) {
        
        //当页面无数据显示
        $scope.hasData = true;
        //页面数据
        $scope.filterData = [];
        //筛选名称
        $scope.filterNameValue = '';
        //新增筛选条件规则数据
        $scope.filterSelect = [];

        //list页面实验组对照组设置
        $scope.entitysSelect = function(data){

            // if(data.value == 'exp'){
            //     for(var i = 0 ; i < $scope.filterData.length ; i++){
            //         if($scope.filterData[i].id !== data.id){
            //             $scope.filterData[i].selects.splice(0,1);
            //         }
            //     }
            //     DataService.ajaxFilterSetSaveSDdata(data.id,data.value).then(function(data){
            //         console.log(data);
            //     });
            // }else if(data.value == 'ctrl'){
            //     for(var i = 0 ; i < $scope.filterData.length ; i++){
            //         console.log($scope.filterData[i]);
            //         $scope.filterData[i].selects = [
            //             {name:'实验组',value:'exp'},
            //             {name:'对照组',value:'ctrl'}
            //         ]
            //     }
            //
            // }

            DataService.ajaxFilterSetSaveSDdata(data.id,data.value).then(function(data){
                $scope.dataList();
            });
        }
        
        //新增筛选设置
        $scope.addFilter = function(){
            //筛选名称
            $scope.filterNameValue = '';
            //新增筛选条件规则数据
            $scope.filterSelect = [];
            DataService.ajaxFilterSetAddFilter($routeParams.id).then(function(data){
                $scope.addFilterData = data.data;
            });
            DataService.ajaxVariableSetData($routeParams.id).then(function(data){
                $scope.selectLeft  = data.data;
                $('#set-modal').modal({backdrap:'static'});
            });
        }

        //新增筛选设置-保存按钮
        $scope.setSave = function(){
            var select = []
            for(var i = 0 ; i < $scope.filterSelect.length ; i++){
                select.push({
                    ruleCode:$scope.filterSelect[i].value,
                    operator:$scope.filterSelect[i].operator,
                    value:$scope.filterSelect[i].inputValue
                });
            }
            $scope.addFilterData.filters = select;
            $scope.addFilterData.name = $scope.filterNameValue;
            $('#set-modal').modal('hide');
            $('#set-saveTSS').modal({backdrap:'static'});
            $scope.saveTSS = {
                opacity:1.0
            };
            var timer = $interval(function(){
                $scope.saveTSS.opacity -= .05;
                // $('body').css('padding-right','0px')
                if($scope.saveTSS.opacity < 0.1){
                    $scope.saveTSS.opacity = 1.0
                }
            },100);
            DataService.ajaxFilterSetSave($scope.addFilterData.id,$scope.addFilterData).then(function(data){
                $scope.dataList();
                $interval.cancel(timer);
                $('#set-saveTSS').modal('hide');
            });
        }

        //删除
        $scope.delete = function(id){
            DataService.ajaxFilterSetDelete(id).then(function(data){
                $scope.dataList();
            });
        }
        //修改
        $scope.modify = function(data){
            $scope.dataId =data;
            DataService.ajaxVariableSetData($routeParams.id).then(function(data){
                $scope.selectLeft  = data.data;
                DataService.ajaxFilterSetModify($scope.dataId).then(function(data){
                    $scope.addFilterData = data.data;
                    $scope.filterSelect = [];
                    $scope.filterNameValue = data.data.name;
                    for(var i = 0 ; i < data.data.filters.length ; i++){
                        $scope.filterSelect.push({
                            value:data.data.filters[i].ruleCode,
                            conditionOne:$scope.selectLeft,
                            operator:data.data.filters[i].operator,
                            conditionTwo:[
                                {name:'大于',value:'>'},
                                {name:'小于',value:'<'},
                                {name:'等于',value:'='}
                            ],
                            cls:'',
                            inputValue:data.data.filters[i].value
                        });
                    }
                    $('#set-modal').modal({backdrap:'static'});
                });
            });

        }

        //列表复选按钮
        $scope.dataCheckClick = function(){
            
        }

        //新增筛选规则
        $scope.addRule = function(){
            if($scope.filterSelect.length == 0){
                $scope.filterSelect.push({
                    value:'',
                    conditionOne:$scope.selectLeft,
                    operator:'',
                    conditionTwo:[
                        {name:'大于',value:'>'},
                        {name:'小于',value:'<'},
                        {name:'等于',value:'='}
                    ],
                    cls:'',
                    inputValue:''
                });
            }
        }

        //主页面确定
        $scope.save = function(){
            var JY = $scope.JYzhu()
            if(!JY){
                $('#non-compliant').modal({backdrep:'static'})
                return
            }
            var ids = '';
            for(var i = 0 ; i < $scope.filterData.length ; i++){
                if($scope.filterData[i].checkBox){
                    ids = ids + $scope.filterData[i].id+',';
                }
            }
            $scope.ids = ids.substring(0,ids.length-1);
            DataService.ajaxFilterSetSaveData($scope.ids).then(function(data){
                if(data.data == null){
                    return
                }
                for(var i = 0 ; i < data.data.length ; i++){
                    if(data.data[i].type == 'exp'){
                        $scope.SYdata = data.data[i].dataGenaral;
                    }else{
                        $scope.DZdata = data.data[i].dataGenaral;
                    }
                }
                // $('#set-saveTS').modal('hide');
                $('#set-save').modal({backdrep:'static'});
                // $scope.dataList();
            });
        }

        //确认提示
        $scope.setSaveTS = function(){

        }

        //条件选择1
        $scope.increaseClick = function(){

        }
        //条件选择2
        $scope.rulesClick = function(){

        }
        $scope.groupCompare = '';
        $scope.groupCompareSY = '1';
        $scope.groupCompareDZ = '4';
        //跳转到列表
        $scope.balanceSave = function(data){
            if(data){
                $scope.groupCompare = data;
            }else{
                $scope.groupCompare = $scope.groupCompareSY+':'+$scope.groupCompareDZ;
            }
            for(var i = 0 ; i < $scope.filterData.length ; i++){
                if($scope.filterData[i].value == 'exp'){
                    $routeParams.sy = $scope.filterData[i].id;
                }else if($scope.filterData[i].value == 'ctrl'){
                    $routeParams.dz = $scope.filterData[i].id;
                }
            }
            $scope.idss = $routeParams.sy + "," + $routeParams.dz;
            $('#set-saveTSS').modal({backdrap:'static'});
            $scope.saveTSS = {
                opacity:1.0
            };
            $('#set-save').modal('hide');
            var timer = $interval(function(){
                $scope.saveTSS.opacity -= .05;
                // $('body').css('padding-right','0px')
                if($scope.saveTSS.opacity < 0.1){
                    $scope.saveTSS.opacity = 1.0
                }
            },100);
            DataService.ajaxFilterSetSaves($routeParams.id,$scope.idss,$scope.groupCompare).then(function(data){
                $location.path('filter.set.detail/'+$routeParams.id+'/'+$routeParams.sy+'/'+$routeParams.dz);
                $interval.cancel(timer);
            });
        }
        //监听复选框
        $scope.checkBoxData = function(data){
            if(data && data.checkBox ===false){
                DataService.ajaxFilterSetSaveSDdata(data.id,'').then(function(data){
                    $scope.dataList();
                });
            }
            var a = 0;
            for(var i = 0 ; i < $scope.filterData.length ; i++){
                if($scope.filterData[i].checkBox == true){
                    a++;
                }
            }
            if(a < 2){
                for(var i = 0 ; i < $scope.filterData.length ; i++){
                    $scope.filterData[i].disabled = false;
                }
            }else if(a >=2){
                for(var i = 0 ; i < $scope.filterData.length ; i++){
                    if($scope.filterData[i].checkBox == true){
                        $scope.filterData[i].disabled = false;
                    }else{
                        $scope.filterData[i].disabled = true;
                    }

                }
            }
        }

        $scope.dataList = function(){
            DataService.ajaxFilterSetLisData($routeParams.id).then(function(data){
                $scope.filterData = [];
                if(data.data == null){
                    $scope.hasData = false;
                    return
                }else{
                    $scope.hasData = true;
                }
                for(var i = 0 ; i < data.data.length ; i++){
                    data.data[i].type?$scope.checkBox = true:$scope.checkBox = false;
                    // data.data[i].type == 'exp'?$scope.selects = [{name:'实验组',value:'exp'},{name:'对照组',value:'ctrl'}]:$scope.selects = [{name:'实验组',value:'exp'},{name:'对照组',value:'ctrl'}];

                    $scope.filterData.push(
                        {
                            checkBox:$scope.checkBox,
                            disabled:'',
                            name:data.data[i].name,
                            number:data.data[i].dataGenaral,
                            value:data.data[i].type,
                            id:data.data[i].id,
                            selects:[{name:'实验组',value:'exp'},{name:'对照组',value:'ctrl'}],
                            filter:data.data[i].filters
                        }
                    );
                }
                $scope.checkBoxData();
            });
        }

        $scope.dataList();

        $scope.JYzhu = function(){
            var exp = false;
            var ctrl = false;
            for(var i = 0 ; i < $scope.filterData.length ; i++){
                if($scope.filterData[i].value == 'exp'){
                    exp = true;
                }
                if($scope.filterData[i].value == 'ctrl'){
                    ctrl = true;
                }
            }
            if( exp && ctrl){
                return true
            }else{
                return false
            }
        }
        
    }]);