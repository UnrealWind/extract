angular.module('infi-basic')
.service('ViewEvaluateRstService',[
  'APIService',
  '$routeParams',
  function(APIService, $routeParams){
  
  /**
   * 获取原有方案和推荐方案
   */
  this.getPlan = function (tarObj) {
    return APIService.getPlan({
      'groupId': $routeParams.groupId,
      'depId': $routeParams.depId
    }, tarObj)
  }
  
}]);  