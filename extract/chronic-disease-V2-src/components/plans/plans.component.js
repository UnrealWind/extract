function planController ($scope, $routeParams, Utils, APIService, $route) {
  var ctrl = this
  var routeParams = $routeParams
  var createFollowUpModal = $('#create-followUp-Modal')     // 新建随访模态框

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

  ctrl.totast = {                                         // totast 通知
    mainBody: null
  }

  ctrl.interviewInd = null                                // 随访方案在 planCollect 中的索引


  ctrl.getPlanState = {                                         // 获取方案的状态
    currState: 'init',                                            // 创建的当前状态
    stateMachine:commSteteMachine,                                // 创建相关的状态机
    stateChange: Utils.changeState()
  }

  ctrl.dateRangeAbt = {                                      // 新建随访的时间范围选择控件相关配置
    config: {
      singleDatePicker: true,                             
      autoUpdateInput: true                                  // true 的时候可以初始显示设定的开始时间，默认为今天。这里设置的值只是 input 的 value property 值。绑定关系已经在 iptData directive 中写好了，直接引用并传入需要绑定的字段到 directive 的 range-bind property 上即可实现双向双向数据绑定
    }
  }

  ctrl.createFollowUpAbt = {                                // 新建随访表单相关
    currState: 'init',                                      // 当前状态
    formDataBind: {
      name: null,
      createTime: null
      // createTime: Utils.formatDate(new Date(), 'yyyy-MM-dd')
    },
    /**
     * 点击新建，提交表单
     */
    createNewFollowUp: () => {
      var data = ctrl.planCollect[ctrl.interviewInd].healthPlans[0]
      ctrl.getPlanState.stateChange('fetch')
      APIService.saveFollowUp({
        'executeTime': ctrl.createFollowUpAbt.formDataBind.createTime.toString(),
        'interviewName': ctrl.createFollowUpAbt.formDataBind.name
      }, data)
        .then(function (msg) {
          if(msg) {
            ctrl.getPlanState.stateChange('success')
            ctrl.totast.mainBody = {                                             // 通知提示语定义
              status: 'ok',
              description: '创建成功！',
              callback: function() {
                // createFollowUpModal.unbind('hidden.bs.modal')
                createFollowUpModal.on('hidden.bs.modal', function (e) {
                  $route.reload()                               // 清空历史填写，重置表单验证状态
                })

                createFollowUpModal.modal('hide')
              },
              delay: 1000
            }
          } else {
            ctrl.getPlanState.stateChange('failure')
            ctrl.totast.mainBody = {                                             // 通知提示语定义
              status: 'error',
              description: '创建失败！',
              delay: 1000
            }
          }
        }, function(error) {
          ctrl.getPlanState.stateChange('failure')
          ctrl.totast.mainBody = {                                             // 通知提示语定义
            status: 'error',
            description: '创建失败！',
            delay: 1000
          }
        })
    },
    /**
     * 重置表单验证
     */
    resetCreateNewFollowUp: () => {
      ctrl.createFollowUpAbt.formDataBind.name = null	                             // 清空历史填写
      ctrl.createFollowUpAbt.formDataBind.createTime = null	
      $scope.createFollowUpForm.$setPristine()
      $scope.$apply()
    }
  }

  // 初始化
  ctrl.$onInit = function() {
    createFollowUpModal.on('hide.bs.modal', function (e) {
      console.log(ctrl.interviewInd)
      ctrl.createFollowUpAbt.resetCreateNewFollowUp()                               // 清空历史填写，重置表单验证状态
    })
  }
}


angular.module('infi-basic')
.component('plans', {
  templateUrl: './components/plans/plans.tpl.html',
  bindings: {
    planCollect: '<',                                     // 后台返回的方案数据集合
    currGroup: '<',                                       // 当前所在的护理组：慢阻肺、疼痛 ...
  },
  controller: ['$scope', '$routeParams', 'Utils', 'APIService', '$route', planController]
})