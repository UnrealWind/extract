/**
 * 方案执行分页组件
 */
function planExeSplitPageController ($scope, $routeParams, Utils, APIService) {
  var ctrl = this
  ctrl.currGroup = JSON.parse(sessionStorage.getItem('currGroup'))

  
  ctrl.initNumber = 1  // 分页的当前页码
  ctrl.pageSize = 6    // 每一页的数据条数
  ctrl.pageData = null
  ctrl.jumpPageNum = 1 // 手动跳页数字绑定

  // 状态管理
  ctrl.state = {
    currState: 'init',
    stateMachine: {
      'init': {
        fetch: 'fetching'
      },
      'fetching': {
          success: 'showRst',
          failure: 'showErr',
      },
      'showRst': {
          refetch: 'init'
      },
      'showErr': {
          refetch: 'init'
      }
    },
    stateChange: Utils.changeState()
  }


  ctrl.$onInit = function() {
    ctrl.getPlanExeSplit(ctrl.initNumber)
  }


  ctrl.getPlanExeSplit = (pageNumber) => {
    var param = {
      depId: $routeParams.depId,
      groupId: JSON.parse(sessionStorage.getItem('currGroup')).id,
      pageSize: ctrl.pageSize,
      pageNumber: pageNumber,
      data: ctrl.currPlan
    }

    ctrl.state.stateChange('fetch')

    APIService.getPlanExeSplit(param)
              .then(function(msg) {
                ctrl.state.stateChange('success')
                ctrl.pageData = msg
              }, function(error) {
                ctrl.state.stateChange('failure')
              })
  }
  
}


angular.module('infi-basic')
.component('planExeSplitPage', {
  templateUrl: './components/planExeSplitPage/planExeSplitPage.tpl.html',
  bindings: {
    currPlan: '<',      // 当前方案
  },
  controller: ['$scope', '$routeParams', 'Utils', 'APIService', planExeSplitPageController]
})