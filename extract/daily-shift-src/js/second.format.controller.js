angular.module("infi-basic").controller('secondFormatController', ['$scope','SYS','$http','$routeParams','$timeout','BasicService',
    function ($scope,SYS,$http,$routeParams,$timeout,BasicService) {

        $scope.overallData = [];
        $scope.patientData = [];
        $scope.soliderData = [];
        $scope.specialData = [];
        $scope.consultationData = [];

        //表头时间
        $scope.year = $routeParams.date.split('-')[0];
        $scope.month = $routeParams.date.split('-')[1];
        $scope.day = $routeParams.date.split('-')[2];

        $http.get('./data/daily.report.columns.json').success(function (msg) {
            $scope.overall = msg.overall;
            $scope.patient = msg.patient;
            $scope.solider = msg.solider;
            $scope.special = msg.special;
            $scope.consultation = msg.consultation;
            $scope.situation = msg.situation;
        });
        BasicService.getFormatOverAll($routeParams.date).then(function (data) {
            if(data.status == 'ok'){
                $scope.allDept = [];
                $scope.selfDept = [];
                data.data.length > 1 ? function () {
                    $scope.selfDept.push(data.data[data.data.length-1]);
                    $scope.allDept = angular.copy(data.data.slice(0,-1));
                    $scope.allDeptLength = $scope.allDept.length;
                }() : function () {
                    $scope.selfDept.push(data.data[data.data.length-1]);
                }();

            }
        });
        function getTableList(){
            $scope.tableData.forEach(function (n,i) {
                if(n.tableType == '1'){
                    $scope.patientData.push(n);
                }else if(n.tableType == '2'){
                    $scope.soliderData.push(n);
                }else if(n.tableType == '3'){
                    $scope.specialData.push(n);
                }else if(n.tableType == '4'){
                    $scope.overallData.push(n);
                }else if(n.tableType == '5'){
                    $scope.consultationData.push(n);
                }
            });
        }
        BasicService.getTableModel($routeParams.date).then(function (data) {
            if(data.status == 'ok'){
                $scope.tableData = data.data;
                getTableList();
            }
        });

        //打印
        $scope.print = function () {
            $('#print').print();
        };
        $scope.goBack = function () {
            location.href = '#/daily-report';
        };
    }]);