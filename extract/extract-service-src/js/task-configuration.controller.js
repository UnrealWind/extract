angular.module('infi-basic')
    .controller('TaskConfigurationController', ['$scope','TaskService','SYS','$routeParams','TaskMapping','DataAdapter','$location','Utils',function ($scope,TaskService,SYS,$routeParams,TaskMapping,DataAdapter,$location,Utils) {
        $scope.SYS = SYS;
        $scope.groupData = {
            groupId:$routeParams.groupId,
            type:$routeParams.type,  //标示是否是规则选择的跳转
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
            setUrls();
            if($scope.groupData.type){  //type存在则是选择规则的条件选取
                $scope.headerData = [{name:'1.选择规则',step:1},{name:'2.筛选条件选取',step:2},{name:'3.筛选逻辑配置',step:3},{name:'4.推送结果选择',step:4}];
                $scope.col = "25%";
                $scope.step = 3;  //控制页面切换header的显示效果
            }else{
                $scope.headerData = [{name:'1.筛选条件选取',step:1},{name:'2.筛选逻辑配置',step:2},{name:'3.保存推荐科室',step:3}];
                $scope.col = "33.33%";
                $scope.step = 2;
            }
            /**
             * 获取页面显示的数据
             */
            TaskService.getGroupData($scope.groupUrl,$scope.groupData.groupId).then(function (msg) {
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
                    
                    //推荐任务保存json名称targetJson,创建规则保存json名称logicJson
                    var logicJson = $scope.groupData.type ? msg.data.targetJson:msg.data.logicJson;
                        $scope.groupData.logicData = logicJson==null||logicJson==""?DataAdapter.trasformScreenToLogic($scope.groupData.originalData):
                            DataAdapter.convertLogicJson($scope.groupData.originalData,JSON.parse(logicJson));

                    $scope.groupData.historyData = msg.data.screenRecord==null||msg.data.screenRecord==""?[]:JSON.parse(msg.data.screenRecord);
                    $scope.ruleDetail = msg.data.rule;

                    //加一个jquery自定义事件，防止没有数据就进行逻辑筛选右侧部分的html拼接
                    $(document).trigger('doConfig');
                }
            });
        }

        function setUrls() {
            $scope.groupUrl = $scope.groupData.type ? "pushTask/getPushTask/" : "rule/getRule/";  //获取保存的logicJson的url
            $scope.saveUrl = $scope.groupData.type ? "pushTask/saveLogic":"rule/saveLogic";  //保存接口链接
        }

        /**
         * 获取逻辑配置的统计图数据
         */
        $scope.changeChart = function (data) {
            $scope.groupData.logicData = data;
            if(!$scope.groupData.type){  //只有新建规则的时候才绘制图形
                TaskService.getChartData($scope.groupData.groupId,data,window.localStorage.getItem('sbuject')).then(function (msg) {
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
        }

        /**
         * 点击上一步、下一步保存逻辑配置数据
         * @param data 逻辑配置生成的json
         * @param page 跳转到上一页还是下一页
         */
        $scope.saveLogic = function (page) {
            var isHistory = $scope.groupData.historyData==null || $scope.groupData.historyData.length==0,
                isChart = $scope.groupData.chartData==null || $scope.groupData.chartData.length==0,
                isLogic = $scope.groupData.logicData==null || $scope.groupData.logicData.length==0;
            var postData = {};
            if($scope.groupData.type){
                postData = {
                    id:$scope.groupData.groupId,
                    targetJson:isLogic?"":JSON.stringify($scope.groupData.logicData),
                    target:isHistory?"":JSON.stringify($scope.groupData.historyData[0].historyLogic)
                }
            }else{
                postData = {
                    id:$scope.groupData.groupId,
                    logicJson:isLogic?"":JSON.stringify($scope.groupData.logicData),
                    screenRecord:isHistory?"":JSON.stringify($scope.groupData.historyData),
                    content:isHistory?"":JSON.stringify($scope.groupData.historyData[0].historyLogic),
                    results:isChart?"":JSON.stringify($scope.groupData.chartData),
                    recordNumber:isHistory?0:$scope.groupData.historyData[0].num
                }
            }
            TaskService.saveLogic($scope.saveUrl,postData).then(function (msg){
                if(msg.status == SYS.STATUS_SUCCESS){
                    $location.path(page+$scope.groupData.groupId);
                }else{
                    Utils.sysTip($scope,msg);  //保存不成功的错误提示
                }
            });
            //防止数据拼写dom的方法被绑定多次
            // $(document).unbind('doConfig');
        }
    }]);
