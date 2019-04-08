function basicInfoController($routeParams, APIService) {
  var routeParams = $routeParams
  var ctrl = this

  // 页面渲染模板数据
  ctrl.tempData = []

  // 页面跳转方法集合
  ctrl.navToFunc = {
    /**
     * 跳转 CRF 填写页
     */
    'toscaleEnter': (item) => {
      sessionStorage.setItem('currInterview', JSON.stringify(item))                         // 缓存当前的 interview
      location.href = `#scaleEnter/${routeParams.depId}/${ctrl.currGroup.id}/${item.id}/${item.crfTemplateId}/1`
    }
  }

  ctrl.$onInit = function () {
    APIService.getPatiBasicInfo({'groupId': ctrl.currGroup.id, 'depId': routeParams.depId})
      .then(function (msg) {
        ctrl.tempData = msg
      })
  }
}


angular.module('infi-basic')
.component('basicInfo', {
  templateUrl: './components/basicInfo/basicInfo.tpl.html',
  bindings: {
    currGroup: '<',                                       // 当前所在的护理组：慢阻肺、疼痛 ...
  },
  controller: ['$routeParams', 'APIService', basicInfoController],
})