angular.module('infi-basic')
    .controller('DataSelectDetailController',[ '$scope','SYS','DataService','$routeParams','$location',function ($scope,SYS,DataService,$routeParams,$location) {
        //分页按钮
        $scope.updatePage = function(data){
            data.page--;
            $scope.dataList($routeParams.id,data.page);
        }

        // 列表总容器
        $scope.tableTheader = [];
        $scope.tableTbodys = [];
        //控制
        $scope.NUM = 0;
        //总数据
        $scope.dataList = function(id,page){
            $scope.tableTbodys = [];
            if($routeParams.modify){
                DataService.ajaxDataSelectListModifyDetails(id,page).then(function(data){
                    $scope.modifyId = data.data.id;
                    data.data.page.number++;
                    
                    for(var i = 0 ; i < data.data.page.content.length ; i++){
                        $scope.tableTbodys[i] = [];
                        for(var j = 0 ; j < data.data.page.content[i].length ; j++){
                            if($scope.NUM == 0){
                                $scope.tableTheader.push({name:data.data.page.content[i][j].name});
                            }
                            $scope.tableTbodys[i].push({value:data.data.page.content[i][j].value});
                        }
                        $scope.NUM++;
                    }

                    $scope.content = data.data;
                    // var t = 0;
                    // angular.forEach(data.data.map,function(value,key){
                    //     $scope.tableTbodys[t] = [];
                    //     for (var i = 0; i < value.length; i++) {
                    //         if( key == 1){
                    //             $scope.tableTheader.push({name:data.data.map[key][i].name});
                    //         }
                    //         $scope.tableTbodys[t].push({value:data.data.map[key][i].value});
                    //     }
                    //     t++;
                    // });
                })
            }else{
                DataService.ajaxDataSelectListDetails(id,page).then(function(data){
                    data.data.page.number++;
                    for(var i = 0 ; i < data.data.page.content.length ; i++){
                        $scope.tableTbodys[i] = [];
                        for(var j = 0 ; j < data.data.page.content[i].length ; j++){
                            if($scope.NUM == 0){
                                $scope.tableTheader.push({name:data.data.page.content[i][j].name});

                            }
                            $scope.tableTbodys[i].push({value:data.data.page.content[i][j].value});
                        }
                        $scope.NUM++;
                    }
                    $scope.content = data.data;
                    // angular.forEach(data.data.map,function(value,key){
                    //     $scope.tableTbodys[key-1] = [];
                    //     for (var i = 0; i < value.length; i++) {
                    //         if( key == 1){
                    //             $scope.tableTheader.push({name:data.data.map[key][i].name});
                    //         }
                    //         $scope.tableTbodys[key-1].push({value:data.data.map[key][i].value});
                    //     }
                    // });

                })
            }

        }
        $scope.dataList($routeParams.id,0);

        //探查
        $scope.tanCha = function(){
            if($routeParams.modify){
                window.open('#/data.select.exploration/'+$scope.modifyId +'/modify');
            }else{
                window.open('#/data.select.exploration/'+$routeParams.id);
            }

        }


        //上一步
        $scope.previous = function(){
            $location.path('data.select');
        }

        //下一步
        $scope.next = function(){
            if($routeParams.modify){
                DataService.ajaxDataSelectModifyNext($scope.modifyId).then(function(data){
                    $routeParams.id = data.data.id;
                    $location.path('variable.set/'+$routeParams.id);
                });
            }else{
                DataService.ajaxDataSelectNext($routeParams.id).then(function(data){
                    $routeParams.id = data.data.id;
                    $location.path('variable.set/'+$routeParams.id);
                });
            }
        }
    }]);