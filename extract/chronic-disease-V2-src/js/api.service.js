angular.module('infi-basic')
.service('APIService',['$http','SYS', '$q', '$routeParams',function($http, SYS, $q, $routeParams){

  // -------- list.html ---------//
  /**
   * 获取分组信息
   */
  this.getGroup = function () {
    var deferred = $q.defer()
    $http.get(`${SYS.url}1/1/getGroup`).then(function(msg) {
      if (msg.data.status == 'ok') return deferred.resolve(msg.data.data)
      else if (msg.data.status == 'blank') return deferred.resolve([])
    }, function(error) {
      return deferred.reject('请求出错')
    })

    return deferred.promise
  }


  /**
   * 获取列表信息
   */
  this.getList = function(param) {
    var deferred = $q.defer()

    /**
     * 修正页码， 后台传回的比前台需要的少 1
     * @param {*} data 
     */
    var fixListData = function(data) {
      if(data.number>=0) {
       data.number++
      }
    }
    $http.get(`${SYS.url}${param.filterAbout.patiGroup.id}/patient/list?name=${param.filterAbout.patiName}&pid=${param.filterAbout.depId}&page_size=${param.size}&page_number=${param.num}`).then(function(msg) {
      if (msg.data.status == 'ok') {
        fixListData(msg.data.page)
        return deferred.resolve(msg.data.page)
      } 
      else if (msg.data.status == 'blank') return deferred.resolve([])
    }, function(error) {
      return deferred.reject('请求出错！')
    })

    return deferred.promise
  }

  /**
   * 检查搜索的患者是否已经存在
   * param <groupId> 护理组 Id
   *       <depId> 患者 Id
   */
  this.ifPatiExist = function (param) {
    var deferred = $q.defer()

    $http.get(`${SYS.url}${param.groupId}/patient/${param.depId}/ifExist`).then(function(msg) {
      var backData = {}
      // 存在 
      if (msg.data.status == 'ok') {
        backData = {
          pInfo: msg.data.data,
          isExisted: 'existed'
        }
      } 
      // 不存在
      else if (msg.data.status == 'blank') {
        backData = {
          pInfo: msg.data.data,
          isExisted: 'notIn'
        }
      }

      return deferred.resolve(backData)
    }, function(error) {
      return deferred.reject('请求出错了')
    })

    return deferred.promise
  }

  /**
   * 创建新患者
   * param <depId> 患者 Id
   */
  this.creatPati = function(param) {
    var deferred = $q.defer()
    $http.post(`${SYS.url}${param.pInfo.groupId}/patient/create`, param.pInfo).then(function(msg) {
      if (msg.data.status == 'ok') return deferred.resolve(msg.data.data)
    }, function(error) {
      return deferred.reject('创建失败！')
    })

    return deferred.promise
  }
  

  // -------- patiManage.html ---------//

  /**
   * 患者所在的护理组集合
   * param <depId> 患者 Id
   */
  this.getPatiGroups = function(param) {
    var deferred = $q.defer()
    $http.get(`${SYS.url}1/1/${param.depId}/groups`).then(function(msg) {
      if (msg.data.status == 'ok') return deferred.resolve(msg.data.data)
      else if (msg.data.status == 'blank') return deferred.resolve([])
    }, function(error) {
      return deferred.reject('请求出错')
    })

    return deferred.promise
  }

  /**
   * 获取当前患者所在护理组的基本信息
   * param <groupId> 护理组 Id
   *       <depId> 患者 Id
   */
  this.getPatiBasicInfo = function(param) {
    var deferred = $q.defer()
    $http.get(`${SYS.url}1/1/${param.groupId}/interview/basic?pid=${param.depId}`).then(function(msg) {
      if (msg.data.status == 'ok') return deferred.resolve(msg.data.data)
      else if (msg.data.status == 'blank') return deferred.resolve([])
    }, function(error) {
      return deferred.reject('请求出错')
    })

    return deferred.promise
  }



  /**
   * 获取当前患者的方案详情
   * @param <groupId> 当前护理组 id
   *        <depId> 当前患者 depId
   */
  this.getPatiPlan = function(param) {
    var deferred = $q.defer()
    $http.get(`${SYS.url}${param.groupId}/patient/scheme?pid=${param.depId}`).then(function(msg) {
      if (msg.data.status == 'ok') return deferred.resolve(msg.data.data)
      else if (msg.data.status == 'blank') return deferred.resolve([])
      else return deferred.reject('请求出错')
    }, function(error) {
      return deferred.reject('请求出错')
    })

    return deferred.promise
  }

  /**
   * 获取当前患者的方案执行情况分页数据
   * @param: groupId 护理组 Id
   *         depId 患者 Id
   *         pageSize 单页数据数量
   *         pageNumber 当前页数，起始于 1
   *         data 方案实体
   */
  this.getPlanExeSplit = function(param) {
    var deferred = $q.defer()

    /**
     * 修正页码， 后台传回的比前台需要的少 1
     * @param {*} data 
     */
    var fixListData = function(data) {
      if(data.number>=0) {
       data.number++
      }
    }


    $http.post(`${SYS.url}${param.groupId}/patient/page?pid=${param.depId}&page_size=${param.pageSize}&page_number=${param.pageNumber}`, param.data).then(function(msg) {
      if (msg.data.status == 'ok') {
        fixListData(msg.data.page)
        return deferred.resolve(msg.data.page)
      } 
      else return deferred.reject('请求出错')
    }, function(error) {
      return deferred.reject('请求出错')
    })

    return deferred.promise
  }

  /**
   * 新建随访
   * @param <executeTime> 执行时间
   *        <interviewName> 随访名称
   */
  this.saveFollowUp = function(param, data) {
    var deferred = $q.defer()
    $http.post(`${SYS.url}1/1/plan/interview/create?executeTime=${param.executeTime}&interviewName=${param.interviewName}`, data).then(function(msg) {
      if (msg.data.status == 'ok') return deferred.resolve(msg.data.data)
    }, function(error) {
      return deferred.reject('创建失败！')
    })

    return deferred.promise
  }


  /**
   * 更改单条计划状态
   */
  this.changePlanItemStatus = function(param, data) {
    var deferred = $q.defer()
    $http.post(`${SYS.url}1/1/interview/status?status=${param.status}&statusCode=${param.statusCode}`, data).then(function(msg) {
      if (msg.data.status == 'ok') return deferred.resolve(msg.data.data)
      else return deferred.reject({ status: 'error' })
    }, function(error) {
      return deferred.reject({
        status: 'error'
      })
    })

    return deferred.promise
  }


  /**
   * 获取关键指标下拉框数据
   * @param param > type 护理组 type
   */
  this.getIndicatorSelect = function(param) {
    var deferred = $q.defer()
    $http.get(`${SYS.wechatUrl}wechat/index/all?type=${param.type}`).then(function(msg) {
      if (msg.data.status == 'ok') return deferred.resolve(msg.data.data)
      else if (msg.data.status == 'blank') return deferred.resolve([])
      else return deferred.reject('请求出错')
    }, function(error) {
      return deferred.reject('请求出错')
    })

    return deferred.promise
  }

  /**
   * 获取下拉框选中选项的详细数据，这里根据 projectName 区分走哪个接口
   * @param projectName chronic-wechat / chronic
   *        groupId 护理组 Id
   *        pId 患者 Id
   *        type 指标类型
   *        begin 开始时间
   *        end 结束时间
   */
  this.getIndicatorDetail = function(param) {
    var deferred = $q.defer()

    // 其余八个指标返回数据对照表
    var backDataMap = {
      // 血压
      '1': 'bloodPressure',
      // 体重(BMI)
      '3': 'weight',
      // 心率
      '10': 'ECG',
      // 体温
      '14': 'temperature',
      // 血氧
      '9': 'bloodOxygen'
    }

    if(param.projectName === 'chronic') {
      // 原始的三个
      // $http.get(`http://192.168.1.21:1995/chronic/1/1/${param.groupId}/${param.pId}/index/${param.type}?begin=${param.begin}&end=${param.end}`).then(function(msg) {
      $http.get(`${SYS.url}1/1/${param.groupId}/${param.pId}/index/${param.type}?begin=${param.begin}&end=${param.end}`).then(function(msg) {
        if (msg.data.status == 'ok') return deferred.resolve(msg.data.data)
        else if (msg.data.status == 'blank') return deferred.resolve([])
        else return deferred.reject('请求出错')
      }, function(error) {
        return deferred.reject('请求出错')
      })
    } else if(param.projectName === 'chronic-wechat') {
      // 新增的八个
      $http.get(`${SYS.wechatUrl}breathing/index?pid=${param.pId}&type=${param.type}&begin=${param.begin}&end=${param.end}`).then(function(msg) {
        if (msg.data.status == 'ok') {
          var parsedOrgData = JSON.parse(msg.data.data)
          var backData = null

          // 区分是 fev1 三兄弟数据格式还是血压系列数据
          if(!backDataMap.hasOwnProperty(param.type)) {
            // fev1 三兄弟
            backData = parsedOrgData
          } else {
            // 血压系列数据
            backData = parsedOrgData[backDataMap[param.type]]
          }

          return deferred.resolve(backData)
        } 
        else if (msg.data.status == 'blank') return deferred.resolve([])
        else return deferred.reject('请求出错')
      }, function(error) {
        return deferred.reject('请求出错')
      })
    }

    return deferred.promise
  }







  // -------- viewEvaluateRst.html ---------//

  /**
   * 获取评估结果和最近一年住院次数
   * param <groupId> 护理组 Id
   *       <depId> 患者 Id
   */
  this.getEvaluateRst = function (param) {
    var deferred = $q.defer()
    $http.get(`${SYS.url}research/evoluation/result?pid=${param.depId}&groupId=${param.groupId}&interviewId=${param.interviewId}`).then(function(msg) {
      if (msg.data.status == 'ok') return deferred.resolve(msg.data.data)
      else if (msg.data.status == 'blank') return deferred.resolve([])
    }, function(error) {
      return deferred.reject('请求出错')
    })

    return deferred.promise
  }

  /**
   * 获取患者分组下拉框范围数据
   * param <groupId> 护理组 Id
   */
  this.getGroupRange = function(param) {
    var deferred = $q.defer()
    $http.get(`${SYS.url}${param.groupId}/scheme/all`).then(function(msg) {
      if (msg.data.status == 'ok') return deferred.resolve(msg.data.data)
      else if (msg.data.status == 'blank') return deferred.resolve([])
      else return deferred.reject('请求出错')
    }, function(error) {
      return deferred.reject('请求出错')
    })

    return deferred.promise
  }


  
  /**
   * 获取可分配的方案数据，包括最新的护理组
   * param <groupId> 护理组 Id
   *       <depId> 患者 Id
   * data  
   */
  this.getPlan = function(param, data) {
    var deferred = $q.defer()
    $http.post(`${SYS.url}${param.groupId}/scheme/choice?pid=${param.depId}`, data).then(function(msg) {
      if (msg.data.status == 'ok') return deferred.resolve(msg.data.data)
      else return deferred.reject('创建失败！')
    }, function(error) {
      return deferred.reject('创建失败！')
    })

    return deferred.promise
  }

  /**
   * 获取调整方案中的 select 下拉数据集
   */
  this.getPlanOptRange = function() {
    var deferred = $q.defer()
    $http.get(`${SYS.url}material/property/all`).then(function(msg) {
      if (msg.data.status == 'ok') return deferred.resolve(msg.data.data)
      else if (msg.data.status == 'blank') return deferred.resolve([])
    }, function(error) {
      return deferred.reject('请求出错')
    })

    return deferred.promise
  }


  /**
   * 执行选中的方案
   * param <groupId> 护理组 Id
   *       <depId> 患者 Id
   * data  
   */
  this.applyPlan = function(param, data) {
    var deferred = $q.defer()
    $http.post(`${SYS.url}${param.groupId}/confirm?pid=${param.depId}`, data).then(function(msg) {
      if (msg.data.status == 'ok') return deferred.resolve(msg.data.data)
      else return deferred.reject()
    }, function(error) {
      return deferred.reject('请求出错')
    })

    return deferred.promise
  }


  // -------- editPlan.html ---------//

  /**
   * 获取待调整的方案
   * param <groupId> 护理组 Id
   */
  this.getEditPlan = function(param) {
    var deferred = $q.defer()
    $http.get(`${SYS.url}${param.groupId}/scheme/adjust?pid=${param.depId}`).then(function(msg) {
      if (msg.data.status == 'ok') return deferred.resolve(msg.data.data)
      else if (msg.data.status == 'blank') return deferred.resolve([])
    }, function(error) {
      return deferred.reject('请求出错')
    })

    return deferred.promise
  }





  // ----------- historyCount.html

  /**
   * 获取 kpi 数据
   * param <groupId> 护理组 Id
   */
  this.getHistoryKpi = function(param) {
    var deferred = $q.defer()
      $http.get(`${SYS.url}${param.groupId}/patient/kpi`).then(function(msg) {
        if (msg.data.status == 'ok') return deferred.resolve(msg.data.data)
        else if (msg.data.status == 'blank') return deferred.resolve([])
        else return deferred.reject('请求出错')
      }, function(error) {
        return deferred.reject('请求出错')
      })

      return deferred.promise
  }




  /**
   * 方案条目搜索
   * @param type: 方案类型
   *        kw： 关键字
   *        groupId: 护理组 Id
   */
  this.getPlanItem = function(param) {
    var deferred = $q.defer()
    $http.get(`${SYS.url}material/property/search/${param.type}?filter_LIKE_searchName=${param.kw}&filter_EQ_nurseGroupId=${param.groupId}`).then(function(msg) {
      if (msg.data.status == 'ok') return deferred.resolve(msg.data.data)
      else if (msg.data.status == 'blank') return deferred.resolve([])
      else return deferred.reject('请求出错')
    }, function(error) {
      return deferred.reject('请求出错')
    })

    return deferred.promise
  }
}]);




