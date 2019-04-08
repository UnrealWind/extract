angular.module('infi-basic').service('Utils',['SYS','$timeout',function (SYS,$timeout) {
    function sysTip($scope,tip) {
        $scope.sysTip = angular.copy(tip);
        var show ;
        $timeout.cancel(show);
        show = $timeout(function () {
            if( $scope.sysTip ){
                $scope.sysTip.status = undefined;
            }
        },2500);
    }

    function sysTipBefore($scope,description) {
        sysTip($scope,{
            status: SYS.STATUS_QUERYING,
            description: description
        });
    }

    return {
        sysTip: sysTip,
        sysTipBefore: sysTipBefore
    }
}]);

angular.module('infi-basic').filter('topicCharacter',['DataService',function(DataService){
    //运用公共tabel，公共tabel中有个filter，不加入会出现问题,其实并没有用
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

angular.module('infi-basic')
.directive('repeatFinish',function($timeout){
    return {
        restrict: 'A',
        link:function(scope,element,attrs){
            $timeout(function() {
                if(scope.$last == true && !scope.$first ){
                    scope.$emit( 'domReady' );
                }
            });
        }
    }
})
.directive('sysTip',['$timeout',function($timeout){
    return{
        restrict: 'A',
        template:'<div ng-if="sysTip.status" '+
        'ng-class="{\'ok\':\'notice\',\'querying\':\'notice\',\'error\':\'notice_error\',\'black\':\'notice_error\'}[sysTip.status]">'+
        '{{sysTip.description}}</div>'
    }
}]);