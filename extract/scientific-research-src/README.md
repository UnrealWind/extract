## 项目说明
### 页面及页面各个api说明

 课题列表页面  /subject-list
    —— 获取我的课题
    —— 获取邀请我的课题
    —— 接受邀请

    when('/subject-list', {
        templateUrl: '/scientific-research-src/html/subject-list.html',
        controller: 'SubjectListController'
    }).

 课题新建页面 /subject-create
    —— 新建课题
    —— 修改课题
    —— 获取课题id
    —— 上传附件
    —— 获取附件列表
    —— 下载附件
    —— 删除附件

    when('/subject-create', {
        templateUrl: '/scientific-research-src/html/subject-create.html',
        controller: 'SubjectCreateController'
    }).

 课题成员邀请页面   /subject-member
    —— 筛选，包含姓名搜索医院科室职称所得到的 已邀请成员列表
    —— 筛选，包含姓名搜索医院科室职称所得到的 未邀请成员列表
    —— 医院，科室，职称维表获取
    —— 权限切换  （暂时不做）
    —— 删除已邀请的成员  （暂时不做）
    —— 申请查看电话邮箱  （暂时不做）
    —— 进行邀请
    —— 删除邀请

    when('/subject-member', {
        templateUrl: '/scientific-research-src/html/subject-member.html',
        controller: 'SubjectMemberController'
    }).

 课题任务计划创建页面   /subject-detail
    —— 获取分组信息
    —— 删除分组信息
    —— 获取CRF模板列表
    —— 上传各种crf （？）
    —— 获取已邀请成员列表
    —— 存储课题任务
    —— 访视消息提醒 （？）

    when('/subject-detail', {
        templateUrl: '/scientific-research-src/html/subject-detail.html',
        controller: 'SubjectDetailController'
    }).

 课题概况页面   /subject-overview
    —— 获取kpi
    —— 获取基本信息
    —— 获取附件列表
    —— 附件下载
    —— 获取各中心列表
    —— 获取各中心采集情况
    —— 四张图

    when('/subject-overview', {
        templateUrl: '/scientific-research-src/html/subject-overview.html',
        controller: 'SubjectOverviewController'
    }).

 病历列表页面  /record-list
    —— 获取各中心列表
    —— 筛选，获取该中心下病历列表

    when('/record-list', {
        templateUrl: '/scientific-research-src/html/record-list.html',
        controller: 'RecordListController'
    }).

 病历修改页面  /record-input
    —— 获取全部模块
    —— 获取该模块下的内容
    —— 获取CRF列表
    —— 添加crf
    —— 获取添加的crf信息，这里通过返回的id用上面两个api就行
    —— 进行模块保存
    —— 获取修改记录

    when('/record-input', {
        templateUrl: '/scientific-research-src/html/record-input.html',
        controller: 'RecordInputController'
    }).

 详情查看页面  /record-detail
    —— 获取全部模块
    —— 获取该模块下的内容
    —— 获取修改记录

    when('/record-detail', {
        templateUrl: '/scientific-research-src/html/record-detail.html',
        controller: 'RecordDetailController'
    }).

 CRF管理页面  /CRF-list
    ——  CRF列表
    ——  CRF详情
    ——  新建模板
    ——  CRF类型表


 自定义CRF    /CRF-custom
    —— 这里与之前的一样


 以上除却CRF与之前一样的共计八个页面 master




