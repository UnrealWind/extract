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
    url: backApi['record-collect-src']['url'],
    //url: 'http://192.168.1.53:19091/inquiry-doctor/',
    treatUrl: backApi['record-collect-src']['treatUrl'],
    prescriptUrl: backApi['record-collect-src']['prescriptUrl'],//门诊处方
    abnormalUrl:backApi['record-collect-src']['abnormalUrl']//异常视图
});

angular.module('infi-basic').value('EMR', {
    PAGE_NUMBER: 1,
    PAGE_SIZE: 10
});

