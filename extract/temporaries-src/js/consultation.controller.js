angular.module('infi-basic').controller('ConsultationController',['$scope','DataService','$filter','SYS','DataAdapter',function ($scope,DataService,$filter,SYS,DataAdapter) {
    $scope.SYS = SYS;
    $scope.selectOptions = [{
        label:"按疾病类型",
        value:0
    },{
        label:"按疾病名称",
        value:1
    }];

    $scope.selectDisease = function (num) {
        $scope.recordData.selectedCombination = num;
        $scope.changeData();
    }

    $scope.recordData = {
        startTime : "",
        endTime:"",
        selectedCombination:sessionStorage["selectedCombination"]?sessionStorage["selectedCombination"]:'1',
        arcData:null,
        nodeData:null
    }
    $scope.options = {
        finish:false
    };

    $scope.select = {
        data:[
            {
                label:"高血压一级",
                value:'1',
                select:true,
                children:[
                    {
                        label:"高血压低危",
                        value:"1"
                    },
                    {
                        label:"高血压中危",
                        value:"2"
                    },
                    {
                        label:"高血压高危",
                        value:"3"
                    },
                    {
                        label:"高血压极高危",
                        value:"4"
                    }
                ]
            },
            {
                label:"高血压二级",
                value:'2',
                children:[
                    {
                        label:"高血压中危",
                        value:"2"
                    },
                    {
                        label:"高血压高危",
                        value:"3"
                    },
                    {
                        label:"高血压极高危",
                        value:"4"
                    }
                ]
            },
            {
                label:"高血压三级",
                value:'3',
                children:[
                    {
                        label:"高血压高危",
                        value:"3"
                    },
                    {
                        label:"高血压极高危",
                        value:"4"
                    }
                ]
            }
        ],
        tagVal:{
            hy:sessionStorage["hy"],
            lv:sessionStorage["lv"],
            startTime:'',
            endTime:'',
            combination:$scope.recordData.selectedCombination
        }
    }
    $scope.selectHyLv = function () {
        $scope.select.data.forEach(function (n,i) {
            n['select'] = false;
            n.value == $scope.select.tagVal.hy?n['select'] = true:undefined;
        });

    };
    
    function init() {
        var today = new Date();
        // var endTime = $filter('date')(today, 'yyyy-MM-dd');
        // var startTime = $filter('date')(today, 'yyyy-MM') + "-01";
        var startTime = "2017-08-01";
        var endTime = "2017-08-31";
        $scope.recordData.startTime = sessionStorage["startTime"]?sessionStorage["startTime"]:startTime;
        $scope.recordData.endTime = sessionStorage["endTime"]?sessionStorage["endTime"]:endTime;
        $scope.select.tagVal.startTime = $scope.recordData.startTime;
        $scope.select.tagVal.endTime = $scope.recordData.endTime ;
        if(!sessionStorage["hy"]){
            $scope.select.tagVal.hy = '';
            $scope.select.tagVal.lv = '';
        }
        drawChart();
    }
    
    $scope.changeData = function () {
        sessionStorage["startTime"] = $scope.recordData.startTime;
        sessionStorage["endTime"] = $scope.recordData.endTime;
        sessionStorage["selectedCombination"] = $scope.recordData.selectedCombination;
        sessionStorage["hy"] = $scope.select.tagVal.hy;
        sessionStorage["lv"] = $scope.select.tagVal.lv;

        sessionStorage["num"] = sessionStorage["num"]?++sessionStorage["num"]:1;
        window.location.href = "#/consultations/"+sessionStorage["num"];
    }
    
    function drawChart() {
       DataService.getDepartmentName($scope.select).then(function (msg) {
            if(msg.status == SYS.STATUS_SUCCESS&&msg.data.result.length>0){
                DataAdapter.setCategory($scope.options,msg.data.result);
                DataAdapter.executeCallBack($scope.options);

                DataService.getCombinationData($scope.select).then(function (msg) {
                    console.log(msg)
                    if(msg.status == SYS.STATUS_SUCCESS&&msg.data.result.length>0){
                        DataAdapter.setTotalAnalysis($scope.options,msg.data.result);
                        DataAdapter.executeCallBack($scope.options);

                        DataService.getArcAnalysisData($scope.select).then(function (msg) {
                            if(msg.status == SYS.STATUS_SUCCESS&&msg.data.result.length>0){
                                $scope.options.arcs = msg.data.result;
                                DataAdapter.setArcsSum($scope.options);
                                DataAdapter.executeCallBack($scope.options);
                            }
                        });

                        DataService.getNodeAnalysisData($scope.select).then(function (msg) {
                            if(msg.status == SYS.STATUS_SUCCESS&&msg.data.result.length>0){
                                $scope.options.nodes = msg.data.result;
                                DataAdapter.setNodesId($scope.options);
                                DataAdapter.executeCallBack($scope.options);
                            }
                        });
                    }else {
                        $scope.options.finish = 'error';
                    }
                });
            }
        });
    }

    $scope.serach = function () {
        drawChart();
    }
    init();
}]);