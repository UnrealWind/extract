angular.module('infi-basic')
    .controller('ResultRuleController', ['$scope','$routeParams','TaskService','SYS','$location','Utils','$timeout',function ($scope,$routeParams,TaskService,SYS,$location,Utils,$timeout) {
        $scope.SYS = SYS;
        $scope.groupId = $routeParams.groupId;  //再次筛选的推荐任务id
        $scope.impId = $routeParams.impId;   //执行结果id
        $scope.type = $routeParams.type;  //标示是推荐任务结果还是执行任务详情
        $scope.optType = $routeParams.optType;  //标识是可编辑还是展示
        function init() {
            if($scope.type == "recommend"){  //选择推送结果显示导航
                $scope.headerData = [{name:'1.选择规则',step:1},{name:'2.筛选条件选取',step:2},{name:'3.筛选逻辑配置',step:3},{name:'4.推送结果选择',step:4}];
                $scope.col = "25%";
                $scope.step = 4;  //控制页面切换header的显示效果
            }else if($scope.type == "implement"){  //执行任务执行结果显示kpi
                TaskService.getPushTaskKpi($scope.impId).then(function (msg) {
                    $scope.kpi = msg;
                })
            }
        }

        TaskService.getGroupData('pushTask/getPushTask/',$scope.groupId).then(function (msg) {
            $scope.recordData = msg.data;
            if(msg.status == SYS.STATUS_SUCCESS){
                $scope.target = JSON.parse(msg.data.target);
                $scope.ruleDetail = msg.data.rule;
            }else{
                $scope.ruleDetail = {};
            }
        });
        
        init();

        $scope.saveResult = function () {
            $scope.recordData.time = "12点,20点";
            $scope.recordData.users = [{
                user:"本系统",
                content:"患者列表"
            },{
                way:"微信公众号",
                content:"您好，根据您的检验检查结果，通过智能分析，推荐您还可以到以下几个科室进行挂号就诊：心内科、肾内科、内分泌科等"
            }];
            TaskService.savePushTask($scope.recordData).then(function (msg) {
                if(msg.status == SYS.STATUS_SUCCESS){
                    var tip = {
                        status:$scope.SYS.STATUS_SUCCESS,
                        description:"推荐任务保存成功"
                    }
                    Utils.sysTip($scope,tip);
                    $timeout(function () {
                        //必须设置延时，没有延时模态框外面的灰色背景去不掉
                        $timeout(function (){
                            $location.path('recommend-list');
                        },500)
                    },1000);
                }else{
                    Utils.sysTip($scope,msg); //数据没有导出成功后的提示
                }
            });
        }
    }]);