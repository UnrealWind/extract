angular.module('infi-basic').value('SYS',{
    // 杨丽平
     url:'http://192.168.1.55:8080/unhealthy/',
    // url:'http://192.168.1.21:8080/unhealthy/',
    //url:'http://192.168.1.169:32172/unhealthy/',
    // 阿里云
    // url:'http://47.92.143.156:23203/unhealthy/',
    //url:'http://47.92.143.156:23203/unhealthy/',
    jsonUrl:'data/',
    STATUS_SUCCESS: 'ok',
    STATUS_BLANK: 'blank',
    STATUS_AUTH_PASSED: "AUTH_PASSED",
    STATUS_AUTH_FAIL: 'AUTH_FAIL',
    STATUS_DO_LOGIN: 'doLogin',
    STATUS_QUERYING: 'querying',
    STATUS_ERROR:'error',

    DEFAULT_PAGE_NUMBER:1,
    DEFAULT_PAGE_SIZE:10,
    //六类表单是新增还是修改还是详情
    ADD:'add',
    EDIT:'edit',
    DETAILS:'details',
    imgBack:'eu=21232f297a57a5a743894a0e4a801fc3&ep=21232f297a57a5a743894a0e4a801fc3'
});

angular.module('infi-basic').constant('config',{
    parameter:'eu=21232f297a57a5a743894a0e4a801fc3&ep=21232f297a57a5a743894a0e4a801fc3'
});
