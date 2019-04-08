angular.module('infi-basic').controller('genInfoInput',['SYS','$scope','ListInput','Page','$routeParams','$timeout',function(SYS,$scope,ListInput,Page,$routeParams,$timeout){
    $scope.SYS = SYS;
    $scope.subjectId = $routeParams.id;
    $scope.type = $routeParams.type;
    $scope.judgeReason = "";
    $scope.bool = "no";
    function refreshList(msg){
        if(!msg){
            $scope.description = '系统没有查询到数据,请修改查询条件';
            $scope.totalData = {totalElements: 0};
            return;
        }
        $scope.description = undefined;
        //totalData 用于页面使用的page信息
        $scope.totalData = msg;

        //listData宠存储了用于生成list的数据
        $scope.listData = msg.content;

        //获取page的数据
        $scope.pageList = Page.genView(msg);
        $scope.totalPage = msg.totalPages;
    }

    //fydebug 初始化全部默认为B0901，如果有cookie则全部以cookie为准
    $scope.$root.project={value: 'Y0001'};
    (function getProjectName(){
        if($.cookie('projectName') !== null){
            $scope.$root.project.value = $.cookie('projectName');
        }
    })();

    ListInput.listData(undefined,$scope.type).then(function(msg){
        refreshList(msg);
    });

    $scope.newRecord = function(){
        $scope.recordData = ListInput.newRecord($scope.$root.project);
        window.location.href=SYS.url + "load/data/"+$scope.$root.project.value+"/input/"+$scope.recordData.id;
    };

    //翻页点击触发的时候调用对应方法
    $scope.changePage = function(val){

        //校验一下，超出范围不予理睬
        if(val<1 || val>$scope.totalPage){
            return false;
        }
        ListInput.listData(val,$scope.type).then(function(msg){
            refreshList(msg);
        });
    };

    //delete 模态框
    $scope.modalDelete = function(id){
        ListInput.modalDelete();
        $scope.deleteId = id;
    };

    //详情模态框
    $scope.getDetails = function(id){
        ListInput.getDetails().then(function(msg){
            $scope.inputData = msg.data;
        });
        $('#infi-u-details').modal();

    };


    //点击删除对应的属性
    $scope.deleteData = function(id,pageNum){

        //fydebug 这里代码执行顺序有问题，有可能会导致数据没有刷新，应该是用jquery的ajax方法
        ListInput.deleteData(id);

        ListInput.listData(pageNum,$scope.type).then(function(msg){
            refreshList(msg);
        });
    };

    //fydebug 这里暂时先采用jquery的写法，后期会移植到services 里面
    $scope.exportRecord = function(opt){
        opt.oneClickMark = true;
        $.ajax({
            url:SYS.url + "extract/task/excute/"+opt.id,
            type:"get",
            data:'',
            async: false,
            success:function(msg){
                window.location.reload();
            }
        });
    };

    $scope.$watch('$root.project.value',function(newValue, oldValue){
        if(newValue !== oldValue){
            ListInput.listData(undefined,$scope.type).then(function(msg){
                refreshList(msg);
            });
        }
    });

    //审核
    $scope.modalJudge = function(id){
        ListInput.modalJudge();
        $scope.judgeId = id;
    };

    $scope.judgeData = function(id){
        if(($scope.judgeReason === '' || $scope.judgeReason === null) && $scope.isJudge === 'no'){
            return false;
        }
        //fydebug 这里代码执行顺序有问题，有可能会导致数据没有刷新，应该是用jquery的ajax方法
        ListInput.judgeData(id,$scope.isJudge,$scope.judgeReason).then(function (msg) {
            ListInput.listData(undefined,$scope.type).then(function(msg){
                refreshList(msg);
            });

            //重置状态
            $('#infi-u-judge').modal('hide');
            $scope.judgeReason = '';
        });

    };

    $scope.downloadFile = function (id) {
        window.location.href = SYS.url + "extract/task/download/" + id;
    }

    //分组列表
    $scope.showGroupList = function () {
        ListInput.getGroupData($scope.subjectId).then(function (msg) {
            $scope.groupList = msg;
            $scope.colseGroup();
        });
    }

    //跳转属性提取页面
    $scope.goToTask = function () {
        $("#infi-u-group").modal('hide');
        $timeout(function () {
            window.location.href = '#/init/'+$scope.subjectId+'/'+$scope.subjectGroupId;
        },500)
    }

    //关闭分组弹框后将下拉框第一个选中
    $scope.colseGroup = function () {
        if($scope.groupList.status == SYS.STATUS_SUCCESS){
            $scope.subjectGroupId = $scope.groupList.data[0].id.toString();
        }
    }
}]);

angular.module('infi-basic').service('ListInput',['$http','SYS', '$routeParams',function($http,SYS,$routeParams){
    this.listData = function(val,type){
        if(!val){
            val = 1;
        }
        var params = {'page_number':val,'page_size':10, 'filter_EQ_subjectId': $routeParams.id};
        type == 'check' ? params.filter_EQ_status = 'AUDIT_PRE' : undefined;
        return $http({
            url: SYS.url + 'extract/task/page',
            method: 'get',
            params: params
        })
            .then(function(msg){
                return msg.data.page;
            });
    };

    this.deleteData = function(id){

        //虽然eclipse报错但是是可以运行的
        $.ajax({
            url:SYS.url + 'load/records/'+id,
            data:'',
            type:'delete',
            async: false,
        });
    };

    this.getDetails = function(){
        return $http({
            url: SYS.url + 'resources/data/fetchData/TestDataOpt.json',
            method: 'get',
            params: ''
        })
            .then(function(msg){
                return msg.data;

            });
    };

    this.newRecord = function(project){
        var data = {};
        $.ajax({
            url:SYS.url + 'load/records/'+project.value,
            type:'post',
            contentType: "application/json",
            data:JSON.stringify({projectName: project.value}),
            async: false,
            success:function(msg){
                data =  msg.data;
            }
        });
        return data;
    };

    this.modalDelete = function(){
        $('#infi-u-delete').modal();

        //节省时间做法
        $('#infi-u-delete textarea').val('');
    };

    this.modalJudge = function(){
        $('#infi-u-judge').modal({backdrop: 'static'});

        //节省时间做法
        $('#infi-u-judge textarea').val('');
    };

    this.judgeData = function(id,isJudge,judgeReason){
        return $http({
            url:SYS.url + 'extract/task/detail/auth/'+ id+"?bool="+isJudge+'&description='+judgeReason,
            method:'get'
        }).then(function (msg) {
            return msg.data;
        });
    };

    this.getGroupData = function (id) {
        return $http({
            url:SYS.url + 'subject/'+id+'/group',
            method:'get'
        }).then(function (msg) {
            return msg.data;
        });
    }
}]);	