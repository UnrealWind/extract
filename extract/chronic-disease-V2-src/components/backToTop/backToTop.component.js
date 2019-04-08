function backToTopController($element, Utils, $scope) {

  this.$onInit = function() {
    var ctrl = this
    var $ele = $element
    var $body = $('article.infi-main')
  
    var winCliH = document.body.clientHeight;         // 窗口的高度
    var currScrollTop = 0                            // 当前屏幕滚动的距离
    ctrl.ifShow = false                               // 控制图标显示开关
    
    /**
     * 滚动监听
     */
    $body.on('scroll.backToTop', Utils.debounce(function () {
      currScrollTop = $body.scrollTop()

      ctrl.ifShow = currScrollTop >= winCliH / 2 ? true : false

      $scope.$apply()

    }, 500))


    /**
     * 回到顶部按钮事件绑定
     */
    $ele.on('click', function() {
      $body.animate({
        scrollTop: 0
      }, 250)
    })
  }

  this.$onDestroy = function() {
    $body.off('scroll.backToTop')
  }
  
}


angular.module('infi-basic')
.component('backToTop', {
  templateUrl: './components/backToTop/backToTop.tpl.html',
  controller: ['$element', 'Utils', '$scope', backToTopController],
})