angular.module("infi-basic").config(function(ivhTreeviewOptionsProvider) {
    ivhTreeviewOptionsProvider.set({
        defaultSelectedState: false,
        validate: true
    });
});

angular.module("infi-basic").controller('RoleCreateController',
    ['$scope','DataService','ViewMapping','$routeParams','SYS','Utils','$location','ivhTreeviewMgr',
        function ($scope,DataService,ViewMapping,$routeParams,SYS,Utils,$location,ivhTreeviewMgr) {
    $scope.SYS = SYS;
    $scope.mechansimList = null;
    $scope.menuList = [];
    $scope.enNameChecked= {
        type:'',
        checked:null
    };
    //初始化
    function init() {
        setInitialization();
        //获取机构
        DataService.getMenuSource("office").then(function (msg) {

            $scope.mechansimList = msg;
            if($scope.mechansimList.data&&$scope.mechansimList.data.length > 0){
                if($scope.viewDetail.type && $scope.viewDetail.type != "change"){ //新建
                    //新增时，机构列表第一项选中
                    $scope.viewDetail.roleDetail.companyId = $scope.mechansimList.data[0].id;
                    $scope.viewDetail.roleDetail.$companyName = $scope.mechansimList.data[0].name;
                }else{
                    //修改是匹配上次选中的机构
                    $scope.viewDetail.roleDetail.$companyName =
                        ViewMapping.matchOffice($scope.viewDetail.roleDetail.companyId,$scope.mechansimList);
                }
                //机构修改时展示成树形结构供选择,所以为了适应插件进行数据整理
                ViewMapping.viewShow(msg.data);
                $scope.naviData = {};
                $scope.naviData.children = msg.data;
            }
            
            // gqm_debug现在没有机构的删除,所以不存在匹配问题
            // else{  //修改时匹配上次选的机构是否存在
            //     ViewMapping.checkSelected($scope.mechansimList,$scope.viewDetail.roleDetail,"office");
            // }
        });
        //获取菜单
        DataService.getMenuSource("menu").then(function (msg) {
            (function fix(arr) {
                arr.forEach(function (n,i) {
                    n['label'] = n.name;
                    n.children?fix(n.children):undefined;
                })
            })(msg.data);

            ViewMapping.getMenuChanges(msg.data,$scope.viewDetail.roleDetail.menuIds);//通过上次选的角色匹配角色列表
            $scope.menuList = msg.data;

            //这里利用settimeout的队列后执行于主体函数，完成了该功能
            setTimeout(function () {
                ivhTreeviewMgr.validate($scope.menuList, false);
                $scope.$apply();
            },0)
        });

        if($scope.viewDetail.type && $scope.viewDetail.type == "change"){  //修改
            DataService.getDetail($scope.viewDetail.id,"role").then(function (msg) {
                if(msg.status == $scope.SYS.STATUS_SUCCESS){
                    $scope.viewDetail.roleDetail = msg.data;
                    //修改时匹配上次选中的机构
                    $scope.viewDetail.roleDetail.$companyName =
                        ViewMapping.matchOffice($scope.viewDetail.roleDetail.companyId,$scope.mechansimList);

                    ViewMapping.getChangedListChecked($scope.menuList,msg.data.menuIds);//通过上次选的角色匹配角色列表
                    // gqm_debug现在没有机构的删除,所以不存在匹配问题
                    // ViewMapping.checkSelected($scope.mechansimList,$scope.viewDetail.roleDetail,"office");//修改时匹配上次选的机构是否存在
                }
            });
        }else{  //新建
            $scope.viewDetail.type = "create";
        }

    }

    //设置一些初始化属性
    function setInitialization() {
        $scope.viewDetail = {   //修改或者查看详情的数据
            id: $routeParams.id,  //修改或者查看时的id
            type:$routeParams.type,  //修改或者查看
            roleDetail : {
                name:"",  //角色名称
                companyId:"",  //机构id
                enname:"",  //英文名称
                dataScope:"8",  //数据范围
                menuIds:""  //选择的菜单列表
            }
        };
    }

    init();

    //校验角色英文名是否存在
    $scope.checkRoleName = function() {
        DataService.checkRoleName($scope.viewDetail.roleDetail.enname,$scope.viewDetail.roleDetail.companyId).then(function (msg) {
            $scope.enNameChecked.checked = msg;
            if(msg.data&&msg.data.vaild == 'true'){
                $scope.enNameChecked.type = 'valid';
            }
            else if(msg.data&&msg.data.vaild == 'false'){  //英文名称存在
                $scope.enNameChecked.type = 'invalid';
            }else{
                $scope.enNameChecked.type = 'error';
                $scope.enNameChecked.checked.data.desc = $scope.enNameChecked.checked.description;
            }
        });
    }

    /**
     * 弹窗中选择的机构进行应用
     * @param entity
     */
    $scope.changeTreeSelected = function(entity){
        if(entity){
            $scope.viewDetail.roleDetail.companyId = entity.id;
            $scope.viewDetail.roleDetail.$companyName = entity.name;

            $scope.checkRoleName();
        }
    }

    /**
     * 保存角色
     */
    $scope.saveRole = function () {
        $scope.viewDetail.roleDetail.menuIds = ViewMapping.getMenuSubmit($scope.menuList);
        DataService.saveCreatedData($scope.viewDetail.roleDetail,"role").then(function (msg) {
            if(msg.status == $scope.SYS.STATUS_SUCCESS){
                $location.path("/role");
            }else{
                Utils.sysTip($scope,msg);
            }
        });
    }
}]);
