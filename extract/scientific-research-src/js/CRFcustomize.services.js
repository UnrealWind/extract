angular.module('infi-basic').service('crfCustomizeServices',['$http','SYS',function($http,SYS){
    // 新建CRF
    this.saveCrf =function (option) {
        var url = SYS.url+'crf/custome';
        return $http({
            url: url,
            method: 'post',
            data: {
                name: option.name,
                value: option.value,
                order: option.order
            }
        }).then(function(msg){
            $('#addCrf').modal('hide');
            return msg.data.data;
        }).then(function (msg) {
            location.href = '#/CRF-customize/' + msg.id;
        });
    }
    //修改CRF装态
    this.modifyStatus = function (crfId,status) {
        var url = SYS.url + 'crf/custome/'+ crfId +'/publish';
        return $http({
            url: url,
            method: 'get',
            data: {
                status: status
            }
        }).then(function (msg) {
            return msg.data.status;

        })
    }
    //校验编号是否唯一
    this.testValue = function (value) {
        var url = SYS.url + '/crf/custome/validate';
        return $http({
            url: url,
            method: 'get',
            params: {
                value: value
            }
        }).then(function (msg) {
            return msg.data.data;
        })
    }
    // 获取crf列表以及分页
    this.getCrfList = function (pageNo) {
        var url = SYS.url + 'crf/custome/page'
        return $http({
            url: url,
            method: 'get',
            params:{
                page_number: pageNo,
                page_size: 10
            }
        }).then(function (msg) {
            return msg.data;
        });
    }
    //删除单个crf
    this.deleteCrf = function (id) {
        var url = SYS.url + 'crf/custome/' +id;
        return $http({
            url: url,
            method: 'delete'
        })
    }
    //获取CRF信息
    this.getCrfDetail = function (crfId) {
        var url = SYS.url + 'crf/custome/' + crfId;
        return $http({
            url: url,
            method: 'get'
        }).then(function (msg) {
            return msg.data.data;
        })
    }
    //修改CRF信息
    this.modifyCrf = function (crfId,option) {
        var url = SYS.url + 'crf/custome/' + crfId;
        return $http({
            url: url,
            method: 'put',
            data: {
                name: option.name,
                value: option.value
            }
        }).then(function (msg) {
            return msg.data;
        })
    }
    //获取模块节点信息分页
    this.getModuleList = function (page,crfId) {
        var url = SYS.url + 'crf/custome/' + crfId + '/navi/page';
        return $http({
            url: url,
            method: 'get',
            params: {
                page_number: page.number,
                page_size: page.size,
                filter__EQ_type: 'MODULE',
                crfId: crfId
            }
        }).then(function (msg) {
            return msg.data;
        })
    }
    //获取主题节点信息分页
    this.getThemeList = function (page,crfId) {
        var url = SYS.url + 'crf/custome/' + crfId + '/navi/page';
        return $http({
            url: url,
            method: 'get',
            params: {
                page_number: page.number,
                page_size: page.size,
                filter__EQ_type: 'THEME',
                crfId: crfId
            }
        }).then(function (msg) {
            return msg.data;
        })
    }
    //删除节点
    this.deleteNode = function (item,crfId) {
        var url = SYS.url + 'crf/custome/'+ crfId +'/navi/' + item.id;
        return $http({
            url: url,
            method: 'delete'
        }).then(function (msg) {
            return msg;
        })
    }

    //新建模块节点
    this.createModule = function (crfId, data, combineId) {
        var url = SYS.url + 'crf/custome/'+crfId+'/navi';
        return $http({
            url: url,
            method: 'post',
            data: {
                name: data.name,
                value: data.value,
                crfId: crfId,
                parentId: '0',
                type: 'MODULE',
                combineId: combineId,
                order: data.order
            }
        }).then(function (msg) {
        });
    }
    //新建主题节点
    this.createTheme = function (crfId,parentId, data) {
        var url = SYS.url + 'crf/custome/'+crfId+'/navi';
        return $http({
            url: url,
            method: 'post',
            data: {
                name: data.name,
                value: data.value,
                crfId: crfId,
                parentId: parentId,
                type: 'THEME',
                combineId: data.combineId,
                order: data.order,
                parentIds: crfId + ',' + parentId
            }
        }).then(function (msg) {
        });
    }
    //新建子主题节点
    this.createSubTheme = function (crfId,parentId, data) {
        var url = SYS.url + 'crf/custome/'+crfId+'/navi';
        return $http({
            url: url,
            method: 'post',
            data: {
                name: data.name,
                value: data.value,
                crfId: crfId,
                parentId: parentId,
                type: 'SUB_THEME',
                combineId: data.combineId,
                order: data.order
            }
        }).then(function (msg) {
            return msg.data.data.parentId;
        });
    }
    //获取子主题节点信息分页
    this.getSubThemeList = function (page,crfId) {
        var url = SYS.url + 'crf/custome/' + crfId + '/navi/page';
        return $http({
            url: url,
            method: 'get',
            params: {
                page_number: page.number,
                page_size: page.size,
                filter__EQ_type: 'SUB_THEME',
                crfId: crfId
            }
        }).then(function (msg) {
            return msg.data;
        })
    }
    //获取CRF下边所有模块，进而获取组合id
    this.getCombineId = function (type,crfId) {
        var url = SYS.url + 'crf/custome/'+ crfId +'/navi/list',
            type = angular.uppercase(type);
        return $http({
            url: url,
            method: 'get',
            params: {
                filter__EQ_type: type
            }
        }).then(function (msg) {
            return msg.data.data;
        })
    }
    //根据parentId获取组合数据
    this.getCombineIdByParent = function (crfId,parentId) {
        var url = SYS.url + 'crf/custome/'+ crfId +'/navi/list';
        return $http({
            url: url,
            method: 'get',
            params: {
                filter__EQ_parentId: parentId,
            }
        }).then(function (msg) {
            return msg.data.data;
        })
    }

    //根据parentId获取模块名、主题名、子主题
    this.getParentData = function (crfId,parentId,type) {
        var url = SYS.url + 'crf/custome/' + crfId + '/navi/list';
        return $http({
            url: url,
            method: 'get',
            params: {
                filter__EQ_parentId: parentId,
                filter__EQ_type: type
            }
        }).then(function (msg) {
            return msg.data.data;
        })
    }


    //获取制定CRF下边的 属性列表，进而获取combineId
    this.getPropertyList = function (crfId,parentId) {
        var url = SYS.url + 'crf/custome/'+ crfId +'/property/list';
        return $http({
            url: url,
            method: 'get',
            params: {
                filter__EQ_parentId: parentId
            }
        }).then(function (msg) {
            return msg.data.data;
        })
    }
    //分页读取属性列表
    this.getPropertyDataList = function (page,crfId) {
        var url = SYS.url + 'crf/custome/' + crfId + '/property/page';
        return $http({
            url: url,
            method: 'get',
            params: {
                page_number: page.number,
                page_size: page.size,
                crfId: crfId,
                filter__EQ_type: 'PROPERTY'
            }
        }).then(function (msg) {
            return msg.data;
        })
    }
    //删除属性节点
    this.deletePropertyNode = function (item,crfId) {
        var url = SYS.url + 'crf/custome/'+ crfId +'/property/' + item.id;
        return $http({
            url: url,
            method: 'delete'
        }).then(function (msg) {
            return msg;
        })
    }

    //修改模块
    this.modifyModule = function (crfId,data,combineId,oldData,parentId,type) {
        var url = SYS.url + 'crf/custome/'+ crfId + '/navi/' + oldData.id;
        return $http({
            url: url,
            method: 'put',
            data: {
                combineId: combineId,
                crfId: oldData.crfId,
                id: oldData.id,
                name: data.name,
                order: data.order,
                value: oldData.value,
                parentId: parentId,
                type: type
            }
        }).then(function (msg) {
        })
    }

    //获取单个节点
    this.getSingleNode = function (crfId,oldData) {
        var url = SYS.url + 'crf/custome/'+ crfId + '/navi/' + oldData.id;
        return $http({
            url: url,
            method: 'get',
        }).then(function (msg) {
            return msg.data.data;
        })
    }
    //获取单个属性
    this.getSingleProperty = function (crfId,id) {
        var url = SYS.url + 'crf/custome/' + crfId + '/property/' + id;
        return $http({
            url: url,
            method: 'get'
        }).then(function (msg) {
            return msg.data.data;
        })
    }
    //添加属性
    this.addProperty = function (crfId,parentId,data) {
        var url = SYS.url + 'crf/custome/'+ crfId +'/property';
        return $http({
            url: url,
            method: 'post',
            data: {
                crfId: crfId,
                parentId: parentId,
                name: data.name,
                value: data.value,
                combineId: data.combineId,
                unit: data.unit,
                filted: data.filted,
                exported: data.exported,
                valueList: data.valueList,
                valueType: data.valueType,
                required: data.required,
                order: data.order,
                module: data.moduleData,
                theme: data.themeData,
                sub_theme: data.subThemeData,
                description: data.description,
                type: 'PROPERTY',
                valueType: data.valueType,
                preId: data.preId,
                preValue: data.preValue,
                parentIds: data.moduleData +','+ data.themeData+','+ data.subThemeData
            }
        }).then(function (msg) {
            return msg.data.description;
        })
    }
    //修改属性
    this.modifyProperty = function (crfId,id,parentId,data) {
        var url = SYS.url + 'crf/custome/' + crfId + '/property/' + id;
        return $http({
            url: url,
            method: 'put',
            data: {
                crfId: crfId,
                parentId: parentId,
                name: data.name,
                combineId: data.combineId,
                unit: data.unit,
                filted: data.filted,
                exported: data.exported,
                valueList: data.valueList,
                valueType: data.valueType,
                required: data.required,
                order: data.order,
                description: data.description,
                type: 'PROPERTY',
                value: data.value,
                preId: data.preId,
                preValue: data.preValue,
                parentIds: data.moduleData + ',' + data.themeData + ',' + data.subThemeData
            }
        }).then(function (msg) {

            return msg.data.description;
        })
    }
    this.getDataType = function () {
        var url = SYS.url + 'crf/custome/dim/property/type';
        return $http({
            url: url,
            method: 'get'
        }).then(function (msg) {
            return msg.data.data;
        })
    }
    this.view = function (id) {
        var url = SYS.url + 'crf/custome/' + id + '/view';
        return $http({
            url: url,
            method: 'get'
        }).then(function (msg) {
            return msg.data.data;
        })
    }
}]);
