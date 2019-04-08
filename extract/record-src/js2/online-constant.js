//定义系统常量
angular.module('infi-basic').value('SYS', {
    //数据请求的状态
    STATUS_SUCCESS: 'ok',
    STATUS_ERROR: 'error',
    STATUS_BLANK: 'blank',
    STATUS_AUTH_PASSED: "AUTH_PASSED",
    STATUS_AUTH_FAIL: 'AUTH_FAIL',
    STATUS_DO_LOGIN: 'doLogin',
    STATUS_QUERYING: 'querying',
    //查看概况地址
    ChinaEleUrl:'http://172.17.1.149:58800/datas#/overview/',
    // ChinaEleUrl:'http://192.168.1.196:8800/datas#/overview/',
    //请求本地数据地址
    titleUrl: 'data/',
    // 请求杨的数据地址
    // url: 'http://192.168.1.24:8080/obstetrics/'
    //url: 'http://192.168.1.91:23698/obstetrics/',
    // 武警妇产科hospital
    // url:'http://172.16.253.218:37561/obstetrics/'
    // 统一视图地址
     url:'http://172.18.0.210:37561/obstetrics/'
    // 301 医院统一视图
    // url:'http://172.18.3.2:23102/obstetrics/'
    // 长庚医院
    // url:'http://47.92.146.131:24300/obstetrics/'
});

//定义武警妇产科常量
angular.module('infi-basic').value('EMR', {
    PAGE_NUMBER: 1,
    PAGE_SIZE: 10
});
