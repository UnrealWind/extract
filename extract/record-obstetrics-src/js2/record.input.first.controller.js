angular.module('infi-basic').controller('RecordInputFirstController',['$scope','SYS','Utils','RecordService','$routeParams','$filter',function($scope,SYS,Utils,RecordService,$routeParams,$filter){
    // 首次录入的controller 文件
    
    var filter='first.record.title',
      mater='mater';

    $scope.queryParams = {
    patientId:    $routeParams.id,
    xlPatientId:  $routeParams.xlPatientId,
    xlMedicalId:  $routeParams.xlMedicalId
    };

    // 定义数据是否请求成功的状态监听量
    var defaultValueStatus = false,dataStatus = false;

    /**
    * 定义数据保存和获取的数组
    * @type {*[]}
     */
    var list = [
    {
      label: '基本信息',
      value: 'basic',
      getUrl: 'basicinfo/crud',
      saveUrl: 'firstentry/basicinfo/crud'
    },
    {
      label: '孕产史',
      value: 'maternal',
      getUrl: 'maternalhistory/list',
      saveUrl: 'firstentry/maternalhistory/crud/'+$scope.queryParams.patientId
    },
    {
      label: '既往史及家族史',
      value: 'previous',
      getUrl: 'pastfamilyhistory/crud',
      saveUrl: 'firstentry/pastfamilyhistory/crud'
    },
    {
      label: '全身检查',
      value: 'whole',
      getUrl: 'bodycheck/crud',
      saveUrl: 'firstentry/bodycheck/crud'
    },
    {
      label: '早孕',
      value: 'pregnancy',
      getUrl: 'earlyprenatalcheck/crud',
      saveUrl: 'firstentry/earlyprenatalcheck/crud'
    },
    {
      label: '高危评分',
      value: 'dangerous',
      getUrl: 'highrisk/crud',
      saveUrl: 'firstentry/highrisk/crud'
    }
    ];

    //==========================
    // 页面table 切换相关的操作
    //==========================
    /**
    * 获取tab标题
    */
    RecordService.getTypeData(filter).then(function success(msg){
        $scope.dataTypes = msg.data;
        $scope.dataTypes[0].active=true;
        //默认显示第一条数据
        $scope.currentDataType = $scope.dataTypes[0].value;
    });

    /**
    * table 表格切换
    * @param entity
    */
    $scope.activeType = function(entity){
        angular.forEach($scope.dataTypes,function(wrap){
            wrap.active=false;
        });
        entity.active=true;
        $scope.currentDataType = entity.value;
    };

    //============================
    // 获取表单信息之外的数据
    //============================

    /**
    * 获取基本信息数据
    */
    RecordService.getCaseList('basicInfo',$scope.queryParams.patientId,$scope.queryParams.xlMedicalId).then(function(msg){
        $scope.basicInfo=msg.data.data;
        if($scope.basicInfo==null||$scope.basicInfo==undefined){
            $scope.basicInfo={};
        }
    });

    /**
    * 获取患者的姓名以及病例号
    */
    RecordService.getSigleInfo($scope.queryParams.patientId).then(function(msg){
        $scope.hospital = msg.data;
        if($scope.hospital==null){
            $scope.hospital={};
        }
    });

    /**
     * 请求默认显示对应字段的json数据
     */
    RecordService.getDefaultValue().then(function success(msg){
        $scope.defaultValue = msg.data;
        defaultValueStatus = true;
    });

    //============================================
    //查看详情时存在xlMedicalId,那么将进行页面初始化的操作
    //============================================
    if($scope.queryParams.xlMedicalId){
        $scope.queryIndexes = function(){
            var idx,entity,dataStatusvalue=0;
            for(idx=0;idx<list.length;idx++){
            entity = list[idx];
            dataStatusvalue++;
            RecordService.getObstetricsInfo(entity.value,entity.getUrl,$scope.queryParams.patientId,$scope.queryParams.xlMedicalId).then(function success(msg){
                if( msg.data.data == null ){
                    msg.data.data = {};
                }
                $scope[msg.type] = msg.data.data;
                if( msg.type =='maternal'){
                    if( msg.data.status != 'ok' ){
                        $scope.maternalList = [];
                    } else {
                        $scope.maternalList = msg.data.data;
                    }

                    if( $scope.maternalList==undefined){
                        $scope.maternalList = [];
                    }
                }
                dataStatusvalue--;
                if(dataStatusvalue == 0){
                    dataStatus = true;
                }
            })
            }
        };
        $scope.queryIndexes();
    }else{
      $scope.maternalList = [];
    }

    /**
     * 设置默认值
     */
    if($scope.queryParams.xlMedicalId){
        $scope.$watch(function(){
            return (dataStatus == true&&defaultValueStatus == true)
        },function(newValue,oldValue){

            // 阻止第一次默认执行;
            if(newValue == oldValue){
                return false;
            }
            //正常执行的函数
            setDefaultValue();
        });
    }else{
        $scope.$watch(function(){
            return (defaultValueStatus == true)
        },function(newValue,oldValue){
            if(newValue == oldValue){
                return false;
            }
            setDefaultValue();
        });
    }

    /**
     * ljy_debug 正常其实应该放在service中
     */
    function setDefaultValue(){
        angular.forEach($scope.defaultValue,function(defaultValue){
            if(defaultValue.value == "whole"||defaultValue.value == "pregnancy"){
                var idx = 0,length = defaultValue.children.length,entity;
                for(idx;idx<length;idx++){
                    entity = defaultValue.children[idx];
                    if(defaultValue.value == "whole"){

                        $scope.whole=$scope.whole?$scope.whole:{};
                        if($scope.whole[entity]==''||$scope.whole[entity]==null){
                            $scope.whole[entity] = 'name___u6B63__u5E38';
                        }
                    }else if(defaultValue.value == "pregnancy"){
                        $scope.pregnancy=$scope.pregnancy?$scope.pregnancy:{};
                        if($scope.pregnancy[entity]==''||$scope.pregnancy[entity]==null){
                            $scope.pregnancy[entity] = 'name___u6B63__u5E38';
                        }
                    }
                }
            }   
        });
        //新建产科档案时初始化'全身检查',''早孕检查'选中项
        if(!$scope.queryParams.xlMedicalId){
            $scope.whole.edema = "name___u65E0";
            $scope.whole.varicosity = "name___u65E0";
            $scope.whole.australiaAntigen = "name__a_";
            $scope.whole.urineSugar = "name__a_";
            $scope.pregnancy.trichomonad = "name___u9634__u6027";
            $scope.pregnancy.mold = "name___u9634__u6027";
        }
    }

  /**
   * 添加孕产史
   */
    $scope.addMaternal = function(){
        if( $scope.maternalList==undefined || !$scope.maternalList.push ){
            $scope.maternalList = [];
        }
        $scope.maternalList.push( {
            patiId: $scope.queryParams.patientId,
            xlMedicalId: $scope.queryParams.xlMedicalId
        });
    };

    //===================================
    //孕产史删除操作
    //===================================
    /**
    * 孕产史的删除操作(调出模态框,进行变量赋值)
    * @param maternalList
    * @param maternal
     */
    $scope.spliceMaternal = function(maternalList,maternal){
        $('#maternalModal').modal('show');
        $scope.Thismaternal = maternal;
    };

    /**
    * 模态框确认删除该条孕产史,后台根据id进行删除;
    */
    $scope.deleteThisMaternal = function(){
        $('#maternalModal').modal('hide');
        var maternalId = $scope.Thismaternal.id;
        if(maternalId){
            RecordService.deleteMaternal(maternalId).then(function success(msg){
                if(msg.status == SYS.STATUS_SUCCESS){
                  msg.description = '信息删除成功';
                  //ljy_debug 数据删除成功之后进行数据重新加载,这个地方需要更正(有部分数据是不需要重新加载的);
                  $scope.queryIndexes();
                }else{
                  msg.description = '信息删除失败';
                }
                Utils.sysTip($scope,msg);
            })
            }else{
            var idx=0,maternalLength = $scope.maternalList.length,materWrap;
                for(idx;idx<maternalLength;idx++){
                    materWrap = $scope.maternalList[idx];
                    if($scope.Thismaternal == $scope.maternalList[idx]){
                        $scope.maternalList.splice(idx,1);
                    }
                }
        }
    };

    //==================================
    //表单数据的保存
    //==================================
    /**
    * 保存用户录入的数据，进行提示以及页面跳转
    * @param destination
    */
    $scope.saveAll = function(destination){
        if(!$scope.basic || ($scope.basic && ($scope.basic.lastGestationalDate == "" || $scope.basic.lastGestationalDate == null))){
            var mg = {
                status:"error",
                description:"末次月经不能为空"
            };
            Utils.sysTip($scope,mg);
            return false;
        }
        //判断首次登记日期不能为空
        if(!$scope.basicInfo || ($scope.basicInfo && ($scope.basicInfo.firstRegisterDate == "" || $scope.basicInfo.firstRegisterDate == null))){
            var mg = {
                status:"error",
                description:"首次登记日期不能为空"
            };
            Utils.sysTip($scope,mg);
        }else if(checkReason()){  //检查原因字数不能超过50
            var mg = {
                status:"error",
                description:"原因字数不符"
            };
            Utils.sysTip($scope,mg);
        }else{
            var exist = true,routeXlMedicalId;
            $scope.basicInfo.patiId=$scope.queryParams.patientId;
            $scope.basicInfo.patiName=$scope.hospital.name;
            $scope.maternal = $scope.maternalList;
            var idx,entity;
            for(idx=0;idx<list.length;idx++){
                entity = list[idx];
                //向后台保存数据需要带上patientId
                if($scope[entity.value] == undefined ){
                    $scope[entity.value] = {};
                }
                $scope[entity.value].patiId=$scope.queryParams.patientId;

                RecordService.saveFirst(entity.saveUrl,$scope[entity.value]).then(function success(msg){
                    if(msg.status==SYS.STATUS_SUCCESS){
                        msg.description='数据保存成功';
                        if(msg.data.xlMedicalId&&exist){
                            routeXlMedicalId = msg.data.xlMedicalId;
                            exist = false;
                        }
                        // 跳转到产科档案页面
                        setTimeout(function(){
                            window.location.href='#/'+destination+'/'+$scope.queryParams.xlPatientId+'/'+routeXlMedicalId+'/'+$scope.queryParams.patientId;
                        },1500)
                    }else{
                        msg.description='数据保存失败';
                    }
                    Utils.sysTip($scope,msg);
                });
                if(idx == list.length-1){
                    //保存基本信息
                    RecordService.saveBasicInfo($scope.basicInfo).then(function success(msg){

                    })
                }
            }
        }
    };

    function checkReason() {
        var maternal = $scope.maternalList[0],
            maternalSelect = maternal&&maternal.productionSituation?maternal.productionSituation:"",
            pregnancy = $scope.pregnancy;
        if(maternalSelect == '流产'&&maternal.proAbortionCause&&maternal.proAbortionCause.length > 50){
            $scope.activeType($scope.dataTypes[1]);
            return true;
        }else if(maternalSelect == '早产'){
            if(maternal.earlyBabySurSituation&&maternal.earlyBabySurSituation == '存'&&maternal.earlyBabyCause&&maternal.earlyBabyCause.length > 50){
                $scope.activeType($scope.dataTypes[1]);
                return true;
            }else if(maternal.earlyBabySurSituation&&maternal.earlyBabySurSituation == '亡'&&maternal.earlyNewbornDeathCause&&maternal.earlyNewbornDeathCause.length > 50){
                $scope.activeType($scope.dataTypes[1]);
                return true;
            }
        }else if(maternalSelect == '死胎'&&maternal.deadFetusDeathCause&&maternal.deadFetusDeathCause.length > 50){
            $scope.activeType($scope.dataTypes[1]);
            return true;
        }else if(maternalSelect == '死产'&&maternal.stillbirthDeathCause&&maternal.stillbirthDeathCause.length > 50){
            $scope.activeType($scope.dataTypes[1]);
            return true;
        }else if(maternalSelect == '足月产'){
            if(maternal.fmpSituation&&maternal.fmpSituation == "手术"&&maternal.fmpOperationCause&&maternal.fmpOperationCause.length > 50){
                $scope.activeType($scope.dataTypes[1]);
                return true;
            }else if(maternal.fmpBabySurSituation&&maternal.fmpBabySurSituation == "亡"&&maternal.fmpNewbornDeathCause&&maternal.fmpNewbornDeathCause.length > 50){
                $scope.activeType($scope.dataTypes[1]);
                return true;
            }else if(maternal.fmpDeformity&&maternal.fmpDeformity == "是"&&maternal.fmpDeformityCause&&maternal.fmpDeformityCause.length > 50){
                $scope.activeType($scope.dataTypes[1]);
                return true;
            }
        }
        if(pregnancy&&pregnancy.otherNote&&pregnancy.otherNote.length > 50){
            $scope.activeType($scope.dataTypes[4]);
            return true;
        }
    }

    /**
     * 计算edc
     */
    $scope.$watch('basic.lastGestationalDate',function(newValue,oldValue){
        if(newValue == oldValue){
            return false;
        }
        if($scope.basic.lastGestationalDate){
            $scope.basicInfo.edc = angular.copy($scope.basic.lastGestationalDate);
            var date = new Date($scope.basicInfo.edc);
            date.setMonth(date.getMonth()+9);
            date.setDate(date.getDate()+7);
            $scope.basicInfo.edc = $filter('date')(date,'yyyy-MM-dd');
        }
    });
}]);
