/**
 * Created by geqimeng on 17-11-14.
 */
angular.module('infi-basic').controller('TagsController',['$scope','SYS','DataService','Session',function ($scope,SYS,DataService,Session) {
    $scope.SYS = SYS;
    $scope.deptInfo = [  //科室信息
        {
            deptId:"10002",
            hospId:"301",
            name:"心内科",
            value:"0"
        },{
            deptId:"10004",
            hospId:"301",
            name:"呼吸科",
            value:"1"
        },{
            deptId:"10005",
            hospId:"301",
            name:"中医科",
            value:"2"
        },{
            deptId:"10001",
            hospId:"301",
            name:"神内科",
            value:"3"
        },{
            deptId:"10059",
            hospId:"301",
            name:"肾内科",
            value:"4"
        },{
            deptId:"1",
            hospId:"401",
            name:"儿童医院",
            value:"5"
        }
    ];
    $scope.detpIndex = "0";  //选择的科室
    $scope.summaryData = null;  //外层所有数据
    $scope.detailData = {};  //点击弹出的具体数据
    //设置登录名称
    (function () {
        if(!$scope.name){
            var user = Session.getUser();
            if(user){
                $scope.name = user.name;
            }
        }
    })();

    function init() {
        $scope.getAllTags();
    }

    /**
     * 获取页面直接展示的标签信息
     */
    $scope.getAllTags = function () {
        var filter = {
            deptId : $scope.deptInfo[$scope.detpIndex].deptId,
            hospId : $scope.deptInfo[$scope.detpIndex].hospId
        };
        DataService.getAllTags(filter).then(function (msg) {
            $scope.summaryData = msg;
            msg.status == SYS.STATUS_SUCCESS ? $scope.leftTabChoice($scope.summaryData.data[0]) : undefined;
        });
    }

    /**
     * 左侧菜单切换方法
     * @param entity
     */
    $scope.leftTabChoice = function (entity) {
        angular.forEach($scope.summaryData.data,function (target) {
            //将左侧选中的清除
            target.$active = false;
            angular.forEach(target.children,function (child) {
                child.$active = false;
            });
        });
        entity.$active = true;
    }

    /**
     * 二级标签数据获取与展示
     * @param entity
     * @param parent  有parent为数据切换,没有标示操作成功后刷新
     */
    $scope.setTagDetail = function (entity,parent) {
        DataService.getDetailData(entity).then(function (msg){
            $scope.detailData = msg;
            if(parent){
                angular.forEach(parent.children,function (child) {
                    child.$active = false;
                });
                entity.$active = true;
            }
        });
    }

    /**
     * 删除,修改操作操作的数据记录
     * 此处是从directive里面调用的方法
     */
    $scope.$on('optDetail',function (event,data) {
        $scope.optData = data;
        if(data.type == 'add'){
            $scope.getOtherTab(data.caterage,data.entity);
        }else{
            $scope.optData.name = data.entity.tagClassName;
        }
    })

    /**
     * 获取没有添加的标签
     * @param caterage  '既往用药'顶级标签
     * @param parent  要添加子集的父级标签
     */
    $scope.getOtherTab = function (caterage,parent) {
        $scope.optData = {}; 
        $scope.optData.caterage = caterage;
        $scope.optData.entity = parent;
        caterage.parentId = parent ? parent.tagClassId : null;  //顶级标签parentId为null
        // caterage.childFlag = !parent ? caterage.childFlag : (parent && parent.children.length > 0) ? "1" : "0";//最后层级标签添加子集childFlag为0

        //判断是哪一层级的添加情况
        if(!parent&&$scope.detailData.status != SYS.STATUS_SUCCESS){
            caterage.childFlag = caterage.childFlag;
        }else if(!parent&&$scope.detailData.status == SYS.STATUS_SUCCESS){  //添加'既往用药'层级子集标签
            caterage.childFlag = 1;
        }else if(parent && parent.children.length > 0){  //给不是顶层级,不是最后一层级添加子集
            caterage.childFlag = 1;
        }else{  //给最后一层级,即没有子集的标签添加新的子集
            caterage.childFlag = 0;
        }

        //配置层级level
        if(!parent&&$scope.detailData.status != SYS.STATUS_SUCCESS){
            caterage.tagLevel = null;
        }else if(!parent&&$scope.detailData.status == SYS.STATUS_SUCCESS){  //给'既往用药'层级添加子标签,tagLevel选取子集的tagLevel进行赋值
            caterage.tagLevel = $scope.detailData.data[0].tagLevel;
        }else if(parent&&caterage.childFlag == "1"){  //给中间层级标签添加子集,选取本层级tagLevel
            caterage.tagLevel = parent.children[0].tagLevel;
        }else{  //给最后一层级,即没有子集的标签添加新的子集,选取父级tagLevel进行赋值
            caterage.tagLevel = parent.tagLevel;
        }

        if(!parent&&$scope.detailData.status != SYS.STATUS_SUCCESS){
            caterage.rn = 1;
        }else if(!parent&&$scope.detailData.status == SYS.STATUS_SUCCESS){  //给'既往用药'层级添加子标签,rn赋值子集最后一项的rn+1
            caterage.rn = $scope.detailData.data[$scope.detailData.data.length-1].rn + 1;
        }else{  //给最后一层级,即没有子集的标签添加新的子集,rn=1;;;给中间层级标签添加子集,rn为本层级最后一项rn+1
            parent.children.length == 0 ? caterage.rn = 1 : caterage.rn = parent.children[parent.children.length-1].rn + 1;
        }

        DataService.getChildList(caterage).then(function (msg) {
            $scope.otherTags = msg;
            $scope.otherTags.$type = !parent || (parent && parent.children.length > 0) ? "label" : "leaf";  //其他标签展示内容区别
        })
    }

    init();
}]);
