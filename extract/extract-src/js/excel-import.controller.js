angular.module('infi-basic')
    .controller('ExcelImportController', ['$scope','TaskService','SYS','Utils','Upload','TaskMapping','$location','$routeParams','Session',function ($scope,TaskService,SYS,Utils,Upload,TaskMapping,$location,$routeParams,Session) {
        $scope.step = 1;
        $scope.SYS = SYS;
        //盛放上传的文件的信息
        $scope.file = {
            fileType:{  //选择筛选用户群导入方式
                data:[{
                    label:"门诊号+入院次数",
                    value:0,
                    content:[{
                        label:"门诊号",   //用于选择方式的显示
                        value:"patiIdColumnNum",  //唯一标识
                        $selected:true  //选中后td加背景色
                    },{
                        label:"入院次数",
                        value:"patiVisitIdColumnNum",
                        $selected:true
                    }]
                },{
                    label:"门诊号+时间",
                    value:1,
                    content:[{
                        label:"门诊号",
                        value:"patiIdColumnNum",
                        $selected:true
                    },{
                        label:"时间",
                        value:"timePointColumnNum",
                        $selected:true
                    }]
                },{
                    label:"门诊号",
                    value:2,
                    content:[{
                        label:"门诊号",
                        value:"patiIdColumnNum",
                        $selected:true
                    }]
                }],
                checked:{
                    label:"门诊号+入院次数",
                    value:0,
                    content:[{
                        label:"门诊号",
                        value:"patiIdColumnNum",
                        $selected:true
                    },{
                        label:"入院次数",
                        value:"patiVisitIdColumnNum",
                        $selected:true
                    }]
                }  //盛放选中的类型
            },
            detail:{},  //上传文件详情
            list:[],  //后台返回的文件的内容列表
            recordData:{}  //后台返回的所有内容
        };  //盛放上传的文件的信息

        $scope.groupData = {
            id:$routeParams.id,
            number:"",  //病例数
            chartData:null,  //用于盛放绘圆形和地域图的数据
            uploadDetail:null,  //上传详情数据,暂时没有用到
            unExportData:null   //无法导出病例清单
        }
        //文件上传‘浏览’的一下列操作
        $scope.onFileSelect = function ($file) {
            if($file.length > 0){
                $scope.file.detail = $file[0];
                Upload.upload({
                    url: SYS.url+'import/show/'+$scope.groupData.id,
                    method: 'POST',
                    file: $file[0]
                }).then(function (msg){
                    if(msg.data.status == $scope.SYS.STATUS_SUCCESS){
                        $("#excelExport").modal({backdrop:'static'});
                        $scope.file.recordData = msg.data.data;
                        $scope.file.list = [];   //将list清空,否则数据重复
                        if(msg.data.data){
                            var uploadedExcel = msg.data.data.uploadedExcel,
                                list = uploadedExcel.showFiveMessages?JSON.parse(uploadedExcel.showFiveMessages):[];
                            //后台传递的数据不能ng-repeat,需要做一些转化
                            for(var i=0;i<list.length;i++){
                                var content = [];
                                for(var t=0;t<list[i].length;t++){
                                    content.push({label:list[i][t]})
                                }
                                $scope.file.list.push(content);
                            }
                        }

                    }else{
                        Utils.sysTip($scope,msg.data);
                    }
                });
            }else{
                Utils.sysTip($scope,$scope.file);
            }
        }

        //选择的用户群导入方式
        $scope.selectFileType = function (type) {
            $scope.file.fileType.checked = type;
            //导入方式变化时,循环表头数据,如果开始选择了某种方式,此次重新选择的内容不包含上次的方式,则将选择清空
            angular.forEach($scope.file.list[0],function(list){
                if(list.content&&type.label.indexOf(list.content.label) < 0){
                    list.content = {};
                }
            });
        }

        /**
         * 确认导入
         */
        $scope.confirmImport = function () {
            $scope.file.recordData.uploadedExcel.type = $scope.file.fileType.checked.value;  //将选择的类型放入到传递后台的数据中
            angular.forEach($scope.file.list[0],function(list,index){
                if(list.content&&list.content.label){
                    $scope.file.recordData.uploadedExcel[list.content.value] = index; //将选择的具体类型所在的index放入到传递后台的数据中
                }
            });
            TaskService.importFile($scope.file.recordData).then(function (msg) {
                if(msg.status == $scope.SYS.STATUS_SUCCESS){
                    $("#excelExport").modal('hide');
                    debugger
                    $scope.failedDatas = {
                        data: JSON.parse(msg.data.uploadedExcel.previewJson)
                    }

                    $scope.groupData.number = msg.data.paresBuckets&&msg.data.paresBuckets.number?msg.data.paresBuckets.number:0;//病例数赋值
                    $scope.groupData.chartData = msg.data.paresBuckets?TaskMapping.chartMapping(msg.data.paresBuckets):null;
                    msg.data.uploadedExcel?TaskMapping.uploadMapping(msg.data.uploadedExcel):$("#infi-opt-gh").text('未查询到数据');
                }else{
                    Utils.sysTip($scope,msg);
                }
            });
        }

        /**
         * 通过excel表头,选择导入方式
         * @param index
         */
        $scope.selectExportType = function (index,listSelect) {
            angular.forEach($scope.file.list[0],function(list){
                list.$selected = false;
            });
            listSelect.$selected = true;
        }

        /**
         * 选择具体的类型,如门诊号\时间等
         * @param content
         * @param title
         */
        $scope.selectTypeDetail = function (content,title) {
            angular.forEach($scope.file.list[0],function(list){
                if(list.content&&list.content.label==content.label){
                    list.content = {};
                }
            });
            title.content = content;
        }

        /**
         * 导出无效病例
         */
        $scope.export_failed =function() {
            var groupId = $routeParams.id
            TaskService.export_failed(groupId)
        }

        /**
         * 点击空白处，弹框依次关闭
         */
        $(document).click(function (event) {
            //浏览器兼容性
            var e = event || window.event;
            var elem = e.target || e.srcElement;
            var isHide = $(elem).hasClass('hide-popup') || $(elem).parent('td').hasClass('hide-popup')
            if(!isHide){
                angular.forEach($scope.file.list[0],function(list){
                    list.$selected = false;
                });
                $scope.$apply();
            }
        });
    }]);