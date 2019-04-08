angular.module('infi-basic').config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    //用户
    when('/user', {
        templateUrl: '/system-management/html/user.html',
        controller: 'UserController'
    }).
    //新建用户
    when('/userCreate', {
        templateUrl: '/system-management/html/user.create.html',
        controller: 'UserCreateController'
    }).
    //修改用户
    when('/userCreate/:type/:id', {
        templateUrl: '/system-management/html/user.create.html',
        controller: 'UserCreateController'
    }).
    //角色
    when('/role', {
        templateUrl: '/system-management/html/role.html',
        controller: 'RoleController'
    }).
    when('/title', {
        templateUrl: '/system-management/html/title.html',
        controller: 'TitleController'
    }).
    //修改角色
    when('/titleCreate/:type/:id', {
        templateUrl: '/system-management/html/title.create.html',
        controller: 'TitleCreateController'
    }).
    //新建角色
    when('/roleCreate', {
        templateUrl: '/system-management/html/role.create.html',
        controller: 'RoleCreateController'
    }).
    //修改角色
    when('/roleCreate/:type/:id', {
        templateUrl: '/system-management/html/role.create.html',
        controller: 'RoleCreateController'
    }).
    //菜单
    when('/menu', {
        templateUrl: '/system-management/html/menu.html',
        controller: 'MenuController'
    }).
    //新建顶级菜单
    when('/menuCreate', {
        templateUrl: '/system-management/html/menu.create.html',
        controller: 'MenuCreateController'
    }).
    //新建子集菜单（修改菜单）
    when('/menuCreate/:type/:id', {
        templateUrl: '/system-management/html/menu.create.html',
        controller: 'MenuCreateController'
    }).
    //菜单预览
    when('/view/:type', {
        templateUrl: '/system-management/html/menu.view.html',
        controller: 'MenuViewController'
    }).
    //机构
    when('/mechanism', {
        templateUrl: '/system-management/html/mechanism.html',
        controller: 'MechanismController'
    }).
    //新建子集机构（修改机构）
    when('/mechanismCreate/:type/:id', {
        templateUrl: '/system-management/html/mechanism.create.html',
        controller: 'MechanismCreateController'
    }).
    //新建顶级机构
    when('/mechanismCreate', {
        templateUrl: '/system-management/html/mechanism.create.html',
        controller: 'MechanismCreateController'
    }).
    when('/login',{
        templateUrl:'../src/widget/system/html/login.html',
        controller:'LoginController'
    }).
    otherwise({
        redirectTo: '/user'
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