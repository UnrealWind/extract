//这个directive用于监听历史信息是否渲染完毕
angular.module("infi-basic").directive('repeatHistoryFinish',['$timeout',function($timeout){
    return {
        restrict: 'ECMA',
        link:function(scope,element,attrs){
            if(scope.$last == true){
                $timeout(function() {
                    scope.$emit( 'renderOverHistory');
                });
            }
        }
    }
}])
angular.module('infi-basic')
    .directive('generalPrompt',[function(){
        return {
            restrict: 'EA',
            template:
            '<div class="modal fade"  id="general-prompt">' +
            '<div class="modal-dialog"> ' +
            '<div class="modal-content"> ' +
            '<div class="modal-header"> ' +
            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> ' +
            '<h4 class="modal-title">提示</h4> ' +
            '</div> ' +
            '<div class="modal-body"> ' +
            '<p> {{promptMainContent}} </p> ' +
            '</div>' +
            '<div class="modal-footer"> ' +
            '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button> ' +
            '<button type="button" class="btn btn-primary" ng-click="modalHide()">确定</button>' +
            '</div> ' +
            '</div>' +
            '</div>' +
            '</div>',
            link:function(scope){

            }
        }
    }]);