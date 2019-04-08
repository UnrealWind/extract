angular.module('infi-basic')
    .controller('TaskExportController', ['$scope','TaskService','SYS','$routeParams','DataAdapter','$location','Utils',function ($scope,TaskService,SYS,$routeParams,DataAdapter,$location,Utils) {
        $scope.SYS = SYS;
        //用于显示左侧tab的数据
        $scope.summaryData = {};
        //用于显示点击某个名称出现的弹出框数据
        $scope.detailData = {
            id:$routeParams.groupId,  //点击的某个名称的id，通过id向后台查询详情
            type:$routeParams.type,  //标识是从导入页面还是逻辑配置页面进入
            recordPage:""  //用于盛放后台返回的原始数据
        };

        function init() {
            var subject = {subjectId:"",subjectGroupId:""};  //课题、模板id,目前没有使用
            TaskService.getSummaryList("export",subject).then(function (msg) {
                $scope.summaryData = msg;
            });
            TaskService.getInfoDetailData("export",subject).then(function (msg) {
                $scope.allData = msg;
            });
            // 从第二个页面返回第一个页面时，原先选中的仍然选中
            TaskService.getGroupData($scope.detailData.id).then(function (msg) {
                $scope.detailData.recordPage = msg;
                if(msg.status == SYS.STATUS_SUCCESS){
                    $scope.mappingData = msg.data.extractJson==null||msg.data.extractJson==""?[]:JSON.parse(msg.data.extractJson).data;
                }
            });
        }

        init();

        /**
         * 导出页面上一步保存筛选条件
         */
        $scope.saveExtract = function () {
            $scope.filterData = DataAdapter.convertSubmitFixData($scope.summaryData.data);
            TaskService.saveExtract($scope.detailData.id,$scope.filterData).then(function (msg) {
                if(msg.status == SYS.STATUS_SUCCESS){
                    $location.path("task-configuration/"+$scope.detailData.id)
                }else{
                    Utils.sysTip($scope,msg);  //保存不成功的错误提示
                }
            });
        }

        /**
         * 导出弹框的弹出
         */
        $scope.extract_export = function () {
            $scope.filterData = DataAdapter.convertSubmitFixData($scope.summaryData.data);
            $('#exportBox').modal({backdrop:'static'});
        }

        /**
         * 导出条件收藏弹框
         */
        $scope.collect_extract_record = function() {
            $scope.filterData = DataAdapter.convertSubmitFixData($scope.summaryData.data);
            $('#collectExport').modal({backdrop:'static'});
        }

        /**
         * 已收藏导出条件弹框
         */
        $scope.extract_record_collection = function() {
            $('#collectedExpRecList').modal({backdrop: 'static'});
            $scope.updatePage($scope.SYS.DEFAULT_PAGE_NUMBER);
        }



        /**
         * 控制页面切换header的显示效果
         * @type {number}
         */
        $scope.step = 3;
    }]);