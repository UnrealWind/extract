// 多选 toggle 选中状态
angular.module('infi-basic').directive('toggleCheckbox', [function () {
  return {
      restrict: 'ECMA',
      scope: {
        secChild: "=",
        values: "=",
        check: "="
      },
      link: function (scope,element,attrs) {
        $(element).on('click', function() {
          if(scope.values.indexOf(scope.check.kid) >= 0) {
            var ind = scope.values.indexOf(scope.check.kid)
            scope.values.splice(ind, 1)

            var checkedInd = scope.secChild.searchAbout.checkedItem.indexOf(scope.check.kid)
            scope.secChild.searchAbout.checkedItem.splice(checkedInd, 1)

            scope.secChild.searchAbout.checkedRst.forEach(function(ele, ind) {
              if(ele.kid == scope.check.kid) scope.secChild.searchAbout.checkedRst.splice(ind, 1)
            })
          } else {
            scope.values.push(scope.check.kid)

            scope.secChild.searchAbout.checkedItem.push(scope.check.kid)

            scope.secChild.searchAbout.checkedRst.push(scope.check)
          }

          console.log(scope.secChild.searchAbout)

          scope.$apply()
        })
      }
  }
}]);


angular.module('infi-basic').directive('initCheckedArray', [function() {
  return {
    restrict: 'ECMA',
    scope: {
      secChild: "=",
    },
    link: function(scope, element) {
      if(!scope.secChild.searchAbout) {
        scope.secChild.searchAbout = {
          kw: null,
          rst: null,          // 存结果对象, 用于展示搜索结果
          checkedRst: [],   // 存储已选中的搜索结果对象
          checkedItem: [],   // 存的是 kid
        }
      }


    }
  }
}])

angular.module('infi-basic').directive('combineAll', [function() {
  return {
    restrict: 'ECMA',
    scope: {
      secChild: "=",
    },
    link: function(scope, element) {
    }
  }
}])

