angular.module('infi-basic').controller('PreController', ['$scope', 'SYS','$location', '$routeParams', 'PreService', function ($scope, SYS, $location, $routeParams, PreService) {

    $scope.queryParams = {
        tubeInfoId: $routeParams.tubeInfoId
    };

    $scope.detailsList = null;

    $scope.save = function(){
        if($scope.queryParams.tubeInfoId){
            $location.path('catheter-details');
        }else{
            $location.path('pre-details');
        }
    };

    PreService.getDetailsForm().then(function(msg){
        $scope.detailsList = msg.data;
    });
}]).service('PreService',['SYS', '$http',function(SYS,$http){
    //获取详细信息表单json
    this.getDetailsForm = function(){
        return $http.get(SYS.jsonUrl+'pre.form.json').then(function success(msg){
            return msg.data;
        })
    }
}]);