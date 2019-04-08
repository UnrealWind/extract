angular.module("infi-basic").controller('MechanismController',
    ['$scope','DataService','ViewMapping','$location','Utils','SYS','$http',
        function ($scope,DataService,ViewMapping,$location,Utils,SYS,$http) {
    $scope.SYS = SYS;
    $scope.column = {};  //机构列表表头
    $scope.opts = {
        label:"操作",
        btns:[{
            label:"新建",
            type:"create"
        },{
            label:"修改",
            type:"change"
        }
        //     ,{
        //     label:"删除",
        //     type:"delete"
        // }
        ]
    }
    /**
     * 页面初始化
     */
    $scope.init = function() {
        $scope.changePage($scope.SYS.DEFAULT_PAGE_NUMBER);
        DataService.getColumn("mechanism").then(function (msg) {
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
        DataService.getPage(page,$scope.SYS.DEFAULT_PAGE_SIZE,"office").then(function (msg) {
            if(msg.status){
                // ViewMapping.matchMechanismType(msg);
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
        if(type == "create"){
            $location.path("mechanismCreate/create/"+entity.id);
        }else if(type == "change"){
            $location.path("mechanismCreate/change/"+entity.id);
        }else if(type == "delete"){
            $scope.deleteId = entity.id;  //删除行的id
            $('#deleteTip').modal({backdrop: 'static'});
        }
    }

    //获取菜单
    function initalize() {
        DataService.getMenuSource("office").then(function (msg) {
            $scope.menuList = msg.data;
        });
    }
    initalize();

    $scope.callBack  = function (opt,type) {
        if(type == "create"){
            $location.path("mechanismCreate/create/"+opt.id);
        }else if(type == "change"){
            $location.path("mechanismCreate/change/"+opt.id);
        }else if(type == 'delete'){
            $http.delete(SYS.url+'office/'+opt.id).then(function (msg) {
                initalize();
            });
        }
    }
}]);