angular.module('infi-basic').controller('CatheterDetailsController', ['$scope', 'SYS','$location', 'CatheterDetailsService', '$routeParams', function ($scope, SYS, $location, CatheterDetailsService, $routeParams) {

    $scope.params = {
        patientId:$routeParams.patientId,
        tubeInfoId:$routeParams.tubeInfoId
    };
    $scope.tubeList = null;
    $scope.preList = null;
    $scope.hasPre = false;
    $scope.followList = null;

    $scope.riskResult = null;
    $scope.riskTable = null;

    $scope.maintenanceNum = 2;
    $scope.followNum = 2;
    $scope.SYS = SYS;
    var list = [
        {
            label:"拔管记录",
            value:"extubationList",
            url:"tube/moveTubeRecord"
        },{
            label:"维护记录",
            value:"maintenanceList",
            url:"manage/manageRecord"
        },{
            label:"随访记录",
            value:"followList",
            url:"visit/visitRecord"
        }
    ];

    function init(){
        CatheterDetailsService.getCharts($scope.params.tubeInfoId).then(function(msg){
            $scope.riskResult = msg;
            $scope.drawCharts($scope.riskResult);
        });
        CatheterDetailsService.getTubeDetails($scope.params.tubeInfoId).then(function(msg){
            $scope.tubeList = msg.data;
            if($scope.tubeList.feasibilityId && $scope.tubeList.feasibilityId!=0){
                $scope.hasPre = true;
                CatheterDetailsService.getPreDetails($scope.tubeList.feasibilityId).then(function(msg){
                    $scope.preList = msg.data;
                })
            }
        });
        getColumns();
        getContent(1,10);
    }

    $scope.riskColumns = null;
    $scope.opts = {
        label:"操作",
        btns:[
            {
                label:"查看详情",
                type:"show"
            }
        ]
    };

    function getColumns(){
        $scope.riskColumns = [
            {
                name:"assessor",
                label:"评估人"
            },
            {
                name:"riskAssessmentTime",
                label:"评估时间"
            },
            {
                name:"resultLabel",
                label:"风险等级"
            }
        ]

    }

    /**
     * 请求表格数据
     * @param page
     * @param size
     */
    function getContent(page,size){
        var filter = {
            tubeInfoId:$scope.params.tubeInfoId,
            page:page,
            size:size
        };
        CatheterDetailsService.getTable(filter).then(function(msg){
            $scope.riskTable = msg;
            if(msg.status == SYS.STATUS_SUCCESS){
                $scope.riskTable.page.number ++ ;
            }
        });
    }

    $scope.showDetails = function(entity,type){
        if(type == 'show'){
            $location.path("risk-details/"+$scope.params.patientId+"/"+entity.id);
            $location.search({tubeInfoId:$scope.params.tubeInfoId});
        }
    };
    //获取数据,数据的获取
    $scope.queryIndexes = function () {
        var idx, entity;
        for (idx = 0; idx < list.length; idx++) {
            entity = list[idx];
            CatheterDetailsService.getDetails($scope.params.tubeInfoId,entity.url,entity.value).then(function(msg){
                if(msg.type == 'followList'){
                    delete msg.type;//删除type属性,type属性是后台获取完数据后自己加的,用于赋值
                    //获取对象长度
                    var objKeys = angular.copy(msg);
                    objKeys = Object.keys(objKeys);
                    $scope.followListLength = objKeys.length;
                    //获取对象长度
                    $scope.followList = msg;
                    if(!$.isEmptyObject(msg)){
                        if(msg.status && msg.status==SYS.STATUS_ERROR){
                            $scope.followList = [];
                        }else{
                            angular.forEach($scope.followList,function(value,key){
                                $scope.followList[key] = {
                                    data:[],
                                    time:null
                                };
                                angular.forEach(value,function(entity){
                                    if(entity.visitContent.visitQuestion !="随访时间"){
                                        $scope.followList[key].data.push(entity);
                                    }else{
                                        $scope.followList[key].time = entity.visitResult.visitQuestionResult;
                                    }
                                })
                            })
                        }
                    }else{
                        $scope.followList = []
                    }
                }
                else {
                    $scope[msg.type] = msg.data;
                    $scope[msg.type + "Wrap"] = msg;
                    if(msg.type == 'extubationList'){//这块是数值后面有汉字,把他两拼一块显示
                        angular.forEach($scope[msg.type],function(value,key){
                            if(key == 'disappear'){
                                $scope[msg.type][key] = value.toString() + "天血栓消失";
                            }
                        })
                    }
                }
            })
        }
    };
    $scope.queryIndexes();

    $scope.drawCharts = function(list){
        if(list.status == SYS.STATUS_SUCCESS){
            var xData = [],series = [];
            angular.forEach(list.data,function(data){
                xData.push(data.riskAssessmentTime);
                series.push(data.riskTotalScore);
            });
            var myChart = echarts.init(document.getElementById('chart-risk-evaluation'));
            var option = {
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    left: '5%',
                    right: '6%',
                    bottom: '3%',
                    top: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#000',
                            fontSize:'9'
                        },
                        formatter:function(params){
                            var date = new Date(params);
                            var month = date.getMonth() + 1;
                            var day = date.getDate();
                            return month+"."+day
                        },
                        interval:0
                    },

                    boundaryGap: false,
                    data: xData
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'风险评分',
                        type:'line',
                        stack: 'test',
                        data:series
                    }
                ]
            };

            myChart.setOption(option);
        }else{
            $('#chart-risk-evaluation').html("<span style='width:100%;height:100%;text-align: center;font-size:20px;color:#a94442;display:inline-block;'>暂无数据<span>")
        }
    };

    init();

    $scope.lookMaintenanceMores = function(){
        $scope.maintenanceNum = $scope.maintenanceList.length;
    };
    $scope.closeMaintenanceMores = function(){
        $scope.maintenanceNum = 2;
    };
    $scope.lookFollowMores = function(){
        $scope.followNum = $scope.followList.length;
    };
    $scope.closeFollowMores = function(){
        $scope.followNum = 2;
    };

    $scope.updatePage = function(page){
        getContent(page,10);
    }
}]);