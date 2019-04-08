angular.module('infi-basic').value('SYS',{
    url:'http://47.92.146.131:28015/platform/',
    STATUS_SUCCESS: 'ok',
    STATUS_BLANK: 'blank',
    STATUS_AUTH_PASSED: "AUTH_PASSED",
    STATUS_AUTH_FAIL: 'AUTH_FAIL',
    STATUS_DO_LOGIN: 'doLogin',
    STATUS_QUERYING: 'querying',
    STATUS_ERROR:'error',
    imgBack:'eu=21232f297a57a5a743894a0e4a801fc3&ep=21232f297a57a5a743894a0e4a801fc3'
});

angular.module('infi-basic').constant('config',{
    parameter:'eu=21232f297a57a5a743894a0e4a801fc3&ep=21232f297a57a5a743894a0e4a801fc3'
});
