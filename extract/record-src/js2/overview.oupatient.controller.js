angular.module('infi-basic').controller('overviewOutpatientController', ['$scope', 'RecordService', '$routeParams', 'OverviewService', 'rightNavService', 'SYS', function ($scope, RecordService, $routeParams, OverviewService, rightNavService, SYS) {
    // 门诊页面controller

    $scope.queryParams = {
        xlPatientId: $routeParams.xlPatientId,
        xlMedicalId: $routeParams.xlMedicalId,
        patientId: $routeParams.id
    };

    var xlPatientId = $scope.queryParams.xlPatientId;
    var xlMedicalId = $scope.queryParams.xlMedicalId;

    var list = [
        {
            label: "药品信息",
            value: "drugInfi",
            url: "51",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "检查信息",
            value: "exam",
            url: "52",
            patientId: xlPatientId,
            medicalId: xlMedicalId
        },
        {
            label: "检验信息",
            value: "test",
            patientId: xlPatientId,
            medicalId: xlMedicalId,
            url: "53"
        }
    ];

    /**
     * 页面初始化获取门诊信息数据
     */
    $scope.queryIndexes = function () {
        var idx, entity;

        //
        RecordService.getInfo(xlMedicalId, xlPatientId, 'hospitalInfo', $scope.queryParams.patientId, '49', '').then(function success(msg) {
            $scope.hospitalInfoWrap = msg.data;
            if(msg.data.status == SYS.STATUS_SUCCESS){
                $scope.hospitalInfo = msg.data.data.result[0];
                var Newdate = new Date($scope.hospitalInfo.visit_date);
                var dateYear = Newdate.getFullYear();
                var dateMonth = (Newdate.getMonth() + 1).toString();
                if (dateMonth.length < 2) {
                    dateMonth = '0' + dateMonth;
                }
                var dateDay = Newdate.getDate().toString();
                if (dateDay.length < 2) {
                    dateDay = '0' + dateDay;
                }
                var dataTime = dateYear.toString() + '-' + dateMonth.toString() + '-' + dateDay;
                $scope.hospitalDate = dataTime;//现在暂时不用
                //获取诊断信息
                RecordService.getInfo(xlMedicalId, xlPatientId, 'diagnose', $scope.queryParams.patientId, '50', '').then(function success(msg) {
                    $scope.diagnoseWrap = msg.data;
                    $scope.diagnose = msg.data.data.result;
                });
                //获取检查检验和药品信息(因为要获取时间,现在放到这个请求里面了)
                for (idx = 0; idx < list.length; idx++) {
                    entity = list[idx];
                    entity.date = dataTime;//现在暂时不用
                    //获取左侧选中的时间   end
                    RecordService.getInfo(entity.medicalId, entity.patientId, entity.value, $scope.queryParams.patientId, entity.url, '').then(function success(msg) {
                        var mapping = {},
                            idx, entity, old;
                        $scope[msg.type + 'Wrap'] = msg.data;
                        if (msg.type == 'test') {
                            $scope[msg.type] = msg.data.data.result[0];
                        } else {
                            $scope[msg.type] = msg.data.data.result;
                        }
                    });

                    function genKey(entity) {
                        var keys = [];
                        keys.push(entity.presc_date ? entity.presc_date : '_');
                        keys.push(entity.dept_name ? entity.dept_name : '_');
                        return keys.join();
                    }
                }
                //获取检验信息侧边
                RecordService.getInfo(xlMedicalId, xlPatientId, 'oblist', '', 61, '').then(function success(msg) {
                    $scope.oblistWrap = msg.data;
                    $scope.oblist = msg.data.data.result;
                    if(msg.data.data.status ==SYS.STATUS_SUCCESS){
                        $scope.selectType($scope.oblist[0],$scope.hospitalDate);
                    }
                });
            }
        });
    };
    $scope.queryIndexes();

    /**
     * 获取时间轴历次就诊信息数据
     */
    OverviewService.ajaxOverviews(xlPatientId).then(function (msg) {
        $scope.timelineDatas = msg;
        $scope.navList = rightNavService.filterByYear($scope.timelineDatas);
        $scope.navListDoor = rightNavService.filterYearDoor($scope.timelineDatas);
        $scope.navListDoorTitle = confirmState($scope.navListDoor)
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

    //请求专科检查的接口(武警妇产科需要,统一视图不需要)
    RecordService.getInfo(xlMedicalId, '', 'timeList', $scope.queryParams.patientId, 58).then(function success(msg) {
        $scope.archivesWrap = msg.data;
        $scope.archives = msg.data.data.result;
    });


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

    $scope.selectType = function (obList,time) {
        if (obList) {
            angular.forEach($scope.oblist, function (entity) {
                entity.active = false;
            });
            obList.active = true;
            var test = obList.test_class;
        }
        
        RecordService.getExam(xlMedicalId, xlPatientId, 'testClass', $scope.queryParams.patientId, 64, test, '').then(function success(msg) {
            $scope.examInfoList = msg.data.result;
            var data = {},
                byTimes = {},
                dataByTimes,
                timesKey,
                entity,
                idx,
                length = msg.data.result.length,
                firstList,
                list = {},
                timeskeyWrap;
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
                //drawEchart3(msg.data.result);

            }
            $scope.examInfoByTimes = byTimes;
            $scope.examInfoByClass = data;
            $scope.showExamInfo(firstList, 0);
        });
    };

    /**
     * 门诊检验绘图
     * @param testList
     */
    function drawEchart3(testList) {

        if (testList && testList.length > 0) {

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
}]);
