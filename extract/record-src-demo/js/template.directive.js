
//word 样式的模板
angular.module('infi-basic').directive('wordTemplate', [function () {
    return {
        restrict: 'ECMA',
        templateUrl: './html/word.template.html',
        scope: {

        },
        link: function (scope,element,attrs) {

        }
    }
}]);

//检查模板
angular.module('infi-basic').directive('checkTemplate', ['RecordService','$http','SYS',function (RecordService,$http,SYS) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/check.template.html',
        scope: {
            apiInfo:'='
        },
        link: function (scope,element,attrs) {
            $http.get(SYS.url + '/hosp/examHeadInfo?filter__xlPatientId='+scope.apiInfo[scope.apiInfo.currentType].filter__xlPatientId
                +'&filter__xlMedicalId=' + scope.apiInfo[scope.apiInfo.currentType].filter__xlMedicalId
                +'&filter__recordTime=' +scope.apiInfo.recordTime
                +'&filter__examClassId=' +scope.apiInfo.classId).then(function (msg) {
                scope['checkList'] = msg.data.data;
                scope.apiInfo.targetId == ''?scope.check(scope['checkList'][0],scope['checkList'],0):undefined;
                scope['checkList'].forEach(function (n,i) {
                    n.examNo == scope.apiInfo.targetId?scope.check(scope['checkList'][i],scope['checkList'],0):undefined;
                });

            });

            scope.check = function (opt,parent,idx) {
                if(!opt){
                    return false;
                }
                parent.forEach(function (n,i) {
                    n['active'] = false;
                });
                opt['active'] = true;
                var apiNum = 68;
                scope.apiInfo.currentType == 'menzhen'?apiNum = 74:'';
                $http.get(SYS.url + '/unite/resource/single/'+apiNum+'?filter__xlPatientId='+scope.apiInfo[scope.apiInfo.currentType].filter__xlPatientId
                    +'&filter__xlMedicalId=' + scope.apiInfo[scope.apiInfo.currentType].filter__xlMedicalId+'&filter__examNo=' +opt.examNo
                    +'&filter__examClassId=' +scope.apiInfo.classId).then(function (msg) {
                    scope.tagData = msg.data.data.result[0];
                });

                //这里用jq scope api 获取了对应元素的scope属性，以手动双向绑定了两份数据
                $('.active p[title="检查信息"]').siblings('ul').scope() &&
                $('.active p[title="检查信息"]').siblings('ul').scope().$parent?
                    $('.active p[title="检查信息"]').siblings('ul').scope().$parent.target.children.forEach(function (n,i) {
                        n.examNo == opt.examNo && n.examClassId == opt.examClassId?n.active = true:n.active = false;
                }):undefined;
            }
        }
    }
}]);

