angular.module("infi-basic").controller("PatiManageController", [
  "$scope",
  "APIService",
  "PatiManageService",
  "Utils",
  "SYS",
  "$routeParams",
  "$timeout",
  function($scope, APIService, PatiManageService, Utils, SYS, $routeParams, $timeout) {
    var routeParams = $routeParams
    var currPati = JSON.parse(sessionStorage.getItem('currPati'))

    // 统一视图跳转链接
    $scope.unitHref = `${location.origin}/record-src-demo/#/record/${currPati.xlPatientId}`

    $scope.currGroup = null	                                // 当前所在护理组的数据
    $scope.planCollect = null                               // 存放患者当前分组下的方案集合

    $scope.groupListAbout = {
      groupsPatiIn: [],                                     // 患者所在护理组的集合
      currActive: 0,                                        // 当前激活的护理组索引，决定了页面当前显示的分组方案。  
      changeActive: function($ind) {
        if (this.currActive == $ind) return
        else this.currActive = $ind
        $scope.currGroup = this.groupsPatiIn[this.currActive]
        sessionStorage.setItem('currGroup', JSON.stringify($scope.currGroup))                 // 更新当前激活的所在护理组信息
      }
    }

    $scope.keyIndicatorSelectedDetail = {                    // 关键指标当前选中项的详细数据
      orgData: null,                                         // 原始数据
    }
    
    $scope.keyIndicatorSelect = {                             // 指标趋势时间下拉框
      data: [],                                               // 数据本体
      currSelected: null,
      change: (option) => {
        var param = {
          groupId: JSON.parse(sessionStorage.getItem('currGroup')).id,
          pId: routeParams.depId,
          projectName: option.projectName,
          type: option.testType,
          begin: $scope.keyIndicatorRange.timeRange[0],
          end: $scope.keyIndicatorRange.timeRange[1],
        }

        $scope.getIndicatorGraphState.stateChange('fetch')

        APIService.getIndicatorDetail(param)
          .then(function success(msg) {
            // 获取到原始的画图数据
            $scope.keyIndicatorSelectedDetail.orgData = msg
            // 加工数据
            $scope.keyIndicatorGraph.graphData = null
            setTimeout(function(){
              $scope.keyIndicatorGraph.graphData = PatiManageService.matchGraphType(option, $scope.keyIndicatorSelectedDetail.orgData)
              $scope.$apply()
            },0)

            $scope.getIndicatorGraphState.stateChange('success')
          }, function(error) {
            $scope.getIndicatorGraphState.stateChange('failure')
          })
      }
    }

    $scope.keyIndicatorRange = {                              // 指标趋势时间范围选择
      timeRange: [                                            // 存储已选择的时间范围
        Utils.formatDate(+new Date(), 'yyyy-MM-dd'),
        Utils.formatDate(+new Date(), 'yyyy-MM-dd')
      ],                                          
    }

    $scope.keyIndicatorGraph = {                              // 指标趋势画图相关数据
      graphData: null                                         // 画图数据
    }


    // ------------------- 本页请求的状态管理 -------------------------//
    var commSteteMachine = {
      'init': {
        fetch: 'fetching'
      },
      'fetching': {
        success: 'successful',
        failure: 'failed',
      },
      'successful': {
        refetch: 'init'
      },
      'failed': {
        refecth: 'init'
      }
    }


    $scope.getPlanState = {                                         // 获取方案的状态
      currState: 'init',                                            // 创建的当前状态
      stateMachine:commSteteMachine,                                // 创建相关的状态机
      stateChange: Utils.changeState()
    }

    $scope.getGroupState = {                                        // 获取患者所在护理组状态
      currState: 'init',                                            // 创建的当前状态
      stateMachine:commSteteMachine,                                // 创建相关的状态机,
      stateChange: Utils.changeState()
    }

    $scope.getKeyIndicatorState = {                                 // 获取关键指标状态
      currState: 'init',                                            // 创建的当前状态
      stateMachine:commSteteMachine,                                // 创建相关的状态机,
      stateChange: Utils.changeState()
    }

    $scope.getIndicatorGraphState = {                               // 获取当前选中的关键指标的类型的状态
      currState: 'init',                                            // 创建的当前状态
      stateMachine:commSteteMachine,                                // 创建相关的状态机,
      stateChange: Utils.changeState()
    }


    /**
     * 回患者列表
     */
    $scope.backToList =  () => {
      location.href = `#/list`
    }

    /**
     * 调整方案
     */
    $scope.toEditPlan = () => {
      location.href = `#/editPlan/${routeParams.depId}/${$scope.currGroup.id}`
    }


    /**
     * 没有方案时的评估（第一次评估）
     */
    $scope.firstEval = function() {
      var currInterview = JSON.parse(sessionStorage.getItem('currInterview'))
      location.href = `#/scaleEnter/${routeParams.depId}/${$scope.currGroup.id}/${currInterview.id}/${currInterview.crfTemplateId}/3`
    }


    // 初始化
    ;(function init () {
      // 获取当前正在操作的患者信息
      $scope.currPati = JSON.parse(sessionStorage.getItem('currPati'))


      // 获取患者所在护理组集合
      APIService.getPatiGroups({'depId': routeParams.depId})
        .then(function (msg) {
          $scope.groupListAbout.groupsPatiIn = msg

          // 区分从哪个缓存中取 depId
          // 第一次后台数据中区，默认第一个。并在 sessionStorage 中保留一份副本 currGroup
          // 之后就从 session 中取。
          if(sessionStorage.getItem('currGroup')) {
            $scope.currGroup = JSON.parse(sessionStorage.getItem('currGroup'))
          } else {
            $scope.currGroup = $scope.groupListAbout.groupsPatiIn[0]
            sessionStorage.setItem('currGroup', JSON.stringify($scope.currGroup))                 // 缓存当前激活的所在护理组信息
          }
        })
        .then(function() {
          $scope.getPlanState.stateChange('fetch')
          APIService.getPatiPlan({
            'groupId': $scope.currGroup.id,
            'depId': routeParams.depId
          }).then(function success (msg) {
            $scope.getPlanState.stateChange('success')
            $scope.recentEvaluate = msg.schemeGroupName                                           // 关键指标中的最近评估
            $scope.planCollect = msg.nurseSchemes
          }, function error (error) {
            $scope.getPlanState.stateChange('failure')
            $scope.planCollect = null
          })
        })
        .then(function() {

          $scope.getKeyIndicatorState.stateChange('fetch')

          APIService.getIndicatorSelect({
            type: $scope.currGroup.type
          })
            .then(function success(msg) {
              // 缓存下拉框数据
              $scope.keyIndicatorSelect.data = msg
              // 设置默认选中项
              $scope.keyIndicatorSelect.currSelected = msg[0]

              return $scope.keyIndicatorSelect.currSelected
            }, function error(error) {
              $scope.getKeyIndicatorState.stateChange('failure')
              $scope.getIndicatorGraphState = 'failed'
            })
            .then(function(currSelected) {
              $scope.getKeyIndicatorState.stateChange('success')
              
              // 请求默认第一项的详细数据
              $scope.keyIndicatorSelect.change(currSelected)

            }, function error(error) {
              $scope.getKeyIndicatorState.stateChange('failure')
            })
        })

    })()
  }
]);
