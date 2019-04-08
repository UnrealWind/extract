angular.module('infi-basic')
.service('ViewService',['$http','SYS', '$q', 'Utils', function($http, SYS, $q, Utils){
  
  /**
   * 初始化/分页概览数据
   * @param {*} param 
   */
  this.updatePage = function(param) {
    return $q(function(res, rej) {
      $http.get(SYS.url + 
        '/patient/page?page_number=' + param.page_number + 
        '&page_size=' + param.page_size +
        '&filter__patiId=' + param.filter__patiId +
        '&filter__name=' + param.filter__name +
        '&filter__disease=' + param.filter__disease +
        '&filter__wardId=' + param.filter__wardId
      ).then(function(msg) {
        // res(Utils.fixTableData(msg.data))
        if(msg.data.page) {
          msg.data.page.number++
        }
        res(msg.data)
      },function(error){
        console.log(error)
      })
    })
  }

  // 获取病区下拉列表
  this.getwrads = function() {
    return $http({
        url: SYS.url + '/task/conditions/wards',
        method: 'get'
    }).then(function (msg) {
      return msg.data;
    });
    // return $q(function(res, rej) {
    //   $http.get(SYS.url + '/task/conditions/wards').then(function(msg) {
    //       console.log(msg, 1)
    //     res(msg.data)
    //   }, function(error) {
    //     console.log(error)
    //   })
    // })
  }


  // 获取出入院统计筛选结果
  this.getStatistics = function(param) {
    return $q(function(res, rej) {
      $http.get(SYS.url + '/patient/statistics'
                        + '?filter__startTime=' + param.startDate
                        + '&filter__endTime=' + param.endDate
                        + '&filter__ward=' + param.ward)
      .then(function(msg) {
        res(msg.data)
      }, function(error) {
        console.log(error)
      })
    })    
  }

  //添加患者
  this.getPatiId = function(param) {
      return $http({
          method: 'post',
          url: SYS.url + '/patient/addPati',
          data: {
              patiId: param.patiId,
              deptIcuName: param.deptIcuName,
              deptIcuId: param.deptIcuId,
              patiVisitId: param.patiVisitId, //入院次数
              name: param.name,
              sex: param.sex,
              createTime: null,
              xlPatientId: null,
              xlMedicalId: null,
              patiSource: param.patiSource
          }
      }).then(function (msg) {
         return msg.data;
      })
  }
}]);