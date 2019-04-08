angular.module('infi-basic').value('SYS',{
    STATUS_SUCCESS: 'ok',
    infiUrl:'data/',
    // url:'http://192.168.1.164:23105/menzhen_extracting/',
    url: backApi["extract-service-src"].url,
    // 分页时默认请求第1页数据
    DEFAULT_PAGE_NUMBER: '1',
    DEFAULT_PAGE_SIZE:'10',
    RULE_STATUS:{
        DRAFT:"草稿",
        AUDIT_PRE:"待审核",
        AUDIT_PASSED:"审核通过",
        AUDIT_REJECT:"审核驳回",
        EXTRACTING:"数据提取中",
        DATA_READY:"数据已生成",
        EXTRACT_FAILED:"数据提取失败",
        INFORMED:"已通知用户",
        DOWNLOAD:"已下载",
        CLEARED:"已清除"
    },
    GROUP_SOURE_TYPE: {
        FILTER: "筛选",
        IMPORT: "导入"
    },
    STATUS_AUTH_PASSED: "AUTH_PASSED",
    STATUS_AUTH_FAIL: 'AUTH_FAIL',
    STATUS_DO_LOGIN: 'doLogin',
    STATUS_QUERYING: 'querying',
    ROLES_READY: 'rolesReady',
    ROLES_CODER: 'coder',
    ROLES_SENIOR_CODER: 'seniorcoder',
    ROLES_ADMIN: 'admin'
});
