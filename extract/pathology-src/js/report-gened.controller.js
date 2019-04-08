angular.module('infi-basic')
.controller('ReportGenedController', ['$scope', '$rootScope', 'APIService', 'Utils', 'ApplyFormService', 'Session',function ($scope,$rootScope, APIService, Utils, ApplyFormService, Session) {
  
  $scope.totast = {
    mainBody: null
  }

  // 头部信息
  $scope.basicInfo = {
    lineOne: [7,0],       // 病理号, 门诊号
    lineTwo: [3,4,5,2,1]  // 姓名, 性别 ... 住院号
  }



  // 主体信息
  $scope.inputType = {
    text: ['445', '446'],
    dateTime: ['444'],
    textArea: [ '440', '441', '442', '248', '443'],
    imgList: ['452']
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
   * 回编辑页
   */
  $scope.backToEdit = function() {
    var currOpt = JSON.parse(sessionStorage.getItem('currOpt'))
    var _currOpt = {
      formId: '4', 
      optType: 'edit',
      rowData: angular.copy(currOpt.rowData)
    }
    sessionStorage.setItem('currOpt', JSON.stringify(_currOpt))

    location.href = '#/report'
  }




  /**
   * 导出表单为图片
   */
  $scope.savePageAsImg = function() {
    $scope.totast.mainBody = {
      status: 'ok',
      description: '导出中,请稍候...',
      delay: 4500
    }

    var _node = document.getElementById('domtoimg-wrapper') // 获取要打印的 dom 节点

    Utils.savePageAsImg(_node)  // 调取打印接口
  }

  /**
   * 打印表单
   */
  $scope.printPage = function() {
    var _node = document.getElementById('form-wrapper') // 获取要打印的 dom 节点

    $('.imgCell').html('')

    $('.imgList img').each(function(val, ind) {
      $('.imgCell').append(`<img src="${$(this).attr('src')}" style="padding: 15px 0;"/>`)
    })

    Utils.printPage(_node)
  }





  ;(function init(){
    // 获取当前登录角色
    if(Session.getUser()) {
      $scope.currUsr = Session.getUser()
      $scope.currUsrRole = $scope.currUsr.companyId
    }


    // 如果当前单据已经更新
    var formMap = {
      '1': 'applicationFormStatus',
      '2': 'sendFormStatus',
      '4': 'finalReportStatus'
    }
    var currOpt = JSON.parse(sessionStorage.getItem('currOpt'))


    // 页面已生成数据, 判断是否从缓存中区
    if(JSON.parse(sessionStorage.getItem('genedReport'))){
      $scope.orgPageData = JSON.parse(sessionStorage.getItem('genedReport'))

      
      // 更新状态
      $scope.recordId = $scope.orgPageData[0].recordId
      if(currOpt.rowData[formMap[currOpt.formId]] == '4' && $scope.currUsrRole == '30') {
        APIService.updatePageStatus(currOpt, $scope.recordId).then(function(msg) {
          console.log('更新成功')
        })
      }

      $scope.flatPageData = ApplyFormService.flatOrgPageData($scope.orgPageData)  // 页面扁平数据

      console.log($scope.flatPageData)
    } else {
      var param = JSON.parse(sessionStorage.getItem('currOpt'))

      APIService.getReportModel(param).then(function(msg) {
        sessionStorage.setItem('genedReport', JSON.stringify(msg.data))
        $scope.orgPageData = msg.data

        // 更新状态
        $scope.recordId = $scope.orgPageData[0].recordId
        if(currOpt.rowData[formMap[currOpt.formId]] == '4' && $scope.currUsrRole == '30') {
          APIService.updatePageStatus(currOpt, $scope.recordId).then(function(msg) {
            console.log('更新成功')
          })
        }

        $scope.flatPageData = ApplyFormService.flatOrgPageData($scope.orgPageData)  // 页面扁平数据

        console.log($scope.flatPageData)
      })
    }

    
  })()


    $scope.backTop = function () {
        $('.infi-main').scrollTop(0);
    }
}]);