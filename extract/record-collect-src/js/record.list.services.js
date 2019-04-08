angular.module('infi-basic')
    .service('RecordListServices',['$http','SYS','$routeParams',function($http,SYS,$routeParams){
        this.getRecordList = function (url,data) {
            return $http({
                method:'get',
                url:url,
                params:data,
                data:''
            }).then(function (msg) {
                return msg.data
            })
        }

        this.timePlugin = function(tagName,format){

            var minView = null;
            var startView = null;
            if(format.indexOf('hh')>-1||format.indexOf('HH')>-1){
                minView = 0;
                startView = 2;
            }else if(format.indexOf('dd')>-1||format.indexOf('DD')>-1){
                minView = 2;
                startView = 2;
            }else{
                minView = 3;
                startView = 3;
            }

            $('input[name="'+tagName+'"]').datetimepicker({
                format: format,
                language:"zh-CN",
                autoclose: true,
                forceParse:true,
                minView:minView,
                startView:startView
            }).trigger('focus');
        };
}]);
