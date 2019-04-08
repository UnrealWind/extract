angular.module('infi-basic').controller('MonitoringListController', ['$scope', 'SYS', '$location', 'Utils','MonitoringListService','$routeParams', function ($scope, SYS, $location, Utils,MonitoringListService,$routeParams) {

    $scope.screenConditions = null;//筛选条件
    $scope.columns = null;
    $scope.content = null;
    $scope.opts = {
        label:"操作",
        btns:[
            {
                label:"查看详情",
                type:"show"
            }
        ]
    };

    $scope.detailsJson = null;
    $scope.SYS =SYS;

    /**
     * 翻页(获取表格内容)
     * @param page
     */
    $scope.updatePage = function(page){
        var params = {
            filter_search:$scope.screenConditions.search,
            filter_deptId:$scope.screenConditions.deptId.value,
            filter_wardId:$scope.screenConditions.wardId.value,
            filter_time:$scope.screenConditions.time,
            filter_eventType:$scope.screenConditions.eventType.value,
            filter_firstEvent:$scope.screenConditions.firstEvent.value,
            filter_secondEvent:$scope.screenConditions.secondEvent.value,
            filter_startAge:$scope.screenConditions.startAge,
            filter_endAge:$scope.screenConditions.endAge,
            filter_sex:$scope.screenConditions.sex.value,
            filter_pageNo:page,
            filter_pageSize:SYS.DEFAULT_PAGE_SIZE
        };
        MonitoringListService.getContent(params).then(function(msg){
            $scope.content = msg;
            if(msg.status == SYS.STATUS_SUCCESS){
                $scope.content.page.number ++;
            }
        })
    };

    function init(){
        if($routeParams.patientId){
            var params = JSON.parse(sessionStorage.getItem('listParams'));
            //这是详情页
            MonitoringListService.getDetailsJson($routeParams.patientId).then(function(msg){
                console.log(msg)
                $scope.detailsJson = msg.data;
                MonitoringListService.getDetails($routeParams.patientId,params.happenDate).then(function(msg){
                    console.log(msg)
                    angular.forEach(msg.data,function(msgValue,msgKey){ //循环第一层得到 basic和report
                        angular.forEach($scope.detailsJson,function(jsonValue,jsonKey){// 循环detailsJson
                            angular.forEach(jsonValue,function(entityValue,entityKey){
                                if(entityKey == msgKey){
                                    entityValue.value = msgValue;
                                }
                            });
                        })
                    })
                })
            })
        }else{
            //这是列表页
            MonitoringListService.getMonitorJson().then(function(msg){
                $scope.screenConditions = msg.data;
                MonitoringListService.getScreen().then(function(msg){
                    angular.forEach($scope.screenConditions,function(conditions,key){
                        angular.forEach(msg,function(value,key2){
                            if(key == key2){
                                conditions.options = value;
                            }
                        })
                    })
                });
                //获取表格
                $scope.updatePage(SYS.DEFAULT_PAGE_NUMBER);
            });
            MonitoringListService.getColumns().then(function(msg){
                $scope.columns = msg.data;
            });
        }
    }
    init();

    /**
     * 切换事件
     */
    $scope.changeEvent = function(value,type){
        var filter = '';
        if(type == 'event'){
            filter = 'filter__eventType='+value;

            MonitoringListService.getScreen(filter).then(function(msg){
                $scope.screenConditions.firstEvent.value = "";
                $scope.screenConditions.firstEvent.options = msg.firstEvent;

                $scope.screenConditions.secondEvent.value = "";
                $scope.screenConditions.secondEvent.options = msg.secondEvent;
            })
        }else if(type == 'first'){
            filter = 'filter__eventType='+$scope.screenConditions.eventType.value+'&filter__firstEvent='+value;

            MonitoringListService.getScreen(filter).then(function(msg){
                $scope.screenConditions.secondEvent.value = "";
                $scope.screenConditions.secondEvent.options = msg.secondEvent;
            })
        }

    };

    /**
     * 切换科室
     */
    $scope.changeDept = function(value){
        MonitoringListService.changeDept(value).then(function(msg){
            $scope.screenConditions.wardId.value = "";
            $scope.screenConditions.wardId.options = msg.data.result;
        });
    };

    $('input[name="daterange"]').daterangepicker({
        showDropdowns: true,
        showWeekNumbers: false, //是否显示第几周
        // timePicker: true, //是否显示小时和分钟
        // timePickerIncrement: 60, //时间的增量，单位为分钟
        // timePicker12Hour: false, //是否使用12小时制来显示时间
        opens: 'right', //日期选择框的弹出位置
        buttonClasses: ['btn btn-default'],
        applyClass: 'btn-small btn-primary blue',
        cancelClass: 'btn-small',
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
    /**
     * 表格的查看详情按钮
     * @param entity
     * @param type
     */
    $scope.btnBack = function(entity,type){
        $location.path('patient-details/'+entity.patientId);
        var filter = {
            patientId:entity.patientId,
            happenDate:entity.happenDate
        };
        sessionStorage.setItem('listParams',JSON.stringify(filter));
    };
    /**
     * 返回按钮
     */
    $scope.goBack = function(){
        $location.path('monitoring-list');
    }
}]).service('MonitoringListService',['$http','SYS',function($http,SYS){
    /**
     * 获取筛选条件json
     * @returns {*}
     */
    this.getMonitorJson = function(){
        return $http.get(SYS.jsonUrl+'monitor-screen.json').then(function(msg){
            return msg.data;
        })
    };
    /**
     * 获取下拉列表
     * @returns {*}
     */
    this.getScreen = function(filter){
        var url = SYS.url + 'patient/conditions';
        if(filter){
            url = url + '?' + filter;
        }
        return $http.get(url).then(function(msg){
            return msg.data;
        })
    };

    /**
     * 获取表格标题
     * @returns {*}
     */
    this.getColumns = function(){
        return $http.get(SYS.jsonUrl + 'patient-columns.json').then(function(msg){
            return msg.data;
        })
    };

    /**
     * 获取表格内容
     * @param params
     * @returns {*}
     */
    this.getContent = function(params){
        return $http({
            method:'get',
            url:SYS.url + 'patient/list',
            params:params
        }).then(function(msg){
            return msg.data;
        });
    };

    /**
     * 获取患者详情页json
     * @param params
     */
    this.getDetailsJson = function(){
        return $http.get(SYS.jsonUrl+'patient-details.json').then(function(msg){
            return msg.data;
        })
    };

    /**
     * 获取详情
     */
    this.getDetails = function(id,happenDate){
        return $http.get(SYS.url + 'patient/patientDetail/'+id+'?happenDate='+happenDate).then(function(msg){
            return msg.data;
        })
    }

    /**
     * 切换科室同时获取对应病区
     * @param deptId
     */
    this.changeDept = function(deptId){
        return $http.get(SYS.url + 'unite/resource/single/1?filter__deptId='+deptId).then(function(msg){
            return msg.data;
        })
    };
}]);