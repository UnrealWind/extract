angular.module('infi-basic').controller('OverInHospitalController', ['$scope', 'RecordService', '$routeParams', 'OverviewService', 'rightNavService', 'SYS', function ($scope, RecordService, $routeParams, OverviewService, rightNavService, SYS) {
    // 住院页面controller

    $scope.queryParams = {
        xlPatientId: $routeParams.xlPatientId,
        xlMedicalId: $routeParams.xlMedicalId,
        patientId: $routeParams.id
    };

    $scope.SYS = SYS;

    var xlPatientId = $scope.queryParams.xlPatientId;
    var xlMedicalId = $scope.queryParams.xlMedicalId;
    var list = [
        {
            label: "基本信息",
            value: "basicInfo",
            url: "18",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "主诉",
            value: "mainTalk",
            url: "24",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "吸烟史",
            value: "smoke",
            url: "25",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "饮酒史",
            value: "wine",
            url: "26",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "体温",
            value: "temperature",
            url: "33",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "脉搏",
            value: "pulse",
            url: "34",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "呼吸",
            value: "breathe",
            url: "35",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "血压",
            value: "bloodPressure",
            url: "36",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "身高",
            value: "height",
            url: "37",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "体重",
            value: "weight",
            url: "38",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "BMI",
            value: "bmi",
            url: "39",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        }
    ];

    var lists = [
        {
            label: "门急诊",
            value: "outpatientDiagnose",
            url: "20",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "入院诊断",
            value: "inDiagnose",
            url: "22",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "出院诊断",
            value: "outDiagnose",
            url: "23",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "家族史",
            value: "family",
            url: "27",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "检查信息",
            value: "exam",
            url: "41",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "医嘱信息",
            value: "doctor",
            url: "43",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "手术信息",
            value: "surgery",
            url: "44",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "药品信息",
            value: "drugInfi",
            url: "40",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "家族史",
            value: "family",
            url: "27",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "疾病史",
            value: "disease",
            url: "28",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "既往手术史",
            value: "pastsurgery",
            url: "29",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "外伤史",
            value: "trauma",
            url: "30",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "输血史",
            value: "blood",
            url: "31",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "过敏史",
            value: "allergy",
            url: "32",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        }
        ,
        {
            label: "电子病例信息",
            value: "caseInfo",
            url: "45",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        }
    ];
    /**
     * 用于迭代tab的数据获取，并自动显示第一个
     */
    var url = 'overview.inhospital.tabs.json';
    RecordService.getOverviewType(url).then(function success(msg) {
        $scope.dataTypes = msg.data;
        $scope.dataTypes[0].active = true;
        $scope.currentDataType = $scope.dataTypes[0].value;
    });

    /**
     * 获取住院信息数据
     */
    $scope.queryIndexes = function () {
        var idx,
            entity;
        for (idx = 0; idx < list.length; idx++) {
            entity = list[idx];
            RecordService.getInfo(entity.medicalId, entity.patientId, entity.value, $scope.queryParams.patientId, entity.url, entity.date).then(function success(msg) {
                $scope[msg.type + 'Wrap'] = msg.data;
                $scope[msg.type] = msg.data.data.result[0];
            });
        }

        var idy, wrap;
        for (idy = 0; idy < lists.length; idy++) {
            wrap = lists[idy];
            RecordService.getInfo(wrap.medicalId, wrap.patientId, wrap.value, $scope.queryParams.patientId, wrap.url, wrap.date).then(function success(msg) {
                $scope[msg.type + 'Wrap'] = msg.data;
                $scope[msg.type] = msg.data.data.result;
            });
        }
    };
    $scope.queryIndexes();

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
        if (type.value == 'test') {
            RecordService.getInfo(xlMedicalId, xlPatientId, 'oblist', '', 60).then(function success(msg) {
                $scope.olistWrap = msg.data;
                $scope.oblist = msg.data.data.result;
                $scope.selectType($scope.oblist[0]);
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
     * 根据检验类型获取检验信息数据
     * @param obList
     */
    $scope.selectType = function (obList) {
        if (obList) {
            angular.forEach($scope.oblist, function (entity) {
                entity.active = false;
            });
            obList.active = true;
            var test = obList.test_class;
        }
        RecordService.getfExam(xlPatientId, xlMedicalId, 'testClass', $scope.queryParams.patientId, 63, test).then(function success(msg) {
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
    };

    /**
     * 获取时间轴历次就诊信息数据
     */
    OverviewService.ajaxOverviews(xlPatientId).then(function (msg) {
        $scope.timelineDatas = msg;
        $scope.navList = rightNavService.filterByYear($scope.timelineDatas);
        $scope.navListDoor = rightNavService.filterYearDoor($scope.timelineDatas);

        $scope.navListTitle =confirmState( $scope.navList);
    });


    function confirmState(data) {
        if(data){
            var thisSection = '';
            angular.forEach(data,function(wrap){
                angular.forEach(wrap.events,function(entity){
                    if(entity.xlMedicalId == $scope.queryParams.xlMedicalId){
                        thisSection = entity;
                    }
                })
            });
            return thisSection;
        }
    }

    /**
     * 获取时间轴产科档案信息
     */
    RecordService.getInfo('', '', 'timeList', $scope.queryParams.patientId, 58).then(function success(msg) {
        $scope.archivesWrap = msg.data;
        $scope.archives = msg.data.data.result;
    });

    /**
     * 绘制检验图
     * @param testList
     */
    function drawEchart3(testList) {
        if (testList && testList.length > 0) {
            angular.forEach(testList, function (exam) {
                titles = exam.report_item_name;
            });
            var idx = 0,
                entity;

            var echartsOptions = {
                title: {
                    text: titles
                },
                tooltip: {},
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
            setTimeout(function () {
                var myChart = echarts.init(document.getElementById('testChart'));
                myChart.setOption(echartsOptions);
            }, 10);
        } else {
            $('#testChart').text('暂无数据');
        }
    }

    /**
     * 电子病例项目切换显示
     * @param entity
     */
    $scope.selectCaseType = function(entity){

        $scope.caseInfo.forEach(function(n){
            n.active = false;
        });
        entity.active = true;
    };
    /**
     * 默认显示第一条电子病例信息数据
     */
    $scope.$watch('caseInfo',function(newValue,oldValue){
        if(newValue === oldValue){
            return false;
        }
        if($scope.caseInfo.length > 0){
            $scope.selectCaseType($scope.caseInfo[0])
        }
    })

}]);
