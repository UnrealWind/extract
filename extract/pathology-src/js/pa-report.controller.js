angular.module('infi-basic')
.controller('PaReportController', ['$scope', '$rootScope', 'APIService', function ($scope,$rootScope, APIService) {
  
  $scope.totast = {
    mainBody: null
  }

  // 当前 curropt
  $scope.optType = JSON.parse(sessionStorage.getItem('currOpt')).optType
  
  // 按钮状态
  $scope.varstatus = {
    genStatus: 'init',
  }
  
  
  // 头部信息
  $scope.basicInfo = {
    lineOne: [7,0],       // 病理号, 门诊号
    lineTwo: [3,4,5,2,1]  // 姓名, 性别 ... 住院号
  }

  // 主体信息展现类型
  $scope.inputType = {
    text: [],
    dateTime: ['444'],
    textArea: [ '440', '441', '442', '248', '443', '461'],
    imgList: ['452'],
    singleImg: ['445']
  }



  /**
   * 回列表页
   */
  $scope.backToList = function() {
    sessionStorage.setItem('savedDir', null)
    location.href="#/list"
  }

  /**
   * 回详情页
   */
  $scope.backToReport = function() {
    var currOpt = JSON.parse(sessionStorage.getItem('currOpt'))
    currOpt.formId = '3'
    currOpt.optType = 'view'
    sessionStorage.setItem('currOpt', JSON.stringify(currOpt))
    location.href="#/applyForm"
  } 



  /**
   * 生成报告单
   */
  $scope.saveReportData =function() {
    $scope.varstatus.genStatus = 'pending';
    APIService.saveApplyData($scope.orgPageData).then(function(msg) {
      if(msg.status == 'ok') {
        APIService.submitApplyData($scope.orgPageData).then(function(msg) {
          if (msg.status == 'ok') {
            $scope.varstatus.genStatus = 'init',
            $scope.totast.mainBody = {
              status: 'ok',
              description: '生成成功!',
              callback: function() {
                location.href = '#/reportGened'
              },
              delay: 2000
            }
          }


          var currOpt = JSON.parse(sessionStorage.getItem('currOpt'))
          currOpt.rowData = msg.data

          sessionStorage.setItem('currOpt', JSON.stringify(currOpt))
        })

        // 缓存生成的报告单
        sessionStorage.setItem('genedReport', JSON.stringify(msg.data))
      }
    }, function(error) {
      $scope.varstatus.genStatus = 'init'
      $scope.totast = error
    })
  }














  ;(function init() {

    //　获取页面模板数据
    APIService.getReportModel(JSON.parse(sessionStorage.getItem('currOpt'))).then(function(msg) {
      $scope.orgPageData = msg.data // 页面原始数据
      $scope.recordId = msg.data[0].recordId
      $scope.savedDir = JSON.parse(sessionStorage.getItem('savedDir'))


      // 如果当前单据已经更新
      var formMap = {
        '1': 'applicationFormStatus',
        '2': 'sendFormStatus',
        '4': 'finalReportStatus'
      }
      var currOpt = JSON.parse(sessionStorage.getItem('currOpt'))
      if(currOpt.rowData[formMap[currOpt.formId]] == '4') {
        APIService.updatePageStatus(currOpt, $scope.recordId).then(function(msg) {
          console.log('更新成功')
        })
      }
    })




  })()

}]);