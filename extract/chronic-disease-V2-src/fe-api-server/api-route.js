/**
 * API 接口路由全部在这里定义
 */

const express = require('express')
const mockjs = require('mockjs')

var router = express.Router()

/**
 * 检查用户是否存在
 */
router.get('/1/1/1/patient/:pid/ifExist', function(req, res) {
  var pid = req.params.pid

  var dataMap = {
    0: 0,
    1: 1
  }

  var resData = null

  if(pid == 0) {
    resData = {
      data: {
        name: null
      },
      status: 'blank'
    }
  } else {
    resData = {
      data: {
        name: 'aaaa',
        sex: 1
      },
      status: 'ok'
    }
  }

  res.json(resData)
})

/**
 * 创建患者
 */
router.post('/1/1/1/1/patient/create', function(req, res) {
  var pInfo = req.body

  res.json({
    data: true,
    status: 'ok'
  })

})


router.get('/1/1/1/patient/list', function(req, res, next) {
  pagNum = req.query.page_num
  pageSize = req.query.page_size

  var data = mockjs.mock({
    "page": {
      "content|10": [{
        "pid|1000-9999": 2018,
        "name": "@cname",
        "sex|1": ['男', '女'],
        "tips": ['15 天后复诊'],
        "groupName|1": ['慢阻肺']
      }],
      "number": pagNum,
      "size": pageSize,
      "totalElements": 30,
      "totalPages": 4
    },
    'status': 'ok'
  })

  res.json(data)
})

router.get('/1/1/getGroup', function(req, res, next) {

  var data = mockjs.mock({
    'data': [
      {id: 1, name: '营养组'},
      {id: 1, name: 'PICC'},
      {id: 1, name: '疼痛'},
      {id: 1, name: '血栓'}
    ],
    'status': 'ok'
  })

  res.json(data)
})

router.get('/1/1/1/123456/index/35', function(req, res, next) {
  var data = mockjs.mock({
    "data": [
      {
        "id": 9,
        "label": "呼吸困难指数( mMRC)",
        "value": "mMRC-分级3",
        "name": "2019-03-07",
        "description": null,
        "order": 2147483647
      },
      {
        "id": 10,
        "label": "呼吸困难指数( mMRC)",
        "value": "mMRC-分级2",
        "name": "2019-03-08",
        "description": null,
        "order": 2147483647
      }
    ],
    "status": "ok",
    "description": "数据请求成功"
  })

  res.json(data)
})


module.exports =  router