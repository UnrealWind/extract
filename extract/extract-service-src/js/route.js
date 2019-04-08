angular.module('infi-basic')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/task-service', {  //新建规则的条件选取
            templateUrl: '/extract-service-src/html/task.html',
            controller: 'TaskController'
        }).
        when('/task-service/:groupId', {  //新建规则的返回条件选取
            templateUrl: '/extract-service-src/html/task.html',
            controller: 'TaskController'
        }).
        when('/task-service/:type/:groupId', {  //新建任务的条件选取
            templateUrl: '/extract-service-src/html/task.html',
            controller: 'TaskController'
        }).
        // when('/task-service/:type/:ruleId/:groupId', {  //新建任务的返回条件选取
        //     templateUrl: '/extract-service-src/html/task.html',
        //     controller: 'TaskController'
        // }).
        when('/task-configuration/:groupId', {  //新建规则的逻辑配置
            templateUrl: '/extract-service-src/html/task-configuration.html',
            controller: 'TaskConfigurationController'
        }).
        when('/task-configuration/:type/:groupId', {  //新建任务的逻辑配置
            templateUrl: '/extract-service-src/html/task-configuration.html',
            controller: 'TaskConfigurationController'
        }).
        when('/rule-save/:groupId', {  //保存规则页面
            templateUrl: '/extract-service-src/html/rule-save.html',
            controller: 'RuleSaveController'
        }).
        when('/recommend-list', {  //推荐任务列表implement-list
            templateUrl: '/extract-service-src/html/recommend-list.html',
            controller: 'RecommendListController'
        }).
        when('/implement-list', {  //执行任务列表
            templateUrl: '/extract-service-src/html/implement-list.html',
            controller: 'ImplementListController'
        }).
        when('/implement-detail/:id', {  //执行详情
            templateUrl: '/extract-service-src/html/implement-detail.html',
            controller: 'ImplementDetailController'
        }).
        when('/select-rule', {  //创建推荐任务的规则列表
            templateUrl: '/extract-service-src/html/select-rule.html',
            controller: 'SelectRuleController'
        }).
        when('/result-rule/:type/:optType/:groupId', {  //推送结果
            templateUrl: '/extract-service-src/html/result-rule.html',
            controller: 'ResultRuleController'
        }).
        when('/result-rule/:type/:optType/:groupId/:impId', {  //推送结果
            templateUrl: '/extract-service-src/html/result-rule.html',
            controller: 'ResultRuleController'
        }).
        when('/rule-list',{  //规则列表
            templateUrl: '/extract-service-src/html/rule-list.html',
            controller: 'RuleListController'
        }).
        when('/rule-detail/:viewType/:id',{  //规则详情列表
            templateUrl: '/extract-service-src/html/rule-detail.html',
            controller:'RuleDetailController'
        }).
        when('/login',{
            templateUrl:'../src/widget/system/html/login.html',
            controller:'LoginController'
        }).
        otherwise({
            redirectTo: '/rule-list'
        });
    }]);

angular.module('infi-basic').run(['$rootScope','Session','SYS',function ($rootScope,Session,SYS) {
    $rootScope.$on('$routeChangeSuccess', checkUserAuth);

    function checkUserAuth() {
        if( !Session.isAuthenticated() ){
            $rootScope.$broadcast(SYS.STATUS_DO_LOGIN,true);
        }
    }
}]);