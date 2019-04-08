angular.module('infi-basic')
    .service('DataService',['$http','SYS',function($http,SYS) {

        this.ajaxRawDataModal = function(){
            return $http({
                method:'get',
                url:'data/data.select1.json'
            }).then(function(data){
                return data.data;
            });
        }
        this.ajaxDataFilterPage = function(data){
            if(!data){
                data = 1;
            }
            return $http({
                method:'get',
                url:'data/zongdata.'+data+'.json'
            }).then(function(data){
                return data.data;
            });
        }
        this.ajaxDataSelectPage = function(data){
            return $http({
                method:'get',
                url:'data/data.'+data+'.json'
            }).then(function(data){
                return data.data;
            });
        }
        this.ajaxshiyanzuModal = function(){
            return $http({
                method:'get',
                url:'data/shiyanzu.json'
            }).then(function(data){
                return data.data;
            });
        }
        this.ajaxduizhaozuModal = function(){
            return $http({
                method:'get',
                url:'data/duizhaozu.json'
            }).then(function(data){
                return data.data;
            });
        }
    }]);