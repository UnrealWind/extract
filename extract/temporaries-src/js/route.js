angular.module('infi-basic').config(['$routeProvider',function ($routeProvider) {
    $routeProvider.
    when('/patient-list',{
        templateUrl:'/temporaries-src/html/patient-list.html',
        controller:'PatientListController'
    }).
    when('/consultations',{
        templateUrl:'/temporaries-src/html/consultation-analysis.html',
        controller:'ConsultationController'
    }).
    when('/consultations/:num',{
        templateUrl:'/temporaries-src/html/consultation-analysis.html',
        controller:'ConsultationController'
    }).
    when('/disease-analysis',{
        templateUrl:'/temporaries-src/html/disease-analysis.html',
        controller:'DiseaseAnalysisController'
    }).
    when('/login',{
        templateUrl:'../src/widget/system/html/login.html',
        controller:'LoginController'
    }).
    when('/overview/inhospital/:xlPatientId/:xlMedicalId/:id', {
        templateUrl: 'html/overview.inhospital.html',
        controller: 'OverInHospitalController'
    }).
    when('/overview/:xlPatientId/:id', {
        templateUrl: 'html/time.base.html',
        controller: 'TimeBaseController'
    }).
    otherwise({
        redirectTo: '/patient-list'
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