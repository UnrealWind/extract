angular.module('infi-basic').controller('DetailsController', ['$scope', 'SYS', 'DetailsService','ListService', '$location', '$routeParams', '$q', 'Utils', function ($scope, SYS, DetailsService, ListService, $location, $routeParams, $q,Utils) {

    $scope.params = {
        patientId:$routeParams.patientId
    };
    $scope.basicInfo = null;
    $scope.preLines = null;
    $scope.catheterLines = null;
    $scope.newEvaluate = null;
    //删除的数据
    $scope.temporaryDeletion = null;

    function init(){
        //获取基本信息
        DetailsService.getBasic($scope.params.patientId).then(function(msg){
            $scope.basicInfo = msg.data;
        });
        $q.all({first: DetailsService.getPreLines({patientId:$scope.params.patientId}),second:DetailsService.getCatheterLines({patientId:$scope.params.patientId})}).then(function(arr){
            $scope.lines= {
                data:DetailsService.filterTimeline(arr)
            };
        });
    }
    init();

    $scope.showDischarge = function(){
        $("#dischargeRecord").modal({backdrap:'static'});
    };
    /**
     * 显示确认删除弹出框
     * @param entity
     */
    $scope.showDeletion = function(entity){
        $scope.temporaryDeletion = entity;
        $("#confirmDeletion").modal({backdrap:'static'});
    };

    /**
     * 新增置管详情
     * @param entity
     */
    $scope.addCatheter = function(entity){
        if(entity){
            $scope.newEvaluate = entity;
        }else{
            $scope.newEvaluate = null;
        }
        $("#addCatheter").modal({backdrap:'static'});
    };

    /**
     * 新增可行性评估
     */
    $scope.addEvaluate = function(){
        $location.path("/pre-evaluation/pre/add/"+$scope.params.patientId);
    };

    /**
     * 保存出院记录
     */
    $scope.saveDischarge = function(){
        $scope.basicInfo.isHospitalization = "院后";
        DetailsService.saveDischarge($scope.basicInfo).then(function(msg){
            if(msg.status == SYS.STATUS_SUCCESS){
                $scope.basicInfo = msg.data;
                $("#dischargeRecord").modal('hide');
            }
        })
    };

    /**
     * 保存入院记录
     */
    $scope.saveEnterHospital = function(){
        $scope.basicInfo.isHospitalization = "院内";
        $scope.basicInfo.dischargeTime = "";
        $scope.basicInfo.hasTube = "";
        DetailsService.saveDischarge($scope.basicInfo).then(function(msg){
            if(msg.status == SYS.STATUS_SUCCESS){
                $scope.basicInfo = msg.data;
                $("#admissionRecord").modal('hide');
            }
        })
    };
    /**
     * 确认删除
     * @param data
     */
    $scope.confirmDelete = function (data) {
        DetailsService.confirmDelete(data).then(function(msg){
            var tips ={
                status:msg.status,
                description:""
            };
            msg.status == SYS.STATUS_SUCCESS?tips.description="删除成功":tips.description="删除失败";
            $("#confirmDeletion").modal('hide');
            Utils.sysTip($scope,tips);
            setTimeout(function(){
                init();
            },300);
        })
    };

    /**
     * 显示出院记录
     */
    $scope.showEnter = function(){
        $("#admissionRecord").modal({backdrap:'static'});
    };

    //时间插件
    $scope.timePlugin = function(tagName,projectName,refreshList){
        var that = this;
        $('input[name="'+tagName+'"]').datetimepicker({
            format: 'yyyy-mm-dd',
            language:"zh-CN",
            minView :2,
            autoclose: true,
            forceParse:true,
            todayBtn: true
        }).trigger('focus')
    }
}]);
