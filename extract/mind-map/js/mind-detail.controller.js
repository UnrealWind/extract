angular.module("infi-basic").controller('MindDetailController',['$scope','SYS','$routeParams','$http',function ($scope,SYS,$routeParams,$http) {
    $scope.SYS = SYS;
    $scope.columns = [{label:"id",name:"id"},{label:"名称",name:"name"}];  //表头数据
    $scope.content = [];  //内容数据
    $scope.child = {
        id:$routeParams.id,
        type : $routeParams.type,
        tableName : $routeParams.tableName
    }

    function init() {
        $scope.changePage($scope.SYS.DEFAULT_PAGE_NUMBER);
    }

    $scope.changePage = function (page) {
        //属性值列表链接:mind/childPage?tableName="DDD"
        //特殊属性值的属性列表:mind/childSpecialPage?tableName="KKK"
        //特殊属性值的属性导图进入的属性值列表:mind/childAttriSpecialPage?tableName="WWW"&id=123&ifAttri=0
        //特殊属性值的属性导图进入的特殊属性值的属性列表:mind/childAttriSpecialPage?tableName="WWW"&id=123&ifAttri=1
        var url = "";
        if($scope.child.id){  //此值存在为特殊属性值的属性导图进入的列表
            url += 'mind/childAttriSpecialPage?tableName='+$scope.child.tableName+'&id='+$scope.child.id;
            if($scope.child.type == "special"){
                url += '&ifAttri=1';
            }else{
                url += '&ifAttri=0';
            }
        }else if($scope.child.type == "special"){  //此值为special代表特殊属性值的属性列表
            url += "mind/childSpecialPage?tableName="+$scope.child.tableName;
        }else{  //此值为resource代表属性值的列表
            url += "mind/childPage?tableName="+$scope.child.tableName;
        }

        $http.get(SYS.url+url+"&page_number="+page+"&page_size="+$scope.SYS.DEFAULT_PAGE_SIZE).then(function success(msg) {
            $scope.content = msg.data;
            if(msg.data.status == SYS.STATUS_SUCCESS&&msg.data.data.length > 0){
                var datas = msg.data.data,
                    lengthData = datas.length-1;
                $scope.content.number = datas[lengthData].pageNumber+1;
                $scope.content.totalElements = datas[lengthData].total;
                datas.pop();
                $scope.content.page = datas;
            }
        })
    }
    
    $scope.goToMind = function (page) {
        if(page.tableName){
            var path = 'http://'+window.location.hostname+':'+window.location.port;
            // window.open('#mind/'+page.id+'/'+page.name+'/'+page.tableName);
            window.location.href = '#mind/'+page.id+'/'+page.name+'/'+page.tableName;
        }
    }

    init();
}])