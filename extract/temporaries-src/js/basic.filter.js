angular.module("infi-basic")
    .filter("keepTwoDecimal",['$timeout',function ($timeout) {
        return function(val){  //暂未用到
            Math.round()
            var current = (val*100).toFixed(2);
            return current;
        }
    }])