angular.module('infi-basic').controller('RecordInputThirdController',['$scope','SYS','RecordService','$routeParams','Utils','$filter',function($scope,SYS,RecordService,$routeParams,Utils,$filter){
    // 产后42天录入controller文件

    var defaultValueStatus = false,dataStatus = false;

    //tab 切换
    $scope.typeList=[
        {
            "label":"产妇情况",
            "value":"mom"
        },
        {
            "label":"婴儿情况",
            "value":"child"
        }
    ];

    $scope.queryParams = {
        patientId:$routeParams.id,
        xlPatientId:$routeParams.xlPatientId,
        xlMedicalId:$routeParams.xlMedicalId
    };
    $scope.basic={};
    //页面初始化显示
    $scope.typeList[0].active=true;
    $scope.typeData=$scope.typeList[0].value;

    /**
     * 获取用户门诊信息
     */
    RecordService.getCaseInfo($scope.queryParams.patientId,$scope.queryParams.xlMedicalId).then(function(msg){
        $scope.caseList=msg.data;
    });

    /**
     * 获取表单信息,当存在xlMedicalId时要进行页面数据的初始化加载;
     */
    RecordService.getForty($scope.queryParams.patientId,$scope.queryParams.xlMedicalId).then(function(msg){
        if(msg.data.data==null){
            msg.data.data={};
        }
        $scope.basic = msg.data.data;
        //没有检查日期的话,给检查日期默认当前时间
        if(!$scope.basic.checkDate){
            $scope.basic.checkDate = $filter('date')(new Date(),'yyyy-MM-dd');
        }
        dataStatus = true;
    });

    /**
     * 请求默认显示对应字段的json数据
     */
    RecordService.getDefaultValue().then(function success(msg){
        $scope.defaultValue = msg.data;
        defaultValueStatus = true;
    });

    /**
     * 保存第42天用户录入信息
     */
    $scope.saveForty = function(){
        $scope.basic.patiId=$scope.queryParams.patientId;

        RecordService.saveForty($scope.basic).then(function success(msg){
            if(msg.status=SYS.STATUS_SUCCESS){
                //保存基本信息(因为产后42天编辑完后修改状态)
                RecordService.saveBasicInfo($scope.caseList).then(function success(msg){

                });
                msg.description='数据保存成功';
                setTimeout(function(){
                    window.location.href='#/overview/obstetrics/'+$scope.queryParams.xlPatientId+'/'+$scope.queryParams.xlMedicalId+'/'+$scope.queryParams.patientId;
                },1500)
            }else{
                msg.description='数据保存失败';
            }
            Utils.sysTip($scope,msg);
        });
    };

    /**
     * tab 切换
     * @param entity
     */
    $scope.activeType = function(entity){
        angular.forEach($scope.typeList,function(type){
            type.active=false;
        });
        entity.active=true;
        $scope.typeData=entity.value;
    };

    //设置默认值

    $scope.$watch(function(){
        return (defaultValueStatus==true&&dataStatus==true)
    },function(newValue,oldValue){
        if(newValue == oldValue){
            return false;
        }
        setDefaultValue();
    });

    function setDefaultValue(){
        angular.forEach($scope.defaultValue,function(defaultValue){
            if(defaultValue.value == "basic"){
                var idx = 0,length = defaultValue.children.length,entity;
                for(idx;idx<length;idx++){
                    entity = defaultValue.children[idx];

                        $scope.basic=$scope.basic?$scope.basic:{};
                        if($scope.basic[entity]==''||$scope.basic[entity]==null){

                            $scope.basic[entity] = 'name___u6B63__u5E38';
                    }
                }
            }
        })
    }
}]);
