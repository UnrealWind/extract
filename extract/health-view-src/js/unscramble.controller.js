angular.module('infi-basic').controller('UnscrambleController', ['$scope', 'SYS', 'DetailsService', '$routeParams','CheckDeviceService', '$location', function ($scope, SYS, DetailsService, $routeParams, CheckDeviceService, $location) {

    $scope.params = {
        patiId: $routeParams.patiId,
        patiVisitId: $routeParams.patiVisitId,
        operation: $routeParams.operation
    };
    $scope.entity = null;

    function init(){
        $scope.itemType = $scope.params.operation;
        $scope.entity = JSON.parse(sessionStorage.getItem('projectFilter'));
        var filter = {
            examClassId:'',
            keyId:'',
            testClassId:'',
            keyName:''
        };
        if($scope.itemType == 'exam'){
            filter.examClassId = $scope.entity.examClassId;
            filter.keyId = $scope.entity.keyId;
        }else if($scope.itemType == 'test'){
            filter.testClassId = $scope.entity.testClassId;
            filter.keyName = $scope.entity.keyName;
        }
        DetailsService.getAbnormalInterpretation(filter,$scope.itemType).then(function(msg){
            $scope.abnormalInterpretation = msg.data;
            if($scope.itemType == 'exam'){
                //检查结果
                $scope.abnormalInterpretation.result = $scope.entity.exceptionName;
                //检查描述
                $scope.abnormalInterpretation.examDesc = $scope.entity.examDesc;
                //检查时间
                $scope.abnormalInterpretation.examTime = $scope.entity.examTime;
            }else if($scope.itemType == 'test'){
                //检验结果
                $scope.abnormalInterpretation.result = $scope.entity.msg;
                //检验时间
                $scope.abnormalInterpretation.testTime = $scope.entity.testTime;
                //上下限
                $scope.abnormalInterpretation.valueMax = $scope.entity.valueMax;
                $scope.abnormalInterpretation.valueMin = $scope.entity.valueMin;
            }
        })
    }
    init();

    $scope.goBack = function(){
        window.history.go(-1);
        // $location.path('healthy/'+$scope.params.patiId+'/'+$scope.params.patiVisitId);
    }
}]);