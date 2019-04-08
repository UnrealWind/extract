angular
  .module("infi-basic")
  .directive("toastPop", [
    "$timeout",
    function($timeout) {
      // totast 提示框
      return {
        restrict: "ECMA",
        templateUrl: "js/directive_tpl/toastPop.html",
        replace: true,
        scope: {
          totast: "="
        },
        link: function(scope) {
          var timeDelay = scope.totast.delay || 4000;
          var _delay = $timeout(function() {
            $timeout.cancel(_delay);
            if (scope.totast.callback) scope.totast.callback();
            scope.totast = null;
          }, timeDelay);
        }
      };
    }
  ])
  .directive("existedPati", [
    function() {
      // 已存在患者
      return {
        restrict: "ECMA",
        templateUrl: "js/directive_tpl/existed_addNew.html",
        replace: true,
        scope: {
          groupOrgData: "=",
          createInfo: "="
        },
        link: function(scope) {
          scope.info = [
            { label: "姓名", modal: "name", colspan: 4 },
            { label: "性别", modal: "sex", colspan: 4 },
            { label: "年龄", modal: "age", colspan: 4 },
            { label: "身份证号", modal: "idCard", colspan: 8 },
            { label: "身高", modal: "height", colspan: 4 },
            { label: "体重", modal: "weight", colspan: 4 },
            { label: "BMI", modal: "bmi", colspan: 4 },
            { label: "婚姻", modal: "marrage", colspan: 4 },
            { label: "文化程度", modal: "education", colspan: 4 },
            { label: "职业", modal: "job", colspan: 4 },
            { label: "支付方式", modal: "charType", colspan: 4 },
            { label: "家庭人均收入", modal: "income", colspan: 4 },
            { label: "居住情况", modal: "liveSituation", colspan: 4 },
            { label: "居住地", modal: "address", colspan: 4 },
            { label: "是否吸烟", modal: "smokeSituation", colspan: 8 },
            {
              label: "从事过接触粉尘/烟煤的职业",
              modal: "dustAndSoot",
              colspan: 12
            },
            { label: "合并其他疾病", modal: "otherDisease", colspan: 12 }
          ];
        }
      };
    }
  ])
  .directive("brandNewPati", [
    function() {
      // 全新的患者
      return {
        restrict: "ECMA",
        templateUrl: "js/directive_tpl/brand_addNew.html",
        replace: true,
        scope: {
          selectedGroup: "=",
          groupOrgData: "=",
          createInfo: "=",
          formEntity: "="
        },
        link: function(scope) {
          scope.createInfo.groupId = scope.selectedGroup.id  // 默认选中 列表筛选条件里的护理组
          // 赋值表单实例
          scope.formEntity.brandNewPatiForm = scope.brandNewPatiForm
          scope.formEntity.groupForm = scope.groupForm

          /**
           * 切换分组
           */
          scope.changeGroup = function(val) {
            sessionStorage.setItem('currGroup', JSON.stringify(val))
          }
        }
      };
    }
  ])
  .directive('iptDate', [
    "Utils",
    function(Utils) {
    // 时间选择
    return {
      restrict: 'ECMA',
      require: 'ngModel',
      link:function (scope, element, attrs, controllers) {
        $(element).daterangepicker({
          "startDate": Utils.formatDate(new Date().setFullYear(new Date().getFullYear() ), 'yyyy-MM-dd'),
          "singleDatePicker": true,
          "autoApply": true,
          "locale": {
              "format": "YYYY-MM-DD",
              "applyLabel": "应用",
              "cancelLabel": "取消",
          }
        }, function(start, end, label) {});
      }
    }
  }])
  .directive('iptDateRange', [
    "Utils",
    function(Utils) {
    // 时间选择
    return {
      restrict: 'ECMA',
      scope: {
        opts: '=',            // 自定义配置
        rangeBind: '='        // 绑定的范围数据值
      },
      link:function (scope, element) {
        var currInstance = null

        // 默认设置
        var wholeExts = {}

        // 如果传了自定义设置，就把自定义和默认合并
        if(scope.opts) {
          wholeExts = $.extend(scope.opts, {
            "locale": {
              "format": scope.opts['format'] || "YYYY-MM-DD",
              "applyLabel": "应用",
              "cancelLabel": "取消"
            },
            "autoUpdateInput": scope.opts.autoUpdateInput || false
          })
        }
        

        $(element).daterangepicker(wholeExts, function(start, end, label) {
          // 控制显示为日期选择还是日期范围选择
          if(this.singleDatePicker) {
            scope.rangeBind = start.format(this.locale.format)
          }
          else {
            scope.rangeBind[0] = start.format(this.locale.format)
            scope.rangeBind[1] = end.format(this.locale.format)
          }

          // 是否自动更新 input 的 value 值，主要用在是否默认选中今天
          if(!this.autoUpdateInput) {
            if(this.singleDatePicker) {
              $(element).val(this.startDate.format(this.locale.format))
            } else {
              $(element).val(this.startDate.format(this.locale.format) + ' - ' + this.endDate.format(this.locale.format));
            }
          }
          scope.$apply()
        })

        currInstance = $(element).data('daterangepicker');      // 缓存当前 picker 实例

        /**
         * 当自动更新 input value 配置为 true 时，为 ngModel 值赋初始值
         */
        if(currInstance.autoUpdateInput) {
          if(currInstance.singleDatePicker) {
            scope.rangeBind = currInstance.startDate.format(currInstance.locale.format)
          } else {
            scope.rangeBind[0] = currInstance.startDate.format(currInstance.locale.format)
            scope.rangeBind[1] = currInstance.endDate.format(currInstance.locale.format)
          }
        }
      }
    }
  }])




  // ------------------ 不同类型的输入类型，用于调整类型页面 ---------------------- // 
  // input text 
  .directive('plainIpt', [
    function() {
    return {
      restrict: 'ECMA',
      scope: {
        bindModel: '=',                           // 绑定的值
      },
      templateUrl: 'js/directive_tpl/plain_ipt.html',
      link:function (scope, element) {
        if(!scope.bindModel) {
          $(element).parent('span').hide()
          return
        }
      }
    }
  }])
  // select
  .directive('plainSele', [
    function() {
    return {
      restrict: 'ECMA',
      scope: {
        bindModel: '=',                           // 绑定的值
        optRange: '<',                             // option 范围数据
        bindName: "="
      },
      templateUrl: 'js/directive_tpl/plain_sele.html',
      link:function (scope, element) {
        if(!scope.bindModel) {
          $(element).parent('span').hide()
          return
        }

        scope.choseOption = (bindModel) => {
          angular.forEach(scope.optRange, function(ele, ind) {
            if (bindModel == ele.id) scope.bindName = ele.label
          })

          console.log('scope.bindModel :', scope.bindModel);
          console.log('scope.bindName :', scope.bindName);
        }
      }
    }
  }])
  