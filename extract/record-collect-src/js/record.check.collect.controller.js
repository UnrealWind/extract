
angular.module("infi-basic").controller('RecordCheckCollectController',
    ['$scope','SYS','$http','$routeParams','$timeout','RecordListServices',
        function ($scope,SYS,$http,$routeParams,$timeout,RecordListServices) {
        $scope.value = {
            weight:null,
            height:null,
            BMI:null,
            KPA:null,
            DBM:null
        };


        function bindData (){
            $scope.listData.results.forEach(function (n,i) {
                switch (n.name) {
                    case '身高': $scope.value.height=n.value ;break;
                    case '体重': $scope.value.weight = n.value;break;
                    case 'BMI': $scope.value.BMI = n.value ;break;
                    case '肝脏硬度（KPA）-中位数': $scope.value.KPA = n.value;break;
                    case '脂肪衰减（db/m)-中位数': $scope.value.DBM = n.value ;break;
                }
            });

            $scope.listData.results.length==3?(function () {
                $scope.listData.results.forEach(function (n,i) {
                    switch (i+1) {
                        case 1: n.line = 15;break;
                        case 2: n.line = 5;break;
                        case 3: n.line = 1;break;
                    }
                });
            })():'';
        };

        $scope.isView = $routeParams.view;

        (function init(){
            $http.get(SYS.prescriptUrl + 'exam/'+$routeParams.id).success(function (msg) {
                $scope.listData = msg.data;
                console.log($scope.listData)
                bindData();
            });
        })();

        $scope.doBMI = function () {
            $scope.value.weight && $scope.value.height?
                $scope.value.BMI = $scope.value.weight/Math.pow($scope.value.height/100,2):'';
                $scope.value.BMI = $scope.value.BMI.toFixed(1);
        };

        $scope.save = function () {

            $scope.listData.results.length==5?(function () {
                $scope.listData.results.forEach(function (n,i) {
                    switch (n.name) {
                        case '身高': n.value = $scope.value.height;break;
                        case '体重': n.value = $scope.value.weight;break;
                        case 'BMI': n.value = $scope.value.BMI;break;
                        case '肝脏硬度（KPA）-中位数': n.value = $scope.value.KPA;break;
                        case '脂肪衰减（db/m)-中位数': n.value = $scope.value.DBM;break;
                    }
                });
            })():'';

            $http({
                method:'put',
                url:SYS.prescriptUrl + 'exam/'+$routeParams.id,
                data:$scope.listData
            }).success(function (msg) {
                window.location.href = '#/record-check-list';
            });
        };

        $scope.getPreData = function (opt) {
            $http({
                method:'get',
                url:SYS.prescriptUrl + 'exam/last/time/'+opt.xlPatientId+'/'+opt.examKid
            }).success(function (msg) {
                msg.data?$scope.listData.results = msg.data:$('.tip').modal('show');
                bindData();
            });
        };


    }]);

