/**
 * Created by liu on 17-4-19.
 */
angular.module('infi-basic').directive('sysTip', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        template: '<div ng-if="sysTip.status" style="word-wrap:break-word" '
        + 'ng-class="{\'ok\':\'notice\',\'querying\':\'notice\',\'error\':\'notice_error\',\'blank\':\'notice_error\'}[sysTip.status]">'
        + '{{sysTip.description}}' +
        '</div>'
    };
}]);