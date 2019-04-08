angular.module('infi-basic')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/record', {
            templateUrl: 'html/record.html',
            controller: 'RecordController'
        }).
        //301统一视图列表页
        when('/301/record', {
            templateUrl: 'html/301/record.html',
            controller: 'RecordController'
        }).
        //时间轴页面
        when('/overview/:xlPatientId/:id', {
            templateUrl: 'html/time.base.html',
            controller: 'TimeBaseController'
        }).
        //301统一视图时间轴页面
        when('/301/overview/:xlPatientId/:id', {
            templateUrl: 'html/301/time.base.html',
            controller: 'TimeBaseController'
        }).
        //住院界面
        when('/overview/inhospital/:xlPatientId/:xlMedicalId/:id', {
            templateUrl: 'html/overview.inhospital.html',
            controller: 'OverInHospitalController'
        }).
        //301统一视图住院界面
        when('/301/overview/inhospital/:xlPatientId/:xlMedicalId/:id', {
            templateUrl: 'html/301/overview.inhospital.html',
            controller: 'OverInHospitalController'
        }).
        //门诊界面
        when('/overview/outpatient/:xlPatientId/:xlMedicalId/:id', {
            templateUrl: 'html/overview.outpatient.html',
            controller: 'overviewOutpatientController'
        }).
        //301统一视图门诊界面
        when('/301/overview/outpatient/:xlPatientId/:xlMedicalId/:id', {
            templateUrl: 'html/301/overview.outpatient.html',
            controller: 'overviewOutpatientController'
        }).
        //login 的路由
        when('/login', {
            templateUrl: '../src/widget/system/html/login.html',
            controller: 'LoginController'
        }).when('/login/:hospital', {
            templateUrl: '../src/widget/system/html/login.html',
            controller: 'LoginController'
        }).otherwise({
            // redirectTo: 'record'
            redirectTo: '301/record'
        });
    }]);
angular.module('infi-basic').run(['$rootScope', 'Session', 'SYS', function ($rootScope, Session, SYS) {
    $rootScope.$on('$routeChangeSuccess', checkUserAuth);

    function checkUserAuth() {
        if (!Session.isAuthenticated()) {
            $rootScope.$broadcast(SYS.STATUS_DO_LOGIN, true);
        }
    }
}]);
