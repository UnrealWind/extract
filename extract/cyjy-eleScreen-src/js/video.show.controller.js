angular.module('infi-basic').controller('VideoShowController',['$scope','$location','SYS','$routeParams','IntervalService','$rootScope',function ($scope,$location,SYS,$routeParams,IntervalService,$rootScope) {


    $scope.params = {
        moduleType:$routeParams.moduleType,
        vSort:$routeParams.vSort,
        title:$routeParams.title,
        tab:$routeParams.currentTab
    };
    function init(){

        document.getElementById("myVideo").src = "../data/video/"+$scope.params.vSort;
        var video = document.getElementById("myVideo");
        video.onpause = function(){
            $rootScope.intervalFun = IntervalService.setIntervalData1($rootScope.intervalFun);
        };
        video.onplay = function(){
            IntervalService.clearInterval($rootScope.intervalFun);
        };
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
    $scope.back =function(){
        inter();
        // history.go(-1);
        if($scope.params.moduleType =='takeMedicine' || $scope.params.moduleType =='visit'){
            $location.path('first-page');
        }else{
            $location.path('article-list/'+$scope.params.moduleType+'/'+$scope.params.tab)
        }
    };

    //页面离开时清除监控,否则会一直执行
    $scope.$on("$destroy", function() {
        IntervalService.clearInterval($rootScope.intervalFun);
    });
    $scope.$on("$routeChangeSuccess",function(){
        inter();
    })
    function inter(){
        IntervalService.clearInterval($rootScope.intervalFun);
        $rootScope.intervalFun = IntervalService.setIntervalData1($rootScope.intervalFun);

    }

}]);