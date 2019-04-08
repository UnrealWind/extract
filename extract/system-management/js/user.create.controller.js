angular.module("infi-basic").controller('UserCreateController',['$http','$scope','DataService','ViewMapping','$routeParams','SYS','Utils','$location','$timeout',
    function ($http,$scope,DataService,ViewMapping,$routeParams,SYS,Utils,$location,$timeout) {
    $scope.SYS = SYS;
    $scope.mechansimList = null;//机构列表
    $scope.childMechanismList = null;//子机构列表
    $scope.roleList = [];  //角色列表
    $scope.loginName = {  //用户名校验信息
        checked:null,  //返回的校验信息
        type:'',  //校验结果类型
        oldName:''  //修改时用户名修改到以前的用户名则不给'用户名存在'提示
    };
    $scope.pwdCommon = true;  //开始密码与确认密码相同
    //修改密码
    $scope.pwd = {
        oldPwd:"",
        newPwd:"",
        confirmPwd:"",
        common:true
    }
    
    //初始化
    function init() {

        setInitialization();
        //获取机构
        DataService.getMenuSource("office").then(function (msg) {
            $scope.mechansimList = msg;
            if($scope.viewDetail.type && $scope.viewDetail.type == "change"){   //修改时匹配上次选的机构是否存在
                //修改是匹配上次选中的机构
                $scope.viewDetail.userDetail.$companyName =
                    ViewMapping.matchOffice($scope.viewDetail.userDetail.companyId,$scope.mechansimList);


                // gqm_debug没有删除,所以不用校验
                // ViewMapping.checkSelected($scope.mechansimList,$scope.viewDetail.userDetail,"company");
            }else{  //新建时,机构第一个选中
                if(msg.status == $scope.SYS.STATUS_SUCCESS&&msg.data.length>0){
                    $scope.viewDetail.userDetail.companyId = msg.data[0].id;
                    $scope.viewDetail.userDetail.$companyName = $scope.mechansimList.data[0].name;
                    $scope.getRole();
                    // $scope.getMechanismList(msg.data[0].id);
                }
                // gqm_debug目前没有子机构的选择
                // else{  //机构没有时,子机构也给出相应提示
                //     $scope.mechanismList = {
                //         status:'error',
                //         description:msg.status != $scope.SYS.STATUS_SUCCESS?'服务器忙,请稍后再试':'暂无子机构,请先添加子机构'
                //     }
                // }
                
            }


            //机构修改时展示成树形结构供选择,所以为了适应插件进行数据整理
            ViewMapping.viewShow(msg.data);
            $scope.naviData = {};
            $scope.naviData.children = msg.data;
        });

        if($scope.viewDetail.type && $scope.viewDetail.type == "change"){  //修改
            DataService.getDetail($scope.viewDetail.id,"user").then(function (msg) {
                if(msg.status == $scope.SYS.STATUS_SUCCESS){
                    $scope.viewDetail.userDetail = msg.data;
                    $scope.viewDetail.userDetail.$companyName =
                        ViewMapping.matchOffice($scope.viewDetail.userDetail.companyId,$scope.mechansimList);

                    $scope.viewDetail.userDetail.$childCompanyName =
                        ViewMapping.matchOffice($scope.viewDetail.userDetail.officeId,$scope.mechansimList);
                    // $scope.getMechanismList($scope.viewDetail.userDetail.company.id);  //通过上次选的机构查找子机构
                    // $scope.loginName.oldName = msg.data.loginName;
                    ViewMapping.getChangedListChecked($scope.roleList.data,msg.data.roleIds);   //通过上次选的角色匹配角色列表
                    // gqm_debug没有删除,所以不用校验
                    // ViewMapping.checkSelected($scope.mechansimList,$scope.viewDetail.userDetail,"company");  //匹配上次选的机构是否存在
                    // ViewMapping.checkSelected($scope.mechanismList,$scope.viewDetail.userDetail,"office");   //匹配上次选的子机构是否存在

                    //gqm_debug 现在没有重置密码,重置密码功能是否存在
                    // DataService.resetPwd('validate',msg.data.loginName).then(function (msg) {
                    //     msg.status == $scope.SYS.STATUS_SUCCESS ? $scope.resetPwdType = 'ok' : undefined;
                    // });
                    $scope.getRole();
                }
                // gqm_debug目前没有子机构的选择
                // else{  //get接口没有正常返回数据,则给子机构一个提示
                //     $scope.mechanismList = {
                //         status:'error',
                //         description:'服务器忙,请稍后再试'
                //     }
                // }
            });
        }else{  //新建
            $scope.viewDetail.type = "create";
        }


    }

    $http.get(SYS.url+'/job-title/page').success(function (msg) {
        $scope.titleList= msg.page.content;
        init();
    });

    $scope.choseChildMechansimList = function () {
        DataService.getMenuSource("office",$scope.viewDetail.userDetail.companyId).then(function (msg) {
            $scope.childMechanismList = msg;
            $('#childTreeSelect').modal('show');
        });
    }

    $scope.getRole = function () {
        //获取机构下的角色
        DataService.getList("role",'?filter_EQ_companyId='+$scope.viewDetail.userDetail.companyId).then(function (msg) {
            $scope.roleList = msg;
            ViewMapping.getChangedListChecked($scope.roleList.data,$scope.viewDetail.userDetail.roleIds);
        });
    }

    //设置一些初始化属性
    function setInitialization() {
        $scope.viewDetail = {   //修改或者查看详情的数据
            id: $routeParams.id,  //修改或者查看时的id
            type:$routeParams.type,  //修改或者查看
            userDetail : {
                name:"",  //登录名称
                loginName:"",  //中文名称
                plainPassword:"",  //只在新增时需要密码
                companyId:"",  //机构id
                email:"",  //邮箱
                phone:"",  //电话
                roleIds:"",  //角色列表
                titleId:"0" //职称
            },
            $password:"",  //用户输入的密码
            $confirmPassword:""  //用户输入的确认密码
        };
    }



    //校验用户名是否存在
    $scope.checkUserName = function() {
        DataService.checkUserName($scope.viewDetail.userDetail.loginName,$scope.viewDetail.userDetail.companyId,$routeParams.id).then(function (msg) {
            $scope.loginName.checked = msg;
            if(msg.data&&msg.data.vaild == 'true'){
                $scope.loginName.type = 'valid';
            }
            else if(msg.data&&msg.data.vaild == 'false'){
                $scope.loginName.type = 'invalid';
            }else{
                $scope.loginName.type = 'error';
                $scope.loginName.checked.data.desc = $scope.loginName.checked.description;
            }
        });
    }
    
    //密码与确认密码的校验
    $scope.checkPwd = function () {
        $scope.viewDetail.$password != $scope.viewDetail.$confirmPassword?$scope.pwdCommon = false : $scope.pwdCommon = true;
    }

    /**
     * 机构修改时要切换角色,并且重新校验登录名称
     */
    $scope.changeCompany = function(){
        $scope.getRole();
        $scope.checkUserName();
    }

    /**
     * 弹窗中选择的机构进行应用
     * @param entity
     */
    $scope.changeTreeSelected = function(entity,child){
        if(entity && !child){
            $scope.viewDetail.userDetail.companyId = entity.id;
            $scope.viewDetail.userDetail.$companyName = entity.name;
        }else if(entity && child){
            $scope.viewDetail.userDetail.officeId = entity.id;
            $scope.viewDetail.userDetail.$childCompanyName = entity.name;
        }
        $scope.getRole();
        //$scope.changeCompany();
    }

    $scope.saveRole = function () {
        $scope.viewDetail.userDetail.roleIds = ViewMapping.getSubmitCheckedList($scope.roleList.data);  //获取新的角色列表
        $scope.viewDetail.type === "create" ? $scope.viewDetail.userDetail.plainPassword = md5($scope.viewDetail.$password) : undefined;
        DataService.saveCreatedData($scope.viewDetail.userDetail,"user").then(function (msg) {
            if(msg.status == $scope.SYS.STATUS_SUCCESS){
                $location.path("/user");
            }else{
                Utils.sysTip($scope,msg);
            }
        });
    }

    // =======修改密码--现在暂时用不到=================================================================================================
    //弹出修改密码弹框
    $scope.showChangePwd = function () {
        $("#changePwd").modal({backdrop: 'static'});
    }
    //密码弹框输入框置空
    $scope.clearChangedPwd = function () {
        $scope.pwd = {oldPwd:"",newPwd:"",confirmPwd:"",common:true};
    }
    //新密码与确认密码是否一致
    $scope.checkChangedPwd = function () {
        $scope.pwd.newPwd != $scope.pwd.confirmPwd ? $scope.pwd.common = false : $scope.pwd.common = true;
    }
    //修改密码确认
    $scope.confirmChangedPwd = function () {
        var filter = {oldPwd:md5($scope.pwd.oldPwd),newPwd:md5($scope.pwd.newPwd)};
        DataService.changePwd(filter).then(function (msg) {
            if(msg.status == $scope.SYS.STATUS_SUCCESS){
                $("#changePwd").modal('hide');

            }else{
                Utils.sysTip($scope,msg);
            }
            $scope.clearChangedPwd();
        });
    }
    // ====================重置密码==================================================================
    $scope.resetPwd = function () {
        DataService.resetPwd('save',$scope.loginName.oldName).then(function (msg) {
            if(msg.status == $scope.SYS.STATUS_SUCCESS){
                Utils.sysTip($scope,msg);
                $timeout(function () {
                    $location.path("/user");
                },2500)
            }else{
                Utils.sysTip($scope,msg);
            }
        });
    }
}]);