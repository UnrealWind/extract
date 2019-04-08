angular.module('infi-basic')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/list', {
            templateUrl: '/chronic-disease-V2-src/html/list.html',
            controller: 'ListController'
        }).
        /**
         * CRF 录入页：基线信息
         * params: <depId> 患者 id
         *         <groupId> 护理组 id
         *         <interviewId> 
         *         <crfTemplateId>
         *         <entry> 入口点 0: 新建患者； 1: 患者管理页的基本信息； 2: 患者管理页的评估(非第一次)； 3： 患者管理页的评估(第一次)
         */ 
        when('/scaleEnter/:depId/:groupId/:interviewId/:crfTemplateId/:entry', {
            templateUrl: '/chronic-disease-V2-src/html/scaleEnter.html',
            controller: 'ScaleEnterController'
        }).
        /**
         * 患者管理页
         * param: <depId> 患者唯一标示
         */
        when('/patiManage/:depId', {
            templateUrl: '/chronic-disease-V2-src/html/patiManage.html',
            controller: 'PatiManageController'
        }).
        /**
         * 查看评估结果页
         * param: <depId> 患者 Id
         *        <groupId> 护理组 id
         *        <interviewId> interviewId
         */
        when('/viewEvaluateRst/:depId/:groupId/:interviewId/:crfTemplateId', {
            templateUrl: '/chronic-disease-V2-src/html/viewEvaluateRst.html',
            controller: 'ViewEvaluateRstController'
        }).
        /**
         * 调整方案页
         * param: <depId> 患者 depId
         *        <groupId> 护理组Id groupId
         */
        when('/editPlan/:depId/:groupId', {
            templateUrl: '/chronic-disease-V2-src/html/editPlan.html',
            controller: 'EditPlanController'
        }).
        // 历史统计页面
        when('/historyCount', {
            templateUrl: '/chronic-disease-V2-src/html/historyCount.html',
            controller: 'HistoryCountController'
        }).
        otherwise({
            redirectTo: '/list'
        });
    }]);

angular.module('infi-basic').run(['$rootScope','Session','SYS',function ($rootScope,Session,SYS) {
    $rootScope.$on('$routeChangeSuccess', checkUserAuth);

    function checkUserAuth() {
        return;
        if( !Session.isAuthenticated() ){
            $rootScope.$broadcast(SYS.STATUS_DO_LOGIN,true);
        }
    }
}]);