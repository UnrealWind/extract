# 新版开发说明

这一版的前端开发需要使用构建工具进行开发,部署

当前构建工具的选项暂时是百度的fis3.

我们使用构建工具的目标是:
* 部署时使用脚本实现生产用代码的自动抽取
* 样式表基于sass进行开发,构建工具自动编译为css
* javascript和css文件实现自动合并和压缩
* javascript和css文件实现基于内容的md5命名后缀


## 开发使用的各目录说明

|-home  开发的根目录
    |--package.json node的开发依赖定义
    |--bower.json   bower(前端)的开发依赖定义
    |--fis-conf.js  构建工具配置文件
    |--dist         构建生成文件的存放路径
    |--src          所有源码的存放路径
        |--template             语义化html5的存放目录,这边的是实现样式表的纯html
            |--index.html       首页
            |--tab.html         系统中定义的全部tab
            |--...
        |--scss                 sass文件存放位置,文件拆分的依据是组件widget定义
            |-- main.scss       基础定义
            |-- index.scss      首页使用的定义
            |--...
        |--widget               组件实际开发目录,第一版是angular的directive
            |--buttons          按钮组件
                |--README.md    组件需求定义
                |--index.html   组件对应的模板文件
                |--index.js     组件对应的js文件
            |--content
                |--index.html
                |--index.js
            |--choser
                |--index.html
                |--index.js
            |--form
                |--README.md
                |--basic.js
                |--test
                    |--basic.json
                    |--basic.js
                    |--basic.html
    |--study-src

## fis3 使用说明

具体请看百度官方文档

http://fis.baidu.com/

### 环境搭建

需要的环境:
node
npm
fis3


### 开发

代码调试:
fis3 release -d dist
```shell
fis3 release -wL
fis3 server start
```
在浏览器中输入
```js
http://localhost:8080
```
就可以看到代码效果

shell脚本说明:
fis3 release 发布代码至内置服务器;w 监听文件修改;L浏览器自动刷新
fis3 server start 启动内置服务器


bower安装公共插件时选择的插件版本
1.angular在安装时必须选择1.5.8版本
2.bootstrap在安装时我选择的3.3.7版本
3.d3在安装时必须选择3.5.17版本
4.angular-route在安装时必须选择1.5.8版本
5.jquery在安装时选择最新版本


# 前端 `http server`

## 0. 目的

数据交互层实现完全的前后端分离.

## 1. 需求

- 前端自己启服务

- 模拟后台 `API` 接口请求

- 能够跨域

- `mock` 假数据

## 实现

> 要求 1 ---> `express`

```js
const express = require('express')

var app = new express()

// 启动前端数据接口代理服务
app.listen(1995, function() {
  console.log("前端数据接口代理服务启动成功!")
})
```

> 需求 2 ---> `express.Router().get() / put() / post() / delete()`

```js
// 利用 use() 在所有接口地址前添加标示, 利用这点实现根据项目划分接口
app.use('/medicalReg', router)

var router = express.Router()

router.get('/profile', function(req, res, next) {
  pagNum = req.query.page_num
  pageSize = req.query.page_size

res.json(data)
})

```

> 需求 3 ---> `cors`

```js
app.use(cors())
```

> 需求 3 ---> `mockjs`

```js
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
```

## 使用

`fe-api-server` --> `app.js` 负责启动服务,代码基本不用变.

`fe-api-server` --> `api-route.js` 负责项目接口路由的定义.

每次启动项目之后, 定位到 `fe-api-server` 目录下运行 `node app.js` 指令启动 `server`, 默认端口为 `1995`

## 参考

[Express Docs](https://expressjs.com/en/4x/api.html)

[Mock.js](https://github.com/nuysoft/Mock/wiki)

## 样例

目前只写了一个样例, 在 `medical-registration --> fe-api-server` 下, 可以去里面更改以熟悉用法.



