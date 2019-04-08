angular.module('infi-basic')
.directive('choserChart',function (){
    return {  //逻辑配置页面统计图的显示
        restrict: 'A',
        templateUrl: 'js/html/echart.html',
        replace: true,
        scope:{
            chartData:'='
        },
        link:function (scope) {
            //gqm_debug 设置的绘图数据的操作不放在scope.$on方法里面就不会执行，即使controller里面chartData数据改变
            scope.$on('domReady', function () {
                angular.forEach(scope.chartData,function (chart,idx) {
                    var myChart = echarts.init(document.getElementById('chart'+idx)),
                        option = chart.detail;
                    myChart.setOption(option);
                })
            })
        }
    }
})
.directive('uploadRecord',['TaskListService','SYS','Utils','Upload', function(TaskListService,SYS,Utils,Upload) {
    // 上传成果备案弹出框
    return {
        restrict: 'A',
        templateUrl: 'js/html/upload-record.html',
        replace: true,
        scope: {
            resultRecord: '=',
            entity: '=',
            btnCallback: '&btnCallback'
        },
        link: function(scope) {
            scope.downloadFile = TaskListService.downloadFile;
            
            scope.clear = function() {
                scope.resultRecord = {
                    descriptionOfResults: '',
                    allFileName: '',
                    allfilePath: '',
                    achievementId: null
                }

                scope.fileName = ''
                scope.fileDetail = {}
            }

            // 暂存文件名称和文件实例
            scope.fileName = ''
            scope.fileDetail = {}

            // 初始化清空表单
            scope.clear()

            

            // 文件上传
            scope.onFileSelect = function ($file) {
                scope.fileName = $file[0].name
                scope.resultRecord.allFileName = $file[0].name
                scope.fileDetail = $file[0]
                scope.resultRecord.achievementId = null
            }

            // 保存表单数据
            scope.saveRecord = function(id, resultRecord) {
                if (!resultRecord.descriptionOfResults) {
                    alert('请输入成果说明！')
                    return;
                }

                if (scope.fileName == "" || scope.resultRecord.allFileName =="") {
                    // TaskListService.saveDiscription(id, scope.resultRecord.descriptionOfResults)
                    Upload.upload({
                        url: SYS.url+'achievement/save/' + id + '/' + resultRecord.descriptionOfResults  + '/null',
                        method: 'POST',
                        file: ''
                    })
                } else {
                    Upload.upload({
                        url: SYS.url+'achievement/save/' + id + '/' + resultRecord.descriptionOfResults + '/' + scope.resultRecord.allFileName,
                        method: 'POST',
                        file: scope.fileDetail
                    })
                }
                $('#uploadBox').modal('hide');
            }
            // 文件下载
            scope.downloadFile = TaskListService.downloadFile;
        }
    }
}])
.directive('confirmExport',['TaskService','SYS','$timeout','Utils',function (TaskService,SYS,$timeout,Utils){
    return {  //导出弹出框的显示
        restrict: 'A',
        templateUrl: 'js/html/export.html',
        replace: true,
        scope:{
            exportData:"=",
            exportId:"="
        },
        link:function (scope) {
            //填写内容清空
            scope.clear = function(){
                scope.taskName="";
                scope.taskRemark="";
                scope.purpose="";
                scope.researchPlan = "";
            };
            scope.requireVali = false;
            scope.SYS = SYS;
            scope.clear();
            scope.confirmExport = function () {
                scope.preventClick = true;
                if (!(scope.taskName && scope.taskRemark && scope.purpose && scope.researchPlan)) {
                    scope.requireVali = true;
                    scope.preventClick = false;
                    return;
                }

                TaskService.creatTask({
                    group:{id:scope.exportId},
                    extractJson:(scope.exportData==null || scope.exportData.data.length==0)?"":JSON.stringify(scope.exportData.data),
                    taskName:scope.taskName,
                    taskRemark:scope.taskRemark,
                    tagNumber:(scope.exportData==null)?0:scope.exportData.num,
                    purpose: scope.purpose,
                    previewJson: '',
                    researchPlan: scope.researchPlan
                }).then(function (msg) {
                    if(msg.status == scope.SYS.STATUS_SUCCESS){
                        var tip = {
                            status:scope.SYS.STATUS_SUCCESS,
                            description:"任务导出成功"
                        }

                        var id = msg.data.id
                        
                        TaskService.previewTask(id)

                        Utils.sysTip(scope,tip);
                        $timeout(function () {
                            $('#exportBox').modal('hide');
                            scope.clear();  //导出成功后清空输入框
                            //必须设置延时，没有延时模态框外面的灰色背景去不掉
                            $timeout(function (){
                                window.location.href="#/view";
                            },500)
                        },1000);

                    }else{
                        Utils.sysTip(scope,msg); //数据没有导出成功后的提示
                    }
                })
            }
        }
    }
}])
.directive('collectLogic',['TaskService','SYS','$timeout','Utils',function (TaskService,SYS,$timeout,Utils){
    return {  //收藏筛选条件弹窗框的显示
        restrict: 'A',
        templateUrl: 'js/html/collect.html',
        replace: true,
        scope:{
            logicData:"=",
            screenData:"="
        },
        link:function (scope) {
            //填写内容清空
            scope.clear = function(){
                scope.collectName="";
                scope.collectRemark="";
            };
            scope.SYS = SYS;
            scope.clear();
            scope.confirmCollect = function () {
                TaskService.collectLogic({
                    screenJson:(scope.screenData==null || scope.screenData.length==0)?"":JSON.stringify(scope.screenData),
                    logicJson:(scope.logicData==null || scope.logicData.length==0)?"":JSON.stringify(scope.logicData),
                    name:scope.collectName,
                    remark:scope.collectRemark
                }).then(function (msg) {
                    if(msg.status == scope.SYS.STATUS_SUCCESS){
                        var tip = {
                            status:scope.SYS.STATUS_SUCCESS,
                            description:"收藏成功"
                        }
                        Utils.sysTip(scope,tip);
                        $timeout(function () {
                            $('#collectBox').modal('hide');
                            scope.clear();
                        },2500);
                    }else{
                        Utils.sysTip(scope,msg); //数据没有收藏成功后的提示
                    }
                })
            }
        }
    }
}])
.directive('collectedExpRecList', ['$rootScope', 'DataAdapter','TaskService','TaskInteractiveService','TaskMappingService','SYS','$timeout','Utils',function ($rootScope, DataAdapter,TaskService,TaskInteractiveService,TaskMappingService,SYS,$timeout,Utils){
    // 已收藏导出条件列表
    return {
        restrict: 'A',
        templateUrl: 'js/html/collect-exp-rec.html',
        replace: true,
        link: function(scope) {
            scope.SYS = SYS
            scope.content = [];
            scope.columns = [{label:"条件名称",name:"name"}];
            scope.opts = {label:"操作",
                btns:[{
                    label:"查看",
                    type:"detail"
                },{
                    label:"应用",
                    type:"apply"
                },{
                    label:"删除",
                    type:"delete"
                }]};
            
            scope.used = 'export'

            scope.updatePage = function (page) {
                TaskService.getExportList(page,SYS.DEFAULT_PAGE_SIZE).then(function (msg) {
                    scope.content = msg;
                });
            }

            scope.updatePage(scope.SYS.DEFAULT_PAGE_NUMBER)

            /**
             * 收藏的导出条件具体操作
             * @param entity  要操作的数据
             * @param type  判断进行什么操作
             */
            scope.optCollectList = function(entity, type) {
                if(type == "detail"){
                    TaskService.getExportRecordDetail(entity.id).then(function(msg) {
                        if(msg.status == scope.SYS.STATUS_SUCCESS){
                            // $(".node-outside").children().remove();
                            $("#collectedExpRecDetail").modal({backdrop: 'static'});
                            // 用于弹框回显
                            scope.colletionDetail = {
                                id:msg.data.id,
                                name: msg.data.name
                            };
                            
                            scope.mappingData = msg.data.extractJson==null||msg.data.extractJson==""?[]:JSON.parse(msg.data.extractJson);

                            var tmpConbineData = {
                                allData: angular.copy($rootScope.allDataOrg),
                                summaryData: angular.copy($rootScope.summaryDataOrg)
                            }

                            var recordHtml = null

                            TaskMappingService.taskRollbackMapping(tmpConbineData.allData,scope.mappingData,scope.used);

                            //左侧数据与右侧弹出数据合并
                            TaskInteractiveService.setCompleteData(tmpConbineData.summaryData, tmpConbineData.allData);

                            recordHtml = TaskInteractiveService.setExportRecord(tmpConbineData.summaryData, true);

                            $('#collectedExpRecDetail .node-outside').html(recordHtml)

                            // 释放 tmpConbineData 临时数据
                            tmpConbineData = null
                            
                        } else{
                            Utils.sysTip(scope,msg);
                        }
                    })
                } else if(type == "apply"){
                    TaskService.getExportRecordDetail(entity.id).then(function(msg) {
                        if(msg.status == scope.SYS.STATUS_SUCCESS){

                            scope.mappingData = msg.data.extractJson==null||msg.data.extractJson==""?[]:JSON.parse(msg.data.extractJson);
                            
                            if(scope.mappingData){
                                angular.forEach(scope.summaryData.data,function (summary) {
                                    angular.forEach(summary.options,function (options) {
                                        angular.forEach(options.children,function (option) {
                                            option.$checked = false;
                                        })
                                    })
                                });

                                TaskMappingService.taskRollbackMapping(scope.allData.data,scope.mappingData,scope.used);
                            }
                            //导出页面提取记录使用js拼接,所以要动态调用方法
                            if(scope.used == 'export'){
                                TaskInteractiveService.setExportRecord(scope.summaryData.data);
                            }

                            var tip = {
                                status:scope.SYS.STATUS_SUCCESS,
                                description:"应用成功!"
                            };
                            Utils.sysTip(scope,tip, function() {
                                $('#collectedExpRecDetail').modal('hide');
                                $('#collectedExpRecList').modal('hide');
                            });


                        } else{
                            Utils.sysTip(scope,msg);
                        }
                    })
                } else if(type == "delete"){
                    TaskService.deleteExportRecord(entity.id).then(function(msg) {
                        if(msg.status == scope.SYS.STATUS_SUCCESS){
                            $('#collectedExpRecDetail').modal('hide');
                            var tip = {
                                status:scope.SYS.STATUS_SUCCESS,
                                description:"删除成功"
                            };
                            Utils.sysTip(scope,tip);
                            $timeout(function (){
                                scope.updatePage(SYS.DEFAULT_PAGE_NUMBER);
                            },2500)
                        }
                    })
                }
            }
        }
    }
}])
.directive('collectExpDetail',[function () {
    return {  //已收藏的导出条件详情
        restrict: 'A',
        templateUrl: 'js/html/collect-exp-detail.html',
        replace: true,
        link: function (scope) {}
    }
}])
.directive('collectExportRecord',['TaskService','SYS','$timeout','Utils',function (TaskService,SYS,$timeout,Utils){
    return {  //收藏导出条件弹窗框的显示
        restrict: 'A',
        templateUrl: 'js/html/collect-export.html',
        replace: true,
        scope:{
            exportData:"=",
            exportId:"="
        },
        link:function (scope) {
            //填写内容清空
            scope.clear = function(){
                scope.collectName="";
                scope.collectRemark="";
            };
            scope.prompt = '保存'
            scope.SYS = SYS;
            scope.clear();
            scope.confirmExport = function () {
                scope.prompt = '保存中...'
                TaskService.exportExtract({
                    name: scope.collectName,
                    remake: scope.collectRemark,
                    extractJson: (scope.exportData==null || scope.exportData.data.length==0)?"":JSON.stringify(scope.exportData.data)
                }).then(function(msg) {
                    if(msg.status == scope.SYS.STATUS_SUCCESS){
                        var tip = {
                            status:scope.SYS.STATUS_SUCCESS,
                            description:"收藏成功"
                        }


                        Utils.sysTip(scope,tip);
                        $timeout(function () {
                            $('#collectExport').modal('hide');
                            scope.prompt = '保存'
                            scope.clear();
                        },2500);
                    }else{
                        Utils.sysTip(scope,msg); //数据没有收藏成功后的提示
                    }
                })
            }
        }
    }
}])
.directive('logicHistory',[function () {
   return {  //逻辑配置页面历史记录的显示
       restrict:'A',
       templateUrl:'js/html/logic-history.html',
       replace:true
   }     
}])
.directive('viewTable',[function(){
    return {  //取数列表页面表格的显示
        restrict: 'A',
        templateUrl: 'js/html/view-table.html',
        scope:{
            columns:'=columns',
            content:'=content',
            updatePage:'&updatePage',
            btnCallback: '&btnCallback'
        },
        link:function($scope){
            $scope.$watch('columns',function(){
                updateValue($scope.columns,$scope.content);
            });
            $scope.$watch('content',function(){
                updateValue($scope.columns,$scope.content);
            });

            function updateValue(columns,content) {
                $scope.$columns = angular.copy(columns);
                $scope.$content = [];
                $scope.$hasData = true;
                if( content && content.page ){
                    angular.forEach(content.page.content,function (entity) {
                        var data = {
                            plain: [],
                            original: entity
                        };
                        angular.forEach(columns,function (column) {
                            //这种情况是不需要维表转义，后台直接提供中文
                            data.plain.push({label:entity[column.name]});
                        });
                        $scope.$content.push(data);
                        $scope.$content.totalElements = content.page.totalElements;
                        $scope.$content.totalPages = content.page.totalPages;
                        $scope.$content.number = content.page.number;
                        $scope.$content.size = content.page.size;
                    })
                } else {
                    $scope.$hasData = false;
                    $scope.$description = content&&content.description ? content.description : '暂无数据';
                    $scope.$columnSize = $scope.opts ? columns.length+1 :columns.length;
                }
            }
        }
    }
}])
.directive('previewExport', ['$routeParams','TaskListService','SYS', function($routeParams,TaskListService, SYS) {
    return { // 预览导出结果弹窗
        restrict: 'A',
        templateUrl: 'js/html/preview-export.html',
        replace: true,
        scope: {},
        link: function(scope) {
            TaskListService.previewExport($routeParams.taskId).then(function(msg) {
                if(msg.status == SYS.STATUS_SUCCESS){
                    if (msg.data.previewJson) {
                        scope.preview = JSON.parse(msg.data.previewJson)
                        scope.hasPreview = true
                    } else {
                        scope.preview = "正在数据提取中，稍后尝试点击预览"
                        scope.hasPreview = false
                    }
                }
            })
        }
    }
}])
.directive('collectionRecord',['TaskService','TaskInteractiveService','SYS','$location','$timeout','Utils','TaskMappingService','TaskPopupConvertService',function (TaskService,TaskInteractiveService,SYS,$location,$timeout,Utils,TaskMappingService,TaskPopupConvertService) {
    return {  //收藏的筛选条件列表
        restrict: 'A',
        templateUrl: 'js/html/collection-record.html',
        replace: true,
        link: function (scope) {
            scope.content = [];
            scope.columns = [{label:"筛选姓名",name:"name"}];
            scope.opts = {label:"操作",
                btns:[{
                    label:"详情",
                    type:"detail"
                },{
                    label:"应用",
                    type:"apply"
                },{
                    label:"删除",
                    type:"delete"
                }]};

            scope.updatePage = function (page) {
                TaskService.getCollectionList(page,SYS.DEFAULT_PAGE_SIZE).then(function (msg) {
                    scope.content = msg;
                });
            }

            /**
             * 收藏的筛选条件列表的几个操作
             * @param entity  要操作的数据
             * @param type  判断进行什么操作
             */
            scope.optCollectList = function (entity,type) {
                if(type == "detail"){
                    TaskService.getGroupData(entity.id).then(function (msg) {
                        if(msg.status == scope.SYS.STATUS_SUCCESS){
                            $(".node-outside").children().remove();  //需要将逻辑配置详情容器清空，否则会造成显示重复
                            $("#collectionDetail").modal({backdrop: 'static'});
                            scope.colletionDetail = {
                                id:msg.data.id,
                                name:msg.data.name,
                                screenJson : msg.data.screenJson==null||msg.data.screenJson==""?[]:JSON.parse(msg.data.screenJson),
                                logicJson:msg.data.logicJson==null||msg.data.logicJson==""?[]:JSON.parse(msg.data.logicJson)
                            };

                            $(document).trigger('doCollect');
                        }else{
                            Utils.sysTip(scope,msg);
                        }
                    });
                }else if(type == "apply"){
                    var groupId = scope.detailData.id?scope.detailData.id:-1;
                    TaskService.applyGroup(groupId,entity.id).then(function (msg) {
                        if(msg.status == SYS.STATUS_SUCCESS){
                            $('#infi-collection').modal('hide');
                            $('#collectionDetail').modal('hide');
                            if(groupId != -1){
                                //应用已收藏的筛选条件，此时有group的id则直接将screenJson进行修改
                                angular.forEach(scope.summaryData.data,function (summary) {
                                    angular.forEach(summary.options,function (options) {
                                        angular.forEach(options.children,function (option) {
                                            option.$checked = false;
                                            TaskPopupConvertService.optChildNode(option,"all");
                                        })
                                    })
                                });
                                scope.detailData.originalData = msg.data.screenJson==null||msg.data.screenJson==""?[]:JSON.parse(msg.data.screenJson);
                                TaskMappingService.taskRollbackMapping(scope.allData.data,scope.detailData.originalData,"screen");
                            }else{
                                //应用已收藏的筛选条件，此时无group的id则将收藏的筛选；条件保存为一个新的group，并打开新的group
                                $timeout(function (){
                                    $location.path("task/"+msg.data.id);
                                },500)
                            }
                        }else{
                            Utils.sysTip(scope,msg);
                        }
                    });
                }else if(type == "delete"){
                    TaskService.deleteCollection(entity.id).then(function (msg) {
                        if(msg.status == scope.SYS.STATUS_SUCCESS){
                            $('#collectionDetail').modal('hide');
                            var tip = {
                                status:scope.SYS.STATUS_SUCCESS,
                                description:"删除成功"
                            };
                            Utils.sysTip(scope,tip);
                            $timeout(function (){
                                scope.updatePage(SYS.DEFAULT_PAGE_NUMBER);
                            },2500)
                        }
                    });
                }
            }
        }
    }
}])
.directive('collectionDetail',[function () {
    return {  //收藏的筛选条件详情
        restrict: 'A',
        templateUrl: 'js/html/collection-detail.html',
        replace: true,
        link: function (scope) {}
    }
}])
.directive('deleteTip',['ConfigureService','SYS','Utils',function (ConfigureService,SYS,Utils) {
    return {
        restrict: 'A',
        templateUrl: 'js/html/delete-tip.html',
        scope: {
            deleteId:"=",
            type:"=",
            type1:"=",
            init:"&"
        },
        replace: true,
        link: function (scope) {
            //确认删除方法
            scope.confirmDelete = function () {
                ConfigureService.deleteDetail({
                    type:scope.type,
                    type1:scope.type1,
                    id:scope.deleteId
                }).then(function (msg) {
                    if(msg.status == SYS.STATUS_SUCCESS){
                        msg.description = "删除成功"
                        Utils.sysTip(scope,msg);
                        $('#deleteTip').modal('hide');
                        scope.init();
                    }else{
                        Utils.sysTip(scope,msg);
                    }
                });
            }
        }
    }
}])
.directive('showLoadTip',["Utils","$timeout",function (Utils,$timeout) {
    //条件选取页面内容没加载完全给个遮罩
    return{
        restrict:'A',
        replace:true,
        template:'<div class="infi-mask"><img class="infi-load-img" ng-src="/src/image/loading.gif" /></div>',
        link:function (scope) {
            $timeout(function () {
                if(!scope.summaryData.showLoad){
                    var tip = {
                        status:"error",
                        description:"系统繁忙，稍后重试"
                    }
                    scope.summaryData.showLoad = true;
                    Utils.sysTip(scope,tip);  //保存不成功的错误提示
                }
            },1000*60*2)
        }
    }
}])
//这个directive用于监听历史信息是否渲染完毕
.directive('repeatHistoryFinish',['$timeout',function($timeout){
    return {
        restrict: 'ECMA',
        link:function(scope,element,attrs){
             if(scope.$last == true){
                $timeout(function() {
                    scope.$emit( 'renderOverHistory');
                });
            }
        }
    }
}])