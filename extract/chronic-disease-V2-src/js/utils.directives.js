angular
  .module("infi-basic")
  // 将后台返回的无序对象改为有序数组，便于循环中展示
  .directive('sortData', [
    'planFieldMap',
    function(planFieldMap) {
      return {
        restrict: 'A',
        replace: true,
        link: function(scope, element, attrs) {
          var level = attrs.preLevel.split('.')
          var currLevel = planFieldMap

          scope.orderMap = []

          level.forEach(function(ele, ind) {
            currLevel.hasOwnProperty(ele) ? currLevel = currLevel[ele] : undefined
          })

          angular.forEach(currLevel, function(val, key) {
            var tarObj = scope.$ctrl.singleItem

            scope.orderMap[val.index] = {
              data: tarObj[key],
              type: val.type,
              style: val.style,
              keyTxt: key,
            }
          })
        }
      }
  }])
  // toggle 展开收起箭头状态
  .directive("copyContentToScore", [
    function() {
      return {
        restrict: "ECMA",
        scope: true,
        link: function(scope, element, attrs) {
          if(!scope.secChild.optionList[0].score) scope.secChild.optionList[0].score = scope.secChild.choicedOptionList[0].content
        }
      };
    }
  ])
  // toggle 展开收起箭头状态
  .directive("toggleCollapse", [
    function() {
      return {
        restrict: "ECMA",
        scope: true,
        link: function(scope, element, attrs) {
          scope.defaultStatus = 1

          scope.classes = {
            0: 'glyphicon-triangle-right',
            1 : 'glyphicon-triangle-bottom'
          }

          $(element).on('click', function () {
            if (scope.defaultStatus === 0) scope.defaultStatus = 1
            else scope.defaultStatus = 0

            scope.$apply()
          })
        }
      };
    }
  ])
  // 全部折叠 / 展开
  .directive("toggleAll", [
    function() {
      return {
        restrict: "ECMA",
        template: `
          <span class="cursor toggle-all-btn"
                ng-bind="currState.alias"
                ng-click="toggleCollapse()"></span>
        `,
        scope: true,
        link: function(scope, element, attrs) {
          var $allCollapseEle = null

          // 默认全部展开
          scope.currState = {
            code: 1,
            alias: '全部收起'
          }

          scope.toggleCollapse = function () {
            if (scope.currState.code === 1) {
              scope.changeCollapse(scope.currState.code)
              scope.currState.code = 0
              scope.currState.alias = '全部展开'
            } else {
              scope.changeCollapse(scope.currState.code)
              scope.currState.code = 1
              scope.currState.alias = '全部收起'
            }
          }

          scope.changeCollapse = function (status) {
            if (status === 0) {
              $allCollapseEle.each(function (ind, ele) {
                var $ele = $(ele)
                var $JCollpaseTitle = $ele.siblings('.panel-heading').find('.J-collpase-title')
                $ele.collapse('show')
                angular.element($JCollpaseTitle).scope().defaultStatus = 1
              })
            } else {
              $allCollapseEle.each(function (ind, ele) {
                var $ele = $(ele)
                var $JCollpaseTitle = $ele.siblings('.panel-heading').find('.J-collpase-title')
                $ele.collapse('hide')
                angular.element($JCollpaseTitle).scope().defaultStatus = 0
              })
            }
          }

          angular.element(document).ready(function () {
            $allCollapseEle = $('.J-collpase')
          });
        }
      };
    }
  ])
  // 身份证号表单验证
  .directive("idcardnum", [
    function() {
      return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
          // 身份证号正则表达式
          var IDCARDNUM_REGEXP = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/

          ctrl.$validators.idcardnum = function(modelValue, viewValue) {
            if(ctrl.$isEmpty(modelValue)) {
              return true
            }

            if(IDCARDNUM_REGEXP.test(+viewValue)) {
              return true
            }

            return false
          }
        }
      };
    }
  ])
  // 将数字改为字符串，主要用于 select 匹配选中
  .directive('numToString', [function() {
    return {
      restrict: 'ECMA',
      scope: {
        modelData: "=",
      },
      link: function(scope, element) {
        scope.$watch('modelData', function(newVal, oldVal) {
          if(scope.modelData==null){
            scope.modelData = ''
          } else if (scope.modelData==''){
            scope.modelData = ''
          }
    
          scope.modelData = scope.modelData.toString();
        })

      }
    }
  }])
  // 为分配方案的原始数据 schemeTemplate -> schemeMaterials 同级增加
  // result 字段，内容和 schemeMaterials 一模一样
  .directive('addResultField', [function() {
    return {
      restrict: 'A',
      scope: {
        schemeTemplate: '='
      },
      link: function(scope) {
        scope.$watch('schemeTemplate.schemeMaterials', function(newVal, oldVal) {
          // 因为二者内容需要保持一致，所以采用引用的方式使二者保持同步变化
          scope.schemeTemplate['result'] = scope.schemeTemplate.schemeMaterials
        })
      }
    }
  }])

  // keep-fixed
  .directive('keepFixed', [
    'Utils',
    function(Utils) {
      return {
        restrict: 'A',
        link: function(scope, element) {
          // 只有当关键指标存在时才改变 top 值
          if($('.key-indicators').length > 0) {
            var currScrollUp = 0
            var $infiMain =  $('article.infi-main')
            $infiMain.on('scroll.keepfixed', Utils.debounce(function () {
              currScrollUp = $infiMain.scrollTop()

              if(currScrollUp < $('.key-indicators')[0].clientHeight + 30) $(element).css({'top': -currScrollUp + 'px'})
              else $(element).css({'top': -($('.key-indicators')[0].clientHeight + 30) + 'px'})
            }, 50))
          }
        }
      }
  }])
  // 方案搜索
  .directive('planItemSearch', ['Utils', 'SYS', 'APIService', function(Utils, SYS, APIService) {
    return {
      restrict: 'ECMA',
      templateUrl: 'js/directive_tpl/plan_item_search.html',
      scope: {
        planType: '<',        // 当前计划类型
        initSearch: '<',      // 初始化点击搜索
        renderField: '<',     // 要渲染的字段
        singleItemClick: '&'  // 单个条目点击回调
      },
      link: function(scope, element) {
        var $ele = $(element)
        var $iptEle = $ele.find('.ipt')
        var $rstList = $ele.find('.planItem-search-dir-rst-wrapper')
        var $dir = $ele.find('.planItem-search-dir')
        var iptEleWidth = $iptEle[0].clientWidth
        $rstList.css('width', `${iptEleWidth}px`)


        scope.searchAbout = {
          kw: '',                                              // 搜索关键字
          rst: [],                                            // 缓存每次搜索结果
          currState: 'init',                                  // 搜索框的当前状态
          stateMachine: {                                     // 搜索框的状态机
              'init': {
                  search: 'searching'
              },
              'searching': {
                  success: 'showRst',
                  failure: 'showErr',
                  search: 'searching'
              },
              'showRst': {
                  research: 'init'
              },
              'showErr': {
                  research: 'init'
              }
          },
          search: Utils.debounce(function(callback) {               // 搜索主函数
                          scope.searchAbout.currState = 'init'
                          scope.searchAbout.changeState('search')
                          APIService.getPlanItem({
                            type: scope.planType,
                            kw: scope.searchAbout.kw,
                            groupId: JSON.parse(sessionStorage.getItem('currGroup')).id
                          })
                          .then(function(msg) {
                            callback ? callback() : undefined
                            scope.searchAbout.changeState('success')
                            scope.searchAbout.rst = msg
                          }, function(error) {
                            scope.searchAbout.changeState('failure')
                          })
          }, 200),
          changeState: function(name) {                       // 修改状态
              var state = scope.searchAbout.currState
  
              if(scope.searchAbout.stateMachine[state][name]) {
                  scope.searchAbout.currState = scope.searchAbout.stateMachine[state][name]
              }
              console.log(`${state} + ${name} --> ${scope.searchAbout.currState}`)
          }
        }

        // 开启初始化搜索
        if(scope.initSearch) {
          $iptEle.on('click.blankDisapper', (event) => {
            if($rstList.css('display') == 'none') {
              $rstList.show()
              scope.searchAbout.search(null)
            }
          })
        }

        // 点击组件内的元素不消失
        $dir.on('click.blankDisapper', (event) => {
          // 防止触发冒泡触发点击空白消失的逻辑代码。
          event.stopPropagation()
          $('.planItem-search-dir-rst-wrapper').not($rstList).css('display', 'none')
        })


        // 点击空白处消失
        $(document).on('click.blankDisapper', (event) => {
          // 只是 input text DOM 实例
          var iptEntity = $iptEle.find("input[type=text]")[0]

          var iptScope = angular.element(iptEntity).scope()

          if(!iptScope || !iptScope.hasOwnProperty('searchAbout')) return

          iptScope.searchAbout.currState = 'init'
          iptScope.searchAbout.kw = ''
          iptScope.searchAbout.rst = []
          $rstList.hide()
          scope.$apply()
        })



      }
    }
  }])
  .directive("modalListen", [
  function() {
    return {
      restrict: "ECMA",
      scope: true,
      link: function(scope, element, attrs) {
        element.on('hidden.bs.modal', function (e) {
          scope.$parent.checkedRad.length = 0
        })
      }
    };
  }
])

.directive("iptDateRangeApply", [
  function() {
    return {
      restrict: "ECMA",
      link: function(scope, element, attrs) {
        element.on('apply.daterangepicker', function(ev, picker) {
          scope.keyIndicatorSelect.change(scope.keyIndicatorSelect.currSelected)
        })
      }
    };
  }
])
