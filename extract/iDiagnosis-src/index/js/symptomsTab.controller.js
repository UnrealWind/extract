angular.module('infi-basic')
.controller('SymptomsTabContoller',['$scope','TaskService','symptomsTabService',function($scope,TaskService,symptomsTabService) {
  // 初始化
  function init() {
    !$scope.$parent.finalResult[$scope.$parent.currentStep].show?
        TaskService.getStaticData($scope.$parent.tagOrgData[$scope.$parent.currentStep] ,$scope.$parent.currentStep).then(function(msg) {
            $scope.$parent.finalResult[$scope.$parent.currentStep].originData = $scope.normalModel = msg;
        }):$scope.normalModel = $scope.$parent.finalResult[$scope.$parent.currentStep].originData

    // “常见症状” 默认显示
    $scope.showIndex = 0
  }


  init()

  // 切换“常见症状” 一级
  $scope.changeModel = function(index) {
    $scope.showIndex = index
    $scope.recommendLink = null
  }


  /**
   * 点击胸痛
   * 判断是否还有下一级，有则展开并修改原始数据
   */
  $scope.choserPop = function(part) {
    symptomsTabService.choserPop(part, $scope)
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
    symptomsTabService  .changeRadio(radioIndex, data)
  }

    
}])