angular.module('infi-basic').value('SYS',{
    // url:'http://192.168.1.21:8080/portrait/',
    // url:'http://192.168.1.22:8080/portrait/',
    //url:'http://192.168.1.161:23110/portrait/',
    //url:'http://192.168.1.55:8080/portrait/',
    //url:'http://192.168.1.161:23110/portrait/',
    url:'http://mcheckup.whhealth.gov.cn/portrait/',
    jsonUrl:'../data/',
    STATUS_SUCCESS: 'ok',
    STATUS_BLANK: 'blank',
    STATUS_AUTH_PASSED: "AUTH_PASSED",
    STATUS_AUTH_FAIL: 'AUTH_FAIL',
    STATUS_DO_LOGIN: 'doLogin',
    STATUS_QUERYING: 'querying',
    STATUS_ERROR:'error',

    DEFAULT_PAGE_NUMBER:1,
    DEFAULT_PAGE_SIZE:10,

    STATUS_DEVICE: 'checkDevice',
    imgBack:'eu=21232f297a57a5a743894a0e4a801fc3&ep=21232f297a57a5a743894a0e4a801fc3'
});

angular.module('infi-basic').constant('config',{
    parameter:'eu=21232f297a57a5a743894a0e4a801fc3&ep=21232f297a57a5a743894a0e4a801fc3'
});
