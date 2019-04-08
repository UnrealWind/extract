angular
  .module("infi-basic")
  .directive("toastPop", [
    "$timeout",
    function($timeout) {
      // totast 提示框
      return {
        restrict: "ECMA",
        templateUrl: "js/html/toastPop.html",
        replace: true,
        scope: {
          totast: "="
        },
        link: function(scope) {
          var timeDelay = scope.totast.delay || 4000;

          var _delay = $timeout(function() {
            $timeout.cancel(_delay);
            if (scope.totast.callback) scope.totast.callback();
            scope.totast = null;
          }, timeDelay);
        }
      };
    }
  ])
  .directive("reduceLen", [
    function() {
      // 将数组截取为固定长度
      return {
        restrict: "ECMA",
        replace: true,
        scope: {
          arr: "=",
          len: "="
        },
        link: function(scope) {
          if(scope.arr.length > scope.len) scope.arr.length = scope.len
        }
      };
    }
  ])