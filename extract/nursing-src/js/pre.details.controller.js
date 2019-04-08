angular.module('infi-basic').controller('PreDetailsController', ['$scope', 'SYS','$location', '$routeParams', 'PreDetailsService', function ($scope, SYS, $location, $routeParams, PreDetailsService) {

    $scope.queryParams = {
        tubeInfoId: '',
        patientId: $routeParams.patientId
    };
    console.log($location.search())
    if(!$.isEmptyObject($location.search()) && $location.search().tubeInfoId){
        $scope.queryParams.tubeInfoId=$location.search().tubeInfoId;
    }
    $scope.back = function(){
        if($scope.queryParams.tubeInfoId){
            $location.path('catheter-details/'+$scope.quaryParams.patientId+"/"+$scope.quaryParams.tubeInfoId);
        }else{
            $location.path('details/'+$scope.queryParams.patientId);
        }
    };

    /**
     * 开始置管
     */
    $scope.addCatheter = function(){
        $("#addCatheter").modal({backdrap:'static'});
    };
    init();
    function init(){
        PreDetailsService.getDetailsJson().then(function(msg){
            $scope.detailsList = msg.data;
        })
    }

}]).service('PreDetailsService',['SYS','$http',function(SYS,$http){
    this.getDetailsJson = function(){
        return $http.get(SYS.jsonUrl+'pre.details.json').then(function success(msg){
            return msg.data;
        })
    };
}]);