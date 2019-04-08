angular.module("infi-basic").directive('addCrf',['crfCustomizeServices','$timeout','SYS',function (crfCustomizeServices,$timeout,SYS) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/addCrf.html',
        link: function (scope) {
            scope.submit = {};
            scope.disabled = true;
            scope.page = {};
            scope.page.number = 1;
            scope.modal = function (data, mark, type) {
                scope.submit = {
                    name: '',
                    value: '',
                    order: 20
                }
                type == 'add' ? scope.type = '新建' : scope.type = '修改';
                $('#'+mark).modal();
                if(scope.type == '修改'){
                    crfCustomizeServices.getCrfDetail(data.id).then(function (data) {
                        scope.submit = {
                            name: data.name,
                            value: data.value,
                            order: data.order,
                            crfId: data.id
                        }
                    })
                }
            }
            scope.changeOrder = function() {
                scope.disabled = false;
                if(scope.submit.order != ''){
                    var reg = new RegExp("^[0-9]*$","g");
                    if(!reg.test(scope.submit.order)){
                        scope.orderWarm = true;
                        scope.submit.order = '';
                    }else {
                        scope.orderWarm = false;
                    }
                }
            }
            //提交按钮disabled状态
            scope.change = function(){
                if(scope.submit.value == '' || scope.submit.value == undefined ||
                    scope.submit.name == '' || scope.submit.name == undefined
                ){
                    scope.disabled = true;
                    var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
                    if (reg.test(scope.submit.value)){
                        scope.valueWarm = true;
                        return false ;
                    }else{
                        scope.valueWarm = false;
                        return true;
                    }
                }else {
                    //校验编号不能有汉字
                    var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
                    if (reg.test(scope.submit.value)){
                        scope.valueWarm = true;
                        scope.submit.value = '';
                        scope.disabled = true;
                        return false ;
                    }else{
                        scope.valueWarm = false;
                        scope.disabled = false;
                        return true;
                    }
                }
            }
            scope.save = function(value,page){
                if(scope.submit.name != '' && scope.submit.name != undefined ||
                    scope.submit.value != '' && scope.submit.value != undefined
                ){
                    if(scope.type == '修改'){
                        crfCustomizeServices.modifyCrf(scope.submit.crfId,scope.submit).then(function (msg) {
                            if(msg.description == '数据请求成功') {
                                scope.modifyPrompt = '修改成功';
                                $('#modify-success').modal();
                                $timeout(function () {
                                    $('#modify-success').modal('hide');
                                },2000)
                            }
                            $('#addCrf').modal('hide');
                            if(page.number == 0) page.number=1;
                            crfCustomizeServices.getCrfList(page.number).then(function (data) {
                                scope.data = data.page.content;
                                scope.page = data.page;
                            });
                        });
                    }else if(scope.type == "新建"){
                        crfCustomizeServices.testValue(value).then(function (status) {
                            if(status == false) {
                                scope.valueWarmExit = true;
                                scope.submit.value = '';
                            }else {
                                scope.valueWarmExit = false;
                                crfCustomizeServices.saveCrf(scope.submit).then(function (msg) {
                                });
                                scope.submit = {
                                    name: '',
                                    value: '',
                                    order: ''
                                };
                            }
                        });
                    }

                }
            }

        }
    }
}]);
angular.module("infi-basic").directive('addModule',['crfCustomizeServices','SYS','$routeParams',function (crfCustomizeServices,$routeParams) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/addModule.html',
        link: function (scope) {
            scope.modulePage = {};
            scope.modulePage.number = 1;
            scope.modulePage.size = 10;
            scope.ThemePage = {};
            scope.ThemePage.number = 1;
            scope.ThemePage.size = 10;
            scope.basic = {};
            scope.basic.order = 30;
            scope.disabled = true;
            scope.combineData = [];
            scope.crfId = window.location.href.split('/')[6];
            scope.changeOrder = function(orderData){
                var reg = new RegExp("^[0-9]*$","g");
                if(!reg.test(orderData) && orderData != ''){
                    scope.orderWarm = true;
                    scope.basic.order = '';
                }else{
                    scope.orderWarm = false;
                }
            }
            scope.modal = function (data, mark, type, method, way, root) {

                scope.disabled = true;
                $('#'+mark).modal();
                //判断是新建还是修改
                way == 'add' ? scope.basic.way = '新建' : scope.basic.way = '修改';
                //添加模块、主题、子主题方式
                scope.method = method;

                scope.getModuleDataList('module');
                //获取CRF下边所有模块，进而获取组合id
                if(scope.basic.way == '新建'){
                    scope.basic.name = '';
                    scope.basic.value = '';
                    scope.basic.order = 30;
                    if(root == 'self') {
                        scope.basic.moduleDataList = '';
                        scope.basic.themeDataList = '';
                        scope.themeDataList = '';
                        scope.combineData = '';
                    }
                }

                scope.data = data;
                if(scope.basic.way == '修改') {
                    crfCustomizeServices.getSingleNode(scope.crfId,scope.data).then(function (data) {
                        scope.basic.name = data.name;
                        scope.basic.order = data.order;
                        scope.basic.combineId = data.combineId;
                        scope.basic.moduleDataList = data.parentId;
                    })
                }
                if(type == 'module'){
                    scope.basic.type = '模块';
                    crfCustomizeServices.getCombineId('MODULE',scope.crfId).then(function (data) {
                        scope.combineData = data;
                    });
                }else if(type == 'theme'){
                    scope.basic.type = '主题';
                    scope.combineData = '';
                    if(root == 'parent') {
                        crfCustomizeServices.getParentData(scope.crfId,scope.basic.moduleDataList,'MODULE').then(function (data) {
                            scope.moduleDataList = data;
                        });
                        scope.basic.moduleDataList = data.id;
                        //暂存模块的id
                        scope.tempModuleDataList = scope.basic.moduleDataList;
                        crfCustomizeServices.getParentData(scope.crfId,scope.basic.moduleDataList,'THEME').then(function (data) {
                            scope.combineData = data;
                        });
                    }
                    if(scope.basic.way == '修改'){
                        scope.oldData = {id: data.parentId};
                        crfCustomizeServices.getSingleNode(scope.crfId,scope.oldData).then(function (data) {
                            scope.basic.moduleDataList = data.id;
                            crfCustomizeServices.getParentData(scope.crfId,scope.basic.moduleDataList,'THEME').then(function (data) {
                                scope.combineData = data;
                            });
                        })
                    }
                }else if(type == 'sub_theme'){
                    scope.basic.type = '子主题';
                    if(scope.method == 'addSubTheme'){
                        if(scope.basic.way == '修改'){
                            scope.combineData = '';
                            scope.oldData = {id: data.parentId};
                            scope.basic.subThemeData = data.id;
                            crfCustomizeServices.getSingleNode(scope.crfId,scope.oldData).then(function (data) {
                                if(data.type.name == 'THEME') {
                                    scope.basic.themeDataList = data.id;
                                    scope.oldData = {id: data.parentId};
                                    crfCustomizeServices.getSingleNode(scope.crfId,scope.oldData).then(function (data) {
                                        if(data != null) {
                                            scope.basic.moduleDataList = data.id;
                                            crfCustomizeServices.getParentData(scope.crfId,scope.basic.moduleDataList,'THEME').then(function (data) {
                                                scope.themeDataList = data;
                                            });
                                            crfCustomizeServices.getCombineIdByParent(scope.crfId,scope.basic.themeDataList).then(function (data) {
                                                scope.combineData = data;
                                            });
                                        }
                                    })
                                }else if(data.type.name == 'MODULE'){
                                    scope.basic.themeDataList = null;
                                    scope.basic.moduleDataList = data.id;

                                }
                            })
                        }else if(scope.basic.way == '新建' && root == 'parent'){
                            scope.oldData = {id: data.parentId};
                            scope.basic.themeDataList = data.id;
                            crfCustomizeServices.getSingleNode(scope.crfId,scope.oldData).then(function (data) {
                                if(data != null){
                                    scope.basic.moduleDataList = data.id;
                                    crfCustomizeServices.getParentData(scope.crfId,scope.basic.moduleDataList,'THEME').then(function (data) {
                                        scope.themeDataList = data;
                                    });
                                    crfCustomizeServices.getCombineIdByParent(scope.crfId,scope.basic.themeDataList).then(function (data) {
                                        scope.combineData = data;
                                    });
                                }
                            })
                        }

                    }
                }else if(type == 'prototype'){
                    scope.basic.type = '属性';
                }
            }
            //提交按钮disabled状态
            scope.change = function(){
                if(scope.basic.way == '新建'){
                    if(scope.basic.name == '' || scope.basic.name == undefined
                    ){
                        scope.disabled = true;
                    }
                    if(scope.basic.value != '' && scope.basic.value != undefined){
                        //校验编号不能有汉字
                        var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
                        if (reg.test(scope.basic.value)){
                            scope.valueWarm = true;
                            scope.basic.value = '';
                            scope.disabled = true;
                            return false ;
                        }else{
                            scope.valueWarm = false;
                            scope.disabled = false;
                            return true;
                        }
                    }
                }else if(scope.basic.way == '修改') {
                    if(scope.basic.name == '' || scope.basic.name == undefined){
                        scope.disabled = true;
                    }else {
                        scope.disabled = false;
                        return true;
                    }
                }
            }
            scope.save = function(modulePage){
                if(scope.disabled == false){
                    if(scope.basic.type == '模块'){
                        if(scope.basic.way == '新建'){
                            crfCustomizeServices.createModule(scope.crfId, scope.basic,scope.basic.combineId).then(function () {
                                $('#addModule').modal('hide');
                                if(modulePage.number == 0) modulePage.number=1;
                                crfCustomizeServices.getModuleList(modulePage,scope.crfId).then(function (data) {
                                    if(data.page == null){
                                        scope.hasModule = true;
                                    }else {
                                        scope.hasModule = false;
                                        scope.moduleData = data.page.content;
                                        scope.modulePage = data.page;
                                        scope.modulePage.number +=1;
                                    }
                                });
                            });
                        }else if(scope.basic.way = '修改'){
                            crfCustomizeServices.modifyModule(scope.crfId, scope.basic,scope.basic.combineId,scope.data,scope.data.parentId,'MODULE').then(function () {
                                $('#addModule').modal('hide');
                                if(modulePage.number == 0) modulePage.number=1;
                                crfCustomizeServices.getModuleList(modulePage,scope.crfId).then(function (data) {
                                    if(data.page == null){
                                        scope.hasModule = true;
                                    }else {
                                        scope.hasModule = false;
                                        scope.moduleData = data.page.content;
                                        scope.modulePage = data.page;
                                        scope.modulePage.number +=1;
                                    }
                                });
                            });
                        }
                    }else if(scope.basic.type == '主题'){
                        if(scope.method == 'addTheme') {
                            if(scope.basic.way == '修改'){
                                crfCustomizeServices.modifyModule(scope.crfId, scope.basic,scope.basic.combineId,scope.data,scope.basic.moduleDataList,'THEME').then(function () {
                                    $('#addModule').modal('hide');
                                    if(modulePage.number == 0) modulePage.number=1;
                                    crfCustomizeServices.getThemeList(modulePage,scope.crfId).then(function (data) {
                                        if(data.page == null) {
                                            scope.hasTheme = true;
                                        }else {
                                            scope.hasTheme = false;
                                            scope.themeData = data.page.content;
                                            scope.themePage = data.page;
                                            scope.themePage.number +=1;
                                        }
                                    });
                                });
                            }else if(scope.basic.way == '新建') {
                                crfCustomizeServices.createTheme(scope.crfId,scope.basic.moduleDataList, scope.basic).then(function () {
                                    $('#addModule').modal('hide');
                                    if(modulePage.number == 0) modulePage.number=1;
                                    crfCustomizeServices.getThemeList(modulePage,scope.crfId).then(function (data) {

                                        if(data.page == null) {
                                            scope.hasTheme = true;
                                        }else {
                                            scope.hasTheme = false;
                                            scope.themeData = data.page.content;
                                            scope.themePage = data.page;
                                            scope.themePage.number +=1;
                                        }
                                    });
                                });
                            }
                        }else{
                            crfCustomizeServices.createTheme(scope.crfId,scope.data.id, scope.basic).then(function () {
                                $('#addModule').modal('hide');
                                if(modulePage.number == 0) modulePage.number=1;
                                crfCustomizeServices.getThemeList(modulePage,scope.crfId).then(function (data) {
                                    if(data.page == null) {
                                        scope.hasTheme = true;
                                    }else {
                                        scope.hasTheme = false;
                                        scope.themeData = data.page.content;
                                        scope.themePage = data.page;
                                        scope.themePage.number +=1;
                                    }
                                });
                            });
                        }
                    }else if(
                        scope.basic.type == '子主题'
                    ){
                        if(scope.method == 'addSubTheme'){
                            if(scope.basic.way == '修改'){
                                scope.basic.themeDataList == null ?  scope.basic.themeDataList = scope.basic.moduleDataList: '';
                                crfCustomizeServices.modifyModule(scope.crfId, scope.basic,scope.basic.combineId,scope.data,scope.basic.themeDataList,'SUB_THEME').then(function () {
                                    $('#addModule').modal('hide');
                                    if(modulePage.number == 0) modulePage.number=1;
                                    crfCustomizeServices.getSubThemeList(modulePage,scope.crfId).then(function (data) {
                                        if(data.page == null) {
                                            scope.hasSubTheme = true;
                                        }else {
                                            scope.hasSubTheme = false;
                                            scope.SubThemeData = data.page.content;
                                            scope.SubThemePage = data.page;
                                            scope.SubThemePage.number +=1;

                                        }
                                    });
                                });
                            }else if(scope.basic.way == '新建'){
                                scope.basic.themeDataList == '' || scope.basic.themeDataList == undefined ? scope.basic.themeDataList = scope.basic.moduleDataList: '';

                                crfCustomizeServices.createSubTheme(scope.crfId,scope.basic.themeDataList, scope.basic).then(function () {
                                    $('#addModule').modal('hide');
                                    if(modulePage.number == 0) modulePage.number=1;
                                    crfCustomizeServices.getSubThemeList(modulePage,scope.crfId).then(function (data) {
                                        if(data.page == null) {
                                            scope.hasSubTheme = true;
                                        }else {
                                            scope.hasSubTheme = false;
                                            scope.SubThemeData = data.page.content;
                                            scope.SubThemePage = data.page;
                                            scope.SubThemePage.number +=1;

                                        }
                                    });
                                });
                            }
                        }else{
                            crfCustomizeServices.createSubTheme(scope.crfId,scope.data.id, scope.basic).then(function () {
                                $('#addModule').modal('hide');
                                if(modulePage.number == 0) modulePage.number=1;
                                crfCustomizeServices.getSubThemeList(modulePage,scope.crfId).then(function (data) {
                                    if(data.page == null) {
                                        scope.hasSubTheme = true;
                                    }else {
                                        scope.hasSubTheme = false;
                                        scope.SubThemeData = data.page.content;
                                        scope.SubThemePage = data.page;
                                        scope.SubThemePage.number +=1;

                                    }
                                });
                            });
                        }
                    }
                    scope.basic = {
                        name: '',
                        value: '',
                        combineId: ''
                    };

                }
            }

            scope.getCombineIdByParent = function (parentId) {
                crfCustomizeServices.getCombineIdByParent(scope.crfId,parentId).then(function (data) {
                    scope.combineData = data;
                });
            }
            scope.getModuleDataList = function (type) {
                scope.moduleDataList = [];
                crfCustomizeServices.getCombineId(type,scope.crfId).then(function (data) {
                        scope.moduleDataList = data;
                });
            }
            scope.getThemeDataList = function (type) {
                scope.themeDataList = [];
                crfCustomizeServices.getCombineId(type,scope.crfId).then(function (data) {
                    scope.moduleDataList = data;
                });
            }

            scope.selectModule = function (parentId) {
                scope.basic.moduleDataList = scope.tempModuleDataList;
                scope.combineData = '';
                scope.disabled = false;
                if(parentId != null) {
                    scope.themeDataList = [];
                    scope.basic.moduleDataList = parentId;
                    crfCustomizeServices.getParentData(scope.crfId,parentId,'THEME').then(function (data) {
                        scope.themeDataList = data;
                    });
                    crfCustomizeServices.getParentData(scope.crfId,parentId,'THEME').then(function (data) {
                        if(scope.basic.type == '主题'){
                            scope.combineData = data;
                        }
                    });
                }
            }
            scope.selectTheme = function (parentId){
                scope.disabled = false;
                scope.combineData = '';
                if(parentId != null) {
                    crfCustomizeServices.getParentData(scope.crfId,parentId,'SUB_THEME').then(function (data) {
                        scope.combineData = data;
                    });
                }
            }
            scope.selectCombineId = function(){
                scope.disabled = false;
            }
        }


    }
}]);
angular.module("infi-basic").directive('crfPrompt',[function(){
    return {
        restrict: 'EA',
        template:
        '<div class="modal fade"  id="crf-prompt">' +
        '<div class="modal-dialog"> ' +
        '<div class="modal-content"> ' +
        '<div class="modal-header"> ' +
        '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> ' +
        '<h4 class="modal-title">提示</h4> ' +
        '</div> ' +
        '<div class="modal-body"> ' +
        '<p style="text-align: center">{{promptMainContent}}</p> ' +
        '</div>' +
        '<div class="modal-footer"> ' +
        '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button> ' +
        '<button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="deleteCrf()">确定</button>' +
        '</div> ' +
        '</div>' +
        '</div>' +
        '</div>',
        link:function(scope){

        }
    }
}])
    .directive('modifySuccess',function () {
        return {
            restrict: 'EA',
            template:
            '<div class="modal fade" id="modify-success"> ' +
            '<div class="modal-dialog"> ' +
            '<div class="modal-content"> ' +
            '<div class="modal-header"> ' +
            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> ' +
            '<h4 class="modal-title">提示</h4> ' +
            '</div> ' +
            '<div class="modal-body"> ' +
            '<p style="text-align: center">{{ modifyPrompt }}</p> ' +
            '</div> ' +
            '</div> ' +
            '</div> ' +
            '</div>'
        }
    })
angular.module("infi-basic").directive('addPropertySuccess',[function(){
    return {
        restrict: 'EA',
        template:
        '<div class="modal fade"  id="add-property-success">' +
        '<div class="modal-dialog"> ' +
        '<div class="modal-content"> ' +
        '<div class="modal-header"> ' +
        '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> ' +
        '<h4 class="modal-title">提示</h4> ' +
        '</div> ' +
        '<div class="modal-body"> ' +
        '<p style="text-align: center; font-size: 16px;">{{message}}</p> ' +
        '</div>' +
        '</div> ' +
        '</div>' +
        '</div>' +
        '</div>',
        link:function(scope){

        }
    }
}])
