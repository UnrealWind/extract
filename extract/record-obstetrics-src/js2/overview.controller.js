angular.module('infi-basic').controller('OverviewController', ['$scope', 'RecordService', '$routeParams', 'OverviewService', function ($scope, RecordService, $routeParams, OverviewService) {
    //该js 没有用到

    $scope.queryParams = {
        xlPatientId: $routeParams.xlPatientId,
        xlMedicalId: $routeParams.xlMedicalId,
        patientId: $routeParams.id
    };
    var xlPatientId = $scope.queryParams.xlPatientId;
    var xlMedicalId = $scope.queryParams.xlMedicalId;
    $scope.num = 2;
    $scope.isShow = true;

    var list = [
        {
            label: '门诊信息',
            value: 'entity',
            url: '1'
        },
        {
            label: "基本信息",
            value: "basicInfo",
            url: "2"
        },
        {
            label: "既往史及家族史",
            value: "familyHistory",
            url: "4"
        },
        {
            label: "全身检查",
            value: "whole",
            url: "5"
        },
        {
            label: "检验",
            value: "test",
            url: "13"
        },
        {
            label: "化验",
            value: "testInfo",
            url: "6"
        },
        {
            label: "早孕检查",
            value: "early",
            url: "7"
        },
        {
            label: "检查信息",
            value: "exam",
            url: "12"
        },
        {
            label: "婴儿",
            value: "childInfo",
            url: "17"
        },
        {
            label: "产妇",
            value: "momInfo",
            url: "16"
        },
        {
            label: "处方信息",
            value: "drugInfi",
            url: "14",
            medicalId: xlMedicalId,
            patientId: xlPatientId
        }
    ];

    var lists = [
        {
            label: "孕产史",
            value: "maters",
            url: "3"
        },
        {
            label: "复诊信息",
            value: "diagnose",
            url: "11"
        },
        {
            label: "检查",
            value: "test",
            url: "13",
            medicalId: xlMedicalId,
            patientId: xlPatientId

        }
    ];

    var url = 'overview.type.json';
    RecordService.getOverviewType(url).then(function success(msg) {
        $scope.dataTypes = msg.data;
        $scope.dataTypes[0].active = true;
        $scope.currentDataType = $scope.dataTypes[0].value;


        RecordService.getInfo('', '', 'blood', $scope.queryParams.patientId, 9).then(function success(msg) {
            if (msg.data.data.result) {
                drawEchart(msg.data.data.result)
            }
        });
        RecordService.getInfo('', '', 'weight', $scope.queryParams.patientId, 10).then(function success(msg) {
            if (msg.data.data.result) {
                drawEchart2(msg.data.data.result)
            }
        });
    });
    $scope.lookMores = function (maters) {
        $scope.num = maters.length;
        $scope.isShow = false;
    };
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
            examChart();
        }
    };


    function examChart() {
        RecordService.getInfo($scope.queryParams.xlMedicalId, $scope.queryParams.xlPatientId, 'oblist', '', 42).then(function success(msg) {
            $scope.oblist = msg.data.data.result;
            $scope.selectType($scope.oblist[0]);
        });
    }

    $scope.selectType = function (obList) {
        var test = obList.test_class;
        RecordService.getExam($scope.queryParams.xlMedicalId, $scope.queryParams.xlPatientId, 'testClass', '', 62, test).then(function success(msg) {
            drawEchart3(msg.data.result);
            $scope.examInfoList = msg.data.result;
            console.log(msg.data.result)
        });
    };
    $scope.queryIndexes = function () {
        var idx, entity;
        for (idx = 0; idx < list.length; idx++) {
            entity = list[idx];
            RecordService.getInfo(entity.medicalId, entity.patientId, entity.value, $scope.queryParams.patientId, entity.url).then(function success(msg) {
                $scope[msg.type] = msg.data.data.result[0];
            })
        }
        var idy, wrap;
        for (idy = 0; idy < lists.length; idy++) {
            wrap = lists[idy];
            RecordService.getInfo(wrap.medicalId, wrap.patientId, wrap.value, $scope.queryParams.patientId, wrap.url).then(function success(msg) {
                $scope[msg.type] = msg.data.data.result;
                console.log($scope.diagnose, 787676)
            })
        }
    };
    $scope.queryIndexes();

    OverviewService.ajaxOverviews(xlPatientId).then(function (msg) {
        $scope.timelineDatas = msg;
    });

    RecordService.getInfo('', '', 'timeList', $scope.queryParams.patientId, 58).then(function success(msg) {
        $scope.archives = msg.data.data.result;
        console.log($scope.archives)
    });
    function drawEchart(testList) {
        var data = [];
        var idx = 0;
        var entity;
        var value;

        var echartsOptions = {
            title: {
                text: '血压'
            },
            tooltip: {},
            xAxis: {
                data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
            },
            yAxis: {},
            series: [{
                name: '收缩压',
                type: 'line',
                markLine: {
                    data: [
                        {yAxis: 10}
                    ]
                },
                data: [5, 20, 36, 10, 10, 20]
            }, {
                name: '舒张压',
                type: 'line',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };
        echartsOptions.xAxis.data = [];
        echartsOptions.series[0].data = [];
        for (idx = 0; idx < testList.length; idx++) {
            entity = testList[idx];
            value = entity.xyvalue;
            //这个地方需要显示时间
            echartsOptions.xAxis.data.push(entity.xylabel);
            echartsOptions.series[0].data.push(value.split('/')[0]);
            echartsOptions.series[0].data.push(value.split('/')[1]);
        }
        var myChart = echarts.init(document.getElementById('bloodChart'));
        myChart.setOption(echartsOptions);
    }

    function drawEchart2(testList) {
        var idx = 0;
        var entity;

        var echartsOptions = {
            title: {
                text: '体重'
            },
            tooltip: {},
            xAxis: {
                data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
            },
            yAxis: {},
            series: [{
                name: '体重',
                type: 'line',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };
        echartsOptions.xAxis.data = [];
        echartsOptions.series[0].data = [];
        for (idx = 0; idx < testList.length; idx++) {
            entity = testList[idx];
            echartsOptions.xAxis.data.push(entity.tzlabel);
            echartsOptions.series[0].data.push(entity.tzvalue);
        }
        var myChart = echarts.init(document.getElementById('weightChart'));
        myChart.setOption(echartsOptions);
    }

    function drawEchart3(testList) {
        angular.forEach(testList, function (exam) {
            titles = exam.report_item_name
        });
        var idx = 0;
        var entity;

        var echartsOptions = {
            title: {
                text: titles
            },
            tooltip: {},
            xAxis: {
                data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
            },
            yAxis: {},
            series: [{
                name: '体重',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };
        echartsOptions.xAxis.data = [];
        echartsOptions.series[0].data = [];
        for (idx = 0; idx < testList.length; idx++) {
            entity = testList[idx];
            console.log(entity, 5555);
            var Newdate = new Date(entity.requested_date_time);
            var dateYear = Newdate.getFullYear();
            var dateMonth = Newdate.getMonth();
            var dateDay = Newdate.getDay();
            var dataTime = dateYear.toString() + '-' + dateMonth.toString() + '-' + dateDay.toString();
            echartsOptions.xAxis.data.push(dataTime);
            echartsOptions.series[0].data.push(entity.result);
        }
        var myChart = echarts.init(document.getElementById('testChart'));
        myChart.setOption(echartsOptions);
    }
}]);
