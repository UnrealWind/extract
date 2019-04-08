angular.module('infi-basic')
.controller('PatiProfileSelfTestController', ['$scope', 'PatiProfileService', 'SYS', '$routeParams',function ($scope, PatiProfileService, SYS, $routeParams) {
    $scope.flatOrgData = null,
    $scope.xlPatientId = null,

    $scope.hasData = 'init'          // 是否获取到异常视图渲染数据

    /**
     * 跳转病历详情
     */
    $scope.viewDetail = function() {

        if(window.parent.postMessage) {
            window.parent.postMessage(JSON.stringify({
                type: "openIframe",                                         //打开接诊台弹窗来显示Iframe
                title: '统一视图',	                                         //弹窗标题,String
                url: `${SYS.viewDetailUrl}${$scope.xlPatientId}`,	        //弹窗内嵌的Iframe地址,String
                width: 980,	                                                //弹窗宽度,Number
                height: 760	                                                //弹窗高度,Number
            }), "*");
        } else {
            window.open(`${SYS.viewDetailUrl}${$scope.xlPatientId}`,'_blank');
        }  

         
    }


    ;(function init () {
        $scope.xlPatientId = $routeParams.filter__xlPatientId

        PatiProfileService.getAbnormalView({xlPatientId: $scope.xlPatientId}).then(function(flatData) {
            if(flatData.status == 'ok') {
                $scope.hasData = true   
                $scope.flatOrgData = flatData.data
            } else {
                $scope.hasData = false
            }
        }, function(error) {
            $scope.hasData = false
        })
    })()



}]);
