angular.module("infi-basic").controller('ClassifyCreateController',['$scope','ConfigureService','$routeParams','SYS','Utils','$location',function ($scope,ConfigureService,$routeParams,SYS,Utils,$location) {
    $scope.SYS = SYS;
    $scope.sortIsNumber = true;

    //初始化
    function init() {
        setInitialization();
        if(!$scope.viewDetail.type){  //新建
            $scope.viewDetail.type = "create";
        }else{  //修改和查看
            ConfigureService.getDetail({
                type:"",
                type1:"/tree",
                id:$scope.viewDetail.id
            }).then(function (msg) {
                if(msg.status == $scope.SYS.STATUS_SUCCESS){
                    $scope.viewDetail.detail = msg.data;
                }
            });
        }
    }

    //设置一些初始化属性
    function setInitialization() {
        $scope.viewDetail = {   //修改或者查看详情的数据
            id: $routeParams.id,  //修改或者查看时的id
            type:$routeParams.type,
            detail : {
                name:"",  //分类编号
                label:"",  //分类名称
                sort:"",  //排序字段
                used:"filter"  //分类类型
            }
        };
    }
    init();

    /**
     * 校验排序字段是否为数字
     */
    $scope.checkSort = function () {
        $scope.sortIsNumber = !isNaN($scope.viewDetail.detail.sort);
    }
    
    $scope.saveDatas = function () {
        if($scope.viewDetail.type && $scope.viewDetail.type == "change"){
            ConfigureService.saveChangedData({
                type:"",
                type1:"/tree",
                data:$scope.viewDetail.detail
            }).then(function (msg) {
                if(msg.status == $scope.SYS.STATUS_SUCCESS){
                    $location.path("/classify");
                }else{
                    Utils.sysTip($scope,msg);
                }
            });
        }else{
            ConfigureService.saveCreatedData({
                type:"",
                type1:"/tree",
                data:$scope.viewDetail.detail
            }).then(function (msg) {
                if(msg.status == $scope.SYS.STATUS_SUCCESS){
                    $location.path("/classify");
                }else{
                    Utils.sysTip($scope,msg);
                }
            });
        }
    }
}]);