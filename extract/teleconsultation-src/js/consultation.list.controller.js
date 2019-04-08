angular.module('infi-basic').controller('ConsultationList', ['$scope', 'ConsultationListService', 'SYS', '$timeout','Utils', function ($scope, ConsultationListService, SYS, $timeout,Utils) {

    $scope.credentials = {
        username: '',
        password: '',
        eu: '',
        ep: '',
        name: ''
    };

    //接受后台传递的视频信息
    $scope.videoData = {
        tip:null,
        data:null
    };

    $scope.status = {
        status:''
    };

    $scope.consultation = true;
    $scope.doctor = [];

    // 先对筛选条件进行初始化
    $scope.filterList = {
        startTime:"",
        endTime:"",
        hospitalFilter:"",
        departFilter:"",
        userFilter:"",
        statusFilter:""
    };


    /**
     * 获取tab数据
     */
    ConsultationListService.getListData().then(function success(msg) {
        $scope.dataType = msg.data;
        $scope.activeType($scope.dataType[0])
    });

    // 获取登录人的id
    (function(){
        var credentials = $scope.credentials;
        credentials.eu = md5(credentials.username);
        credentials.ep = md5(credentials.password);

        ConsultationListService.getUser(credentials).then(function (msg) {
            if (msg.success) {
                $scope.userId = msg.user.id;
            }
        })
    })();

    /**
     * tab表格切换
     * @param type
     */
    $scope.activeType = function (type) {

        $scope.content = [];
        $scope.type = type;
        angular.forEach($scope.dataType, function (entity) {
            entity.active = false;
        });

        type.active = true;
        // 获取表头数据
        ConsultationListService.getHeaderData(type.name).then(function success(msg) {
            $scope.headerData = msg.data;
        });
        getFilterData($scope.type);

        getNewData();
    };

    /**
     * 获取表格数据,医师数据,并将数据进行整合,ljy_debug时间问题先这样吧，最好放到service,这个地方有点乱;
     * @param type
     * @param pageNo
     * @param pageSize
     * @param filterDatas
     */
    function getDataList(type, pageNo, pageSize,filterDatas) {
        $scope.doctor = [];
        ConsultationListService.getTableData({
            filter_tab: type.name,
            filter_pageNo: pageNo,
            filter_pageSize: pageSize,
            filter_userId:$scope.userId
        },filterDatas).then(function success(msg) {
            $scope.tableData = msg;
            if ($scope.tableData.page !== null && $scope.tableData.page.content !== undefined) {
                $scope.lisData = ConsultationListService.PortfolioList($scope.tableData);
            } else(
                $scope.lisData = null
            );
            if ($scope.lisData) {
                $scope.content = ConsultationListService.fixDoctor($scope.lisData, $scope.doctor);
            } else {
                $scope.content = $scope.tableData;
            }
        });
    }

    /**
     * 获取筛选条件(三个下拉列表的值)
     * @param data
     */
    function getFilterData(data){
        ConsultationListService.getFilterData(data.filterUrl).then(function success(msg){
            $scope.filterData= msg;
        })
    }

    function getNewData(){
        //数据清空初始化(现在改为值保留)
        // $scope.filterList = {
        //     startTime:"",
        //     endTime:"",
        //     hospitalFilter:"",
        //     departFilter:"",
        //     userFilter:"",
        //     statusFilter:""
        // };

        $scope.filterDatas = ConsultationListService.makefilerData($scope.type,$scope.filterList);
        getDataList($scope.type, 1, 10, $scope.filterDatas);
    }

    /**
     * 筛选条件的触发,但是需要区分是否为时间，如果为时间的化那么
     */
    $scope.getSelectData = function(time){
        if(time){
            if($scope.filterList.startTime !== "" && $scope.filterList.endTime !== ""){
                $scope.filterDatas = ConsultationListService.makefilerData($scope.type,$scope.filterList);
                getDataList($scope.type, 1, 10, $scope.filterDatas);
            }
        }else{
            $scope.filterDatas = ConsultationListService.makefilerData($scope.type,$scope.filterList);
            getDataList($scope.type, 1, 10, $scope.filterDatas);
        }
    };



    /**
     * 表格分页操作
     * @param page
     */
    $scope.changePage = function (page) {
        //数据清空初始化
        $scope.filterList = {
            startTime:"",
            endTime:"",
            hospitalFilter:"",
            departFilter:"",
            userFilter:"",
            statusFilter:""
        };

        $scope.filterDatas = ConsultationListService.makefilerData($scope.type,$scope.filterList);
        getDataList($scope.type, page, 10, $scope.filterDatas);
    };

    /**
     * 表格操作
     * @param entity
     * @param type
     */
    $scope.pageFns = function pageFns(entity, type) {
        switch (type) {
            case 'select' ://查看
                var determineParams;
                var role = ConsultationListService.determineRole(entity);
                switch (entity.consultation.status) {
                    case "wait_consultation":
                        determineParams = 'ero';
                        PageJump(entity, determineParams, role);
                        break;
                    case "consultation_going":
                        determineParams = 'ero';
                        PageJump(entity, determineParams, role);
                        break;
                    case "video_end":
                        determineParams = 'ero';
                        PageJump(entity, determineParams, role);
                        break;
                    case "wait_confirm":
                        determineParams = 'ero';
                        PageJump(entity, determineParams, role);
                        break;
                    case "finish" :
                        determineParams = 'eroc';
                        PageJump(entity, determineParams, role);
                        break;
                    case "cancel" :
                        determineParams = 'ec';
                        PageJump(entity, determineParams, role);
                        break;
                    case "save" :
                        determineParams = 'e';
                        PageJump(entity, determineParams, role);
                }
                break;
            case 'enter' ://进入会诊
                // $("#createMyModal").modal('show');
                ConsultationListService.videoCall(
                    entity.consultationId,
                    'open'
                ).then(function (msg) {
                    $scope.vadio = msg.data;
                    $scope.videoData.tip = '是否进入会诊？';
                    $scope.videoData.data = entity;
                    if($scope.vadio.open){
                        /*window.open($scope.vadio.linkUrl,'_blank');
                        lookUp(entity);*/

                        $('#videoTip').modal('show');
                    }else{
                        var msg = {
                            status:null,
                            description:null
                        };
                        msg.status = SYS.STATUS_ERROR;
                        msg.description = "会诊尚未发起，请稍候再试...";
                        Utils.sysTip($scope,msg);
                    }
                });


                break;
            case 'cancel' ://取消会诊
                $scope.operationType = 'cancel';
                $('#myModalConsultation').modal('show');
                $scope.statusConsultationId = entity.consultationId;
                break;
            case 'isPass' ://是否同意会诊
                $scope.status = {
                    status:''
                };
                $scope.operationType = 'agree';
                $('#myModalConsultation').modal('show');
                $scope.statusConsultationId = entity.consultationId;
                $scope.statusDocId = entity.docId;
                break;
            case 'launch'://发起会诊
                // $("#createMyModal").modal('toggle');
                ConsultationListService.videoCall(
                    entity.consultationId,
                    'open'
                ).then(function (msg) {
                    $scope.vadio = msg.data;
                    $scope.videoData.tip = '是否进入会诊？';
                    $scope.videoData.data = entity;
                    if($scope.vadio.open){
                        /*window.open($scope.vadio.linkUrl,'_blank');
                        lookUp(entity);*/

                        $('#videoTip').modal('show');
                    }else{
                        var msg = {
                            status:null,
                            description:null
                        };
                        msg.status = SYS.STATUS_ERROR;
                        msg.description = "会诊尚未发起，请稍候再试...";
                        Utils.sysTip($scope,msg);
                    }
                });
                break;
            //结束会诊
            case 'end':
                ConsultationListService.videoEnd(entity.consultationId).then(function(msg){
                    $scope.vadio = msg.data;

                    //这里强行刷第二个(ps:可能会留下坑)，只有第二个tab中可以结束会诊
                    $scope.activeType($scope.dataType[1]);
                });
                break;
            case 'delete':// 删除会诊
                $scope.operationType = 'delete';
                $('#myModalConsultation').modal('show');
                $scope.statusConsultationId = entity.consultation.id;

        }
    };

    $scope.videoChange = function(){

        $('#videoTip').modal('hide');

        window.open($scope.vadio.linkUrl);
        //lookUp($scope.videoData.data);

        $('#videoTip').on('hidden.bs.modal', function (e) {
            //window.open($scope.vadio.linkUrl);
            lookUp($scope.videoData.data);
        })
    }

    function lookUp(entity){
        var determineParams;
        var role = ConsultationListService.determineRole(entity);
        switch (entity.consultation.status) {
            case "wait_consultation":
                determineParams = 'ero';
                PageJump(entity, determineParams, role);
                break;
            case "consultation_going":
                determineParams = 'ero';
                PageJump(entity, determineParams, role);
                break;
            case "video_end":
                determineParams = 'ero';
                PageJump(entity, determineParams, role);
                break;
            case "wait_confirm":
                determineParams = 'ero';
                PageJump(entity, determineParams, role);
                break;
            case "finish" :
                determineParams = 'eroc';
                PageJump(entity, determineParams, role);
                break;
            case "cancel" :
                determineParams = 'ec';
                PageJump(entity, determineParams, role);
                break;
            case "save" :
                determineParams = 'e';
                PageJump(entity, determineParams, role);
        }
    }

    /**
     * 页面跳转
     * @param entity
     * @param determineParams
     * @param role
     * @constructor
     */

    function PageJump(entity, determineParams, role) {
        !entity.docId || entity.docId == ''|| entity.docId == null? entity.docId = 0:undefined;
        location.href = '#/consultationDetail/' + entity.consultationId + '/' + determineParams + '/' + entity.docId + '/' + role;
    }

    /**
     * 监听模态框,当模态框
     */
    $('#createMyModal').on('hide.bs.modal', function () {
        ConsultationListService.videoCall(
            $scope.vadio.consultationId,
            'close'
        ).then(function (msg) {
            $scope.vadio = msg.data;
        });
    });

    /**
     * 是否同意
     * @constructor
     */
    $scope.ConfirmTheStatus = function () {
        $('#myModalConsultation').modal('hide');
        switch($scope.operationType){
            case 'cancel'://取消会诊操作
                ConsultationListService.cancelConsultation(
                    $scope.statusConsultationId
                ).then(function success(msg) {
                    if (msg.status == SYS.STATUS_SUCCESS) {
                        getNewData();
                    }
                });
                break;
            case 'agree'://是否同意会诊
                ConsultationListService.ConfirmStatus({
                    consultationId: $scope.statusConsultationId,
                    status: $scope.status.status
                }).then(function success(msg) {
                    if (msg.status == SYS.STATUS_SUCCESS) {
                        getNewData();
                    }
                });
                break;
            case 'delete'://删除会诊
                ConsultationListService.deleteConsultation($scope.statusConsultationId).then(function (msg) {
                    getNewData();
                });
                break;
        }

    }
}]);