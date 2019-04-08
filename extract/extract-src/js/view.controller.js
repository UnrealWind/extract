angular.module('infi-basic')
    .controller('ViewController', ['$scope','TaskListService','SYS','ViewMapping','$routeParams','$location',function ($scope,TaskListService,SYS,ViewMapping,$routeParams,$location) {
        $scope.SYS = SYS;
        $scope.columns = [];  //表头数据
        $scope.content = [];  //内容数据
        $scope.page = "";
        $scope.taskName = $routeParams.taskName;
        $scope.entity = {};   // 被点击条目的实例信息

        // 成果备案
        $scope.resultRecord = {
            descriptionOfResults: '',
            allFileName: '',
            allfilePath: '',
            achievementId: ''
        }

        /**
         * 页面初始化
         */
        function init() {
            $scope.changePage($scope.SYS.DEFAULT_PAGE_NUMBER);
            TaskListService.getColumns().then(function(msg){
                $scope.columns = msg.data;
            });
        }

        /**
         * 切换页数
         * @param page
         * @param size
         */
        $scope.changePage = function (page) {
            $scope.page = page;
            TaskListService.getAllTask(page,$scope.SYS.DEFAULT_PAGE_SIZE).then(function (msg) {
                if(msg.status){
                    if(msg.page&&msg.page != null){
                        $scope.content = ViewMapping.contentMapping(msg);
                    }else{
                        $scope.content = msg;
                    }
                }

            });
        };
        init();

        /**
         * 操作按钮
         * @param entity
         * @param type
         */
        $scope.pageOperation = function (entity,type) {
            $scope.entity = entity;
            if(type == "down"){
                window.location.href = $scope.SYS.url + "task/download/"+entity.id;
                // 下载后刷新当前页
                TaskListService.getAllTask($scope.page,$scope.SYS.DEFAULT_PAGE_SIZE).then(function (msg) {
                    $scope.content = ViewMapping.contentMapping(msg);
                });
            } else if(type == "extract"){
                TaskListService.extractTask(entity.id).then(function (msg) {
                    //提取成功后刷新当前页
                    if(msg.status == $scope.SYS.STATUS_SUCCESS){
                        TaskListService.getAllTask($scope.page,$scope.SYS.DEFAULT_PAGE_SIZE).then(function (msg) {
                            $scope.content = ViewMapping.contentMapping(msg);
                        });
                    }
                });
            }else if(type == "view"){
                $location.path("task-detail/detail/"+entity.id);
            } else if(type == "record") {
                $('#uploadBox').modal({backdrop:'static'});

                //　清除原有数据
                $scope.resultRecord = {
                    descriptionOfResults: '',
                    allFileName: '',
                    allfilePath: ''
                }

                // 获取成果备案弹窗信息
                TaskListService.getRecord(entity.id).then(function(msg) {
                    if (msg.data) {
                        $scope.resultRecord = {
                            descriptionOfResults: msg.data.descriptionOfResults,
                            allFileName: msg.data.allFileName,
                            allfilePath: msg.data.allfilePath,
                            achievementId: msg.data.id
                        }
                    }
                    
                })

            }
        }
    }]);