angular.module('infi-basic')
    .controller('FilterSetDetailController',[ '$scope','SYS','DataService','$location','$routeParams',function ($scope,SYS,DataService,$location,$routeParams) {
        $('body').removeClass("modal-open");
        $(".modal-backdrop").remove();
        
        //实验对照
        $scope.zhu = {
            value:  $routeParams.sy,
            data: [
                {name: '实验组', value: $routeParams.sy},
                {name: '对照组', value: $routeParams.dz}
            ]
        }
        //分页按钮
        $scope.updatePage = function(pageNo){
            if($scope.zhu.value == $routeParams.dz) {
                $scope.dataList($routeParams.dz, pageNo - 1);
            }else{
                $scope.dataList($routeParams.sy, pageNo - 1);
            }
        }

        // 列表总容器
        $scope.tableTheader = [];
        $scope.tableTbodys = [];
        
        //总数据
        $scope.dataList = function(filterId,pageNo){
            // 列表总容器
            $scope.tableTheader = [];
            $scope.tableTbodys = [];
            DataService.ajaxFilterSetListDetails(filterId,pageNo).then(function(data){
                var t = 0;
                $scope.detailContent = data;
                $scope.detailContent.page.number++;
                angular.forEach(data.page.content,function(value,key){
                    $scope.tableTbodys[t] =[];
                    for (var i = 0; i < value.length; i++) {
                        if( t == 0){
                            $scope.tableTheader.push({name:data.page.content[key][i].name});
                        }
                        $scope.tableTbodys[t].push({value:data.page.content[key][i].value});
                    }
                    t++;
                });
            })
        }
        $scope.dataList($routeParams.sy,0);

        //实验组对照组
        $scope.dataSelect = function(){
            if($scope.zhu.value == $routeParams.sy){
                $scope.dataList($routeParams.sy,0);
            }else if($scope.zhu.value == $routeParams.dz){
                $scope.tableTbodys = [];
                DataService.ajaxFilterSetListDetails($scope.zhu.value).then(function(data){
                    var t = 0;
                    angular.forEach(data.data,function(value,key){
                        $scope.tableTbodys[t] =[];
                        for (var i = 0; i < value.length; i++) {
                            $scope.tableTbodys[t].push({value:data.data[key][i].value});
                        }
                        t++;
                    });
                })
                $scope.dataList($routeParams.dz,0);
            }
        }

        $scope.previous = function(){
            $location.path('filter.set/'+$routeParams.id);
        }
        $scope.next = function(){
            DataService.ajaxFilterSetDetailNext($routeParams.id).then(function(data){
                $location.path('model/'+$routeParams.id+'/'+$routeParams.sy+'/'+$routeParams.dz);
            })
        }
        //探查]
        $scope.tanCha = function(){
            window.open('#/filter.set.exploration/'+$routeParams.id);
        }
    }]);