angular.module('infi-basic').directive('crfTemplateList', ['$http','SYS','subjectDetailService',
    function ($http,SYS,subjectDetailService) {
        return {
            restrict: 'ECMA',
            templateUrl: './html/crfTemplateList.template.html',
            scope: {
                target:'='
            },
            link: function (scope,element,attrs) {
                scope.choseCRFTemplate = function (opt) {
                    scope.target.crfTemplateName = opt.name;
                    scope.target.crfTemplateId = opt.id;
                    $('#CRFTemplateList').modal('hide');
                };

                scope.getCRFTemplateList = function (pageNum,pageSize) {
                    var params = {
                        page_number: pageNum,
                        page_size: pageSize,
                        filter_EQ_typeId:scope.target.typeId
                    }
                    return subjectDetailService.getCRFTemplateList(params).then(function (msg) {
                        scope.CRFTemplateList = msg.page;
                        scope.CRFTemplateList.number++;
                    })
                };

                scope.getCRFTemplateList(1,10);
                $('#CRFTemplateList').modal('show');
            }
        }
    }]);

angular.module('infi-basic').directive('missionList', ['$http','SYS','subjectDetailService','$routeParams',
    function ($http,SYS,subjectDetailService,$routeParams) {
        return {
            restrict: 'ECMA',
            templateUrl: './html/missionList.template.html',
            scope: {
                target:'='
            },
            link: function (scope,element,attrs) {
                scope.setMission = function () {
                    var total = 0;
                    console.log()
                    scope.target.subjectTasks.length == 0?scope.target.subjectTasks = scope.missionList:scope.target.subjectTasks = scope.missionList;
                    scope.target.subjectTasks.forEach(function (n,i) {
                        n.recordSize = scope.missionList[i].recordSize;
                        total += scope.missionList[i].recordSize*1;
                    });
                    total>scope.target.recordSize?$('#tips').modal('show'):$('#missionList').modal('hide');
                };

                scope.getMissionList = function () {
                    return subjectDetailService.getMissionList($routeParams.subjectId).then(function (msg) {
                        scope.missionList = msg.data;
                    })
                };

                scope.getMissionList();
                $('#missionList').modal('show');
            }
        }
    }]);

