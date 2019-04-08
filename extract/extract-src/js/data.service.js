angular.module('infi-basic')
    .service('DataService',['$http','SYS',function($http,SYS){
        this.ajaxList = function(filter){
            return $http.get('data/list.json').then(function(data){
                return data.data;
            });
        }

        this.ajaxColumns = function(name){
            return $http.get('data/'+name+'.columns.json').then(function(data){
                return data.data;
            });
        }

        this.ajaxHome = function () {
            return $http.get(SYS.url + "config/tree/select/menu").then(function(msg){
                return msg.data;
            });
        }
    }]);