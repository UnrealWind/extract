/**
 * API 接口路由全部在这里定义
 */

const expresss = require('express')
const mockjs = require('mockjs')

var router = expresss.Router();

router.get('/subject/page', function(req, res, next) {
    var pageNum = req.query.page_number;
    var pageSize = req.query.page_size;

  var data = mockjs.mock({
    "page": {
      "content|10": [{
        "id": "@id",
        "name|1": '基于大数据技术的京津冀地区呼吸疾病协同防治研究共享服务平台',
        "startTime|1-10": 6,
        "endTime|1-10": 6,
        "recordRate|1-100": 50,
        "type|1": ['前瞻性研究', '回顾性研究'],
        "own": "@cname",
        "status|1": ["ended", "process"],
        "subjectMembers":"@cname"
      }],
      "number": pageNum,
      "size": pageSize,
      "totalElements": 40,
      "totalPages": 4
    }

  })

  res.json(data)
});
router.get('/subject/page1', function(req, res, next) {
    var pageNum = req.query.page_number;
    var pageSize = req.query.page_size;
    var filter_subjectMemberStatus = req.query.filter_subjectMemberStatus

    var data = mockjs.mock({
        "page": {
            "content|10": [{
                "id": "@id",
                "name|1": '基于大数据技术的京津冀地区呼吸疾病协同防治研究共享服务平台',
                "startTime|1-10": 6,
                "endTime|1-10": 6,
                "recordRate|1-100": 50,
                "type|1": ['前瞻性研究', '回顾性研究'],
                "own": "@cname",
                "status|1": ["ended", "process"],
                "subjectMembers":"@cname"
            }],
            "number": pageNum,
            "size": pageSize,
            "totalElements": 40,
            "totalPages": 4,
            "filter_subjectMemberStatus": filter_subjectMemberStatus
        }

    })

    res.json(data)
});
router.get('/subject/:subjectId/member/in/page', function(req, res, next) {
    var pageNum = req.query.page_number;
    var pageSize = req.query.page_size;

    var data = mockjs.mock({
        "page": {
            "content|10": [{
                "id": "@id",
                "attendTime|1-10": 6,
                "identity|1": ['管理员', '科研人员'],
                "hospital|1": ['301医院', '朝阳医院', '宣武医院'],
                "jobTitle|1": ['主任医师', '副主任医师', '主治医师'],
                "phone|10000000000-99999999999": 55555555555,
                "dept|1": ['呼吸科','心内科','神经内科','肾内科','重症医学科','胸外科','风湿免疫科','消化内科'],
                "email": "857777180@qq.com",
                "name":"@cname",
                "view|1": ['申请查看','查看']
            }],
            "number": pageNum,
            "size": pageSize,
            "totalElements": 40,
            "totalPages": 4
        }

    })

    res.json(data)
});

router.get('/subject/14/member/out/page', function(req, res, next) {
    var pageNum = req.query.page_number;
    var pageSize = req.query.page_size;
    var subjectId = req.params.subjectId;

    var data = mockjs.mock({
        "page": {
            "content|10": [{
                "id": "@id",
                "attendTime|1-10": 6,
                "identity|1": ['管理员', '科研人员'],
                "hospital|1": ['301医院', '朝阳医院', '宣武医院'],
                "jobTitle|1": ['主任医师', '副主任医师', '主治医师'],
                "phone|1": "number",
                "dept|1": ['呼吸科','心内科','神经内科','肾内科','重症医学科','胸外科','风湿免疫科','消化内科'],
                "email": "857777180@qq.com",
                "name":"@cname",
                "view|1": ['申请查看','查看'],

            }],
            "number": pageNum,
            "size": pageSize,
            "totalElements": 40,
            "totalPages": 4,
            "subjectId": subjectId
        }

    })

    res.json(data)
});


