angular.module('infi-basic')
.service('DataExportService',['$http','SYS', '$q', 'Utils', function($http, SYS, $q, Utils){
  /**
   * 初始化/分页概览数据
   * @param {*} param 
   */
  this.updatePage = function(param) {
    return $q(function(res, rej) {
      $http.get(SYS.url + 
        '/task/page?page_number=' + param.page_number + 
        '&page_size=' + param.page_size
      ).then(function(msg) {
        if(msg.data.page) {
          msg.data.page.number++
        }
        res(msg.data)
      },function(error){
        console.log(error)
      })
    })
  }


  /**
   * 导出数据
   */
  this.exportData = function(param) {

    var _param = '?filter__type=' + param.exportDateFilter.type.label +
                 '&filter__startTime=' + param.exportDateFilter.date.startDate +
                 '&filter__endTime=' + param.exportDateFilter.date.endDate + 
                 '&filter__ward=' +param.wardSearchObj.selected.value
    
    location.href = SYS.url + '/task/toExcel' + _param


    return $http.get(SYS.url + '/task/save' + _param).then(function(msg) {
      return msg.data
    })
  }

}])