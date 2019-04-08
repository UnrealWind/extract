
angular.module("infi-basic").controller('RecordListController',
    ['$scope','SYS','$http','$routeParams','$timeout','RecordListServices','$location','Session',
        function ($scope,SYS,$http,$routeParams,$timeout,RecordListServices,$location,Session) {

            $scope.recordList =null;

            $scope.type = 'today';
            $scope.params = {
                filter_LIKE_patientId:null,
                filter_LIKE_name:null,
                filter_EQ_status:null,
                filter_GTE_visitDate:null,
                filter_LTE_visitDate:null,
                filter_EQ_visitDeptId:null,
                filter_EQ_visitDoctorId:null
            }


            $scope.routeParams = $routeParams;
            $scope.kpi = {
                today:'',
                all:''
            };

            //kpi
            function getkpi() {
                $http({
                    method:'get',
                    url:SYS.url + 'record/today/kpi'
                }).success(function (msg) {
                    $scope.kpi.today = msg.data
                    console.log($scope.kpi.today,'today')
                });

                $http({
                    method:'get',
                    url:SYS.url + 'record/total/kpi'
                }).success(function (msg) {
                    $scope.kpi.all = msg.data
                    console.log($scope.kpi.all,'total')
                });

            };

            $scope.getRecordList = function (pageNum,pageSize) {

                var myDate = new Date();
                var year = myDate.getFullYear();
                var month = myDate.getMonth()+1;
                var date = myDate.getDate();
                var url = '';
                var data = {};
                $scope.type == 'today'?(data = {
                    filter_LIKE_name:$scope.params.filter_LIKE_name,
                    filter_LIKE_patientId:$scope.params.filter_LIKE_patientId,
                    filter_EQ_status:$scope.params.filter_EQ_status,
                    /*filter_EQ_visitDoctorId:Session.getUser().id,*/
                    filter_GTE_visitDate:year+'-'+month+'-'+date,
                    page_number:pageNum,
                    page_size:pageSize
                },url = SYS.url + 'record/page/today'):(data = {
                    filter_LIKE_name:$scope.params.filter_LIKE_name,
                    filter_LIKE_patientId:$scope.params.filter_LIKE_patientId,
                    /*filter_EQ_visitDoctorId:$scope.params.filter_EQ_visitDoctorId,*/
                    filter_GTE_visitDate:$scope.params.filter_GTE_visitDate,
                    filter_LTE_visitDate:$scope.params.filter_LTE_visitDate,
                    filter_EQ_visitDeptId:$scope.params.filter_EQ_visitDeptId,
                    page_number:pageNum,
                    page_size:pageSize/*,
                    filter_EQ_status:5*/

                },url = SYS.url + 'record/page/total')

                RecordListServices.getRecordList(url,data).then(function (msg) {
                    $scope.recordList = msg.page;
                    $scope.recordList.number ++;
                });

                getkpi();
            };

            (function init() {
                $scope.getRecordList(1,10);

                $http.get(SYS.url + 'kno/user/list').then(function (msg) {
                    msg.data.data.forEach(function (n,i) {
                        n.id = n.id.toString();
                    })
                    $scope.doctorList = msg.data.data;
                    console.log($scope.doctorList)
                });

                $http.get(SYS.url + 'kno/dept/list').then(function (msg) {
                    msg.data.data.forEach(function (n,i) {
                        n.id = n.id.toString();
                    })
                    $scope.deptList = msg.data.data;
                    console.log($scope.deptList)
                });

            })();

            $scope.changeTab = function (type) {
                $scope.type = type;
                $scope.getRecordList(1,10);
            };

            $scope.timePlugin = function(tagName,format){
                RecordListServices.timePlugin(tagName,format);
            };

            $scope.jump = function (url) {
                window.location.href = 'http://'+window.location.hostname+':'+window.location.port+'/'+url;
            }
            $scope.hostPort =  'http://'+window.location.hostname+':'+window.location.port;

            $scope.modalNewRecord = function () {
                $scope.newRecordData = {
                    patientId:'',
                    sex:'',
                    age:'',
                    name:''
                }

                $('.newRecord').modal('show');
            }

            $scope.newRecord = function () {
                $http({
                    method:'POST',
                    url:SYS.url+'/record',
                    data:$scope.newRecordData
                }).then(function (msg) {
                    var opt = msg.data.data;
                    $('.newRecord').modal('hide');
                    $('.newRecord').on('hidden.bs.modal', function () {
                        $routeParams.hideR?window.location.href = $scope.hostPort+'/record-collect-src/#/record-collect/treatment/'+opt.id+'/'+opt.xlPatientId+'/'+opt.xlVisitId+'/'+opt.patientId+'/'+opt.templateId+'/1'
                        :window.location.href = $scope.hostPort+'/record-collect-src/#/record-collect/treatment/'+opt.id+'/'+opt.xlPatientId+'/'+opt.xlVisitId+'/'+opt.patientId+'/'+opt.templateId;
                    });
                });
            }

    }]);