router.get('/subject/:subjectId/group', function(req, res, next) {
  var subjectId = req.params.subjectId;

  var data = mockjs.mock({
      "data|3": [{
          "id": '@id',
          "name": "@ctitle(1,10)组",
          "describes": "@cparagraph()",
          "recordSize": "@natural(30,100)",
          "subjectId": subjectId,
          "subjectPlans|3": [
              {
                  "id": '@id',
                  "name": "@word(3, 5)",
                  "time": "@date('yyyy-MM-dd')",
                  "type|1": ['baseInterview','interview','tempInterview','endingInterview','resultInterview',
                  'questionInterview','scoreInterview'],
                  "crfTemplateId": '@id',
                  "crfTemplateName": '@cword(5,10)-CRF',
                  "subjectGroupId": 1
              }
          ],
          "subjectTasks|3": [
              {
                  "id": '@id',
                  "hospital|1": ['301','309'],
                  "dept|1": ['心内科','呼吸科'],
                  "recordSize": "@natural(1,10)",
                  "subjectGroupId": 1,
                  "subjectId": subjectId
              }
          ]
      }],
      "status": "ok",
      "description": "数据请求成功"
  });

  res.json(data);
});


router.get('/crf/template/page', function(req, res, next) {
    var pagNum = req.query.page_number;
    var pageSize = req.query.page_size;
    var data = mockjs.mock({
        "page": {
            "content|10": [{
                "id": '@id',
                "name": "@ctitle(1,10)模板",
                "dept|1": ['心内科','呼吸科'],
                "type": "interview",
                "createTime": "@date('yyyy-MM-dd HH:mm:ss')",
                "own": "quinn"
            }],
            "pageable": {
                "sort": {
                    "sorted": false,
                    "unsorted": true
                },
                "pageSize": pageSize,
                "pageNumber": pagNum,
                "offset": 0,
                "paged": true,
                "unpaged": false
            },
            "last": true,
            "totalPages": "@natural(1,1000)",
            "totalElements": 1,
            "first": true,
            "sort": {
                "sorted": false,
                "unsorted": true
            },
            "numberOfElements": 1,
            "size": pageSize,
            "number": pagNum
        },
        "status": "ok",
        "description": "数据请求成功"
    });

    res.json(data);
});

//概况数据
router.get('/subject/kpi/:subjectId/:time', function(req, res, next) {

    var data = mockjs.mock({
        "data": {
            "total|10000-99999": 55555,
            "addNum|100-999": 555,
            "finish|100-999": 555,
            "ready|100-999": 555
        },
        "status": "ok",
        "description": "数据请求成功"
    });

    res.json(data);
});
router.get('/subject/:subjectId/task/distribution/list', function(req, res, next) {
    var subjectId = req.params.subjectId;
    var data = mockjs.mock({
        "data|3": [{
            "id": '@id',
            "hospital|1": ['301','309'],
            "dept|1": ['心内科','呼吸科'],
            "recordSize": null,
            "subjectGroupId": 1,
            "subjectId": subjectId
        }],
        "status": "ok",
        "description": "数据请求成功"
    });

    res.json(data);
});
//第一个图
router.get('/subject/features/column/:subjectId', function(req, res, next) {

    var data = mockjs.mock({
        "data": {
            "实验组1" :{
                "total": 200,
                "realRecordSize": 77,
                "percent": 77
            },
            "实验组2" :{
                "total": 100,
                "realRecordSize": 77,
                "percent": 77
            },
            "实验组3" :{
                "total": 150,
                "realRecordSize": 77,
                "percent": 77
            },
            "实验组4" :{
                "total": 77,
                "realRecordSize": 77,
                "percent": 77
            },
        }, "status": "ok",
        "description": "数据请求成功"
    });

    res.json(data);
});


