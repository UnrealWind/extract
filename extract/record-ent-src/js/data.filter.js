angular.module('infi-basic').filter('topicCharacter',['DataService',function(DataService){
    return function(value){
        if( value==='manager'){
            return "管理员";
        }else if( value === 'general'){
            return "科研人员";
        }else if( value==='system'){
            return "系统模板";
        }else if( value === 'system'){
            return "自定义";
        }else if( value === 'collection'){
            return "收藏";
        }
        

        return value;
    }
}]);

app.directive('sysTip',['$timeout',function($timeout){
    return {
        restrict : 'A',
        template:
        '<div ng-if="sysTip.status" style="word-wrap:break-word" '
        + 'ng-class="{\'ok\':\'notice\',\'querying\':\'notice\',\'error\':\'notice_error\'}[sysTip.status]">'
        + '{{sysTip.description}}' +
        '</div>'
    };


}]);