// input 搜索框
angular.module('infi-basic').directive('inputSearch', ['Utils', '$http', 'SYS', function(Utils, $http, SYS) {
  return {
    restrict: 'ECMA',
    templateUrl: './html/input-search.html',
    scope: {
      saveto: "=",
      searchtype: "=",
      showSpecField: "=",
      specTh: "=",
      sign: "=",
      addToSelected: '&'
    },
    link: function(scope, element) {
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
        search: Utils.debounce(function(kw, callback) {               // 搜索主函数
                        scope.searchAbout.currState = 'init'
                        scope.searchAbout.changeState('search')
                        $http.get(`${SYS.prescriptUrl}dm/type/${scope.searchtype}/search?filter_LIKE_searchName=${kw}`).then(function(msg) {
                          if(msg.data.status == 'ok') {
                            callback ? callback() : undefined
                            scope.searchAbout.changeState('success')
                            scope.searchAbout.rst = msg.data.data
                            scope.searchAbout.rst[0]['active'] = true;
                          } else if(msg.data.status == 'blank') {
                            callback ? callback() : undefined
                            scope.searchAbout.changeState('success')
                            scope.searchAbout.rst = []
                          } else {
                            callback ? callback() : undefined
                            scope.searchAbout.changeState('failure')
                            scope.searchAbout.rst = []
                          }
                        }, function(error) {
                          callback ? callback() : undefined
                          scope.searchAbout.changeState('failure')
                          scope.searchAbout.rst = []
                        })
        }, 150),
        changeState: function(name) {                       // 修改状态
            var state = scope.searchAbout.currState

            if(scope.searchAbout.stateMachine[state][name]) {
                scope.searchAbout.currState = scope.searchAbout.stateMachine[state][name]
            }
            console.log(`${state} + ${name} --> ${scope.searchAbout.currState}`)
        }
      }

      /**
       * 检测指定元素是否超出指定容器
       * @param {*} ele 基准元素
       * @param {number} addEle 添加的元素
       * @param {*} wrapper 外侧范围容器
       * @return {boolean} true / false
       */
      function checkIfOutWindow(ele, addEle, wrapper) {
        var $ele = $(ele)[0]
        var $art = $(wrapper)[0]
        var artH = $art.clientHeight
        var offsets = $($ele).offset()

        var top = offsets.top
        // 超出了 显示在上面
        if( top + addEle > artH ) {
          return true
        } else {  // 没有超出
          return false
        }
      }

      /**
       * 点击搜索框
       */
      scope.clickToSearch = function(kw, e) {
        e.stopPropagation()
        $(`J-search-rst-wrapper-${scope.sign}`).css({zIndex: -1})
        if(scope.searchAbout.currState == 'init') {
          scope.searchAbout.search(kw, function() {
            angular.forEach($('.search-input'), function(val, ind) {
              if ($(val)[0].id != `J-search-input-${scope.sign}`) {
                angular.element($(val)[0]).scope().clearInput()
              }
            })

            // 判断如何显示搜索结果的位置
            setTimeout(function() {
              var $ipt = $(`#J-search-input-${scope.sign}`)         // 当前的搜索框
              var iptH = $ipt[0].clientHeight                       // 当前的搜索框全部高度
              var $rst = $(`#J-search-rst-wrapper-${scope.sign}`)   // 搜索结果容器元素
              var rstH = $rst[0].clientHeight                       // 搜索结果容器元素全部高度
              if(checkIfOutWindow($ipt, rstH, '.infi-main.infi-wj-article')) {
                $rst.css({zIndex: 10, top: -rstH})
              } else {
                $rst.css({zIndex: 10, top: iptH + 13})
              }
            }, 0)
          })
        }

          $(e.currentTarget).unbind('keydown').keydown(function (e) {
              console.log(e.keyCode)
              var mark;
              scope.searchAbout.rst.forEach(function (n,i) {
                  n['active']?(mark = i):'';
              });
              if(e.keyCode == 40){
                  if(!scope.searchAbout.rst[mark+1]) {
                      return false;
                  }
                  scope.searchAbout.rst[mark]['active'] = false
                  scope.searchAbout.rst[mark+1]['active'] = true;
                  scope.$apply();
                  return false;  //为了取消默认事件
              }else if (e.keyCode == 38){
                  if(!scope.searchAbout.rst[mark-1]) {
                      return false;
                  }
                  scope.searchAbout.rst[mark]['active'] = false
                  scope.searchAbout.rst[mark-1]['active'] = true;
                  scope.$apply();
                  return false;  //为了取消默认事件
              }else if(e.keyCode == 13){
                  scope.addToSelected({rst:scope.searchAbout.rst[mark],saveto:scope.saveto,callback:undefined,sign:scope.sign})
                  scope.$apply();
              }
          })

      }

      /**
       * 清空搜索框
       */
      scope.clearInput = function() {
        scope.searchAbout.kw = ''
        scope.searchAbout.rst = []
        scope.searchAbout.currState ='init'
          //  保存操作
      }

      scope.$on('clickOutside', function(param) {
        if(scope.searchAbout.currState != 'init') {
          scope.clearInput()
          scope.$apply()
        }
      })
    }
  }
}])


angular.module('infi-basic').directive('numToString', [function() {
  return {
    restrict: 'ECMA',
    scope: {
      modelData: "=",
    },
    link: function(scope, element) {
      if(scope.modelData==null){
        scope.modelData = ''
      } else if (scope.modelData==''){
        scope.modelData = ''
      }

      scope.modelData = scope.modelData.toString();
    }
  }
}])

.directive("reduceLen", [
  function() {
    // 将数组截取为固定长度
    return {
      restrict: "ECMA",
      replace: true,
      scope: {
        arr: "=",
        len: "="
      },
      link: function(scope) {
        if(scope.arr.length > scope.len) scope.arr.length = scope.len
      }
    };
  }
])
// 为了给带有 ng-if 或者 ng-show 的元素绑定事件监听
.directive("bindNgIf", [
  function() {
    // 将数组截取为固定长度
    return {
      restrict: "ECMA",
      replace: true,
      scope: {},
      link: function(scope, element) {
        $(element).on('click', function(event) {
          event.stopPropagation()
          console.log('被点了')
        })
      }
    };
  }
])

