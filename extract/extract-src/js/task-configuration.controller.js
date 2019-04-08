angular.module('infi-basic')
    .controller('TaskConfigurationController', ['$scope','TaskService','SYS','$routeParams','TaskMapping','DataAdapter','$location','Utils',function ($scope,TaskService,SYS,$routeParams,TaskMapping,DataAdapter,$location,Utils) {
        $scope.SYS = SYS;
        $scope.groupData = {
            groupId:$routeParams.groupId,
            logicData:null,  //用于显示右侧配置完整的数据
            originalData:null,  //用于盛放左侧待选项数据
            historyData:null, //用于盛放筛选历史记录
            chartData:null,  //用于盛放绘图的数据
            allData:null,  //用于盛放所有的返回数据
            caseNumber:""  //用于盛放筛选到的病例数
        }
        /**
         * 页面初始化
         */
        init();
        function init(){
            /**
             * 获取页面显示的数据
             */
            TaskService.getGroupData($scope.groupData.groupId).then(function (msg) {
                $scope.groupData.allData = msg;
                if(msg.status == $scope.SYS.STATUS_SUCCESS){
                    //将左侧数据中有前置条件的将前置条件放到label里
                    var original = msg.data.screenJson==null||msg.data.screenJson==""?[]:JSON.parse(msg.data.screenJson);
                    //screenJson在此页面会调整成页面需要显示的形式,收藏的时候screenJson需要保存.需要原始的数据格式
                    $scope.groupData.originalDataCopy = $.extend(true,[],original);
                    if(original.length > 0){
                        $scope.groupData.originalData = DataAdapter.converLogicContext(original);
                    }else{
                        $scope.groupData.originalData = original;
                    }
                    var logicJson = $scope.groupData.type ? msg.data.targetJson:msg.data.logicJson;
                    $scope.groupData.logicData = logicJson ==null||logicJson ==""?DataAdapter.trasformScreenToLogic($scope.groupData.originalData):
                        DataAdapter.convertLogicJson($scope.groupData.originalData,JSON.parse(msg.data.logicJson));
                    $scope.groupData.historyData = msg.data.screenRecord==null||msg.data.screenRecord==""?[]:JSON.parse(msg.data.screenRecord);
                    //加一个jquery自定义事件，防止没有数据就进行逻辑筛选右侧部分的html拼接
                    $(document).trigger('doConfig');
                }
            });
        }

        /**
         * 获取逻辑配置的统计图数据
         */
        $scope.changeChart = function (data) {
            var subject = {subjectId:"",subjectGroupId:""};  //课题、模板id,目前没有使用
            $scope.groupData.logicData = data;
            TaskService.getChartData($scope.groupData.groupId,data,subject).then(function (msg) {
                if(msg.data == null || msg.data == "" || msg.data.length == 0){
                    $scope.groupData.chartData=null;
                    $scope.caseNumber = 0;
                    if($scope.groupData.historyData.length>0){
                        $scope.groupData.historyData[0].num = 0;
                    }
                }else{
                    $scope.groupData.chartData = TaskMapping.chartMapping(msg.data);
                    $scope.caseNumber = msg.data.number;
                    if($scope.groupData.historyData.length>0){
                        $scope.groupData.historyData[0].num = msg.data.number;
                    }
                }
            });
        }

        /**
         * 点击上一步、下一步保存逻辑配置数据
         * @param data 逻辑配置生成的json
         * @param page 跳转到上一页还是下一页
         */
        $scope.saveLogic = function (data,page) {
            $scope.groupData.logicData = data;
            TaskService.saveLogic($scope.groupData.groupId,data,$scope.groupData.historyData).then(function (msg){
                if(msg.status == SYS.STATUS_SUCCESS){
                    $location.path(page+$scope.groupData.groupId);
                }else{
                    Utils.sysTip($scope,msg);  //保存不成功的错误提示
                }
            });
            //防止数据拼写dom的方法被绑定多次
            // $(document).unbind('doConfig');
        }

        /**
         * 导出页面显示
         */
        $scope.directExport = function () {
            $('#exportBox').modal({backdrop:'static'});
        }

        /**
         * 收藏页面显示
         */
        $scope.collectLogic = function () {
            $('#collectBox').modal({backdrop:'static'});
        }

        /**
         * 控制页面切换header的显示效果
         * @type {number}
         */
        $scope.step = 2;
        $scope.extract_collection = function(){
            $('#infi-collection').modal({backdrop: 'static'});
        }
        
    }]);
