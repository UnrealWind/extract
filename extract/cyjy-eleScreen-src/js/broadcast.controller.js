angular.module('infi-basic').controller('BroadcastController',['$scope','$location','SYS','IntervalService','$rootScope',function ($scope,$location,SYS,IntervalService,$rootScope) {
    $scope.showMore = function(){
        $location.path('first-page');
    }
    IntervalService.clearInterval($rootScope.intervalFun);
}]);