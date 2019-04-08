angular.module('infi-basic').controller('MaintenanceController', ['$scope', 'SYS','$location', '$routeParams', 'MaintenanceService', function ($scope, SYS, $location, $routeParams, MaintenanceService) {

    $scope.queryParams = {
        tubeInfoId: $routeParams.tubeInfoId
    };

    $scope.formList = null;

    $scope.save = function(){
        $location.path('catheter-details');
    };

    MaintenanceService.getFormJson().then(function(msg){
        $scope.formList = msg.data;
    });
}]).service('MaintenanceService',['SYS', '$http',function(SYS,$http){
    //获取详细信息表单json
    this.getFormJson = function(){
        return $http.get(SYS.jsonUrl+'maintenance.form.json').then(function success(msg){
            return msg.data;
        })
    }
}]);