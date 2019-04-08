angular.module('infi-basic')
.directive('choserChart',function (){
    return {  //逻辑配置页面统计图的显示
        restrict: 'A',
        templateUrl: 'js/html/echart.html',
        replace: true,
        scope:{
            chartData:'='
        },
        link:function (scope) {
            //gqm_debug 设置的绘图数据的操作不放在scope.$on方法里面就不会执行，即使controller里面chartData数据改变
            scope.$on('domReady', function () {
                angular.forEach(scope.chartData,function (chart,idx) {
                    var myChart = echarts.init(document.getElementById('chart'+idx)),
                        option = chart.detail;
                    myChart.setOption(option);
                })
            })
        }
    }
})
.directive('logicHistory',[function () {
   return {  //逻辑配置页面历史记录的显示
       restrict:'A',
       templateUrl:'js/html/logic-history.html',
       replace:true
   }     
}])
.directive('deleteTip',['TaskService','SYS','Utils',function (TaskService,SYS,Utils) {
    return {  //列表页中删除的提示框
        restrict: 'A',
        templateUrl: 'js/html/delete-tip.html',
        scope: {
            deleteId:"=",
            url:"=",
            init:"&"
        },
        replace: true,
        link: function (scope) {
            //确认删除方法
            scope.confirmDelete = function () {
                TaskService.deleteDetail({
                    url:scope.url,
                    id:scope.deleteId
                }).then(function (msg) {
                    if(msg.status == SYS.STATUS_SUCCESS){
                        msg.description = "删除成功";
                        Utils.sysTip(scope,msg);
                        $('#deleteTip').modal('hide');
                        scope.init();
                    }else{
                        Utils.sysTip(scope,msg);
                    }
                });
            }
        }
    }
}])
    .directive('ruleDetail',['TaskService','SYS','Utils','ViewMapping',function (TaskService,SYS,Utils,ViewMapping) {
        return {  //规则详情展示
            restrict: 'A',
            templateUrl: 'js/html/rule-detail.html',
            scope: {
                id:"=",
                viewType:"="
            },
            replace: true,
            link: function (scope) {
                scope.recordData = {
                    id:scope.id,
                    screenData:[],  //盛放条件选取数据
                    screenRecord:"",
                    chartData:null,
                    allData:null  //盛放返回的所有数据
                };

                //获得规则详情的数据
                TaskService.getGroupData('rule/getRule/',scope.recordData.id).then(function (msg){
                    scope.recordData.allData = msg.data;
                    if(msg.status == SYS.STATUS_SUCCESS){
                        var rule = msg.data;
                        if(rule.screenJson&&rule.screenJson!=""){
                            scope.recordData.screenData = ViewMapping.getScreeniCondition(JSON.parse(rule.screenJson));
                        }
                        scope.recordData.screenRecord =rule.content == null || rule.content == ""?[]:JSON.parse(rule.content);
                        scope.recordData.chartData =rule.results == null || rule.results == ""?[]:JSON.parse(rule.results);
                        scope.recordData.dept =rule.recommendSector;
                    }
                    scope.caseNumber = scope.recordData.allData && msg.data.recordNumber ? msg.data.recordNumber : 0;
                    scope.$emit( 'setDatas',msg.data );
                });
            }
        }
    }])
    .directive('taskRule',['TaskService',function (TaskService) {
        return {  //条件选取页面上面规则详情
            restrict: 'A',
            template: '<div class="infi-box">'+
                        '<h4>规则概述</h4>'+
                            '<div class="infi-rule-box">'+
                                '<div>规则名称:<span ng-bind="detail.name"></span></div>'+
                                '<div>规则内容:<span ng-bind="detail.content"></span></div>'+
                                '<div>推荐科室:<span ng-bind="detail.recommendSector"></span></div>'+
                            '</div>'+
                        '</div>',
            scope: {
                detail:"="
            },
            replace: true,
            link: function (scope) {
                scope.detail&&scope.detail.content ? scope.detail.content=JSON.parse(scope.detail.content):scope.detail.content="";
            }
        }
    }])
    .directive('showLoadTip',["Utils","$timeout",function (Utils,$timeout) {
        //条件选取页面内容没加载完全给个遮罩
        return{
            restrict:'A',
            replace:true,
            template:'<div class="infi-mask"><img class="infi-load-img" ng-src="/src/image/loading.gif" /></div>',
            link:function (scope) {
                scope.$watch(scope.summaryData,function(newValue,oldValue){
                    newValue!==null?loadTip:undefined;
                })
                
               function loadTip() {
                    if(!scope.summaryData.showLoad){
                        var tip = {
                            status:"error",
                            description:"系统繁忙，稍后重试"
                        }
                        scope.summaryData.showLoad = true;
                        Utils.sysTip(scope,tip);  //保存不成功的错误提示
                    }
                }
            }
        }
    }]);