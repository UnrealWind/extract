angular.module('infi-basic')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/record/:filter__xlPatientId', {
            templateUrl: 'html/record.html',
            controller: 'RecordController'
        })
        .when('/record-list', {
            templateUrl: 'html/recordList.html',
            controller: 'RecordListController'
        })
        .when('/record-detail/:filter__xlPatientId/:filter__xlMedicalId', {
            templateUrl: 'html/record-detail.html',
            controller: 'RecordDetailController'
        })
        .when('/pati-profile/:filter__xlPatientId', {
            templateUrl: 'html/pati-profile.html',
            controller: 'PatiProfileSelfTestController'
        })
        .when('/pati-profile', {
            templateUrl: 'html/pati-profile.html',
            controller: 'PatiProfileController'
        })
        //login 的路由
        .when('/login',{
            templateUrl: '../src/widget/system/html/login.html',
            controller:'LoginController'
        })
        .otherwise({
            redirectTo: '/record-list'
        });
    }]);

 angular.module('infi-basic').run(['$rootScope', 'Session', 'SYS', function ($rootScope, Session, SYS) {
     $rootScope.$on('$routeChangeSuccess', checkUserAuth);

     function checkUserAuth() {
         return;
        if (!Session.isAuthenticated()) {
             $rootScope.$broadcast(SYS.STATUS_DO_LOGIN, true);
        }
     }
 }]);