router.delete('/subject/:subjectId/group/:groupId', function(req, res, next) {
    var subjectId = req.params.subjectId;
    var groupId = req.params.groupId;
    var data = mockjs.mock({
        "data": true,
        "status": "ok",
        "description": "数据请求成功"
    });

    res.json(data);
});
//第二个图
router.get('/subject/features/line/:subjectId', function(req, res, next) {

    var data = mockjs.mock({
        "data": {
            "实验组１":{
                "2018-03": 111,
                "2018-04": 234,
                "2018-05": 183,
                "2018-06": 867,
                "2018-07": 1254,
                "2018-08": 137
            },
            "实验组2":{
                "2018-03": 111,
                "2018-04": 234,
                "2018-05": 123,
                "2018-06": 867343,
                "2018-07": 12567,
                "2018-08": 1237
            },
            "实验组3":{
                "2018-03": 111,
                "2018-04": 234,
                "2018-05": 123,
                "2018-06": 867343,
                "2018-07": 12567,
                "2018-08": 1237
            },
            "实验组4":{
                "2018-03": 111,
                "2018-04": 234,
                "2018-05": 123,
                "2018-06": 867343,
                "2018-07": 12567,
                "2018-08": 1237
            }
        },
        "data": [
            {   name: "实验组1",
                time: ['2018-03','2018-04','2018-05','2018-07','2018-08'],
                data: [1428,138,88,879,16]
            },
            {   name: "实验组2",
                time: ['2018-03','2018-04','2018-05','2018-06','2018-07','2018-08'],
                data: [142,13,888,81,80,10]
            },
            {   name: "实验组3",
                time: ['2018-03','2018-04','2018-05','2018-06','2018-07','2018-08'],
                data: [12,13,88,89,668,160]
            },
            {   name: "实验组4",
                time: ['2018-03','2018-04','2018-05','2018-06','2018-07','2018-08'],
                data: [1424,113,818,85,558,160]
            },
        ],
        "status": "ok",
        "description": "数据请求成功"
    });

    res.json(data);
});

router.get('/dim/dept', function(req, res, next) {
    var data = mockjs.mock({"data":[{"id":"1","label":"心内科"},{"id":"2","label":"神内科"},{"id":"3","label":"中医科"}],"status":"ok","description":"数据请求成功"});
    res.json(data);
});

router.post('/crf/template', function(req, res, next) {
    var data = mockjs.mock({data: [], status: "ok", description: "数据请求成功"});
    res.json(data);
});

