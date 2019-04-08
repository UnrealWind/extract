angular.module("infi-basic").controller('TagCreateController',['$scope','ConfigureService','$routeParams','SYS','Utils','$location',function ($scope,ConfigureService,$routeParams,SYS,Utils,$location) {
    $scope.SYS = SYS;
    $scope.resourceTag = {};  //标签原列表
    $scope.preResource = {};  //前置条件列表
    $scope.sortIsNumber = true;

    //初始化
    function init() {
        setInitialization();
        ConfigureService.getConfigureAll({type:"/resource",type1:"/tag"}).then(function (msg) {
            $scope.resourceTag = msg;
            if($scope.viewDetail.type == "create" && msg.data && msg.data.length > 0){
                $scope.viewDetail.detail.resourceTagId = setFirstSelected(msg);
            }
        });
        ConfigureService.getConfigureAll({type:"/resource",type1:"/pre"}).then(function (msg) {
            $scope.preResource = msg;
            if($scope.viewDetail.type == "create" && msg.data && msg.data.length > 0){
                $scope.viewDetail.detail.preResourceId = setFirstSelected(msg);
            }
        });
        if(!$scope.viewDetail.type){  //新建
            $scope.viewDetail.type = "create";
        }else{  //修改和查看
            ConfigureService.getDetail({
                type:"",
                type1:"/tag",
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
                resourceTagId:"",  //标签原列表
                sort:"",  //排序字段
                preResourceId:""  //前置条件
            }
        };
    }

    function setFirstSelected(original) {
        return original.data[0].id.toString();
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
                type1:"/tag",
                data:$scope.viewDetail.detail
            }).then(function (msg) {
                if(msg.status == $scope.SYS.STATUS_SUCCESS){
                    $location.path("/tag");
                }else{
                    Utils.sysTip($scope,msg);
                }
            });
        }else{
            ConfigureService.saveCreatedData({
                type:"",
                type1:"/tag",
                data:$scope.viewDetail.detail
            }).then(function (msg) {
                if(msg.status == $scope.SYS.STATUS_SUCCESS){
                    $location.path("/tag");
                }else{
                    Utils.sysTip($scope,msg);
                }
            });
        }
    }
}]);