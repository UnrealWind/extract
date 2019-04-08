angular.module('infi-basic')
.controller('InfoTabContoller',['$scope','TaskService','infoTabService', '$rootScope',function($scope,TaskService,infoTabService, $rootScope) {
  // 初始化
  function init() {
    !$scope.$parent.finalResult[$scope.$parent.currentStep].show?
        TaskService.getStaticData($scope.$parent.tagOrgData[$scope.$parent.currentStep] ,$scope.$parent.currentStep).then(function(msg) {
            $scope.$parent.finalResult[$scope.$parent.currentStep].originData = $scope.normalModel = msg;
        }):$scope.normalModel = $scope.$parent.finalResult[$scope.$parent.currentStep].originData

    // “常见症状” 默认显示
    $scope.showIndex = 0

    // 存储当前 tagId
    $rootScope.recommandAbout.tagId = $scope.$parent.tagOrgData[$scope.$parent.currentStep].id
    $rootScope.recommandAbout.tag = $scope.$parent.tagOrgData[$scope.$parent.currentStep]

    // 获取当前页面推荐值
    if ($rootScope.recommandAbout.tag.label != '症状'){
      TaskService.getRelate().then(function(msg) {
        if (msg.data && msg.data.length > 0) {
          $scope.recommendLink = msg.data
        }
      })
    }
  }


  init()

  // 切换“常见症状” 一级
  $scope.changeModel = function(index) {
    $scope.showIndex = index
    $scope.recommendLink = null
  }

  // 监听右侧取消广播,隐藏相关症状
  $scope.$on('hideLink', function(event) {
    $scope.hideLink = false
  })


  /**
   * 点击胸痛
   * 判断是否还有下一级，有则展开并修改原始数据
   */
  $scope.choserPop = function(part, classify) {
    infoTabService.choserPop(part, classify, $scope)
  }
  
  /**
   * 搜索
   */
  $scope.searchData = {
    keyword: ''
  }

  $scope.search = function (node) {
    TaskService.search(node, $scope)
  }

  // radio 切换
  $scope.changeRadio = function(radioIndex, data) {
    infoTabService.changeRadio(radioIndex, data)
  }
}])