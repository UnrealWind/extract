angular.module('infi-basic').value('SYS',{
  STATUS_SUCCESS: 'ok',
  url:backApi['daily-shift-src'].url,

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