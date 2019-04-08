angular.module('infi-basic')
.directive('entryForm',['tplValue', function (tplValue){
    return {  
        restrict: 'ECMA',
        templateUrl: 'js/html/entryForm.html',
        replace: true,
        scope:{
            entryData: "="
        },
        link:function (scope) {
            scope.entryDataCopy = tplValue.entryDataCopy

            // 增加初步诊断
            scope.addNewDiag = function() {
                scope.entryData ?  scope.entryData.admDiag.push({
                                        deleted: 0,
                                        isNew: 1,
                                        id: null,
                                        xlPatientId: scope.entryData.xlPatientId,
                                        xlMedicalId: scope.entryData.xlMedicalId,
                                        patiId: scope.entryData.patiId,
                                        patiVisitId: scope.entryData.patiVisitId,
                                        diagnosisNo: null,
                                        diagnosisDesc: "",
                                        diagnosisTypeId:  '10003',
                                        diagnosisTypeSubId:  '100006',
                                        diagnosisCodeId: null
                                    }) :  undefined
            }

            // 删除初步诊断
            scope.deleNewDiag = function(ind) {
                scope.entryData.admDiag[ind].deleted = 1
            }

        }
    }
}])
.directive('exitForm',['Utils', 'tplValue', function (Utils, tplValue){
  return {  
      restrict: 'ECMA',
      templateUrl: 'js/html/exitForm.html',
      replace: true,
      scope:{
        // entryData: "=",
        exitData: "=",
      },
      link:function (scope) {
        scope.exitDataCopy = tplValue.exitDataCopy

        scope.$watch('exitData', function(newVal, oldVal) {
            if (newVal) {
                // 本页面日期范围控件初始化
                Utils.dateRangeSelect([
                    {
                        selector: '#exit-reappointTime',
                        options: {
                            "singleDatePicker": true,
                            "autoUpdateInput": false,
                            "timePicker": true,
                            "timePicker24Hour": true,
                            "locale": {
                                "format": "YYYY-MM-DD HH:mm:ss",
                                "applyLabel": "应用",
                                "cancelLabel": "取消",
                            }
                        },
                        callback: function(start, end, label) {
                            scope.exitData['reappointTime'] = start.format('YYYY-MM-DD HH:mm:ss')
                            console.log(scope.exitData['reappointTime'])
                        }
                    }
                ])
                $('#exit-reappointTime').on('show.daterangepicker', function(ev, picker) {
                    !picker.autoUpdateInput ? picker.autoUpdateInput = true : undefined
                })
            }
        })




        // 增加初步诊断
        scope.addNewOutDiag = function() {
            scope.exitData ?  scope.exitData.discDiag.push({
                                    deleted: 0,
                                    isNew: 1,
                                    id: null,
                                    xlPatientId: scope.exitData.xlPatientId,
                                    xlMedicalId: scope.exitData.xlMedicalId,
                                    patiId: scope.exitData.patiId,
                                    patiVisitId: scope.exitData.patiVisitId,
                                    diagnosisNo: null,
                                    diagnosisDesc: "",
                                    diagnosisTypeId:  '10002',
                                    diagnosisTypeSubId:  '100011',
                                    diagnosisCodeId: null
                                }) :  undefined
        }

        // 删除出院诊断
        scope.deleNewDiag = function(ind) {
            scope.exitData.discDiag[ind].deleted = 1
        }
      }
  }
}])
.directive('toastPop',['$timeout',function ($timeout){
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
.directive('newApplyForm', ['ViewService', 'Utils', '$route', function(ViewService, Utils, $route) {
        // 新建申请单 confim collapse
        return {
            restrict: 'ECMA',
            templateUrl: 'js/html/newApplyForm.html',
            replace: true,
            scope:{
                newApplyFormData: '='
            },
            link:function (scope) {
                scope.canSubmit = 'init';  // 是否存在未填项
                scope.submitStatus = 'init'; // 新建状态

                // 出入院病区下拉框数据初始化
                ViewService.getwrads().then(function(msg) {
                    scope.newApplyFormData.wards = msg.data;
                    scope.wardSelected = scope.newApplyFormData.wards[0];   // select 默认值为第一项
                });

                /*
                 * select 选择
                 */
                scope.wardSelect = function() {
                    scope.newApplyFormData.formData.deptIcuId = scope.wardSelected.value;
                }

                // --------------- init ------------------- //

                /**
                 * 点击新建
                 */
                scope.confirmNew = Utils.debounce(function() {
                    debugger
                    scope.newApplyFormData.formData.deptIcuId = scope.wardSelected.value;
                    scope.newApplyFormData.wards.forEach(function (n) {
                       n.value == scope.newApplyFormData.formData.deptIcuId ? scope.newApplyFormData.formData.deptIcuName = n.label : '';
                    });
                    scope.canSubmit = 'forbid';
                    if(scope.newApplyFormData.formData.patiId &&
                        scope.newApplyFormData.formData.deptIcuName &&
                        scope.newApplyFormData.formData.deptIcuId &&
                        scope.newApplyFormData.formData.patiVisitId &&
                        scope.newApplyFormData.formData.name &&
                        scope.newApplyFormData.formData.sex
                    ){
                        scope.canSubmit = 'pass';
                    }else {
                        scope.canSubmit = 'forbid';
                    }

                    // 通过必填验证
                    if(scope.canSubmit == 'pass') {

                        // 更改 新建按钮为新建中
                        scope.submitStatus = 'submitting';

                        scope.totast = null;

                        // 获取新建的用户 ID
                        ViewService.getPatiId(scope.newApplyFormData.formData).then(function(msg) {
                            if (msg.success == true) {
                                scope.totast = {
                                    requstStatus: 'resolved',
                                    text: '新建成功!',
                                    callback: function() {
                                        $route.reload();
                                    },
                                    delay: 500
                                }

                            }else if(msg.success == false){
                                scope.totast = {
                                    requstStatus: 'rejected',
                                    text: '当前患者已存在, 请搜索下方列表进行详细操作!'
                                };
                                scope.submitStatus = '';
                            }
                        }, function(error) {
                            console.log(error)
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
                    scope.newApplyFormData.formData.patiSource = null
                }
            }


        }
    }])
