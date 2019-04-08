angular.module('infi-basic')
.directive('toastPop',['$timeout', function ($timeout){
  // totast 提示框
  return {
    restrict: 'ECMA',
    templateUrl: 'js/html/toastPop.html',
    replace: true,
    scope:{
        totast: "="
    },
    link:function (scope) {

      var timeDelay = scope.totast.delay || 4000

      var _delay = $timeout(function(){
        $timeout.cancel(_delay)
        if(scope.totast.callback) scope.totast.callback()
        scope.totast = null
      }, timeDelay);
    }
  }
}])
.directive('newApplyForm', ['APIService', 'Utils', '$route', function(APIService, Utils, $route) {
  // 新建申请单 confim collapse
  return {
    restrict: 'ECMA',
    templateUrl: 'js/html/newApplyForm.html',
    replace: true,
    scope:{
      newApplyFormData: '='
    },
    link:function (scope) {
      scope.canSubmit = 'init'  // 是否存在未填项
      scope.submitStatus = 'init' // 新建状态

      scope.wardSelected = scope.newApplyFormData.wards[0]   // select 默认值为第一项
      scope.newApplyFormData.formData.patiWard = scope.wardSelected.value

      /**
       * select 选择
       */
      scope.wardSelect = function() {
        scope.newApplyFormData.formData.patiWard = scope.wardSelected.value
      }

      // --------------- init ------------------- //

      /**
       * 点击新建
       */
      scope.confirmNew = Utils.debounce(function() {
        scope.canSubmit = Utils._valiNecessInfo(scope.newApplyFormData.formData)

        // 通过必填验证
        if(scope.canSubmit == 'pass') {
          // 拼接所需参数
          var _newPatiInfo = {
            id: null,
            patiId: scope.newApplyFormData.formData.patiId,
            patiVisitId: scope.newApplyFormData.formData.visitId,
            xlPatientId: null,
            xlMedicalId: null,
            name: scope.newApplyFormData.formData.patiName,
            ward: scope.wardSelected.label,
            wardId: scope.wardSelected.value,
            sendDoctor: null,
            applicationData: null,
            applicationFormStatus: null,
            sendFormStatus: null,
            pathologyReportStatus: null,
            creator: null,
            createTime: null,
            updator: null,
            updateTime: null,
            sex: scope.newApplyFormData.formData.patGender,
            admissionDataTime: null,
            isNew: '1'
          }

          // 更改 新建按钮为新建中
          scope.submitStatus = 'submitting'

          scope.totast = null

          // 传递数据给后台, 拿到是否可以新建本条数据的结果
          APIService.canNewApplyForm(scope.newApplyFormData.formData, _newPatiInfo).then(function(msg) {
            switch(msg.data) {
              case 'true': // 不重复, 可以新建
                  scope.submitStatus = 'init'

                  // 获取新建的用户 ID , 并缓存
                  APIService.getPatiId(scope.newApplyFormData.formData).then(function(msg) {
                    if (msg.status == 'ok') {
                      var _currOpt = {
                        formId: '1',
                        optType: 'create',
                        rowData: msg.data
                      }
                      
                      sessionStorage.setItem('currOpt', JSON.stringify(_currOpt))

                      scope.totast = {
                        status: 'ok',
                        description: '新建成功!',
                        callback: function() {
                          $route.reload()
                        },
                        delay: 1500
                      }

                    }
                  }, function(error) {
                    console.log(error)
                  })

                break
              
              case 'false': // 已存在, 不可新建
                scope.submitStatus = 'init'
                scope.totast = {
                  status: 'error',
                  description: '当前患者已存在, 请搜索下方列表进行详细操作!'
                }
                break
            }
          }, function(error) {
            scope.submitStatus = 'init'
            scope.totast = error
          })
        }
      }, 800, true)
      


      /**
       * 取消新建
       */
      scope.cancelNew = function() {
        scope.newApplyFormData.showForm = false
        
        scope.newApplyFormData.formData.patiId = null       // 清空已填写数据
        scope.newApplyFormData.formData.visitId = null
        scope.newApplyFormData.formData.patiName = null
        scope.newApplyFormData.formData.patGender = null
      }
    }


  }
}])
.directive('collectSpecData', [function() {
  // 收集符合条件的数据
  return {
    restrict: 'ECMA',
    scope:{
      collect: "=",
      data: "="
    },
    link:function (scope) {
      scope.collect.push(scope.data)
    }
  }
}])
.directive('specInterAct', [function() {
  // 收集特殊交互字段
  return {
    restrict: 'ECMA',
    scope:{
      collect: "=",
      item: "="
    },
    link:function (scope) {
      scope.collect.data = scope.item
    }
  }
}])
.directive('specInterActCon', [function() {
  // 收集特殊交互字段
  return {
    restrict: 'ECMA',
    templateUrl: 'js/html/spec-act-wrap.html',
    replace: true,
    scope:{
      enteritem: "=",
      specEle: "="
    },
    link:function (scope) {
      // 特殊交互字段表现样式 ng-style 
      scope.specStyle = {
        '61': {
          'width': '225px',
          'top': '20px',
          'left': '-90px'
        },
        '447': {
          'width': '225px',
          'top': '20px',
          'left': '-90px'
        },
        '448': {
          'width': '225px',
          'top': '20px',
          'left': '-90px'
        }
      }


      /**
       * 关闭 popover
       */
      scope.closePop = function() {
        scope.enteritem = null
      }

      /**
       *  点击单选按钮
       */
      scope.checkRadio = function(data) {
        scope.enteritem = scope.specEle[data.childId]
      }
    }
  }
}])
.directive('setInit', ['reportService', function(reportService) {
  // 报告页表单项设置初始值
  return {
    restrict: 'ECMA',
    scope:{
      singleData: "="
    },
    link:function (scope) {
      var savedDir = JSON.parse(sessionStorage.getItem('savedDir'))
      if(!scope.singleData.value) {
        if(savedDir) scope.singleData.value = reportService.initValue(scope.singleData, savedDir).value
      }
    }
  }
}])
.directive('iptDate', [function() {
  // 时间选择
  return {
    restrict: 'ECMA',
    link:function (scope, element) {

      $(element).daterangepicker({
        "autoUpdateInput": false,
        "singleDatePicker": true,
        "timePicker": true,
        "timePicker24Hour": true,
        "timePickerSeconds": true,
        "autoApply": true,
        "locale": {
            "format": "YYYY-MM-DD HH:mm:ss",
            "applyLabel": "应用",
            "cancelLabel": "取消",
        }
      }, function(start, end, label) {});

      $(element).on('apply.daterangepicker', function(ev, picker) {
        scope.item.value = picker.startDate.format('YYYY-MM-DD HH:mm:ss')
        scope.$apply();
      });
    }
  }
}])
.directive('preImg', ['SYS', 'APIService', 'Upload', '$timeout', function(SYS, APIService, Upload, $timeout) {
  // 上传图片
  return {
    restrict: 'ECMA',
    templateUrl: 'js/html/pre-img.html',
    scope: {
      item: "=",
      recordId: "=",
      showBtn: "=",
      editAble: "="
    },
    link:function (scope, element, attrs) { 
      scope.imgPath = []  // 存储图片 src
      scope.imgBase64 = []

      // 缓存已经上传的值
      scope.savedIds = scope.item.value ? scope.item.value.split(',') : []

      // 存储已上传的图片地址
      if(scope.savedIds.length > 0) {
        angular.forEach(scope.savedIds, function(val, ind) {

          APIService.getSavedImage(val).then(function(msg) {
            scope.imgBase64.push(msg.data)
            scope.imgPath.push(`${SYS.url}form/picture/find/${val}`)
          })
        })
      }

      /**
       * 上传图片
       * @param {*} file 
       * @param {*} errFile 
       */
      scope.uploadImg = function(files, errFiles) {
        scope.files = files;
        scope.errFiles = errFiles;

        var recordId = scope.recordId

        angular.forEach(files, function(file) {
          file.upload = Upload.upload({
              url:`${SYS.url}form/picture/save/${recordId}`,
              data: {file: file}
          });


          file.upload.then(function (response) {
              $timeout(function () {
                file.result = response.data.data[0];
                scope.imgPath.push(`${SYS.url}form/picture/find/${response.data.data[0].id}`)
                scope.savedIds.push(response.data.data[0].id) // 存储图片id
                scope.item.value = scope.savedIds.toString()  // 将上一步转化为字符串用于后台存储

                /**
                 * 获取上传的图片的 base64 数据
                 */
                APIService.getSavedImage(response.data.data[0].id).then(function(msg) {
                  scope.imgBase64.push(msg.data)
                })
              });
          }, function (response) {
              if (response.status > 0)
                  scope.errorMsg = response.status + ': ' + response.data;
          }, function (evt) {
              file.progress = Math.min(100, parseInt(100.0 * 
                                        evt.loaded / evt.total));
          });
        });
      }

      /**
       * 删除图片
       * @param {*} index 
       */
      scope.deleteThumb = function(index) {
        scope.savedIds.splice(index, 1)  // 删除value索引
        scope.imgPath.splice(index, 1)
        scope.item.value = scope.savedIds.toString()
        scope.imgBase64.splice(index, 1)
        console.log(scope.imgBase64)
      }
    }
  }
}])
.directive('stateManger', ['Session',function(Session) {
  // 列表状态及操作
  return {
    restrict: 'ECMA',
    templateUrl: 'js/html/state-manager.html',
    scope: {
      rowVal: "=",
      cellVal: "=",
      cellInd: "="
    },
    link:function (scope, element) {

      // 获取角色
      if(Session.getUser()) {
        scope.currUsr = Session.getUser()
        scope.currUsrRole = scope.currUsr.companyId
      }



      /**
       * 三种单据具体操作
       * @param {*} optType   操作类型: 创建/查看 
       * @param {*} formId  单据类型:　申请单/送检单/病例报告
       * @param {*} rowData   操作的行数据
       */
      scope.formOpts = function(formId, optType, rowData, cellVal) {
        var _currOpt = {
          formId: formId, 
          optType: optType,
          rowData: angular.copy(rowData)
        }

      // 判断当前报告单是否已生成或者更新
      if(['1','4'].indexOf(rowData['finalReportStatus']) >= 0 && _currOpt.formId == '3') {
        _currOpt.formId='4'
        _currOpt.optType='view'
        // 缓存当前操作
        sessionStorage.setItem('currOpt', JSON.stringify(_currOpt))

        // 如果是临床医生就跳转到最终已生成页
        location.href ="#/reportGened"


        // if(scope.currUsrRole == 30) {
        //   location.href ="#/reportGened"
        // } else {
        //   _currOpt.optType = 'edit'
        //   sessionStorage.setItem('currOpt', JSON.stringify(_currOpt))
        //   location.href = '#/report'
        // }
      } else {
        // 缓存当前操作
        sessionStorage.setItem('currOpt', JSON.stringify(_currOpt))
        location.href = '#/applyForm'   // 申请单/送检单/病例报告 共用一个 controller
      }

      }
    }
  }
}])
//这个directive用于监听历史信息是否渲染完毕
angular.module("infi-basic").directive('repeatHistoryFinish',['$timeout',function($timeout){
    return {
        restrict: 'ECMA',
        link:function(scope,element,attrs){
            if(scope.$last == true){
                $timeout(function() {
                    scope.$emit( 'renderOverHistory');
                });
            }
        }
    }
}])

// 用于三张主要表单指定类型截断并插入分割线
angular.module("infi-basic").directive('insertDivideLine',['$rootScope', function($rootScope){
  return {
    restrict: 'ECMA',
    link:function(scope, element, attrs){
      if (scope.item.addTextBoxType) {
        var currType = scope.item.addTextBoxType

        !$rootScope.addText[currType] ? $rootScope.addText[currType] = [] : undefined

        $rootScope.addText[currType].push(element)

      }

      if (scope.$parent.$last && scope.$last) {
        angular.forEach($rootScope.addText, function(val, key) {
          val[val.length - 1].after(`
          <div class="sec-pos normal-flex fill-blank"></div>
          <div class="sec-pos normal-flex fill-blank"></div>
          <div class="sec-pos normal-flex fill-blank"></div>
          <div class="sec-pos break-line"><hr class="divider" /></div>`)
        })
      }

    }
  }
}])