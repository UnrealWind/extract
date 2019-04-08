angular.module('infi-basic')
    .controller('ImplementListController', ['$scope','TaskService','SYS','$location','Utils','ViewMapping',function ($scope,TaskService,SYS,$location,Utils,ViewMapping) {
        $scope.SYS = SYS;
        $scope.columns = [];  //表头数据
        $scope.content = [];  //内容数据
        $scope.opts = {
            label:"操作",
            btns:[{
                label:"查看",
                type:"view"
            },{
                label:"详情",
                type:"detail"
            }]
        };

        function init() {
            TaskService.getColumn('implement-list').then(function (msg) {
                $scope.columns = msg.data;
            })
            $scope.changePage(SYS.DEFAULT_PAGE_NUMBER);
        }

        $scope.changePage = function (pageNo) {
            TaskService.getListData("resultRecord/page?",pageNo,SYS.DEFAULT_PAGE_SIZE).then(function (msg) {
                $scope.content = msg;
            });
        }

        $scope.pageOperation = function (entity,type) {
            if(type == "view"){
                $location.path("result-rule/implement/view/"+entity.pushTask.id+'/'+entity.id);
            }else if(type == "detail"){
                $location.path("implement-detail/"+entity.id);
            }
        }
        init();
    }]);