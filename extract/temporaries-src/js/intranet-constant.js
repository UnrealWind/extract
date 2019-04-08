angular.module("infi-basic").value('SYS',{
    STATUS_SUCCESS: 'ok',
    url:'http://192.168.1.167:32182/hypertensive/',
    //url:'http://172.18.0.210:37661/301_outpatient/',
    ChinaEleUrl:'http://192.168.1.200:8800/datas#/overview/',
    //请求本地数据地址
    titleUrl: 'data/',
    STATUS_ERROR:'error',
    localUrl:'data/',
    STATUS_AUTH_PASSED: "AUTH_PASSED",
    STATUS_AUTH_FAIL: 'AUTH_FAIL',
    STATUS_DO_LOGIN: 'doLogin',
    STATUS_QUERYING: 'querying',
    ROLES_READY: 'rolesReady',
    ROLES_CODER: 'coder',
    ROLES_SENIOR_CODER: 'seniorcoder',
    ROLES_ADMIN: 'admin'
});
angular.module('infi-basic').value('EMR', {
    PAGE_NUMBER: 1,
    PAGE_SIZE: 10
});