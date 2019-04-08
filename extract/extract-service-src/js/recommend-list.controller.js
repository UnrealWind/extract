angular.module('infi-basic')
    .controller('RecommendListController', ['$scope','TaskService','SYS','$location','Utils','ViewMapping',function ($scope,TaskService,SYS,$location,Utils,ViewMapping) {
        $scope.SYS = SYS;
        $scope.columns = [];  //表头数据
        $scope.content = [];  //内容数据
        $scope.opts = {
            label:"操作",
            btns:[{
                label:"查看",
                type:"view"
            },{
                label:"执行",
                type:"implement"
            }
            //     ,{
            //     label:"删除",
            //     type:"delete"
            // }
            ]
        };

        $scope.init = function() {
            TaskService.getColumn('recommend-list').then(function (msg) {
                $scope.columns = msg.data;
            })
            $scope.changePage(SYS.DEFAULT_PAGE_NUMBER);
        }

        $scope.changePage = function (pageNo) {
            TaskService.getListData("pushTask/page?",pageNo,SYS.DEFAULT_PAGE_SIZE).then(function (msg) {
                if(msg.status){
                    if(msg.page&&msg.page != null){
                        $scope.content = ViewMapping.mappingRecommend(msg);
                    }else{
                        $scope.content = msg;
                    }
                }
            });
        }

        $scope.pageOperation = function (entity,type) {
            if(type == "view"){
                $location.path("result-rule/recommend/view/"+entity.id);
            }else if(type == "implement"){  //推荐任务执行
                TaskService.implementPushTask(entity.id).then(function (msg) {
                    // if(msg.status == 'blank'){
                    //     var tip = {
                    //         status:'ok',
                    //         description:'任务执行成功'
                    //     }
                    //     Utils.sysTip($scope,tip);
                    // }else{
                    //     Utils.sysTip($scope,msg);
                    // }
                });
            }else if(type == "delete"){
                $("#deleteTip").modal({backdrop: 'static'});
                $scope.deleteId = entity.id;
            }
        }
        $scope.init();
    }]);