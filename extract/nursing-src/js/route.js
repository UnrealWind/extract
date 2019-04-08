angular.module('infi-basic')
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    //列表页
    when('/list',{
        templateUrl:'../nursing-src/html/list.html',
        controller:'ListController'
    }).
    //时间轴页
    when('/details/:patientId',{
        templateUrl: '../nursing-src/html/patient-details.html',
        controller:'DetailsController'
    }).
    //置管前评估录入(1.六类表单类型,2.操作,3.病历id)(时间周跳到新增评估页)(路径上要加上 ?tubeInfoId='')
   
    when('/pre-evaluation/:section/:operate/:patientId',{
        templateUrl: '../nursing-src/html/pre-evaluation.html',
        controller:'InputController'
    }). when('/pre-evaluation/:section/:operate/:patientId',{
        templateUrl: '../nursing-src/html/pre-evaluation.html',
        controller:'InputController'
    }). when('/pre-evaluation/:section/:operate/:patientId',{
        templateUrl: '../nursing-src/html/pre-evaluation.html',
        controller:'InputController'
    }).
    //置管前评估修改(1.六类表单类型,2.操作,3.病历id,4.置管Id)(置管详情的新增评估)
    when('/pre-evaluation/:section/:operate/:patientId/:id',{
        templateUrl: '../nursing-src/html/pre-evaluation.html',
        controller:'InputController'
    }).
    //置管前评估详情(1.六类表单类型2.操作:新增修改或是详情3.病历号4.自己的id)(路径上要加上 ?tubeInfoId='')
    when('/pre-details/:section/:operate/:patientId/:id',{
        templateUrl: '../nursing-src/html/pre-details.html',
        controller:'InputController'
    }).
    //置管记录录入(1.六类表单类型2.操作:新增修改或是详情3.病历号4.置管类型)(路径上要加上 ?feasibilityId='')
    when('/catheter-record/:section/:operate/:patientId/:tubeType',{
        templateUrl: '../nursing-src/html/catheter-record.html',
        controller:'InputController'
    }).
    //置管记录修改
    when('/catheter-record/:section/:operate/:patientId/:tubeType/:id',{
        templateUrl: '../nursing-src/html/catheter-record.html',
        controller:'InputController'
    }).
    //置管表单详情
    when('/catheter-record-list/:section/:operate/:patientId/:id',{
        templateUrl: '../nursing-src/html/catheter-record-list.html',
        controller:'InputController'
    }).
    //置管详情(大的页面)
    when('/catheter-details/:patientId/:tubeInfoId',{
        templateUrl: '../nursing-src/html/catheter-details.html',
        controller:'CatheterDetailsController'
    }).
    //风险评估录入
    when('/risk-evaluation/:patientId',{
        templateUrl: '../nursing-src/html/risk-evaluation.html',
        controller:'RiskController'
    }).
    //风险评估详情
    when('/risk-details/:patientId/:id',{
        templateUrl: '../nursing-src/html/risk-details.html',
        controller:'RiskController'
    }).
    //维护记录(1.六类表单name值2.操作:新增修改或是详情3.病历号4.置管Id)
    when('/maintenance-record/:section/:operate/:patientId',{
        templateUrl: '../nursing-src/html/maintenance-record.html',
        controller:'InputController'
    }).
    //维护记录(1.六类表单name值2.操作:新增修改或是详情3.病历号4.置管Id)
    when('/maintenance-record/:section/:operate/:patientId/:id',{
        templateUrl: '../nursing-src/html/maintenance-record.html',
        controller:'InputController'
    }).
    //维护记录详情(1.六类表单name值2.操作:新增修改或是详情3.病历号4.置管Id,5.自己的id)
    when('/maintenance-details/:section/:operate/:patientId/:id',{
        templateUrl: '../nursing-src/html/maintenance-details.html',
        controller:'InputController'
    }).
    //拔管记录录入(1.六类表单name值2.操作:新增修改或是详情3.病历号4.置管Id)
    when('/extubation-record/:section/:operate/:patientId',{
        templateUrl: '../nursing-src/html/extubation-record.html',
        controller:'InputController'
    }).
    //拔管记录录入(1.六类表单name值2.操作:新增修改或是详情3.病历号4.置管Id)
    when('/extubation-record/:section/:operate/:patientId/:id',{
        templateUrl: '../nursing-src/html/extubation-record.html',
        controller:'InputController'
    }).
    //拔管记录详情
    when('/extubation-details/:section/:operate/:patientId/:id',{
        templateUrl: '../nursing-src/html/extubation-details.html',
        controller:''
    }).
    //随访记录(1.六类表单name值,2.操作:新增修改或是详情,3.病历号,4.置管Id,5.模板Id)(模板Id用templateId)
    when('/follow-up-record/:section/:operate/:patientId',{
        templateUrl: '../nursing-src/html/follow-up-record.html',
        controller:'InputController'
    }).
    //随访记录(1.六类表单name值,2.操作:新增修改或是详情,3.病历号,4.置管Id,5.模板Id)(模板Id用templateId)
    when('/follow-up-record/:section/:operate/:patientId/:id',{
        templateUrl: '../nursing-src/html/follow-up-record.html',
        controller:'InputController'
    }).
        //随访记录详情
    when('/follow-up-details/:section/:operate/:patientId/:id',{
        templateUrl: '../nursing-src/html/follow-up-details.html',
        controller:'InputController'
    }).
    when('/login',{
        templateUrl: '../src/widget/system/html/login.html',
        controller:'LoginController'
    }).
    otherwise({
        redirectTo: '/list'
    });
}]);

angular.module('infi-basic').run(['$rootScope','Session','SYS',function ($rootScope,Session,SYS) {
    $rootScope.$on('$routeChangeSuccess', checkUserAuth);

    function checkUserAuth() {
        if( !Session.isAuthenticated() ){
            $rootScope.$broadcast(SYS.STATUS_DO_LOGIN,true);
        }
    }
}]);
