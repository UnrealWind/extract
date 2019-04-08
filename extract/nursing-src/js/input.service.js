angular.module('infi-basic').service('InputService', ['SYS', '$http', '$filter', function (SYS, $http, $filter) {
    //获取静态json
    this.getJson = function(url){
        return $http.get(SYS.jsonUrl+url+'.json').then(function success(msg){
            return msg.data;
        })
    };

    /**
     * 给置管前评估录入界面基本信息赋值
     * @param formList
     * @param basicInfo
     */
    this.filterPreBasic = function(formList,basicInfo){
        angular.forEach(formList.basic,function(basic){
            angular.forEach(basic.children,function(children){
                children.name == "patientName"?children.value = basicInfo.patientName:'';
                children.name == "sex"?children.value = basicInfo.sex:'';
                children.name == "age"?children.value = basicInfo.age:'';
                children.name == "patientId"?children.value = basicInfo.patientId:'';
                children.name == "diagnosis"?children.value = basicInfo.diagnosis:'';
            })
        });
        return formList;
    };

    /**
     * 随访录入页面,页面初始化获取对应题目
     * @param templateId
     */
    this.getFollow = function(templateId){
        return $http.get(SYS.url + 'visit/visitQuestion?visitTemplateId='+templateId).then(function(msg){
            return msg.data;
        })
    };

    /**
     * 保存
     * @param filter
     * @returns {*}
     */
    this.save = function(filter){
        var url = SYS.url+filter.url;
        if(filter.method == 'put'){
            url = url + '/' +filter.list.id;
        }
        // var params=[];
        // filter.patientId !=undefined?params.push("filter_patientId="+filter.patientId):'';
        // filter.visitId !=undefined?params.push("filter_visitId="+filter.visitId):'';
        // if(params.length>0){
        //     url = url + "?" + params.join("&");
        // }
        return $http({
            method:filter.method,
            url:url,
            data:filter.list
        }).then(function(msg){
            return msg.data;
        });
    };

    /**
     * 随访记录保存
     * @param filter
     * @returns {*}
     */
    this.saveFollow = function(filter){
        return $http.post(SYS.url + 'visit/visitSave?visitTime='+filter.visitTime+"&tubeInfoId="+filter.tubeInfoId,filter.list).then(function(msg){
            return msg.data;
        })
    };
    /**
     * 随访记录保存(修改的保存)
     * @param filter
     * @returns {*}
     */
    this.saveFollowEdit = function(filter){
        return $http.put(SYS.url + 'visit/visitSave/'+filter.id,filter.list).then(function(msg){
            return msg.data;
        })
    };

    /**
     * 保存评估带置管ID
     * @param filter
     * @returns
     */
    this.savePreByTube = function(filter){
        return $http.post(SYS.url + 'assessment/saveView?tubeInfoId='+filter.tubeInfoId,filter.list).then(function(msg){
            return msg.data;
        })
    };

    this.getDetails = function(filter){
        var url = SYS.url + filter.url + "/"+filter.id;
        var params = [];
        filter.patientId!=undefined?params.push("patientId="+filter.patientId):'';
        if(params.length>0){
            url = url +"?"+ params.join("&");
        }
        return $http.get(url).then(function(msg){
            return msg.data;
        })
    };

    /**
     * 详情整合数据
     * @param details
     * @param formList
     * @param section
     */
    this.filterDetailsList = function(details,formList,section){
        var result = [];
        if(section == 'maintenance'){
            angular.forEach(formList,function(value,key){
                angular.forEach(value,function(list){
                    list.value = details[list.name];
                    result.push({
                        label:list.label,
                        value:list.value,
                        name:list.name,
                        unit:list.unit,
                        type:list.type
                    });
                    if(list.action){
                        if(list.type=='radio' && list.value==list.actionValue){
                            getActionDetails(list,details,result);
                        }
                        else if(list.type == 'checkbox' && list.value == list.options[list.actionValue].value){
                            getCheckboxActionDetails(list,details,result);
                        }else{
                            getDetailAction(list,details,result);
                        }
                    }
                })
            });
        }
        else if(section == 'pre'){
            angular.forEach(formList,function(value,key){
                if(key == 'basic'){
                    angular.forEach(value,function(values){
                        angular.forEach(values.children,function(cell){
                            cell.value = details[cell.name];
                            result.push({
                                label:cell.label,
                                value:cell.value,
                                name:cell.name,
                                unit:cell.unit,
                                type:cell.type
                            });
                        })
                    });
                }else if(key == 'detailed'){
                    angular.forEach(value,function(list){
                        if(list.hasBranch){
                            angular.forEach(list.children,function(branch){
                                branch.value = details[branch.name];
                                result.push({
                                    label:branch.label,
                                    value:branch.value,
                                    name:branch.name,
                                    unit:branch.unit,
                                    type:branch.type
                                });
                                if(branch.action){
                                    if(branch.type=='radio' && branch.value==branch.actionValue){
                                        getActionDetails(branch,details,result);
                                    }
                                    else if(branch.type == 'checkbox'){
                                        getCheckboxActionDetails(branch,details,result);
                                    }else{
                                        getDetailAction(branch,details,result);
                                    }
                                }
                            });
                        }else{
                            list.value = details[list.name];
                            result.push({
                                label:list.label,
                                value:list.value,
                                name:list.name,
                                unit:list.unit,
                                type:list.type
                            });
                            if(list.action){
                                if(list.type=='radio' && list.value==list.actionValue){
                                    getActionDetails(list,details,result);
                                }
                                else if(list.type == 'checkbox'){
                                    getCheckboxActionDetails(list,details,result);
                                }else{
                                    getDetailAction(list,details,result);
                                }
                            }
                        }
                    })
                }else if(key == 'conclusion'){
                    angular.forEach(value,function(list){
                        list.value = details[list.name];
                        result.push({
                            label:list.label,
                            value:list.value,
                            name:list.name,
                            unit:list.unit,
                            type:list.type
                        });
                        if(list.action){
                            getDetailAction(list,details,result);
                        }
                    })
                }
            });
        }else if(section == 'catheter'){
            angular.forEach(formList,function(list){
                list.value = details[list.name];
                if(list.name == 'tubeEndPosition'){
                    list.value = "第"+ details[list.name]+"胸椎";
                }
                result.push({
                    label:list.label,
                    value:list.value,
                    name:list.name,
                    unit:list.unit,
                    type:list.type
                });
                if(list.action){
                    if(list.type=='radio' && list.value==list.actionValue){
                        getActionDetails(list,details,result);
                    }
                    else if(list.type == 'checkbox'){
                        getCheckboxActionDetails(list,details,result);
                    }else{
                        getDetailAction(list,details,result);
                    }
                }
            })
        }

        return filterResult(result);
    };

    /**
     * 用于详情展示带交互的类型为text的
     */
    function getDetailAction(list,details,result){
        angular.forEach(list.action,function(action){
            angular.forEach(action.children,function(children){
                children.value = details[children.name];
                result.push({
                    label:children.label,
                    value:children.value,
                    name:children.name,
                    unit:children.unit,
                    type:children.type
                });
            })
        })
    }

    /**
     * 详情页判断多选的交互显示
     * @param list
     * @param details
     * @param result
     */
    function getCheckboxActionDetails(list,details,result){
        var values = [],//将多选字符串的值转换为数组
            hasEach=false;//判断是否有交互
        values = details[list.name].split(',');
        angular.forEach(list.options,function(option,index){
            angular.forEach(values,function(value){
                if(value == option.value){
                    list.action && list.actionValue==index?hasEach = true:'';
                }
            })
        });
        if(hasEach){
            getActionDetails(list,details,result);
        }
    }

    /**
     * 有交互的话把交互信息放到result里
     * @param list
     * @param details
     * @param result
     */
    function getActionDetails(list,details,result){
        angular.forEach(list.action,function(action){
            angular.forEach(action.children,function(children){
                children.value = details[children.name];
                result.push({
                    label:children.label,
                    value:children.value,
                    name:children.name,
                    unit:children.unit,
                    type:children.type
                });
            })
        });
    }

    /**
     * 将扁平的list整合成两个一组为一个children,用于页面展示成一行两列
     * @param arr
     * @param section
     * @returns {Array}
     */
    function filterResult(arr){
        var list = [];
        while(arr.length>0){
            var obj={
                children:null
            };
            obj.children = arr.splice(0,2);
            list.push(obj);
        }
        return list;
    }

    /**
     * 适用于修改操作的场景,可行性评估的修改
     * @param editList
     * @param formList
     */
    this.filterPreEditList = function(editList,formList){
        angular.forEach(formList,function(value,key){
            if(key == 'basic'){
                angular.forEach(value,function(values){
                    angular.forEach(values.children,function(cell){
                        cell.type == 'unit'?editList[cell.name]=Number(editList[cell.name]):'';
                        cell.value = editList[cell.name];
                    })
                });
            }else if(key == 'detailed'){
                angular.forEach(value,function(list){
                    if(list.hasBranch){
                        angular.forEach(list.children,function(branch){
                            if(branch.type == 'checkbox'){
                                getCheckboxValue(branch,editList);
                            }else{
                                branch.value = editList[branch.name];
                                if(branch.action){
                                    if(branch.type=='radio' && branch.value==branch.actionValue){
                                        getActionEdit(branch,editList);
                                    }
                                }
                            }
                        });
                    }else{
                        if(list.type == 'checkbox'){
                            getCheckboxValue(list,editList);
                        }else{//不是多选的就可以正常赋值了
                            list.value = editList[list.name];
                            if(list.action){
                                if(list.type=='radio' && list.value==list.actionValue){
                                    getActionEdit(list,editList);
                                }
                            }
                        }
                    }
                })
            }else if(key == 'conclusion'){
                angular.forEach(value,function(list){
                    list.value = editList[list.name];
                    if(list.action){
                        angular.forEach(list.action,function(action){
                            angular.forEach(action.children,function(children){
                                children.value = editList[children.name];
                            })
                        })
                    }
                })
            }
        });
    };

    /**
     * 适用于修改操作的场景,置管的修改
     * @param editList
     * @param formList
     */
    this.filterCatheterEditList = function(editList,formList){
        angular.forEach(formList,function(list){
            // list.type == 'unit'?editList[list.name]=Number(editList[list.name]):'';
            if(list.type == 'checkbox'){
                getCheckboxValue(list,editList);
            }else if(list.type == 'unit' || list.type == 'twoLabel'){
                list.value=Number(editList[list.name]);
            }else{
                list.value = editList[list.name];
                if(list.action){
                    if(list.type=='radio' && list.value==list.actionValue){
                        getActionEdit(list,editList);
                    }
                }
            }
        })
    };

    /**
     * 适用于修改操作的场景,拔管的修改
     * @param editList
     * @param formList
     */
    this.filterExtubationEditList = function(editList,formList){
        angular.forEach(formList,function(list){
            if(list.type == 'checkbox'){
                getCheckboxValue(list,editList);
            }else{
                list.type == 'unit'?editList[list.name]=Number(editList[list.name]):'';
                list.value = editList[list.name];
            }
            if(list.action){
                if(list.type=='radio' && list.value==list.actionValue){
                    getActionEdit(list,editList);
                }
            }
        })
    };

    /**
     * 适用于修改操作的场景,维护的修改
     * @param editList
     * @param formList
     */
    this.filterMaintenanceEditList = function(editList,formList){
        angular.forEach(formList.maintenance,function(list){
            list.value = editList[list.name];
            if(list.action){
                if(list.type=='radio' && list.value==list.actionValue){
                    getActionEdit(list,editList);
                }
            }
        });
        angular.forEach(formList.special,function(list){
            list.value = editList[list.name];
            if(list.action){
                if(list.type=='radio' && list.value==list.actionValue){
                    getActionEdit(list,editList);
                }
            }
        })
    };

    /**
     * 适用于修改操作的场景,维护的修改
     * @param editList
     * @param formList
     */
    this.filterFollowEditList = function(editList,formList){
        angular.forEach(formList,function(list){
            list.value = editList[list.name];
            if(list.action){
                if(list.type=='radio' && list.value==list.actionValue){
                    getActionEdit(list,editList);
                }
            }
        })
    };

    /**
     * 用于修改操作时,给交互赋值
     * @param list
     * @param editList
     */
    function getActionEdit(list,editList){
        angular.forEach(list.action,function(action){
            angular.forEach(action.children,function(children) {
                if(children.type == 'checkbox'){
                    getCheckboxValue(children,editList);
                }else{
                    children.type == 'unit'?editList[children.name]=Number(editList[children.name]):'';
                    children.value = editList[children.name];
                }
            })
        })
    }

    /**
     * checkbox类型的不能直接赋值
     * @param list
     * @param editList
     */
    function getCheckboxValue(list,editList){
        var values = [],//将多选字符串的值转换为数组
            hasEach=false;//判断是否有交互
        values = editList[list.name].split(',');
        angular.forEach(list.options,function(option,index){
            angular.forEach(values,function(value){
                if(value == option.value){
                    list.value[index] = true;
                    list.action && list.actionValue==index?hasEach = true:'';
                }
            })
        });
        if(hasEach){
            getActionEdit(list,editList);
        }
    }

    /**
     * 页面初始加默认值
     * @param formList
     * @param section
     */
    this.filterRequireTime = function(formList,section){
        if(section == 'pre'){
            angular.forEach(formList.basic,function(basic){
                angular.forEach(basic.children,function(children){
                    if(children.requireTime){
                        children.value = $filter('date')(new Date,'yyyy-MM-dd');
                    }
                })
            })
        }else if(section == 'maintenance'){
            angular.forEach(formList.maintenance,function(basic){
                if(basic.requireTime){
                    basic.value = $filter('date')(new Date,'yyyy-MM-dd');
                }
            })
        }else if(section == 'follow'){
            formList.visitTime.value = $filter('date')(new Date,'yyyy-MM-dd');
        }else{
            angular.forEach(formList,function(basic){
                if(basic.requireTime){
                    basic.value = $filter('date')(new Date,'yyyy-MM-dd');
                }
            })
        }
    };

    /**
     * 随访记录保存
     * @param formList
     */
    this.filterSaveFollow = function(formList){
        var list = {
            result:[],
            visitTime:""
        };
        angular.forEach(formList,function(value,key){
            var _value="";
            //"是否结束干预"选择"是"
            if(formList['endIntervene'].value=="是"){
                if(key == 'endInterveneSeason'){
                    _value = value.value;
                }
                if(key=='isExtubation' || key=='isMaintain' || key=='maintainRecord' || key=='course'){
                    _value="";
                }
            }
            //"是否结束干预"选择"否"
            if(formList['endIntervene'].value=="否"){
                if(key == 'endInterveneSeason'){
                    _value = "";
                }
                if(key=='isExtubation' || key=='isMaintain' || key=='course'){
                    _value = value.value;
                }
                //"是否维护"选择"是"
                if(key=='maintainRecord' && formList['isMaintain'].value == '是'){
                    _value = value.value;
                }
                //"是否维护"选择"否"
                if(key=='maintainRecord' && formList['isMaintain'].value == '否'){
                    _value = "";
                }
            }
            if(key=='visitTime' || key=='visitMode' ||key=='endIntervene' ||key=='other' ||key=='person'){
                _value = value.value;
            }
            if(key=='visitTime'){
                list.visitTime = value.value;
            }
            var obj = {
                questionId:value.id,
                visitQuestionResult:_value,
                visitTemplateId:value.visitTemplateId,
                id:value.resultId,
                createTime:value.createTime,
                creator:value.creator
            };
            list.result.push(obj);
        });
        return list;
    };

    /**
     * 设置默认值
     * @param formList
     * @param section
     */
    this.getDefault = function(formList,section){
        if(section == "pre"){
            angular.forEach(formList.basic,function(basic){
                angular.forEach(basic.children,function(children){
                    if(children.default){
                        console.log(children.default)
                        children.value = children.default;
                    }
                })
            });
            angular.forEach(formList.detailed,function(detailed){
                if(detailed.hasBranch){
                    angular.forEach(detailed.children,function(children){
                        actionDefault(children);
                    })
                }else{
                    actionDefault(detailed);
                }
            })
        }
        else if(section == "maintenance"){
            angular.forEach(formList,function(list,key){
                angular.forEach(list,function(entity){
                    actionDefault(entity);
                })
            })
        }else if(section == "extubation" || section == 'catheter'){
            angular.forEach(formList,function(entity){
                if(entity.type == 'checkbox'){
                    angular.forEach(entity.options,function(option,index){
                        if(option.value == entity.default){
                            entity.value[index] = true;
                        }
                    })
                }else{
                    actionDefault(entity);
                }
            })
        }
    };

    /**
     * 给默认值赋值
     * @param data
     */
    function actionDefault(data){
        if(data.default){
            data.value = data.default;
        }
        if(data.action){
            angular.forEach(data.action,function(action){
                angular.forEach(action.children,function(children){
                    if(children.default){
                        children.value = children.default;
                    }
                })
            })
        }
    }

    /**
     * 给维护记录获取臂围
     */
    this.getArmCircumference = function(tubeInfoId){
        return $http.get(SYS.url + 'manage/historyValue?tubeInfoId='+tubeInfoId).then(function(msg){
            return msg.data;
        })
    }
}]);