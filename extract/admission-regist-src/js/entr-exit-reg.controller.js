angular.module('infi-basic')
.controller('EntryExitRegController', ['$scope', 'EntrExtRegService', 'Utils', '$timeout', function ($scope, EntrExtRegService, Utils, $timeout) {
  // 全局请求状态
  $scope.totast = {
    requstStatus: '',
    text: ''
  }
  
  /**
   * 概览数据出入院登记表格操作
   * @param {*} type 
   * @param {*} action 
   * @param {*} entity 
   */
  var _editRegist = function() {

    if(JSON.parse(sessionStorage.getItem('curRegistVal'))) {
      var type = JSON.parse(sessionStorage.getItem('curRegistVal')).type,
          action = JSON.parse(sessionStorage.getItem('curRegistVal')).action,
          entity = JSON.parse(sessionStorage.getItem('curRegistVal')).entity

          EntrExtRegService.editRegist(type, action, entity).then(function(msg) {
            switch (type) {
              case 'entry':
                $scope.entryData = msg
                break
              case 'exit':
                $scope.entryData = msg.entryData
                $scope.exitData = msg.exitData
                break
            }
          })
    }
  }


  
  // 保存
  $scope.saveForm = Utils.debounce(function() {
    var type = JSON.parse(sessionStorage.getItem('curRegistVal')).type,
        data = {}

    switch (type) {
      case 'entry':
        data = {
          entryData: $scope.entryData
        }
        break

      case 'exit':
        data = {
          entryData: $scope.entryData,
          exitData: $scope.exitData
        }
    }

    $scope.totast.requstStatus = "pending"

    EntrExtRegService.saveForm(type, data).then(function(msg) {

      var totastType = {
        "success": function() {
          $scope.totast = {
            requstStatus: "resolved",
            text: "保存成功!"
          }
          var show = null
          $timeout.cancel(show);
          show = $timeout(function() {
            $scope.totast = {
              requstStatus: "",
              text: ""
            }
            location.href = "#/view"
          }, 1000)
        },
        "failure": function(code) {
          $scope.totast = {
            requstStatus: "rejected",
            text: "保存失败!" + code
          }
    
          var show = null
          $timeout.cancel(show);
          show = $timeout(function() {
            $scope.totast = {
              requstStatus: "",
              text: ""
            }
          }, 2000)
        }
      }
      
      var saveSatus = true

      switch (true) {
        case msg.hasOwnProperty('entryData'):
          angular.forEach(msg, function(val, key) {
            if (val.status != 'ok') saveSatus = false
          })
          break
        
        case msg.hasOwnProperty('status'):
          if (msg.status != 'ok') saveSatus = false
          break
      }

      if (saveSatus) {
        totastType.success()
      } else {
        totastType.failure('bgerror')
      }
    }, function(error) {
      totastType.failure(error.status)
    })

  }, 1000, true)




  // 初始化
  function init() {
    _editRegist()
  }

  init()

}]);