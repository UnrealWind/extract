angular.module('infi-basic').controller('ExtubationController', ['$scope', 'SYS','$location', '$routeParams', 'ExtubationService', function ($scope, SYS, $location, $routeParams, ExtubationService) {

    $scope.queryParams = {
        tubeInfoId: $routeParams.tubeInfoId
    };

    $scope.formList = null;

    $scope.save = function(){
        $location.path('catheter-details');
    };

    ExtubationService.getFormJson().then(function(msg){
        $scope.formList = msg.data;
    });
}]).service('ExtubationService',['SYS', '$http',function(SYS,$http){
    //获取详细信息表单json
    this.getFormJson = function(){
        return $http.get(SYS.jsonUrl+'extubation.form.json').then(function success(msg){
            return msg.data;
        })
    }
}]);