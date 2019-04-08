angular.module('infi-basic')
.service('APIService',['$http','SYS', '$q',function($http, SYS, $q){
  /**
   * 获取列表分页数据
   * @param {*} pageNum 当前页码 
   * @param {*} pageSize 每页展示数量
   */
  var fixListData = function(data) {
    // 更改页码
    if(data.number>=0) {
     data.number++
    }
  }

  this.getList = function(pageNum, pageSize, searchKey) {
    return $q(function(res, rej) {
      $http.get(`${SYS.url}patient/page?page_number=${pageNum}&page_no=${pageSize}&filter__patiId=${searchKey.filter_patiId}&filter__name=${searchKey.filter_patiName}&filter__pathologicalDiag=${searchKey.filter_pathological}&filter__clinicalDiag=${searchKey.filter_clinical}`).then(function (msg) {
        if(msg.data.status != 'blank') {
          fixListData(msg.data.page)
        }
        
        res(msg.data)
      }, function (error) {
        rej(error)
      })
    })
  }

  /**
   * 获取用户角色信息
   */
  this.getEnName = function() {
    return $q(function(res, rej) {
      $http.get(`${SYS.url}download/role`).then(function (msg) {
        res(msg.data)
      }, function (error) {
        rej(error)
      })
    })
  }

  /**
   * 获取病区数据
   */
  this.getWards = function() {
    return $q(function(res, rej) {
      $http.get(`${SYS.url}download/conditions/wards`).then(function (msg) {
        res(msg.data)
      }, function (error) {
        rej(error)
      })
    })
  }

  /**
   * 检查是否可以新建申请单
   * @param {*} param 
   */
  this.canNewApplyForm = function(param, data) {
    return $q(function(res, rej) {
      $http.post(`${SYS.url}form/validate/${param.patiId}/${param.visitId}`, data).then(function (msg) {
        res(msg.data)
      }, function (error) {
        rej(error)
      })
    })
  }

  /**
   * 通过重复性检测后, 获取新建用户的 ID
   * @param {*} param 
   */
  this.getPatiId = function(param) {
    return $q(function(res, rej) {
      $http.get(`${SYS.url}patient/${param.patiId}/${param.visitId}`).then(function (msg) {
        res(msg.data)
      }, function (error) {
        rej(error)
      })
    })
  }

  /**
   * 获取申请单页面数据
   * @param {*} param 
   */
  this.getApplyFormData = function(param) {
    return $q(function(res, rej) {
      $http.get(`${SYS.url}form/${param.rowData.id}/${param.formId}/${param.rowData.xlPatientId}/${param.rowData.xlMedicalId}`).then(function (msg) {
        res(msg.data)
      }, function (error) {
        rej(error)
      })
    })
  }

  /**
   * 获取报告页原始数据
   * @param {*} param 
   */
  this.getReportModel = function(param) {
    return $q(function(res, rej) {
      $http.get(`${SYS.url}form/${param.rowData.id}/${param.formId}/${param.rowData.xlPatientId}/${param.rowData.xlMedicalId}`).then(function (msg) {
        res(msg.data)
      }, function (error) {
        rej(error)
      })
    })
  }

  /**
   * 保存申请单数据
   * @param {*}} data 表单数据
   */
  this.saveApplyData = function(data) {
    return $q(function(res, rej) {
      $http.post(`${SYS.url}form/save`, data).then(function (msg) {
        res(msg.data)
      }, function (error) {
        rej(error)
      })
    })
  }

  /**
   * 提交申请单数据
   * @param {*} data 
   * @param {*} recoreId 
   */
  this.submitApplyData = function(data) {
    var currOpt = JSON.parse(sessionStorage.getItem('currOpt')),
        url = null

    if(currOpt.formId == '4' && currOpt.rowData['finalReportStatus'] == 0) {
      url = `${SYS.url}form/commit/${data[1].formId}/${data[0].recordId}?filter__isFirstCommit=1`
    } else {
      url = `${SYS.url}form/commit/${data[1].formId}/${data[0].recordId}`
    }


    return $q(function(res, rej) {
      $http.post(url, data).then(function (msg) {
        res(msg.data)
      }, function (error) {
        rej(error)
      })
    })
  }

  /**
   * 撤销申请单数据
   * @param {*} data 
   * @param {*} recoreId 
   */
  this.recallApplyData = function(data) {
    return $q(function(res, rej) {
      $http.post(`${SYS.url}form/undo/${data[1].formId}/${data[0].recordId}`, data).then(function (msg) {
        res(msg.data)
      }, function (error) {
        rej(error)
      })
    })
  }


  this.updatePageStatus = function(param, recordId) {
    return $q(function(res, rej) {
      $http.get(`${SYS.url}form/update/${param.formId}/${recordId}`).then(function (msg) {
        res(msg.data)
      }, function (error) {
        rej(error)
      })
    })
  }

  /**
   * 获取已保存图片 base64
   * @param {*} imgId 
   */
  this.getSavedImage = function(imgId) {
    return $q(function(res, rej) {
      $http.get(`${SYS.url}form/picture/turnBase/${imgId}`).then(function (msg) {
        res(msg.data)
      }, function (error) {
        rej(error)
      })
    })
  }


  // ------------------- export page ------------------------- //

  /**
   * 获取表格分页数据
   * @param {*} param 
   */
  this.exportUpdatePage =function(param) {
    return $q(function(res, rej) {
      $http.get(`${SYS.url}download/task/page?page_number=${param.page_number}&page_size=${param.page_size}`).then(function(msg) {
        if(msg.data.page) {
          msg.data.page.number++
        }
        res(msg.data)
      },function(error){
        rej(error)
      })
    })
  }



  /**
   * 导出数据
   */
  this.exportData = function(param) {

    // var _param = '?filter__type=' + param.exportDateFilter.type.label +
    // '&filter__startTime=' + param.exportDateFilter.date.startDate +
    // '&filter__endTime=' + param.exportDateFilter.date.endDate + 
    // '&filter__ward=' +param.wardSearchObj.selected.value

    var _param = `?filter__startTime=${param.exportDateFilter.date.startDate}&filter__endTime=${param.exportDateFilter.date.endDate}&filter__wardId=${param.wardSearchObj.selected.value}`
    

    location.href = `${SYS.url}download/toExcel/${param.exportDateFilter.type.value}${_param}`

    return $http.get(`${SYS.url}download/task/save/${param.exportDateFilter.type.value}${_param}`).then(function(msg) {
      return msg.data
    })
  }


  // 获取病区下拉列表
  this.getwrads = function() {
    return $q(function(res, rej) {
      $http.get(SYS.url + 'download/conditions/wards').then(function(msg) {
        res(msg.data)
      }, function(error) {
        console.log(error)
      })
    })
  }


}]);