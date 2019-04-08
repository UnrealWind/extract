angular.module("infi-basic").controller('moduleStatisticsController', ['$scope','SYS','$http','$routeParams','$timeout','BasicService','$filter',
    function ($scope,SYS,$http,$routeParams,$timeout,BasicService,$filter) {

        $scope.wardId = '';
        $scope.endTime = $filter('date')(new Date(),'yyyy-MM-dd');
        $scope.startTime = $filter('date')(new Date()-7*24*3600*1000,'yyyy-MM-dd');


        $scope.updatePageAttend = function(number){
            $scope.getStatisticsPage(number,10);
        }
        
        $scope.getStatisticsPage = function(number,size){
            BasicService.getStatisticsPage(number,size).then(function (data) {
                if(data.status == SYS.STATUS_SUCCESS){
                    $scope.statisticsList = data.page.content;
                    $scope.statisticsPage = data.page;
                    $scope.statisticsPage.number ++;
                }
            })
        }
        ;(function () {
            $scope.getStatisticsPage(1,10);
            BasicService.getWardsList().then(function (data) {
                data.status == 'ok'?function(){
                    if(data.data.length > 1){
                        data.data.unshift({
                            label: '全部',
                            value: ''
                        });
                    }
                    $scope.wards = data.data;
                    $scope.wardId = $scope.wards[0]["value"];
                }():'';
            });
        })();
        $scope.addStatisticsData  = function () {
            BasicService.addStatisticsData($scope.startTime,$scope.endTime,$scope.wardId).then(function (data) {
                data.status == 'ok'?$scope.getStatisticsPage(1,10):'';
            });
            BasicService.downloadExcel($scope.startTime,$scope.endTime,$scope.wardId);
        }
        $scope.goBack = function () {
            location.href = '#/daily-report'
        }
    }]);