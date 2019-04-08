angular.module('infi-basic')
    .controller('TopicsInputGroupController',['$rootScope','$scope','DataService','$routeParams',function ($rootScope,$scope,DataService,$routeParams) {
        $scope.inviteKeyword = '';
        $scope.userIds = '';
        $scope.subjectId = '';
        $scope.attendUsers = '';
        $scope.navTopicName = '';
        $scope.tableCheckBox=true;
        $scope.selectMain = {
            value:false
        }
        $scope.permissions ='study';
        $scope.information = [
            {name:'姓名:',value:'张三',names:'加入时间:',values:'2016-01-01'},
            {name:'医院:',value:'首都医科大学佑安医院',names:'科室:',values:'放射科'},
            {name:'职位:',value:'副主任医师'}
        ];
        //邀请列表
        $scope.listDatas = {};
        $scope.listColumns = {};
        //被选中的邀请列表
        $scope.listData={};
        $scope.listColumn = {};
        /*$scope.tableOpt = {
            label: '操作',
            btns: [
                {label: '管理',type: 'view'}
            ]
        };*/
        $scope.management = true;
        //判断是否在
        if(window.location.href.indexOf('management') > 0){
            $scope.management = false;
        }
        // 点击下一步
        $scope.SelectInNext = [];
        $scope.inviteNext = function(character,mark){
            $scope.judg = character;
            if($scope.listData.status == "ok"){
                for(var i = 0 ; i < $scope.listData.page.content.length ; i++){
                    var time = DataService.newTime($scope.listData.page.content[i].attendTime);
                    $scope.SelectInNextData = {
                        "id":$scope.listData.page.content[i].id ,
                        "userId":$scope.listData.page.content[i].userId ,                 //用户id                             id
                        "attendTime": time,             //参与时间            //默认邀请时即为加入时间
                        "hospitalName": $scope.listData.page.content[i].hospitalName,         //参与者所在医院名       companyName
                        "type": $scope.listData.page.content[i].type,                //参与者类型   科研人员general,管理员manager
                        "sectName": $scope.listData.page.content[i].sectName,             //参与者所在科室名       officeName
                        "name": $scope.listData.page.content[i].name,                 //参与者姓名
                        "email": $scope.listData.page.content[i].email,                //邮箱
                        "phone": $scope.listData.page.content[i].phone
                    }
                    $scope.SelectInNext.push($scope.SelectInNextData);
                }

                $scope.promptMainContent = '保存中……';
                $('#general-prompt').modal('show');

                //console.log($scope.SelectInNext,'点击下一步发送的数据');
                DataService.ajaxInviteNext($routeParams.id,$scope.SelectInNext).then(function(data){
                    if($scope.judg == 0){
                        $scope.getList();
                        getListColumns();
                    }else{
                        if(mark){
                            $scope.promptMainContent = '保存成功！';
                        }else{
                            $('#general-prompt').modal('hide');
                            $('#general-prompt').on('hidden.bs.modal', function (e) {
                                location.href = '#/topics.input.task/'+$routeParams.id
                            })
                        }
                    }
                    $scope.SelectInNext = [];
                    //console.log(data,'发送成功返回的数据');
                });
            }else{
                $scope.promptMainContent = '没有邀请人';
                $('#general-prompt').modal('show');
                //alert('没有添加邀请人');
                //location.href = '#/topics.input.task/'+$routeParams.id;
            }
        }
        //上一步
        $scope.invitePrevious = function(){
            location.href = '#/topics.input/'+$routeParams.id;
        }



        //管理点击确定
        $scope.selectIdentity = function(){
            //权限选择
            if($scope.study == 'admin'){
                $scope.typedata.type = 'manager';
            }else if($scope.study == 'study'){
                $scope.typedata.type = 'general';
            }
            $scope.inviteNext(0);
            $('#invites-management').modal('hide');
        }

        //点击管理
        $scope.inviteManagement = function(data){
            $scope.study = 'study';
            $scope.typedata = data;
            var a = DataService.newTime($scope.typedata.attendTime);
            $scope.information = [
                {name:'姓名:',value:$scope.typedata.name,names:'加入时间:',values:a},
                {name:'医院:',value:$scope.typedata.hospitalName,names:'科室:',values:$scope.typedata.sectName},
                {name:'电话:',value:$scope.typedata.phone,names:'邮箱:',values:$scope.typedata.email},
                {name:'职位:',value:'副主任医师'}
            ];
            $('#invites-management').modal({backdrop: 'static'});
        }

        //新增邀请 按钮
        $scope.inviteModals =function(){
            $scope.selectMain.value = false;
            $scope.selectMainAll()
            $scope.selectLists = [];
            $scope.inviteKeyword = '';
            DataService.ajaxInvitationList().then(function(data){
                $scope.listColumns = data.data;
            });
            DataService.ajaxInvitation('1',$scope.inviteKeyword,'',$routeParams.id).then(function(data){
                if(data.data.page){
                    for(var i = 0 ; i < data.data.page.content.length ; i++){
                        data.data.page.content[i].listSelect = {}
                        data.data.page.content[i].listSelect.value = false;
                    }
                }
                $scope.listDatas = data.data;
                if(data.data.page){
                    $scope.listDatas.page.number++;
                }
                $('#invites-modal').modal({backdrop: 'static'});
                //console.log(data.data,'新增邀请按钮返回的数据');
                // }
            });
        }

        //模态框中的搜索
        $scope.inviteSearch =function(){
            $scope.selectMain.value = false;
            $scope.SelectIn = [];
            $scope.selectLists = [];
            DataService.ajaxInvitationList().then(function(data){
                $scope.listColumns = data.data
            });
            //console.log($scope.attendUsers,'搜索发送的参与者集');
            //console.log($scope.inviteKeyword,'搜索发送的关键字');
                DataService.ajaxInvitation('1',$scope.inviteKeyword,$scope.attendUsers,$routeParams.id).then(function(data){
                if(data.status == 200){
                    $scope.listDatas = data.data;
                    if(data.data.page){
                        $scope.listDatas.page.number++;
                    }
                }
            });
            //console.log($scope.listDatas,'搜索返回的数据');
        }

        //新增邀请列表中的分页
        $scope.getLists = function (filter){
            $scope.selectMain.value = false;
            $scope.SelectIn = [];
            $scope.selectLists = [];
            //console.log(filter);
            DataService.ajaxInvitation(filter,$scope.inviteKeyword,$scope.attendUsers,$routeParams.id).then(function(data){
                $scope.listDatas = data.data;
                if(data.data.page){
                    $scope.listDatas.page.number++;
                }
                $('#invites-modal').modal({backdrop: 'static'});
                //console.log(data.data,'新增邀请按钮返回的数据');
                // }
            });
            $scope.clearData();
        }
        $scope.pageFns = function pageFn(entity,type){
            if( type == 'select' ){
                $scope.selects(entity);
            }
            if( type == 'selectAll' ){
                $scope.selectViceAll(entity);
            }
        }

        $scope.cancel = function(){
            $scope.selectMain.value = false;
        }

        //模态框全选按钮
        $scope.selectViceAll = function(){
            if($scope.listDatas.status == 'blank'){
                return
            }
            if( $scope.selectMain.value){
                $scope.selectLists = angular.copy($scope.listDatas.page.content);
                for(var i = 0 ;i < $scope.listDatas.page.content.length; i++){
                    $scope.listDatas.page.content[i].listSelect.value = true;
                }
            }else{
                $scope.selectLists= []
                for(var j = 0 ;j < $scope.listDatas.page.content.length; j++){
                    $scope.listDatas.page.content[j].listSelect.value = false;
                }
            }
            $scope.selects()
        }

        $scope.selectJudgments = function(){
            if($scope.selectLists.length !== $scope.listDatas.page.content.length){
                $scope.selectMain.value = false
            }else{
                $scope.selectMain.value = true
            }
        }

        //新增邀请列表中的选中按钮
        $scope.selectLists = [];
        $scope.selects = function(msg){
            if(msg){
                for(var i = 0 ;i < $scope.selectLists.length; i++){
                    if(msg.id == $scope.selectLists[i].id){
                        $scope.selectLists.splice(i,1);
                        //console.log($scope.selectLists,'选中');
                        $scope.selectJudgments();
                        return;
                    }
                }
                var data = JSON.parse(JSON.stringify(msg));
                data.$$hashKey = undefined;
                $scope.selectLists.push(data);
            }

            //console.log($scope.selectLists,'选中');
            $scope.selectJudgments();

        }

        //模态框中的邀请按钮
        $scope.SelectIn = [];
        $scope.inviteModalTotal =function(){
            $scope.SelectIn = [];
            $scope.selectMain.value = false;
            $scope.currentdate = DataService.newTime();
            //console.log($scope.selectLists,54555555);
            for(var i = 0 ; i < $scope.selectLists.length ; i++){
                $scope.SelectInData = {
                    "userId":$scope.selectLists[i].id ,                 //用户id                             id
                    "attendTime": $scope.currentdate,             //参与时间            //默认邀请时即为加入时间
                    "hospitalName": $scope.selectLists[i].companyName,         //参与者所在医院名       companyName
                    "sectName": $scope.selectLists[i].officeName,             //参与者所在科室名       officeName
                    "name": $scope.selectLists[i].name,                 //参与者姓名
                    "email": $scope.selectLists[i].email,                //邮箱
                    "phone": $scope.selectLists[i].phone,
                    "type":'general'
                }
                $scope.SelectIn.push($scope.SelectInData);
            }
            // console.log($routeParams.id,$scope.SelectIn,'模态框中的邀请发送的数据');
            DataService.ajaxInviteAdd($routeParams.id,$scope.SelectIn).then(function(data){
                console.log(data,'模态框中的邀请成功返回的数据');
                if(data.status == 200){
                    $scope.getList();
                    getListColumns();
                    $('#invites-modal').modal('hide');
                    $('#invite-modal').modal('show');
                    $scope.clearData();
                    $('#general-prompt').modal('hide');
                }else{
                    alert('系统正忙,请稍后再试...');
                }
            });

        }
        $scope.inviteModal =function(){
            if($scope.selectLists.length == 0){
                $scope.promptMainContent = '没有选中邀请人的数据';
                $('#general-prompt').modal({backdrop:'static'});
            }else{
                $scope.promptMainContent = '确定邀请么?';
                $('#general-prompt').modal({backdrop:'static'});
            }
        }

        $scope.clearData = function(){
            $scope.selectList = [];
            $scope.selectLists = [];
        }



        //table请求数据
        $scope.getList = function (filter){
            $scope.tabStep = filter;
            $scope.selectMain.value = false;
            DataService.ajaxList(filter,$routeParams.id).then(function(data){
                if(data.data.page){
                    // $scope.tableCheckBox=false
                    for(var i = 0 ; i < data.data.page.content.length ; i++){
                        data.data.page.content[i].listSelect = {}
                        data.data.page.content[i].listSelect.value = false;
                    }
                }

                $scope.listData=data.data;
                if(data.data.page){
                    $scope.listData.page.number++;
                }

                //console.log($scope.listData,'列表数据');
            });
            $scope.clearData();

        }
        function getListColumns(){
            DataService.ajaxColumns('list').then(function(data){
                $scope.listColumn = data.data;
                //console.log($scope.listColumn,'列表返回的表头数据');
            });
        }
        $scope.getList();
        getListColumns();



        $scope.pageFn = function pageFn(entity,type){
            if( type == 'view' ){
                $scope.inviteManagement(entity);
            }
            if( type == 'select' ){
                $scope.select(entity);
            }
            if( type == 'selectAll' ){
                $scope.selectMainAll(entity);
            }
        }
        

        //main全选按钮
        $scope.selectMainAll = function(data){
            if($scope.listData.status == 'blank'){
                return
            }
            if( $scope.selectMain.value){
                $scope.selectList = angular.copy($scope.listData.page.content);
                for(var i = 0 ;i < $scope.listData.page.content.length; i++){
                    $scope.listData.page.content[i].listSelect.value = true;
                }
            }else{
                $scope.selectList= []
                for(var i = 0 ;i < $scope.listData.page.content.length; i++){
                    $scope.listData.page.content[i].listSelect.value = false;
                }
            }

            $scope.select()
        }

        $scope.selectList = [];
        $scope.select = function(entity){
            if(entity){
                for(var i = 0 ;i < $scope.selectList.length; i++){
                    if(entity.id == $scope.selectList[i].id){
                        $scope.selectList.splice(i,1);
                        //console.log($scope.selectList,'取消被选中要删除的');
                        $scope.selectJudgment();
                        return;
                    }
                }
                var data = JSON.parse(JSON.stringify(entity));
                data.$$hashKey = undefined;
                $scope.selectList.push(data);

            }
            //console.log($scope.selectList,'被选中要删除的');
            $scope.selectJudgment();

        }

        $scope.selectJudgment=function(){
            if($scope.selectList.length !==  $scope.listData.page.content.length){
                $scope.selectMain.value = false
            }else{
                $scope.selectMain.value = true
            }
        }

        //删除按钮
        $scope.SelectDelete = [];
        $scope.inviteDelete = function(){
            if($scope.selectList.length == 0){
                $scope.promptMainContent = '没有选中删除的数据';
                $('#general-prompt').modal({backdrop:'static'});
            }else{
                $scope.promptMainContent = '确定删除么?';
                $('#general-prompt').modal({backdrop:'static'});
            }
        }

        $scope.inviteDeletes = function(){
            $scope.selectMain.value = false;
            if($scope.listData.page.content.length == $scope.selectList.length){
                $scope.tabStep--;
            }

            for(var i = 0 ; i < $scope.selectList.length ; i++){
                var time = DataService.newTime($scope.selectList[i].attendTime);
                $scope.Deletedata = {
                    "id":$scope.selectList[i].id ,
                    "userId":$scope.selectList[i].userId ,
                    "attendTime": time,             //参与时间            //默认邀请时即为加入时间
                    "hospitalName": $scope.selectList[i].hospitalName,         //参与者所在医院名       companyName
                    "type": $scope.selectList[i].type,                //参与者类型   科研人员general,管理员manager
                    "sectName": $scope.selectList[i].sectName,             //参与者所在科室名       officeName
                    "name": $scope.selectList[i].name,                 //参与者姓名
                    "email": $scope.selectList[i].email,                //邮箱
                    "phone": $scope.selectList[i].phone
                }
                $scope.SelectDelete.push($scope.Deletedata);
            }
            //console.log($scope.SelectDelete,'删除发过去的数据');
            DataService.ajaxInviteDelete($routeParams.id, $scope.SelectDelete).then(function(data){
                if(data.status == 200){
                    $scope.getList($scope.tabStep);
                    getListColumns();
                    $('#invites-delete').modal({backdrop: 'static'});
                    //console.log(data,'删除成功返回的数据')
                }
                $scope.SelectDelete = [];
                $scope.selectList = [];
                $('#general-prompt').modal('hide');
            });
        }

        //提示框中的确定
        $scope.promptMainContentSave = function(){
            if($scope.promptMainContent == '确定删除么?'){
                $scope.inviteDeletes();
            }else if($scope.promptMainContent == '确定邀请么?'){
                $scope.inviteModalTotal()
            }else if($scope.promptMainContent == '没有邀请人'){
                $('#general-prompt').modal('hide');
                $('#general-prompt').on('hidden.bs.modal', function (e) {
                    location.href = '#/topics.input.task/'+$routeParams.id;
                })
            }else{
                $('#general-prompt').modal('hide');
            }
        }

        DataService.ajaxPermissions($routeParams.id).then(function(msg){
            msg.data.data === 'manager'?undefined:$scope.noAuthority =  true;
        })
        //获取导航中的课题名称
        DataService.ajaxOverviewData($routeParams.id).then(function (data) {
            // console.log(data, 3535654564546465654)
            $scope.navTopicName = data.data.name;
        });
    }]);