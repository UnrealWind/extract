angular.module('infi-basic').controller('ConsultationInput', ['$scope','consultationInputServices','Upload','FileService','SYS','$routeParams','consultationDetailServices','$filter','Utils','Session',
    function ($scope,consultationInputServices,Upload,FileService,SYS,$routeParams,consultationDetailServices,$filter,Utils,Session){

    //存储表单数据
    $scope.currentData = null;

    $scope.plugin = consultationInputServices.pluginControl($routeParams.plugin);

    $scope.routeParams = $routeParams;
    //当前登录人
    $scope.user = Session.getUser();

    //无奈之举。用于区分不同url
    $scope.remote = true;

    //用户每次填写的意见反馈
    $scope.data = {
        'tagOptions':'',
        'tagReport':'',
        'tagReportSupplement':''
    };

    //用户获取的意见反馈列表
    $scope.opinion = [];

    //用户获取的报告列表
    $scope.report = [];

    //用户获取的报告列表
    $scope.reportSupplement = [];
    //会诊邀请按钮是否显示
    $scope.requestBtn = true;



    //直接加载json数据以生成表单
    (function getLocalJson(){

        //这个数据是前提数据，是必须要进行提前加载的，所以同步加载了这个json先
        $.ajax({
            url:'../teleconsultation-src/data/consultation.inputData.json',
            data:'',
            type:'get',
            async:false,
            success:function(msg){
                var dd =new Date();
                $scope.currentData = msg.data;
                //给会诊时间默认后一天的当前时间
                $scope.currentData.version[0].children[0].value = $filter('date')(dd.setDate(dd.getDate()+1),"yyyy-MM-dd hh:mm");
            }
        })

        var ArrLocalData = [
            {
                "url":SYS.url+'consultation/'+$routeParams.recordId,
                "label":'details'
            }
        ];

        //当url中plugin部分包含init的时候证明进入的是录入页面
        $routeParams.plugin.indexOf('init')<0 ? ArrLocalData.push(
        {
            "url":'../teleconsultation-src/data/consultation.header.json',
            "label":'headerData'
        },
        {
            "url": SYS.url+'doctor/list',
            "label":'tableData',
            "data":{'filter_EQ_consultationId':$routeParams.recordId,"filter_pageNo":0,"filter_pageSize":5}
        },
        {
            "url": SYS.url+'doc/list',
            "label":'opinion',
            "data":{'consultationId':$routeParams.recordId}
        },
        {
            "url": SYS.url+'doctor/list',
            "label":'report',
            "data":{'consultationId':$routeParams.recordId}
        },
        // {
        //     "url": SYS.url+'doc/list',
        //     "label":'reportSupplement',
        //     "data":{'consultationId':$routeParams.recordId,'docId':$routeParams.docId}
        // },
        {
            "url": SYS.url+'consultation/role',
            "label":'role',
            "data":{'consultationId':$routeParams.recordId}
        }):undefined;

        ArrLocalData.forEach(function(n,i){
            getData(n);
        })

    })();

    function getData(data){
        consultationInputServices.getLocalJson(data).then(function(msg){
            msg.data !=='' && msg.data!== null ? $scope[data.label] = msg.data:undefined;
            data.label === "details" && msg.data !== null?isDetail():$scope.detailsData = JSON.parse(JSON.stringify($scope.currentData));

            if(msg.data === null){
                return false;
            }

            if(data.label === "report"){
                $scope.report = filterReport($scope.report);
                if($scope.report.length>0){
                    $scope.showReport = $scope.report[0];
                    //获取补充说明
                    getSupplement($scope.showReport.docId);
                    $scope.showReport['show'] = true;
                }else{
                    $scope.showReport = null;
                }
            }
            if(data.label === "details"){
                if(msg.data.viewStatus == "已取消" || msg.data.viewStatus == "已完成" || msg.data.viewStatus == "视频已结束"){
                    $scope.requestBtn = false;
                }
            }
        })
    }

    /**
     * 同意状态才能显示
     * @param data
     * @returns {Array}
     */
    function filterReport(data) {
        var arr = [];
        angular.forEach(data,function(entity){
            if(entity.status == "pass"){
                arr.push(entity);
            }
        });
        return arr;
    }

    /**
     * 获取补充说明
     * @param docId
     */
    function getSupplement(docId){
        var opt = {
            "url": SYS.url+'doc/list',
            "label":'reportSupplement',
            "data":{'consultationId':$routeParams.recordId,'docId':docId}
        }
        consultationInputServices.getLocalJson(opt).then(function(msg){
            msg.data !=='' && msg.data!== null ? $scope.reportSupplement = msg.data:$scope.reportSupplement = [];
        })
    }


    $scope.changeStatus = function(mark){
        if(mark === 'input'){
            window.location.href = '#/consultationInput/'+$routeParams.recordId+'/'+$routeParams.plugin+'/'+$routeParams.docId+'/'+$routeParams.role;
        }else if(mark === 'details'){
            var tip = '必填项不能为空！（*为必填项）';
            var valid = true;
            //验证非空
            angular.forEach($scope.detailsData.version[0].children,function(child){
                if(child.notNull && (child.value == "" || child.value == null)){
                    valid = false;
                }

                //暂时这么特殊处理一下，以后专门增加年龄类型或者新增字段进行特殊标示校验
                if(child.name == 'age'){
                    var re = /^[0-9]+.?[0-9]*$/;
                    if(!re.test(child.value)){
                        tip = '请填写正确数字格式的年龄！'
                        valid = false;
                    }else if(parseInt(child.value)>120){
                        tip = '请填写1~120岁以内的年龄！'
                        valid = false;
                    }
                }

            });
            if(valid){
                consultationInputServices.saveModal($scope.detailsData,mark,$routeParams);
            }
            else{
                var msg = {
                    status:null,
                    description:null
                };
                msg.status = SYS.STATUS_ERROR;
                msg.description = tip;
                Utils.sysTip($scope,msg);
            }
        }
    }

    function isDetail(){
        consultationDetailServices.genDetailData($scope.currentData,$scope.details);
        $scope.detailsData = JSON.parse(JSON.stringify($scope.currentData));
    }

    $scope.changeReport = function(docId,showReport){
        $scope.report.forEach(function(m,y){
            if(m['show'] == true){
                if(m.report == "" || m.report == null){
                    m.report = showReport.report;
                }
            }
        })
        $scope.report.forEach(function(n,i){
            n['show'] = false;
            if(n.docId === docId){
                $scope.showReport = n;
                $scope.showReport['show'] = true;
            }
        })

        getSupplement(docId);

        // var opt = {
        //     "url": SYS.url+'doc/list',
        //     "label":'reportSupplement',
        //     "data":{'consultationId':$routeParams.recordId,'docId':$routeParams.docId}
        // }
        //
        // consultationInputServices.getLocalJson(opt).then(function(msg){
        //     msg.data !=='' && msg.data!== null ? $scope.reportSupplement = msg.data:undefined;
        // })


    }

    $scope.saveModal = function(mark){

        var tip = '必填项不能为空！（*为必填项）';
        var valid = true;
        //验证非空
        angular.forEach($scope.detailsData.version[0].children,function(child){
            if(child.notNull && (child.value == "" || child.value == null)){
                valid = false;
            }

            //暂时这么特殊处理一下，以后专门增加年龄类型或者新增字段进行特殊标示校验
            if(child.name == 'age'){
                 var re = /^[0-9]+.?[0-9]*$/;
                 if(!re.test(child.value)){
                    tip = '请填写正确数字格式的年龄！'
                    valid = false;
                 }else if(parseInt(child.value)>120){
                     tip = '请填写1~120岁以内的年龄！'
                     valid = false;
                 }
            }

        });
        if(valid){
            consultationInputServices.saveModal($scope.detailsData,mark);
        }
        else{
            var msg = {
                status:null,
                description:null
            };
            msg.status = SYS.STATUS_ERROR;
            msg.description = tip;
            Utils.sysTip($scope,msg);
        }
    }

    $scope.saveOpinion = function(){
        if($scope.data.tagOptions == ''){
            return false;
        }
        var opt = {
            'url':SYS.url+'doc/info',
            'data':{'suggest':$scope.data.tagOptions,'consultationId':$routeParams.recordId,'docId':$routeParams.docId},
            'arr':$scope.opinion
        }
        consultationInputServices.saveData(opt).then(function(msg){
            $scope.opinion.push(msg.data);
            $scope.data.tagOptions = '';
        })
    }

    $scope.saveReport = function(docId){
        if($scope.data.tagReport == ''){
            return false;
        }
        var opt = {
            'url':SYS.url+'doctor/report',
            'data':{
                'report':$scope.data.tagReport,
                'consultationId':$routeParams.recordId
            },
            'label':'report'
        }
        consultationInputServices.saveData(opt).then(function(msg){
            $scope.showReport = msg.data;
            $scope.data.tagReport = '';
        })
    }

    $scope.saveReportSupplement = function(docId){
        if($scope.data.tagReportSupplement == ''){
            return false;
        }
        var opt = {
            'url':SYS.url+'doc/info',
            'data':{'supplement':$scope.data.tagReportSupplement,'consultationId':$routeParams.recordId,'docId':docId},
            'arr':$scope.reportSupplement
        }
        consultationInputServices.saveData(opt).then(function(msg){
            $scope.reportSupplement.push(msg.data);
            $scope.data.tagReportSupplement = '';
        })
    }

    $scope.changePage = function(page){
        getData({
            "url": SYS.url+'doctor/list',
            "label":'tableData',
            "data":{'filter_EQ_consultationId':$routeParams.recordId,"filter_pageNo":page,"filter_pageSize":5}
        })
    }

    $scope.onFileSelect = function($files,input,isMultiple,attachment){

        //待上传列表数据
        $scope.datas = [];

        //上传成功列表数据,每次需要进行清空,不能提到函数外面
        $scope.upls = [];

        //控制上传按钮的开启和关闭,不能提到函数外面
        $scope.stopload = false;

        //记录上传的个数,判断是否传完,不能提到函数外面
        $scope.num = 0;

        //每次上传初始化,不能提到函数外面
        $scope.datas.length = 0;
        
        //初始滚动条在最上面
        $('#load-body').scrollTop(0);

        $scope.scrollTop();
        for(var i = 0; i < $files.length; i++){
            $scope.datas[i] = {};
            $scope.datas[i].name = $files[i].name;
            $scope.datas[i].status = '';
            $scope.datas[i].upshow = true;
            $scope.datas[i].evt = '0';
            $scope.datas[i].result = '...正在上传...';
            if( i == 0 ){
                $('#imgLoad').modal({backdrop: 'static'});
            }
            upload($files[i],this.datas[i]);
        }

        function upload(file,obj){
            var url = '';
            var data = null;
            if(attachment){
                url=SYS.url+'/subject/record/file/save';
                data = {fileType:isMultiple,recordId:SYS.routeParams.recordId};
            }else{
                url=SYS.url+'/upload/dicom';
                data = {filter:true};
            }
            $scope.upload = Upload.upload({
                url: url,
                method: 'post',
                file: file,
                params: data
            }).progress(function(evt){
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                obj.evt = progressPercentage-1;
            }).then(function (msg){

                //如果是附件查看
                if(attachment){
                    var arr = []
                    arr.push(msg.data.data);
                    msg.data.data = arr;
                }
                if(msg.data.status == 'ok'){
                    FileService.makeUpFileOpt(input,msg,isMultiple,attachment);
                    obj.status = 'good';
                    obj.result = '上传成功';
                    obj.evt = 100;
                }else if(msg.data.status == 'error' || msg.data.status == 'blank'){
                    obj.status = 'red';
                    obj.result = '上传失败';
                    obj.evt = 0;
                }
                $scope.upls.push({name:obj.name , status:obj.status ,result:obj.result});
                obj.upshow = false;
                $scope.num++;
                if($scope.datas.length == $scope.num){
                    $scope.stopload = true;
                }

            });
        }
    };
    

    //设置图片上传成功后显示在中下方
    $scope.scrollTop = function(){
        var iCount = setInterval(function(){
            $scope.scrollTopn = $scope.scrollTopn + 30;
            $('#load-success').scrollTop($scope.scrollTopn);
            if($scope.stopload == true){
                clearInterval(iCount);
            }
        }, 30);
    }

    //这个用于使显示图片的模态框显示出来
    $scope.showImgModal = function(imgId,callBackData){
        if(!callBackData instanceof Array){
            callBackData = callBackData.data;
        }
        
        $scope.getImgData(imgId,callBackData);
        FileService.showImgModal();
    }

    $scope.showDownloadModel = function(callBackData){
        $scope.getDownloadImgData(callBackData);
        $('#downloadImg').modal('show');
    }



}]);


