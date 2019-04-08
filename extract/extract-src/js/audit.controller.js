angular.module('infi-basic').controller('AuditController', ['$scope','SYS','TaskListService','ViewMapping','$location',function ($scope,SYS,TaskListService,ViewMapping,$location) {
    $scope.SYS = SYS;
    $scope.columns = [];  //表头数据
    $scope.content = [];  //内容数据
    $scope.opts = {
        label:"操作",
        btns:[{
            label:"查看",
            type:"view"
        },{
            label:"审核",
            type:"check"
        }]

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
        TaskListService.getPendingAudit(page,$scope.SYS.DEFAULT_PAGE_SIZE).then(function (msg) {
            
            if(msg.status){
                if(msg.page&&msg.page != null){
                    $scope.content = ViewMapping.contentMapping(msg);
                }else{
                    $scope.content = msg;
                }
            }else{
                $scope.content = null;
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
        if(type == "view"){
            $location.path("task-detail/detail/"+entity.id);
        }else if(type == "check"){
            $location.path("task-detail/check/"+entity.id);
        }
    }
}]);