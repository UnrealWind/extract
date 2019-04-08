angular.module('infi-basic')
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/disease-list/:type',{
        templateUrl:'../diseases-plan-src/html/disease.list.html',
        controller:'diseaseList'
    }).
    when('/disease-list',{
        templateUrl:'../diseases-plan-src/html/disease.list.html',
        controller:'diseaseList'
    }).
    when('/disease-input/:pati_id/:pati_visit_id/:class_id/:type',{
        templateUrl:'../diseases-plan-src/html/disease.input.html',
        controller:'diseaseInput'
    }).
    when('/disease-plan-list/:pati_id/:pati_visit_id/:class_id/:type',{
        templateUrl:'../diseases-plan-src/html/disease.plan.list.html',
        controller:'diseasePlanListController'
    }).
    when('/disease-plan-detail/:pati_id/:pati_visit_id/:recordId/:planId/:class_id/:type',{
        templateUrl:'../diseases-plan-src/html/disease.plan.detail.html',
        controller:'diseasePlanDetailController'
    }).
    when('/disease-pdf/:type/:literature/:planType/:pageNum',{
        templateUrl:'../diseases-plan-src/html/disease.pdf.html',
        controller:'diseasePdfController'
    }).
     when('/login',{
         templateUrl: '../src/widget/system/html/login.html',
         controller:'LoginController'
     }).
    otherwise({
        redirectTo: '/disease-list'
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
