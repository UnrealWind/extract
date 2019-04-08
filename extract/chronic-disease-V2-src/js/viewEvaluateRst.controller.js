angular.module("infi-basic").controller("ViewEvaluateRstController", [
  "$scope",
  'ViewEvaluateRstService',
  "APIService",
  "Utils",
  "$q",
  "$routeParams",
  function($scope, ViewEvaluateRstService, APIService, Utils, $q, $routeParams) {
    var $confirmHasNullEvaModal = $('#confirm-hasNullEva-modal')          // 是否有未评估量表提示框
    var $confirmExeModal = $('#confirm-exe-Modal')                        // 确认执行方案模态框
    var routeParams = $routeParams                                        // 缓存路由参数信息 depId、groupId

    /**
     * 改变当前 interview 的状态
     */
    var changePlanItemState = function(callback) {
      // status map
      var statusMap = {
        '未执行': '已执行',
        '已执行': '已执行'
      }
      // statusCode map
      var statusCode = {
        'waiting': 'finish',
        'finish': 'finish'
      }

      var currInter = JSON.parse(sessionStorage.getItem('currInterview'))
            // 排除 “基本资料” 和 “患者基本资料的情况”， 因为他们不需要更改状态。status、statusCode 为 null
      if (currInter.type !== 'default') {
        APIService.changePlanItemStatus({
          'status': statusMap[currInter.status],
          'statusCode': statusCode[currInter.statusCode]
        }, currInter)
          .then(function(msg) {
            callback ? callback() : undefined
          }, function(error) {
              $scope.totast.mainBody = {                                  // 通知提示语定义
              status: 'error',
              description: '出错了,请重新保存!',
              delay: 1500
            }
          })
      }
    }

    $scope.totast = {                                                     // totast 通知
      mainBody: null
    }

    $scope.ifShowBackToEva = false                                        // 是否显示 $confirmHasNullEvaModal 提示模态框
    $scope.nullEvals = {}                                                 // 存储未填写完整的数据项，用于模态框提示中显示
    $scope.optRange = {}                                                  // 存储方案下拉框的维表信息
    $scope.groupRange = {                                                  // 患者分组范围数据相关
      data: null,
      changeSele: () => {
        var newPlan = Utils.findObjectByKey($scope.groupRange.data, 'schemeGroupName', $scope.planCollect.setGroup).obj

        $scope.planCollect['orgPlanData'].new = newPlan
        
      }
    }                                                 

    // 方案数据： 现行方案和推荐方案
    $scope.planCollect = {
      hasFeedBack: false,                                                 // 是否已经拿到方案数据
      setGroup: null,                                                     // 标示是否显示评估结果里患者的分组信息
      orgPlanData: null,                                                  // 请求回来方案的原始数据
      ifHasCurrPlan: true                                                 // 是否匹配到分组
    }


    var utilFuncs = {
      /**
       * 检测评估结果中是否存在未填写项，如果有，则展示不可关闭的弹窗引导其去补全评估
       */
      checkEvalRstHasNull: (rsts) => {
        var ifHas = false       // 是否存在
        angular.forEach(rsts, (val, key) => {
          if (val.value === '未填写') {
            ifHas = true
            utilFuncs.fillNullEvals(key, val)
          }
        })

        return ifHas
      },

      /**
       * 向 $scope.nullEvals 中缓存未完成填写的量表数据，用于模态框展示
       */
      fillNullEvals: (key, val) => {
        $scope.nullEvals[key] = val
      },

      /*
       * 将评估结果原始数据加工成 scheme/choice 需要的格式
       * @param <original> 原始格式
       * @return 接口所需格式
      */ 
      fixEvalRstToGetPlan: (original) => {
        var tarObj = {}
        angular.forEach(original, (val, key) => {
          tarObj[key] = val.score
        })

        return tarObj
      }
    }

    // 评估结果相关
    $scope.evaluateRstAbout = {

      /**
       * 返回患者主页
       */
      'backToPatiManage': () => {
        location.href = `#/patiManage/${routeParams.depId}`
      },

      /**
       * 返回患者列表页
       */
      'backToList': () => {
        location.href = `#/list`
      },

      /**
       * 返回完善评估结果
       */
      'backToCompleteEva': () => {
        $confirmHasNullEvaModal.on('hidden.bs.modal', function(e) {
          location.href = `#/scaleEnter/${routeParams.depId}/${routeParams.groupId}/${routeParams.interviewId}/${routeParams.crfTemplateId}/0`
        })

        $confirmHasNullEvaModal.modal('hide')
      },
      /**
       * 保留现有方案
       */
      'keepCurrPlan': () => {
        changePlanItemState(() => {
          // 跳转路由
          location.href = `#/patiManage/${$routeParams.depId}`
        })
      }
    }

    // 方案应用异步操作状态管理
    $scope.applyPlanState = {
      currState: 'init',                                            // 创建的当前状态
      stateMachine: {                                               // 创建相关的状态机
        'init': {
          apply: 'applying'
        },
        'applying': {
          success: 'applied',
          failure: 'failed',
        },
        'applied': {
          reset: 'init'
        },
        'failed': {
          reset: 'init'
        }
      },
      stateChange: Utils.changeState(),                                   // 更改状态
    }


    // 方案应用相关
    $scope.planOpts = {
      promptTxt : '',                                                     // 确认执行方案模态框提示文字               
      tmpApply: null,                                                     // 待选方案
      /**
       * 取消执行方案
       */
      'clearTmpApply': () => {
        $scope.planOpts.tmpApply = null                                   // 重置待选方案
        $scope.planOpts.promptTxt = '',
        $scope.applyPlanState.currPati = 'init'                           // 重置模态框状态
        $confirmExeModal.unbind('hidden.bs.modal')                        // 解绑模态框隐藏事件监听
        $confirmExeModal.modal('hide')                                    // 隐藏模态框
      },
      /**
       * 点击执行方案
       */
      'execuate': (param) => {
        switch (param.type) {
          case 'currPlan' : 
            $scope.promptTxt = '病人将维持原有计划不变，是否保存操作？'
            $scope.planOpts.tmpApply = param.plan;
            console.log('$scope.planOpts.tmpApply :', $scope.planOpts.tmpApply);
            break

          case 'recommandPlan' : 
            $scope.promptTxt = '原有计划将被推荐方案代替，是否继续？'
            $scope.planOpts.tmpApply = param.plan;
            console.log('$scope.planOpts.tmpApply :', $scope.planOpts.tmpApply);
            break
        }

        $confirmExeModal.modal('show')
      },

      /**
       * 确认更改方案
       */
      'confirmUpdatePlan': () => {
        $scope.applyPlanState.stateChange('apply')
        APIService.applyPlan({
          'groupId': routeParams.groupId,
          'depId': routeParams.depId
        }, $scope.planOpts.tmpApply)
          .then(function(msg) {
            if(msg) {
              $scope.applyPlanState.stateChange('success')
              $confirmExeModal.on('hidden.bs.modal', function() {
                location.href = `#/patiManage/${routeParams.depId}`
              })

              setTimeout(() => {
                $confirmExeModal.modal('hide')
              }, 500)
            } else {
              $scope.applyPlanState.stateChange('failure')
            }
          }, function(error) {
            $scope.applyPlanState.stateChange('failure')
          })
      },

      /**
       * 上次应用失败，重新应用
       */
      'reApply': () => {
        $scope.applyPlanState.stateChange('reset')                        // 重置状态为 init
        $scope.planOpts.confirmUpdatePlan()                               // 重新应用
      }
    }



    ;(function init() {
      /**
       * 获取评估结果
       */
      APIService.getEvaluateRst({
        'depId': routeParams.depId,
        'groupId': routeParams.groupId,
        'interviewId': routeParams.interviewId,
      })
      .then(function(msg) {
        $scope.evaluateRst = msg
        // 是否显示 $confirmHasNullEvaModal 提示模态框标示
        $scope.ifShowBackToEva = utilFuncs.checkEvalRstHasNull(msg)

        if ($scope.ifShowBackToEva) {
          setTimeout(() => {
            $confirmHasNullEvaModal.modal('show')
          }, 800)
        } else {
          // 将评估结果数据加工成 scheme/choice 格式
          var tarObj = utilFuncs.fixEvalRstToGetPlan($scope.evaluateRst)


          // 获取下拉框维表信息
          APIService.getPlanOptRange()
            .then(function(msg) {
              $scope.optRange = Utils.fixOptRange(msg)
            })
            .then(function() {
              // 获取原有方案和推荐方案
              APIService.getPlan({
                'groupId': routeParams.groupId,
                'depId': routeParams.depId
              }, tarObj)
                // 缓存数据、更改标示
                .then(function(msg) {
                  $scope.planCollect.hasFeedBack = true                                                                        // 更改是否成功获得数据的控制标示
                  $scope.planCollect.setGroup = msg.new ? msg.new.schemeGroupName : null                                       // 更新患者所在分组
                  $scope.planCollect['orgPlanData'] = msg                                                                      // 缓存请求回来的方案原始数据
                }, function(error) {
                  $scope.planCollect.hasFeedBack = 'faliure'
                })
                .then(function () {
                  // 获取患者分组下拉框范围数据
                  APIService.getGroupRange({
                    'groupId': routeParams.groupId
                  })
                    .then(function(msg) {
                      $scope.groupRange.data = msg

                      if(!$scope.planCollect.setGroup) {
                        $scope.planCollect.ifHasCurrPlan = false                                                              // 记录下本次为未匹配到分组
                        $scope.planCollect.setGroup = msg[0].schemeGroupName                                                  // 缓存匹配到的分组名称
                        $scope.groupRange.changeSele()
                      } 
                    })
                })
            })

        }
      })
    })()
  }
]);