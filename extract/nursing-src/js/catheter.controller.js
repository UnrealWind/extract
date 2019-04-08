angular.module('infi-basic').controller('CatheterController', ['$scope', 'SYS','$location', '$routeParams', 'CatheterService', function ($scope, SYS, $location, $routeParams, CatheterService) {

    $scope.queryParams = {
        tubeInfoId: $routeParams.tubeInfoId
    };

    $scope.formList = null;

    $scope.save = function(){
        $location.path('catheter-details');
    };

    CatheterService.getFormJson().then(function(msg){
        $scope.formList = msg.data;
        console.log($scope.formList)
    });
}]).service('CatheterService',['SYS', '$http',function(SYS,$http){
    //获取详细信息表单json
    this.getFormJson = function(){
        return $http.get(SYS.jsonUrl+'catheter.form.json').then(function success(msg){
            return msg.data;
        })
    }
}]);