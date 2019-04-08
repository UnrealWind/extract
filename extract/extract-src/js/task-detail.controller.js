angular.module('infi-basic')
    .controller('TaskDetailController', ['$scope','TaskService','TaskOperationService','SYS','ViewMapping','$routeParams','$location','Utils', 'TaskListService', function ($scope,TaskService,TaskOperationService,SYS,ViewMapping,$routeParams,$location,Utils, TaskListService) {
        $scope.SYS = SYS;
        $scope.recordData = {
            taskId:$routeParams.taskId,
            viewType:$routeParams.viewType,  //标识是详情页还是审核页
            kpi:null,  //盛放kpi数据
            screenData:[],  //盛放条件选取数据
            extractData:[],  //盛放导出属性数据
            screenRecord:[],  //盛放逻辑配置记录数据
            excelData:null,
            allData:null  //盛放返回的所有数据
        }


        // 盛放任务名称、任务背景、研究目的、成果说明
        $scope.taskDetail = {
            groupId: '',
            taskName: '',    // 任务名称
            taskRemark: '',      // 任务背景
            purpose: ''　 // 研究目的
        }

        //　盛放成果说明相关
        $scope.resultDesc = {
            descriptionOfResults: '',
            allFileName: '',
            allfilePath: '',
            achievementId: null
        }

        //盛放审核页面的审核审核原因和审核结果
        $scope.taskCheck = {
            checkMask: "",
            checkReason:"",
            checkResult:""
        }
        function init() {
            //获取kpi的数据
            TaskOperationService.getTaskViewKpi($scope.recordData.taskId).then(function (msg) {
                $scope.recordData.kpi = msg;
            });

            // 获取任务详情，请求任务名称、任务背景、研究方案和研究目的
            TaskOperationService.getTaskDetail($scope.recordData.taskId).then(function(msg) {
                $scope.taskDetail = {
                    groupId: msg.data.group.id || '',
                    taskName: msg.data.taskName || '',
                    taskRemark: msg.data.taskRemark　|| '',
                    purpose: msg.data.purpose　|| '',
                    researchPlan: msg.data.researchPlan || '',
                    failedDatas: {
                        data: JSON.parse(msg.data.group.uploadedExcel.previewJson)
                    }
                }

            })

            // 获取成果说明
            TaskOperationService.getResult($scope.recordData.taskId).then(function(msg) {
                if (msg.data) {
                    $scope.resultRecord = {
                        descriptionOfResults: msg.data.descriptionOfResults,
                        allFileName: msg.data.allFileName,
                        allfilePath: msg.data.allfilePath,
                        achievementId: msg.data.id
                    }
                 }
            })

            //获得task的数据
            TaskOperationService.getTaskView($scope.recordData.taskId).then(function (msg){
                $scope.recordData.allData = msg.data;
                if(msg.data&&msg.data.group){
                    var group = msg.data.group;
                    if(group.extractJson&&group.extractJson!=""){
                        $scope.recordData.extractData = ViewMapping.getExtractCondition(JSON.parse(group.extractJson));
                    }
                    //由筛选导出的病例
                    if(msg.data.group.soureType == "FILTER"){
                        if(group.screenJson&&group.screenJson!=""){
                            $scope.recordData.screenData = ViewMapping.getScreeniCondition(JSON.parse(group.screenJson));
                        }
                        $scope.recordData.screenRecord =group.screenRecord == null || group.screenRecord == ""?[]:JSON.parse(group.screenRecord);
                    }

                    //由导入excel导出的病例
                    if(group.uploadedExcel){
                        $scope.recordData.excelData = group.uploadedExcel;
                        if(group.uploadedExcel.path){
                            var path = group.uploadedExcel.path.split('/');
                            $scope.recordData.excelData.$excelName = path[path.length-1];
                        }
                    }
                }
            });
        }

        init();

        $scope.downloadFile = TaskListService.downloadFile;

        $scope.export_failed =function() {
            TaskService.export_failed($scope.taskDetail.groupId)
        }

        //审核页面的审核任务提交
        $scope.checkTask = function () {
            var subject = {subjectId:"",subjectGroupId:""};  //课题、模板id,目前没有使用
            TaskOperationService.checkTask($scope.recordData.taskId,$scope.taskCheck,subject).then(function (msg) {
                //审核成功跳转到审核列表页面
                if(msg.status == $scope.SYS.STATUS_SUCCESS){
                    $location.path("audit");
                }else{
                    Utils.sysTip($scope,msg);  //保存不成功的错误提示
                }
            });
        }
    }]);