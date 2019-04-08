angular.module('infi-basic')
    .controller('SelectRuleController', ['$scope','TaskService','SYS','$location','ViewMapping',function ($scope,TaskService,SYS,$location,ViewMapping) {
        $scope.SYS = SYS;
        $scope.columns = [];  //表头数据
        $scope.content = [];  //内容数据
        $scope.opts = {
            label:"操作",
            btns:[{
                label:"查看",
                type:"view"
            },{
                label:"选择",
                type:"select"
            }]

        };
        
        $scope.headerData = [{name:'1.选择规则',step:1},{name:'2.筛选条件选取',step:2},{name:'3.筛选逻辑配置',step:3},{name:'4.推送结果选择',step:4}];
        
        function init() {
            TaskService.getColumn('select-rule').then(function (msg) {
                $scope.columns = msg.data;
            })
            $scope.changePage(SYS.DEFAULT_PAGE_NUMBER);
        }
        
        $scope.changePage = function (pageNo) {
            //只显示审核通过的列表
            TaskService.getListData("rule/page?filter_EQ_status=AUDIT_PASSED&",pageNo,SYS.DEFAULT_PAGE_SIZE).then(function (msg) {
                if(msg.status){
                    if(msg.page&&msg.page != null){
                        $scope.content = ViewMapping.mappingStatus(msg);
                    }else{
                        $scope.content = msg;
                    }
                }
            });
        }

        $scope.pageOperation = function (entity,type) {
            if(type == "view"){
                $location.path("rule-detail/view/"+entity.id);
            }else if(type == "select"){
                $location.path("task-service/select/"+entity.id);
            }
        }
        init();

        $scope.step = 1;
    }]);