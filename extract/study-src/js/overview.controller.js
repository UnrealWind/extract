angular.module('infi-basic')
    .controller('OverviewController', ['$scope','DataService','$routeParams','SYS','naviServices','$rootScope',
        function ($scope,DataService,$routeParams,SYS,naviServices,$rootScope) {

        naviServices.getNaviData().then(function(msg){
            msg.data?$rootScope.naviData = msg.data.menus:undefined;
            var strIdx = naviServices.getIndex(window.location.href,$rootScope.naviData);
            var callback = naviServices.restoreNavi($rootScope.naviData,strIdx);
            $rootScope.naviData = callback.naviData;
            $rootScope.secondNavi = callback.second;
            $rootScope.secondTitleOpt = callback.secondTitleOpt;
            $rootScope.shrinkfirst = naviServices.judgeShrink($rootScope.secondNavi);
        });

        $scope.SYS = SYS;
        $scope.topicsTableHeader = [
            {label:'名称'},
            {label:'任务量'},
            {label:'采集数'},
            {label:'采集进度'}
        ];

        $scope.completionHeader = [
            {label:'序号'},
            {label:'合作医院'},
            {label:'科室'},
            {label:'任务量'},
            {label:'采集数'},
            {label:'已完成'},
            {label:'完成进度'}
        ];

        $scope.completionBody = [
            // {num:'1',hospital:'首都医科大学北京宣武医院',departments:'呼吸科',task:'50',completed:'40',degree:'70%'},
            // {num:'1',hospital:'首都医科大学北京宣武医院',departments:'呼吸科',task:'50',completed:'40',degree:'70%'},
            // {num:'1',hospital:'首都医科大学北京宣武医院',departments:'呼吸科',task:'50',completed:'40',degree:'70%'},
            // {num:'1',hospital:'首都医科大学北京宣武医院',departments:'呼吸科',task:'50',completed:'40',degree:'70%'}
        ];

        $scope.description = '';
        $scope.descriptionData = [];


        $scope.annex = [
            {name:'附件名称'}
        ]

        $scope.entity = {}

        //tab切换按钮
        $scope.descriptionTab = function(data,content){
            $scope.step = data;
            $scope.description = content;
            $scope.completionBodyData = [];
            for(var i = 0 ; i < $scope.completionBody.length ; i++){
                if($scope.completionBody[i].name == $scope.step){
                    $scope.completionBodyData.push($scope.completionBody[i]);

                }
            }
            // console.log($scope.completionBodyData,111);
        }
        $scope.center = true;
        $scope.centerGenral = [];
        $scope.topicsTableBody = [];
        $scope.xAxis = [];
        $scope.series = [];
        $scope.serie = [];
        $scope.taskGroup = [];
        DataService.ajaxCenter($routeParams.id).then(function(data){
            //console.log(data);
            $scope.centerGenral = data.data.data;
            if($scope.centerGenral.length > 0){
                $scope.center = true;
                for(var i = 0 ; i < $scope.centerGenral.length ; i++ ){
                    if($scope.centerGenral[i].type == 'primary'){
                        $scope.centerGenral[i].type = '主中心'
                    }else if($scope.centerGenral[i].type == 'separate'){
                        $scope.centerGenral[i].type = '分中心'
                    }
                }
            }else{
                $scope.center = false;
            }

        });
        DataService.ajaxOverviewData($routeParams.id).then(function(data) {
            //console.log(data, '后台返回的数据');
            //显示 课题基本信息:
            $scope.entity = data.data;
            $scope.entity.beginTime = DataService.newTime(data.data.beginTime);
            //课题合作单位的值
            $scope.entity.attendUsers.hospitalName = [];
            angular.forEach(data.data.userOffice,function(value,key){
                  $scope.entity.attendUsers.hospitalName.push(key);
            });

            //创建下载文件url数组
            $scope.downloadList = [];
            $scope.entity.subjectFiles.forEach(function(n,i){
                $scope.downloadList.push(SYS.url+'/subject/file/'+n.id)
            })

            if (data.data.subjectGroup.length > 0) {
                $scope.cls = 'hide';
                $scope.clss = 'show';
                for (var i = 0; i < data.data.subjectGroup.length; i++) {
                    //分组中的tab切换
                    var taskGroupData = {
                        name: data.data.subjectGroup[i].type,
                        content: data.data.subjectGroup[i].description
                    }

                    //任务分配-完成情况
                    // console.log(data.data.subjectGroup[i].taskGroup,'任务分配-完成情况');
                    for (var ii = 0; ii < data.data.subjectGroup[i].taskGroup.length; ii++) {
                        var taskGroupNum = DataService.percentage(data.data.subjectGroup[i].taskGroup[ii].achieveSize, data.data.subjectGroup[i].taskGroup[ii].taskSize);
                        if(data.data.subjectGroup[i].taskGroup[ii].achieveSize == null){
                            data.data.subjectGroup[i].taskGroup[ii].achieveSize = 0;
                        }
                        var completionData = {
                            num: '1',
                            hospital: data.data.subjectGroup[i].taskGroup[ii].officeName,
                            departments: data.data.subjectGroup[i].taskGroup[ii].sectName,
                            task: data.data.subjectGroup[i].taskGroup[ii].taskSize,
                            recordNum:data.data.subjectGroup[i].taskGroup[ii].recordNum,
                            completed: data.data.subjectGroup[i].taskGroup[ii].achieveSize,
                            degree: taskGroupNum + '%',
                            name:data.data.subjectGroup[i].type
                        }
                        $scope.completionBody.push(completionData);
                    }
                    $scope.taskGroup.push(taskGroupData);
                    $scope.descriptionTab($scope.taskGroup[0].name, data.data.subjectGroup[0].description);
                    //百分比
                    var num = DataService.percentage(data.data.subjectGroup[i].recordNum, data.data.subjectGroup[i].recordSize);
                    var datas = {
                        name: data.data.subjectGroup[i].name,
                        Num: data.data.subjectGroup[i].recordSize,
                        Nums: data.data.subjectGroup[i].recordNum,
                        degree: num + '%'
                    };

                    if(num > 100){
                        datas.background = {
                            "background-color" : "coral"
                        }
                    }

                    //X轴的名称
                    $scope.xAxis.push(data.data.subjectGroup[i].type);
                    if(data.data.subjectGroup[i].recordNum > data.data.subjectGroup[i].recordSize){
                        data.data.subjectGroup[i].recordNum = data.data.subjectGroup[i].recordSize;
                    }
                    //总量
                    $scope.series.push(parseInt(data.data.subjectGroup[i].recordNum));
                    //完成量
                    $scope.serie.push(parseInt(data.data.subjectGroup[i].recordSize) - parseInt(data.data.subjectGroup[i].recordNum));
                    $scope.topicsTableBody.push(datas);
                }

                var myChart = echarts.init(document.getElementById('main'));
                var option = {
                    title : {
                        text: '数据采集总体情况',
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        formatter: function (params) {
                            return params[0].name + '<br/>'
                                 + params[1].seriesName + ' : ' + (params[1].value + params[0].value) + '<br/>'
                                 + params[0].seriesName + ' : ' + (params[0].value) + '<br/>'
                                // + params[0].seriesName + ' : ' + params[0].value
                                ;
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            //X轴的名称
                            data: $scope.xAxis
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            boundaryGap: [0, 0.1]
                        }
                    ],
                    series: [
                        {
                            name: '采集数',
                            type: 'bar',
                            stack: 'sum',
                            barCategoryGap: '50%',
                            itemStyle: {
                                normal: {
                                    color: 'tomato',
                                    barBorderColor: 'tomato',
                                    barBorderWidth: 6,
                                    barBorderRadius: 0,
                                    label: {
                                        show: true, position: 'insideTop'
                                    }
                                }
                            },
                            data: $scope.series
                        },
                        {
                            name: '任务量',
                            type: 'bar',
                            stack: 'sum',
                            itemStyle: {
                                normal: {
                                    color: '#fff',
                                    barBorderColor: 'tomato',
                                    barBorderWidth: 6,
                                    barBorderRadius: 0,
                                    label: {
                                        show: true,
                                        position: 'top',
                                        formatter: function (params) {
                                            for (var i = 0, l = option.xAxis[0].data.length; i < l; i++) {
                                                if (option.xAxis[0].data[i] == params.name) {
                                                    return option.series[0].data[i] + params.value;
                                                }
                                            }
                                        },
                                        textStyle: {
                                            color: 'tomato'
                                        }
                                    }
                                }
                            },
                            data: $scope.serie
                        }
                    ]
                };

                myChart.setOption(option);
            }else{
                $scope.cls = 'show';
                $scope.clss = 'hide';
            }
        })
        $scope.topicsModify = function(){
            location.href = '/study-src/#/topics.input/'+$routeParams.id;
        }
        
       
           
    }])