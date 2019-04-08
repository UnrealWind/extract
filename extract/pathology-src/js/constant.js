angular.module('infi-basic').value('SYS',{
  STATUS_SUCCESS: 'ok',
  url:backApi['pathology-src'].url,
  // url:'http://192.168.1.25:18088/admission_regist',
  // url:'http://192.168.1.175:35112/admission_regist',

  // 分页时默认请求第1页数据
  DEFAULT_PAGE_NUMBER: '1',
  DEFAULT_PAGE_SIZE:'10',
  STATUS_AUTH_PASSED: "AUTH_PASSED",
  STATUS_AUTH_FAIL: 'AUTH_FAIL',
  STATUS_DO_LOGIN: 'doLogin',
  STATUS_QUERYING: 'querying',
  ROLES_READY: 'rolesReady',
  ROLES_CODER: 'coder',
  ROLES_SENIOR_CODER: 'seniorcoder',
  ROLES_ADMIN: 'admin'
});