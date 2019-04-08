angular.module("infi-basic").controller('SubjectListController',
    ['$scope','SYS','$http','$filter','subjectListService','subjectNewsService',function ($scope,SYS,$http,$filter,subjectListService,subjectNewsService) {
        $scope.mySubjectData = [];

        $scope.page = {};
        $scope.subjectNumber = 1;
        $scope.inviteNumber = 1;
        $scope.subjectStatus = 'all';
        $scope.notInvited = false;
        $scope.invited = false;
        $http.get('data/subject-list.json').success(function (data) {
            $scope.subjectStatusData = data.status;
        })

        $scope.changeStatus = function(){
            $scope.subjectNumber = 1;
            $scope.getSubjectList($scope.subjectNumber,$scope.subjectStatus);
        }
        $scope.getSubjectList = function(number,status){
            $scope.mySubjectData = {};
            subjectListService.getSubjectList(number,status).then(function (data) {
                if(data.status == SYS.STATUS_SUCCESS){
                    $scope.invited = false;
                    $scope.mySubjectData = data.page.content;
                    $scope.mySubjectPage = data.page;
                    $scope.mySubjectPage.number++;
                }else{
                    $scope.invited = true;
                }

            })
        }
        $scope.getInviteList = function(number){
            $scope.myInvitetData = {};
            subjectListService.getInviteList(number).then(function (data) {
                if(data.status == SYS.STATUS_SUCCESS){
                    $scope.notInvited = false;
                    $scope.myInvitetData = data.page.content;
                    $scope.myInvitetPage = data.page;
                    $scope.myInvitetPage.number ++;
                }else{
                    $scope.notInvited = true;
                }
            })
        }
        $scope.showNewsButton = false;
        $scope.init = function(){
            $scope.getSubjectList($scope.subjectNumber,$scope.subjectStatus);
            $scope.getInviteList($scope.inviteNumber);
            subjectNewsService.getSubjectNews($scope.userId).then(function (data) {
                if(data.status == SYS.STATUS_SUCCESS){
                    $scope.showNewsButton = true;
                }
            })
        }
        $scope.init();

        $scope.updatePageAttend = function (number) {
            $scope.getSubjectList(number,$scope.subjectStatus);
        }
        $scope.updatePageAttendInvite = function (number) {
            $scope.getInviteList(number);
        }


        $scope.modal = function (data) {
            $('#accept-invite').modal();
            $scope.modelContent = '课题名称: ' + data.name;
            $scope.modalTitle = '是否将该课题加入到我的课题中';
            $scope.subjectId = data.id;
        }
        $scope.acceptInvite = function () {
            $('#accept-invite').modal('hide');
            subjectListService.acceptInvite($scope.subjectId,$scope.userId).then(function (data) {
                if(data.data.status == SYS.STATUS_SUCCESS){
                    $scope.mySubjectData = {};
                    $scope.myInvitetData = {};
                    $scope.getSubjectList($scope.subjectNumber,$scope.subjectStatus);
                    $scope.getInviteList($scope.inviteNumber);
                }
            })
        }

        //跳转课题概况
        $scope.studyOverview = function (data) {
            location.href = '#/subject-overview/' + data.id;
        }
        $scope.subjectCreate = function () {
            subjectListService.subjectCreate().then(function (data) {
                if(data.status == SYS.STATUS_SUCCESS){
                    location.href =  '#/subject-create/' + data.data.id + '/' + data.data.flag;
                }
            })
        }

        //跳转待处理消息页面
        $scope.subjectNews = function () {
            location.href = '#/subject-news/';
        }

    }])

