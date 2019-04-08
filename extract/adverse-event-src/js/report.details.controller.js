angular.module('infi-basic').controller('ReportDetailsController', ['$scope', 'SYS', '$location', 'Utils','OverallMonitoringService','$filter','Session','RealTimeService', function ($scope, SYS, $location, Utils,OverallMonitoringService,$filter,Session,RealTimeService) {
    $scope.screen = null;
    $scope.content = [];
    $scope.interfaceData = null;
    $scope.length = 2;//用于提示暂无数据具体多少行
    $scope.SYS = SYS;
    //用户名
    $scope.user = Session.getUser();

    function init() {
        $scope.screen = JSON.parse(sessionStorage.getItem('screenOverall'));
        if($scope.screen.type == 'total'){
            refreshTotal()
        }else{
            refresh();
        }
    }
    init();
    function refreshTotal(){
        var filter = {
            filter_startTime:$scope.screen.startTime,
            filter_endTime:$scope.screen.endTime,
            filter_deptId:$scope.screen.deptId.value,
            filter_wardId:$scope.screen.wardId.value,
            filter_diseaseSeed:$scope.screen.diseaseSeed.value,
            filter_badEvent:''
        };
        $scope.length += Number($scope.screen.diseaseSeed.options.length);
        OverallMonitoringService.getDepartTable(filter).then(function(msg){
            $scope.interfaceData = msg.data;
            angular.forEach($scope.interfaceData,function(data){
                if(!checkEventName(data,$scope.content)){
                    var obj = {
                        dept:data.dept,
                        allNum:data.allNum,
                        children:[]
                    };
                    angular.forEach($scope.screen.diseaseSeed.options,function(option){
                        if(option.label == data.eventName){
                            obj.children.push({
                                label:option.label,
                                size:data.size,
                                rate:data.rate
                            })
                        }else{
                            obj.children.push({
                                label:option.label,
                                size:'',
                                rate:''
                            })
                        }
                    });
                    $scope.content.push(obj);
                }else{
                    angular.forEach($scope.content,function(entity){
                        if(entity.dept == data.dept){
                            angular.forEach(entity.children,function(child){
                                if(child.eventName == data.eventName){
                                    child.size = data.size;
                                    child.rate = data.rate;
                                }
                            })
                        }
                    })
                }
            })
        });
    }

    function refresh(){
        var filter = {
            filter_startTime:$scope.screen.startTime,
            filter_endTime:$scope.screen.endTime,
            filter_deptId:$scope.screen.deptId.value,
            filter_wardId:$scope.screen.wardId.value,
            filter_diseaseSeed:$scope.screen.diseaseSeed.value
        };
        RealTimeService.getDepartAllTable(filter).then(function(msg){
            $scope.content = msg.data;
            // angular.forEach($scope.interfaceData,function(data) {
            //     if (!checkEventName(data, $scope.content)) {
            //         var obj = {
            //             dept:data.dept,
            //             allNum:data.inhsopNum,
            //             children:[]
            //         };
            //         obj.children.push({
            //             size:data.event7Num,
            //             rate:data.event7Ratio
            //         },{
            //             size:data.event5Num,
            //             rate:data.event5Ratio
            //         },{
            //             size:data.event2Num,
            //             rate:data.event2Ratio
            //         },{
            //             size:data.event0Num,
            //             rate:data.event0Ratio
            //         })
            //         $scope.content.push(obj);
            //     }else{
            //         angular.forEach($scope.content,function(entity){
            //             if(entity.dept == data.dept){
            //                 entity.children.push({
            //                     size:data.event7Num,
            //                     rate:data.event7Ratio
            //                 },{
            //                     size:data.event5Num,
            //                     rate:data.event5Ratio
            //                 },{
            //                     size:data.event2Num,
            //                     rate:data.event2Ratio
            //                 },{
            //                     size:data.event0Num,
            //                     rate:data.event0Ratio
            //                 })
            //                 $scope.content.push(obj);
            //             }
            //         })
            //     }
            // })
        })
    }

    function checkEventName(data,content){
        var tip = false;
        angular.forEach(content,function(entity){
            if(data.dept == entity.dept){
                tip = true;
            }
        });
        return tip;
    }

}]);