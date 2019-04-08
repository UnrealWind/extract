angular.module('infi-basic').controller('ExpertsController', ['$scope', 'ExpertsService', '$routeParams', 'SYS','Utils', function ($scope, ExpertsService, $routeParams, SYS,Utils) {
    $scope.quaryParams = {
        id: $routeParams.recordId,
        detail: $routeParams.detail
    };

    $scope.tableCheckBox = true;
    $scope.consultationRole = {
        name: true,
        value: ''
    };
    $scope.selectMain = {
        value: false
    };

    $scope.inviteKeyword = '';

    /**
     *
     * @type {Array}
     */
    $scope.checkboxList = [];

    /**
     * 获取表头数据
     */
    ExpertsService.getExpertsColumns().then(function success(msg) {
        $scope.tableColumns = msg.data;
    });

    /**
     * 页面初始化获取表格数据
     */
    $scope.getListData = function (No, size) {
        ExpertsService.getTableData({
            id: $scope.quaryParams.id,
            pageNo: No,
            pageSize: size
        }).then(function success(msg) {
            $scope.tableData = msg;
        });
    };
    $scope.getListData(1, 10);

    /**
     * 分页操作
     * @param page
     */
    $scope.getChange = function (page) {
        $scope.getListData(page, 10,$scope.inviteKeyword);
    };

    /**
     * 新增邀请
     */
    $scope.addInitiate = function () {
        $scope.inviteKeyword = '';
        //弹出框邀请框
        $("#clt-invites-modal").modal('show');
        // 获取表头数据
        ExpertsService.getExpertsInviteColumns().then(function success(msg) {
            $scope.tableColumn = msg.data;
        });
        getDoctorData(1, 10, $scope.inviteKeyword)
    };

    /**
     * 获取待邀请医生数据
     * @param No
     * @param size
     */
    function getDoctorData(No, size, keyWords) {
        ExpertsService.getIntiate({
            pageNo: No,
            pageSize: size,
            consultationId: $scope.quaryParams.id,
            keyWords: keyWords
        }).then(function success(msg) {
            $scope.initiateData = msg;
            if($scope.initiateData){
                $scope.checkboxListLength = angular.copy($scope.initiateData.page.content);
            }
        })
    }

    /**
     * 邀请列表分页操作
     * @param page
     */
    $scope.getLists = function (page) {
        getDoctorData(page, 10, $scope.inviteKeyword);

        $scope.$watch('initiateData',function(newValue,oldValue){
            if(newValue === oldValue){
                return false;
            }

            angular.forEach($scope.initiateData.page.content,function(entity){
                angular.forEach($scope.checkboxList,function(wrap){
                    if(entity.id === wrap.id){
                        entity.listSelect.value = true;
                        entity.consultationRole.value = wrap.consultationRole.value;
                    }
                })
            })
        });

    };

    /**
     * 新增邀请的模糊搜索
     */
    $scope.inviteSearch = function () {
        getDoctorData(1, 10, $scope.inviteKeyword);
    };

    /**
     * 定义操作名称
     * @param entity
     * @param type
     */
    $scope.pageFns = function pageFn(entity, type) {
        if (type === 'select') {
            $scope.selects(entity);
        }
        if (type === 'selectAll') {
            $scope.selectViceAll(entity);
        }
    };

    /**
     * 全选反选操作
     */
    $scope.selectViceAll = function () {
        $scope.checkboxList = [];
        var idx = 0,
            entity,
            initiateLength = $scope.initiateData.page.content.length;
        if ($scope.selectMain.value) {
            for (idx; idx < initiateLength; idx++) {
                entity = $scope.initiateData.page.content[idx];
                entity.listSelect = {};
                entity.listSelect.value = true;
            }
        } else {
            for (idx; idx < initiateLength; idx++) {
                entity = $scope.initiateData.page.content[idx];
                entity.listSelect = {};
                entity.listSelect.value = false;
            }
        }
        $scope.checkboxList = angular.copy($scope.initiateData.page.content);
    };

    /**
     * 将被选中的添加到数组当中
     * @type {Array}
     */
    $scope.selects = function (entity) {
        for (var idx = 0; idx < $scope.checkboxList.length; idx++) {
            if ($scope.checkboxList[idx].id === entity.id) {
                $scope.checkboxList.splice(idx, 1);
            }
        }
        $scope.checkboxList.push(entity);
        for (var i = 0; i < $scope.checkboxList.length; i++) {
            if ($scope.checkboxList[i].listSelect.value === false) {
                $scope.checkboxList.splice(i, 1);
                i--;
            }
        }
        //判断数据是否全部选中
        $scope.selectMain.value = ($scope.checkboxList.length === $scope.checkboxListLength.length);
    };


    $('#clt-invites-modal').on('hide.bs.modal', function () {
        $scope.checkboxList = [];
        $scope.selectMain.value = false;
    });

    /**
     * 确认邀请的操作,将选中的数据提交到后台,并重新请求表格数据;
     * @constructor
     */
    $scope.confirmInitiate = function () {
        if ($scope.checkboxList.length > 0) {
            ExpertsService.saveIniate($scope.checkboxList, $scope.quaryParams.id).then(function success(msg) {
                if(msg === ''){
                    $("#clt-invites-modal").modal('hide');
                    $scope.getListData(1, 10);
                    return false;
                }
                $scope.checkboxList = [];
                if(msg.status === SYS.STATUS_ERROR){
                    msg.message = msg.tipsFromServer.message;
                    
                }
                $scope.getListData(1, 10);

                $scope.promptMainContent = msg.message;
                $('#general-prompt').modal('show');
                
                //Utils.sysTip($scope,msg);
                $("#clt-invites-modal").modal('hide');
            })
        }
    };

    $scope.pageJump = function () {
        if ($scope.quaryParams.detail === 'detail') {
            history.go(-1);
        } else {
            location.href = '#/consultation-list'
        }
    }

    //提示模态框的确定回调函数,这个做法不好，应为将需要的回调函数注入到directive中,通过判断进行操作，而不是依赖于controller
    $scope.promptMainContentSave = function(){
        $('#general-prompt').modal('hide');
    }
}]);