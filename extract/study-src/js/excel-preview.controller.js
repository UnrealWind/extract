angular.module('infi-basic')
    .controller('ExcelPreviewController', ['$scope','$rootScope','$routeParams','DataService','$location','SYS',function ($scope,$rootScope,$routeParams,DataService,$location,SYS) {

        $scope.excelTable = [];
        $scope.excelTbody = [];
        $scope.tbodyData = [];
        $scope.hasData = false;
        DataService.ajaxExcelPreview($routeParams.groupId).then(function(data){
            // console.log(data.data);
            if(data.data.status == 'ok'){
                $scope.hasData = true;
                var a = 1;
                angular.forEach(data.data.data,function(val,key){
                    if(a ==1 ) {
                        for (var i = 0; i < val.length; i++) {
                            $scope.excelTable.push({name: val[i].label})
                        }
                        ++a;
                    }

                    $scope.excelTbody = [];
                    for (var i = 0; i < val.length; i++) {
                        $scope.excelTbody.push({name: val[i].value})
                    }
                    $scope.tbodyData.push($scope.excelTbody);
                });
            }else{
                $scope.hasData = false;
            }
        })
        $scope.generate = function(){
            DataService.ajaxGenerate($routeParams.id,$routeParams.groupId).then(function(data){
                console.log(data);
                // location.href = 'http://localhost:8080/study-src/#/cases-input/37';
                $location.path('cases-input/'+$routeParams.id);
            })
        }
        
    }]);