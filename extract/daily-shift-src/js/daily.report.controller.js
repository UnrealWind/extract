angular.module("infi-basic").controller('dailyReportController', ['$scope','SYS','$http','$routeParams','$timeout','BasicService','$filter',
    function ($scope,SYS,$http,$routeParams,$timeout,BasicService,$filter) {

        function init(){
            $scope.overallData = [];
            $scope.patientData = [];
            $scope.soliderData = [];
            $scope.specialData = [];
            $scope.consultationData = [];
        };
        init();
        //录入人
        $scope.enterPerson = {};
        $http.get('./data/daily.report.columns.json').success(function (msg) {
            $scope.overall = msg.overall;
            $scope.patient = msg.patient;
            $scope.solider = msg.solider;
            $scope.special = msg.special;
            $scope.consultation = msg.consultation;
            $scope.staticData = msg.staticData;

        });

        //拿到所有table数据在分别给四个赋值
        function getTableList(){
            init();
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
        //格式化今明两天的时间
        $scope.staticDate =  $filter('date')(new Date() ,'yyyy-MM-dd');
        // $scope.nextDate =  $filter('date')(new Date() + 24*3600*1000,'yyyy-MM-dd');
        //分页
        $scope.updateFormatPageAttend = function(number){
            $scope.getFormatDateList(number,10);
        };
        $scope.updateHistoryPageAttend = function(number){
            $scope.getHistoryDateList(number,10);
        };
        //获取时间列表
        $scope.getFormatDateList = function(number,size){
            BasicService.getDateList(number,size).then(function (data) {
                if(data.status == SYS.STATUS_SUCCESS){
                    $scope.formatDateList = data.page.content;
                    $scope.formatDatePage = data.page;
                    $scope.formatDatePage.number ++;
                }
            });
        };
        $scope.getHistoryDateList = function(number,size){
            BasicService.getDateList(number,size).then(function (data) {
                if(data.status == SYS.STATUS_SUCCESS){
                    $scope.historyDateList = data.page.content;
                    $scope.historyDatePage = data.page;
                    $scope.historyDatePage.number ++;
                }
            });
        };

        ;(function () {
            //获取用户权限
            BasicService.getUserPermission().then(function (data) {
                if(data.status == 'ok'){
                    $scope.premission = data.data.enname;
                    if($scope.premission == 'admin'){
                        BasicService.getWardsList().then(function (data) {
                            data.status == 'ok'?function(){
                                $scope.wards = data.data;
                                $scope.wardId = $scope.wards[0]["value"];
                                BasicService.getCountModel($scope.staticDate,$scope.wardId).then(function (data) {
                                    if(data.status == 'ok'){
                                        $scope.modleList = data.data;
                                        data.data.forEach(function (n,i) {
                                            n.fieldName == '录入人'?$scope.enterPerson = n:'';
                                            n.fieldName == '所属科室'?$scope.selfDept = n.value:'';
                                        });
                                        $scope.enterPerson.value == '' || $scope.enterPerson.value == null? $scope.enterPerson.value = $scope.name:'';
                                    }

                                });
                                BasicService.getTableModel($scope.staticDate,$scope.wardId).then(function (data) {
                                    if(data.status == 'ok'){
                                        $scope.tableData = data.data;
                                        getTableList();
                                    }
                                });
                            }():'';
                        });
                    }else {
                        BasicService.getCountModel($scope.staticDate,$scope.wardId).then(function (data) {
                            if(data.status == 'ok'){
                                $scope.modleList = data.data;
                                data.data.forEach(function (n,i) {
                                    n.fieldName == '录入人'?$scope.enterPerson = n:'';
                                    n.fieldName == '所属科室'?$scope.selfDept = n.value:'';
                                });
                                $scope.enterPerson.value == '' || $scope.enterPerson.value == null? $scope.enterPerson.value = $scope.name:'';
                            }

                        });
                        BasicService.getTableModel($scope.staticDate,$scope.wardId).then(function (data) {
                            if(data.status == 'ok'){
                                $scope.tableData = data.data;
                                getTableList();
                            }
                        });
                    }
                }
            });
            $scope.getFormatDateList(1,10);
            $scope.getHistoryDateList(1,10);
        })();
        //筛选病区获取数据
        $scope.changeData = function(wardId){
            BasicService.getCountModel($scope.staticDate,wardId).then(function (data) {
                if(data.status == 'ok'){
                    $scope.modleList = data.data;
                    data.data.forEach(function (n,i) {
                        n.fieldName == '录入人'?$scope.enterPerson = n:'';
                        n.fieldName == '所属科室'?$scope.selfDept = n.value:'';
                    });
                    $scope.enterPerson.value == '' || $scope.enterPerson.value == null? $scope.enterPerson.value = $scope.name:'';
                }

            });
            BasicService.getTableModel($scope.staticDate,wardId).then(function (data) {
                if(data.status == 'ok'){
                    $scope.tableData = data.data;
                    getTableList();
                }else {
                    init();
                }
            });
        };
        //给下拉框默认值（拿回来的数据有值）
        $scope.$on('renderOverHistory',function () {
            $scope.patientData.forEach(function (n,i) {
                var $dieaseLevel = $('#patient').children().eq(i).children('.dieaseLevel').children(),
                    $identity = $('#patient').children().eq(i).children('.identity').children();
                for(var key in n){
                    key == 'dieaseLevel'?$dieaseLevel.val(n[key]):'';
                    key == 'identity'?$identity.val(n[key]):'';
                }
            });
            $scope.consultationData.forEach(function (n,i) {
                var $dieaseLevel = $('#consultation').children().eq(i).children('.dieaseLevel').children(),
                    $identity = $('#consultation').children().eq(i).children('.identity').children();
                for(var key in n){
                    key == 'dieaseLevel'?$dieaseLevel.val(n[key]):'';
                    key == 'identity'?$identity.val(n[key]):'';
                }
            });
        });

        //保存数据
        $scope.saveModel = function(){
            var modelData = [], $model = $('#model');
            for(var i = 0, modelLength = $('.model-length').length;i < modelLength; i++){
                var $node = $model.children().eq(i).children(".row");
                modelData.push({
                    "fieldName": $node.children('p').html(),
                    "value": $node.children('input').val(),
                    "fieldId": $node.children('em').eq(0).html(),
                    "date": $node.children('em').eq(1).html(),
                    "wardId":$node.children('em').eq(2).html(),
                    "id": $node.children('em').eq(3).html(),
                    "creator": $node.children('em').eq(4).html(),
                    "createTime": $node.children('em').eq(5).html(),
                })
            }
            modelData.push($scope.enterPerson);
            //保存上方数据
            BasicService.saveCountModel($scope.staticDate,modelData).then(function (msg) {
                if(msg.status == 'ok'){
                    $('#general-prompt').modal();
                    $scope.promptMainContent = '保存成功';
                }
            });
            //保存下方数据
            var overall=[],patient=[],solider=[],special=[], consultation = [],
                $overall = $('#overall'),$patient = $('#patient'),
                $solider = $('#solider'),$special = $('#special'), $consultation = $('#consultation');
            for(var i=0,Length = $overall.children().length;i<Length;i++){
                var $node = $overall.children().eq(i);
                overall.push({
                    "deptName": $node.children().eq(0).children().val(),
                    "bed": $node.children().eq(1).children().val(),
                    "name": $node.children().eq(2).children().val(),
                    "sex": $node.children().eq(3).children().val(),
                    "age": $node.children().eq(4).children().val(),
                    "isCrri": $node.children().eq(5).children().val(),
                    "diagDisposal": $node.children().eq(6).children().val(),
                    "operItem": $node.children().eq(7).children().val(),
                    "opertor": $node.children().eq(8).children().val(),
                    "id": $node.children().eq(9).children().val(),
                    "createTime": $node.children().eq(10).children().val(),
                    "creator": $node.children().eq(11).children().val(),
                    "tableType":"4",
                    "date": $scope.staticDate
                });
            }
            for(var i=0,Length = $patient.children().length;i<Length;i++){
                var $node = $patient.children().eq(i);
                patient.push({
                    "dieaseLevel": $node.children().eq(0).children().val(),
                    "deptName": $node.children().eq(1).children().val(),
                    "bed": $node.children().eq(2).children().val(),
                    "name": $node.children().eq(3).children().val(),
                    "sex": $node.children().eq(4).children().val(),
                    "age": $node.children().eq(5).children().val(),
                    "identity": $node.children().eq(6).children().val(),
                    "diagDisposal": $node.children().eq(7).children().val(),
                    "operItem": $node.children().eq(8).children().val(),
                    "opertor": $node.children().eq(9).children().val(),
                    "id": $node.children().eq(10).children().val(),
                    "createTime": $node.children().eq(11).children().val(),
                    "creator": $node.children().eq(12).children().val(),
                    "orderDate": $node.children().eq(13).children().val(),
                    "tableType":"1",
                    "date": $scope.staticDate
                })
            }
            for(var i=0,Length = $solider.children().length;i<Length;i++){
                var $node = $solider.children().eq(i);
                solider.push({
                    "deptName": $node.children().eq(0).children().val(),
                    "bed": $node.children().eq(1).children().val(),
                    "name": $node.children().eq(2).children().val(),
                    "sex": $node.children().eq(3).children().val(),
                    "age": $node.children().eq(4).children().val(),
                    "identity": $node.children().eq(5).children().val(),
                    "diagDisposal": $node.children().eq(6).children().val(),
                    "specialDisposal": $node.children().eq(7).children().val(),
                    "operItem": $node.children().eq(8).children().val(),
                    "opertor": $node.children().eq(9).children().val(),
                    "id": $node.children().eq(10).children().val(),
                    "createTime": $node.children().eq(11).children().val(),
                    "creator": $node.children().eq(12).children().val(),
                    "tableType":"2",
                    "date": $scope.staticDate
                })
            }
            for(var i=0,Length = $special.children().length;i<Length;i++){
                var $node = $special.children().eq(i);
                special.push({
                    "deptName": $node.children().eq(0).children().val(),
                    "bed": $node.children().eq(1).children().val(),
                    "name": $node.children().eq(2).children().val(),
                    "sex": $node.children().eq(3).children().val(),
                    "age": $node.children().eq(4).children().val(),
                    "diagDisposal": $node.children().eq(5).children().val(),
                    "operItem": $node.children().eq(6).children().val(),
                    "opertor": $node.children().eq(7).children().val(),
                    "id": $node.children().eq(8).children().val(),
                    "createTime": $node.children().eq(9).children().val(),
                    "creator": $node.children().eq(10).children().val(),
                    "tableType":"3",
                    "date": $scope.staticDate
                })
            }
            for(var i=0,Length = $consultation.children().length;i<Length;i++){
                var $node = $consultation.children().eq(i);
                consultation.push({
                    "dieaseLevel": $node.children().eq(0).children().val(),
                    "deptName": $node.children().eq(1).children().val(),
                    "bed": $node.children().eq(2).children().val(),
                    "name": $node.children().eq(3).children().val(),
                    "sex": $node.children().eq(4).children().val(),
                    "age": $node.children().eq(5).children().val(),
                    "identity": $node.children().eq(6).children().val(),
                    "diagDisposal": $node.children().eq(7).children().val(),
                    "operItem": $node.children().eq(8).children().val(),
                    "opertor": $node.children().eq(9).children().val(),
                    "id": $node.children().eq(10).children().val(),
                    "createTime": $node.children().eq(11).children().val(),
                    "creator": $node.children().eq(12).children().val(),
                    "tableType":"5",
                    "date": $scope.staticDate
                })
            }
            var allDate = overall.concat(patient,solider,special,consultation),temp=[];
            allDate.forEach(function (n,i) {
                var lock = false;
                for(var key in n){
                    if(key!='tableType' && key!='dieaseLevel' && key!='deptName' && key!='identity' && n[key] != ''){
                        lock = true;
                        break;
                    }
                }
                lock?temp.push(n):'';
            });
            BasicService.saveTableModel($scope.staticDate,temp).then(function (msg) {
                if(msg.status == 'ok'){
                    $('#general-prompt').modal();
                    $scope.promptMainContent = '保存成功';
                }
            });

        }
        //添加一条数据
        $scope.addData = function(type){
            //给科室默认值
            $scope.staticData[type-1]["deptName"] = $scope.selfDept;
            type == 4 ? $scope.overallData.push($scope.staticData[type-1]):'';
            type == 1 ? $scope.patientData.push($scope.staticData[type-1]):'';
            type == 2 ? $scope.soliderData.push($scope.staticData[type-1]):'';
            type == 3 ? $scope.specialData.push($scope.staticData[type-1]):'';
            type == 5 ? $scope.consultationData.push($scope.staticData[type-1]):'';
        }
        //删除一条数据
        $scope.deleteData = function(type){
            type == 4 ? function () {
                if($scope.overallData[$scope.overallData.length-1]["id"] != ''){
                    BasicService.deleteTableModel($scope.overallData[$scope.overallData.length-1]["id"]);
                }
                $scope.overallData.splice(-1,1);
            }():'';
            type == 1 ? function () {
                if($scope.patientData[$scope.patientData.length-1]["id"] != ''){
                    BasicService.deleteTableModel($scope.patientData[$scope.patientData.length-1]["id"])
                }
                $scope.patientData.splice(-1,1);
            }():'';
            type == 2 ? function () {
                if($scope.soliderData[$scope.soliderData.length-1]["id"] != ''){
                    BasicService.deleteTableModel($scope.soliderData[$scope.soliderData.length-1]["id"]);
                }
                $scope.soliderData.splice(-1,1);
            }():'';
            type == 3 ? function () {
                if($scope.specialData[$scope.specialData.length-1]["id"] != ''){
                    BasicService.deleteTableModel($scope.specialData[$scope.specialData.length-1]["id"]);
                }
                $scope.specialData.splice(-1,1);
            }():'';
            type == 5 ? function () {
                if($scope.consultationData[$scope.consultationData.length-1]["id"] != ''){
                    BasicService.deleteTableModel($scope.consultationData[$scope.consultationData.length-1]["id"]);
                }
                $scope.consultationData.splice(-1,1);
            }():'';
        }
        $scope.goSecondFormat = function (date) {
            $scope.premission != 'nurse'?location.href = '#/second-format/' + date:'';
        }

        $scope.goReportView = function (date) {
            $scope.premission == 'admin' ? location.href = '#/report-view/' + date +'/'+ $scope.wardId : location.href = '#/report-view/' + date+'/'+ null;

        }
        $scope.goStatisticsPage = function () {
            location.href = '#/module-statistics';
        }
        $scope.modalHide = function () {
            $('#general-prompt').modal('hide');
            window.location.reload()
        }
        
        $scope.backTop = function () {
            $('.infi-main').scrollTop(0);
        }
        //新建交办单 后期可能要用先注释
        // $scope.newReport = function () {
        //     BasicService.getCountModel($scope.nextDate).then(function (data) {
        //         if(data.status == 'ok'){
        //             $scope.modleList = data.data;
        //             data.data.forEach(function (n,i) {
        //                 n.fieldName == '录入人'?$scope.enterPerson = n:'';
        //                 n.fieldName == '所属科室'?$scope.selfDept = n.value:'';
        //             });
        //             $scope.enterPerson.value == '' || $scope.enterPerson.value == null? $scope.enterPerson.value = $scope.name:'';
        //         }
        //
        //     });
        // }
}]);

