angular.module("infi-basic").controller('CrfViewController',['$scope','SYS','$http','$routeParams',
    'crfCustomizeServices',function $scope($scope,SYS,$http,$routeParams,crfCustomizeServices) {
    $scope.id = $routeParams.id;
    crfCustomizeServices.view($scope.id).then(function (data) {
        $scope.currentData = data;
    });
}])