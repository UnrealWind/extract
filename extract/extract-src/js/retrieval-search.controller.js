angular.module("infi-basic").controller('RetrievalSearchController',['$scope','Utils','SYS','TaskService','$routeParams',function ($scope,Utils,SYS,TaskService,$routeParams) {
    $scope.SYS = SYS;
    $scope.keyword = $routeParams.keyword?$routeParams.keyword:"";  //输入的字段
    $scope.recordPage = null;  //查询到的数据
    $scope.recordNum = "...";

    function init() {
        $scope.search($scope.SYS.DEFAULT_PAGE_NUMBER);
    }

    /**
     * 分页查找内容
     * @param page
     */
    $scope.search = function (page) {
        $scope.searchLoad = true;  //显示正在查询提示
        $scope.recordNum = "...";
        TaskService.getRetrievalSearch($scope.keyword,page,$scope.SYS.DEFAULT_PAGE_SIZE).then(function (msg) {
            $scope.searchLoad = false;
            $scope.recordPage = msg;
            if(msg.status == $scope.SYS.STATUS_SUCCESS&&msg.data.length > 0){
                //点击其它页成功后回到页面顶部
                $('.infi-main').animate({scrollTop:0},'fast');
                $('html,body').animate({scrollTop:0},'fast');
                //设置搜索理由和诊断的展开和收起
                for(var idx=1;idx<msg.data.length;idx++){
                    var entity = msg.data[idx];
                    var reasonLength = entity.highlightField&&entity.highlightField.length > 150,
                        diagnoseLength = entity.diagnoseInfo&&entity.diagnoseInfo.length > 120;
                    if(reasonLength || diagnoseLength){
                        entity.optType = 'close';  //搜索理由和诊断默认收起
                        entity.iTitle = '展开';  //操作展开和收起的title提示,
                        //搜索理由默认显示150个字符,点击展开所有字符
                        reasonLength ? entity.$highlightField = entity.highlightField.substr(0,150)+'...' : entity.$highlightField = entity.highlightField;
                        //诊断默认显示120个字符,点击展开所有字符
                        diagnoseLength ? entity.$diagnoseInfo = entity.diagnoseInfo.substr(0,120)+'...'
                            : entity.$diagnoseInfo = entity.diagnoseInfo;
                    }
                    entity.complaintInfo == ''||!entity.complaintInfo ? entity.complaintInfo = '暂无数据' :undefined;
                }
                $scope.recordNum = $scope.recordPage.data[0].total;
            }
        });
    }

    /**
     * 控制搜索理由和诊断的展开和收起
     * @param entity  本条数据
     * @param type  要切换成的类型
     */
    $scope.optShow = function (entity) {
        entity.optType = entity.optType == 'close' ? 'open' : 'close';
        entity.iTitle = entity.optType == 'close' ? '展开' : '收起';
    }

    /**
     * 跳转到医疗数据库详情页面
     * @param entity
     */
    $scope.goToDetail = function (entity) {
        var path = 'http://'+window.location.hostname+':'+window.location.port;
        window.open(path + '/' + 'record-src/#/301/overview/inhospital/'+entity.xlPatientId+'/'
            +entity.xlMedicalId+'/'+entity.patiId);
    }

    init();
    // 注:用到的ng-bing-html需要加载angular-sanitize.js.但是此js的557行总是报错,所以将此行注释掉,目前功能可以正常使用,并无影响.
}]);