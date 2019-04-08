angular.module('infi-basic')
    .controller('AuditCaseController', ['$scope','DataService','$routeParams',function ($scope,DataService,$routeParams) {


        $scope.columns = [
            {label:'序号'},
            {label:'病历编号'},
            {label:'患者姓名'},
            {label:'分组'},
            {label:'录入医院'},
            {label:'科室'},
            {label:'录入人'},
            {label:'数据来源'},
            {label:'提交时间'},
            {label:'审核状态'},
            {label:'操作'}
        ];

        //录入中心的值
        $scope.center = '';
        $scope.centers = '';
        $scope.centerData = [];
        $scope.centersData = [];

        //时间空间中的值
        $scope.startTime = '';
        $scope.endTime = '';

        //搜索框中的值
        $scope.setKeyword = '';

        //数据来源的值
        $scope.sourceValue = '';
        $scope.sourceValueData = [
            {name:'全部',value:''},
            {name:'手动录入',value:'input'},
            {name:'自动转换',value:'auto'},
            {name:'excel上传',value:'conver'}
        ];

        //审核状态的值
        $scope.auditStatus = '';
        $scope.auditStatusData = [
            {name:'全部',value:''},
            {name:'待审核',value:'pre_audit,audit_pass_pre,audit_modify_pre'},
            {name:'审核通过',value:'audit_pass,audit_pass_saved'},
            {name:'审核驳回',value:'audit_reject,audit_pass_reject'}
        ];

        //分组的值
        $scope.group = '';
        $scope.groupData = [];

        //通过和驳回的值
        $scope.isJudge = '';

        //审核理由
        $scope.judgeReason = '';

        // //模态框禁用
        // $scope.judgeDisabled = true;

        //理由添加提示
        $scope.reason = false;

        //分页初始化
        $scope.filter = 1;

        //列表无数据时
        $scope.hasData = false;

        //模态框中的确定按钮
        $scope.judgeData = function(){
            //console.log($scope.casesId,$scope.isJudge,$scope.judgeReason);
            if($scope.isJudge == 'yes'){
                $scope.ajaxAuditResult();
            }else if($scope.isJudge == 'no'){
                if($scope.judgeReason){
                    $scope.ajaxAuditResult();
                }else{
                    $scope.reason = true;
                }
            }else{
                alert('请选择');
            }
        }

        //审核发送的请求方发  -- 需要两处调用 所以提成方法
        $scope.ajaxAuditResult = function(){
            DataService.ajaxAuditResult($scope.casesId,$scope.isJudge,$scope.judgeReason).then(function (data) {
                //console.log(data);
                $scope.auditList()
                $('#auditBy').modal('hide');
                $scope.judgeReason = '';
            });
        }

        //时间插件
        $scope.timePlugin = function(tagName){
            DataService.timePlugin(tagName);
        }

        //筛选条件的值
        $scope.filterValue = function(){
           // //console.log($scope.center,$scope.centers,$scope.startTime,$scope.endTime,$scope.setKeyword,$scope.sourceValue,$scope.auditStatus,$scope.group);
            $scope.auditList();
        }

        //审核按钮
        $scope.auditBy = function(data){
            $scope.judgeReason = '';
            $scope.reason = false;
            $scope.isJudge = '';
            $scope.casesId = data;
            $('#auditBy').modal({backdrap:'static'});
        }

        //分页
        $scope.updatePageAttend = function(PageNo){
            $scope.filter = PageNo.page;
            $scope.auditList();
        }

        //

        //列表数据
        $scope.auditList = function(){
            // //console.log($routeParams.id,$scope.filter);
            DataService.ajaxAuditList($routeParams.id,$scope.filter,$scope.endTime,$scope.startTime,$scope.sourceValue,$scope.centers,$scope.auditStatus,$scope.group,$scope.center,$scope.setKeyword).then(function (data) {
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
                        //判断分组

                        if(data.data.page.content[i].sourceType == 'input'){
                            data.data.page.content[i].sourceType = '手动录入'
                        }else if(data.data.page.content[i].sourceType == 'auto'){
                            data.data.page.content[i].sourceType = '自动转换'
                        }else if(data.data.page.content[i].sourceType == 'conver'){
                            data.data.page.content[i].sourceType = 'Excel导入'
                        }

                        if(
                            data.data.page.content[i].status == 'newed'){
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
                    }
                }
            })
        }

        //用于筛选出分组,录入的筛选条件
        $scope.update = function() {
            DataService.ajaxOverviewData($routeParams.id).then(function (data) {
                console.log(data,3535654564546465654)
                $scope.navTopicName = data.data.name;
                angular.forEach(data.data.userOffice, function(value, key) {
                    $scope.centerData.push({name:key,value:key})
                });
                
                if(data.data.subjectGroup.length > 0){
                    /*for(var i = 0 ; i < data.data.subjectGroup[0].taskGroup.length ; i++){
                        $scope.centersData.push({name:data.data.subjectGroup[0].taskGroup[i].sectName,value:data.data.subjectGroup[0].taskGroup[i].sectName});
                    }*/
                    var arry = [];
                    data.data.subjectGroup[0].taskGroup.forEach(function(n,i){
                        arry.push(n.sectName)
                    });
                    arry = duplicateRemoval(arry);
                    arry.forEach(function(n,i){
                        $scope.centersData.push({name:n,value:n});
                    });

                }

                for(var j = 0 ; j < data.data.subjectGroup.length ; j++){
                    $scope.groupData.push({name:data.data.subjectGroup[j].name,value:data.data.subjectGroup[j].id});
                }
                $scope.auditList();
            })
        }
        $scope.update();

        //用于数组去重
        function duplicateRemoval(arry){
            var check = {};
            arry.forEach(function(n,i){
                check[n] = true;
            });

            var arr = [];
            for(value in check){
                arr.push(value);
            }
            return arr;
        }

    }]);