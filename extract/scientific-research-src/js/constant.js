angular.module('infi-basic').value('SYS',{
    //url:'http://192.168.1.22:8080/research/',
    //url:'http://192.168.1.53:8080/research/',

    url:backApi["scientific-research-src"].url,
    //url:'http://192.168.1.174:21016/research/',
    // url:'http://192.168.1.19:8080/research/',
    //url:'http://192.168.1.173:18091/research/',
    // url:'http://192.168.1.174:21016/research/',
    //url:'http://192.168.1.19:8081/research/',
    //url:'http://127.0.0.1:1995/research/',
    //url:'http://47.92.143.156:31206/research/',
    //url:'http://192.168.60.104:31020/research/',
    STATUS_SUCCESS: 'ok',
    STATUS_BLANK: 'blank',
    STATUS_AUTH_PASSED: "AUTH_PASSED",
    STATUS_AUTH_FAIL: 'AUTH_FAIL',
    STATUS_DO_LOGIN: 'doLogin',
    STATUS_QUERYING: 'querying',
    STATUS_ERROR:'error'
});
