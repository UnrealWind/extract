angular.module("infi-basic").controller('RetrievalController',['$scope','Utils','SYS','TaskService','TaskInteractiveService','$location',function ($scope,Utils,SYS,TaskService,TaskInteractiveService,$location) {
    $scope.SYS = SYS;
    $scope.keyword = "";  //输入的字段
    $scope.summaryData = null;  //查找到的数据
    $scope.keywordData = null;  //关键词列表
    $scope.detailData = {
        pageResult:{} //此处的值没有用,因为公用task的方法所以给此赋值
    };

    function init() {
        TaskService.getFrequentTerm().then(function (msg) {
            $scope.summaryData = msg;
            if(msg.status == $scope.SYS.STATUS_SUCCESS){
                // TaskInteractiveService.leftTabChoice($scope.summaryData.data[0],$scope.summaryData.data,$scope.detailData.pageResult);
                TaskInteractiveService.leftTabChoice($scope.summaryData.data,$scope.summaryData.data[0]);
            }
        });
        TaskService.getKeywordList().then(function (msg) {
            $scope.keywordData = msg;
        });
    }
    
    init();

    /**
     * 跳转到具体搜索页面
     * @param keyword
     * @param parent
     */
    $scope.searchData = function (keyword,parent) {
        if(parent){
            $location.path("retrieval-search/"+parent.label+" "+keyword);
        }else{
            $location.path("retrieval-search/"+keyword);
        }
    }
}]);