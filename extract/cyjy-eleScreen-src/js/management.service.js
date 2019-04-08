angular.module('infi-basic').service('ManagementService',['$http','SYS',function($http,SYS){
    /**
     * 保存文章
     * @param list
     * @returns {*}
     */
    this.saveArticle = function(list){
        return $http.post(SYS.url + 'article/save',list).then(function(msg){
            return msg.data;
        })
    };

    /**
     * 保存轮播图
     * @returns {*}
     */
    this.saveRollImg = function(){
        return $http.post(SYS.url + 'round/save',list).then(function(msg){
            return msg.data;
        })
    };

    /**
     * 获取内容管理页分业数据
     */
    this.getPage = function(page){
        return $http.get(SYS.url + 'content/page?filter_pageNo='+page+'&filter_pageSize='+SYS.DEFAULT_PAGE_SIZE).then(function (msg) {
            return msg.data;
        })
    }
}]);