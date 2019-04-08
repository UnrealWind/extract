angular.module('infi-basic').controller('OverviewController', ['$scope', 'RecordService', '$routeParams', 'OverviewService', 'rightNavService','PrintService','$q', 'SYS','Utils', '$filter', function ($scope, RecordService, $routeParams, OverviewService, rightNavService,PrintService,$q,SYS,Utils,$filter) {
    // 产科档案页面controller

    $scope.queryParams = {
        xlPatientId: $routeParams.xlPatientId,
        xlMedicalId: $routeParams.xlMedicalId,
        patientId: $routeParams.id
    };

    var xlPatientId = $scope.queryParams.xlPatientId;
    var xlMedicalId = $scope.queryParams.xlMedicalId;
    $scope.num = 2;
    $scope.isShow = true;
    $scope.SYS = SYS;
    //能否创建新的产科档案
    $scope.creatAble = true;
    //编辑还是创建孕检档案
    $scope.pregnancyStatus = false;

    var list = [
        {
            label: '门诊信息',
            value: 'entity',
            url: '1',
            xlMedicalId: xlMedicalId
        },
        {
            label: "基本信息",
            value: "basicInfo",
            url: "2",
            xlMedicalId: xlMedicalId
        },
        {
            label: "既往史及家族史",
            value: "familyHistory",
            url: "4",
            xlMedicalId: xlMedicalId
        },
        {
            label: "全身检查",
            value: "whole",
            url: "5",
            xlMedicalId: xlMedicalId
        },
        {
            label: "检验",
            value: "oblist",
            url: "13",
            xlPatientId: xlPatientId
        },
        {
            label: "化验",
            value: "testInfo",
            url: "6",
            xlMedicalId: xlMedicalId
        },
        {
            label: "早孕检查",
            value: "early",
            url: "7",
            xlMedicalId: xlMedicalId
        },
        {
            label: "首次检查",
            value: "first",
            url: "8",
            xlMedicalId: xlMedicalId
        },

        {
            label: "婴儿",
            value: "childInfo",
            url: "17",
            xlMedicalId: xlMedicalId
        },
        {
            label: "产妇",
            value: "momInfo",
            url: "16",
            xlMedicalId: xlMedicalId
        }
    ];

    /**
     * 请求多组数据
     * @type {*[]}
     */
    var listGroup = [
        {
            label: "孕产史",
            value: "maters",
            url: "3",
            xlMedicalId: xlMedicalId
        },
        {
            label: "复诊信息",
            value: "diagnose",
            url: "11",
            xlMedicalId: xlMedicalId
        },
        {
            label: "检查",
            value: "oblist",
            url: "13",
            xlPatientId: xlPatientId
        }
        , {
            label: "检查信息",
            value: "exam",
            url: "12",
            xlPatientId: xlPatientId,
            xlMedicalId: xlMedicalId
        },
        {
            label: "处方信息",
            value: "drugInfi",
            url: "14",
            xlPatientId: xlPatientId,
            xlMedicalId: xlMedicalId
        }
    ];
    /**
     * 获取tab数据
     * @type {string}
     */
    var url = 'overview.type.json';
    RecordService.getOverviewType(url).then(function success(msg) {
        $scope.dataTypes = msg.data;
        $scope.dataTypes[0].active = true;
        $scope.currentDataType = $scope.dataTypes[0].value;
        $q.all({first:RecordService.getDailyHighList($scope.queryParams.patientId,$scope.queryParams.xlMedicalId),
            second:RecordService.getDailyLowList($scope.queryParams.patientId,$scope.queryParams.xlMedicalId)}).then(function(arr){
            if(!arr.first.highPressList){
                arr.first.highPressList = [];
            }
            if(!arr.second.lowPressList){
                arr.second.lowPressList = [];
            }
            //用于页面状态显示(用status判断，status为false显示暂无数据)
            $scope.highPressListWrap = arr.first;
            $scope.lowPressListWrap = arr.second;
            // 区分录入的为一条数据还是多条数据，根据数据的条数进行不同图的绘制
            // 场景1: 高压或低压只有一条数据,另外一条数据为0
            // 场景2: 高压或低压只有一条数据,另外一条数据大于1条
            if(arr.first.highPressList&&arr.first.highPressList.length == 1 || arr.second.lowPressList&&arr.second.lowPressList.length == 1){
                //高压或低压只有一条数据,另外一条数据大于1条
                if(arr.first.highPressList.length > 1 || arr.second.lowPressList.length > 1){
                    drawEchart(arr.first.highPressList,arr.second.lowPressList);
                }else{
                    drawEchart4(arr.first.highPressList,arr.second.lowPressList);
                }
            }else{
                // 有两个场景,高压或低压其中一条是两点数据以上,另外一条是0或者也是两点数据以上-
                drawEchart(arr.first.highPressList,arr.second.lowPressList);
            }
        });
        RecordService.getDailyWeightList($scope.queryParams.patientId,$scope.queryParams.xlMedicalId).then(function(msg){
            $scope.weightListWrap = msg;
            if(msg.weightList&&msg.weightList.length == 1){
                drawEchart5(msg.weightList);
            }else{
                drawEchart2(msg.weightList)
            }
        });
        RecordService.getDailyList($scope.queryParams.patientId, $scope.queryParams.xlMedicalId).then(function success(msg) {
            if(msg.status == SYS.STATUS_SUCCESS){
                var length = msg.data.length;
                var nearWeek = msg.data[length-1];
                var nowDate = $filter('date')(new Date(),'yyyy-MM-dd');
                if(nearWeek.recordDate == nowDate){
                    $scope.pregnancyStatus = true;
                }
            }
        });
    });

    //获取数据,数据的获取
    $scope.queryIndexes = function () {
        var idx, entity;
        for (idx = 0; idx < list.length; idx++) {
            entity = list[idx];
            //下面的检查信息需要用到entity(基本信息)里的时间
            if(entity.value != "entity"){
                RecordService.getInfo(entity.xlMedicalId, entity.xlPatientId, entity.value, $scope.queryParams.patientId, entity.url).then(function success(msg) {
                    $scope[msg.type + 'Wrap'] = msg.data;
                    $scope[msg.type] = msg.data.data.result[0];
                })
            }
        }
        RecordService.getInfo($scope.queryParams.xlMedicalId, '', 'entity', $scope.queryParams.patientId, 1).then(function success(msg) {
            $scope[msg.type + 'Wrap'] = msg.data;
            $scope[msg.type] = msg.data.data.result[0];
            if($scope.entityWrap.status == SYS.STATUS_SUCCESS){
                //设置这个是为了加在请求路径中
                $scope.hospitalDate = $scope.entity.first_register_date;
                if(msg.data.status == SYS.STATUS_SUCCESS){
                    //页面显示多条信息数据的获取
                    var idy, wrap;
                    for (idy = 0; idy < listGroup.length; idy++) {
                        wrap = listGroup[idy];
                        // if(wrap.label == "检查信息"){
                        //     wrap.date =  $scope.hospitalDate;
                        // }
                        RecordService.getInfo(wrap.xlMedicalId, wrap.xlPatientId, wrap.value, $scope.queryParams.patientId, wrap.url, '').then(function success(msg) {
                            $scope[msg.type + 'Wrap'] = msg.data;
                            $scope[msg.type] = msg.data.data.result;
                        })
                    }
                }
            }
        });

        // function genKey(entity) {
        //     var keys = [];
        //     keys.push(entity.presc_date ? entity.presc_date : '_');
        //     keys.push(entity.dept_name ? entity.dept_name : '_');
        //     return keys.join();
        // }
    };
    $scope.queryIndexes();

    /**
     * 孕产史显示更多
     * @param maters
     */
    $scope.lookMores = function (maters) {
        $scope.num = maters.length;
        $scope.isShow = false;
    };

    /**
     * 孕产史收起
     * @param maters
     */
    $scope.closeMores = function (maters) {
        $scope.num = 2;
        $scope.isShow = true;
    };

    /**
     * tabs 切换
     * @param type
     */
    $scope.activeType = function (type) {
        angular.forEach($scope.dataTypes, function (entity) {
            entity.active = false;
        });
        type.active = true;
        $scope.currentDataType = type.value;
        if (type.value == 'jianyan') {
            RecordService.getInfo(xlMedicalId, xlPatientId, 'oblist', $scope.queryParams.patientId, 13, '').then(function success(msg) {
                $scope.oblistWrap = msg.data;
                $scope.oblist = msg.data.data.result;
                $scope.selectType($scope.oblist[0],$scope.hospitalDate);
            });
        }
    };

    /**
     * 检验信息绘图
     * @param list
     * @param index
     */
    $scope.showExamInfo = function (list, index) {
        $scope.currentExamInfoByTime = list;
        $scope.currentExamInfoByTimeIndex = index;
        var first = list ? list[0] : {};
        $scope.showExamInfoTrend(first,first.report_item_name);
    };

    $scope.showExamInfoTrend = function (type,name) {
        var data = $scope.examInfoByClass[name];
        drawEchart3(data);
        if($scope.currentExamInfoByTime){
            $scope.currentExamInfoByTime.forEach(function(entity){
                entity.active  = false;
            });
        }
        type.active = true;
    };
    /**
     * 根据检验类型获取检验数据,并对数据进行处理
     * @param obList
     * @param time
     */
    $scope.selectType = function (obList,time) {
        if (obList) {
            angular.forEach($scope.oblist, function (entity) {
                entity.active = false;
            });
            obList.active = true;
            var test = obList.test_class;
            // RecordService.getExam('', xlPatientId, 'testClass', $scope.queryParams.patientId, 64, test, '').then(function success(msg) {
            RecordService.getExam('', xlPatientId, 'testClass', $scope.queryParams.patientId, 67, test, '').then(function success(msg) {
                $scope.examInfoList = msg.data.result;
                var data = {},
                    byTimes = {},
                    dataByTimes,
                    timesKey,
                    entity,
                    idx,
                    length = msg.data.result.length,
                    firstList,
                    list = {};
                for (idx = 0; idx < length; idx++) {
                    entity = msg.data.result[idx];
                    key = entity.report_item_name;
                    timesKey = entity.requested_date_time;
                    list = data[key];
                    dataByTimes = byTimes[timesKey];
                    if (list == undefined) {
                        list = data[key] = [];
                    }

                    if (dataByTimes == undefined) {
                        dataByTimes = byTimes[timesKey] = [];
                    }
                    if (firstList == undefined) {
                        firstList = dataByTimes;
                    }
                    list.push(msg.data.result[idx]);
                    dataByTimes.push(entity);
                }
                $scope.examInfoByTimes = byTimes;
                $scope.examInfoByClass = data;
                $scope.showExamInfo(firstList, 0);
            });
        }
    };

    /**
     * 获取时间轴历次就诊信息数据
     */
    OverviewService.ajaxOverviews(xlPatientId).then(function (msg) {
        $scope.timelineDatas = msg;
        $scope.navList = rightNavService.filterByYear($scope.timelineDatas);
        $scope.navListDoor = rightNavService.filterYearDoor($scope.timelineDatas);
    });

    /**
     * 获取时间轴产科记录数据
     */
    RecordService.getInfo('', '', 'timeList', $scope.queryParams.patientId, 58).then(function success(msg) {
        $scope.archivesWrap = msg.data;
        $scope.archives = msg.data.data.result;
    });

    /**
     * 绘制血压图
     * @param heightData
     * @param lowListData
     */
    function drawEchart(heightData,lowListData) {
        if (heightData||lowListData) {
            var idx = 0;
            var entity;
            var value;

            var echartsOptions = {
                title: {
                    text: '血压趋势图',
                    textStyle:{
                        color:'#428bca'
                    }
                },
                tooltip: {},
                xAxis: {
                    data: []
                },
                yAxis: {
                },
                series: [
                    {
                        symbol: 'none',
                        lineStyle: {
                            normal: {
                                width: 0,
                                color: '#ffff'
                            }
                        },
                        name: '收缩压',
                        type: 'line',
                        markPoint:{
                            symbol:'circle',
                            symbolSize:7,
                            large:true,
                            itemStyle:{
                                normal:{
                                    label:{
                                        show:false
                                    }
                                }

                            },
                            data:[]
                        },
                        markLine: {
                            symbol:'circle',
                            symbolSize:'4',
                            tooltip:{
                                show:true
                            },
                            label:true,
                            data:[],
                            lineStyle:{
                                normal:{
                                    type:'solid'
                                }
                            }
                        }
                    },
                    {
                        name: '舒张压',
                        type: 'line',
                        symbol: 'none',
                        lineStyle: {
                            normal: {
                                width: 0,
                                color: '#ffff'
                            }
                        },
                        markPoint:{
                            symbol:'circle',
                            symbolSize:7,
                            large:true,
                            itemStyle:{
                                normal:{
                                    label:{
                                        show:false
                                    }
                                }

                            },
                            data:[]
                        },
                        markLine: {
                            symbol:'circle',
                            symbolSize:'4',
                            tooltip:{
                                show:true
                            },
                            label:true,
                            data:[],
                            lineStyle:{
                                normal:{
                                    type:'solid'
                                }
                            }
                        }
                    },
                    {
                        name: '舒张压参考',
                        type: 'line',
                        lineStyle: {
                            normal: {
                                width: 0,
                                color: '#ffff'
                            }
                        },
                        markLine: {
                            tooltip:{
                                show:true
                            },
                            label:true,
                            data:[
                                {
                                    yAxis:90
                                }
                            ],
                            lineStyle:{
                                normal:{
                                    type:'dashed'
                                }
                            }
                        }
                    },
                    {
                        name: '收缩压参考',
                        type: 'line',
                        lineStyle: {
                            normal: {
                                width: 0,
                                color: '#ffff'
                            }
                        },
                        markLine: {
                            tooltip:{
                                show:true
                            },
                            label:true,
                            data:[
                                {
                                    yAxis:140
                                }
                            ],
                            lineStyle:{
                                normal:{
                                    type:'dashed',
                                    color:'red'
                                }
                            }
                        }
                    }
                ]
            };
            //用于设置series中的markLine中相关的数据和方法
            var weekStr,sigleWeekData,heightArray,lowArray;
            //这两个单独定义,用于markPoint 显示;
            var heightNoNullNoReapt,lowNoNullNoReapt,weekstrLow;
            //这个情况适用于只有低压或者只有高压,高压或低压必须两点以上数据,这个就是哪个有数据就用哪个获取横轴的数据
            if(heightData.length>0){
                weekStr = angular.copy(heightData);
            }else{
                weekStr = angular.copy(lowListData);
            }
            weekstrLow = angular.copy(lowListData);
            heightArray = angular.copy(heightData);
            lowArray = angular.copy(lowListData);
            sigleWeekData = removeRepeat(weekStr);//去重显示周
            //设置markPoint相关的数据和方法
            heightNoNullNoReapt = angular.copy(sigleWeekData);
            lowNoNullNoReapt = removeRepeat(weekstrLow);
            heightNoNullNoReapt = spliceNullValue(heightNoNullNoReapt);//去空，去除空的数据
            lowNoNullNoReapt = spliceNullValue(lowNoNullNoReapt);

            //用来绘制markLine
            heightArray = spliceNullValue(heightArray);
            lowArray = spliceNullValue(lowArray);

            // 进行数组分割
            heightArray = SeparateArray(heightArray,2);
            lowArray = SeparateArray(lowArray,2);

            echartsOptions.xAxis.data = [];
            echartsOptions.series[0].data = [];
            //之前这少定义了
            echartsOptions.series[1].data = [];
            for (idx = 0; idx < sigleWeekData.length; idx++) {
                entity = sigleWeekData[idx];
                //这个地方需要显示时间
                echartsOptions.xAxis.data.push(entity.label + '周');
                echartsOptions.series[0].data.push(0);
                echartsOptions.series[1].data.push(300);
            }
            //如果高压或者低压只有一个值的时候,就不绘线了,只绘一个点就好了
            if(heightArray[0].length>1){
                echartsOptions.series[0].markLine.data = heightArray;
            }
            if(lowArray[0].length>1){
                echartsOptions.series[1].markLine.data = lowArray;
            }
            //markPoint 数据格式化处理,以及data赋值;
            echartsOptions.series[0].markPoint.data = formattingMarkPoint(heightNoNullNoReapt);
            echartsOptions.series[1].markPoint.data = formattingMarkPoint(lowNoNullNoReapt);
            setTimeout(function(){
                var myChart = echarts.init(document.getElementById('bloodChart'));
                myChart.setOption(echartsOptions);
            },20);

        } else {
            $('#bloodChart').text('暂无数据');
        }
    }

    /**
     * 绘制体重图
     * @param testList
     */
    function drawEchart2(testList) {
        if (testList && testList.length > 0) {
            var idx = 0;
            var entity;

            var echartsOptions = {
                title: {
                    text: '体重趋势图',
                    textStyle:{
                        color:'#428bca'
                    }
                },
                tooltip: {},
                xAxis: {
                    data: []
                },
                yAxis: {},
                series: [{
                    type: 'line',
                    symbol: 'none',
                    name:'体重',
                    lineStyle:{
                        normal:{
                            width:0,
                            color:''
                        }
                    },
                    markPoint:{
                        symbol:'circle',
                        symbolSize:7,
                        large:true,
                        itemStyle:{
                            normal:{
                                label:{
                                    show:false
                                }
                            }

                        },
                        data:[]
                    },
                    markLine:{
                        symbol:'circle',
                        symbolSize:'4',
                        label:true,
                        data:[
                        ],
                        lineStyle:{
                            normal:{
                                type:'solid'
                            }
                        }

                    }
                }]
            };
            var weekStr,
                strData,
                strDataNoNull,
                SingleArray,
                yAxisMin,
                yAxisMax;
            var weightMark;
            weekStr = angular.copy(testList);
            strData = angular.copy(testList);
            SingleArray = removeRepeat(weekStr);
            //关于markPoint的相关方法
            weightMark = angular.copy(SingleArray);
            weightMark = spliceNullValue(weightMark);
            strDataNoNull = spliceNullValue(strData);

            yAxisMin = getMinData(strDataNoNull);
            yAxisMax = getMaxData(strDataNoNull);
            strData = SeparateArray(strDataNoNull,2);
            echartsOptions.xAxis.data = [];
            echartsOptions.series[0].data = [];
            for (idx = 0; idx < SingleArray.length; idx++) {
                entity = SingleArray[idx];
                echartsOptions.xAxis.data.push(entity.label + '周');
                if(strDataNoNull.length == 1){
                    echartsOptions.series[0].data.push(500)
                }else{
                    echartsOptions.series[0].data.push(500)
                }

            }
            echartsOptions.yAxis.min = 20;//最小值为20
            echartsOptions.yAxis.max = yAxisMax;
            echartsOptions.series[0].markLine.data = strData;
            echartsOptions.series[0].markPoint.data = formattingMarkPoint(weightMark);
            setTimeout(function(){
                var myChart = echarts.init(document.getElementById('weightChart'));
                myChart.setOption(echartsOptions);
            },100);
        } else {
            $('#weightChart').text('暂无数据');
        }
    }

    /**
     * 将对象里面的值取出返回数组
     * @param options
     * @returns {Array}
     */
    function objToArray(options){
        var str = [];
        if(options.length == 0){
            str.push(0);
        }else{
            angular.forEach(options,function(option){
                str.push(option.value)
            });
        }
        return str;
    }
    
    /**
     * 获取最小值
     * @param options
     * @returns {Number}
     */
    function getMinData(options){
        var minDataArray = objToArray(options),
            minData = Math.min.apply(null,minDataArray);
        return parseInt(minData);
    }

    /**
     * 获取最大值
     * @param options
     * @returns {number}
     */
    function getMaxData(options){
        var maxDataArray = objToArray(options),
            maxData = Math.max.apply(null,maxDataArray);
        return parseInt(maxData)+1;
    }

    /**
     * 将数组分隔为每subGroupLength长度,为一个数组的形式,并将按要求进行格式化
     * @param str
     * @param subGroupLength
     * @returns {Array}
     * @constructor
     */
    function SeparateArray(str, subGroupLength) {
        var listData = {
            xAxis:'',
            yAxis:''
        };
        var lsitStr = [];
        var j = 0, length = str.length;
        for (j;j<length;j++){
            listData = {
                xAxis:str[j].label+'周',
                yAxis:str[j].value
            };
            lsitStr.push(listData);

        }
        var i=0,listLength = lsitStr.length,newArray=[];
        if(listLength>1){
            while (i < listLength) {
                newArray.push(lsitStr.slice(i, i += subGroupLength));
            }
        }else{
            newArray.push(listData);
        }
        return newArray;
    }

    /**
     * 去除数据中重复数据
     * @param arr
     * @returns {*}
     */
    function removeRepeat(arr){
        for(var i= 0; i<arr.length;i++){
            for(var j = i+1;j<arr.length;j++){
                if(arr[i].label == arr[j].label){
                    arr.splice(j,1)
                }
            }
        }
        return arr;
    }

    /**
     * 去除数组中value值为空的数据
     * @param str
     * @returns {*}
     */
    function spliceNullValue(str){
        for(var i= 0; i<str.length;i++){
            if(str[i].value == undefined){
                str.splice(i,1);
                i--;
            }
        }
        return str;
    }

    /**
     * markPoint 数据格式化
     * @param markData
     * @returns {Array}
     */
    function formattingMarkPoint(markData){
        var i = 0,markLength = markData.length,markObject,markArray=[];
        for(i;i<markLength;i++){
            markObject={
                name: markData[i].label+'周',
                value: markData[i].value,
                xAxis: markData[i].label+'周',
                yAxis: markData[i].value
            };
            markArray.push(markObject);
        }
        return markArray;
    }

    /**
     * 绘制检验图
     * @param testList
     */
    function drawEchart3(testList) {
        if (testList && testList.length > 0) {

            angular.forEach(testList, function (exam) {
                titles = exam.report_item_name;
            });
            var idx = 0;
            var entity;

            var echartsOptions = {
                title: {
                    text: titles
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    data: []
                },
                yAxis: {},
                series: [{
                    name: titles,
                    type: 'bar',
                    barWidth: '35%',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            };
            echartsOptions.xAxis.data = [];
            echartsOptions.series[0].data = [];
            for (idx = 0; idx < testList.length; idx++) {
                entity = testList[idx];
                if (entity.requested_date_time != null && entity.requested_date_time != undefined) {
                    var Newdate = new Date(entity.requested_date_time);
                    var dateYear = Newdate.getFullYear();
                    var dateMonth = Newdate.getMonth() + 1;
                    var dateDay = Newdate.getDate();
                    var dataTime = dateYear.toString() + '-' + dateMonth.toString() + '-' + dateDay.toString();
                } else {
                    dataTime = '';
                }
                echartsOptions.xAxis.data.push(dataTime);
                echartsOptions.series[0].data.push(entity.result);
            }
            //ljy_debug解决默认绘制第一次找不到dom的时差问题
            setTimeout(function(){
                var myChart = echarts.init(document.getElementById('testChart'));
                myChart.setOption(echartsOptions);
            },10);
        } else {
            $('#testChart').text('暂无数据');
        }
    }


    /**
     * 绘制血压单点图
     * @param heightData
     * @param lowData
     */
    function drawEchart4(heightData,lowData) {
        if (heightData && heightData.length > 0||lowData && lowData.length > 0) {
            var idx = 0;
            var entity;

            // var echartsOptions = {
            //     title: {
            //         text: '血压趋势图'
            //     },
            //     tooltip: {},
            //     xAxis: {
            //         data: []
            //     },
            //     yAxis: {},
            //     series: [{
            //         name: '收缩压',
            //         type: 'line',
            //         data: [],
            //         symbolSize:20,
            //         markLine:{
            //             data:[
            //                 {
            //                     yAxis:140
            //                 }
            //             ]
            //
            //         }
            //     },
            //     {
            //         name: '舒张压',
            //         type: 'line',
            //         data: [],
            //         symbolSize:20,
            //         markLine:{
            //             data:[
            //                 {
            //                     yAxis:90
            //                 }
            //             ]
            //
            //         }
            //     }
            //     ]
            // };
            // echartsOptions.xAxis.data = [];
            // echartsOptions.series[0].data = [];
            // echartsOptions.xAxis.data.push(heightData[0].label+'周');
            // if(heightData.length>0){
            //     echartsOptions.series[0].data.push(heightData[0].value);
            // }
            // if(lowData.length>0){
            //     echartsOptions.series[1].data.push(lowData[0].value);
            // }
            var echartsOptions = {
                title: {
                    text: '血压趋势图'
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['收缩压','舒张压']
                },
                xAxis : [
                    {
                        type : 'category',
                        data : []
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'收缩压',
                        type:'bar',
                        data:[],
                        barMaxWidth:'100',
                        barGap:'80%',
                        markLine:{
                            data:[
                                {
                                    yAxis:140
                                }
                            ]

                        }
                    },
                    {
                        name:'舒张压',
                        type:'bar',
                        data:[],
                        barMaxWidth:'100',
                        barGap:'80%',
                        markLine:{
                            data:[
                                {
                                    yAxis:90
                                }
                            ]
                        }
                    }
                ]
            };
            echartsOptions.xAxis.data = [];
            echartsOptions.series[0].data = [];
            echartsOptions.xAxis[0].data.push(heightData[0].label+'周');
            if(heightData.length>0){
                echartsOptions.series[0].data.push(heightData[0].value);
            }
            if(lowData.length>0){
                echartsOptions.series[1].data.push(lowData[0].value);
            }
            console.log(echartsOptions)
            setTimeout(function(){
                var myChart = echarts.init(document.getElementById('bloodChart'));
                myChart.setOption(echartsOptions);
            },100);
        } else {
            $('#bloodChart').text('暂无数据');
        }
    }

    /**
     * 绘制体重的单点图
     * @param testList
     */
    function drawEchart5(testList) {
        if (testList && testList.length > 0) {
            var idx = 0;
            var entity;

            // var echartsOptions = {
            //     title: {
            //         text:'体重趋势图'
            //     },
            //     tooltip: {},
            //     xAxis: {
            //         data: []
            //     },
            //     yAxis: {},
            //     series: [{
            //         name: '体重趋势图',
            //         type: 'line',
            //         data: [5, 20, 36, 10, 10, 20]
            //     }]
            // };
            // echartsOptions.xAxis.data = [];
            // echartsOptions.series[0].data = [];
            // for (idx = 0; idx < testList.length; idx++) {
            //     entity = testList[idx];
            //     echartsOptions.xAxis.data.push(entity.label+'周');
            //     echartsOptions.series[0].data.push(entity.value);
            // }
            var echartsOptions = {
                title: {
                    text:'体重趋势图'
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                        data: []
                },
                yAxis: {
                    type: 'value',
                    min:20
                },
                series: [{
                    name:'体重',
                    data: [],
                    barMaxWidth:'100',
                    type: 'bar'
                }]
            };
            echartsOptions.xAxis.data = [];
            echartsOptions.series[0].data = [];
            for (idx = 0; idx < testList.length; idx++) {
                entity = testList[idx];
                echartsOptions.xAxis.data.push(entity.label+'周');
                echartsOptions.series[0].data.push(entity.value);
            }

            setTimeout(function(){
                var myChart = echarts.init(document.getElementById('weightChart'));
                myChart.setOption(echartsOptions);
            },100);
        } else {
            $('#testChart').text('暂无数据');
        }
    }

    /**
     * 创建产科档案,判断所有的都关闭了才能创建
     */
    $scope.creatObstetrics = function(){
        //判断条件暂时去掉
        angular.forEach($scope.archives,function(archives){
            if(archives.status != "关闭"){
                $scope.creatAble = false;
            }
        });
        if($scope.creatAble){
            window.location.href = "#/record/input/"+$scope.queryParams.xlPatientId+"/"+$scope.queryParams.patientId+"/first";
        }else{
            var msg = {
                status:SYS.STATUS_ERROR,
                description:"已存在使用中档案，请关闭后再试"
            };
            Utils.sysTip($scope,msg);
        }
    };

    $scope.printObstetrics = function(){
        PrintService.bindPrint("obstetrics");
    };

    /**
     * 关闭产科档案弹出模态框
     */
    $scope.closeObstetrics = function(){
        /**
         * 获取基本信息数据
         */
        RecordService.getCaseList('basicInfo',$scope.queryParams.patientId,$scope.queryParams.xlMedicalId).then(function(msg){
            $scope.closeReason=msg.data.data;
            if($scope.closeReason==null||$scope.closeReason==undefined){
                $scope.closeReason={};
            }
        });
        $('#close-obstetrics').modal({backdrap:'static'});
    };

    /**
     * 确认关闭按钮
     * @param reason
     */
    $scope.submitClose = function(reason){
        reason.status = "关闭";
        RecordService.saveBasicInfo(reason).then(function success(msg){
            Utils.sysTip($scope,msg);
            if(msg.status == SYS.STATUS_SUCCESS){
                $scope.queryIndexes();
                /**
                 * 重新获取产科档案
                 */
                RecordService.getInfo('', '', 'timeList', $scope.queryParams.patientId, 58).then(function success(msg) {
                    $scope.archivesWrap = msg.data;
                    $scope.archives = msg.data.data.result;
                });
                $("#close-obstetrics").modal('hide');
            }
        })
    };
    /**
     * 鼠标悬浮时显示关闭原因
     */
    $scope.mouseOver = function(){
        $('#closePopover').popover('show')
    };
    /**
     * 鼠标悬浮时显示关闭原因
     */
    $scope.mouseLeave = function(){
        $('#closePopover').popover('hide')
    }
}]);
