angular.module('infi-basic')
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        .when('/record-collect/:right/:recordId/:xlPatientId/:xlVisitId/:patientId/:templateId', {
            templateUrl: 'html/record-collect.html',
            controller: 'RecordCollectController'
        })
        .when('/record-collect/:right/:recordId/:xlPatientId/:xlVisitId/:patientId/:templateId/:hideR', {
            templateUrl: 'html/record-collect.html',
            controller: 'RecordCollectController'
        })
        .when('/view-pdf/:id/:type',{
            templateUrl:'html/disease.pdf.html',
            controller:'diseasePdfController'
        })
        .when('/record-list',{
            templateUrl:'html/record.list.html',
            controller:'RecordListController'
        })
        .when('/record-list/:hideR',{
            templateUrl:'html/record.list.html',
            controller:'RecordListController'
        })
        .when('/record-check-list',{
            templateUrl:'html/record.check.list.html',
            controller:'RecordCheckListController'
        })
        .when('/record-check-collect/:id',{
            templateUrl:'html/record.check.collect.html',
            controller:'RecordCheckCollectController'
        })
        .when('/record-check-collect/:id/:view',{
            templateUrl:'html/record.check.collect.html',
            controller:'RecordCheckCollectController'
        })
        .when('/print/:type',{
            templateUrl:'html/print.html',
            controller:'PrintController'
        })
        .otherwise({
            redirectTo: '/record-list/1'
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
