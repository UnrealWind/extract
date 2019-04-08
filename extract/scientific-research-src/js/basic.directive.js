angular.module('infi-basic').directive('invitesModal',[function () {
    return {
        restrict: 'EA',
        template: '<div class="modal fade"  id="invites-modal" >' +
        '    <div class="modal-dialog" style="width:80%;">' +
        '        <div class="modal-content">' +
        '            <div class="modal-header">' +
        '                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
        '                <h4 class="modal-title">选择用户</h4>' +
        '            </div>' +
        '            <div class="modal-body" style="overflow: hidden;">' +
        '                <ul class="floatright">' +
        '                    <li class="input-group floatright" style="width:500px;">' +
        '                        <input type="text" class="form-control input-lg" value="inviteKeyword" ng-model="inviteKeyword" style="height:34px;"><span class="input-group-addon btn btn-primary" style="" ng-click="inviteSearch()">搜索</span>' +
        '                    </li>' +
        '                </ul>' +
        '                <div infi-table columns="listColumns" select-main="selectMain" content="listDatas" table-check-box=\'tableCheckBox\' opts="tableOpts" update-page="getLists(page)" btn-callback="pageFns(entity,type)"></div>' +
        '            </div>' +
        '            <div class="modal-footer">' +
        '                <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="cancel()">取消</button>' +
        '                <button type="button" class="btn btn-primary" ng-click="inviteModal()">邀请</button>' +
        '            </div>' +
        '        </div><!-- /.modal-content -->' +
        '    </div><!-- /.modal-dialog -->' +
        '</div><!-- /.modal -->'
    }
}]);

angular.module("infi-basic").directive('acceptInvite',[function(){
    return {
        restrict: 'EA',
        template:
        '<div class="modal fade"  id="accept-invite">' +
        '<div class="modal-dialog"> ' +
        '<div class="modal-content"> ' +
        '<div class="modal-header"> ' +
        '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> ' +
        '<h4 class="modal-title">{{ modalTitle }}</h4> ' +
        '</div> ' +
        '<div class="modal-body"> ' +
        '<p style="text-align: center">{{ modelContent }}</p> ' +
        '</div>' +
        '<div class="modal-footer"> ' +
        '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button> ' +
        '<button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="acceptInvite()">确定</button>' +
        '</div> ' +
        '</div>' +
        '</div>' +
        '</div>',
        link:function(scope){

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

//只筛选月份
angular.module("infi-basic").directive('infiDateMonth', [function () {
    return {
        link: function (scope, element, attrs) {
            var format = 'yyyy-MM',
                minView = 2,
                maxView = 4,
                startView = 'year';
            if (attrs && attrs.infiDateMonth) {
                format = attrs.infiDateMonth;
            }
            if (attrs && attrs.minView) {
                minView = attrs.minView;
            }
            if (attrs && attrs.maxView) {
                maxView = attrs.maxView;
            }
            if (attrs && attrs.startView) {
                startView = attrs.startView;
            }

            $(element).click(function () {
                $(this).datetimepicker({
                    format: format,
                    language: "zh-CN",
                    startView: startView,
                    minView:maxView,
                    maxView:maxView,
                    autoclose: true,
                    forceParse: true,
                    ShowUpDown: true
                }).trigger('focus');
            });
        }
    }
}]);