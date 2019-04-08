
//https://blog.coding.net/blog/techniques-for-authentication-in-angular-js-applications?type=hot
// http://www.jdon.com/46055
// http://www.open-open.com/lib/view/open1398335709171.html

angular.module('infi-basic')
    .controller('LoginController',["$scope","$rootScope","AuthService","SYS","Session","$location", function ($scope, $rootScope, AuthService,SYS,Session,$location) {
        $scope.SYS = SYS;
        $scope.credentials = {
            username: '',
            password: '',
            eu: '',
            ep: ''
        };
        $scope.credentials.name = Session.getUser().name;
        $scope.path = 'http://'+window.location.hostname+':'+window.location.port;
        //统一跳一个登录
        $scope.loginUrl = $scope.path +'/system-management/#/login';

        $scope.$on(SYS.STATUS_DO_LOGIN,function (data) {
            if( !Session.isAuthenticated() ){
                // $location.path('login');
                window.location.href = $scope.loginUrl;
            }
        });

        $scope.loginHeader = true;
        $scope.login = function () {
            var credentials = $scope.credentials;
            credentials.eu = md5(credentials.username);
            credentials.ep = md5(credentials.password);
            AuthService.login(credentials).then(function (msg) {
                $rootScope.$broadcast(SYS.STATUS_DO_LOGIN,msg);
                $scope.credentials.name = Session.getUser().name;

                $scope.url = $scope.path + '/' + Session.getAfterLoginUrl();

                window.location.href = $scope.url;

                // $location.path('welcome');
                // $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                // $scope.setCurrentUser(user);

                //ljy_debug这个地方为了解决,用户登录页面之后登录名还是之前用户名的问题,临时加了一个刷新页面解决该问题,后期需要进行优化;
                //location.reload();
            }, function () {
                // $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                $scope.loginHeader = false;
            });
        };

        $scope.logout = function () {
            AuthService.logout($scope.credentials);
            $rootScope.$broadcast(SYS.ROLES_READY,false);
            // $location.path('login');
            window.location.href = $scope.loginUrl;
            $rootScope.$broadcast($scope.naviData,false);
        }
    }]);
