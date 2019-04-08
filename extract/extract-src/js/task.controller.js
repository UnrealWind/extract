angular.module('infi-basic')
    .controller('TaskController', ['$scope','TaskService','SYS','DataAdapter','$location','$routeParams','Utils',function ($scope,TaskService,SYS,DataAdapter,$location,$routeParams,Utils) {
        $scope.SYS = SYS;
        //用于显示左侧tab的数据
        $scope.summaryData = null;
        //用于显示右侧性别、年龄等信息
        $scope.allData = null;

        $scope.detailData = {
            id:$routeParams.groupId,  //保存时向后台传递的id
            recordPage:{}  //用于盛放后台返回的原始数据
        };

        //已收藏的筛选记录列表
        $scope.collectionList = [];

        function init() {
            var subject = {subjectId:"",subjectGroupId:""};  //课题、模板id,目前没有使用

            //提取页面参数为filter
            TaskService.getSummaryList("filter",subject).then(function (msg) {
                $scope.summaryData = msg;
            });
            TaskService.getInfoDetailData("filter",subject).then(function (msg) {
                $scope.allData = msg;
            });
            if($scope.detailData.id){
                // 从第二个页面返回第一个页面时，原先选中的仍然选中
                TaskService.getGroupData($scope.detailData.id).then(function (msg) {
                    $scope.detailData.recordPage = msg;
                    if(msg.status == SYS.STATUS_SUCCESS){
                        $scope.mappingData = msg.data.screenJson==null||msg.data.screenJson==""?[]:JSON.parse(msg.data.screenJson)
                    }
                });
            }
        }

        init();

        /**
         * 去逻辑配置页面保存选取的数据
         */
        $scope.getTransmitData = function () {
            $scope.filterData = DataAdapter.convertSubmitData($scope.summaryData.data);
            // 保存筛选的数据
            TaskService.saveFilterData($scope.detailData.id,$scope.filterData).then(function (msg){
                if(msg.status == SYS.STATUS_SUCCESS){
                    $scope.detailData.id = msg.data.id;
                    $location.path("task-configuration/"+$scope.detailData.id);
                }else{
                    Utils.sysTip($scope,msg);  //保存不成功的错误提示
                }
            });
        }

        /**
         *进入excel导入方式
         */
        $scope.excelImport = function () {
            TaskService.createImportGroup().then(function (msg){
                if(msg.status == SYS.STATUS_SUCCESS){
                    $location.path("excel-import/"+msg.data.id);
                }else{
                    Utils.sysTip($scope,msg);
                }
            });
        }

        /**
         * 显示已经收藏的筛选条件
         */
        $scope.extract_collection = function(){
            $('#infi-collection').modal({backdrop: 'static'});
            $scope.updatePage($scope.SYS.DEFAULT_PAGE_NUMBER);
        }

        /**
         * 控制页面切换header的显示效果
         * @type {number}
         */
        $scope.step = 1;
    }]);