router.get('/subject/group/:subjectId', function(req, res, next) {
    var data = mockjs.mock({
        "data": {
            "实验组１": {
                "total": 100,
                "task": {
                    "id": 12,
                    "hospital": "301",
                    "dept": "心内科",
                    "recordSize": 10,
                    "subjectGroupId": null,
                    "subjectId": null,
                    "finishNum": 47,
                    "rate": '46.83%'
                }
            },
            "实验组2": {
                "total": 100,
                "task": {
                    "id": 13,
                    "hospital": "301",
                    "dept": "内科",
                    "recordSize": 10,
                    "subjectGroupId": null,
                    "subjectId": null,
                    "finishNum": 47,
                    "rate": '46.83%'
                }
            },
            "实验组3": {
                "total": 100,
                "task": {
                    "id": 14,
                    "hospital": "301",
                    "dept": "外科",
                    "recordSize": 10,
                    "subjectGroupId": null,
                    "subjectId": null,
                    "finishNum": 47,
                    "rate": '46.83%'
                }
            }
        }});
        res.json(data);
});
router.get('/subject/:subjectId/group/:groupId/record/page', function(req, res, next) {
    var subjectId = req.params.subjectId;
    var groupId = req.params.groupId;
    var pagNum = req.query.page_number;
    var pageSize = req.query.page_size;
    var data = mockjs.mock({
        "page":{
            "content|10":[{
                "caseId":"@id",
                "patientId":"@id",
                "patientVisitId":"@id",
                "name":"@cname()",
                "subjectId":subjectId,
                "subjectGroupId":groupId,
                "subjectTaskId":"@id",
                "nextTime":"@datetime('yy-MM-dd HH:mm:ss')",
                "interviews":[
                    {
                        "id":"@id",
                        "type":"类型",
                        "name":'基线访视',
                        "time":"@datetime('yy-MM-dd HH:mm:ss')",
                        "status|1":['ready','finish','overdue'],
                        "interviewTemplates|3":[{
                            "id": "@id",
                            "templateId": "@id",
                            "type|1": ['baseInterview','interview','tempInterview','endingInterview','resultInterview', 'questionInterview','scoreInterview']
                        }],
                        "id":"@id",
                        "templateId":"@id",
                        "type|1": ['baseInterview','interview','tempInterview','endingInterview','resultInterview', 'questionInterview','scoreInterview']
                    },
                    {
                        "id":"@id",
                        "type":"类型",
                        "name":'访视',
                        "time":"@datetime('yy-MM-dd HH:mm:ss')",
                        "status|1":['ready','finish','overdue'],
                        "interviewTemplates|3":[{
                            "id": "@id",
                            "templateId": "@id",
                            "type|1": ['baseInterview','interview','tempInterview','endingInterview','resultInterview', 'questionInterview','scoreInterview']
                        }],
                        "id":"@id",
                        "templateId":"@id",
                        "type|1": ['baseInterview','interview','tempInterview','endingInterview','resultInterview', 'questionInterview','scoreInterview']
                    },
                    {
                        "id":"@id",
                        "type":"类型",
                        "name":'访视',
                        "time":"@datetime('yy-MM-dd HH:mm:ss')",
                        "status|1":['ready','finish','overdue'],
                        "interviewTemplates|3":[{
                            "id": "@id",
                            "templateId": "@id",
                            "type|1": ['baseInterview','interview','tempInterview','endingInterview','resultInterview', 'questionInterview','scoreInterview']
                        }],
                        "id":"@id",
                        "templateId":"@id",
                        "type|1": ['baseInterview','interview','tempInterview','endingInterview','resultInterview', 'questionInterview','scoreInterview']
                    },
                    {
                        "id":"@id",
                        "type":"类型",
                        "name":'访视',
                        "time":"@datetime('yy-MM-dd HH:mm:ss')",
                        "status|1":['ready','finish','overdue'],
                        "interviewTemplates|3":[{
                            "id": "@id",
                            "templateId": "@id",
                            "type|1": ['baseInterview','interview','tempInterview','endingInterview','resultInterview', 'questionInterview','scoreInterview']
                        }],
                        "id":"@id",
                        "templateId":"@id",
                        "type|1": ['baseInterview','interview','tempInterview','endingInterview','resultInterview', 'questionInterview','scoreInterview']
                    },
                    {
                        "id":"@id",
                        "type":"类型",
                        "name|1":['结局事件','随访终止'],
                        "time":"@datetime('yy-MM-dd HH:mm:ss')",
                        "status|1":['ready','finish','overdue'],
                        "interviewTemplates|3":[{
                            "id": "@id",
                            "templateId": "@id",
                            "type|1": ['baseInterview','interview','tempInterview','endingInterview','resultInterview', 'questionInterview','scoreInterview']
                        }],
                        "id":"@id",
                        "templateId":"@id",
                        "type|1": ['baseInterview','interview','tempInterview','endingInterview','resultInterview', 'questionInterview','scoreInterview']
                    },
                    {
                        "id":"@id",
                        "type":"类型",
                        "name|1":['访视','结局事件','随访终止'],
                        "time":"@datetime('yy-MM-dd HH:mm:ss')",
                        "status|1":['ready','finish','overdue'],
                        "interviewTemplates|3":[{
                            "id": "@id",
                            "templateId": "@id",
                            "type|1": ['baseInterview','interview','tempInterview','endingInterview','resultInterview', 'questionInterview','scoreInterview']
                        }],
                        "id":"@id",
                        "templateId":"@id",
                        "type|1": ['baseInterview','interview','tempInterview','endingInterview','resultInterview', 'questionInterview','scoreInterview']
                    }
                ],
                "schedule":"进度",
                "data":"数据",
                "crfRecordId":"@id",
                "month":"@datetime('yy-MM')"
                }
            ],
            "flag|1":['0未启用','１启用','2删除'],
            "pageable": {
                "sort": {
                    "sorted": false,
                    "unsorted": true
                },
                "pageSize": pageSize,
                "pageNumber": pagNum,
                "offset": 0,
                "paged": true,
                "unpaged": false
            },
            "last": true,
            "totalPages": "@natural(1,1000)",
            "totalElements": 10,
            "first": true,
            "sort": {
                "sorted": false,
                "unsorted": true
            },
            "numberOfElements": 1,
            "size": pageSize,
            "number": pagNum
        },
        "status": "ok",
        "description": "数据请求成功"
    });
    res.json(data);
});

//获取科室/医院

