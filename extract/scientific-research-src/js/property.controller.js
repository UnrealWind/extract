angular.module("infi-basic").controller('PropertyController',
    ['$scope','SYS','$http','$timeout','$routeParams','crfCustomizeServices',function ($scope,SYS,$http,$timeout,$routeParams,crfCustomizeServices) {
        $scope.parentId = $routeParams.id;
        $scope.crfId = $routeParams.crfId;
        $scope.way = $routeParams.way;
        $scope.moduleData = [];
        $scope.boolean = [
            {label: '是', value: true},
            {label: '否', value: false}
        ];
        $scope.goToCustomizePage = function () {
            location.href = '#/CRF-customize/' + $routeParams.crfId;
        }
        $scope.basic = {
            name: '',
            value: '',
            combineId: '',
            valueList: '',
            valueType: '',
            unit: '',
            filted: false,
            exported: false,
            required: false,
            parentId: '',
            moduleData: '',
            themeData: '',
            subThemeData: '',
            order: '40',
            description: '',
            preId: '',
            preValue: ''
        }

        if($scope.way == 'modify'){
            crfCustomizeServices.getSingleProperty($scope.crfId,$scope.parentId).then(function (data) {

                $scope.basic = {
                    name: data.name,
                    value: data.value,
                    combineId: data.combineId,
                    valueList: data.valueList,
                    valueType: data.valueType,
                    unit: data.unit,
                    filted: data.filted,
                    exported: data.exported,
                    required: data.required,
                    parentId: data.parentId,
                    moduleData: '',
                    themeData: '',
                    subThemeData: '',
                    order: data.order,
                    description: data.description,
                    preId: data.preId,
                    preValue: data.preValue,
                    parentIds: data.parentIds
                }
            }).then(function () {
                crfCustomizeServices.getSingleProperty($scope.crfId,$scope.basic.preId).then(function (data) {
                    if(data != null) {
                        $scope.preValue = data.valueList.split('，');
                    }
                })
                $scope.disabled = false;
                if($scope.basic.valueType == 'input') {
                    $scope.disabled = true;
                }
                console.log($scope.basic.parentIds)
                var arr = $scope.basic.parentIds.split(',');
                angular.forEach(arr,function (item) {
                    $scope.oldData = {id: item};
                    if(item != 0 && item != 'null'){
                        crfCustomizeServices.getSingleNode($scope.crfId,$scope.oldData).then(function (data) {
                            if(data.type.name == 'MODULE') {
                                //给模块赋初值
                                $scope.basic.moduleData = data.id;
                                //初始化组合和上一级属性
                                crfCustomizeServices.getPropertyList($scope.crfId,data.id).then(function (data) {
                                    $scope.combineId = data;
                                    $scope.preId = $scope.combineId;
                                });
                                crfCustomizeServices.getParentData($scope.crfId,$scope.basic.moduleData,'THEME').then(function (data) {
                                    $scope.themeDataList = data;
                                })
                            }else if(data.type.name == 'THEME'){
                                $scope.themeDataList = [];
                                //给模块赋初值
                                $scope.basic.themeData = data.id;
                                //获取主题的列表
                                crfCustomizeServices.getPropertyList($scope.crfId,data.id).then(function (data) {
                                    $scope.combineId = data;
                                    $scope.preId = $scope.combineId;
                                });
                                crfCustomizeServices.getParentData($scope.crfId,$scope.basic.moduleData,'THEME').then(function (data) {
                                    $scope.themeDataList = data;
                                    crfCustomizeServices.getParentData($scope.crfId,$scope.basic.themeData,'SUB_THEME').then(function (data) {
                                        $scope.subThemeDataList = data;
                                    })
                                })
                            }else if(data.type.name == 'SUB_THEME'){
                                $scope.subThemeDataList = [];
                                $scope.basic.subThemeData = data.id;
                                //获取子主题的列表
                                crfCustomizeServices.getPropertyList($scope.crfId,data.id).then(function (data) {
                                    $scope.combineId = data;
                                    $scope.preId = $scope.combineId;
                                });
                                $scope.basic.themeData == '' ?  $scope.basic.themeData = $scope.basic.moduleData: '';
                                crfCustomizeServices.getParentData($scope.crfId,$scope.basic.themeData,'SUB_THEME').then(function (data) {
                                    $scope.subThemeDataList = data;
                                })
                            }
                        })
                    }
                })
            })
        }else if($scope.way == 'add' && $scope.parentId != 0) {
            crfCustomizeServices.getPropertyList($scope.crfId,$scope.parentId).then(function (data) {
                $scope.combineId = data;
                $scope.preId = $scope.combineId;
            });
            //将模块主题子主题信息带过来
            $scope.oldData = {id: $scope.parentId};
            crfCustomizeServices.getSingleNode($scope.crfId,$scope.oldData ).then(function (data) {
                if(data.type.name == 'MODULE') {
                    $scope.basic.moduleData = data.id;
                    crfCustomizeServices.getParentData($scope.crfId,$scope.basic.moduleData,'THEME').then(function (data) {
                        if(data != null) {
                            $scope.themeDataList = data.id;
                        }
                    });
                }else if(data.type.name == 'THEME') {
                    $scope.basic.themeData = data.id;
                    $scope.oldData = {id: data.parentId};
                    crfCustomizeServices.getSingleNode($scope.crfId,$scope.oldData ).then(function (data) {
                        $scope.basic.moduleData = data.id;
                        crfCustomizeServices.getParentData($scope.crfId,$scope.basic.moduleData,'THEME').then(function (data) {
                            $scope.themeDataList = data;
                            crfCustomizeServices.getParentData($scope.crfId,$scope.basic.themeData,'SUB_THEME').then(function (data) {
                                if(data != null) {
                                    $scope.subThemeDataList = data;
                                }
                            });
                        });
                    });
                }else if(data.type.name == 'SUB_THEME'){
                    $scope.basic.subThemeData = data.id;
                    $scope.oldData = {id: data.parentId};
                    crfCustomizeServices.getSingleNode($scope.crfId,$scope.oldData ).then(function (data) {
                        $scope.oldData = {id: data.parentId};
                        if(data.type.name == 'MODULE') {
                            $scope.basic.moduleData = data.id;
                            crfCustomizeServices.getParentData($scope.crfId,$scope.basic.moduleData,'SUB_THEME').then(function (data) {
                                if(data != null){
                                    $scope.subThemeDataList = data;
                                }
                            });
                        }else {
                            $scope.basic.themeData = data.id;
                            crfCustomizeServices.getSingleNode($scope.crfId,$scope.oldData ).then(function (data) {
                                if(data != null) {
                                    $scope.basic.moduleData = data.id;
                                    crfCustomizeServices.getParentData($scope.crfId,$scope.basic.moduleData,'THEME').then(function (data) {
                                        $scope.themeDataList = data;
                                        crfCustomizeServices.getParentData($scope.crfId,$scope.basic.themeData,'SUB_THEME').then(function (data) {
                                            if(data != null){
                                                $scope.subThemeDataList = data;
                                            }
                                        });
                                    });
                                }
                            })
                        }

                    });
                }
            })
        }

        $scope.changeOrder = function(){
            var reg = new RegExp("^[0-9]*$","g");
            if(!reg.test($scope.basic.order) && $scope.basic.order != ''){
                $scope.orderWarm = true;
                $scope.basic.order = '';
            }else {
                $scope.orderWarm = false;
            }
        }
        $scope.saveProperty = function () {
            $scope.moduleWarm = false;
            $scope.moduleDataList = [];
            if($scope.basic.moduleData == '') {
                $scope.moduleWarm = true;
            }else{
                if($scope.way == 'add'){
                    if($scope.parentId == 0) {
                        $scope.parentId == 0 ? $scope.parentId = $scope.basic.subThemeData: '';
                        $scope.basic.subThemeData == '' ? $scope.parentId = $scope.basic.themeData: '';
                        $scope.basic.themeData == '' ? $scope.parentId = $scope.basic.moduleData: '';
                    }
                    crfCustomizeServices.addProperty($scope.crfId,$scope.parentId,$scope.basic).then(function (msg) {
                        if(msg == '数据请求成功') {
                            $scope.modal = function (mark) {
                                $scope.message = '添加属性成功';
                                $('#'+mark).modal();
                            }
                            $scope.modal('add-property-success');
                            $timeout(function () {
                                location.href = '#/CRF-customize/' + $routeParams.crfId;
                            },2000)
                        }
                    })
                }else if($scope.way == 'modify'){
                    if($scope.basic.subThemeData != '' && $scope.basic.subThemeData != null) {
                        $scope.basic.parentId = $scope.basic.subThemeData;
                    }else if($scope.basic.themeData != '' && $scope.basic.themeData != null){
                        $scope.basic.parentId = $scope.basic.themeData;
                    }else if($scope.basic.moduleData != '' && $scope.basic.moduleData != null){
                        $scope.basic.parentId = $scope.basic.moduleData;
                    }
                    crfCustomizeServices.modifyProperty($scope.crfId,$scope.parentId,$scope.basic.parentId,$scope.basic).then(function (msg) {
                        if(msg == '数据请求成功') {
                            $scope.modal = function (mark) {
                                $scope.message = '修改属性成功';
                                $('#'+mark).modal();
                            }
                            $scope.modal('add-property-success');
                            $timeout(function () {
                                location.href = '#/crfCustomize/' + $routeParams.crfId;
                            },2000);
                        }
                    })
                }
            }

        }

        $scope.getCombineId = function (type) {
            $scope.moduleDataList = [];
            crfCustomizeServices.getCombineId(type,$scope.crfId).then(function (data) {
                $scope.moduleDataList = data;
            });
        }
        $scope.getCombineId('module');
        //模块主题子主题，属性值联动

        $scope.selectModule = function (parentId) {
            $scope.themeDataList = [];
            $scope.subThemeDataList = [];
            $scope.combineId = [];
            crfCustomizeServices.getParentData($scope.crfId,parentId,'THEME').then(function (data) {
                $scope.themeDataList = data;
            });
            crfCustomizeServices.getParentData($scope.crfId,parentId,'SUB_THEME').then(function (data) {
                $scope.subThemeDataList = data;
            });
            crfCustomizeServices.getPropertyList($scope.crfId,parentId).then(function (data) {
                $scope.combineId = data;
                $scope.preId = $scope.combineId;
            });
        }
        $scope.selectTheme = function (parentId) {
            $scope.themeData = [];
            $scope.subThemeDataList = [];
            if(parentId != null) {
                crfCustomizeServices.getParentData($scope.crfId,parentId,'SUB_THEME').then(function (data) {
                    $scope.subThemeDataList = data;
                })
                crfCustomizeServices.getPropertyList($scope.crfId,parentId).then(function (data) {
                    $scope.combineId = data;
                    $scope.preId = $scope.combineId;
                });
            }
        }
        $scope.selectSubTheme = function(moduleData,themeData,parentId){
            if(parentId != null){
                crfCustomizeServices.getPropertyList($scope.crfId,parentId).then(function (data) {
                    $scope.combineId = data;
                    $scope.preId = $scope.combineId;
                });
            }
        }
        crfCustomizeServices.getDataType().then(function (data) {
            $scope.valueType = [];
            $scope.selectType = [];
            angular.forEach(data,function (item) {
                $scope.valueType.push({value: item.value, name: item.name,checked: item.checked});
                if(item.checked == true) {
                    $scope.selectType.push({value: item.value,checked: item.checked})
                }
            })

        });
        $scope.disabled = true;
        $scope.changeType = function () {
            $scope.disabled = true;
            $scope.basic.valueList = '';
            angular.forEach($scope.selectType,function (data) {
                if(data.value == $scope.basic.valueType) {
                    $scope.disabled = false;
                }
            })
        }
        //获取属性值
        $scope.selectPreValue = function (id) {
            if(id != null) {
                crfCustomizeServices.getSingleProperty($scope.crfId,id).then(function (data) {
                    $scope.preValue = data.valueList.split('，');
                })
            }

        }
    }]);
