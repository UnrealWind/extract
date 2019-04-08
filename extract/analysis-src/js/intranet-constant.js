angular.module('infi-basic').value('SYS',{

    //hyl的后台路经
    url:'http://192.168.1.174:30010/analyze/',
    // url:'http://localhost:8081/platform/',

    //llf的数据计算路经
    urls:'http://192.168.1.184:4080/data',
    moreTraning:'http://192.168.1.184:4080/multi_colline',
    modelTrain:'http://192.168.1.184:4080/logistic',

    // urlsss:'http://192.168.1.252:8800/multi_colline',
    STATUS_SUCCESS: 'ok',
    STATUS_ERROR: 'error',
    STATUS_BLANK: 'blank',
    STATUS_AUTH_PASSED: "AUTH_PASSED",
    STATUS_AUTH_FAIL: 'AUTH_FAIL',
    STATUS_DO_LOGIN: 'doLogin',
    STATUS_QUERYING: 'querying'
});
