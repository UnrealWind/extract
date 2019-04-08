angular.module('infi-basic')
.service('APIService',['$http','SYS', '$q', '$routeParams',function($http, SYS, $q, $routeParams){
  
  // list.html
  /**
   * 获取分组信息
   */
  this.getGroup = function() {
    return $http.get(`${SYS.url}1/1/getGroup`).then(function succ(msg) {
      return msg.data
    }, function error(error) {

    })
  }

  /**
   * 获取列表数据
   */
  var fixListData = function(data) {
    // 更改页码
    if(data.number>=0) {
     data.number++
    }
  }
  this.getList = function(num, size, filterAbout) {
    return $http.get(`${SYS.url}1/1/${filterAbout.patiGroup.id}/patient/list?name=${filterAbout.patiName}&pid=${filterAbout.deptID}&page_size=${size}&page_number=${num}`).then(function succ(msg) {
      if(msg.data.status != 'blank') {
        fixListData(msg.data.page)
      }
      
      return msg.data
    })
  }

  /**
   * 检查用户是否已经存在
   * @param {*} depId 也就是 pid 
   */
  this.ifPatiExist = function(depId, filterData) {
    return $http.get(`${SYS.url}1/1/${filterData.patiGroup.id}/patient/${depId}/ifExist`).then(function(msg) {
      return msg.data
    })
  }

  /**
   * 保存新建的患者信息
   * @param {*} createInfo 
   */
  this.saveCreatePati = function(createInfo) {
    return $http.post(`${SYS.url}1/1/${createInfo.groupId}/1/patient/create`, createInfo).then(function(msg) {
      return msg.data
    })
  }



  // patiManage.html

  /**
   * 获取患者关联疾病下拉框数据
   * @param {*} pid 门诊 ID 
   */
  this.patiRelateDisease = function(pid) {
    return $http.get(`${SYS.url}1/1/${pid}/groups`).then(function(msg) {
      return msg.data
    })
  }

  /**
   * 获取指标下拉框数据
   */
  this.getIndexs = function(pid) {
    return $http.get(`${SYS.url}1/1/${pid}/indexes`).then(function(msg) {
      return msg.data
    })
  }

  this.getIndex = function(param) {
    return $http.get(`${SYS.url}1/1/${param.pid}/index/${param.val}`).then(function(msg) {
      return msg.data
    })
  }

  /**
   * 获取随诊列表
   * @param {*} num 
   */
  this.getInterviewList = function(num, groupAbout) {
    var currPatiInfo = JSON.parse(sessionStorage.getItem('currPati'))       // 拿到当前病人的原始数据, 下方的 groupId 不从这条数据里取



    return $http.get(`${SYS.url}1/1/${groupAbout.id}/${$routeParams.pid}/plan/interview/list?page_size=${SYS.DEFAULT_PAGE_SIZE}&page_number=${num}`).then(function(msg) {
      if(msg.data.status != 'blank') {
        fixListData(msg.data.page)
      }
      return msg.data
    })
  }

  /**
   * 保存新建随诊信息
   * @param {*} param  当前选中的护理组信息
   */
  this.saveNewInterview = function(param) {
    var currPatiInfo = JSON.parse(sessionStorage.getItem('currPati')),       // 拿到当前病人的原始数据
        data = {
          id: null,
          name: param.newInterAbout.name,
          createTime: param.newInterAbout.planTime,
          executeTime: null,
          status: 'ready',
          pid: currPatiInfo.pid,
          diseaseId: param.patiRelateAbout.diseaseId,
          projectId: param.patiRelateAbout.projectId,
          nurseGroupId: param.patiRelateAbout.id
        }


    return $http.post(`${SYS.url}1/1/1/plan/interview/create?name=${param.newInterAbout.name}`, data).then(function(msg) {
      return msg.data
    })
  
  }



}]);