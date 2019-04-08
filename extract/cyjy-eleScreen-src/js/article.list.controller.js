angular.module('infi-basic').controller('ArticleListController',['$scope','$location','SYS','$routeParams','IntervalService','$rootScope','ArticleListService',function ($scope,$location,SYS,$routeParams,IntervalService,$rootScope,ArticleListService) {

    $scope.params = {
        moduleType:$routeParams.moduleType,
        tab:$routeParams.currentTab
    };
    $scope.tabList = [];
    $scope.currentTab = "";

    $scope.switchTab = function(name){
        inter();
        $scope.currentTab  = name;
        angular.forEach($scope.tabList,function(tab){
            tab.active = false;
            if(tab.name == name){
                tab.active = true;
            }
        });
    };

    function init(){
        ArticleListService.getArticleList().then(function(msg){
            console.log(msg,11)
        })
        if($scope.params.moduleType == 'commonSense'){
            $scope.tabList = [
                {
                    name:'tab1',
                    label:'吸烟危害',
                    active:true
                },{
                    name:'tab2',
                    label:'戒烟的益处',
                    active:false
                },{
                    name:'relatedVideo',
                    label:'相关视频',
                    active:false
                }
            ]
            if($scope.params.tab){
                $scope.currentTab  = $scope.params.tab;
                $scope.switchTab($scope.currentTab);
            }else{
                $scope.currentTab  = $scope.tabList[0].name;
            }
        }else{
            $scope.tabList = [
                {
                    name:'tab4',
                    label:'科学戒烟',
                    active:true
                },{
                    name:'tab3',
                    label:'成功案例',
                    active:false
                },{
                    name:'relatedVideo',
                    label:'相关视频',
                    active:false
                }
            ]
            if($scope.params.tab){
                $scope.currentTab  = $scope.params.tab;
                $scope.switchTab($scope.currentTab);
            }else{
                $scope.currentTab  = $scope.tabList[0].name;
            }
        }
        $rootScope.intervalFun = IntervalService.setIntervalData($rootScope.intervalFun);
    }
    init();

    /**
     *
     */
    $scope.enterVideo = function(vSort,title,tab){
        inter();
        $location.path('video-show/'+$scope.params.moduleType+'/'+vSort+'/'+title+'/'+tab);
    };

    $scope.backFirst = function(){
        inter();
        $location.path('first-page');
    }

    /**
     * 进入文章详情页
     * @param moduleType
     */
    $scope.enterDetails = function(moduleType,aSort,title,tab){
        inter();
        if($scope.currentTab == 'relatedVideo'){
            $location.path('video-show');
        }else{
            $location.path('article-details/'+moduleType+'/'+aSort+'/'+title+'/'+tab)
        }
    }

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

    $('body').scroll(function(){
        IntervalService.clearInterval($rootScope.intervalFun);
        $scope.$apply();
    })
}]).service('ArticleListService',['$http','SYS',function($http,SYS){
    /**
     * 获取文章列表
     * @returns {*}
     */
    this.getArticleList = function(){
        return $http.get(SYS.url + 'article/page?filter_pageNo='+SYS.DEFAULT_PAGE_NUMBER+'&filter_pageSize='+SYS.DEFAULT_PAGE_SIZE).then(function(msg){
            return msg.data;
        })
    }
}]);