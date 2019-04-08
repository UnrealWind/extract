function evaluateSidebarController($routeParams, APIService) {
  var routeParams = $routeParams
  var ctrl = this

  ctrl.sidebarAbout = {                      // 右侧 sidebar 相关
    currActiveInd: 0,
    switchFrom: function (ind) {
      this.currActiveInd = ind
    }
  }

  ctrl.$onChanges = function () {
  }
}


angular.module('infi-basic')
.component('evaluateSidebar', {
  templateUrl: './components/evaluateSidebar/evaluateSidebar.tpl.html',
  bindings: {
    evaluateRst: '<',                                     // 评估结果集合
    lastYearInTime: '<'                                   // 过去一年住院次数
  },
  controller: ['$routeParams', 'APIService', evaluateSidebarController],
})