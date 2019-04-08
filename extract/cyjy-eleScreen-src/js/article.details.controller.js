angular.module('infi-basic').controller('ArticleDetailsController',['$scope','$location','SYS','IntervalService','$routeParams','ArticleDetailsService','$rootScope',function ($scope,$location,SYS,IntervalService,$routeParams,ArticleDetailsService,$rootScope) {
    $scope.params = {
        moduleType:$routeParams.moduleType,
        aSort:$routeParams.aSort,
        title:$routeParams.title,
        tab:$routeParams.currentTab
    };
    $scope.articleJson = null;

    function init(){
        // ArticleDetailsService.getArticle($scope.params).then(function(msg){
        //     $scope.articleJson = msg.data;
            // $('.details').html(msg.data);
        // })
        $rootScope.intervalFun = IntervalService.setIntervalData($rootScope.intervalFun);
    }
    init();

    /**
     * 返回
     */
    $scope.back = function(){
        // history.go(-1);
        if($scope.params.moduleType =='takeMedicine' || $scope.params.moduleType =='visit'){
            $location.path('first-page');
        }else{
            $location.path('article-list/'+$scope.params.moduleType+'/'+$scope.params.tab)
        }
    }

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
}]).service('ArticleDetailsService',['$http','SYS',function($http,SYS){
    /**
     *
     */
    this.getArticle = function(filter){
        return $http.get(SYS.localUrl+filter.aSort+'.json').then(function(msg){
            return msg.data;
        })
    }
}]);