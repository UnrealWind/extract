
angular.module("infi-basic").controller('RecordCheckListController',
    ['$scope','SYS','$http','$routeParams','$timeout','RecordListServices','$location','Session', 'Utils',
        function ($scope,SYS,$http,$routeParams,$timeout,RecordListServices,$location,Session, Utils) {

            $scope.recordList =null;

            $scope.type = 'today';
            $scope.params = {
                filter_patientId:null,
                filter_name:null,
                filter_flag:null,
                filter_examKid:null,
                filter_reportDateMin:null,
                filter_reportDateMax:null,

                filter_requestDeptId:null,
                filter_requestDoctorId:null,
                filter_reportDoctorId:null
            }

            $scope.kpi = {
                today:'',
                all:''
            };

            //kpi
            function getkpi() {
                $http({
                    method:'get',
                    url:SYS.prescriptUrl + 'exam/today/kpi'
                }).success(function (msg) {
                    $scope.kpi.today = msg.data
                    console.log($scope.kpi.today,'today')
                });

                $http({
                    method:'get',
                    url:SYS.prescriptUrl + 'exam/total/kpi'
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

                var data = {};
                var url = '';
                $scope.type == 'today'?(data = {
                    filter_patientId:$scope.params.filter_patientId,
                    filter_name:$scope.params.filter_name,
                    filter_flag:$scope.params.filter_flag,
                    filter_examKid:$scope.params.filter_examKid,
                    filter_requestDate:year+'-'+month+'-'+date,
                    page_number:pageNum,
                    page_size:pageSize
                },url = SYS.prescriptUrl+'exam/page/today'):(data = {
                    filter_patientId:$scope.params.filter_patientId,
                    filter_name:$scope.params.filter_name,

                    filter_reportDateMin:$scope.params.filter_reportDateMin,
                    filter_reportDateMax:$scope.params.filter_reportDateMax,
                    filter_flag:'finish',
                    filter_examKid:$scope.params.filter_examKid,

                    filter_requestDeptId:$scope.params.filter_requestDeptId,
                    filter_requestDoctorId:$scope.params.filter_requestDoctorId,
                    filter_reportDoctorId:$scope.params.filter_reportDoctorId,

                    page_number:pageNum,
                    page_size:pageSize
                },url = SYS.prescriptUrl+'exam/page/total');


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


            // 检查项目搜索相关
            $scope.searchAbout = {
                kw: '',
                rst: [],
                currState: 'init',
                stateMachine: {                                     // 搜索框的状态机
                    'init': {
                        search: 'searching'
                    },
                    'searching': {
                        success: 'showRst',
                        failure: 'showErr',
                        search: 'searching'
                    },
                    'showRst': {
                        research: 'init'
                    },
                    'showErr': {
                        research: 'init'
                    }
                },
                search: Utils.debounce(function() {               // 搜索主函数
                    $scope.searchAbout.changeState('search');

                    // 这里当满足这个条件的时候就是用户清空了input 的时候呀，所以进行查询即可，但是查询前需要吧examKid置空
                    !$scope.searchAbout.kw && $scope.params.filter_examKid ?($scope.params.filter_examKid =null,$scope.getRecordList(1,10)):''
                    $http.get(`${SYS.prescriptUrl}dm/type/exam/search?filter_LIKE_searchName=${$scope.searchAbout.kw}`).then(function(msg) {
                        if(msg.data.status == 'ok') {
                            $scope.searchAbout.changeState('success')
                            $scope.searchAbout.rst = msg.data.data
                        } else if(msg.data.status == 'blank') {
                            $scope.searchAbout.changeState('success')
                            $scope.searchAbout.rst = []
                        } else {
                            $scope.searchAbout.changeState('failure')
                            $scope.searchAbout.rst = []
                        }
                    }, function(error) {
                        $scope.searchAbout.changeState('failure')
                        $scope.searchAbout.rst = []
                    })
                }, 500),
                changeState: function(name) {                       // 修改状态
                    var state = $scope.searchAbout.currState

                    if($scope.searchAbout.stateMachine[state][name]) {
                        $scope.searchAbout.currState = $scope.searchAbout.stateMachine[state][name]
                    }
                    console.log(`${state} + ${name} --> ${$scope.searchAbout.currState}`)
                }
            }

            $scope.clickToSearch = function(e) {
                e.stopPropagation()
                if($scope.searchAbout.currState == 'init') {
                    $scope.searchAbout.search($scope.searchAbout.kw)
                }
            }

            $scope.clearInput = function() {
                $scope.searchAbout.rst = []
                $scope.searchAbout.currState ='init'
            }

            $scope.$on('clickOutside', function(param) {
                if($scope.searchAbout.currState != 'init') {
                    $scope.clearInput()
                    $scope.$apply()
                }
            })

            /**
             * 选择结果某一项
             */
            $scope.selectData = function(rstitem) {
                $scope.searchAbout.kw = rstitem.name                // 回显到输入框
                $scope.params.filter_examKid = rstitem.kid          // 赋值给查询接口所需的参数
                $scope.getRecordList(1,10)                          // 调用分页查询方法，刷新下方列表
                $scope.clearInput()                                 // 收起搜索结果列表
            };


    }]);

