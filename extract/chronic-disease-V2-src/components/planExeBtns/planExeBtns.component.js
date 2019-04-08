function planExeBtnsController($scope, planDetailBtnsMap, $routeParams, APIService) {
  var ctrl = this
  var routeParams = $routeParams
  var currGroup = JSON.parse(sessionStorage.getItem('currGroup'))


  var getBtnMapRule = {
    /**
     * 获取当前按钮的映射规则路径
     */
    getCurrLevelPath: () => {
      return this.preMapLevel.split('.')
    },
    /**
     * 根据映射规则路径找到对应的映射规则
     */
    getStatusMap: (level, mapObj) => {
      var currStatus = mapObj
      level.forEach((ele, ind) => {
        currStatus = currStatus[ele]
      })
      return currStatus
    }
  }

  // 不需要跳转量表页填写的计划类型
  ctrl.exceptPlanType = [
    'drug', 'exercise', 'oxy', 'nutrition', 'smoke', 'health', 'unDrug'
  ]

  /**
   * 改变单条计划的状态
   * @param <item> 单条计划实例
   */
  ctrl.changePlanItemStatus = (item) => {
    // status map
    var statusMap = {
      '未执行': '已执行'
    }
    // statusCode map
    var statusCode = {
      'waiting': 'finish'
    }

    if(item.crfTemplateId) {
      ctrl.navToFunc.toEvaluate(item)
    } else {
      APIService.changePlanItemStatus({
        'status': statusMap[item.status],
        'statusCode': statusCode[item.statusCode]
      }, item)
        .then(function(msg) {
          item.status = msg.status
          ctrl.itemStatus.data = msg.status
          
          item.statusCode = msg.statusCode
          ctrl.currStatus = ctrl.currStatusRule.status[item.statusCode]
        }, function(error) {
          console.log('error :', error);
        })
    }
  }


  /**
   * 页面跳转方法集合
   */
  ctrl.navToFunc ={
    /**
     * 跳转评估页
     */
    toEvaluate: (interview) => {
      sessionStorage.setItem('currInterview', JSON.stringify(interview))
      location.href = `#/scaleEnter/${routeParams.depId}/${currGroup.id}/${ctrl.singleItem.id}/${ctrl.singleItem.crfTemplateId}/2`
    }
  }

  ctrl.$onInit = () => {
    var level = getBtnMapRule.getCurrLevelPath()
    ctrl.currStatusRule = getBtnMapRule.getStatusMap(level, planDetailBtnsMap)
    ctrl.currStatus = ctrl.currStatusRule.status[ctrl.specVal]
  }

}


angular.module('infi-basic')
.component('planExeBtns', {
  templateUrl: './components/planExeBtns/planExeBtns.tpl.html',
  bindings: {
    wholeItem: '=',                                      // 最外层数据对象（不含递归）
    singleItem: '=',                                     // 单条数据对象（含递归）
    preMapLevel: '<',                                    // 当前组件在 planFieldMap 中的映射，即可以通过此字段在 planFieldMap 中找到对应字段显示隐藏的规则。
    specVal: '<',
    planType: '<',
    itemStatus: '='
  },
  controller: ['$scope', 'planDetailBtnsMap', '$routeParams', 'APIService', planExeBtnsController],
})