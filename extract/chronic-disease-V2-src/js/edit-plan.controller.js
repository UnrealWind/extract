angular.module("infi-basic").controller("EditPlanController", [
  "$scope",
  'EditPlanService',
  "APIService",
  "Utils",
  "$routeParams",
  "$sce",
  function($scope, EditPlanService, APIService, Utils, $routeParams, $sce) {
    var routeParamers = $routeParams                          // 路由参数
    var commSteteMachine = {                                  // 通用状态机
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

    $scope.planOrgData = null                                 // 存储方案原始数据
    $scope.planRendData = null                                // 存储方案渲染数据
    $scope.optRange = null                                    // 存储 select 范围数据

    $scope.totast = {                                         // totast 通知
      mainBody: null
    }

    $scope.savePlanState = {                                  // 保存当前方案操作的状态
      currState: 'init',
      stateMachine: commSteteMachine,                                            
      stateChange: Utils.changeState(),                       
    }


    $scope.groupRange = {                                                  // 患者分组范围数据相关
      data: null,
      changeSele: () => {
        var newPlan = Utils.findObjectByKey($scope.groupRange.data, 'schemeGroupName', $scope.planCollect.setGroup).obj
        $scope.planOrgData = newPlan
        $scope.planRendData = newPlan.nurseSchemes
      }
    }                                                 

    // 方案数据： 现行方案和推荐方案
    $scope.planCollect = {
      setGroup: null,                                                     // 标示是否显示评估结果里患者的分组信息
    }


    $scope.naviFuncs = {                                      // 页面导航跳转方法
      /**
       * 回患者管理页
       */
      'toPatiManage': () => {
        location.href = `#/patiManage/${routeParamers.depId}`
      },
      /**
       * 保留当前方案
       */
      'keepCurrPlan': () => {
        location.href = `#/patiManage/${routeParamers.depId}`
      }
    }


    /**
     * 获取要调整的方案的原始数据
     */
    var getEditPlan = function() {                         
      return APIService.getEditPlan({
        'groupId': routeParamers.groupId,
        'depId': routeParamers.depId
      })
    }

    /**
     * 获取方案中 select 的围表信息
     */
    var getSeletRange = function() {
      return APIService.getPlanOptRange()
    }

    /**
     * 保存当前方案
     */
    $scope.saveCurrPlan = function() {
      $scope.savePlanState.stateChange('fetch')
      APIService.applyPlan({
        'groupId': routeParamers.groupId,
        'depId': routeParamers.depId
      }, $scope.planOrgData)
      .then(function success(msg) {
        if(msg) {
          $scope.savePlanState.stateChange('success')
          
          $scope.totast.mainBody = {                                             // 通知提示语定义
            status: 'ok',
            description: '保存成功！',
            callback: function() {
              location.href = `#/patiManage/${routeParamers.depId}`
            },
            delay: 1000
          }

        } else {
          $scope.savePlanState.stateChange('failure')
          
          $scope.totast.mainBody = {                                             // 通知提示语定义
            status: 'error',
            description: '保存失败, 请重试!',
            delay: 1500
          }
        }
      }, function error(error) {
        $scope.savePlanState.stateChange('failure')
        
        $scope.totast.mainBody = {                                             // 通知提示语定义
          status: 'error',
          description: '保存失败, 请重试!',
          delay: 1500
        }
      })
    }
    





    ;(function init () {
      getEditPlan()                                                 // 首次获取要调整的方案的原始数据
        .then(function success(msg) {
          $scope.planOrgData = msg                                  // 缓存方案原始数据
          $scope.planCollect.setGroup = msg ? msg.schemeGroupName : null
          $scope.planRendData = msg.nurseSchemes                    // 缓存方案渲染数据
        }, function error (error) {
          console.log('请求方案数据出错')
        })

        // 获取患者分组下拉框范围数据
        APIService.getGroupRange({
          'groupId': routeParamers.groupId
        })
          .then(function(msg) {
            $scope.groupRange.data = msg

            if(!$scope.planCollect.setGroup) {
              $scope.planCollect.setGroup = msg[0].schemeGroupName
              $scope.groupRange.changeSele()
            } 
          })
      
      getSeletRange()                                               // 获取方案中 select 的范围数据
        .then(function success(msg) {
          $scope.optRange = Utils.fixOptRange(msg)
        }, function error (error) {
          console.log('请求 select 范围数据出错')
        })
    })()
  }
]);