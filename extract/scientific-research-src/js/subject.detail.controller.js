
angular.module("infi-basic").controller('SubjectDetailController',
    ['$scope','SYS','$http','subjectDetailService','$routeParams','$timeout',
    function ($scope,SYS,$http,subjectDetailService,$routeParams,$timeout) {

        //初始化一下所有分组信息
        $scope.groups = [];
        //新增的CRF模板列表内容
        $scope.targetTemplateList = false;
        //目标分组
        $scope.targetGroup = false;
        //任务分配列表顺便控制开关
        $scope.missionShow = false;
        //邀请时间选择控制开关
        $scope.interviewTimeShow = false;

        var getSubjectGroup = function () {

            subjectDetailService.getSubjectGroup($routeParams.subjectId).then(function (msg) {
                msg.data?$scope.groups = msg.data:'';
            });
            //获取基本信息
            subjectDetailService.getSubjectInfo($routeParams.subjectId).then(function (data) {
                $scope.subjectName = data.data.name
            })
        };

        (function init(){
            getSubjectGroup();
        })();

        $scope.choseCRF = function (opt) {
            $scope.targetTemplateList = false;
            $timeout(function () {
                $scope.targetTemplateList = opt;
            },0);
        };

        $scope.choseTemplateShow = function (group,targetShow) {
            $scope.targetGroup = false;
            $scope.missionShow = false;
            $scope.interviewTimeShow = false;
            $timeout(function () {
                $scope.targetGroup = group;
                $scope[targetShow] = true;
            },0);
        };

        $scope.addNewCRF = function (opts,type,typeId) {
            subjectDetailService.pushNullSubjectPlan(opts,type,typeId)
        };

        $scope.addNewGroup = function () {
            subjectDetailService.addNewGroup($scope.groups,$routeParams);
        };

        $scope.deleteGroup = function (index) {
            subjectDetailService.deleteGroup($scope.groups,index,$routeParams.subjectId);
        };

        $scope.saveGroup = function () {
            $scope.saveBtn.changeState('save');
            subjectDetailService.saveGroup($scope.groups,$routeParams.subjectId,$scope.saveBtn.changeState)
        };

        $scope.prev = function () {
            window.location.href = '#/subject-member/'+'new/'+$routeParams.subjectId;
        }

        // 保存按钮状态管理
        $scope.saveBtn = {
            currState: 'init',
            stateMachine: {                                     // 获取初始数据的状态机
                'init': {
                    save: 'saving'
                },
                'saving': {
                    success: 'init',
                    failure: 'init'
                },
            },
            changeState: function(name) {                       // 修改状态
                var state = $scope.saveBtn.currState

                if($scope.saveBtn.stateMachine[state][name]) {
                    $scope.saveBtn.currState = $scope.saveBtn.stateMachine[state][name]
                }
            }
        }

}])

