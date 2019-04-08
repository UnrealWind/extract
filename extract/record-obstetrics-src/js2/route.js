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
        // 创建产科档案
        when('/record/input/:xlPatientId/:id/first', {
            templateUrl: 'html/record.input.first.html',
            controller: 'RecordInputFirstController'
        }).//查看具体产科档案
        when('/record/input/:xlPatientId/:xlMedicalId/:id/first', {
            templateUrl: 'html/record.input.first.html',
            controller: 'RecordInputFirstController'
        }).//查看孕检档案
        when('/record/input/second/:xlPatientId/:xlMedicalId/:id', {
            templateUrl: 'html/record.input.second.html',
            controller: 'RecordInputSecondController'
        }).//孕检档案打印
        when('/output/pregnancy/:xlPatientId/:xlMedicalId/:id/:archiveId', {
            templateUrl: 'html/output/pregnancy.output.html',
            controller: 'RecordInputSecondController'
        }).//查看产妇和婴儿信息
        when('/record/input/:xlPatientId/:xlMedicalId/:id/third', {
            templateUrl: 'html/record.input.third.html',
            controller: 'RecordInputThirdController'
        }).when('/overview/obstetrics/:xlPatientId/:xlMedicalId/:id', {
            templateUrl: 'html/overview.obstetrics.html',
            controller: 'OverviewController'
        }).//产科档案打印
        when('/output/obstetrics/:xlPatientId/:xlMedicalId/:id', {
            templateUrl: 'html/output/obstetrics.output.html',
            controller: 'OverviewController'
        }).
        //login 的路由
        when('/login', {
            templateUrl: '../src/widget/system/html/login.html',
            controller: 'LoginController'
        }).when('/login/:hospital', {
            templateUrl: '../src/widget/system/html/login.html',
            controller: 'LoginController'
        }).otherwise({
            redirectTo: 'record'
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
