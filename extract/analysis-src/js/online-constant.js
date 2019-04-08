angular.module('infi-basic').value('SYS',{

    //hyl的后台路经
    //url:'http://172.18.0.210:37575/analyze/',
    url:'http://192.168.60.104:30010/analyze/',
    // url:'http://localhost:8081/platform/',

    //llf的数据计算路经
    /*urls:'http://172.18.0.210:4080/data',
    moreTraning:'http://172.18.0.210:4080/multi_colline',
    modelTrain:'http://172.18.0.210:4080/logistic',*/

    urls:'http://192.168.60.40:6025/data',
    moreTraning:'http://192.168.60.40:6025/multi_colline',
    modelTrain:'http://192.168.60.40:6025/logistic',

    // urlsss:'http://192.168.1.252:8800/multi_colline',
    STATUS_SUCCESS: 'ok',
    STATUS_ERROR: 'error',
    STATUS_BLANK: 'blank',
    STATUS_AUTH_PASSED: "AUTH_PASSED",
    STATUS_AUTH_FAIL: 'AUTH_FAIL',
    STATUS_DO_LOGIN: 'doLogin',
    STATUS_QUERYING: 'querying'
});
