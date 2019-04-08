function blankPlanController($scope) {
  var ctrl = this
  ctrl.currGroup = JSON.parse(sessionStorage.getItem('currGroup'))

  // 目标心率 & 恢复运动心率
  ctrl.tarHB = 10
  ctrl.restoreHB = 10


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
      {key: 'materialName', style: { 'width': '50%' }},
      {key: 'operationName', style: { 'width': '10%' }},
      {key: 'dosageValue' },
      {key: 'dosageName', style: { 'width': '15%' } },
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
}

/**
 * 方案展示，只有方案内容，没有任何状态及操作
 */
angular.module('infi-basic')
.component('blankPlan', {
  templateUrl: './components/blankPlan/blankPlan.tpl.html',
  bindings: {
    planCollect: '<',                                     // 方案集合
    optRange: "<"                                         // 下拉框所有数据
  },
  controller: [ '$scope', blankPlanController]
})