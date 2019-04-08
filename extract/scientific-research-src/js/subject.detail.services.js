angular.module('infi-basic')
.service('subjectDetailService',['$http','SYS','$routeParams','$timeout',function($http,SYS,$timeout,$routeParams){
    //查看课题信息
    this.getSubjectInfo = function (id) {
        return $http({
            method: 'get',
            url: SYS.url + 'subject/' + id,

        }).then(function (msg) {
            return msg.data;
        })
    }
    this.getSubjectGroup = function (subjectId) {
        var that  = this;
        return $http({
            method:'get',
            url:SYS.url + 'subject/'+subjectId+'/group',
            params:'',
            data:''
        }).then(function (msg) {
            if(msg.data.status == SYS.STATUS_SUCCESS){
                var _CRFTYPE = {
                    baseInterview:'基线访视',
                    interview:'访视CRF',
                    tempInterview:'非计划访视',
                    endingInterview:'结局事件表',
                    resultInterview:'随访终止结果表',
                    questionInterview:'调查问卷',
                    scoreInterview:'评分表'
                };

                msg.data.data.forEach(function (n,i) {
                    n['_subjectPlans'] = [];
                    for(var type in _CRFTYPE){
                        n._subjectPlans.push({
                            'label':_CRFTYPE[type],
                            'opts':[],
                            'type':type
                        });
                        n.subjectPlans.forEach(function (ni,ii) {
                            ni.type == type?n._subjectPlans[n._subjectPlans.length-1].opts.push({
                                "id": ni.id,
                                "name": ni.name,
                                "time": ni.time,
                                "type": ni.type,
                                "crfTemplateId": ni.crfTemplateId,
                                "subjectGroupId": ni.subjectGroupId,
                                "crfTemplateName": ni.crfTemplateName,
                                "typeId": ni.typeId,
                                "startDate": ni.startDate,
                                "endDate": ni.endDate,
                                "loopValue": ni.loopValue
                            }):'';
                        });
                    }

                    n['_subjectPlans'].forEach(function (ni,ii) {
                        ni.opts.length == 0?that.pushNullSubjectPlan(ni.opts,ni.type,ii+1):'';
                    });
                });
            }
            return msg.data
        })
    }

    this.pushNullSubjectPlan = function (arr,type,typeId) {
        arr.push({
            "id": null,
            "name": null,
            "time": null,
            "type": type,
            "crfTemplateId": null,
            "subjectGroupId": null,
            "crfTemplateName": null,
            "typeId": typeId
        })
    }

    this.addNewGroup = function (group,$routeParams) {
        group.push({
            "id": null,
            "name": null,
            "describes": null,
            "recordSize": null,
            "subjectId": $routeParams.subjectId,
            "subjectPlans": [],
            "subjectTasks": [],
            "_subjectPlans": [
                {
                    "label": "基线访视",
                    "opts": [
                        {
                            "id": null,
                            "name": null,
                            "time": null,
                            "type": "baseInterview",
                            "crfTemplateId": null,
                            "subjectGroupId": null,
                            "crfTemplateName": null,
                            "typeId": "1",
                        }
                    ],
                    "type": "baseInterview"
                },
                {
                    "label": "访视CRF",
                    "opts": [
                        {
                            "id": null,
                            "name": null,
                            "time": null,
                            "type": "interview",
                            "crfTemplateId": null,
                            "subjectGroupId": null,
                            "crfTemplateName": null,
                            "typeId": "2",
                        }
                    ],
                    "type": "interview"
                },
                {
                    "label": "非计划访视",
                    "opts": [
                        {
                            "id": null,
                            "name": null,
                            "time": null,
                            "type": "tempInterview",
                            "crfTemplateId": null,
                            "subjectGroupId": null,
                            "crfTemplateName": null,
                            "typeId": "3",
                        }
                    ],
                    "type": "tempInterview"
                },
                {
                    "label": "结局事件表",
                    "opts": [
                        {
                            "id": null,
                            "name": null,
                            "time": null,
                            "type": "endingInterview",
                            "crfTemplateId": null,
                            "subjectGroupId": null,
                            "crfTemplateName": null,
                            "typeId": "4",
                        }
                    ],
                    "type": "endingInterview"
                },
                {
                    "label": "随访终止结果表",
                    "opts": [
                        {
                            "id": null,
                            "name": null,
                            "time": null,
                            "type": "resultInterview",
                            "crfTemplateId": null,
                            "subjectGroupId": null,
                            "crfTemplateName": null,
                            "typeId": "5",
                        }
                    ],
                    "type": "resultInterview"
                },
                {
                    "label": "调查问卷",
                    "opts": [
                        {
                            "id": null,
                            "name": null,
                            "time": null,
                            "type": "questionInterview",
                            "crfTemplateId": null,
                            "subjectGroupId": null,
                            "crfTemplateName": null,
                            "typeId": "6",
                        }
                    ],
                    "type": "questionInterview"
                },
                {
                    "label": "评分表",
                    "opts": [
                        {
                            "id": null,
                            "name": null,
                            "time": null,
                            "type": "scoreInterview",
                            "crfTemplateId": null,
                            "subjectGroupId": null,
                            "crfTemplateName": null,
                            "typeId": "7",
                        }
                    ],
                    "type": "scoreInterview"
                }
            ]
        })
    }

    this.getCRFTemplateList = function (params) {
        return $http({
            method:'get',
            url:SYS.url + 'crf/template/page',
            params:params,
            data:''
        }).then(function (msg) {
            return msg.data
        })
    }

    this.getMissionList = function (subjectId) {
        return $http({
            method:'get',
            url:SYS.url + 'subject/'+subjectId + '/task/distribution/list',
            params:'',
            data:''
        }).then(function (msg) {
            return msg.data;
        })
    }
    this.deleteGroup = function (groups,index,subjectId) {
        if(!groups[index].id){
            groups.splice(index,1)
        }else {
            $http({
                method:'delete',
                url:SYS.url + 'subject/'+subjectId + '/group/'+groups[index].id,
                params:'',
                data:''
            }).then(function (msg) {
                msg.data.status == 'ok'?groups.splice(index,1):'';
            })
        }
    }

    this.saveGroup = function (groups,subjectId,callback) {
        var tarGroup = angular.copy(groups)

        var check =false;
        tarGroup.forEach(function (n,i) {
            n.subjectPlans = []
            !n.recordSize || !n.name || !n.describes|| !n.subjectTasks ||n.subjectTasks.length==0?check = true:'';
            n._subjectPlans.forEach(function(nx,ix){
                nx.opts.forEach(function (ny,iy) {
                    nx.type == "baseInterview" && !ny.crfTemplateId?check = true:'';
                    ny.crfTemplateName !== null?n.subjectPlans.push(ny):'';
                })
            })
            delete n._subjectPlans;
        });

        if(check){
            $('.saveTip').modal('show');
            callback('failure');
            return;
        };

        $http({
            method:'put',
            url:SYS.url + 'subject/'+subjectId+'/group/update/list',
            params:{},
            data:tarGroup
        }).then(function (msg) {
            window.location.href = '#/subject-list';
            $http.get(SYS.url+'subject/'+subjectId+'/group/start').then(function (msg) {
                //callback fun
            })
            callback('success')
        }, function(error) {
            callback('failure')
        });
    }

}]);
