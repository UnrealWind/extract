angular.module("infi-basic").controller('MenuCreateController',['$scope','DataService','$routeParams','SYS','Utils','$location',function ($scope,DataService,$routeParams,SYS,Utils,$location) {
    $scope.SYS = SYS;
    $scope.sortIsNumber = true;

    //初始化
    function init() {
        setInitialization();
        $scope.viewDetail.type= $routeParams.type;
        if($scope.viewDetail.type && $scope.viewDetail.type == "change"){  //修改
            DataService.getDetail($scope.viewDetail.id,"menu").then(function (msg) {
                if(msg.status == $scope.SYS.STATUS_SUCCESS){
                    $scope.viewDetail.menuDetail = msg.data;
                }
            });
        }else{  //新建
            $scope.viewDetail.type = "create";
        }
        DataService.getMenuSource("menu").then(function (msg) {
            (function fix(arr) {
                arr.forEach(function (n,i) {
                    n['label'] = n.name;
                    n.children?fix(n.children):undefined;
                })
            })(msg.data);
            $scope.menuList = msg.data;
        });
    }

    //设置一些初始化属性
    function setInitialization() {
        $scope.viewDetail = {   //修改或者查看详情的数据
            id: $routeParams.id,  //修改或者查看时的id
            menuDetail : {
                name:"",  //菜单名称
                href:"",  //链接
                target:"",  //打开方式
                icon:"",  //图标
                order:"30",  //排序
                linkType:"rel",  //链接类型
                linkFunction:"2",  //链接功能
                hierarchy:""  //层级
            }
        };
    }

    /**
     * 校验排序字段是否为数字
     */
    $scope.checkSort = function () {
        $scope.sortIsNumber = !isNaN($scope.viewDetail.menuDetail.order);
    }
    
    init();

    /**
     * 链接类型是绝对路径,只能在新窗口打开
     */
    $scope.selectHrefType = function () {
        $scope.viewDetail.menuDetail.linkType == 'ads' ? $scope.viewDetail.menuDetail.target = 'true' : undefined;
    }

    /**
     * 链接功能为跳转时,链接类型在修改页面并且是没有选择的情况下,自动赋值
     */
    $scope.changeType = function () {
        $scope.viewDetail.menuDetail.linkFunction =='2'&&$scope.viewDetail.menuDetail.linkType==''?$scope.viewDetail.menuDetail.linkType='rel':undefined;
    }

    $scope.saveMenu = function () {
        //链接功能为'展开'则href和linkType置空
        $scope.viewDetail.menuDetail.href = $scope.viewDetail.menuDetail.linkFunction == '1'?'':$scope.viewDetail.menuDetail.href;
        $scope.viewDetail.menuDetail.linkType = $scope.viewDetail.menuDetail.linkFunction == '1'?'':$scope.viewDetail.menuDetail.linkType;
        if($scope.viewDetail.type == "create"){
            $scope.viewDetail.menuDetail.parentId = $scope.viewDetail.id ? $scope.viewDetail.id : 0;
        }else {
            $scope.$root.$selectedNavi?$scope.viewDetail.menuDetail.parentId = $scope.$root.$selectedNavi.id:undefined;
        }
        DataService.saveCreatedData($scope.viewDetail.menuDetail,"menu").then(function (msg) {
            if(msg.status == $scope.SYS.STATUS_SUCCESS){
                $location.path("/menu");
            }else{
                Utils.sysTip($scope,msg);
            }
        });
    }
}]);