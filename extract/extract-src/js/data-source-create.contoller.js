angular.module("infi-basic").controller('SourceCreateController',['$scope','ConfigureService','$routeParams','SYS','Utils','$location',function ($scope,ConfigureService,$routeParams,SYS,Utils,$location) {
    $scope.SYS = SYS;
    $scope.resource = {};  //维表资源
    $scope.tabResource = {};  //维表资源标签值分类
    $scope.valiResource = {};  //数据核实资源
    $scope.moreResource = {}   //搜索资源
    
    //初始化
    function init() {
        setInitialization();
        ConfigureService.getDimensionList("all").then(function (msg) {
            $scope.resource = msg;
            if($scope.viewDetail.type == "create" && msg.data && msg.data.length > 0){
                $scope.viewDetail.detail.resourceId = setFirstSelected(msg);
            }
        });
        ConfigureService.getDimensionList("tab").then(function (msg) {
            $scope.tabResource = msg;
            if($scope.viewDetail.type == "create" && msg.data && msg.data.length > 0){
                $scope.viewDetail.detail.tabResourceId = setFirstSelected(msg);
            }
        });
        ConfigureService.getDimensionList("more").then(function (msg) {
            $scope.moreResource = msg;
            if($scope.viewDetail.type == "create" && msg.data && msg.data.length > 0){
                $scope.viewDetail.detail.moreResourceId = setFirstSelected(msg);
            }
        });
        ConfigureService.getValidateList().then(function (msg) {
            $scope.valiResource = msg;
            if($scope.viewDetail.type == "create" && msg.data && msg.data.length > 0){
                $scope.viewDetail.detail.valiResourceId = setFirstSelected(msg);
            }
        });
        if(!$scope.viewDetail.type){  //新建
            $scope.viewDetail.type = "create";
        }else{  //修改和查看
            ConfigureService.getDetail({
                type:"/resource",
                type1:"/tag",
                id:$scope.viewDetail.id
            }).then(function (msg) {
                if(msg.status == $scope.SYS.STATUS_SUCCESS){
                    $scope.viewDetail.detail = msg.data;
                    //将是否行专列,是否多值动态转换成字符串形式,后台传递回来的为bool类型,html中不能应用
                    $scope.viewDetail.detail.transfer = $scope.viewDetail.detail.transfer.toString();
                    $scope.viewDetail.detail.multiValue = $scope.viewDetail.detail.multiValue.toString();
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
                name:"",  //分类名称
                esField:"",  //ES原字段
                resourceId:"",  //维表资源
                tabResourceId:"",  //维表资源标签值分类
                transfer:'false',  //是否行转列
                multiValue:'false',  //是否多值
                tagResultField:"",//ES原标签值字段
                valiResourceId:"",   //数据核实资源
                moreResourceId:""  //搜索资源
            }
        };
    }

    function setFirstSelected(original) {
        return original.data[0].id.toString();
    }

    init();

    $scope.saveDatas = function () {
        if($scope.viewDetail.type && $scope.viewDetail.type == "change"){
            ConfigureService.saveChangedData({
                type:"/resource",
                type1:"/tag",
                data:$scope.viewDetail.detail
            }).then(function (msg) {
                if(msg.status == $scope.SYS.STATUS_SUCCESS){
                    $location.path("/tag-source");
                }else{
                    Utils.sysTip($scope,msg);
                }
            });
        }else{
            ConfigureService.saveCreatedData({
                type:"/resource",
                type1:"/tag",
                data:$scope.viewDetail.detail
            }).then(function (msg) {
                if(msg.status == $scope.SYS.STATUS_SUCCESS){
                    $location.path("/tag-source");
                }else{
                    Utils.sysTip($scope,msg);
                }
            });
        }
    }
}]);