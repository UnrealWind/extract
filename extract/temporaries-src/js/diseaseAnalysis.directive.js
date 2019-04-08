angular.module("infi-basic").directive("diseaseSelect", [
  "DiseaseAnalysisFactory",
  function(DiseaseAnalysisFactory) {
    return {
      restrict: "AE",
      templateUrl: "./html/disease-select.html",
      link: function(scope, ele, attr) {
        scope.diag_result = []; // 存放　getDiagnosis　请求结果
        scope.diag_res = true; //　表示　diagnosis 是否请求成功

        DiseaseAnalysisFactory.getDiagnosis().then(function(data) {
          // 判断 diagnosis 是否请求成功
          if (!data) {
            scope.diag_res = false;
            return;
          }

          // 判断 diagnosis 返回是否为空
          scope.diag_result = !data.result.length == 0 ? data.result : [];
        });

        scope.tagDiagnosis = {}; // 存放已选 {疾病类型：依据}

        var send_result_arr = [], // 存放已选　[类型,类型,类型]，用于转换后台要接收的数据格式
            send_result_obj = {};

        scope.checkVal = function(input, opt) {
          if (
            !scope.tagDiagnosis.hasOwnProperty(input.label) ||
            scope.tagDiagnosis[input.label].length == 0
          ) {
            scope.tagDiagnosis[input.label] = [];
            scope.tagDiagnosis[input.label].push(opt.value);
          } else {
            var dele_tag_index = scope.tagDiagnosis[input.label].indexOf(
              opt.value
            ); // 已存在并且要被删除的元素索引
            if (dele_tag_index < 0) {
              scope.tagDiagnosis[input.label].push(opt.value);

              if (
                input.choice == 1 &&
                !scope.tagDiagnosis[input.label].length == 0
              ) {
                scope.tagDiagnosis[input.label].shift();
              }
            } else {
              scope.tagDiagnosis[input.label].splice(dele_tag_index, 1);
            }
          }

          // 拼接为后台需要的格式
          send_result_arr = [];
          send_result_str = '';


          angular.forEach(scope.tagDiagnosis, function(value, key) {
            send_result_arr = send_result_arr.concat(value);
          });

          angular.forEach(send_result_arr, function(value, key) {
            send_result_arr[key] = 'filter__type' + key + '=' + value
          });

          send_result_str = send_result_arr.join('&')


          // 将选择的数据回传,并拿到响应数据
          scope.tag_back = []
          DiseaseAnalysisFactory.sendDiagnosis(send_result_str).then(function(data) {
            if (data.success) scope.tag_back = data.data
          })


          // 是否提示 "请选择症状"
          scope.showTip = JSON.stringify(scope.tagDiagnosis) == "{}" ? true : false;
        };
      }
    };
  }
]);
