angular.module('infi-basic')
    .controller('RuleDetailController', ['$scope','TaskService','SYS','ViewMapping','$routeParams','$location','Utils',function ($scope,TaskService,SYS,ViewMapping,$routeParams,$location,Utils) {
        $scope.SYS = SYS;
        $scope.ruleId = $routeParams.id;
        $scope.viewType = $routeParams.viewType;  //标识是审核还是查看
        //盛放审核页面的审核审核原因和审核结果
        $scope.taskCheck = {
            checkReason:"",
            checkResult:""
        }

        // init();

        //审核页面的审核任务提交
        $scope.checkTask = function () {
            TaskOperationService.checkTask($scope.ruleId,$scope.taskCheck,window.localStorage.getItem('sbuject')).then(function (msg) {
                //审核成功跳转到审核列表页面
                if(msg.status == $scope.SYS.STATUS_SUCCESS){
                    // $location.path("audit");
                }else{
                    Utils.sysTip($scope,msg);  //保存不成功的错误提示
                }
            });
        }
    }]);