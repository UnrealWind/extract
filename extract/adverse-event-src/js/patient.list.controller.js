angular.module('infi-basic').controller('PatientListController', ['$scope', 'SYS', '$location','PatientListService','Utils','$filter', function($scope,SYS,$location,PatientListService,Utils,$filter){

    $scope.screenConditions = null;//筛选条件
    $scope.keyword = "";
    $scope.SYS = SYS;
    $scope.columns = null;
    $scope.content = null;
    // $scope.startDefaultTime = $filter('date')(new Date(new Date()-365*24*60*60*1000),'yyyy-MM-dd');
    $scope.startDefaultTime = '2017-01-01';
    $scope.endDefaultTime = $filter('date')(new Date(),'yyyy-MM-dd');
    $scope.opts = {
        label:"操作",
        btns:[
            {
                label:"查看详情",
                type:"show"
            },{
                label:"添加关注",
                type:""
            }
        ]
    };

    function init(){
        PatientListService.getConditions().then(function(msg){
            $scope.screenConditions = msg.data;
            PatientListService.getScreen().then(function(msg1){
                $scope.screenConditions.deptId.options = msg1.deptId;
                $scope.screenConditions.wardId.options = msg1.wardId;
            });
            $scope.screenConditions.time = $scope.startDefaultTime + ' - ' + $scope.endDefaultTime;//给时间设置默认值
            $scope.getContent($scope.screenConditions.deptId.value,$scope.screenConditions.wardId.value,SYS.DEFAULT_PAGE_NUMBER,SYS.DEFAULT_PAGE_SIZE,$scope.screenConditions.time,$scope.keyword);
        });
        PatientListService.getColumns().then(function(msg){
            $scope.columns = msg.data;
        });
    }
    init();

    $scope.btnCallback = function(entity,type){
        if(type == "show"){
            $location.path('prediction-list/'+entity.patiId);
        }
    };
    /**
     * 查看详情
     */
    $scope.showDetails = function(entity){
        $location.path('prediction-list/'+entity.patiId);
    };
    /**
     * 切换科室
     * @param deptId
     */
    $scope.changeDept = function(deptId){
        $scope.screenConditions.wardId.value = "";
        if(deptId != "" && deptId!=null){
            PatientListService.changeDept(deptId).then(function(msg){
                $scope.screenConditions.wardId.options = msg.data.result;
            })
        }else{
            PatientListService.getScreen().then(function(msg1){
                $scope.screenConditions.wardId.options = msg1.wardId;
            });
        }
        $scope.getContent($scope.screenConditions.deptId.value,$scope.screenConditions.wardId.value,SYS.DEFAULT_PAGE_NUMBER,SYS.DEFAULT_PAGE_SIZE,$scope.screenConditions.time,$scope.keywords);
    };
    /**
     * 添加关注
     * @param entity
     */
    $scope.addAttention = function(entity){
        var request = angular.copy(entity);//若是添加关注,将实体中的focus变成"1"之后再提交后台
        var isSign = '';
        if(request.isFocus == '0'){
            isSign = "1";
            request.isFocus = "1";
        }else if(request.isFocus == '1'){
            isSign = "0";
            request.isFocus = "0";
        }
        PatientListService.addAttention(request,isSign).then(function(msg){
            Utils.sysTip($scope,msg);
            if(msg.status == SYS.STATUS_SUCCESS){
                setTimeout(function(){
                    $scope.getContent($scope.screenConditions.deptId.value,$scope.screenConditions.wardId.value,SYS.DEFAULT_PAGE_NUMBER,SYS.DEFAULT_PAGE_SIZE,$scope.screenConditions.time,$scope.keywords);
                },1000);
            }
        })
    };
    /**
     * 获取表格内容
     * @param dept
     * @param ward
     * @param pageNo
     * @param pageSize
     * @param time
     * @param keyword
     */
    $scope.getContent = function(dept,ward,pageNo,pageSize,time,keyword){
        var filter = {
            dept:dept,
            ward:ward,
            pageNo:pageNo,
            pageSize:pageSize,
            time:time,
            keyword:keyword
        };
        PatientListService.getContent(filter).then(function(msg){
            $scope.content = msg;
            $scope.content.page.number ++;
        })
    };

    $scope.updatePage = function(page){
        $scope.getContent($scope.screenConditions.deptId.value,$scope.screenConditions.wardId.value,page,SYS.DEFAULT_PAGE_SIZE,$scope.screenConditions.time);
    };
    
    $('input[name="daterange"]').daterangepicker({
        showDropdowns: true,
        showWeekNumbers: false, //是否显示第几周

        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary blue',
        cancelClass: 'btn-small',
        startDate: $scope.startDefaultTime,//设置初始值
        endDate: $scope.endDefaultTime,//设置结束值
        format: 'yyyy-MM-dd', //控件中from和to 显示的日期格式
        // separator: ' to ',
        locale:{
            applyLabel: '确认',
            cancelLabel: '取消',
            format: 'YYYY-MM-DD',
            // fromLabel: '从',
            // toLabel: '到',
            // weekLabel: 'W',
            // customRangeLabel: 'Custom Range',
            daysOfWeek:["日","一","二","三","四","五","六"],
            monthNames: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"]
        }
    }, function (start, end, label) {
        // alert('A date range was chosen: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
    });
}]).service('PatientListService',['$http','SYS',function($http,SYS){
    /**
     * 获取表格标题
     * @returns {*}
     */
    this.getColumns = function(){
        return $http.get(SYS.jsonUrl+'patient-prediction-columns.json').then(function(msg){
            return msg.data;
        })
    };
    /**
     * 获取表格内容
     */
    this.getContent = function(filter){
        var url = SYS.url + 'adverse/prediction/patient/list?';
        var params = [];
        filter.dept!=undefined&&filter.dept != ""?params.push("filter_deptId="+filter.dept):params.push("filter_deptId=");
        filter.ward!=undefined&&filter.ward != ""?params.push("filter_wardId="+filter.ward):params.push("filter_wardId=");
        filter.pageNo!=undefined&&filter.pageNo != ""?params.push("filter_pageNo="+filter.pageNo):params.push("filter_pageNo=");
        filter.pageSize!=undefined&&filter.pageSize != ""?params.push("filter_pageSize="+filter.pageSize):params.push("filter_pageSize=");
        filter.time!=undefined&&filter.time != ""?params.push("filter_happen_date="+filter.time):params.push("filter_happen_date=");
        filter.keyword!=undefined&&filter.keyword != ""?params.push("filter_search="+filter.keyword):params.push("filter_search=");
        url = url + params.join('&');
        return $http.get(url).then(function(msg){
        // return $http.get(SYS.jsonUrl + 'patient-content.json').then(function(msg){
            return msg.data;
        })
    };
    /**
     * 获取筛选条件
     */
    this.getConditions = function(){
        return $http.get(SYS.jsonUrl + 'patient-screen.json').then(function(msg){
            return msg.data;
        })
    };
    /**
     * 获取筛选条件下拉列表
     */
    this.getScreen = function(){
        return $http.get(SYS.url + 'monitoring/conditions').then(function(msg){
            return msg.data;
        })
    };
    /**
     * 切换科室同时获取对应病区
     * @param deptId
     */
    this.changeDept = function(deptId){
        return $http.get(SYS.url + 'unite/resource/single/1?filter__deptId='+deptId).then(function(msg){
            return msg.data;
        })
    };

    /**
     * 添加关注
     * @param request
     * @param isSign
     */
    this.addAttention = function(request,isSign){
        return $http.put(SYS.url + 'adverse/prediction/patient/attention/'+request.id+"?filter_isSign="+isSign+"&filter_patiId="+request.patiId,request).then(function (msg) {
            return msg.data;
        })
    };
}]);