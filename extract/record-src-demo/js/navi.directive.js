angular.module('infi-basic').directive('recordNavi', ['RecordService','$timeout',function (RecordService,$timeout) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/navi.template.html',
        scope: {
            target : '=',
            parent: '=',
            targetTemplate:'='

        },
        link: function (scope,element,attrs) {

            scope.showChild = function (target,parent) {
                RecordService.showChild(target,parent);

                target.active && target.type?(function () {
                    scope.$emit('doRefresh',{
                        target:target
                    });
                    $(".infi-main").scrollTop(0);
                })():undefined;//切换左侧菜单（门诊，住院，体检）后定位到头部

                target.template?scope.$root.targetTemplate = target.template:undefined;

                //父级controller有一个curentType表示当前值
                scope.$emit('currentNavi',{
                    currentNavi:target
                });

                target.label.indexOf('基本信息')>-1||target.label.indexOf('诊断信息')>-1
                ||target.label.indexOf('药品信息')>-1 ||target.label.indexOf('门诊')>-1
                ||target.label.indexOf('住院')>-1?undefined:scope.$emit('changeDiagnosis',{
                    target:target
                });

                target.parent == '诊疗记录'?(scope.$root.targetTemplate = '',$timeout(function(){
                    scope.$root.targetTemplate = target.parent;
                },0)):'';

            }
        }
    }
}]);