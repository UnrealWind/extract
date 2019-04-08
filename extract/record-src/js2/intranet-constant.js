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
    ChinaEleUrl:'http://192.168.1.200:8800/datas#/overview/',
    //请求本地数据地址
    titleUrl: 'data/',
    // 请求杨的数据地址
    url: 'http://192.168.1.167:37561/obstetrics/'

});

//定义武警妇产科常量
angular.module('infi-basic').value('EMR', {
    PAGE_NUMBER: 1,
    PAGE_SIZE: 10
});
