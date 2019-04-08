angular.module('infi-basic')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/data.select', {//数据选择页
            templateUrl: '/analysis-src/html/data.select.html',
            controller: 'DataSelectController'
        }).
        when('/data.select.detail/:id', {//数据选择页 --> 选择(原始数据)
            templateUrl: '/analysis-src/html/data.select.detail.html',
            controller: 'DataSelectDetailController'
        }).
        when('/data.select.detail/:id/:modify', {//数据选择页 --> 选择(修改后数据)
            templateUrl: '/analysis-src/html/data.select.detail.html',
            controller: 'DataSelectDetailController'
        }).
        when('/variable.set/:id', {//变量设置页
            templateUrl: '/analysis-src/html/variable.set.html',
            controller: 'VariableSetController'
        }).
        when('/data.pretreatment/:id', {//数据处理页的空值处理页
            templateUrl: '/analysis-src/html/data.pretreatment.html',
            controller: 'DataPretreatmentController'
        }).
        when('/data.pretreatment.abnormal', {//数据处理页的异常值处理页
            templateUrl: '/analysis-src/html/data.pretreatment.abnormal.html',
            controller: 'DataPretreatmentAbnormalController'
        }).
        // when('/filter.set', {
        //     templateUrl: '/analysis-src/html/filter.set.html',
        //     controller: 'FilterSetController'
        // }).
        when('/filter.set/:id', {
            templateUrl: '/analysis-src/html/filter.set.html',
            controller: 'FilterSetController'
        }).
        when('/filter.set.detail/:id/:sy/:dz', {
            templateUrl: '/analysis-src/html/filter.set.detail.html',
            controller: 'FilterSetDetailController'
        }).
        // when('/model', {
        //     templateUrl: '/analysis-src/html/model.html',
        //     controller: 'ModelController'
        // }).
        when('/model/:id/:sy/:dz', {
            templateUrl: '/analysis-src/html/model.html',
            controller: 'ModelController'
        }).
        when('/model/:id/:view', {
            templateUrl: '/analysis-src/html/model.html',
            controller: 'ModelController'
        }).
        when('/complete', {
            templateUrl: '/analysis-src/html/complete.html',
            controller: 'CompleteController'
        }).
        when('/data.select.exploration/:id', {
            templateUrl: '/analysis-src/html/data.select.exploration.html',
            controller: 'dataSelectExplorationController'
        }).
        when('/data.select.exploration/:id/:modify', {
            templateUrl: '/analysis-src/html/data.select.exploration.html',
            controller: 'dataSelectExplorationController'
        }).
        when('/filter.set.exploration/:id', {
            templateUrl: '/analysis-src/html/filter.set.exploration.html',
            controller: 'filterSetExplorationController'
        }).
        // when('/login', {
        //     templateUrl: '/analysis-src/html/login.html',
        //     controller: 'LoginController'
        // }).
        when('/login', {
            templateUrl: '/src/widget/system/html/login.html',
            controller: 'LoginController'
        }).
        otherwise({
            redirectTo: 'data.select'
        });
    }]);
    angular.module('infi-basic')
        .run(['$rootScope','Session','SYS',function ($rootScope,Session,SYS) {
        $rootScope.$on('$routeChangeSuccess', checkUserAuth);

        function checkUserAuth() {
            if( !Session.isAuthenticated() ){
                $rootScope.$broadcast(SYS.STATUS_DO_LOGIN,true);
            }
        }
    }]);