router.get('/subject/member/attend/:subjectId', function(req, res, next) {

    var data = mockjs.mock({
        "data": [
            {"hospital": '301医院',"dept": '心内科'},
            {"hospital": '302医院',"dept": '心内科'},
            {"hospital": '303医院',"dept": '心内科'},
            {"hospital": '304医院',"dept": '心内科'}
        ],
        "status": "ok",
        "description": "数据请求成功"
    });
    res.json(data);
});

router.post('/subject/:subjectId/group/:groupId/record/:recordId/temp/interview', function(req, res, next) {

    var data = mockjs.mock({
        "data": {
            "type":"类型",
            "name":"名称",
            "time":"时间",
            "name":"姓名",
            "status":"ready   finish   overdue",
            "interviewTemplates":"对应的模板",
            "schedule":"进度",
            "data":"数据",
            "crfRecordId":"病例id",
            "month":"储存月份,为了数据采集的展示与新增人数的获取"
        },
        "status": "ok",
        "description": "数据请求成功"
    });
    res.json(data);
});

router.post('/subject/:subjectId/group/:groupId/record', function(req, res, next) {

    var data = mockjs.mock({
        "data": {
            "type":"类型",
            "name":"名称",
            "time":"时间",
            "name":"姓名",
            "interviewTemplates":"对应的模板",
            "schedule":"进度",
            "data":"数据",
            "crfRecordId":"@id",
            "month":"@datetime('yy-MM')"
        },
        "status": "ok",
        "description": "数据请求成功"
    });
    res.json(data);
});

router.get('/crf/template/category/:templateId/:interviewId', function(req, res, next) {

    var data = mockjs.mock({
        "data": [
            {
                "id": null,
                "name": "患者基本信息 @natural(1,1000)",
                "bizName": null,
                "label": "A 患者基本信息一站式HCR手术 @natural(1,1000)",
                "type": "菜单",
                "parent": null,
                "group": null,
                "order": 20,
                "description": null,
                "filterTag": null,
                "exportTag": null,
                "hasNecessary": false,
                "categoryLevel": "模块",
                "children": []
            },
            {
                "id": null,
                "name": "心脏病史 @natural(1,1000)",
                "bizName": null,
                "label": "B 心脏病史 @natural(1,1000)",
                "type": "菜单",
                "parent": null,
                "group": null,
                "order": 180,
                "description": null,
                "filterTag": null,
                "exportTag": null,
                "hasNecessary": false,
                "categoryLevel": "模块",
                "children": []
            },
            {
                "id": null,
                "name": "术前危险因素 @natural(1,1000)",
                "bizName": null,
                "label": "C 术前危险因素 @natural(1,1000)",
                "type": "菜单",
                "parent": null,
                "group": null,
                "order": 580,
                "description": null,
                "filterTag": null,
                "exportTag": null,
                "hasNecessary": false,
                "categoryLevel": "模块",
                "children": []
            },
            {
                "id": null,
                "name": "一站式HCR手术 @natural(1,1000)",
                "bizName": null,
                "label": "D 一站式HCR手术 @natural(1,1000)",
                "type": "菜单",
                "parent": null,
                "group": null,
                "order": 3900,
                "description": null,
                "filterTag": null,
                "exportTag": null,
                "hasNecessary": false,
                "categoryLevel": "模块",
                "children": []
            }
        ],
        "status": "ok",
        "description": "数据请求成功"
    });
    res.json(data);
});


router.put('/subject/:subjectId/group/:groupId/:templateId/:interviewId/:module', function(req, res, next) {
    res.json({
        "data": true,
        "status": "ok",
        "description": "数据请求成功"
    });
});

router.get('/crf/template/group/:groupId/type/:type/list', function(req, res, next) {
    res.json(mockjs.mock({
        "data|3": [
            {
                "id": '@id',
                "name": "调查问卷@natural(1,10)",
                "dept|1": ['心内科','呼吸科'],
                "type": "tempInterview",
                "createTime": "@datetime('yy-MM-dd')",
                "own": "quinn",
                "crfTemplateInfos": null
            }
        ],
        "status": "ok",
        "description": "数据请求成功"
    }));
});


module.exports =  router;
