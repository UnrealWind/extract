angular.module('infi-basic').controller('FirstPageController',['$scope','$location','SYS','IntervalService','$rootScope',function ($scope,$location,SYS,IntervalService,$rootScope) {

    function init(){
        $rootScope.intervalFun = IntervalService.setIntervalData($rootScope.intervalFun);
    }
    init();

    /**
     * 进入文章列表页
     * @param moduleType
     */
    $scope.enterList = function (moduleType) {
        inter();
        $location.path('article-list/'+moduleType);
    };
    /**
     * 进入文章详情页
     * @param moduleType
     */
    $scope.enterDetails = function (moduleType,aSort,title) {
        inter();
        $location.path('article-details/'+moduleType+'/'+aSort+'/'+title);
    };


    //页面离开时清除监控,否则会一直执行
    $scope.$on("$destroy", function() {
        IntervalService.clearInterval($rootScope.intervalFun);
    })
    $scope.$on("$routeChangeSuccess",function(){
        inter();
    })
    function inter(){
        IntervalService.clearInterval($rootScope.intervalFun);
        $rootScope.intervalFun = IntervalService.setIntervalData($rootScope.intervalFun);

    }
}]);