angular.module('infi-basic')
    .controller('CasesInputController', ['$rootScope','$scope','DataService','$routeParams','Upload','SYS',function ($rootScope,$scope,DataService,$routeParams,Upload,SYS) {

        $scope.navTopicName = '';
        $scope.sys = SYS.urls;
        $scope.columns = [
            {label:'序号'},
            {label:'病历编号'},
            {label:'患者姓名'},
            {label:'创建时间'},
            {label:'数据来源'},
            {label:'当前状态'},
            {label:'可执行操作'},
            {label:'操作'}
        ];

        $scope.content = [];

        $scope.sourcesData = [
            {name:'全部',value:''},
            {name:'手动录入',value:'input'},
            {name:'Excel上传',value:'conver'},
            {name:'自动转换',value:'auto'}
        ];
        $scope.currentCondition = [
            {name:'全部',value:''},
            {name:'待审核',value:'pre_audit,audit_pass_pre'},
            {name:'已保存',value:'newed'},
            {name:'审核通过',value:'audit_pass,audit_pass_saved'},
            {name:'审核驳回',value:'audit_reject,audit_pass_reject'},
            {name:'同意修改',value:'audit_modify_pass'},
            {name:'拒绝修改',value:'audit_modify_reject'},
            {name:'待批准修改',value:'audit_modify_pre'}
        ];

        $scope.casesNew = [
            {name:'病例号',value:''},
            {name:'姓名',value:''}
        ];

        $scope.currentcCondition = [];
        $scope.taskGroup = [];

        $scope.choseHospital = function(){
            $('#cases-hospital').modal({backdrap:'static'})
        };

        //excel上传
        $scope.onFileSelect = function($files){
            for(var i = 0 ; i < $files.length; i++){
                //console.log($files[i]);
                /*文件上传函数*/
                Upload.upload({
                    url:SYS.url+'subject/profile/up/detail',
                    method: 'post',
                    file: $files[i]
                }).success(function(data, status, headers, config) {// 文件上传成功处理函数
                    //console.log(data);
                    $scope.excelData = data.data;
                    // location.href = '#/excel-previewt/'+$routeParams.id;
                    $scope.excelTable = [];
                    $scope.excelTbodyTr = [];
                    angular.forEach(data.data[0], function(data,index) {
                        $scope.excelTable.push({name:index})
                    })
                    for(var i = 0 ; i < data.data.length ; i++){
                        $scope.excelTbodyTr.push([]);
                        angular.forEach(data.data[i], function(data,index) {
                            $scope.excelTbodyTr[i].push({name:data,length:i})
                        })
                    }
                    $('#excel-preview').modal({backdrap:'static'})
                }).error(function(data, status, headers, config) {//失败处理函数
                    //console.log('上传失败');
                });

                // DataService.ajaxSetList().then(function(data){
                //
                // });
            }
        }

        //excel上传数据删除
        $scope.excelDelete = function(data){
            //console.log($scope.excelData[0]);
            //console.log($scope.excelTbodyTr);
            // // 删除页面
            // $scope.excelTbodyTr.splice(data[0].length,1);
            // // 向后台发送请求的元素
            // $scope.excelData.splice(data[0].length,1);

        }
        //excel保存
        $scope.excelSaveDisplay = true;
        $scope.excelSave = function(){
            $scope.excelSaveDisplay = false;
            for(var j=0 ; j < $scope.zongData.data.subjectGroup.length ; j++){
                if($scope.zongData.data.subjectGroup[j].name == $scope.step){
                    $scope.projectName = $scope.zongData.data.subjectGroup[j].configFileUpload;
                }
            }
            // $scope.excelData
            DataService.ajaxExcelSave($scope.projectName.project,$routeParams.id,$scope.stepId,$scope.taskGroupId).then(function(data){
                // console.log(data,'excel返回的数据');
                //刷新页面数据
                if(data.status == 200){
                    $scope.CasesList();
                    $scope.excelSaveDisplay = true;
                }else{
                    alert('上传失败......请稍后再试')
                }
                $('#excel-preview').modal('hide')
            });
        }

        //tab切换
        $scope.descriptionTab = function(data,content,id){
            $scope.step = data;
            $scope.stepId = id;
            $scope.description = content;
            $scope.CasesList();
        }
        $scope.newCases = function(){
            $('#cases-modal').modal({backdrap:'static'})
        }

        //新建保存
        $scope.casesSave = function(){
            for(var i=0 ; i < $scope.zongData.data.subjectGroup.length ; i++){
               if($scope.zongData.data.subjectGroup[i].name == $scope.step){
                     $scope.projectName = $scope.zongData.data.subjectGroup[i].configFileUpload;
               }
            }
            $scope.casesSaveData = {
                "patientId":$scope.casesNew[0].value,
                "patientName":$scope.casesNew[1].value,
                "subjectId":$routeParams.id,
                "subjectGroupId":$scope.stepId,
                "projectName":$scope.projectName.project
            };
            //console.log($scope.casesSaveData,'点击保存发送的数据');
            if($scope.casesNew[0].value == '' || $scope.casesNew[1].value == ''){
                alert('输入框不能为空')
                return
            }
            DataService.ajaxCasesSave($scope.casesSaveData,$routeParams.id,$scope.stepId,$scope.projectName.project).then(function(data){
                console.log(data);
                if(data.status == 200){
                    //刷新页面数据
                    $scope.CasesList();
                    // window.location.reload();
                    // $location.path('cases-input/'+$routeParams.id);
                    $('#cases-modal').modal('hide')
                }else{
                    alert('生成病例失败!请稍后再试')
                }

                $scope.casesNew[0].value = '';
                $scope.casesNew[1].value = '';
            });
        }
        $scope.casesInputFilter = {
            listStartTime:'',
            listEndTime:'',
            sourceValue:'',
            currentValue:'',
            setKeyword:''
        }
        //筛选条件
        $scope.filterValue = function(){
            // //console.log($scope.listStartTime.listStartTime,$scope.listEndTime,$scope.sourceValue,$scope.currentValue,$scope.setKeyword);
            $scope.CasesList();
        }
        // $scope.casesPrompt = false;
        //获取导航tab数据
        $scope.update = function() {
            DataService.ajaxOverviewData($routeParams.id).then(function (data) {
                $scope.taskGroup = [];
                //idData为实验组和对照组id
                $scope.idData = [];
                $scope.navTopicName = data.data.name;
                // console.log(data.data.name, '获取导航tab数据');
                $scope.zongData = data;
                if (data.data.subjectGroup.length > 0) {
                    $scope.casesPrompt = true;
                    for (var i = 0; i < data.data.subjectGroup.length; i++) {
                        if(data.data.subjectGroup[i].taskGroup[i]){
                            $scope.idData.push(data.data.subjectGroup[i].taskGroup[i].id);
                        }

                        //分组中的tab切换
                        var taskGroupData = {
                            name: data.data.subjectGroup[i].name,
                            content: data.data.subjectGroup[i].description,
                            id: data.data.subjectGroup[i].id
                        }
                        $scope.taskGroup.push(taskGroupData);
                        $scope.step = $scope.taskGroup[0].name;
                        $scope.stepId =  $scope.taskGroup[0].id;
                        $scope.description = data.data.subjectGroup[0].description;
                    }
                }else{
                    return
                }
                DataService.ajaxUserInfo('').then(function(data){
                    for(var i = 0 ; i < $scope.zongData.data.subjectGroup.length ; i++ ){
                        if($scope.zongData.data.subjectGroup[i].name == $scope.step){
                            for(var j = 0 ; j < $scope.zongData.data.subjectGroup[i].taskGroup.length; j++){
                                if($scope.zongData.data.subjectGroup[i].taskGroup[j].sectName == data.data.data.officeName && $scope.zongData.data.subjectGroup[i].taskGroup[j].officeName == data.data.data.companyName){
                                    $scope.taskGroupId = $scope.zongData.data.subjectGroup[i].taskGroup[j].id;
                                }
                            }
                        }
                    }
                });
                $scope.CasesList();
            })
        }
        $scope.update();
        //列表数据
        $scope.contents = {};
        $scope.CasesList = function(){
            //console.log($scope.stepId,'分组id',$scope.filter,'页码',$scope.casesInputFilter.listStartTime,'开始时间',$scope.casesInputFilter.listEndTime,'结束时间',$scope.casesInputFilter.sourceValue,'数据来源',$scope.casesInputFilter.currentValue,'当前状态',$scope.casesInputFilter.setKeyword,'关键子')
            $scope.routeParamsId = $routeParams.id;
            $scope.groupId = $scope.stepId;
            DataService.ajaxCasesList($scope.stepId,$scope.filter,$scope.casesInputFilter.listStartTime,$scope.casesInputFilter.listEndTime,$scope.casesInputFilter.sourceValue,$scope.casesInputFilter.currentValue,$scope.casesInputFilter.setKeyword).then(function (data) {
                if (data.data.status == 'blank') {
                    $scope.hasData = false;
                    $scope.descriptions = data.data.description
                } else {
                    $scope.contents = data.data;
                    $scope.contents.page.number = $scope.contents.page.number + 1;
                    $scope.hasData = true;
                    //console.log(data, '后台返回列表的数据');
                    $scope.content = [];
                    for (var i = 0; i < data.data.page.content.length; i++) {
                        data.data.page.content[i].select = '';
                        if(data.data.page.content[i].sourceType == 'input'){
                             data.data.page.content[i].sourceType = '手动录入'
                        }else if(data.data.page.content[i].sourceType == 'auto'){
                            data.data.page.content[i].sourceType = '自动转换'
                        }else if(data.data.page.content[i].sourceType == 'conver'){
                            data.data.page.content[i].sourceType = 'Excel导入'
                        }

                        if(
                            data.data.page.content[i].status == 'newed'||
                            data.data.page.content[i].status == 'audit_modify_pass_saved' ){
                            data.data.page.content[i].statusName = '已保存'
                            
                        }else if(
                            data.data.page.content[i].status == 'audit_modify_pass' ){
                            data.data.page.content[i].statusName = '同意修改'

                        }else if(
                            data.data.page.content[i].status == 'audit_modify_reject'){
                            data.data.page.content[i].statusName = '拒绝修改'

                        }else if(
                            data.data.page.content[i].status == 'pre_audit' ||
                            data.data.page.content[i].status == 'audit_pass_pre'){
                            data.data.page.content[i].statusName = '待审核'
                            
                        }else if(
                            data.data.page.content[i].status == 'audit_pass' ||
                            data.data.page.content[i].status == 'audit_pass_saved'){
                            data.data.page.content[i].statusName = '审核通过'
                            
                        }else if(
                            data.data.page.content[i].status == 'audit_reject' ||
                            data.data.page.content[i].status == 'audit_pass_reject'){
                            data.data.page.content[i].statusName = '审核驳回'
                            
                        }else if(
                            data.data.page.content[i].status == 'audit_modify_pre'){
                            data.data.page.content[i].statusName = '待批准修改'
                        }

                        $scope.content.push(data.data.page.content[i]);
                        $scope.content[i].colour = '';
                    }
                }
            })
        }

        //分页
        $scope.updatePageAttend = function(PageNo){
            $scope.filter = PageNo.page;
            $scope.selectAll.value = false;
            $scope.CasesList();
        }

        $scope.casesModify = function(name){
            $scope.dataName = name;
            $('#prompt').modal({backdrap:'static'})
        }

        //提交按钮
        $scope.casesSubmit = function(data,name){
            $scope.casesData = data;
            $scope.dataName = name;
            $scope.selectAll.value = false;
            $scope.all();
            $('#prompt').modal({backdrap:'static'})
        }

        //申请修改按钮
        $scope.casesModification = function(data,name){
            $('#prompt').modal({backdrap:'static'});
            $scope.casesData = data;
            $scope.dataName = name;
        }

        //删除按钮
        $scope.casesDelete = function(data,name){
            $scope.casesData = data;
            $scope.dataName = name;
            $scope.selectAll.value = false;
            $scope.all();
            $('#prompt').modal({backdrap:'static'})
        }


        //操作中的确定按钮
        $scope.confirm = function(){
            if($scope.dataName == '提交'){
                DataService.ajaxCasesSubmit($scope.casesData).then(function(data){
                    //console.log(data);
                    $scope.CasesList();
                    $('#prompt').modal('hide')
                });
            }else if($scope.dataName == '申请修改'){
                DataService.ajaxCasesModification($scope.casesData).then(function(data){
                    //console.log(data);
                    $('#prompt').modal('hide')
                    $scope.CasesList();
                });
            }else if($scope.dataName == '删除'){
                DataService.ajaxCasesDelete($scope.casesData).then(function(data){
                    //console.log(data);
                    $('#prompt').modal('hide')
                    $scope.CasesList();
                });
            }
        }

        //时间插件
        $scope.timePlugin = function(tagName,projectName,refreshList){
            DataService.timePlugin(tagName);
        }

        $scope.checkboxData = []
        //添加背景色
        // $scope.colours = function(data){
        //     //console.log(data);
            // if(a.colour == 'red'){
            //     a.colour = '';
            // }else{
            //     a.colour = 'red';
            // }
        // }
        $scope.selectAll = {
            value:''
        }
        //单个选择
        $scope.single = function(data){
            $scope.singleNum = 0
            if(data == false){
                $scope.selectAll.value = false;
            }else {
                for (var i = 0; i < $scope.content.length; i++) {
                    if ($scope.content[i].select == false) {
                        $scope.singleNum++;
                    }
                }
                if($scope.singleNum == 0){
                    $scope.selectAll.value = true;
                }
            }
        }

        //全选
        $scope.all = function(){

            if($scope.selectAll.value){
                for(var i = 0 ; i < $scope.content.length ; i++){
                    $scope.content[i].select = true;
                }
            }else{
                for(var i = 0 ; i < $scope.content.length ; i++){
                    $scope.content[i].select = false;
                }
            }

            // $scope.
        }

        //批量提交
        $scope.dataSubmit = function(){
            for(var i = 0 ; i < $scope.content.length ; i++){
                if($scope.content[i].select == true){

                    $scope.batchData = [];
                    for(var i = 0 ; i < $scope.content.length ; i++){
                        if($scope.content[i].select == true && $scope.content[i].status == 'newed' || $scope.content[i].status == 'audit_modify_pass'){
                            $scope.batchData.push($scope.content[i].id);
                        }
                    }
                    if($scope.batchData.length == 0){
                        $scope.promptMainContent = '当前状态为已保存时才可提交';
                        $('#general-prompt').modal({backdrop:'static'});
                    }else{
                        $scope.promptMainContent = '确定批量提交么?';
                        $('#general-prompt').modal({backdrop:'static'});
                    }
                    return;
                }
            }

            $scope.promptMainContent = '请选择病历！！！';
            $('#general-prompt').modal({backdrop:'static'});
        }
        $scope.dataSubmits = function(){
            if($scope.batchData.length == 0){
                $scope.promptMainContent = '没有符合要求的数据';
                $('#general-prompt').modal({backdrop:'static'});
                $scope.selectAll.value = false;
                $scope.all();
                $scope.CasesList();
                return
            }

            //console.log($scope.batchData,'病例id');
            //console.log($scope.stepId,'分组id');
            DataService.ajaxDataSubmit($scope.batchData,$scope.stepId).then(function(data){
                console.log(data);
                $scope.selectAll.value = false;
                $scope.all();
                $scope.CasesList();
                $('#general-prompt').modal('hide');
            });
        }

        //批量提交,删除提示框
        $scope.promptMainContentSave = function(){
            if($scope.promptMainContent == '确定批量提交么?'){
                $scope.dataSubmits();
            }else if($scope.promptMainContent == '确定批量删除么?'){
                $scope.dataDeletes();
            }else{
                $('#general-prompt').modal('hide');
            }
        }

        //批量删除
        $scope.dataDelete = function(){
            for(var i = 0 ; i < $scope.content.length ; i++){
                if($scope.content[i].select == true){

                    $scope.batchData = [];
                    for(var i = 0 ; i < $scope.content.length ; i++){
                        if($scope.content[i].select == true && $scope.content[i].status == 'newed'){
                            $scope.batchData.push($scope.content[i].id);
                        }
                    }
                    if($scope.batchData.length == 0){
                        $scope.promptMainContent = '当前状态下不可是';
                        $('#general-prompt').modal({backdrop:'static'});
                    }else{
                        $scope.promptMainContent = '确定批量删除么?';
                        $('#general-prompt').modal({backdrop:'static'});
                    }
                    return;
                }
            }
            $scope.promptMainContent = '请选择需要删除的病历！！！';
            $('#general-prompt').modal({backdrop:'static'});
        }
        //批量删除
        $scope.dataDeletes = function(){
            if($scope.batchData.length == 0){
                $scope.promptMainContent = '没有符合要求的数据';
                $('#general-prompt').modal({backdrop:'static'});
                $scope.selectAll.value = false;
                $scope.all();
                return
            }
            //console.log($scope.batchData,'病例id');
            //console.log($scope.stepId,'分组id');
            DataService.ajaxDataDelete($scope.batchData,$scope.stepId).then(function(data){
                $scope.selectAll.value = false;
                $scope.all();
                $scope.CasesList();
                $('#general-prompt').modal('hide');
            });

        }
    }]);