//检验模板
angular.module('infi-basic').directive('checkoutTemplate', ['RecordService','$http','SYS',function (RecordService,$http,SYS) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/checkout.template.html',
        scope: {
            apiInfo:'='
        },
        link: function (scope,element,attrs) {

            $http.get(SYS.url + '/hosp/testHeadInfo?filter__xlPatientId='+scope.apiInfo[scope.apiInfo.currentType].filter__xlPatientId
                +'&filter__xlMedicalId=' + scope.apiInfo[scope.apiInfo.currentType].filter__xlMedicalId
                +'&filter__recordTime=' +scope.apiInfo.recordTime
                +'&filter__testClassId=' +scope.apiInfo.classId).then(function (msg) {
                scope['checkList'] = msg.data.data;

                scope.apiInfo.targetId == ''?scope.check(scope['checkList'][0],scope['checkList'],0):undefined;
                scope['checkList'].forEach(function (n,i) {
                    n.testNo == scope.apiInfo.targetId?scope.check(scope['checkList'][i],scope['checkList'],0):undefined;
                })

            });

            scope.reFreshPage = function (opt,pageNum) {
                $http.get(SYS.url + '/hosp/page?filter__xlPatientId='+scope.apiInfo[scope.apiInfo.currentType].filter__xlPatientId+
                    '&filter__xlMedicalId=' + scope.apiInfo[scope.apiInfo.currentType].filter__xlMedicalId+'&filter__type=test'+
                    '&filter__pageNo='+pageNum+'&filter__pageSize=10&filter__testNo='+opt.testNo
                    +'&filter__testClassId=' +scope.apiInfo.classId).then(function (msg) {
                    scope.tableDatas = msg.data;
                    scope.changeEcharts(scope.tableDatas.result[0]);
                });
            };

            scope.check = function (opt,parent,idx) {
                if(!opt){
                    return false;
                }
                parent.forEach(function (n,i) {
                    n['active'] = false;
                });
                opt['active'] = true;
                scope.targetInfo = opt;
                scope.reFreshPage(opt,1);

                //这里用jq scope api 获取了对应元素的scope属性，以手动双向绑定了两份数据
                $('.active p[title="检验信息"]').siblings('ul').scope() &&
                $('.active p[title="检验信息"]').siblings('ul').scope().$parent?
                    $('.active p[title="检验信息"]').siblings('ul').scope().$parent.target.children.forEach(function (n,i) {
                        n.testNo == opt.testNo && n.testClassId == opt.testClassId  ?n.active = true:n.active = false;
                    }):undefined;
            }

            scope.changeEcharts = function (opt) {
                var itemName = opt.test_item_name.replace(/%/g,'%25'); // 修正异常字符

                $http.get(SYS.url + '/unite/resource/single/70?filter__xlPatientId='+scope.apiInfo[scope.apiInfo.currentType].filter__xlPatientId+
                    '&filter__xlMedicalId=' + scope.apiInfo[scope.apiInfo.currentType].filter__xlMedicalId+'&filter__itemName='+itemName+
                    '&filter__testNo='+opt.test_no
                    +'&filter__testClassId=' +scope.apiInfo.classId).then(function (msg) {
                    var arrDate = [];
                    var arrValue = [];
                    msg.data.data.result.forEach(function (n,i) {
                        arrDate.push(n.results_rpt_date_time);
                        arrValue.push(n.result);
                    });

                    scope.arrDate = arrDate;
                    draw(arrDate,arrValue)

                });

                function draw(arrDate,arrValue) {
                    var myChart = echarts.init(document.getElementById('checkout'));
                    var option = {
                        title: {
                            text: opt.test_item_name
                        },
                        xAxis: {
                            type: 'category',
                            data: arrDate,
                            axisTick: {
                                alignWithLabel: true
                            },
                            splitLine: {
                                show:true
                            }
                        },
                        yAxis: {
                            type: 'value'
                        },
                        grid: {
                            height: '50%',
                            y: '20%',
                            x:'10%'
                        },
                        tooltip : {
                            trigger: 'axis',
                            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        series: [{
                            data: arrValue,
                            type: 'line',
                            itemStyle: {
                                normal: {
                                    color: '#ff7f50'
                                }
                            },
                            symbolSize: 15,
                            barWidth: '60%'
                            // markLine : {
                            //     data : [
                            //         {
                            //             name: '最大值',
                            //             yAxis: Math.max.apply(Math,arrValue)
                            //         },
                            //         {
                            //             name: '最小值',
                            //             yAxis: Math.min.apply(Math,arrValue)
                            //         }
                            //     ]
                            // }
                        }]
                    };
                    myChart.setOption(option);
                }
            };
        }
    }
}]);

//诊疗记录模板
angular.module('infi-basic').directive('diagnosisRecord', ['SYS','$http',function (SYS,$http) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/diagnosisRecord.template.html',
        scope: {
            apiInfo:'='
        },
        link: function (scope,element,attrs) {
            (function getData() {
                $http.get(SYS.url + '/unite/resource/single/45?filter__xlPatientId='+scope.apiInfo[scope.apiInfo.currentType].filter__xlPatientId
                    +'&filter__xlMedicalId=' + scope.apiInfo[scope.apiInfo.currentType].filter__xlMedicalId
                    +'&filter__recordId=' +scope.apiInfo.recordId).then(function (msg) {
                    scope.targetData = msg.data.data.result;
                });
            })();
        }
    }
}]);

//手术模板
angular.module('infi-basic').directive('operation', ['RecordService','$http','SYS',function (RecordService,$http,SYS) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/operation.template.html',
        scope: {
            apiInfo:'='
        },
        link: function (scope,element,attrs) {
            RecordService.getNumApi(scope.apiInfo[scope.apiInfo.currentType].filter__xlPatientId,scope.apiInfo[scope.apiInfo.currentType].filter__xlMedicalId,44,scope.apiInfo.recordTime).then(function (msg) {
                scope.operationDatas = msg.data.result;
            });
        }
    }
}]);


