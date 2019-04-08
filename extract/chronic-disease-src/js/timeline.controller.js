angular.module('infi-basic')
.controller('TimeLineController', ['$scope', function ($scope) {
  
  $scope.info = [
    {label: "姓名",value: "某某某", colspan: 4},
    {label: "性别",value: "男", colspan: 4},
    {label: "年龄",value: "25", colspan: 4},
    {label: "身高",value: "166", colspan: 4},
    {label: "体重",value: "37", colspan: 4},
    {label: "BML",value: "25", colspan: 4},
    {label: "婚姻",value: "已婚", colspan: 4},
    {label: "文化程度",value: "小学", colspan: 4},
    {label: "职业",value: "工人", colspan: 4},
    {label: "支付方式",value: "医保", colspan: 4},
    {label: "家庭人均收入",value: "100", colspan: 4},
    {label: "居住情况",value: "医保", colspan: 4},
    {label: "居住地",value: "城镇", colspan: 4},
    {label: "是否吸烟",value: "吸烟,吸烟5年,5支/天", colspan: 8},
    {label: "从事过接触粉尘/烟煤的职业",value: "是,5年", colspan: 12},
    {label: "合并其他疾病",value: "xxxxx", colspan: 12},
  ]




  /**
   * 时间轴项目查看详情
   */
  $scope.checkDetail = function() {
    location.href = "#/unitView"
  }


}]);