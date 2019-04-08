/**
 * Created by geqimeng on 17-11-14.
 */
angular.module('infi-basic').value('SYS',{
    STATUS_SUCCESS: 'ok',
    infiUrl:'data/',
   // url:'http://192.168.1.19:8080/extracting/',  //连接后台的url
    url:'http://192.168.1.169:29201/extracting/',
    STATUS_AUTH_PASSED: "AUTH_PASSED",
    STATUS_AUTH_FAIL: 'AUTH_FAIL',
    STATUS_DO_LOGIN: 'doLogin',
    STATUS_QUERYING: 'querying',
    ROLES_READY: 'rolesReady',
    ROLES_CODER: 'coder',
    ROLES_SENIOR_CODER: 'seniorcoder',
    ROLES_ADMIN: 'admin'
});