//医嘱模板
angular.module('infi-basic').directive('doctorAdvice', ['RecordService','$http','SYS',function (RecordService,$http,SYS) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/doctorAdvice.template.html',
        scope: {
            apiInfo:'='
        },
        link: function (scope,element,attrs) {
            scope.reFreshPage = function (opt,pageNum) {
                scope.tableData = false;
                $http.get(SYS.url + '/hosp/page?filter__xlPatientId='+scope.apiInfo[scope.apiInfo.currentType].filter__xlPatientId+
                    '&filter__xlMedicalId=' + scope.apiInfo[scope.apiInfo.currentType].filter__xlMedicalId+'&filter__type=order'+
                    '&filter__pageNo='+pageNum+'&filter__pageSize=10'
                    +'&filter__recordTime=' +scope.apiInfo.recordTime).then(function (msg) {
                    scope.tableData = msg.data;
                });
            };

            function genTagData(){
                RecordService.getNumApi(scope.apiInfo[scope.apiInfo.currentType].filter__xlPatientId,scope.apiInfo[scope.apiInfo.currentType].filter__xlMedicalId,43).then(function (msg) {
                    var time = [];
                    var medical =[];
                    var tagData = msg.data.result;
                    msg.data.result.forEach(function (n,i) {
                        if(n.enter_date_time == null){
                            return false;
                        }
                        time.push(n.enter_date_time.split(' ')[0]);
                        medical.push(n.order_text);
                        n['value'] = [null,null,null];
                    });

                    time = (function unique(arr) {
                        return Array.from(new Set(arr))
                    })(time);

                    medical = (function unique(arr) {
                        return Array.from(new Set(arr))
                    })(medical);

                    tagData.forEach(function (n,i) {
                        for(var key in n){
                            n[key] == null?n[key]='-':undefined;
                        }
                        medical.forEach(function (nx,ix) {
                            nx == n.order_text?n['value'][1] =ix:undefined;
                            nx == n.order_text?n['value'][2] =ix:undefined;
                        });
                        time.forEach(function (nx,ix) {
                            n.enter_date_time.indexOf(nx)>-1?n['value'][0] =ix:undefined;
                        });

                    });

                    scope.tagMedical = medical;
                    drawChart(time,medical,tagData);
                });
            }

            (function init() {
                //初始化获取分页数据
                scope.reFreshPage('',1);
                genTagData();
            })();

            function drawChart(time,medical,tagData) {
                var myChart = echarts.init(document.getElementById('doctorAdvice'));
                var option =  {
                    tooltip: {
                        position: 'top',
                        formatter: function (params, ticket, callback) {
                            return params.seriesName+'<br>'
                                +'下达时间：'+params.data.enter_date_time+'<br>'
                                +'医嘱内容：'+params.data.order_text+'<br>'
                                +'长/临：'+params.data.repeat_indicator+'<br>'
                                +'医嘱类型：'+params.data.order_class_id+'<br>'
                                +'剂量：'+params.data.dosage+'<br>'
                                +'单位：'+params.data.dosage_units+'<br>'
                                +'频次：'+params.data.frequency+'<br>'
                                +'途径：'+params.data.administration_id+'<br>'
                                +'开始时间：'+params.data.start_date_time+'<br>'
                                +'结束时间：'+params.data.stop_date_time+'<br>';
                        }
                    },
                    animation: false,
                    grid: {
                        height: '80%',
                        y: '5%',
                        x:'15%'
                    },
                    xAxis: {
                        type: 'category',
                        data: time,
                        splitArea: {
                            show: true,
                            areaStyle:{
                                color: ['rgba(250,250,250,0.3)','rgba(200,200,200,0.3)']
                            }
                        },
                        splitNumber:24
                    },
                    yAxis: {
                        type: 'category',
                        data: medical,
                        splitArea: {
                            show: true
                        }
                    },
                    dataZoom: [
                        {
                            show: true,
                            start: 0,
                            end: 100
                        },
                        {
                            type: 'inside',
                            start: 0,
                            end: 100
                        },
                        {
                            show: true,
                            yAxisIndex: 0,
                            filterMode: 'empty',
                            width: 30,
                            height: '80%',
                            showDataShadow: false,
                            left: '93%'
                        }
                    ],
                    visualMap: {
                        show: false,
                        min: 0,
                        max: medical.length,
                        calculable: true,
                        orient: 'horizontal',
                        left: 'center',
                        bottom: '15%',
                        inRange: {
                            color: ['yellow', 'green', 'blue'],
                        }
                    },
                    series: [{
                        name: '医嘱',
                        type: 'heatmap',
                        data: tagData,
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        itemStyle: {

                            emphasis: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }]
                };
                myChart.setOption(option);
            }

        }
    }
}]);

