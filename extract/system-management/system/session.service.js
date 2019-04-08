angular.module('infi-basic')
  .service('Session', [function () {
    var Session = {},
      storage = window.localStorage;

    /**
     * 保存user和ticket数据
     * id,name,roles
     */
    Session.create = function (msg) {
      storage.setItem('user',JSON.stringify(msg.user));
        storage.setItem('ctoken',msg.ctoken);
    };

    Session.setRoles = function (roles) {
      var user = Session.getUser();
      user.roles = roles;
      storage.setItem('user',JSON.stringify(user));
    };
      
      Session.getCtoken = function () {
          var ctoken = storage.getItem('ctoken');
          return ctoken;
      }

    Session.hasRole = function (role) {
      var roles = Session.getUser().roles;
      angular.forEach(roles,function (userRole) {
        if( userRole == role ){
          return true;
        }
      });
      return false;
    };

    Session.getRoles = function () {
      return Session.getUser().roles;
    };

    Session.destroy = function () {
      storage.setItem('user',undefined);
        storage.setItem('ctoken',undefined);
    };

    Session.getUser = function () {
      var user = storage.getItem('user');
      user = user&&user!='undefined' ? JSON.parse(user) : {};

      return user;
    };

    Session.isAuthenticated = function () {
      return Session.getUser().id != undefined;
    };
    return Session;
  }]);
