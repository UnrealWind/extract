angular.module('infi-basic').
controller('diseaseList',
    ['$scope', 'SYS','DiseaseListServices','BasicServices','$routeParams',
        function ($scope, SYS,DiseaseListServices,BasicServices,$routeParams) {
            $scope.operation =
                {
                    "btns":[
                        {
                            "label":'治疗方案',
                            "type":'plan'
                        }
                    ],
                    "label":'操作'
                };

            $scope.param = {
                startTime:'',
                endTime:'',
                search:'',
                disease:{
                    'value':'100088',
                    'opt':[]
                },
                ward:{
                    'value':'',
                    'opt':[]
                },
                diagType:{
                    'value':'10003'
                }
            }

            if($routeParams.type){
                if($routeParams.type == 'pneumonia'){
                    $scope.param.disease.value = '100064'
                }else if($routeParams.type == 'copd'){
                    $scope.param.disease.value = '100059'
                }else {
                    $scope.param.disease.value = '100064'
                }
            }else {
                $scope.param.disease.value = '100064'
            }

            $scope.tableData = null;

            //获取疾病
            BasicServices.getData({
                'data':'',
                'url':SYS.url+'disease/list',
                'method':'get'
            }).then(function success(msg) {
                $scope.param.disease.opt = msg.data;
            });

            //获取病区
            BasicServices.getData({
                'data':'',
                'url':SYS.url+'disease/ward',
                'method':'get'
            }).then(function success(msg) {
                $scope.param.ward.opt = msg.data;
            });

            //获取表头
            BasicServices.getData({
                'data':'',
                'url':'../diseases-plan-src/data/diseaseList.columns.json',
                'method':'get'
            }).then(function success(msg) {
                $scope.tableColumns = msg.data;
            });

            /**
             * 页面初始化获取表格数据
             */
            var getListData = function (pageNo, pageSize) {
                DiseaseListServices.getListData(pageNo, pageSize,$scope.param).then(function success(msg) {
                    $scope.tableData = msg;
                });
            };
            getListData(1, 10);

            /**
             * 分页操作
             */
            $scope.getChange = function (page) {
                $scope.tableData = null;
                getListData(page, 10);
            };

            $scope.btnCallback = function(opt,type){
                var diseaseType = null;
                $scope.param.disease.opt.forEach(function (n,i) {
                    n.class_id == $scope.param.disease.value?diseaseType =n.name:undefined;
                })
                type == 'plan'?window.location.href='#/disease-input/'+opt.pati_id+'/'
                    +opt.pati_visit_id+'/'+$scope.param.disease.value+'/'+diseaseType
                    :undefined;
            }

            $scope.refreshList = function(){

                //使用原有表格控件在需求无线累加的情况下会越来越无法满足需求，建议之后非普通表格使用自己的表格控件即可
                $scope.param.diagType.value == '10003'?$scope.tableColumns.columns[6].label = '入院诊断':$scope.tableColumns.columns[6].label = '出院诊断';
                $scope.tableData = null;
                getListData(1,10)
            }
            //时间插件   这个不是公共的，可抽可不抽
            $scope.timePlugin = function(tagName){
                var that = this;
                $('input[name="'+tagName+'"]').datetimepicker({
                    format: 'yyyy-mm-dd',
                    language:"zh-CN",
                    minView :2,
                    autoclose: true,
                    forceParse:true,
                    todayBtn: true
                }).trigger('focus')
            }

            $scope.enterEvent = function(e) {
                var keycode = window.event?e.keyCode:e.which;
                if(keycode==13){
                    $scope.refreshList();
                }
            }

        }]);