angular.module('infi-basic').controller('DetailsController', ['$scope', 'SYS', 'DetailsService', '$routeParams','CheckDeviceService', '$location', function ($scope, SYS, DetailsService, $routeParams, CheckDeviceService, $location) {

    $scope.params = {
        identityId: '',
        patiId: '',
        patiVisitId: '',
        sexName:'',
        signature:'',
        wuhan:'',
        caseId:''
    };

    $scope.params.signature = $location.search().signature;//安全验证需要用到
    $scope.params.caseId = $location.search().caseId;//安全验证需要用到
    $scope.params.identityId = $location.search().sfzh;
    var search =$location.search();
    for(var key in search){
        $scope.params.wuhan = key;
    }
    // $scope.params.patiId = $location.search().patiId;
    // $scope.params.patiVisitId = $location.search().patiVisitId;

    $scope.SYS = SYS;

    $scope.organJson = null;      //器官json
    $scope.position = null;       //部位json
    $scope.healthyChart = null;   //获取的器官接口数据
    $scope.chartData = null;      //将json和接口整合好
    $scope.exceptionProject = null;  //异常项目
    $scope.abnormalInterpretation = null; //异常解读
    $scope.diagnosis = null;              //诊断
    $scope.currentTab = 'dietaryAdvice';  //健康建议的tab
    $scope.itemType = 'exam';             //选择的异常项目类型
    $scope.tabs = [
        {
            label:"膳食建议",
            name:"dietaryAdvice",
            active:true,
            data:null,
            url:"dietaryAdvice"
        },{
            label:"运动建议",
            name:"sportAdvice",
            active:false,
            data:null,
            url:"sportAdvice"
        },{
            label:"就医建议",
            name:"medicalAdvice",
            active:false,
            data:null,
            url:"medicalAdvice"
        }
    ];
    /**
     * tab切换
     */
    $scope.switchTab = function(tab){
        angular.forEach($scope.tabs,function(entity){
            entity.active = false;
            if(entity.label == tab.label){
                entity.active = true;
                $scope.currentTab = entity.name;
                DetailsService.getHealthy({
                    patiId:$scope.params.patiId,
                    patiVisitId:$scope.params.patiVisitId,
                    url:entity.url,
                    signature:$scope.params.signature,
                    caseId:$scope.params.caseId
                }).then(function(msg){
                    entity.data = msg.data;
                    entity.status = msg.status;
                })
            }
        })
    };
    /**
     * 检查检验的点击事件
     */
    $scope.queryClass = function(entity,type,operation){
        console.log(entity)
        if(operation && operation == 'mobile'){

            var distance =  $(".infi-main").scrollTop();
            $location.path('unscramble/'+$scope.params.patiId+'/'+$scope.params.patiVisitId+'/'+type);
            sessionStorage.setItem('projectFilter',JSON.stringify(entity));
            sessionStorage.setItem('distanceTop',distance);
        }else{
            $scope.itemType = type;
            var filter = {//链接的配置参数
                examClassId:'',
                keyId:'',
                testClassId:'',
                keyName:''
            };
            if(type == 'exam'){
                filter.examClassId = entity.examClassId;
                filter.keyId = entity.keyId;
            }else if(type == 'test'){
                filter.testClassId = entity.testClassId;
                filter.keyName = entity.keyName;
            }
            if($scope.params.signature){
                filter.signature = $scope.params.signature;
            }
            if($scope.params.caseId){
                filter.caseId = $scope.params.caseId;
            }
            DetailsService.getAbnormalInterpretation(filter).then(function(msg){
                $scope.abnormalInterpretation = msg.data;
                $scope.abnormalInterpretation.status = msg.status;
                if(type == 'exam'){
                    //检查结果
                    $scope.abnormalInterpretation.result = entity.exceptionName;
                    //检查描述
                    $scope.abnormalInterpretation.examDesc = entity.examDesc;
                    //检查时间
                    $scope.abnormalInterpretation.examTime = entity.examTime;
                }else if(type == 'test'){
                    //检验结果
                    $scope.abnormalInterpretation.result = entity.msg;
                    //检验时间
                    $scope.abnormalInterpretation.testTime = entity.testTime;
                    //上下限
                    $scope.abnormalInterpretation.valueMax = entity.valueMax;
                    $scope.abnormalInterpretation.valueMin = entity.valueMin;
                    DetailsService.drowEcharts(filter,$scope.params.patiId,$scope.params.patiVisitId);
                }
            });

        }
    };
    function init() {
        //获取基本信息的性别
        DetailsService.getInfo($scope.params).then(function(msg){
            $scope.params.sexName = msg.data.sexName;
            $scope.params.patiId = msg.data.patientId;
            $scope.params.patiVisitId = msg.data.patientVisitId;
            var json = "";
            if($scope.params.sexName == "女"){
                json = "female-organ.json";
            }else{
                json = "male-organ.json";
            }
            //设置纵向位置信息是因为：适用于手机端,检查检验点击进入异常解读会跳转页面，从异常解读页面跳回来的时候还再次回到当前的检查检验
            var distance = sessionStorage.getItem('distanceTop');
            $('.infi-main').scrollTop(distance);
            sessionStorage.setItem('distanceTop',0);//清除位置信息

            //获取图需要的数据
            DetailsService.getOrganJson(json).then(function(msg){//获取器官
                $scope.organJson = msg.data;
                DetailsService.getPositionJson().then(function(msg){//获取部位
                    $scope.positionJson = msg.data;
                    DetailsService.getHealthyChart({
                        patiId:$scope.params.patiId,
                        patiVisitId:$scope.params.patiVisitId,
                        signature:$scope.params.signature,
                        caseId:$scope.params.caseId
                    }).then(function(msg){
                        if(msg.status != 'fail'){
                            $scope.healthyChart = msg.data;
                            $scope.chartData = DetailsService.filterChart($scope.organJson,$scope.positionJson,$scope.healthyChart);
                            drawChart($scope.chartData);
                        }
                        else{
                            $('#chart1').html('<div class="infi-ele-danger">验证不通过</div>');
                        }
                    });
                });
            });



            //获取异常项目
            DetailsService.getExceptionProject({
                patiId:$scope.params.patiId,
                patiVisitId:$scope.params.patiVisitId,
                signature:$scope.params.signature,
                caseId:$scope.params.caseId
            }).then(function(msg){
                $scope.exceptionProject = msg;
                if(msg.status != 'fail'){
                    //获取异常解读
                    if($scope.exceptionProject.data.examInfo!= null && $scope.exceptionProject.data.examInfo.length>0){
                        $scope.queryClass($scope.exceptionProject.data.examInfo[0],'exam');
                    }else if($scope.exceptionProject.data.testInfo!= null && $scope.exceptionProject.data.testInfo.length>0){
                        $scope.queryClass($scope.exceptionProject.data.testInfo[0],'test');
                    }
                }else{
                    $scope.abnormalInterpretation = msg;
                }
            });
            //获取诊断
            DetailsService.getDiagnosis({
                patiId:$scope.params.patiId,
                patiVisitId:$scope.params.patiVisitId,
                signature:$scope.params.signature,
                caseId:$scope.params.caseId
            }).then(function(msg){
                $scope.diagnosis = msg;
                angular.forEach($scope.diagnosis.data,function(entity){
                    var degree = angular.copy(entity.similarDegree);
                    entity.degree = Number(degree.substring(0,degree.length - 1));
                });
            });
            $scope.switchTab($scope.tabs[0]);
        });
    }
    init();

    function drawChart(chartData){
        if(chartData){
            var mapType = "bodyMale";
            if($scope.params.sexName == "女"){
                mapType = "bodyFemale";
            }
            //标题
            var text = '';
            // if(CheckDeviceService.checkDevice() == 'mobile'){
            //     text = '健康画像';
            // }
            require(['echarts','echarts/chart/map'],function(echarts1 , map){
                require('echarts/util/mapData/params').params.bodyMale = {
                    getGeoJson: function (callback) {
                        $.ajax({
                            url: "../../src/plugin/svg/body-male.svg",
                            dataType: 'xml',
                            success: function(xml) {
                                callback(xml)
                            }
                        });
                    }
                };
                require('echarts/util/mapData/params').params.bodyFemale = {
                    getGeoJson: function (callback) {
                        $.ajax({
                            url: "../../src/plugin/svg/body-female.svg",
                            dataType: 'xml',
                            success: function(xml) {
                                callback(xml)
                            }
                        });
                    }
                }
                var ecConfig = require('echarts/config');
                var myChart = echarts1.init(document.getElementById('chart1'));
                var opt = {
                    title : {
                        text : text,
                        subtext: '',
                        x:'center',
                        y:'top'
                    },
                    roamController:{
                        show:false
                    },
                    tooltip:{
                        show:false
                    },
                    dataRange: {
                        show:false,
                        min: 0,
                        max: 100,
                        x: 'center',
                        y: 'center',
                        tdext:['High','Low'],
                        calculable : true,
                        itemHeight:30,
                        color: ['#ff3333','orange','#bfe583']
                    },
                    series : [
                        {
                            name: '分析图',
                            type: 'map',
                            mapType: mapType, // 自定义扩展图表类型
                            mapLocation: {
                                x:'left'
                            },
                            roam:false,  //禁止拖动和缩放
                            hoverable:false, //禁止hover
                            itemStyle:{
                                normal:{label:{show:true}},
                                emphasis:{label:{show:true}}
                            },
                            data: chartData.series,
                            textFixed : {
                                '上肢' : [-60, 0]
                            },
                            markPoint : {
                                data :
                                chartData.markPointData,
                                tooltip:{
                                    show:true,
                                    tigger:'axis',
                                    formatter: function(data,params){
                                        if(data.data.discribe){
                                            var str = data.data.discribe;
                                            var html = "";
                                            for (var i = 0 ,n = str.length; i < n; i++) {
                                                if((i+1)%10){
                                                    html += str[i];
                                                }else{
                                                    html += "<br />" +str[i];
                                                }
                                            }
                                            return html
                                        }
                                    }
                                }
                            },
                            markLine : {
                                tooltip:{
                                    show:false
                                },
                                // smooth:true,
                                itemStyle : {
                                    normal: {
                                        borderWidth:2,
                                        color: "#834CF9",
                                        lineStyle: {
                                            type: 'solid'
                                        }
                                    }
                                },
                                data :
                                chartData.markLinkData
                            }
                        }
                    ]
                };
                myChart.setOption(opt);
            })
        }else{
            $('#chart1').html("暂无数据");
        }
    }
    // drawChart();

    /**
     * 手机端tab切换
     * @param tagName
     */
    $scope.openTab = function(tagName){
        angular.forEach($scope.tabs,function(entity){
            entity.active = false;
            if(entity.name == tagName){
                entity.active = true;
                $scope.currentTab = entity.name;
                DetailsService.getHealthy({
                    patiId:$scope.params.patiId,
                    patiVisitId:$scope.params.patiVisitId,
                    url:entity.url,
                    signature:$scope.params.signature,
                    caseId:$scope.params.caseId
                }).then(function(msg){
                    entity.data = msg.data;
                    entity.status = msg.status;
                })
            }
        })
    };

    $scope.closeTab = function(){
        $scope.currentTab = "";
    }
}]);