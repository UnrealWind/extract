function singleLineController(Utils, $scope) {
  var ctrl = this
  ctrl.typeIs = Utils.typeIs
}


angular.module('infi-basic')
.component('singleLine', {
  templateUrl: './components/singleLine/singleLine.tpl.html',
  require: {
    planCtrl: '^plans'
  },
  bindings: {
    wholeItem: '<',                                         // 最外层数据对象（不含递归）
    singleItem: '<',                                        // 单条数据对象（含递归）
    preMapLevel: '@',                                       // 当前组件在 planFieldMap 中的映射，即可以通过此字段在 planFieldMap 中找到对应字段显示隐藏的规则。
  },
  controller: ['Utils', '$scope', singleLineController]
})