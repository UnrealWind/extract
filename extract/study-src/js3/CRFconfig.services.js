
angular.module('infi-basic').service('crfConfigServices',['$http','SYS','$routeParams','Session',function($http,SYS,$routeParams,Session){
    this.getCRFinitData = function(opt){
        var that = this;
        var url = SYS.url+'crf/sys/tree';
        return $http({
            url:url,
            method: 'get',
            params: ''
        }).then(function(msg){
            return that.fixCRFinitData(msg);
        })
    }

    this.fixCRFinitData = function (msg) {
        fix(msg.data.data);
        function fix(arr) {
            arr.forEach(function (n,i) {
                n.arrow = 'right';
                n.children && n.children.length>0?fix(n.children):undefined;
            })
        }
        return msg.data;
    }

    this.saveChild = function (opt) {
        var that = this;
        var url = SYS.url+'crf/sys/one';
        console.log(opt);
        return $http({
            url:url,
            method: 'post',
            params: {
                "label":opt.label,
                "value":opt.value,
                "parentKey":opt.parentKey
            },
            data:opt
        }).then(function(msg){
            $('#child').modal('hide');
            $('#crf').modal('hide');
            return msg.data;
        })
    }

}]);