angular.module('infi-basic')
.service('EntrExtRegService',['$http','SYS', '$q', 'Utils', function($http, SYS, $q, Utils){
  /**
   * 编辑概览数据的出入院登记
   * @param {*} type entry/exit 出/入院
   * @param {*} action create/update 创建/更新
   */
  this.editRegist = function(type, action, entity) {
    var _apiMap = {
      entry: {
        create: '/admission/' + entity.xl_patient_id + '/' + entity.xl_medical_id,
        update: '/admission/' + entity.xl_patient_id + '/' + entity.xl_medical_id
      },
      exit: {
        create: '/discharge/' + entity.xl_patient_id + '/' + entity.xl_medical_id,
        update: '/discharge/' + entity.xl_patient_id + '/' + entity.xl_medical_id
      }
    }

    switch (type) {
      case 'entry':
        return $q(function(res, rej) {
          $http.get(SYS.url + _apiMap[type][action]).then(function(msg) {
            res(msg.data.data)
          }, function(error) {
            console.log(error)
          })
        })

        break

      case 'exit': 
        return $q.all({
          'entryData':  $http.get(SYS.url + _apiMap['entry'][action]).then(function(msg) {
            return msg.data.data
          }),
          'exitData': $http.get(SYS.url + _apiMap[type][action]).then(function(msg) {
            return msg.data.data
          })
        })
      break

    }
  }


  this.saveForm = function(type, data) {
    switch (type) {
      case 'entry':
        return $q(function(res, rej) {
          $http.post(SYS.url + '/admission/save', data.entryData).then(function(msg) {
            res(msg.data)
          }, function(error) {
            rej(error)
          })
        })
        break

      case 'exit':
        return $q.all({
          'entryData':  $http.post(SYS.url + '/admission/save', data.entryData).then(function(msg) {
            return msg.data
          }),
          'exitData': $http.post(SYS.url + '/discharge/save', data.exitData).then(function(msg) {
            return msg.data
          })
        })


        break
    }





  }

  
}])