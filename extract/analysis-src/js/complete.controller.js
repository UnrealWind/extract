angular.module('infi-basic')
    .controller('CompleteController',[ '$scope','$routeParams','$location','DataService',function ($scope,$routeParams,$location,DataService) {
        $('body').removeClass("modal-open");
        $(".modal-backdrop").remove();
        //当页面无数据显示
        $scope.hasData = true;
        //页面数据
        $scope.filterData = [        ];

        $scope.toView = function(id){
            $location.path('model/'+id+'/view');
        }

        $scope.delectData = function(id){
            DataService.ajaxCompleteDelete(id).then(function(data){
                $scope.dataList(1)
            });
        }
        //分页
        $scope.updatePage = function(page){
            $scope.dataList(page.page);
        }

        $scope.dataList = function(page){
            DataService.ajaxCompleteDataList(page).then(function(data){
                if(data.page == null){
                    $scope.hasData = false;
                    return
                }

                //页面数据
                $scope.filterData = [        ];
                $scope.content = data;
                data.page.number++;
                for(var i = 0 ; i < data.page.content.length ; i++){
                    $scope.filterData.push({
                            name:data.page.content[i].name,
                            saveTime:data.page.content[i].saveTime,
                            analyzeName:data.page.content[i].analyzeName,
                            id:data.page.content[i].id
                    });
                }
            });
        }
        $scope.dataList(1)

    }]);