angular.module("infi-basic").controller('MenuViewController',['$scope','DataService','ViewMapping','$routeParams','SYS','Utils','$location',function ($scope,DataService,ViewMapping,$routeParams,SYS,Utils,$location) {
    $scope.SYS = SYS;
    $scope.viewType = $routeParams.type;
    function init() {
        var viewType = $scope.viewType == "menu" ? "menu" :"office";
        DataService.getMenuSource(viewType).then(function (msg) {
            ViewMapping.viewShow(msg.data);
            $scope.naviData = {};
            $scope.naviData.children = msg.data;
        });
    }
    init();
}]);