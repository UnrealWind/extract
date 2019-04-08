angular.module('infi-basic').controller('InputController', ['$scope', 'SYS', '$location', '$routeParams', 'InputService','DetailsService', 'Utils', function ($scope, SYS, $location, $routeParams, InputService, DetailsService, Utils) {
    $scope.params = {
        patientId:$routeParams.patientId,
        section:$routeParams.section,
        operate:$routeParams.operate,
        id:$routeParams.id,
        tubeType:$routeParams.tubeType
    };
    if(!$.isEmptyObject($location.search()) && $location.search().tubeInfoId){
        $scope.params.tubeInfoId=$location.search().tubeInfoId;
    }

    // 这个是新增/详情    置管页面,如果有评估ID可能是开始置管
    if(!$.isEmptyObject($location.search()) && $location.search().feasibilityId){
        $scope.params.feasibilityId=$location.search().feasibilityId;
    }
    // 这个是新增/详情    置管页面,tubeType表示置管类型
    $scope.params.section == 'catheter'?$scope.params.tubeType=$routeParams.tubeType:'';

    //随访记录有一个模板id
    if(!$.isEmptyObject($location.search()) && $location.search().templateId){
        $scope.params.templateId=$location.search().templateId;
    }

    $scope.btnDisable = false;
    $scope.SYS = SYS;

    //存放页面展示的数据
    $scope.formList = null;
    //六类表单请求的url
    var inputUrl = {
        pre:{
            fromUrl:"pre.form",//新增表单显示
            detailsUrl:"assessment/info",//获取信息的路径
            dataUrl:"pre.save",//保存时获取数据格式
            saveUrl:"assessment/save",//保存的接口
            getDetailsUrl:""//
        },
        catheter:{
            fromUrl:"catheter.form",
            detailsUrl:"tube/tubeInfo",
            dataUrl:"catheter.save",
            saveUrl:"tube/catheterSave"
        },
        extubation:{
            fromUrl:"extubation.form",
            detailsUrl:"tube/moveTubeInfo",
            dataUrl:"extubation.save",
            saveUrl:"tube/moveTubeSave"
        },
        maintenance:{
            fromUrl:"maintenance.form",
            detailsUrl:"manage/manageInfo",
            dataUrl:"maintenance.save",
            saveUrl:"manage/manageSave"
        },
        follow:{
            fromUrl:"follow.form",
            detailsUrl:"visit/visitInfo"
        }
    };

    /**********************************************这是初始化*****************************************/
    function init() {
        //新增,修改,详情都要用到这个json
        InputService.getJson(inputUrl[$scope.params.section].fromUrl).then(function(msg){
            $scope.formList = msg.data;
            InputService.filterRequireTime($scope.formList,$scope.params.section);
            if($scope.params.operate == SYS.ADD){
                InputService.getDefault($scope.formList,$scope.params.section);
            }

            //获取基本信息
            DetailsService.getBasic($scope.params.patientId).then(function(msg){
                $scope.basicInfo = msg.data;
                if($scope.params.section == 'pre' && $scope.params.operate != SYS.DETAILS){
                    InputService.filterPreBasic($scope.formList,$scope.basicInfo);
                }

                //获取表单json
                if($scope.params.operate == SYS.ADD || $scope.params.operate == SYS.EDIT){
                    if($scope.params.section == 'follow'){
                        InputService.getFollow($scope.params.templateId).then(function(msg){
                            angular.forEach(msg.data,function(data){
                                angular.forEach($scope.formList,function(value,key){
                                    if(value.label == data.visitQuestion){
                                        value.id = data.id;
                                        value.visitTemplateId = data.visitTemplateId;
                                    }
                                })
                            })
                        })
                    }
                    if($scope.params.operate == SYS.ADD && $scope.params.section == 'extubation'){
                        InputService.getDetails({
                            url:inputUrl.catheter.detailsUrl,
                            id:$scope.params.tubeInfoId
                        }).then(function(msg){
                            angular.forEach($scope.formList,function(formList){
                                if(formList.name == 'tubeSpecifications' || formList.name == 'tubePosition' || formList.name == 'otherTubePosition'){
                                    formList.value = msg.data[formList.name];
                                    if(formList.action){
                                       angular.forEach(formList.action,function(action){
                                           angular.forEach(action.children,function(children){
                                               if(children.name == 'otherTubePosition'){
                                                   children.value = msg.data[children.name];
                                               }
                                           })
                                       })
                                    }
                                }
                            })
                        });
                    }
                    //维护记录(导管内置长度和外露长度新增时读取置管信息的值)
                    if($scope.params.operate == SYS.ADD && $scope.params.section == 'maintenance'){
                        InputService.getDetails({
                            url:inputUrl.catheter.detailsUrl,
                            id:$scope.params.tubeInfoId
                        }).then(function(msg){
                            angular.forEach($scope.formList.maintenance,function(formList){
                                if(formList.name == 'finalInLength' || formList.name == 'finalExternalLength'){
                                    formList.value = msg.data[formList.name];
                                }
                            })
                        });
                        InputService.getArmCircumference($scope.params.tubeInfoId).then(function(msg){
                            if(msg.status == SYS.STATUS_SUCCESS){
                                if(msg.data.armCircumferenceType){
                                    $scope.armCircumferenceTypeTips = "注:" + msg.data.armCircumferenceType + ":" + msg.data.armCircumferenceNum+"cm";
                                }else{
                                    $scope.armCircumferenceTypeTips = "注:左臂围:"+msg.data.leftArmCircumference+"cm,右臂围:"+msg.data.rightArmCircumference+"cm";
                                }
                            }
                        })
                    }
                    if($scope.params.operate == SYS.EDIT){
                        InputService.getDetails({
                            url:inputUrl[$scope.params.section].detailsUrl,
                            id:$scope.params.id
                        }).then(function(msg){
                            $scope.editList = msg.data;
                            if($scope.params.section == 'pre') {
                                assignmentBasic($scope.editList, $scope.basicInfo);
                                InputService.filterPreEditList($scope.editList,$scope.formList);
                            }else if($scope.params.section == 'catheter'){
                                InputService.filterCatheterEditList($scope.editList,$scope.formList);
                            }else if($scope.params.section == 'extubation'){
                                InputService.filterExtubationEditList($scope.editList,$scope.formList);
                            }else if($scope.params.section == 'maintenance'){
                                InputService.filterMaintenanceEditList($scope.editList,$scope.formList);
                            }else if($scope.params.section == 'follow'){
                                angular.forEach($scope.editList,function(list){
                                    angular.forEach($scope.formList,function(value,key){
                                        if(list.visitContent.visitQuestion == value.label){
                                            value.value = list.visitResult.visitQuestionResult;
                                            value.resultId = list.visitResult.id;
                                            value.createTime = list.visitResult.createTime;
                                            value.creator = list.visitResult.creator;
                                        }
                                    })
                                })
                            }
                        })
                    }
                }else if($scope.params.operate == SYS.DETAILS){
                    InputService.getDetails({
                        url:inputUrl[$scope.params.section].detailsUrl,
                        id:$scope.params.id
                    }).then(function(msg){
                        $scope.details = msg.data;
                        if($scope.params.section == 'pre'){
                            assignmentBasic($scope.details,$scope.basicInfo);
                        }
                        $scope.detailsList = InputService.filterDetailsList($scope.details,$scope.formList,$scope.params.section);
                    })
                }
            });
        });
    }
    init();

    /**
     * 给基本信息赋值
     * @param list
     * @param basic
     */
    function assignmentBasic(list,basic) {
        list.patientName = basic.patientName;
        list.sex = basic.sex;
        list.age = basic.age;
        list.patientId = basic.patientId;
        list.diagnosis = basic.diagnosis;
    }


    /**************************************这是保存****************************************/
    $scope.save = function(section){
        $scope.btnDisable = true;
        if(section != 'follow'){
            var result = null;
            var mss = null;
            var method = "post";
            if($scope.params.operate == SYS.ADD){
                InputService.getJson(inputUrl[$scope.params.section].dataUrl).then(function(msg){
                    result = msg.data;
                    mss = msg;
                });
            }else if($scope.params.operate == SYS.EDIT){
                method = "put";
                result = $scope.editList;
            }
            setTimeout(function(){
                if(result !=null){
                    // InputService.getJson(inputUrl[$scope.params.section].dataUrl).then(function(msg){
                    // result = msg.data;
                    if(section == 'pre'){
                        //获取基本信息表单
                        angular.forEach($scope.formList.basic,function(list){
                            angular.forEach(list.children,function(children){
                                if(children.name){
                                    result[children.name] = children.value;//这块保存模板里没有的字段也会保存进去,因为这样赋值的话会自己创建
                                }
                            })
                        });
                        //获取详细信息表单
                        result = getResult(result,$scope.formList.detailed);
                        result = getResult(result,$scope.formList.conclusion);
                        if(result.feasibilityTime=="" || result.feasibilityTime==null){
                            var msg = {
                                status:SYS.STATUS_ERROR,
                                description:"请选择评估时间"
                            };
                            Utils.sysTip($scope,msg)
                        }else{
                            result.visitId = $scope.basicInfo.visitId;
                            if($scope.params.tubeInfoId){
                                InputService.savePreByTube({
                                    list:result,
                                    tubeInfoId:$scope.params.tubeInfoId,
                                    method:method
                                }).then(function(msg){
                                    Utils.sysTip($scope,msg);
                                    if(msg.status == SYS.STATUS_SUCCESS){
                                        setTimeout(function(){
                                            $location.path('catheter-details/'+$scope.params.patientId+"/"+$scope.params.tubeInfoId)
                                        },2500);
                                    }else{
                                        $scope.btnDisable = false;
                                    }
                                })
                            }else {
                                InputService.save({
                                    url:inputUrl[section].saveUrl,
                                    list:result,
                                    method:method
                                }).then(function(msg){
                                    Utils.sysTip($scope,msg);
                                    if(msg.status == SYS.STATUS_SUCCESS){
                                        setTimeout(function(){
                                            $location.path('details/'+$scope.params.patientId);
                                        },2500);
                                    }else{
                                        $scope.btnDisable = false;
                                    }
                                })
                            }
                        }
                    }else if(section == 'catheter'){
                        result = getResult(result,$scope.formList);
                        result.tubetype = $scope.params.tubeType;
                        result.patientId = $scope.basicInfo.patientId;
                        result.visitId = $scope.basicInfo.visitId;
                        if($scope.params.feasibilityId){
                            result.feasibilityId = $scope.params.feasibilityId;
                        }
                        if(result.tubeTime=="" || result.tubeTime==null){
                            var msg = {
                                status:SYS.STATUS_ERROR,
                                description:"请选择置管时间"
                            };
                            Utils.sysTip($scope,msg);
                        }else{
                            InputService.save({
                                url:inputUrl[section].saveUrl,
                                list:result,
                                patientId:$scope.basicInfo.patientId,
                                visitId:$scope.basicInfo.visitId,
                                method:method
                            }).then(function(msg){
                                Utils.sysTip($scope,msg);
                                if(msg.status == SYS.STATUS_SUCCESS){
                                    setTimeout(function(){
                                        $location.path('catheter-details/'+$scope.params.patientId+"/"+msg.data.id);
                                    },2500);
                                }else{
                                    $scope.btnDisable = false;
                                }
                            })
                        }
                    }else if(section == 'extubation'){
                        result = getResult(result,$scope.formList);
                        result.tubeInfoId = $scope.params.tubeInfoId;
                        if(result.extubationTime=="" || result.extubationTime==null){
                            var msg = {
                                status:SYS.STATUS_ERROR,
                                description:"请选择拔管时间"
                            };
                            Utils.sysTip($scope,msg);
                        }else{
                            InputService.save({
                                url:inputUrl[section].saveUrl,
                                list:result,
                                method:method
                            }).then(function(msg){
                                Utils.sysTip($scope,msg);
                                if(msg.status == SYS.STATUS_SUCCESS){
                                    setTimeout(function(){
                                        $location.path('catheter-details/'+$scope.params.patientId+"/"+$scope.params.tubeInfoId);
                                    },2500);
                                }else{
                                    $scope.btnDisable = false;
                                }
                            })
                        }
                    }else if(section=='maintenance'){
                        result = getResult(result,$scope.formList.maintenance);
                        result = getResult(result,$scope.formList.special);
                        result.tubeInfoId = $scope.params.tubeInfoId;
                        if(result.serviceTime=="" || result.serviceTime==null){
                            var msg = {
                                status:SYS.STATUS_ERROR,
                                description:"请选择维护时间"
                            };
                            Utils.sysTip($scope,msg);
                        }else{
                            InputService.save({
                                url:inputUrl[section].saveUrl,
                                list:result,
                                method:method
                            }).then(function(msg){
                                Utils.sysTip($scope,msg);
                                if(msg.status == SYS.STATUS_SUCCESS){
                                    setTimeout(function(){
                                        $location.path('catheter-details/'+$scope.params.patientId+"/"+$scope.params.tubeInfoId);
                                    },2500);
                                }else{
                                    $scope.btnDisable = false;
                                }
                            })
                        }
                    }
                }
            },500);
        }else if(section == 'follow'){
            var method = "";
            $scope.params.operate == SYS.EDIT?method = 'put':method = 'post';
            var result = [];
            var visitTime = null;
            var list = null;
            list = InputService.filterSaveFollow($scope.formList);
            result = list.result;
            visitTime = list.visitTime;
            if(visitTime=="" || visitTime==null){
                var msg = {
                    status:SYS.STATUS_ERROR,
                    description:"请选择随访时间"
                };
                Utils.sysTip($scope,msg);
            }else{
                if($scope.params.operate == SYS.ADD){
                    InputService.saveFollow({
                        list:result,
                        tubeInfoId:$scope.params.tubeInfoId,
                        visitTime:visitTime
                    }).then(function(msg){
                        Utils.sysTip($scope,msg);
                        if(msg.status == SYS.STATUS_SUCCESS){
                            setTimeout(function(){
                                $location.path('catheter-details/'+$scope.params.patientId+"/"+$scope.params.tubeInfoId);
                            },2500);
                        }else{
                            $scope.btnDisable = false;
                        }
                    });
                }else if($scope.params.operate == SYS.EDIT){
                    InputService.saveFollowEdit({
                        list:result,
                        tubeInfoId:$scope.params.tubeInfoId,
                        visitTime:visitTime,
                        id:$scope.params.id
                    }).then(function(msg){
                        Utils.sysTip($scope,msg);
                        if(msg.status == SYS.STATUS_SUCCESS){
                            setTimeout(function(){
                                $location.path('catheter-details/'+$scope.params.patientId+"/"+$scope.params.tubeInfoId);
                            },2500);
                        }else{
                            $scope.btnDisable = false;
                        }
                    });
                }
            }
        }
    };

    /**
     * 保存时迭代页面展示用的json和保存的对象格式,把页面绑定的值在savejson中找到对应的name赋上值
     * @param result
     * @param formList
     * @returns {*}
     */
    function getResult(result,formList){
        angular.forEach(formList,function(list){
            if(list.name){
                result[list.name] = getOptionValue(list);
                if(checkAction(list)){//如果选中的值等于交互值才能赋值
                    angular.forEach(list.action,function(action){
                        angular.forEach(action.children,function(child){
                            if(child.name){
                                result[child.name]=getOptionValue(child);
                            }
                        })
                    })
                }else{//如果选中的值不等于交互值就把交互中的值去掉
                    angular.forEach(list.action,function(action){
                        angular.forEach(action.children,function(child){
                            if(child.name){
                                result[child.name]="";
                            }
                        })
                    })
                }
            }else if(list.hasBranch){
                angular.forEach(list.children,function(children){
                    if(children.name){
                        result[children.name]=getOptionValue(children);
                        if(checkAction(children)){
                            angular.forEach(children.action,function(action){
                                angular.forEach(action.children,function(child){
                                    if(child.name){
                                        result[child.name]=getOptionValue(child);
                                    }
                                })
                            })
                        }else{
                            angular.forEach(children.action,function(action){
                                angular.forEach(action.children,function(child){
                                    if(child.name){
                                        result[child.name]="";
                                    }
                                })
                            })
                        }
                    }
                })
            }
        });
        return result;
    }

    /**
     * 给返回值赋值(如果是多选要特殊处理)
     * @param list
     * @returns {string}
     */
    function getOptionValue(list){
        var returned = "";
        if(list.type == 'checkbox'){
            var values = [];
            angular.forEach(list.options,function(option,index){
                if(list.value[index]){
                    values.push(option.value);
                }
            });
            if(values.length>0){
                returned = values.join(',');
            }
        }else{
            returned = list.value;
        }
        return returned;
    }

    /**
     * 检查交互的内容要不要保存,返回true就是可以保存
     * @param list
     * @returns {boolean}
     */
    function checkAction(list){
        var action = false;
        if(list.type == 'radio'){
            if(list.value == list.actionValue){
                action = true;
            }
        }else if(list.type == 'checkbox'){
            if(list.value[list.actionValue]){
                action = true;
            }
        }
        return action;
    }


    /**************************************这是触发的操作***************************************/
    var countTotal = {
        tubeInLength:0,
        tubeExternalLength:0
    };
    //计算导管总长度
    $scope.lengthBlur = function(form){
        countTotal[form.name] = form.value;
        angular.forEach($scope.formList,function(list){
            if(list.name == 'tubeTotalLength'){
                list.value = (parseFloat(countTotal.tubeInLength)*100000+parseFloat(countTotal.tubeExternalLength)*100000)/100000;
            }
        })
    };

    /**
     * 开始置管
     */
    $scope.addCatheter = function(){
        $scope.details.uniqueId = $scope.details.id;//设置这个值是因为"开始置管"控件中,需要获取评估id,用的是uniqueId(是因为时间轴控件把id这个字段用了)
        $("#addCatheter").modal({backdrap:'static'});
    };
    /**
     * 一般是详情页的返回
      */
    $scope.back = function(){
        $location.path('catheter-details/'+$scope.params.patientId+"/"+$scope.params.tubeInfoId);
    };
    //评估的返回,要分情况
    $scope.preDetailsBack = function(){
        if($scope.params.tubeInfoId){
            $location.path('catheter-details/'+$scope.params.patientId+"/"+$scope.params.tubeInfoId);
        }else{
            $location.path('details/'+$scope.params.patientId);
        }
    };

    /**
     * 返回按钮
     */
    $scope.goBack = function(){
        window.history.go(-1);
    };
}]);