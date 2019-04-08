/**
 * Created by geqimeng on 17-11-14.
 */

//fydebug 如果不注入任何其他的东西的话，大括号里不能够有空字符串，
angular.module("infi-basic").controller('SearchController', ['$scope','SearchService','Page','$sce','$routeParams','ListInput',function($scope,SearchService,Page,$sce,$routeParams,ListInput){
    $scope.model = {
        hotWords: null,
        keyWords: null,
        tagWord: null,
        searchList: null,
        showMark: null,
        pageData : null,
        pageList:null
    }
    projectName = "Y0001";
    $scope.projectId = $routeParams.id;

    ListInput.getGroupData($scope.projectId).then(function (msg) {
        $scope.groupList = msg;
        if(msg.status == 'ok'){
            $scope.subjectGroupId = msg.data[0].id.toString();
        }
    });

    var updateSearchList = function(tagWord,val){
        SearchService.searchWords(tagWord,val,$scope.projectId,$scope.subjectGroupId).then(function(msg){
            if ( msg.status != 'ok'){
                msg.page = {};
                msg.page.totalElements =0;
            } else {
                for( var idx=0;idx<msg.page.content.length;idx++){
                    msg.page.content[idx].reason = $sce.trustAsHtml(msg.page.content[idx].reason);
                }
            }
            $scope.model.searchList = msg;
            $scope.model.pageData = msg.page;
            $scope.model.pageList = Page.genView($scope.model.pageData);

            $scope.model.showMark = 'searchList';

        });
    }

    //初始化热门关键字
    // SearchService.getHotWords().then(function(msg){
    //     $scope.model.hotWords = msg;
    //     $scope.model.showMark = 'searchOpt';
    // });

    //初始化关键词
    // SearchService.getKeyWords().then(function(msg){
    //     $scope.model.keyWords = msg;
    //     $scope.model.showMark = 'searchOpt';
    // });

    //改变导航
    $scope.changeNav = function(keyWord){
        SearchService.changeNav(keyWord,$scope.model.keyWords);
    };

    //搜索功能
    $scope.searchWords = function(tagWord){
        if(tagWord === null || tagWord === '' || tagWord === undefined){
            $scope.model.showMark = 'searchOpt';
            return false;
        }
        $scope.model.tagWord = tagWord;
        updateSearchList($scope.model.tagWord);
    }

    $scope.changePage = function(val){
        updateSearchList($scope.model.tagWord,val);
    };

    $scope.$root.project = { value: projectName};

    (function getProjectName(){

        if($.cookie('projectName') !== null){
            $scope.$root.project.value = $.cookie('projectName');
        }
    })();
    $scope.$watch('$root.project.value',function(newValue, oldValue){
        projectName = newValue;
        $scope.searchWords();
    });

    // 跳转到--多中心科研分析平台
    $scope.goToDetail = function (project,opt) {
        var path = 'http://'+window.location.hostname+':'+window.location.port;
        window.open(path + '/' + 'study-src/#/input-details/'+$scope.projectId+'/'+projectName+'/'+opt.recordId);
    }
}])
