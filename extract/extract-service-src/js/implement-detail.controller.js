angular.module('infi-basic')
    .controller('ImplementDetailController', ['$scope','TaskService','SYS','$location','Utils','ViewMapping','$routeParams',function ($scope,TaskService,SYS,$location,Utils,ViewMapping,$routeParams) {
        $scope.SYS = SYS;
        $scope.id = $routeParams.id;
        $scope.columns = [];  //表头数据
        $scope.content = [];  //内容数据
        $scope.opts = {
            label:"操作",
            btns:[{
                label:"个人详情",
                type:"view"
            }]
        };

        function init() {
            TaskService.getColumn('implement-detail').then(function (msg) {
                $scope.columns = msg.data;
            })
            $scope.changePage(SYS.DEFAULT_PAGE_NUMBER);
        }

        $scope.changePage = function (pageNo) {
            TaskService.getListData("hitList/check/"+$scope.id+"?",pageNo,SYS.DEFAULT_PAGE_SIZE).then(function (msg) {
                $scope.content = msg;
            });
        }

        $scope.pageOperation = function (entity,type) {
            if(type == "view"){
                //跳转到record-src/html/301/overview.outpatient.html页面,不需要返回按钮,右侧列表切换
                var path = 'http://'+window.location.hostname+':'+window.location.port;
                window.open(path + '/' + 'record-src/#/301/overview/outpatient/'+entity.xlPatientId+'/'
                    +entity.xlMedicalId+'/'+entity.patiId);
            }
        }
        init();
    }]);