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
                            '<p>{{promptMainContent}}</p> ' +
                        '</div>' +
                        '<div class="modal-footer"> ' +
                            '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button> ' +
                            '<button type="button" class="btn btn-primary" ng-click="promptMainContentSave()">确定</button>' +
                        '</div> ' +
                    '</div><!-- /.modal-content --> ' +
                '</div><!-- /.modal-dialog --> ' +
            '</div><!-- /.modal -->',
            link:function(scope){
                
            }
        }
}]).directive('videoTip',[function(){
        return {
            restrict: 'EA',
            template: 
            '<div class="modal fade"  id="videoTip">' +
                '<div class="modal-dialog"> ' +
                    '<div class="modal-content"> ' +
                        '<div class="modal-header"> ' +
                            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> ' +
                            '<h4 class="modal-title">提示</h4> ' +
                        '</div> ' +
                        '<div class="modal-body"> ' +
                            '<p>{{videoData.tip}}</p> ' +
                        '</div>' +
                        '<div class="modal-footer"> ' +
                            '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button> ' +
                            '<button type="button" class="btn btn-primary" ng-click="videoChange()">确定</button>' +
                        '</div> ' +
                    '</div><!-- /.modal-content --> ' +
                '</div><!-- /.modal-dialog --> ' +
            '</div><!-- /.modal -->',
            link:function(scope){
                
            }
        }
}])