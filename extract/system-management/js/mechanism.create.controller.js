angular.module("infi-basic").controller('MechanismCreateController',['$scope','DataService','ViewMapping','$routeParams','SYS','Utils','$location',function ($scope,DataService,ViewMapping,$routeParams,SYS,Utils,$location) {
    $scope.SYS = SYS;
    $scope.sortIsNumber = true;
    $scope.viewDetail = {   //修改或者查看详情的数据
        id : $routeParams.id,  //修改或者查看时的id
        type:$routeParams.type,  //修改或者查看
        data:{ //通过id查询到的具体值
            name:"",
            code:"",
            order:"10"
        }
    }

    //初始化
    function init() {
        if($scope.viewDetail.type && $scope.viewDetail.type == "change"){  //修改或者查看
            DataService.getDetail($scope.viewDetail.id,"office").then(function (msg) {
                if(msg.status == $scope.SYS.STATUS_SUCCESS){
                    $scope.viewDetail.data = msg.data;
                }
            });
        }else{  //新建
            $scope.viewDetail.type = 'create';
        }
    }

    /**
     * 校验排序字段是否为数字
     */
    $scope.checkSort = function () {
        $scope.sortIsNumber = !isNaN($scope.viewDetail.data.order);
    }

    init();

    /**
     * 保存新建或者修改的机构内容
     */
    $scope.saveMechansim = function () {
        if($scope.viewDetail.type == "create"){
            $scope.viewDetail.data.parentId = $scope.viewDetail.id ? $scope.viewDetail.id : 0;
        }
        DataService.saveCreatedData($scope.viewDetail.data,"office").then(function (msg) {
            if(msg.status == $scope.SYS.STATUS_SUCCESS){
                $location.path("/mechanism")
            }else{
                Utils.sysTip($scope,msg);
            }
        })
    }
}]);