angular.module('infi-basic').directive('interviewTime', ['$http','SYS','subjectDetailService','$routeParams',
    function ($http,SYS,subjectDetailService,$routeParams) {
        return {
            restrict: 'ECMA',
            templateUrl: './html/interviewTime.template.html',
            scope: {
                target:'='
            },
            link: function (scope,element,attrs) {

                //正则强行转换一下，传递回来的是字符串
                function check(str){
                    if(!str) return {
                        num:null,
                        unit:null
                    };

                    var re1 = /(\d{1,3})+(?:\.\d+)?/g
                    var re2 = /[\u4e00-\u9fa5]/g
                    var num,unit;
                    str.match(re1)? num = str.match(re1).join(''):'';
                    str.match(re2)? unit = str.match(re2).join(''):'';
                    return {
                        num:num,
                        unit:unit
                    }
                }

                scope.date = {
                    startDate:null,
                    startDateUnit:null,
                    endDate:null,
                    endDateUnit:null,
                    loopValue:null,
                    loopValueUnit:null
                }

                scope.dateGroup = [
                    {
                        "label":"3",
                        "unit":'个月',
                        "checked":false
                    },{
                        "label":"6",
                        "unit":'个月',
                        "checked":false
                    },{
                        "label":"9",
                        "unit":'个月',
                        "checked":false
                    },{
                        "label":"1",
                        "unit":'年',
                        "checked":false
                    },{
                        "label":"18",
                        "unit":'个月',
                        "checked":false
                    },{
                        "label":"2",
                        "unit":'年',
                        "checked":false
                    },{
                        "label":"30",
                        "unit":'个月',
                        "checked":false
                    },{
                        "label":"3",
                        "unit":'年',
                        "checked":false
                    },{
                        "label":"42",
                        "unit":'个月',
                        "checked":false
                    },{
                        "label":"4",
                        "unit":'年',
                        "checked":false
                    },{
                        "label":"54",
                        "unit":'个月',
                        "checked":false
                    },{
                        "label":"5",
                        "unit":'年',
                        "checked":false
                    }
                ]
                scope.customeTime = [];

                (function resetValue (){
                    if(scope.target.subjectPlans.length < 2) return;

                    var judged = ['startDate','endDate','loopValue']
                    judged.forEach(function (n,i) {
                        var obj = check(scope.target.subjectPlans[1][n]);
                        obj.num?scope.date[n] = obj.num:'';
                        obj.unit?scope.date[n+'Unit'] = obj.unit:'';

                        mark = n;
                        if(scope.date[mark]){
                            scope.target._subjectPlans[1].opts[0][mark] = scope.date[mark];
                            scope.date[mark+'Unit']?scope.target._subjectPlans[1].opts[0][mark] += scope.date[mark+'Unit']:'';
                        }
                    })

                    var arr = scope.target.subjectPlans[1]['time'].split(';');
                    arr.forEach(function (n,i) {
                        arr[i] = check(n);
                    })

                    scope.dateGroup.forEach(function (n,i) {
                        arr.forEach(function (ni,ii) {
                            n.label == ni.num && n.unit == ni.unit? (n.checked = true,ni['mark'] = true):'';
                        })
                    })

                    arr.forEach(function (n,i) {
                        !n['mark'] && n.num && n.unit?(function () {
                            scope.customeTime.push({
                                label: Number(n.num),
                                unit: n.unit
                            })
                        })():'';
                    })

                })();

                scope.visitTime = '';
                scope.setInterviewTime = function () {
                    var str = '';
                    var arr = [];
                    var temp = [];
                    scope.dateGroup.forEach(function (n,i) {
                        str == '' ? n.checked? str+= n.label+n.unit: '' : n.checked?str+= ';'+n.label+n.unit:'';

                    });
                    scope.customeTime.forEach(function (n,i) {
                        str == '' ? str += n.label + n.unit  : str += ';' + n.label + n.unit;
                    });
                    arr = str.split(";");
                    temp = new Set(arr);
                    str = '';
                    angular.forEach(temp,function (n) {
                        str += n + ';';
                    })
                    scope.target._subjectPlans[1].opts[0].time = str;

                    var judged = ['startDate','endDate','loopValue']
                    judged.forEach(function (n,i) {
                        mark = n;
                        if(scope.date[mark]){
                            scope.target._subjectPlans[1].opts[0][mark] = scope.date[mark];
                            scope.date[mark+'Unit']?scope.target._subjectPlans[1].opts[0][mark] += scope.date[mark+'Unit']:'';
                        }
                    });

                    /*(function () {
                        scope.target._subjectPlans[1].opts[0]['bindTime'] = '';
                        scope.target._subjectPlans[1].opts[0]['bindTime'] += scope.target._subjectPlans[1].opts[0].time;

                        judged.forEach(function (n,i) {
                            mark = n;
                            if(scope.date[mark]){
                                scope.target._subjectPlans[1].opts[0]['bindTime'] += scope.date[mark];
                                scope.date[mark+'Unit']?scope.target._subjectPlans[1].opts[0]['bindTime'] += scope.date[mark+'Unit']:'';
                            }
                        })
                    })();*/

                    scope.target.subjectPlans[1] = scope.target._subjectPlans[1].opts[0]


                    $('#interviewTimeList').modal('hide');

                };
                scope.choseInterviewTime = function (opt) {
                    opt.checked = !opt.checked;
                };
                scope.addCustomTimeList = function(){
                    scope.customeTime.push({
                        label: '',
                        unit: '个月'
                    })
                }
                scope.addCustomTime = function(data,index){
                    scope.customeTime[index] = {
                        label: data.label,
                        unit: data.unit
                    }
                }

                scope.addTime = function(mark){
                        //fun
                }

                $('#interviewTimeList').modal('show');
            }
        }
    }]);

