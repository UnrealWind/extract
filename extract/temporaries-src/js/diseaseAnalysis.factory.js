angular.module("infi-basic").factory("DiseaseAnalysisFactory", [
  "$http",
  "SYS",
  function($http, SYS) {
    var dis_analysis = {};

    // 获取 ‘高血压共病分析类型选择’ 数据
    dis_analysis.getDiagnosis = function() {
      return $http.get(SYS.url + "analysis/type").then(function(msg) {
        return msg.data;
      });
    };

    // 回传勾选完成的 疾病名称和疾病依据 数据
    dis_analysis.sendDiagnosis = function(data) {
      return $http.post(SYS.url + 'analysis/list?' + data).then(function(msg) {
        return msg.data;
      })
    }

    return dis_analysis;
  }
]);
