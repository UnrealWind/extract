/**
 * Created by geqimeng on 17-11-22.
 */
angular.module('infi-basic')
    .directive('extractTab',[function () {
        return{
            restrict:'A',
            templateUrl:'js/html/choser.html',
            scope:{
                contents:"=",
                tabs:"=",
                caterage:"=",
                updateOpt:"&"
            },
            link:function (scope) {
                /**
                 * 标签过多,20条以上的展示或者隐藏
                 * @param type
                 */
                scope.showTabsAll = function (type) {
                    scope.contents.showAll = type == 'down' ? true : false;
                }

                /**
                 * 展示具体的二级标签信息
                 * @param entity
                 * @param parent
                 */
                scope.showTabDetail = function (entity,parent) {
                    angular.forEach(parent,function (child) {
                        child.$active = false;
                    });
                    entity.$active = true;
                }
            }
        }
    }])
    .directive('optBtn',['Utils','DataService','SYS',function () {
        return{
            restrict:'A',
            templateUrl:'js/html/opt-btn.html',
            link:function (scope) {
                /**
                 * 二级标签的操作按钮点击操作,记录操作的数据
                 * @param info 操作的数据
                 * @param type 点击的按钮类型
                 * 执行的方法在controller里面
                 */
                scope.optTab = function (info,parent,type) {
                    scope.$emit('optDetail',{entity:info,caterage:scope.caterage,type:type});
                    scope.showTabDetail(info,parent);
                }
            }
        }
    }])
    .directive('deleteTip',['DataService','SYS','Utils',function (DataService,SYS,Utils) {
        return{
            restrict:'A',
            templateUrl:'js/html/delete-tip.html',
            link:function (scope) {
                scope.confirmDelete = function () {
                    DataService.deleteTagData(scope.optData).then(function (msg) {
                        if(msg.status == SYS.STATUS_SUCCESS){
                            $("#deleteTip").modal('hide');
                            scope.setTagDetail(scope.optData.caterage);
                        }else{
                            Utils.sysTip(scope,msg);
                        }
                    })
                }
            }
        }
    }])
    .directive('changeModal',['DataService','SYS','Utils',function (DataService,SYS,Utils) {
        return{
            restrict:'A',
            templateUrl:'js/html/change-modal.html',
            link:function (scope) {
                scope.confirmChange = function () {
                    DataService.changeTagData(scope.optData).then(function (msg) {
                        if(msg.status == SYS.STATUS_SUCCESS){
                            $("#changeModel").modal('hide');
                            scope.setTagDetail(scope.optData.caterage);
                        }else{
                            Utils.sysTip(scope,msg);
                        }
                    })
                }
            }
        }
    }])
    .directive('addChild',['DataService','SYS','Utils',function (DataService,SYS,Utils) {
        return{
            restrict:'A',
            templateUrl:'js/html/add-child.html',
            link:function (scope) {
                scope.allSelected = 'no';
                scope.confirmAdd = function () {
                    var addList = [];
                    if(scope.otherTags.$type == 'label'){
                        angular.forEach(scope.otherTags.data,function (entity) {
                            entity.$checked ? addList.push(entity) : undefined;
                        });
                    }else{
                        addList.push(scope.simpleSubmitTab);
                    }
                    scope.optData.caterage.knoTagParents = addList;
                    DataService.addOtherTags(scope.optData.caterage).then(function (msg) {
                        if(msg.status == SYS.STATUS_SUCCESS){
                            $("#addChild").modal('hide');
                            scope.closeModal();
                            scope.setTagDetail(scope.optData.caterage);
                        }else{
                            Utils.sysTip(scope,msg);
                        }
                    })
                }
                //全选按钮的操作,不能全选按钮绑定allSelected的值true/false,
                //动态改变allSelected的值,选中后绑定的allSelected就不是严格意义上的true/false,就会出现混乱
                scope.selectAllBox = function () {
                    scope.allSelected = scope.allSelected == 'yes' ? 'no' :'yes';
                    var checked = scope.allSelected == 'yes' ? true : false;
                    angular.forEach(scope.otherTags.data,function (entity) {
                        entity.$checked = checked;
                    });
                };

                //点击子级标签,动态的判断全选按钮是否选中
                scope.changeAllSelcet = function (tag) {
                    if(!tag.$checked){
                        scope.allSelected = 'no';
                    }else{
                        for(var i = 0;i < scope.otherTags.data.length;i++){
                            var tagNum = scope.otherTags.data[i];
                            if(!tagNum.$checked){
                                break;
                            }
                        }
                        scope.allSelected = i == scope.otherTags.data.length ? 'yes' : 'no';
                    }
                };
                //关闭弹窗,需要将全选按钮不选中
                scope.closeModal = function () {
                    scope.allSelected = 'no';
                }

                /**
                 * 添加带层级的标签时,记录需要添加的标签
                 */
                scope.$on('simpleSubmitTab',function (event,data) {
                    scope.simpleSubmitTab = data.tabs;
                })
            }
        }
    }])
    .directive('addTabs',[function () {
        return{
            restrict:'A',
            templateUrl:'js/html/add-tabs.html',
            scope:{
                contents:"=",
                tabs:"="
            },
            link:function (scope) {
                /**
                 * 标签过多,20条以上的展示或者隐藏
                 * @param type
                 */
                scope.showTabsAll = function (type) {
                    scope.contents.showAll = type == 'down' ? true : false;
                }

                /**
                 * 展示具体的二级标签信息
                 * @param entity
                 * @param parent
                 */
                scope.showTabDetail = function (entity,parent) {
                    scope.simpleSubmitTab ? scope.simpleSubmitTab.$submit = false : undefined;
                    angular.forEach(parent,function (child) {
                        child.$active = false;
                    });
                    entity.$active = true;
                    entity.$submit = true;
                    scope.simpleSubmitTab = entity;

                    //需要将选中的数据传到父级用于保存,因为作用域被切断
                    scope.$emit('simpleSubmitTab',{tabs:scope.simpleSubmitTab});
                }
            }
        }
    }])
    .directive('sysTip',[function(){
        return{
            restrict: 'A',
            template:'<div ng-if="sysTip.status" '+
            'ng-class="{\'ok\':\'notice\',\'querying\':\'notice\',\'error\':\'notice_error\',\'black\':\'notice_error\'}[sysTip.status]">'+
            '{{sysTip.description}}</div>'
        }
    }])
    .filter('tabsShow',[function(){
        //多级标签中tab切换没有子集的隐藏,因为判断是在repeat里面,所以会出现一个空的div
        return function(content) {
            for(var i = 0; i < content.length; i++){
                if(content[i].nodeType == 'label' || content[i].nodeType == 'leaf'){
                    return "";
                }
            }
            return "hide";
        }
    }])
    .service('Utils',['SYS','$timeout',function (SYS,$timeout) {
        function sysTip($scope,tip) {
            $scope.sysTip = angular.copy(tip);
            var show ;
            $timeout.cancel(show);
            show = $timeout(function () {
                if( $scope.sysTip ){
                    $scope.sysTip.status = undefined;
                }
            },2500);
        }

        function sysTipBefore($scope,description) {
            sysTip($scope,{
                status: SYS.STATUS_QUERYING,
                description: description
            });
        }

        return {
            sysTip: sysTip,
            sysTipBefore: sysTipBefore
        }
    }])
