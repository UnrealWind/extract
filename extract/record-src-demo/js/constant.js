//定义系统常量
angular.module("infi-basic").value("SYS", {
    //数据请求的状态
    STATUS_SUCCESS: "ok",
    STATUS_ERROR: "error",
    STATUS_BLANK: "blank",
    STATUS_AUTH_PASSED: "AUTH_PASSED",
    STATUS_AUTH_FAIL: "AUTH_FAIL",
    STATUS_DO_LOGIN: "doLogin",
    STATUS_QUERYING: "querying",
    //请求本地数据地址
    url: backApi['record-src-demo']['url'],
    //url: 'http://192.168.1.174:30030/obstetrics/',
    //url: "http://192.168.1.55:8080/obstetrics/",
    //url: "https://record.infisa.com.cn/obstetrics/",
    //请求本地数据地址
    titleUrl: 'data/',
    // 异常试图获取数据后台连接
     abnormalUrl:backApi['record-src-demo']['abnormalUrl'],
    //abnormalUrl: "http://192.168.1.166:36005/abnormal_view/",
    // abnormalUrl: "https://record.infisa.com.cn/abnormal_view/",

    // 异常视图病历详情跳转链接
    viewDetailUrl: "/record-src-demo/#/record/"

});

angular.module("infi-basic").value("EMR", {
    PAGE_NUMBER: 1,
    PAGE_SIZE: 10
});
