angular.module('infi-basic').filter('defaultLine',[function(){
    //页面变量没有数据时,显示横线
    return function(value){
        if( value=='' || value==null){
            return "---";
        }


        return value;
    }
}]);


angular.module('infi-basic').directive('sysTip', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        template: '<div ng-if="sysTip.status" style="word-wrap:break-word" '
        + 'ng-class="{\'ok\':\'notice\',\'querying\':\'notice\',\'error\':\'notice_error\',\'blank\':\'notice_error\'}[sysTip.status]">'
        + '{{sysTip.description}}' +
        '</div>'
    };


}]);

angular.module('infi-basic').filter('flagState',[function(){
    //页面变量没有数据时,显示横线
    return function(value){
        if( value=='0'){
            return "未发生";
        }else if( value == '1'){
            return "已发生";
        }else if( value == '2'){
            return "未标记";
        }else {
            return "---";
        }


        return value;
    }
}]);

angular.module('infi-basic').directive('eventTableModal',[function(){
    return {
        restrict: 'A',
        templateUrl: 'html/tpl/event.table.modal.html',
        scope:{
            skipHistory:'&',
            historyListDate: '='
        }
    }
}]);

angular.module('infi-basic').filter('nullDefault',function(){
    return function(value){
        if(value == "" || value == null){
            return "--";
        }
        return value;
    }
});