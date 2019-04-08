angular.module("infi-basic")
    .directive("analysisBtnSelect",['PageInteractiveService',function (PageInteractiveService) {
        // 挂号分析 按天/周/月统计按钮组合
        return{
            restrict:"A",
            templateUrl:"js/html/analysis-btn-select.html",
            replace:true,
            scope:{
                original:'=',
                urlId:'=',
                date:'='
            },
            link:function (scope) {
                scope.changeStatisticsType = function (type) {
                    scope.original.staType = type;  //选择的统计类型赋值
                    PageInteractiveService.searchAnalysisData(scope.original,scope.date);
                }
            }
        }
    }])
    .directive("analysisCheckList",['PageInteractiveService','SYS',function (PageInteractiveService,SYS) {
        // 挂号分析 左侧checkbox和右侧指标checkbox组合
        return{
            restrict:"A",
            templateUrl:"js/html/analysis-check-list.html",
            replace:true,
            scope:{
                original:'=',
                urlId:'=',
                title:'=',
                date:'=',
                list:'=',
                colCell:'='
            },
            link:function (scope) {
                scope.SYS = SYS;
                scope.changeStatisticsType = function (entity) {
                    PageInteractiveService.searchAnalysisData(scope.original,scope.date,entity,scope);
                }
            }
        }
    }])
    .directive("analysisSelectedTag",[function () {
        // 挂号分析 筛选类型\指标等对应关系展示
        return{
            restrict:"A",
            templateUrl:"js/html/analysis-selected-tag.html",
            replace:true,
            scope:{
                leftData:'=',
                rightData:'='
            },
            link:function (scope) {}
        }
    }])
    .directive("costMonitorRanking",['PageInteractiveService',function (PageInteractiveService) {
        // 费用监控 显示个数组合
        return{
            restrict:"A",
            templateUrl:"js/html/cost-monitor-ranking.html",
            replace:true,
            scope:{
                original:'=',
                count:'=',
                visitData:"="
            },
            link:function (scope) {
                scope.drawRankingChart = function () {
                    PageInteractiveService.searchCostRanking(scope.original,scope.count,scope.visitData);
                };
            }
        }
    }])
    .directive("costMonitorBtn",['PageInteractiveService',function (PageInteractiveService) {
        // 费用监控 按费用/人次排行按钮组合
        return{
            restrict:"A",
            templateUrl:"js/html/cost-monitor-btn.html",
            replace:true,
            scope:{
                original:'=',
                count:'=',
                visitData:"="
            },
            link:function (scope) {
                scope.drawRankingChart = function (type) {
                    scope.original.common[scope.count].rank = type;  //选择的排行类型赋值
                    PageInteractiveService.searchCostRanking(scope.original,scope.count,scope.visitData);
                };
            }
        }
    }])
    .directive("chargeAnalysisTable",['SYS',function (SYS) {
        // 费用分析 表格展示
        return{
            restrict:"A",
            templateUrl:"js/html/charge-analysis-table.html",
            replace:true,
            scope:{
                original:'=',
                getDeptCharge:'&',
                getDeptLinkage:'&',
                columnName:'=',
                keyName:'='
            },
            link:function (scope) {
                scope.SYS = SYS;
            }
        }
    }])
    .directive("filterBtnList",[function () {
        // 费用分析 所有按钮组合
        return{
            restrict:"A",
            templateUrl:"js/html/filter-btn-list.html",
            replace:true,
            scope:{
                original:'=',
                key:'=',
                list:'=',
                opt:'&'
            },
            link:function (scope) {
                scope.changeStatisticsType = function (type) {
                    scope.original[scope.key] = type;
                    scope.opt();
                };
            }
        }
    }])
    .directive('repeatFinishTable',['$timeout',function($timeout){
        return {  //左,右侧两个table等高   目前用不到
            restrict: 'ECMA',
            link:function(scope,element,attrs){
                var data = scope.$eval(attrs.repeatFinishTable);
                if(data){
                    if(scope.$last == true && !scope.$first ){  //采用repeatFinish方法
                        $timeout(function() {
                            var leftHeight = $('#'+data.leftTable).height(),
                                rightHeight = $('#'+data.rightTable).height();
                            if(leftHeight>-1&&rightHeight>-1){
                                if(leftHeight > rightHeight){
                                    $('#'+data.rightTable).height(leftHeight);
                                }else if(leftHeight < rightHeight){
                                    $('#'+data.leftTable).height(rightHeight);
                                }
                            }
                        });
                    }
                }
            }
        }
    }])
    .directive('kpiImg',['SYS',function(SYS){
        return {  //带有图片的kpi
            restrict: 'ECMA',
            templateUrl:"js/html/kpi-img.html",
            scope:{
                original:'='
            },
            link:function (scope) {
                scope.SYS = SYS;
            }
        }
    }])
    .directive('kpiNoImg',['SYS',function(SYS){
        return {  //不带图片的kpi
            restrict: 'ECMA',
            templateUrl:"js/html/kpi-no-img.html",
            scope:{
                original:'='
            },
            link:function (scope) {
                scope.SYS = SYS;
            }
        }
    }])
    .directive('tableList',['SYS',function(SYS){
        return {  //表格公共控件
            restrict: 'ECMA',
            replace:true,
            templateUrl:"js/html/table-list.html",
            scope:{
                original:'=',
                recordList:"=",
                tablesId:"=",
                scroll:"=",
                getChildTable:"&"
            },
            link:function (scope) {
                scope.SYS = SYS;
            }
        }
    }])
    .directive('deptSelect',['SYS',function(SYS){
        return {  //科室的公共控件
            restrict: 'ECMA',
            replace:true,
            templateUrl:"js/html/dept-select.html",
            scope:{
                original:'=',
                recordList:"=",
                changeData:"&"
            },
            link:function (scope) {
                scope.SYS = SYS;
            }
        }
    }])
    .directive('identitySelect',['SYS',function(SYS){
        return {  //身份的公共控件
            restrict: 'ECMA',
            replace:true,
            templateUrl:"js/html/identity-select.html",
            scope:{
                original:'=',
                recordList:"=",
                changeData:"&"
            },
            link:function (scope) {
                scope.SYS = SYS;
            }
        }
    }])
    .directive('numberSelect',['SYS',function(SYS){
        return {  //号类的公共控件
            restrict: 'ECMA',
            replace:true,
            templateUrl:"js/html/number-select.html",
            scope:{
                original:'=',
                changeData:"&"
            }
        }
    }])
    .directive('timeShow',['$interval',function($interval){
        // 监控页面 当前时间的显示
        return {
            restrict: 'ECMA',
            replace:true,
            templateUrl:"js/html/time-show.html",
            link:function (scope) {
                scope.now = new Date();
                $interval(function () {
                    scope.now = new Date();
                }, 1000);
            }
        }
    }])
    .directive('selectSimulate',['SYS',function(SYS){
        // 科室重写插件
        return {
            restrict: 'ECMA',
            replace:true,
            scope:{
                original:'=',  //要添加的数据
                recordList:"=",  //显示的数据
                title:"=",  //label的名称
                showName:"=",  //list显示的名称
                commitId:"=",  //回传的数据(后台数据的key值)
                select:"=",  //添加的数据的属性值
                changeData:"&"  //选择后要运行的方法
            },
            templateUrl:"js/html/select-simulate.html",
            link:function (scope,event) {
                scope.$watch('recordList',function () {
                    //注意数据隔几分钟刷一次,先前选择的科室不动
                    scope.deptList = $.extend(true,{},scope.recordList);  //给科室列表深拷贝赋值,否则一个页面多科室列表数据会出问题
                    !scope.$selectedData ? scope.$selectedData = scope.deptList.data.result[0] : undefined;  //第一次赋值选中时赋列表第一个
                    scope.$selectedData.selected = true;
                });
                scope.SYS = SYS;

                /**
                 * 选中的值
                 * @param list
                 */
                scope.selectItem = function (list) {
                    scope.$selectedData.selected = false;  //将上一个选中值标示去掉
                    scope.$selectedData = list;  //重新赋值选中值
                    list.selected = true;
                    scope.original[scope.select] = scope.$selectedData[scope.commitId];  //将选中的具体数据赋值给需要查询的原始变量
                    scope.changeData({original:scope.original});  //重新绘图,挂号分析与其他的页面不太一样,需要original的值
                }

                $(document).off('click');  //防止绑定多次,重复调用
                //模拟下拉框处于展开状态,点击旁边/其他下拉框,此下拉框收起
                //选中模拟下拉框中数据则下拉框收起
                $(document).click(function (event) {
                    //浏览器兼容性
                    var e = event || window.event;
                    var elem = e.target || e.srcElement;
                    if($(elem).hasClass('infi-simulate-input')){  //点击的是模拟下拉框
                        var selectList = $(".infi-select-list");
                        var list = $(elem).siblings('.infi-select-list');  //当前点击的模拟下拉框
                        selectList.each(function () {  //将所有模拟下拉框循环,当前不是点击的自己的展开的下拉框则收起
                            $(this).hasClass('show')&& list[0]!=$(this)[0] ? $(this).removeClass('show').addClass('hide') : undefined;
                        });

                        if(list.hasClass('hide')){  //原先处于隐藏状态则展开
                            list.removeClass('hide').addClass('show');
                        }else if(list.hasClass('show')){  //原先处于展开状态则隐藏
                            list.removeClass('show').addClass('hide');
                        }
                    }else{  //点击的不是模拟下拉框,则模拟下拉框收起
                        $(".infi-select-list").removeClass('show').addClass('hide');
                    }
                });
                //因为select没有点击事件,所以上述click事件对于select不起作用,只能采用select的focus事件
                $('select.infi-opt-search-time').focus(function () {
                    $(".infi-select-list").removeClass('show').addClass('hide');
                })
            }
        }
    }])
    .directive('tableListTitle',[function(){
        return {  //表格表头公共控件,用于表格滚动表头不动
            restrict: 'ECMA',
            replace:true,
            templateUrl:"js/html/table-list-title.html",
            scope:{
                original:"=",
                recordList:"="
            },
            link:function (scope) {
            }
        }
    }])
    .directive('tableTitleScroll',['$timeout',function($timeout){
        return {  //带滚动条的table的title是否有滚动条
            restrict: 'ECMA',
            link:function(scope,element,attrs){
                var data = scope.$eval(attrs.tableTitleScroll);  //传递数据的表格才会显示滚动条
                if(data&&scope.$last == true && (!scope.$first||scope.$first == true)){
                    $timeout(function() {
                        var tbList = $(element).parents('.infi-nopage-table'),  //显示的表格
                            tbListY = $(element).parents('.infi-table-scoll-y'),  //表格的父级div
                            tbTitle = tbListY.prev(),  //重写的表格表头
                            tbListH = tbList.height(),  //表格高度
                            tbListYH = tbListY.height(),  //表格父级div高度
                            tbTitleH = 0-tbTitle.height();  //表格需要向上移动的高度
                        if(tbListH < tbListYH){  //表格高度不大于父级高度,不用出现滚动条
                            tbTitle.css('padding-right','0px');
                            data == 'scroll' ? tbList.height((tbListYH-1)+'px') : undefined;  //莫名的设置的高度多1px,所以需要减掉
                        }
                        tbListY.css('margin-top',tbTitleH);  //表格需要向上移动的距离
                    });
                }
            }
        }
    }])
    //单模块打印的代码，备份一下
    // .directive('printAdd',[function(){
    //     return {  //打印模板
    //         restrict: 'ECMA',
    //         replace: true,
    //         templateUrl: "js/html/print-add.html",
    //         scope: {
    //             printList: "=",  //页面打印整个列表值
    //             unique:"="  //打印的模块的id
    //         },
    //         link: function (scope) {
    //             //将添加的打印Id加入到打印列表中
    //             scope.collectId = function () {
    //                 angular.forEach(scope.printList,function (list,index) {
    //                     //添加模块将新添加的放到最后,需要调换数组中选项位置
    //                     if(list.id == scope.unique && !list.$checked){
    //                         scope.printList.splice(index,1);   //匹配项删除
    //                         scope.printList.push(list);  //添加到最后
    //                         list.$checked = true;  //标识位设为true
    //                     }
    //                 })
    //                 scope.printList.$checked = true;
    //             }
    //         }
    //     }
    // }])
    // .directive('printSection',['PrintService',function(PrintService){
    //     return {  //打印模板
    //         restrict: 'ECMA',
    //         replace: true,
    //         templateUrl: "js/html/print-section.html",
    //         scope: {
    //             printList: "="
    //         },
    //         link: function (scope) {
    //             scope.print = function () {
    //                 $(".print-container").append($(".infi-fix-header").clone());
    //                 angular.forEach(scope.printList,function (list) {
    //                     if(list.$checked){
    //                         //找到需要转化图片的echarts图形
    //                         var canvasParents = $('#'+list.id+' .infi-draw-chart canvas').parent().parent();
    //                         if(canvasParents.length > 0){
    //                             angular.forEach(canvasParents,function (canvasParent) {
    //                                 var img = $(canvasParent).next(),   //盛放转化的图片
    //                                     canvasId = $(canvasParent).attr('id'),
    //                                     canvasDataUrl = PrintService.getCanvasDataURL(canvasId);  //获取canvas转化成base64位的src
    //                                 $(canvasParent).addClass('noprint');
    //                                 img.attr('src',canvasDataUrl);
    //                             })
    //                         }
    //                         //将要打印的区域克隆到容器里,不用克隆原先html会消失
    //                         $(".print-container").append($("#"+list.id).clone());
    //                     }
    //                 })
    //                 $(".print-container").removeClass('hide');
    //                 PrintService.bindPrint("printContainer");
    //                 $(".print-container").addClass('hide');  //将容器隐藏
    //                 $(".print-container").html('');  //将容器清空
    //             }
    //
    //             //关掉打印列表
    //             scope.closeSection = function () {
    //                 scope.printList.$checked = false;
    //             }
    //             //删除某个模块
    //             scope.closeItem = function(entity){
    //                 entity.$checked = false;
    //             }
    //             //向上移动模块
    //             scope.upItem = function (index) {
    //                 if(index == 0) {
    //                     return;
    //                 }
    //                 scope.printList[index] = scope.printList.splice(index-1, 1, scope.printList[index])[0];
    //             }
    //             //向下移动模块
    //             scope.downItem = function (index) {
    //                 if(index == scope.printList.length -1) {
    //                     return;
    //                 }
    //                 scope.printList[index] = scope.printList.splice(index+1, 1, scope.printList[index])[0];
    //             }
    //             //清空打印列表
    //             scope.clearSection = function () {
    //                 angular.forEach(scope.printList,function (list) {
    //                     list.$checked ? list.$checked = false : undefined;
    //                 })
    //             }
    //         }
    //     }
    // }])


    .directive('printAdd',[function(){
        return {  //打印模板
            restrict: 'ECMA',
            replace: true,
            templateUrl: "js/html/print-add.html",
            scope: {
                printList: "=",     //页面打印整个列表值（包含页面模块div的全部id列表）
                printAllList: "=",  //全局变量，存储需要跨模块打印的id列表
                unique:"="  //打印的模块的id
            },
            link: function (scope) {
                //将添加的打印Id加入到打印列表中
                scope.collectId = function () {
                    angular.forEach(scope.printList,function (list,index) {
                        if(list.id == scope.unique && !list.$checked){//判断checked属性，防止重复添加
                            list.$checked = true;                     //将printList里的选中状态设置为true
                            scope.printAllList.push(angular.copy(list));//将选中的id列表数据添加进printAllList

                            // scope.printList.splice(index,1);   //匹配项删除
                            // scope.printList.push(list);  //添加到最后
                             //标识位设为true
                        }
                    })
                    scope.printAllList.$checked = true;  //这个checked用于页面显示
                }
            }
        }
    }])
    .directive('printSection',['PrintService',function(PrintService){
        return {  //打印模板
            restrict: 'ECMA',
            replace: true,
            templateUrl: "js/html/print-section.html",
            scope: {
                printList: "=",//当前页面所有id集合，根据页面会变，包含选中的和不选中的
                printAllList: "="//包含所有页面选中的
            },
            link: function (scope) {
                //打印按钮的方法
                scope.print = function () {
                    angular.forEach(scope.printList,function (list) {
                        if(list.$checked){
                            if(!$('#printCache').children().is('#'+list.id)){//判断容器中是否存在相同id的div
                                //找到需要转化图片的echarts图形
                                $('#'+list.id).prepend($(".infi-main .infi-hide-header").clone()[0]);
                                var canvasParents = $('#'+list.id+' .infi-draw-chart canvas').parent().parent();
                                if(canvasParents.length > 0){
                                    angular.forEach(canvasParents,function (canvasParent) {
                                        var img = $(canvasParent).next(),   //盛放转化的图片
                                            canvasId = $(canvasParent).attr('id'),
                                            canvasDataUrl = PrintService.getCanvasDataURL(canvasId);  //获取canvas转化成base64位的src
                                        $(canvasParent).addClass('noprint');
                                        img.attr('src',canvasDataUrl);
                                    })
                                }
                                //将要打印的区域克隆到容器里,不用克隆原先html会消失
                                $("#printCache").append($("#"+list.id).clone());
                                $(".infi-main #"+list.id+' .infi-hide-header').remove();//将页面header去掉，不然下次会重复添加
                            }
                        }
                    })
                    //因为有排序功能,所以需要打印的内容先放到缓存区
                    angular.forEach(scope.printAllList,function(allList){
                        $('#printContainer').append($('#printCache #'+allList.id));//按照id顺序将缓存区的dom、一次填到打印容器里
                    })
                    $("#printContainer").removeClass('hide');
                    PrintService.bindPrint("printContainer");
                    $("#printContainer").addClass('hide');  //将容器隐藏
                    $("#printContainer").html('');  //将容器清空
                    $("#printCache").html('');  //将容器清空
                    scope.printAllList.splice(0,scope.printAllList.length);//清空数组
                    scope.printAllList.$checked = false;                   //显示置为false
                    angular.forEach(scope.printList,function(entity){//将所有选中的清空
                        entity.$checked = false;
                    })
                };
                /**
                 * 离开页面之前把选中的模块先放到缓存区
                 */
                scope.print1 = function () {
                    angular.forEach(scope.printList,function (list) {
                        if(list.$checked){
                            if(!$('#printCache').children().is('#'+list.id)) {//如果列表中之前存在则不需要添加
                                $('#'+list.id).prepend($(".infi-main .infi-hide-header").clone()[0]);//小模块加标题
                                //找到需要转化图片的echarts图形
                                var canvasParents = $('#' + list.id + ' .infi-draw-chart canvas').parent().parent();
                                if (canvasParents.length > 0) {
                                    angular.forEach(canvasParents, function (canvasParent) {
                                        var img = $(canvasParent).next(),   //盛放转化的图片
                                            canvasId = $(canvasParent).attr('id'),
                                            canvasDataUrl = PrintService.getCanvasDataURL(canvasId);  //获取canvas转化成base64位的src
                                        $(canvasParent).addClass('noprint');
                                        img.attr('src', canvasDataUrl);
                                    })
                                }
                                //将要打印的区域克隆到容器里,不用克隆原先html会消失
                                $("#printCache").append($("#" + list.id).clone());
                                $(".infi-main #"+list.id+' .infi-hide-header').remove();//将页面header去掉，不然下次会重复添加
                            }
                        }
                    })
                }

                //关掉打印列表
                scope.closeSection = function () {
                    scope.printAllList.$checked = false;
                }
                //删除某个模块
                scope.closeItem = function(entity){
                    //这个有两种情况，删除本模块，删除别的页面模块，删除本模块就在printList中选中状态置为false
                    //删除其他模块只需要在printAllList中去掉就行，因为跳转到其他页面会重新获取printList列表
                    //将printList中的这个选中状态置为false
                    angular.forEach(scope.printList,function(list){
                        if(list.id == entity.id){
                            list.$checked = false;
                        }
                    })
                    //将当前元素从printAllList中删除
                    angular.forEach(scope.printAllList,function(allList,index){
                        if(allList.id == entity.id){
                            scope.printAllList.splice(index,1);
                        }
                    })
                }
                //向上移动模块
                scope.upItem = function (index) {
                    if(index == 0) {
                        return;
                    }
                    scope.printAllList[index] = scope.printAllList.splice(index-1, 1, scope.printAllList[index])[0];
                }
                //向下移动模块
                scope.downItem = function (index) {
                    if(index == scope.printList.length -1) {
                        return;
                    }
                    scope.printAllList[index] = scope.printAllList.splice(index+1, 1, scope.printAllList[index])[0];
                }
                //清空打印列表
                scope.clearSection = function () {
                    //清空printList选中状态
                    angular.forEach(scope.printList,function (list) {
                        list.$checked ? list.$checked = false : undefined;
                    })
                    scope.printAllList.splice(0,scope.printAllList.length);//清空数组
                }
                //离开页面之前把触发的事件
                scope.$on("$destroy", function() {
                    scope.print1();
                })
                
            }
        }
    }])
;
    