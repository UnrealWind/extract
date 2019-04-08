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
    //请求本地数据地址
    titleUrl: 'data/',
    url: 'http://'

});

angular.module('infi-basic').value('EMR', {
    PAGE_NUMBER: 1,
    PAGE_SIZE: 10
});

