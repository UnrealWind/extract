angular.module('infi-basic').controller('FollowController', ['$scope', 'SYS','$location', '$routeParams', 'FollowService', function ($scope, SYS, $location, $routeParams, FollowService) {

    $scope.queryParams = {
        tubeInfoId: $routeParams.tubeInfoId
    };

    $scope.formList = null;

    $scope.save = function(){
        $location.path('catheter-details');
    };

    FollowService.getFormJson().then(function(msg){
        $scope.formList = msg.data;
    });
}]).service('FollowService',['SYS', '$http',function(SYS,$http){
    //获取详细信息表单json
    this.getFormJson = function(){
        return $http.get(SYS.jsonUrl+'follow.form.json').then(function success(msg){
            return msg.data;
        })
    }
}]);