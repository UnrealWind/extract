angular.module("infi-basic").service('IntervalService',['$interval','$location',function ($interval,$location) {
    var that = this;
    /**
     * 实时监控页面10分钟刷新一次数据
     * @param callback
     */
    that.setIntervalData = function (timeout) {
        that.clearInterval(timeout);
        var timeout_upd = $interval(function () {
            $location.path('broadcast')
        },1000*60*2);
        return timeout_upd;
    }

    that.setIntervalData1 = function (timeout) {
        that.clearInterval(timeout);
        var timeout_upd = $interval(function () {
            $location.path('broadcast')
        },1000*60*2);
        return timeout_upd;
    }
    /**
     * 清除实时刷新,目前是单页面应用,即使从A页面到B页面,A页面的Interval方法仍在继续,所以需要离开页面时清除上一个监控
     * @param timeout
     */
    that.clearInterval = function (timeout) {
        $interval.cancel(timeout);
    }
}])