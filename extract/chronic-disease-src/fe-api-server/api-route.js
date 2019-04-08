/**
 * API 接口路由全部在这里定义
 */

const express = require('express')
const mockjs = require('mockjs')

var router = express.Router()

router.get('/list', function(req, res, next) {
  pagNum = req.query.page_num
  pageSize = req.query.page_size

  var data = mockjs.mock({
    "page": {
      "content|10": [{
        "depID|1000-9999": 2018,
        "name": "@cname",
        "gender|1": ['男', '女'],
        "prompt": ['共 3 天未用药打卡', '已上传用药视频', 'cat 评估: 高风险'],
        "group|1": ['慢阻肺']
      }],
      "number": pagNum,
      "size": pageSize,
      "totalElements": 400,
      "totalPages": 4
    }
  })

  res.json(data)
})


module.exports =  router