//首次病程模板
angular.module('infi-basic').directive('courseDisease', ['$http','SYS','$sce',function ($http,SYS,$sce) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/courseDisease.template.html',
        scope: {
            apiInfo:'=',
            targetData:'=',
            medicalRecordTypeId:'='
        },
        link: function (scope,element,attrs) {

            function check() {
                scope.targetData && (function isJSON(str) {
                    if (typeof str == 'string') {
                        try {
                            JSON.parse(str);
                            return true;
                        } catch(e) {
                            console.log(e)
                            return false;
                        }
                    }
                })(scope.targetData.content)?
                    scope.targetData.content = JSON.parse(scope.targetData.content):undefined;

                scope.targetData?(function () {
                    for(var i in scope.targetData.content.data){
                        typeof scope.targetData.content.data[i] == 'string'?
                            scope.targetData.content.data[i] = $sce.trustAsHtml(scope.targetData.content.data[i]):undefined;
                    }
                })():undefined;


            };

            function getData() {
               $http.get(SYS.url + '/unite/resource/single/45?filter__xlPatientId='+scope.apiInfo[scope.apiInfo.currentType].filter__xlPatientId
                    +'&filter__xlMedicalId=' + scope.apiInfo[scope.apiInfo.currentType].filter__xlMedicalId
                   +'&filter__recordId=' +scope.apiInfo.recordId).then(function (msg) {
                   scope.targetData = msg.data.data.result[0];
                   check();
               });
            }

            scope.targetData?check():getData();
        }
    }
}]);

//时间轴模板
angular.module('infi-basic').directive('timelineTpl', [function () {
    return {
        restrict: 'ECMA',
        templateUrl: './html/timeline.tpl.html',
        scope: {
            apiInfo:'=',
            targetData:'='
        },
        link: function (scope,element,attrs) {

        }
    }
}]);

//住院基本信息
angular.module('infi-basic').directive('zhuyuanBasic', [function () {
    return {
        restrict: 'ECMA',
        templateUrl: './html/zhuyuanBasic.template.html',
        scope: {
            hospitalizedBaseInfo:'='
        },
        link: function (scope,element,attrs) {

        }
    }
}]);

//住院诊断信息
angular.module('infi-basic').directive('zhuyuanDiag', [function () {
    return {
        restrict: 'ECMA',
        templateUrl: './html/zhuyuanDiag.template.html',
        scope: {
            hospitalizedDiag:'='
        },
        link: function (scope,element,attrs) {

        }
    }
}]);

//住院主诉信息
angular.module('infi-basic').directive('zhuyuanComplaint', [function () {
    return {
        restrict: 'ECMA',
        templateUrl: './html/zhuyuanComplaint.template.html',
        scope: {
            hospitalComplaint:'=',
            allResults:'='
        },
        link: function (scope,element,attrs) {

        }
    }
}]);

//现病史
angular.module('infi-basic').directive('presentHistorys', [function () {
    return {
        restrict: 'ECMA',
        templateUrl: './html/presentHistory.template.html',
        scope: {
            presentHistory:'=',
            allResults:'='
        },
        link: function (scope,element,attrs) {

        }
    }
}]);

//住院既往检查
angular.module('infi-basic').directive('pastChecks', [function () {
    return {
        restrict: 'ECMA',
        templateUrl: './html/pastCheck.template.html',
        scope: {
            pastCheck:'=',
            allResults:'='
        },
        link: function (scope,element,attrs) {

        }
    }
}]);

//住院既往检验
angular.module('infi-basic').directive('pastExams', [function () {
    return {
        restrict: 'ECMA',
        templateUrl: './html/pastExam.template.html',
        scope: {
            pastExam:'=',
            allResults:'='
        },
        link: function (scope,element,attrs) {

        }
    }
}]);

