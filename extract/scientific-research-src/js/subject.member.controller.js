angular.module("infi-basic").controller('SubjectMemberController',
    ['$scope','SYS','$http','$routeParams','$timeout','subjectMemberService',function ($scope,SYS,$http,$routeParams,$timeout,subjectMemberService) {

        (function(){
            $(document).unbind().bind('click',function(event){
                //浏览器兼容性
                var e = event || window.event;
                var elem = e.target || e.srcElement;

                //循环判断至跟节点，防止点击的是div子元素
                while (elem) {
                    if ($(elem).hasClass('show-email-phone') === true  || $(elem).hasClass('infi-control-mark') === true) {
                        return;
                    }
                    elem = elem.parentNode;
                }

                //点击的不是div或其子元素则隐藏
                $scope.show = false;
                $scope.$apply();
            });
        })();

        //判断是成员管理还是成员邀请页面
        $scope.subjectNew = $routeParams.new;
        //存储选中的ID进行邀请和删除
        $scope.arrId = [];
        //下拉列表默认值
        $scope.jobTitle = 'all';
        $scope.UnJobTitle = 'all';
        $scope.deparment = 'all';
        $scope.UnDeparment = 'all';
        $scope.hospital = 'all';
        $scope.UnHospital = 'all';
        //邀请列表和未邀请列表的无数据显示
        $scope.showUninvited = false;
        $scope.showInvited = false;
        //权限分配
        $scope.permission = 'member';
        //存放筛选的数据的字段
        $scope.paramsInvited = {};
        $scope.paramsUnInvited = {};

        $http.get('data/subject-member.json').success(function (data) {
            //获取表格头部信息
            $scope.invitedColumns = data.invitedColumns;
            $scope.UnInvitedColumns = data.UnInvitedColumns;
            $scope.permissions = data.permissions;
        });

        $scope.invitedNumber = 1;
        $scope.getInvitedList = function(number){
            $scope.showInvited = false;
            $scope.invitedData = {};
            $scope.paramsInvited.page_number = number;
            $scope.paramsInvited.page_size = 10;
            subjectMemberService.getInvitedList($routeParams.subjectId,$scope.paramsInvited).then(function (data) {
                if(data.status == SYS.STATUS_SUCCESS){
                    $scope.invitedData = data.page.content;
                    $scope.invitedPage = data.page;
                    $scope.invitedPage.number ++;
                    $scope.invitedData.forEach(function (item) {
                        item.checked = false;
                        if(item.identity == 'own'){
                            item._identity = '负责人';
                        }else if(item.identity == 'member'){
                            item._identity = '科研人员';
                        }else if(item.identity == 'leader'){
                            item._identity = '管理员';
                        }
                    })
                    $scope.invitedPage = data.page;
                }else {
                    $scope.showInvited = true;
                }
            });
        }

        $scope.unInvitedNumber = 1;
        $scope.getUnInvitedList = function(number){
            $scope.showUninvited = false;
            $scope.unInvitedData = {};
            $scope.paramsUnInvited.page_number = number;
            $scope.paramsUnInvited.page_size = 10;
            subjectMemberService.getUnInvitedList($routeParams.subjectId,$scope.paramsUnInvited).then(function (data) {
               if(data.status == SYS.STATUS_SUCCESS){
                   $scope.unInvitedData = data.page.content;
                   $scope.unInvitedPage = data.page;
                   $scope.unInvitedPage.number ++;
                   $scope.unInvitedData.forEach(function (item) {
                       item.checked = false;
                       item.identity = 'member';
                   })
                   $scope.unInvitedPage = data.page;
               }else {
                   $scope.showUninvited = true;
               }
            })
        }
        $scope.updatePageAttend = function(number){
            $scope.getInvitedList(number);
        }
        $scope.updatePageAttendUnInvited = function(number){
            $scope.getUnInvitedList(number);
        }

        $scope.init = function() {
            //获取医院/科室/职称数据
            subjectMemberService.getHospitalData().then(function (data) {
                if(data.data.status == SYS.STATUS_SUCCESS){
                    $scope.hospitals = data.data.data;
                    $scope.hospitals.unshift({id:'all',label: '全部'});
                    $scope.UnHospitals = angular.copy($scope.hospitals);
                }
            });
            subjectMemberService.getDepartmentsData().then(function (data) {
                if(data.data.status == SYS.STATUS_SUCCESS){
                    $scope.departments = data.data.data;
                    $scope.departments.unshift({id:'all',label: '全部'});
                    $scope.UnDepartments = angular.copy($scope.departments);
                }
            });
            subjectMemberService.getJobTitlesData().then(function (data) {
                if(data.data.status == SYS.STATUS_SUCCESS){
                    $scope.jobTitles = data.data.data;
                    $scope.jobTitles.unshift({id:'all',label: '全部'});
                    $scope.UnJobTitles = angular.copy($scope.jobTitles);
                }
            });
            //获取基本信息
            subjectMemberService.getSubjectInfo($routeParams.subjectId).then(function (data) {
                $scope.subjectName = data.data.name
            })
            //获取邀请人员列表
            $scope.getInvitedList($scope.invitedNumber);

            $http.get(SYS.url+'subject/'+$routeParams.subjectId+'/member/identity').then(function (msg) {
                $scope.power = msg.data.data;
            });

        }
        $scope.init();


        $scope.inviteModals = function () {
            $scope.arrId = [];
            $('#invites-modal').modal();
            $scope.selectAll1 = false;
            //获取未邀请人员列表
            $scope.getUnInvitedList($scope.unInvitedNumber);
        }
        $scope.inviteDelete = function(){
           if($scope.arrId.length == 0){
               $scope.promptMainContent = '请选择要删除的人员';
               $('#general-prompt').modal();
           }else{
               $scope.promptMainContent = '确定删除么？';
               $('#general-prompt').modal();
           }
        }

        //删除已经邀请成员和确定邀请
        $scope.modalHide = function(){
            if($scope.promptMainContent == '确定删除么？'){
                subjectMemberService.deleteInvited($routeParams.subjectId,$scope.arrId).then(function (data) {
                    if(data.data.status == SYS.STATUS_SUCCESS){
                        $scope.promptMainContent = '删除成功';
                        $('#general-prompt').modal('hide');
                        $scope.invitedNumber = 1;
                        $scope.getInvitedList();
                        $scope.arrId = [];
                    }
                });
            }else if($scope.promptMainContent == '确定邀请？'){
                subjectMemberService.addInvited($routeParams.subjectId,$scope.invitedata).then(function (data) {
                    if(data.data.status == SYS.STATUS_SUCCESS){
                        $scope.promptMainContent = '邀请成功';
                        $('#general-prompt').modal('hide');
                        $('#invites-modal').modal('hide');
                        $scope.invitedNumber = 1;
                        $scope.getInvitedList();
                    }else {
                        $scope.promptMainContent = '邀请失败';
                    }
                });
            }else {
                $('#general-prompt').modal('hide');
                $('.show-email-phone').hide();
            }
        }

        //添加邀请
        $scope.inviteModal = function(){
            if($scope.invitedata.length == 0){
                $scope.promptMainContent = '请选择邀请人员';
                $('#general-prompt').modal();
            }else{
                $scope.promptMainContent = '确定邀请？';
                $('#general-prompt').modal();
            }
        }

        //根据条件进行筛选
        $scope.filterInvitedData = function(){
            $scope.getInvitedList($scope.invitedNumber);
        }
        $scope.filterUnInvitedData = function(){
            //获取未邀请人员列表
            $scope.getUnInvitedList($scope.unInvitedNumber);
        }
        //申请查看
        $scope.applicationView = function (ev,data) {
            if(data.checkStatus == 'apply'){
                $(ev.target).html('申请中').css({color: '#ccc',textDecoration: "none"});
                subjectMemberService.applicationView($routeParams.subjectId,data).then(function (data) {

                });
            }else if(data.checkStatus == 'success'){
                data['show'] = true;
                $scope.show = true;
                //$(ev.target).parent().next().toggle();
            }
        }


        //复制功能
        $scope.copyText = function (ev,data) {
            var $aux = $('<input/>').val($(ev.target).parent().find('em').html());
            $(ev.target).after($aux);
            $aux[0].select();
            document.execCommand("copy");
            $aux.remove();
            $('#general-prompt').modal();
            $scope.promptMainContent = '复制成功';

        }

        //存储选中的ID进行邀请和删除
        $scope.arrId = [];
        $scope.invitedata = [];
        $scope.selectAllData = function (checked,data,status) {
            $scope.arrId = [];
            $scope.invitedata = [];
            if($scope.invitedData.length != undefined || $scope.unInvitedData.length != undefined){
                if(checked == true){
                    data.forEach(function (item,i) {
                        item.checked = true;
                        if(status == 'invited'){
                            $scope.arrId.push(data[i].id);
                        }else if(status == 'uninvited'){
                            $scope.invitedata.push(data[i]);
                        }
                    })
                }else{
                    data.forEach(function (item) {
                        item.checked = false;
                    });
                }
            }
        }
        $scope.selectItem = function (select,data,index,status) {
            if(status == 'invited'){
                if(select == true) {
                    $scope.arrId.push(data[index].id);
                    if(data.length == $scope.arrId.length){
                        $scope.selectAll = true;
                    }else {
                        $scope.selectAll = false;
                    }
                }else{
                    $scope.arrId.splice( $scope.arrId.indexOf(data[index].id),1);
                    $scope.selectAll = false;
                }
            }else if(status == 'uninvited'){
                if(select == true) {
                    $scope.invitedata.push(data[index]);
                    if(data.length == $scope.invitedata.length){
                        $scope.selectAll1 = true;
                    }else {
                        $scope.selectAll1 = false;
                    }
                }else {
                    $scope.invitedata.splice($scope.invitedata.indexOf(data[index]),1);
                    $scope.selectAll1 = false;
                }
            }
        }

        //选择权限
        $scope.permissionChange = function(data,identity){
            console.log(identity)
            data.identity = identity;
        }

        //已经邀请数据筛选
        $scope.filterInvitedChange = function(){
            $scope.paramsInvited = {};
            if($scope.invitedName != ''){
                $scope.paramsInvited.filter_LIKE_name = $scope.invitedName;
            }
            if($scope.hospital != 'all'){
                $scope.paramsInvited.filter_EQ_companyId = $scope.hospital;
            }
            if($scope.deparment != 'all'){
                $scope.paramsInvited.filter_EQ_officeId = $scope.deparment;
            }
            if($scope.jobTitle != 'all'){
                $scope.paramsInvited.filter_EQ_titleId = $scope.jobTitle;
            }
            $scope.getInvitedList();
        }
        //未邀请数据筛选
        $scope.filterUnInvitedChange = function(){
            $scope.paramsUnInvited = {};
            if($scope.UnInvitedName != ''){
                $scope.paramsUnInvited.filter_LIKE_name = $scope.UnInvitedName;
            }
            if($scope.UnHospital != 'all'){
                $scope.paramsUnInvited.filter_EQ_companyId = $scope.UnHospital;
            }
            if($scope.UnDeparment != 'all'){
                $scope.paramsUnInvited.filter_EQ_officeId = $scope.UnDeparment;
            }
            if($scope.UnJobTitle != 'all'){
                $scope.paramsUnInvited.filter_EQ_titleId = $scope.UnJobTitle;
            }
            $scope.getUnInvitedList();
        }



        //页面跳转  上一页，下一页
        $scope.invitePrevious = function () {
            location.href = '#/subject-create/' + $routeParams.subjectId;
        }
        $scope.inviteNext = function() {
            location.href = '#/subject-detail/' + $routeParams.subjectId;
        }

        $scope.changePower = function (opt) {
            if (!opt.identity) return;
            var identity;
            opt.identity == 'member'?identity = 'leader':identity = 'member';
            $http.post(SYS.url+'subject/member/change/auth/'+opt.id+'?identity='+identity).then(function (msg) {
                msg.data.data?(function () {
                    if(opt.identity == 'leader'){
                        opt.identity = 'member';
                        opt._identity = '科研人员';
                    }else if(opt.identity == 'member'){
                        opt.identity = 'leader'
                        opt._identity = '管理员';
                    }
                })():'';
            });
        };



    }])

