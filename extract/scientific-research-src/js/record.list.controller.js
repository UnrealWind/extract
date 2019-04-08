
angular.module("infi-basic").controller('RecordListController',
    ['$scope','SYS','$http','RecordListServices','$routeParams','$timeout','groupServices','subjectCreateService',
    function ($scope,SYS,$http,RecordListServices,$routeParams,$timeout,groupServices,subjectCreateService) {

        $scope.recordList =null;
        $scope.recordGroup = null;
        $scope.params = {
            time:'',
            search:'',
            groupId:''
        };

        $scope.newCRFData = [
            {label:'姓名',value:'',name:'name'},
            {label:'病例号',value:'',name:'caseId'}
        ];

        $scope.flupData = [
            {label:'访视时间',value:moment().format('L'),name:'time'},
            {label:'访视名称',value:'非计划访视-'+moment().format('M-D'),name:'name'}
        ]

        $scope.timeArea = [
            {label:'全部显示',active:true,timeArea:true},
            {label:'最近七天计划随访',key:'filter_period',value:'7',active:false,timeArea:true},
            {label:'已过期随访',key:'filter_status',value:'overdue',active:false,timeArea:true}
        ];

        $scope.checkedId = {
            'checked-all':false,
            'data':{},
            'tagGroup' :null,
            'groups':[]
        };

        // 当前实验组、带入组患者 tab 处于激活状态的 type
        $scope.currTabCheckedType = null




        $scope.checkAll = function(){
            $scope.recordList.content.forEach(function (n,i) {
                $scope.checkedId.data[n.id] = $scope.checkedId['checked-all'];
            });
        };

        $scope.importData = function(){
            for(var i in $scope.checkedId.data){
                $scope.checkedId.data[i]?$scope.checkedId.groups.push(i):'';
            };
            if($scope.checkedId.groups.length == 0) return;
            $('#modal-groups').modal('show');
        }

        $scope.importGroup = function(){
            $http({
                method:'post',
                url:SYS.url+'subject/'+$routeParams.subjectId+'/group/'+$scope.params.groupId+'/record/trans',
                data:$scope.checkedId.groups,
                params:{
                    subjectGroupId:$scope.checkedId.tagGroup
                }
            }).success(function (msg) {
                $scope.getRecordList(1,10);
                $('#modal-groups').modal('hide');
                $scope.checkedId = {
                    'checked-all':false,
                    'data':{},
                    'tagGroup' :null,
                    'groups':[]
                };
            });
        }

        $scope.getRecordList = function (pageNum,pageSize,opt) {
            opt?$scope.params['filter_group_type'] = 'auto':'';
            RecordListServices.getRecordList($scope.params,pageNum,pageSize).then(function (msg) {
                $scope.recordList = msg.page;
                $scope.recordList.number ++;

            });
        };
        ;(function init() {
            RecordListServices.getRecordGroup($routeParams.subjectId).then(function (msg) {
                $scope.recordGroup = msg.data;
                $routeParams.groupId?
                    (function () {
                        $scope.params.groupId = $routeParams.groupId;
                        msg.data.forEach(function (n,i) {
                            n.id == $scope.params.groupId?n['active'] = true:'';
                        });
                    })():
                    ($scope.params.groupId = msg.data[0].id,msg.data[0]['active'] = true);
                $scope.getRecordList(1,10);
            });
            subjectCreateService.getSubjectInfo($routeParams.subjectId).then(function (data) {
                $scope.subjectInfo = data.data.name;
            })
        })();

        $scope.showTooltip = function(){
            $("[data-toggle=tooltip]").tooltip("show");
        }
        $scope.hideTooltip = function(){
            $("[data-toggle=tooltip]").tooltip("hide");
        }

        $scope.searchInputList = function () {
            $scope.getRecordList(1,10);
        };

        $scope.choseActive = function (parent,opt) {
            $scope.currTabCheckedType = opt.type        // 更改当前激活的 tab
            !opt.active?(parent.forEach(function (n,i) {
                n.active = false;
            }),
            opt.active = true,
            opt.id?$scope.params.groupId = opt.id:'',
            opt.timeArea?$scope.params.time = opt:'',
            opt.type == 'auto'?$scope.getRecordList(1,10,opt):$scope.getRecordList(1,10)):"";
        };

        $scope.modalFlup = function (opt) {
            $scope.tarRecord = opt;
            $('#newFlup').modal('show');
        };

        $scope.addFlup = function () {
            RecordListServices.addFlup($scope.params.groupId, $scope.tarRecord.id,$scope.flupData).then(function (msg) {
                $('#newFlup').modal('hide');
                $scope.getRecordList($scope.recordList.pageable.pageNumber+1,$scope.recordList.pageable.pageSize);
            });
        };

        $scope.modalRecord = function () {
            $('#newCRF').modal('show');
        };

        $scope.newRecord = function () {
            RecordListServices.newRecord($scope.newCRFData,$scope.params.groupId).then(function (msg) {
                $('#newCRF').on('hidden.bs.modal', function (e) {
                    $scope.gotoInputPage(msg.data,msg.data.crfRecordId)
                });
                $('#newCRF').modal('hide');
            });
        };

        $scope.gotoInputPage = function (opt,recordId) {
            sessionStorage.setItem('interview',JSON.stringify(opt));
            window.location.href = '#/record-input/'+$routeParams.subjectId+'/'+$scope.params.groupId+'/'+recordId;
        };

        $scope.timePlugin = function (name,format) {
            groupServices.timePlugin(name,format);
        }
}]);

