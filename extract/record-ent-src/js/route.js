app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/list', {
        templateUrl: '/record-ent-src/html/list.html',
        controller: 'ListController'
      }).
      when('/details', {
        templateUrl: '/record-ent-src/html/view.html',
        controller: 'ViewController'
      }).
      when('/input/:recordId',{
        templateUrl: '/record-ent-src/html/record.input.html',
        controller: 'InputController'
      }).
      when('/input',{
        templateUrl: '/record-ent-src/html/record.input.html',
        controller: 'InputController'
      }).
    when('/test',{
      templateUrl: '/record-ent-src/html/record.input.test.html',
      controller: 'InputController'
    }).//login 的路由
      when('/login', {
      templateUrl: 'login.html',
      controller: 'LoginController'
    }).otherwise({
      redirectTo: 'list'
    });
  }]);
angular.module('infi-basic').run(['$rootScope', 'Session', 'SYS', function ($rootScope, Session, SYS) {
  // $rootScope.$on('$routeChangeSuccess', checkUserAuth);
  //
  // function checkUserAuth() {
  //   if (!Session.isAuthenticated()) {
  //     $rootScope.$broadcast(SYS.STATUS_DO_LOGIN, true);
  //   }
  // }
}]);
