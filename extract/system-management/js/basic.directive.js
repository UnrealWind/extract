angular.module('infi-basic')
    .directive('simulateSelect',['DataService','SYS',function (DataService,SYS) {
        return {  //点击的弹窗的显示
            restrict: 'A',
            templateUrl: 'js/html/simulate-select.html',
            scope: {
                viewDetail:"=",
                hospital:"=",
                department:"=",
                area:"=",
                entity:"=",
                name:"="
            },
            replace: true,
            link: function (scope, element) {
                scope.SYS = SYS;
                //获取医院信息列表
                scope.getList = function () {
                    if(scope.entity.$selected){
                        scope.entity.$selected = false;
                    }else{
                        if(scope.name == "医院"){
                            DataService.getMechanismHospital().then(function (msg) {
                                scope.entity.data = msg;
                                scope.department.$selected = false;
                                scope.entity.$selected = true;
                                matchOptionSelected(scope.entity.data,scope.entity.selected);
                            });
                        }else if(scope.name == "科室"&&scope.hospital.selected.id&&
                            scope.hospital.selected.name == scope.hospital.selected.$name){
                            DataService.getMechanismDepartment(scope.hospital.selected.id).then(function (msg) {
                                scope.entity.data = msg;
                                scope.hospital.$selected = false;
                                scope.entity.$selected = true;
                                matchOptionSelected(scope.entity.data,scope.entity.selected);
                            })
                        }
                    }
                }
                //获取选中的医院信息
                scope.selectOne = function (hospital) {
                    setSelected(scope.entity,hospital);
                }

                /**
                 * 再次获取下拉框数据时，原先选中若还在则将内容选中
                 * @param original  下拉框内容列表
                 * @param selected  选中的数据
                 */
                function matchOptionSelected(original,selected) {
                    if(selected.id&&original.data){
                        angular.forEach(original.data,function (entity) {
                            if(entity.id == selected.id){
                                entity.$active = true;
                            }
                        });
                    }
                }

                /**
                 * 设置科室或者医院的选中项
                 * @param original 科室或者医院数据
                 * @param newData  选中项
                 */
                function setSelected(original,newData) {
                    angular.forEach(original.data.data,function (entity) {
                        entity.$active = false;  //下拉项内容取消选中颜色
                    });
                    newData.$active = true;  //给新选中的数据添加颜色
                    newData.$name = newData.name;
                    original.selected = newData;
                    original.$selected = false;  //将下拉框关闭
                }

                /**
                 * 点击空白处，弹框依次关闭
                 */
                $(document).click(function (event) {
                    //浏览器兼容性
                    var e = event || window.event;
                    var elem = e.target || e.srcElement;
                    if(!$(elem).hasClass('hide-popup')){
                        scope.hospital.$selected = false;
                        scope.department.$selected = false;
                        scope.$apply();
                    }
                });
            }
        }
    }]).directive('deleteTip',['DataService','SYS','Utils',function (DataService,SYS,Utils) {
        return {  
            restrict: 'A',
            templateUrl: 'js/html/delete-tip.html',
            scope: {
                deleteId:"=",
                type:"=",
                init:"&"
            },
            replace: true,
            link: function (scope) {
                /**
                 * 关闭弹窗时将标识位复原
                 */
                scope.setData = function () {
                    scope.deleteDetail = {
                        errorTip:"确定要删除吗？",
                        type:"valit"
                    }
                }
                scope.setData();

                //确认删除方法
                scope.confirmDelete = function () {
                    //菜单\机构删除前要做教研
                    if((scope.type == 'menu'||scope.type == 'office')&&scope.deleteDetail.type =='valit'){
                        DataService.deleteValit(scope.deleteId,scope.type).then(function (msg) {
                            if(msg.status == SYS.STATUS_SUCCESS){
                                scope.deleteDetail.errorTip = "此属性有子级,确定要删除吗?";
                                scope.deleteDetail.type = 'direct';
                            }else if(msg.status == SYS.STATUS_BLANK){
                                directDelete();
                            }else{
                                Utils.sysTip(scope,msg);
                            }
                        });
                    }else{
                        directDelete();
                    }
                }

                /**
                 * 删除
                 */
                function directDelete() {
                    DataService.deleteDetail(scope.deleteId,scope.type).then(function (msg) {
                        if(msg.status == SYS.STATUS_SUCCESS){
                            msg.description = "删除成功";
                            Utils.sysTip(scope,msg);
                            $('#deleteTip').modal('hide');
                            scope.setData();
                            scope.init();
                        }else{
                            Utils.sysTip(scope,msg);
                        }
                    });
                }
            }
        }
    }]).directive('bfTemplate',function () {
        return {
            restrict:"A",
            priority:2000,  //优先级，模板html要在ng-repeat之前准备，但是compile优先级低于ng-repeat（1000）
            compile:function (element) {
                var template = element[0].outerHTML;
                return function (scope,element,attrs) {  //compile的返回值就是一个方法
                    scope.$template = template;
                    if(!scope.$dateResource){
                        scope.$dateResource = scope.$eval(attrs.bfTemplate);  //第一次给$dateResource赋值
                    }
                }
            }
        }
    }).directive('bfResource',['$compile',function ($compile) {
        return{
            restrict:'A',
            link:function (scope,element,attrs) {
                scope.$dateResource = scope.$eval(attrs.bfResource);
                var dom = $compile(scope.$template)(scope);  //在新的作用域下生成html
                element.replaceWith(dom);
            }
        }
    }]).directive('treeSelect',[function () {
        return{
            restrict:'A',
            templateUrl: 'js/html/tree-select.html',
            link:function (scope) {

            }
        }
    }]).directive('childTreeSelect',[function () {
        return{
            restrict:'A',
            templateUrl: 'js/html/child-tree-select.html',
            link:function (scope) {

            }
        }
    }]).directive('treeView',[function () {
        return{
            restrict:'ECMA',
            templateUrl: 'js/html/tree-view.html',
            scope:{
                dateResource:'=',
                checkedId:'=',
                parent:'='
            },
            link:function (scope) {
                //这里我只是增加了层级单选功能，所以只对该directive进行重构，尽量不破坏原有的逻辑
                scope.check = function (entity) {
                    !scope.parent?(entity.$selected = true,scope.$root.$selectedNavi = entity):
                        (entity.$selected = true,scope.$root.$selectedChildNavi = entity)
                }
            }
        }
    }])