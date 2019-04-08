angular.module('infi-basic')
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/consultationInput/:recordId/:plugin/:docId/:role',{
        templateUrl:'../teleconsultation-src/html/consultation.input.html',
        controller:'ConsultationInput'
    }).
     when('/consultationDetail/:recordId/:plugin/:docId/:role',{
        templateUrl:'../teleconsultation-src/html/consultation.detail.html',
        controller:'ConsultationInput'
    }).
    when('/consultation-list',{
        templateUrl:'../teleconsultation-src/html/consultation.list.html',
        controller:'ConsultationList'
    }).
    when('/consultation-experts/:recordId/:detail',{
        templateUrl:'../teleconsultation-src/html/consultation.experts.html',
        controller:'ExpertsController'
    }).
    when('/login',{
        templateUrl: '../src/widget/system/html/login.html',
        controller:'LoginController'
    }).
    otherwise({
        redirectTo: '/consultation-list'
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
