function compareBlankPlanController(Utils, $scope) {
  var ctrl = this

  // 搜索出的结果要展示的字段
  ctrl.renderField = [
    // 0
    [ 
      {key: 'materialName', style: { 'width': '50%' }},
      {key: 'operationName' },
      {key: 'dateValue' },
      {key: 'dateName' },
      {key: 'timeValue' },
      {key: 'timeName' }
    ],
    // 1
    [ 
      {key: 'materialName', style: { 'width': '50%' }},
      {key: 'dateValue' },
      {key: 'dateName' },
      {key: 'timeValue' },
      {key: 'timeName' }
    ],
    // 2
    [ 
      {key: 'materialName', style: { 'width': '45%' }},
      {key: 'operationName', style: { 'width': '15%' }},
      {key: 'dosageValue' },
      {key: 'dosageName', style: { 'width': '10%' } },
      {key: 'frepName' },
    ],
    // 3
    [ 
      {key: 'materialName', style: { 'width': '50%' }},
      {key: 'periodName' },
      {key: 'unitValue' },
      {key: 'unitName', style: { 'width': '15%' } },
    ],
    // 4
    [ 
      {key: 'materialName', style: { 'width': '50%' }},
      {key: 'periodName' },
      {key: 'unitValue' },
      {key: 'unitName', style: { 'width': '15%' } },
    ],
    // 5
    [ 
      {key: 'materialName', style: { 'width': '85%' } },
    ],
    // 6
    [ 
      {key: 'materialName', style: { 'width': '85%' } },
    ],
    // 7
    [ 
      {key: 'materialName', style: { 'width': '85%' } },
    ]
  ]



  /**
   * 删除计划条目
   * @param <whole> 计划数据
   *        <ind> 当前数据所在索引
   */
  ctrl.deleteItem = (whole, ind) => {
    whole.splice(ind, 1)
  }

  /**
   * 添加条目
   * @param <item> 单条数据
   */
  ctrl.singleItemClick = (item, event) => {
    var tarArr = $(event.currentTarget).parents('.plan-sec').find('.table')
    angular.element(tarArr).scope().$$childHead.schemeTemplate.schemeMaterials.push(item)

    var iptEntity = $(event.currentTarget).parents('.planItem-search-dir').find('.J-ipt-instance')

    // 重置搜索框状态
    ctrl.resetSearchIpt(iptEntity)
  }

  /**
   * 重置搜索框状态
   */
  ctrl.resetSearchIpt = (iptEntity) => {
    var iptScope = angular.element(iptEntity).scope()
    iptScope.searchAbout.currState = 'init'
    iptScope.searchAbout.kw = ''
    iptScope.searchAbout.rst = []
  }


  ctrl.$onInit = function() {
  }
  
  ctrl.$doCheck = function() {
    // 原始数据
    ctrl.orgData = {
      'currPlanCollect': ctrl.wholeData.current ?  ctrl.wholeData.current : null ,
      'recommandPlanCollect': ctrl.wholeData.new ?  ctrl.wholeData.new : null 
    }
  
    // 渲染用数据
    ctrl.renderData = {
      'curr': ctrl.orgData.currPlanCollect ? ctrl.orgData.currPlanCollect.nurseSchemes : null,
      'new': ctrl.orgData.recommandPlanCollect ? ctrl.orgData.recommandPlanCollect.nurseSchemes : null
    }
  }

}


/**
 * viewPlan 专用对比计划的表格
 */
angular.module('infi-basic')
.component('compareBlankPlan', {
  templateUrl: './components/compareBlankPlan/compareBlankPlan.tpl.html',
  bindings: {
    wholeData: '<',                            // 完整数据
    optRange: '<'                              // select 范围
  },
  controller: ['Utils', '$scope', compareBlankPlanController]
})