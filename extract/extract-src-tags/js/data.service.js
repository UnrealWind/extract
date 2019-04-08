/**
 * Created by geqimeng on 17-11-14.
 */
angular.module('infi-basic').service("DataService",['$http','SYS',function ($http,SYS) {
    this.getAllTags = function (filter) {
        return $http.get(SYS.url + 'kno/node/all?filter_deptId='+filter.deptId+'&filter_hospId='+filter.hospId).then(function (msg) {
            return msg.data;
        })
    }

    this.getDetailData = function (data) {
        return $http.post(SYS.url + 'kno/tag/show',data).then(function (msg) {
            return msg.data;
        })
    }

    this.deleteTagData = function (filter) {
        return $http.get(SYS.url + 'kno/tag/delete?id='+filter.entity.id+"&variety="+filter.caterage.variety).then(function (msg) {
            return msg.data;
        })
    }

    this.changeTagData = function (filter) {
        return $http.get(SYS.url + 'kno/tag/update?id='+filter.entity.id+"&variety="+filter.caterage.variety+"&name="+filter.name).then(function (msg) {
            return msg.data;
        })
    }
    
    this.getChildList = function (tagNode) {
        return $http.post(SYS.url + 'kno/tag/add/show',tagNode).then(function (msg) {
            return msg.data;
        })
    }

    this.addOtherTags = function (tagNode) {
        return $http.post(SYS.url + 'kno/tag/add',tagNode).then(function (msg) {
            return msg.data;
        })
    }
}]);
