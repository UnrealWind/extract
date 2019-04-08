angular.module('infi-basic')
    .controller('TaskController', ['$scope','TaskService','SYS','$routeParams','DataAdapter','$location','Utils',function ($scope,TaskService,SYS,$routeParams,DataAdapter,$location,Utils) {
        $scope.SYS = SYS;
        //用于显示左侧tab的数据
        $scope.summaryData = null;
        //用于显示右侧性别、年龄等信息
        $scope.allData = null;
        //用于显示点击某个名称出现的弹出框数据
        $scope.detailData = {
            groupId:$routeParams.groupId,  //由逻辑配置页面返回的id或者规则选择的规则id
            type:$routeParams.type,  //标示是否规则选择的进入,select-由规则选择进入,back-由逻辑配置返回
            recordPage:{},  //用于盛放后台返回的原始数据
            pageResult:{}  //盛放页面显示的数据
        };

        //盛放筛选的数据
        $scope.filterData = [];

        var storage = window.localStorage;
        
        /**
         * 页面初始化
         */
        init();
        function init(){
            setUrls();
            if($scope.detailData.type){  //type存在则是选择规则的条件选取
                $scope.headerData = [{name:'1.选择规则',step:1},{name:'2.筛选条件选取',step:2},{name:'3.筛选逻辑配置',step:3},{name:'4.推送结果选择',step:4}];
                $scope.col = "25%";
                $scope.step = 2;  //控制页面切换header的显示效果
                //由规则选择进入,需要获取规则内容展示
                if($scope.detailData.type == "select"){
                    TaskService.getGroupData('rule/getRule/',$scope.detailData.groupId).then(function (msg) {
                        $scope.ruleDetail = msg.data;
                    });
                }
            }else{
                $scope.headerData = [{name:'1.筛选条件选取',step:1},{name:'2.筛选逻辑配置',step:2},{name:'3.保存推荐科室',step:3}];
                $scope.col = "33.33%";
                $scope.step = 1;
            }
            var data = {subjectId:"",subjectGroupId:""};
            storage.setItem('sbuject',JSON.stringify(data));
            getFilterData();
        }

        /**
         * 提前设置一些需要的访问的后台接口
         */
        function setUrls() {
            //创建规则,url使用'register';创建推送任务使用"clinic"
            $scope.urlFilter = $scope.detailData.type ? "clinic" : "register";
            //是否是由逻辑配置页面返回条件选取页面
            $scope.isBack = (!$scope.detailData.type&&$scope.detailData.groupId)||($scope.detailData.type&&$scope.detailData.type == 'back');
            $scope.groupUrl = $scope.detailData.type ? "pushTask/getPushTask/" : "rule/getRule/";  //获取保存的screenJson的url
            $scope.saveUrl = $scope.detailData.type ? "pushTask/":"rule/";  //保存接口链接
            $scope.saveUrl += $scope.isBack?"saveScrren":"create";
            $scope.nextUrl = $scope.detailData.type ? "select/":"";  //下一步跳转链接
        }

        function getFilterData(){
            // var complete = {};
            //获取左侧tab数据 filter为不同医院不同病区
            TaskService.getSummaryList($scope.urlFilter,storage.getItem('sbuject')).then(function (msg) {
                $scope.summaryData = msg;
            });
            TaskService.getInfoDetailData($scope.urlFilter,storage.getItem('sbuject')).then(function (msg) {
                $scope.allData = msg;
            });
            if($scope.isBack){
                // 从第二个页面返回第一个页面时，原先选中的仍然选中
                TaskService.getGroupData($scope.groupUrl,$scope.detailData.groupId).then(function (msg) {
                    $scope.detailData.recordPage = msg;
                    if(msg.status == SYS.STATUS_SUCCESS){
                        $scope.mappingData = msg.data.screenJson==null||msg.data.screenJson==""?[]:JSON.parse(msg.data.screenJson);
                        $scope.ruleDetail = msg.data.rule;  //显示规则详情
                    }else{
                        $scope.ruleDetail = {};
                    }
                });
            }
        }

        /**
         * 去逻辑配置页面保存选取的数据
         */
        $scope.getTransmitData = function () {
            $scope.filterData = DataAdapter.convertSubmitData($scope.summaryData.data);
            //规则创建:rule/create  数据:{screenJson:"......"}
            //规则修改:rule/saveScrren  数据:{id:1,screenJson:"......"}
            //推荐任务规则创建:pushTask/create  数据:{rule:{id:1},screenJson:"......"}
            //推荐任务规则修改:pushTask/saveScrren  数据:{id:1,screenJson:"......"}
            var data = {};
            if($scope.detailData.type){
                data = $scope.isBack?{id:$scope.detailData.groupId}:{rule:{id:$scope.detailData.groupId}};
            }else{
                data = $scope.isBack?{id:$scope.detailData.groupId}:{};
            }
            data.screenJson=($scope.filterData==null || $scope.filterData.length==0)?"":JSON.stringify($scope.filterData);
            // 保存筛选的数据
            TaskService.saveFilterData($scope.saveUrl,data).then(function (msg){
                if(msg.status == SYS.STATUS_SUCCESS){
                    $scope.detailData.groupId = msg.data.id;
                    $location.path("task-configuration/"+$scope.nextUrl+$scope.detailData.groupId);
                }else{
                    Utils.sysTip($scope,msg);  //保存不成功的错误提示
                }
            });
        }
    }]);