angular.module("infi-basic").controller('TitleCreateController',['$http','$scope','DataService','ViewMapping','$routeParams','SYS','Utils','$location',
    function ($http,$scope,DataService,ViewMapping,$routeParams,SYS,Utils,$location) {
    $scope.SYS = SYS;
    $scope.sortIsNumber = true;
    $scope.viewDetail = {   //修改或者查看详情的数据
        id : $routeParams.id,  //修改或者查看时的id
        type:$routeParams.type,  //修改或者查看
        data:{ //通过id查询到的具体值
            name:"",
            value:""
        }
    }

    //初始化
    function init() {
        if($scope.viewDetail.type && $scope.viewDetail.type == "change"){  //修改或者查看
            /*DataService.getDetail($scope.viewDetail.id,"office").then(function (msg) {
                if(msg.status == $scope.SYS.STATUS_SUCCESS){
                    $scope.viewDetail.data = msg.data;
                }
            });*/
            $http.get(SYS.url+'job-title/'+$scope.viewDetail.id).success(function (msg) {
                if(msg.status == $scope.SYS.STATUS_SUCCESS){
                    $scope.viewDetail.data = msg.data;
                }
            });
        }else{  //新建
            $scope.viewDetail.type = 'create';
        }
    }


    init();

    /**
     * 保存新建或者修改的机构内容
     */
    $scope.saveMechansim = function () {
        var url = null;
        var method = null;
        $scope.viewDetail.id == 0?(url= SYS.url+'job-title',method='post'):
            (url = SYS.url+'job-title/'+$scope.viewDetail.id,method='put');

        $http({
            url:url,
            method: method,
            data: {
                "value": $scope.viewDetail.data.value,
                "name": $scope.viewDetail.data.name
            }
        }).success(function (msg) {
            if(msg.status == $scope.SYS.STATUS_SUCCESS){
                $location.path("/title")
            }else{
                Utils.sysTip($scope,msg);
            }
        });
        /*DataService.saveCreatedData($scope.viewDetail.data,"office").then(function (msg) {
            if(msg.status == $scope.SYS.STATUS_SUCCESS){
                $location.path("/title")
            }else{
                Utils.sysTip($scope,msg);
            }
        })*/
    }
}]);