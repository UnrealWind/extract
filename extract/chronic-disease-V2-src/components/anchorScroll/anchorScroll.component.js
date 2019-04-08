function anchorScrollController($element, Utils, $scope) {
  var ctrl = this
  var $body = $('article.infi-main')                                   // body 元素
  var currScrollTop = 0                                   // 当前滚动距离
  var eleId = []                                          // 存储页面导航内容元素的 id
  var navObj = []                                         // 存储 nav objs

  var setAct = (ind) => {                                 
    ctrl.currAct = ind
  }

  ctrl.currAct = 0                                     // 当前激活的的项目

  /**
   * 跳转到
   */
  ctrl.jumpTo = (tarEleId, index) => {
    var distance = $(`#${tarEleId}`)[0].offsetTop
    $body.animate({
      scrollTop: distance
    }, 50)

    setAct(index)
  }

  ctrl.$onInit = function() {
    ctrl.navData.forEach((ele, ind) => {
      eleId.push(`${ele.type}bottom`)
    })

    /**
     * 滚动监听
     */
    $body.on('scroll.anchor', Utils.debounce(function () {
      currScrollTop = $body.scrollTop()
      if(navObj.length === 0) {
        eleId.forEach((ele, ind) => {
          var currEle = $(`#${ele}`)
          navObj.push({
            index: ind,
            eleObj: currEle,
            offsetTop: currEle[0].offsetTop
          })

          var currEle = null
        })

      } 


      for(var i = 0; i < navObj.length; i++) {
        if(currScrollTop <= navObj[i].offsetTop) {
          ctrl.currAct = navObj[i].index
          $scope.$apply()
          break
        } 
      }
    }, 250))
  }
  
  
  ctrl.$onDestroy = function() {
    $body.off('scroll.anchor')
  }
}


angular.module('infi-basic')
.component('anchorScroll', {
  templateUrl: './components/anchorScroll/anchorScroll.tpl.html',
  bindings: {
    navData: '<'                                                        // 锚点的原始数据
  },
  controller: ['$element', 'Utils', '$scope', anchorScrollController]
})