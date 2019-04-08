angular.module('infi-basic').controller('AnalysisController',
    ['$scope', '$routeParams', 'SYS','$http','AnalysisServices','$timeout','$rootScope',
    function ($scope, $routeParams, SYS,$http,AnalysisServices,$timeout,$rootScope) {

    $scope.refreshWeather = true;
    $scope.params = {
        filter_ill_id:'1',
        filter_type_id:'2',
        targetLabel:'慢阻肺'
    };

    function initBasic(){
        $timeout(function(){
            var tagArr= [];
            $scope.diseases.forEach(function(n,i){
                $scope.params.filter_ill_id == n.value?($scope.params.targetLabel = n.label,tagArr= n.illAnalysisTypeId):undefined;
            });
            tagArr.forEach(function(n,i){
                var params = {
                     'filter_ill_id':$scope.params.filter_ill_id,
                     'filter_factor_type_id':n,
                     'targetLabel':$scope.params.targetLabel
                 }
                 AnalysisServices.getBasicAttr(params).then(function(msg){

                 })
            })

        },0)
    };

    $scope.changeCharts = function(mark){
        $scope.$root['confirm'] = true;
        mark == 'weather'?$scope.refreshWeather = false:undefined;
        mark == 'all'?($scope.refreshWeather = false,initBasic()):undefined;
        $timeout(function(){
            $scope.refreshWeather = true;
        },0)
    };

    $scope.analysisType = null;
    $scope.diseases = null;
    AnalysisServices.getDiseases().then(function (msg) {
        $scope.diseases = angular.copy(msg);

        //基本属性相关的东西依赖了这个数据了，所以在这个里面调用
        initBasic();
    });

    AnalysisServices.getType().then(function (msg) {
        $scope.analysisType = angular.copy(msg);
    });



}]);
