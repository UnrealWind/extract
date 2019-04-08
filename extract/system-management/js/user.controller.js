angular.module("infi-basic").controller('UserController',['$scope','DataService','ViewMapping','$location','Utils','SYS',function ($scope,DataService,ViewMapping,$location,Utils,SYS) {
    $scope.SYS = SYS;
    $scope.column = {};  //机构列表表头
    $scope.opts = {
        label:"操作",
        btns:[
            {
                label:"修改",
                type:"change"
            }, {
                label:"删除",
                type:"delete"
            }]
    }
    /**
     * 页面初始化
     */
    $scope.init = function() {
        $scope.changePage($scope.SYS.DEFAULT_PAGE_NUMBER);
        DataService.getColumn("user").then(function (msg) {
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
        DataService.getPage(page,$scope.SYS.DEFAULT_PAGE_SIZE,"user").then(function (msg) {
            ViewMapping.matchSpecialList(msg,[{label:'office'},{label:'company'}]);
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
        if(type == "change"){
            $location.path("userCreate/change/"+entity.id);
        }else if(type == "delete"){
            $scope.deleteId = entity.id;  //删除行的id
            $('#deleteTip').modal({backdrop: 'static'});
        }
    }
}]);