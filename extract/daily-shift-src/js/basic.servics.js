angular.module('infi-basic').service('BasicService',['$http','SYS',function($http,SYS){
    //用户权限区分
    this.getUserPermission = function(){
        return $http({
            method:'get',
            url:SYS.url+'dailyshift/role'
        }).then(function(msg){
            return msg.data;
        });
    }
    this.getDateList = function (number,no) {
        return $http({
            url: SYS.url + 'dailyshift/time/page',
            method: 'get',
            params: {
                page_number:number,
                page_no: no
            }
        }).then(function (msg) {
            return msg.data;
        })
    }
    //获取上方的基本信息数据
    this.getCountModel = function (date,wardId) {
        return $http({
            url: SYS.url + 'dailyshift/count/modle',
            method: 'get',
            params: {
                filter__date: date,
                filter__wardId: wardId
            }
        }).then(function (msg) {
            return msg.data;
        })
    }
    //保存上方的基本信息数据
    this.saveCountModel = function (date,data,wardId) {
        return $http({
            url: SYS.url + 'dailyshift/count/save',
            method: 'post',
            params: {
                filter__date: date,
                filter__ward: wardId
            },
            data: data
        }).then(function (msg) {
            return msg.data;
        })
    }
    //获取下边四个表格数据
    this.getTableModel = function (date,wardId) {
        return $http({
            url: SYS.url + 'dailyshift/table/modle',
            method: 'get',
            params:{
                filter__date: date,
                filter__wardId: wardId,
            }
        }).then(function (msg) {
            return msg.data;
        })
    }
    //保存下边四个表格数据
    this.saveTableModel = function (date,data,wardId) {
        return $http({
            url: SYS.url + 'dailyshift/table/save',
            method: 'post',
            params:{
                filter__date: date,
                filter__wardId: wardId
            },
            data: data
        }).then(function (msg) {
            return msg.data;
        })
    }
    //删除下边四个表格数据的一条
    this.deleteTableModel = function (id) {
        return $http({
            url: SYS.url + 'dailyshift/table/delete/'+ id,
            method: 'delete',
        }).then(function (msg) {
            return msg.data;
        })
    }

    //交班单统计模块分页列表数据
    this.getStatisticsPage = function (number,no) {
        return $http({
            url: SYS.url + 'dailyshift/statistic/page',
            method: 'get',
            params: {
                page_number: number,
                page_no: no
            }
        }).then(function (msg) {
            return msg.data;
        })
    }
    //统计模块病区列表
    this.getWardsList = function () {
        return $http({
            url: SYS.url + 'dailyshift/statistic/conditions/wards',
            method: 'get'
        }).then(function (msg) {
            return msg.data;
        })
    }
    //交班单统计模块统计新增
    this.addStatisticsData = function (startTime,endTime,wardId) {
        return $http({
            url: SYS.url + 'dailyshift/statistic/save',
            method: 'get',
            params:{
                filter__startTime: startTime,
                filter__endTime: endTime,
                filter__wardId: wardId
            }
        }).then(function (msg) {
            return msg.data;
        })
    }

    //统计完成下载Excel
    this.downloadExcel = function (startTime,endTime,wardId) {
        location.href = SYS.url + 'dailyshift/statistic/toExcel'+
            '?filter__startTime=' + startTime +
            '&filter__endTime=' + endTime +
            '&filter__wardId=' + wardId;
        return $http({
            url: SYS.url + 'dailyshift/statistic/toExcel',
            method: 'get',
            params:{
                filter__startTime: startTime,
                filter__endTime: endTime,
                filter__wardId: wardId
            }
        }).then(function (msg) {
            return msg.data;
        })
    }
    //二线交班总体情况
    this.getFormatOverAll = function (date) {
        return $http({
            url: SYS.url + 'dailyshift/twoLine/situation',
            method: 'get',
            params: {
                filter__time: date
            }
        }).then(function (msg) {
            return msg.data;
        })
    }

}]);