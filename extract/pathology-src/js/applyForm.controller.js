angular.module('infi-basic')
.controller('ApplyFormController', ['$scope', 'APIService', 'Utils', 'ApplyFormService', 'Session', '$timeout', function ($scope, APIService, Utils, ApplyFormService, Session, $timeout) {
  
  $scope.totast = {
    mainBody: null
  }

  // 特殊处理送检医师和申请时间数据
  var facData = {
    // 初始化扭转数据
    reloacData: function(orgData) {
      orgData.push({
        children: []
      })

      var specEleCount = 2  // 需要特殊处理的元素个数

      for(var i = 0; i < specEleCount; i++) {

        var orgLen = orgData.length,
            singLen = orgData[0].children.length

        orgData[orgLen - 1].children.push(orgData[0].children[singLen - (specEleCount - i)])
      }

      orgData[0].children.length = singLen - specEleCount
    },
    // 保存提交的时候恢复数据
    recoverData: function(orgData) {
      var orgDataCP = angular.copy(orgData)

      var orgLen = orgDataCP.length

      for (var i = 0; i < orgDataCP[orgLen - 1].children.length; i++) {
        orgDataCP[0].children.push(orgDataCP[orgLen - 1].children[i])
      }

      orgDataCP.length = orgLen - 1

      return orgDataCP

    }
  }


  // 按钮状态
  $scope.varstatus = {
    saveStatus: 'init',
    submitStatus: 'init',
    recallStatus: 'init'
  }

  // 按钮显示隐藏 map
  $scope.btnMap = {
    '1': 'applicationFormStatus',
    '2': 'sendFormStatus',
    '3': 'pathologyReportStatus'
  }
  
  // 返回列表标示
  $scope.backListAbout = {
    backListWarn: false,
    leaveEdit: function() {
      location.href = '#/list'
      sessionStorage.setItem('currOpt', null)
    }
  }

  // 提取必填数据项
  $scope.mustFilled = []

  // 返回列表相关操作
  $scope.backListAction = {
    leaveWarn: function() {
      if(JSON.parse(sessionStorage.getItem('currOpt')).optType == 'create') {
        $scope.backListAbout.backListWarn = true
      } else {
        $scope.backListAbout.leaveEdit()
      }
    },
    ifGoBack: function(type) {
      switch (type) {
        case 0: // 舍弃,确认返回
            $scope.backListAbout.leaveEdit()
          break

        case 1: // 取消, 动作同点击 x
            $scope.backListAbout.backListWarn = false
          break
      }
    }
  }



  // -------------- param define end -----------------//
  
  // 特殊交互的字段
  $scope.specAct = {
    supItem: ['61'],
    specInd: ['61', '447', '448'],  // 页面不渲染的元素
    specFiledMap: {
      '60': ['61', '447', '448']
    },
    specEnterItem: null,
    specEle: {
      '61': {
        'labelId': '61',
        'data': null
      },
      '447': {
        'labelId': '447',
        'data': null       
      },
      '448': {
        'labelId': '448',
        'data': null   
      }
    }
  }


  /**
   * 更改特殊交互元素的入口值
   * @param {*} single 
   */
  $scope.setSpecSup = function(single) {
    // 更改传入 spec-inter-act-con 指令的入口数据
    $scope.specAct.specEnterItem = $scope.specAct.specEle[single.childId] ? $scope.specAct.specEle[single.childId] : null

    // 不需要特殊交互,清掉之前特殊交互存储的值
    if(!$scope.specAct.specEle[single.childId]) {
      angular.forEach($scope.specAct.specFiledMap[single.fieldId], function(val, ind) {
        $scope.specAct.specEle[val].data.value = null
      })
    }
  }




  /**
   * 多选框
   * @param {*} single 点击的值
   * @param {*} item  后台存储的格式 "1,2,3"
   */
  $scope.selectCheckbox = function(single, item) {
    var valArr = item.value ? item.value.split(',') : []

    // 添加删除
    if(valArr.indexOf(single.value) < 0) {
      valArr.push(single.value)
    } else {
      var _index = valArr.indexOf(single.value)
      valArr.splice(_index, 1)
    }

    item.value = valArr.toString()
  }

    //肾小球病变   需要联动实时计算数值
    $scope.countValue = function(index,item){
        $scope.orgPageData.forEach(function (xn,xi) {
          var $first, $second;
          if(xn.label == '肾小球病变'){
            xn.children.forEach(function (yn,yi) {
                yi == 0 ? $first = angular.copy(yn) : '';
                yi == index ? $second = angular.copy(yn) : '';
                if(Number(yn.labelId) == Number(item.labelId)+1 &&
                    (item.labelId == 255 || item.labelId == 257 || item.labelId == 259 || item.labelId == 261)){
                    $second.value == '' ? yn.value = '' : yn.value = ($first.value/$second.value*100).toFixed(2)+'%';
                }else if(item.labelId == 254){
                  for(var i=0; i < 4; i++){
                    if(xn.children[2*i+1].value == null || xn.children[2*i+1].value == ''){
                        xn.children[2*i+2].value = '';
                    }else{
                        xn.children[2*i+2].value = (xn.children[0].value/xn.children[2*i+1].value*100).toFixed(2)+'%';
                    }
                  }
                }
            });
          }else if(xn.label == '24小时尿液检查'){
              xn.children.forEach(function (yn,yi) {
                  yi == 0 ? $first = angular.copy(yn) : '';
                  yi == index ? $second = angular.copy(yn) : '';
                  if(Number(yn.labelId) == Number(item.labelId)+1 &&
                      (item.labelId == 163)){
                      $second.value == '' ? yn.value = '' : yn.value = $first.value*$second.value;
                  }else if(item.labelId == 162){
                      for(var i=0; i < 1; i++){
                          if(xn.children[2*i+1].value == null || xn.children[2*i+1].value == ''){
                              xn.children[2*i+2].value = '';
                          }else{
                              xn.children[2*i+2].value = xn.children[0].value*xn.children[2*i+1].value;
                          }
                      }
                  }
              })
          }
        });
    }

  /**
   * 保存申请单
   */
  $scope.saveApplyData = function() {
    // 进行必填验证
    if(Utils._valiNecessInfo($scope.mustFilled, 'value') == 'forbid') {
      $scope.totast.mainBody = {
        status: "error",
        description: "* 为必填项!",
        delay: 1500
      }
      return 
    }

    var saveData = null

    // 特殊处理送检医师和申请时间数据
    if(['1','2'].indexOf($scope.currOpt.formId) >= 0) {
      saveData = facData.recoverData($scope.orgPageData)
    } else {
      saveData = $scope.orgPageData
    }
    
    $scope.varstatus.saveStatus = 'pending';
    APIService.saveApplyData(saveData).then(function(msg) {
      if (msg.status == 'ok') {
        $scope.varstatus.saveStatus = 'init',
        $scope.totast.mainBody = {
          status: 'ok',
          description: '保存成功!',
          callback: function() {
            location.href = '#/list'
          },
          delay: 2000
        }
      }
    }, function(error) {
      $scope.varstatus.saveStatus = 'init'
      $scope.totast.mainBody = error
    })
  }
  

  /**
   * 提交申请单
   */
  $scope.submitApplyData = function() {
    // 进行必填验证
    if(Utils._valiNecessInfo($scope.mustFilled, 'value') == 'forbid') {
      $scope.totast.mainBody = {
        status: "error",
        description: "* 为必填项!",
        delay: 1500
      }
      return 
    }

    var saveData = null

    // 特殊处理送检医师和申请时间数据
    if(['1','2'].indexOf($scope.currOpt.formId) >= 0) {
      saveData = facData.recoverData($scope.orgPageData)
    } else {
      saveData = $scope.orgPageData
    }

    // 先保存,再提交
    APIService.saveApplyData(saveData).then(function(msg) {
      if (msg.status == 'ok') {
        $scope.varstatus.saveStatus = 'init'

        // 提交
        $scope.varstatus.submitStatus = 'pending'
        APIService.submitApplyData(saveData).then(function(msg) {
          if (msg.status == 'ok') {
            $scope.varstatus.submitStatus = 'init',
            $scope.totast.mainBody = {
              status: 'ok',
              description: '提交成功!',
              callback: function() {
                location.href = '#/list'
              },
              delay: 2000
            }
          }
        }, function(error) {
          $scope.varstatus.submitStatus = 'init'
          $scope.totast.mainBody = error
        })
      }
    }, function(error) {
      $scope.varstatus.saveStatus = 'init'
      $scope.totast.mainBody = error
    })
  }


  /**
   * 撤销申请单
   */
  $scope.recallApplyData = function() {
    var saveData = null

    // 特殊处理送检医师和申请时间数据
    if(['1','2'].indexOf($scope.currOpt.formId) >= 0) {
      saveData = facData.recoverData($scope.orgPageData)
    } else {
      saveData = $scope.orgPageData
    }


    APIService.recallApplyData(saveData).then(function(msg) {
      if (msg.status == 'ok') {
        $scope.varstatus.recallStatus = 'init',
        $scope.totast.mainBody = {
          status: 'ok',
          description: '撤销成功!',
          callback: function() {
            location.href = '#/list'
          },
          delay: 2000
        }
      }
    }, function(error) {
      $scope.varstatus.submitStatus = 'init'
      $scope.totast.mainBody = error
    })
  }

  /**
   * 生成报告单
   */
  $scope.genReport = function() {
    var savedDir = ApplyFormService.genReportData($scope.orgPageData)

    sessionStorage.setItem('savedDir', JSON.stringify(savedDir))　// 缓存报告页数据字典

    var currOpt = JSON.parse(sessionStorage.getItem('currOpt'))



    // 先保存
    APIService.saveApplyData($scope.orgPageData).then(function(msg) {
      if (msg.status == 'ok') {}
    }, function(error) {
      $scope.varstatus.saveStatus = 'init'
      $scope.totast.mainBody = error
    })


    if(currOpt.rowData['finalReportStatus'] != '1') {
      currOpt.formId = '4'
      currOpt.optType = 'create'
      location.href="#/report"
      sessionStorage.setItem('currOpt', JSON.stringify(currOpt))
    } else {
      currOpt.formId = '4'
      currOpt.optType = 'view'
      location.href="#/reportGened"
      sessionStorage.setItem('currOpt', JSON.stringify(currOpt))
    }
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

    $('.imgList img').each(function(val, ind) {
      $('.imgCell').append(`<img src="${$(this).attr('src')}" />`)
    })


    Utils.printPage(_node)
  }


  

  ;(function init() {
    APIService.getApplyFormData(JSON.parse(sessionStorage.getItem('currOpt'))).then(function(msg) {
      
      // 特殊处理送检医师和申请时间数据
      if(['1','2'].indexOf($scope.currOpt.formId) >= 0) facData.reloacData(msg.data)

      $scope.orgPageData = msg.data // 页面原始数据
      $scope.flatPageData = ApplyFormService.flatOrgPageData($scope.orgPageData)  // 页面扁平数据
      $scope.recordId = msg.data[0].recordId

      // 如果当前单据已经更新
      var formMap = {
        '1': 'applicationFormStatus',
        '2': 'sendFormStatus',
        '4': 'finalReportStatus'
      }


      var currOpt = JSON.parse(sessionStorage.getItem('currOpt'))
      if(currOpt.rowData[formMap[currOpt.formId]] == '4') {
        APIService.updatePageStatus(currOpt, $scope.recordId).then(function(msg) {
        })
      }
    })

    // 当前编辑的数据项详情
    $scope.currOpt = JSON.parse(sessionStorage.getItem('currOpt'))
    
    // 获取当前登录角色
    if(Session.getUser()) {
      $scope.currUsr = Session.getUser()
      $scope.currUsrRole = $scope.currUsr.companyId
    }
  })()


    $scope.backTop = function () {
        $('.infi-main').scrollTop(0);
    }
}]);