angular.module("infi-basic").controller('SubjectCreateController',
    ['$scope','SYS','$http','$routeParams','subjectCreateService',function ($scope,SYS,$http,$routeParams,subjectCreateService) {
        //页面下拉框多选数据
        $scope.basic = {};
        $http.get('data/subject-create.json').success(function (data) {
            $scope.basic = data.basic;
            $scope.visible = data.visible;
            $scope.center = data.center;
            $scope.type = data.type;
            $scope.level = data.level;
        });
        //获取科室
        subjectCreateService.getDepartmentsData().then(function (data) {
            $scope.subjectOffices = data.data.data;
            //如果是修改需要获取原始数据
            if($routeParams.subjectId && $routeParams.flag != 0){
                subjectCreateService.getSubjectInfo($routeParams.subjectId).then(function (data) {
                    $scope.basic = angular.copy(data.data);
                    $scope.basic.title =  $scope.basic.name;
                    //给复选框设置默认值
                    for(var i= 0; i < $scope.subjectOffices.length; i++){
                        var arr = $scope.basic.subjectOffices.split(',');
                        arr.splice(arr.indexOf(''),1);
                        for(var j = 0;j < arr.length; j++){
                            if(arr[j] == $scope.subjectOffices[i].id){
                                $scope.subjectOffices[i].select = true;
                            }
                        }
                    }
                });
            }
        });

        //获取负责人
        subjectCreateService.getOwnList().then(function (data) {
            $scope.ownData = data.data.data;
        });
        //删除未选中的元素
        $scope.basic.subjectOffices = '';
        $scope.selectCheckbox = function (select,name) {
            if(select == true) {
                $scope.basic.subjectOffices = $scope.basic.subjectOffices + name +',';
            }else {
                $scope.basic.subjectOffices = $scope.basic.subjectOffices.replace(name +',' , '');
            }
        }
        $scope.topicsNext = function (save) {
            $scope.basic.flag = $routeParams.flag;
            if($scope.basic.name == '' || $scope.basic.name == null ||
                $scope.basic.visible == '' || $scope.basic.visible == null ||
                $scope.basic.center == '' || $scope.basic.center == null ||
                $scope.basic.type == '' || $scope.basic.type == null ||
                $scope.basic.startTime == '' || $scope.basic.startTime == null ||
                $scope.basic.endTime == '' || $scope.basic.endTime == null||
                $scope.basic.userId == '' || $scope.basic.userId == null
            ){
                $('#general-prompt').modal();
                $scope.promptMainContent = '红色标注为必填项';
            }else {
                $scope.saveBtn.changeState('save')
                $scope.promptMainContent = '保存中...';
                $('#general-prompt').modal();
                if($routeParams.subjectId){
                    subjectCreateService.subjectModify($routeParams.subjectId,$scope.basic).then(function (data) {
                        if(data.status == 'ok'){
                            if(save){
                                $scope.promptMainContent = '保存成功';
                                $scope.saveBtn.changeState('success')
                                $('#general-prompt').on('hidden.bs.modal', function () {
                                    location.href = '#/subject-list';
                                })
                            }else{
                                $('#general-prompt').modal('hide');
                                $scope.saveBtn.changeState('failure')
                                $('#general-prompt').on('hidden.bs.modal', function () {
                                    location.href = '#/subject-member/new/' + data.data.id;
                                })
                            }
                        }else{
                            $scope.promptMainContent = '保存失败';
                            $scope.saveBtn.changeState('failure')
                        }
                    })
                }
            }

        }

        $scope.modalHide = function () {
            $('#general-prompt').modal('hide');
        }

        //获取附件列表
        $scope.fileData = '';
        $scope.getUploadList = function(pageNum,pageSize){
            subjectCreateService.getUploadList(pageNum,pageSize,$routeParams.subjectId).then(function (data) {
               if(data.status == SYS.STATUS_SUCCESS){
                   $scope.fileData = data.page.content;
                   $scope.filePage = data.page;
                   $scope.filePage.number ++;
               }
            });
        }
        $scope.getUploadList(1,10);

        $scope.onFileSelect = function($files){
            subjectCreateService.uploadCRF($files,$routeParams.subjectId).then(function (data) {
                if(data.status == SYS.STATUS_SUCCESS){
                    $scope.promptMainContent = '上传成功';
                    $('#general-prompt').modal('show');
                    $scope.getUploadList(1,10);
                }else{
                    $scope.promptMainContent = '上传失败';
                    $('#general-prompt').modal('show');
                }
            });
        };
        $scope.deleteFile = function (fileId) {
            subjectCreateService.deleteFile(fileId).then(function () {
                $scope.fileData = '';
                $scope.getUploadList(1,10);
            });
        }
        $scope.updatePageAttend = function(pageNum){
            $scope.getUploadList(pageNum,10);
        }
        $scope.downLoad = function (data) {
            subjectCreateService.downLoad(data.id);
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

