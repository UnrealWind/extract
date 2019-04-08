/**
 * Created by liu on 16-9-5.
 */
 // 页面提示js文件
angular.module('infi-basic').service('Utils', ['SYS', '$timeout', function (SYS, $timeout) {
    function sysTip($scope, tip) {
        $scope.sysTip = angular.copy(tip);
        var show;
        $timeout.cancel(show);
        show = $timeout(function () {
            if ($scope.sysTip) {
                $scope.sysTip.status = undefined;
            }
        }, 2500);
    }

    function sysTipBefore($scope, description) {
        sysTip($scope, {
            status: SYS.STATUS_QUERYING,
            description: description
        });
    }

    return {
        sysTip: sysTip,
        sysTipBefore: sysTipBefore
    }
}]);
