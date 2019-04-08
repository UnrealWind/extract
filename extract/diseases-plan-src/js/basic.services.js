angular.module('infi-basic')
	.service('BasicServices',
	['$http','SYS',function($http,SYS){
	
	this.getData = function(opt){
		return $http({
            url: opt.url,
            data:opt.data,
            method: opt.method
        }).then(function success(msg){
            return msg.data;
        });
	}

}]); 