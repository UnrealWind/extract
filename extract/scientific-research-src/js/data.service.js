angular.module('infi-basic')
    .service('DataService',['$http','SYS',function($http,SYS){
    //用户信息
    this.ajaxUserInfo = function(){
        return $http({
            method:'get',
            url:SYS.url+'subject/attend/detail/user'
        }).then(function(data){
            return data;
        });
    }

}]);