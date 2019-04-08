angular.module('infi-basic')
    .controller('DataSelectController',[ '$scope','SYS','DataService','$routeParams','$location','Upload','$interval',function ($scope,SYS,DataService,$routeParams,$location,Upload,$interval) {

        // 列表总容器
        $scope.contents = [];
        //控制列表header和body赋值次数
        $scope.headerStatus = 0;
        //分页容器
        $scope.content = {
            // "page":{
            //     "totalPages": 5,
            //     // "firstPage": true,
            //     // "lastPage": true,
            //     "numberOfElements": 10,
            //     "totalElements": 50,
            //     "size": 10,
            //     "number": 0
            // }
        }

        //分页
        $scope.updatePage = function(page){
            $scope.dataList(page.page);
        }

        // 删除
        $scope.inviteDelete = function(data){
            DataService.ajaxDataSelectInviteDelete(data.id).then(function(data){
                $scope.contents = [];
                $scope.dataList(1);
            })
        }

        // 上传
        $scope.onFileSelect = function($file){
            if($file.length > 0){
                $('#execl-data').modal({backdrop:'static'});
            }
            $scope.saveTSS = {
                opacity:1.0
            };
            var timer = $interval(function(){
                $scope.saveTSS.opacity -= .05;
                if($scope.saveTSS.opacity < 0.1){
                    $scope.saveTSS.opacity = 1.0
                }
            },100);
            $scope.upload = Upload.upload({
                url: SYS.url+'load/data/file/project',
                method: 'POST',
                file: $file[0]
            }).then(function (msg){
                if(msg.status == 400){

                }else{
                    $('#execl-data').modal('hide');
                    $('#execl-datas').modal({backdrop:'static'});
                    $scope.dataList();
                }
            });
        }
    
        // excel选择
        // $scope.execlSave = function(){
        //     $('#execl-data').modal('hide');
        // }
        //跳转取数页面
        $scope.extract = function(){
            // $('#extract-modal').modal({backdrop:'static'});
            window.location.href= '/extract-src/#/task';
        }
        //跳转到数据详情
        $scope.rawDataModal = function(data){
            $routeParams.id = data.id;
            $location.path('data.select.detail/'+$routeParams.id);
        }
        //跳转到修改后数据详情
        $scope.rawDataModals = function(data){
            $routeParams.id = data.id;
            $routeParams.modify = 'modify';
            $location.path('data.select.detail/' + $routeParams.id + '/' + $routeParams.modify);
        }

        $scope.dataList = function(page){
            DataService.ajaxDataSelectList(page).then(function(data){
                if(data.page == null){
                    return
                }
                //分页时清空容器
                $scope.contents = [];
                data.page.number++;
                $scope.content = data;
                for(var i = 0 ; i < data.page.content.length ; i++){
                    $scope.contents[i] = {
                        name:data.page.content[i].name,
                        start:data.page.content[i].createTime,
                        end:data.page.content[i].updateTime,
                        id:data.page.content[i].id
                    };
                    $scope.contents[i].header = [];
                    $scope.contents[i].data = [];
                    for(var t = 1 ; t < 3 ; t++){
                        $scope.container = [];
                        for(var j = 0 ; j < data.page.content[i].map[t].length ; j++){
                            if(t == 1){
                                $scope.contents[i].header.push({name:data.page.content[i].map[t][j].name});
                            }
                            $scope.container.push({value:data.page.content[i].map[t][j].value});
                        }
                        $scope.contents[i].data.push($scope.container);
                    }
                }
            });
        }
        $scope.dataList(1);
    }]);