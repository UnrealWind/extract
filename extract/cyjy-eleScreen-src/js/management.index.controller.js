angular.module('infi-basic').controller('ManagementIndexController',['$scope','$location','SYS','$rootScope',function ($scope,$location,SYS,$rootScope) {

    $scope.list = null;
    function init() {
        ManagementService.getPage(SYS.DEFAULT_PAGE_NUMBER).then(function(msg){
            $scope.list = msg.data;
        })
    }
    init();
}]);