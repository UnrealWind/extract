angular.module('infi-basic')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/subject-list', {
            templateUrl: '/scientific-research-src/html/subject-list.html',
            controller: 'SubjectListController'
        }).
        when('/record-input/:subjectId/:groupId/:recordId', {
            templateUrl: '/scientific-research-src/html/record-input.html',
            controller: 'RecordInputController'
        }).
        when('/record-input/:subjectId/:groupId/:recordId', {
            templateUrl: '/scientific-research-src/html/record-input.html',
            controller: 'RecordInputController'
        }).
        when('/record-list/:subjectId', {
            templateUrl: '/scientific-research-src/html/record-list.html',
            controller: 'RecordListController'
        }).
        when('/record-list/:subjectId/:groupId', {
            templateUrl: '/scientific-research-src/html/record-list.html',
            controller: 'RecordListController'
        }).
        when('/record-modify/:subjectId/:groupId/:recordId/:interviewId', {
            templateUrl: '/scientific-research-src/html/record-modify.html',
            controller: 'RecordModifyController'
        }).
        when('/subject-create/:subjectId', {
            templateUrl: '/scientific-research-src/html/subject-create.html',
            controller: 'SubjectCreateController'
        }).
        when('/subject-create/:subjectId/:flag', {
            templateUrl: '/scientific-research-src/html/subject-create.html',
            controller: 'SubjectCreateController'
        }).
        when('/subject-create/', {
            templateUrl: '/scientific-research-src/html/subject-create.html',
            controller: 'SubjectCreateController'
        }).
        when('/subject-member/:subjectId', {
            templateUrl: '/scientific-research-src/html/subject-member.html',
            controller: 'SubjectMemberController'
        }).
        when('/subject-member/:new/:subjectId', {
            templateUrl: '/scientific-research-src/html/subject-member.html',
            controller: 'SubjectMemberController'
        }).
        when('/subject-overview/:subjectId', {
            templateUrl: '/scientific-research-src/html/subject-overview.html',
            controller: 'SubjectOverviewController'
        }). when('/subject-news', {
            templateUrl: '/scientific-research-src/html/subject-news.html',
            controller: 'SubjectNewsController'
        }).
        when('/subject-detail/:subjectId', {
            templateUrl: '/scientific-research-src/html/subject-detail.html',
            controller: 'SubjectDetailController'
        }).
        when('/CRF-list',{
            templateUrl: '/scientific-research-src/html/CRF-list.html',
            controller: 'CrfListController'
        }).
        when('/CRF-customize/:id',{
            templateUrl: '/scientific-research-src/html/CRF-customize.html',
            controller: 'CrfCustomizeController'
        }).
        when('/CRF-propertyPage/:crfId/:id/:way',{
            templateUrl: '/scientific-research-src/html/CRF-propertyPage.html',
            controller: 'PropertyController'
        }).
        when('/CRF-view/:id',{
            templateUrl: '/scientific-research-src/html/CRF-view.html',
            controller: 'CrfViewController'
        }).
        when('/CRF-manage', {
            templateUrl: '/scientific-research-src/html/CRF-manage.template.html',
            controller: 'CRFManageController'
        }).
        otherwise({
            redirectTo: 'subject-list'
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
