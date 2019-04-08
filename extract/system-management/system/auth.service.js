angular.module('infi-basic')
  .service('AuthService',['$http','SYS','Session',function($http,SYS,Session){
    var authService = {};

    authService.login = function (credentials) {
      Session.destroy();
        var url = SYS.url+'login';
      return $http({
          method:'post',
          url:url,
          headers: {'eu':credentials.eu,'ep':credentials.ep}
      })
        .then(function (res) {
          if( res.data && res.data.data && SYS.STATUS_AUTH_PASSED == res.data.data.status ){
              Session.create(res.data.data.userInfo);  //设置eu,ep和ctoken
              return res.data;
          } else {
            //res.data.description
            // zjl_debug 后台应该优化提示语句
            credentials.error = '用户名或密码错误,请重新填写';
          }
        });
    };

    authService.logout = function (credentials) {
      var ctoken = Session.getCtoken();
      Session.destroy();
      var url = SYS.url+'logout?ctoken='+ctoken;
      return $http.post(url)
        .then(function success(res) {
            
        });
    };

    return authService;
  }]);
