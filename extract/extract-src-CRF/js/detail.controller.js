/**
 * Created by geqimeng on 17-11-15.
 */
angular.module("infi-basic").controller('genDetail',['$routeParams','$scope','Detail',function($routeParams,$scope,Detail){
    $scope.detailData = null;
    $scope.tagID = $routeParams.id;
    Detail.detailData($scope.tagID).then(function(msg){
        $scope.detailData = msg;
    });
}]);
angular.module("infi-basic").service('Detail',['SYS','$http',function(SYS,$http){

    //适配器，转换一下格式,
    var genDetailData = function(data){
        data.info = [
            {
                "label": "申请信息",
                "value": data.kpi.createTime,
                "children": {
                    "label": "申请人",
                    "value": data.kpi.creator
                }
            },
            {
                "label": "当月累计取数次数",
                "value": data.kpi.monthSize,
                "children": {
                    "label": "累计可提取阈值",
                    "value": data.kpi.extractTaskUpKpi.upTaskSize
                }
            },
            {
                "label": "本次提取病历数",
                "value": data.kpi.recordSize,
                "children": {
                    "label": "当月累计",
                    "value": data.kpi.monthRecord
                }
            },
            {
                "label": "本次提取标签数",
                "value": data.kpi.attrSize,
                "children": {
                    "label": "当月累计",
                    "value": data.kpi.monthAttr
                }
            }
        ]
        return data;
    }

    this.detailData = function(tagID){
        return $http({
            url: SYS.url + 'extract/task/'+tagID,
            method: 'get',
            params: {}
        })
            .then(function(msg){
                msg.data = genDetailData(msg.data);
                return msg.data;
            });
    };

}]);
