angular.module('infi-basic').controller('RiskController', ['$scope', 'SYS','$location', '$routeParams', 'RiskService', 'Utils', '$filter', function ($scope, SYS, $location, $routeParams, RiskService, Utils, $filter) {
    $scope.params = {
        patientId:$routeParams.patientId
    };
    if(!$.isEmptyObject($location.search()) && $location.search().tubeInfoId){
        $scope.params.tubeInfoId=$location.search().tubeInfoId;
    }
    if($routeParams.id){
        $scope.params.id = $routeParams.id;
    }
    $scope.formList = null;
    $scope.riskTime = $filter('date')(new Date,'yyyy-MM-dd');
    $scope.assessor = "";
    function init() {
        if($scope.params.id){
            RiskService.getDetails($scope.params.id).then(function (msg) {
                $scope.detailsList = msg.data.riskAssessDetail;
                $scope.details = {
                    riskGrade:msg.data.riskGrade,
                    result:msg.data.result,
                    suggest:msg.data.suggest,
                    riskAssessmentTime:msg.data.riskAssessmentTime
                }
            })
        }else{
            RiskService.getTemplate().then(function(msg){
                $scope.formList = msg;
            });
        }
    }
    init();
    $scope.save = function(){
        angular.forEach($scope.formList.data,function (list) {
            list.optionId = list.id;
        });
        if($scope.riskTime=="" || $scope.riskTime==null || $scope.assessor=="" || $scope.assessor==null){
            var msg = {
                status:SYS.STATUS_ERROR,
                description:"风险评估时间和评估人是必填项"
            };
            Utils.sysTip($scope,msg);
        }else{
            var answer = true;
            angular.forEach($scope.formList.data,function(list){
                if(list.riskAnswer=="" || list.riskAnswer==null){
                    answer = false;
                }
            });
            if(answer){
                RiskService.save({
                    list:$scope.formList.data,
                    tubeInfoId:$scope.params.tubeInfoId,
                    time:$scope.riskTime,
                    assessor:$scope.assessor
                }).then(function(msg){
                    Utils.sysTip($scope,msg);
                    $location.search({tubeInfoId:$scope.params.tubeInfoId});
                    if(msg.status == SYS.STATUS_SUCCESS){
                        setTimeout(function(){
                            $location.path('risk-details/'+$scope.params.patientId+"/"+msg.data.id);
                        },2500);
                    }
                })
            }else{
                var msg = {
                    status:SYS.STATUS_ERROR,
                    description:"项目选项为必填"
                };
                Utils.sysTip($scope,msg);
            }

        }
    };

    $scope.back = function(){
        $location.path('catheter-details/'+$scope.params.patientId+"/"+$scope.params.tubeInfoId);
    }

}]).service('RiskService',['SYS','$http',function(SYS,$http){
    /**
     * 获取模板
     * @returns {*}
     */
    this.getTemplate = function(){
        return $http.get(SYS.url + 'risk/riskQuestion?riskTemplateId=1').then(function(msg){
            return msg.data;
        })
    };

    /**
     * 保存数据
     * @returns {*}
     */
    this.save = function(filter){
        return $http.post(SYS.url + 'risk/riskSave?tubeInfoId='+filter.tubeInfoId+"&riskAssessmentTime="+filter.time+"&assessor="+filter.assessor,filter.list).then(function(msg){
            return msg.data;
        })
    };

    /**
     * 获取风险详情
     * @returns {*}
     */
    this.getDetails = function(id){
        return $http.get(SYS.url + 'risk/riskInfo/'+id).then(function(msg){
            return msg.data;
        })
    };
}]);