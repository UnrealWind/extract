/**
 * API 接口路由全部在这里定义
 */

const express = require('express')
const mockjs = require('mockjs')

var router = express.Router()

router.get('/profile', function(req, res, next) {
  pagNum = req.query.page_num
  pageSize = req.query.page_size

  var data = mockjs.mock({
    "page": {
      "content|10": [{
        "id": "@id",
        "times|1-10": 6,
        "pName": "@cname",
        "pGender|1": ['男', '女'], 
        "region|1": ['一病区', '二病区', '三病区', '四病区'],
        "entry|1": ["登记", "已登记"],
        "exit|1": ["登记", "已登记"]
      }],
      "number": pagNum,
      "size": pageSize,
      "totalElements": 40,
      "totalPages": 4
    }

  })

  res.json(data)
})


module.exports =  router