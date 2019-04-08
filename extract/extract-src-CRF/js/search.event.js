/**
 * Created by geqimeng on 17-11-14.
 */

angular.module("infi-basic").service('SearchService',['$http','SYS',function($http,SYS){

    this.getHotWords = function(){
        return $http({
            method: 'get',
            url: SYS.url+'resources/data/search/hotWords.json'
        }).then(function(msg){
            return msg.data.data.hotWords;
        });
    }

    this.getKeyWords = function(){
        return $http({
            method: 'get',
            url: SYS.url+'resources/data/search/keyWords.json'
            //url: SYS.url+'keywords'+projectName
        }).then(function(msg){

            //初始化的时候需要增加navshow的标示,默认第一个为true   其他为false
            msg.data.data.keyWords.forEach(function(n,i){
                n.show = false;
            });
            msg.data.data.keyWords[0].show = true;
            return msg.data.data.keyWords;
        });
    }

    this.changeNav = function(keyWord,keyWords){
        keyWords.forEach(function(n,i){
            n.show = false;
        });
        keyWord.show = true;
    }

    this.searchWords = function(tagWord,val,projectId,projectGroupId){
        if(!val){
            val = 1;
        }
        return $http({
            url: SYS.url+'search/page/'+projectId+'/'+projectGroupId,
            //url: SYS.url+'/resources/data/search/searchOpt.json',
            //method: 'POST',
            method: 'get',
            params: {'tagWord':tagWord,'page_number':val,'page_size':5}
        })
            .then(function(msg){
                return msg.data;
            });
    }
}])

angular.module("infi-basic").factory('SearchEvent',function(){
    var factory = {};

    return factory;

});
