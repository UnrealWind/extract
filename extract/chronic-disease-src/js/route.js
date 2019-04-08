angular.module('infi-basic')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/list', {
            templateUrl: '/chronic-disease-src/html/list.html',
            controller: 'ListController'
        }).
        when('/scaleEnter/:diseaseId/:projectId/:pid/:interviewId', {
            templateUrl: '/chronic-disease-src/html/scaleEnter.html',
            controller: 'ScaleEnterController'
        }).
        when('/patiManage/:diseaseId/:projectId/:pid', {
            templateUrl: '/chronic-disease-src/html/patiManage.html',
            controller: 'PatiManageController'
        }).
        when('/timeline', {
            templateUrl: '/chronic-disease-src/html/timeline.html',
            controller: 'TimeLineController'
        }).
        when('/unitView', {
            templateUrl: '/chronic-disease-src/html/unitView.html',
            controller: 'UnitViewController'
        }).
        otherwise({
            redirectTo: '/list'
        });
    }]);

// angular.module('infi-basic').run(['$rootScope','Session','SYS',function ($rootScope,Session,SYS) {
//     $rootScope.$on('$routeChangeSuccess', checkUserAuth);

//     function checkUserAuth() {
//         return;
//         if( !Session.isAuthenticated() ){
//             $rootScope.$broadcast(SYS.STATUS_DO_LOGIN,true);
//         }
//     }
// }]);