//住院历史信息
angular.module('infi-basic').directive('zhuyuanHistory', [function () {
    return {
        restrict: 'ECMA',
        templateUrl: './html/zhuyuanHistory.template.html',
        scope: {
            hospitalFamily:'=',
            hospitalPast:'=',
            hospitalPersonal:'=',
            allResults:'='
        },
        link: function (scope,element,attrs) {

        }
    }
}]);

//住院体格检查信息
angular.module('infi-basic').directive('zhuyuanBody', [function () {
    return {
        restrict: 'ECMA',
        templateUrl: './html/zhuyuanBody.template.html',
        scope: {
            hospitalBody:'=',
            allResults:'='
        },
        link: function (scope,element,attrs) {

        }
    }
}]);

//门诊基本信息
angular.module('infi-basic').directive('timeBasic', [function () {
    return {
        restrict: 'ECMA',
        templateUrl: './html/timeBasic.template.html',
        scope: {
            timeBaseInfo:'='
        },
        link: function (scope,element,attrs) {

        }
    }
}]);

//门诊基本信息
angular.module('infi-basic').directive('menzhenBasic', [function () {
    return {
        restrict: 'ECMA',
        templateUrl: './html/menzhenBasic.template.html',
        scope: {
            outpatientBaseInfo:'='
        },
        link: function (scope,element,attrs) {

        }
    }
}]);
//门诊诊断信息
angular.module('infi-basic').directive('menzhenDiag', [function () {
    return {
        restrict: 'ECMA',
        templateUrl: './html/menzhenDiag.template.html',
        scope: {
            outpatientDiag:'='
        },
        link: function (scope,element,attrs) {

        }
    }
}]);
//门诊药品信息
angular.module('infi-basic').directive('menzhenDrug', [function () {
    return {
        restrict: 'ECMA',
        templateUrl: './html/menzhenDrug.template.html',
        scope: {
            outpatientDrug:'='
        },
        link: function (scope,element,attrs) {

        }
    }
}]);


//体检基本信息
angular.module('infi-basic').directive('checkBasic', [function () {
    return {
        restrict: 'ECMA',
        templateUrl: './html/checkBasic.template.html',
        scope: {
            checkBaseInfo:'='
        },
        link: function (scope,element,attrs) {

        }
    }
}]);

//体检基本信息
angular.module('infi-basic').directive('specialityCheck', ['RecordService',function (RecordService) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/specialityCheck.template.html',
        scope: {
            apiInfo:'='
        },
        link: function (scope,element,attrs) {
            RecordService.getSpecialityCheckDatas(scope.apiInfo[scope.apiInfo.currentType].filter__xlPatientId,scope.apiInfo[scope.apiInfo.currentType].filter__xlMedicalId,72,scope.apiInfo.recordTime).then(function (msg) {
                scope.specialityCheckDatas = msg.data;
                console.log(scope.specialityCheckDatas)
            });
        }
    }
}]);

//异常视图
angular.module('infi-basic').directive('patiProfile', ['SYS', '$http', function (SYS, $http) {
    return {
        restrict: 'ECMA',
        templateUrl: './js/html/pati-profile.directive.html',
        scope: {
            patiId:'='
        },
        link: function (scope,element,attrs) {
            var GetData = function(patiId) {
                this.param = {
                    xlPatientId: patiId
                }
            }

            GetData.prototype = {
                getOrgData: function() {
                    var sendParam = {
                        patient_id: this.param.xlPatientId
                    };

                    return $http.post(SYS.abnormalUrl + `view/data`, sendParam).then(
                        function(msg) {
                            if(msg.data.status == 'ok') {
                                return {
                                    data: JSON.parse(msg.data.data),
                                    status: 'ok'
                                }
                            } else {
                                return {
                                    status: "error",
                                };
                            }
                        },
                        function(error) {
                            return {
                                status: "error",
                            };
                        }
                    );
                }
            }



            ;(function init() {
                var getDataObj = new GetData(scope.patiId)


                getDataObj.getOrgData().then(function(flatData) {
                    if(flatData.status == 'ok') {
                        scope.hasData = true
                        scope.flatOrgData = flatData.data
                    } else {
                        scope.hasData = false
                    }
                }, function(error) {
                    scope.hasData = false
                })
            })()


        }
    }
}]);
