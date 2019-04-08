angular.module("infi-basic").controller('ClassifyController',['$scope','ConfigureService','$location','Utils','SYS',function ($scope,ConfigureService,$location,Utils,SYS) {
    $scope.SYS = SYS;
    $scope.columns = [];  //机构列表表头
    $scope.opts = {
        label:"操作",
        btns:[
            {
                label:"查看",
                type:"view"
            },
            {
                label:"修改",
                type:"change"
            },{
                label:"删除",
                type:"delete"
            }]
    }
    /**
     * 页面初始化
     */
    $scope.init = function() {
        $scope.changePage($scope.SYS.DEFAULT_PAGE_NUMBER);
        ConfigureService.getColumn("data-classify").then(function (msg) {
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
        ConfigureService.getConfigurePage({
            page:page,
            pageSize:$scope.SYS.DEFAULT_PAGE_SIZE,
            type:"",
            type1:"/tree"
        }).then(function (msg) {
            if(msg.status){
                $scope.content = msg;
            }else{
                $scope.content = null;
            }
        });
    };
    $scope.init();

    /**
     * 操作按钮
     * @param entity
     * @param type
     */
    $scope.pageOperation = function (entity,type) {
        if(type == "view"){
            $location.path("classify-create/view/"+entity.id);
        }else if(type == "change"){
            $location.path("classify-create/change/"+entity.id);
        }else if(type == "delete"){
            $scope.deleteId = entity.id;  //删除行的id
            $('#deleteTip').modal({backdrop: 'static'});
        }
    }
}]);