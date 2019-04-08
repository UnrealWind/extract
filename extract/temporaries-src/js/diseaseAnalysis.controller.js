angular.module("infi-basic").controller("DiseaseAnalysisController", [
  "$scope",
  "SYS",
  "$http",
  function($scope, SYS, $http) {
    $scope.select = {
      data: [
        {
          label: "高血压一级",
          value: "1",
          select: true,
          children: [
            {
              label: "高血压低危",
              value: "1"
            },
            {
              label: "高血压中危",
              value: "2"
            },
            {
              label: "高血压高危",
              value: "3"
            },
            {
              label: "高血压极高危",
              value: "4"
            }
          ]
        },
        {
          label: "高血压二级",
          value: "2",
          children: [
            {
              label: "高血压中危",
              value: "2"
            },
            {
              label: "高血压高危",
              value: "3"
            },
            {
              label: "高血压极高危",
              value: "4"
            }
          ]
        },
        {
          label: "高血压三级",
          value: "3",
          children: [
            {
              label: "高血压高危",
              value: "3"
            },
            {
              label: "高血压极高危",
              value: "4"
            }
          ]
        }
      ],
      tagVal: {
        hy: "",
        lv: ""
      }
    };

    $scope.showTip = true;
    $scope.selectHyLv = function() {
      $scope.select.tagVal.lv = "";
      $scope.select.data.forEach(function(n, i) {
        n["select"] = false;
        n.value == $scope.select.tagVal.hy ? (n["select"] = true) : undefined;
      });
    };

    function getDiseaseData() {
      $http({
        method: "get",
        url:
          SYS.url +
          "unite/resource/single/76?filter__grade=" +
          $scope.select.tagVal.hy +
          "&filter__degree=" +
          $scope.select.tagVal.lv
      }).then(function(msg) {
        $scope.diseases = msg.data.data;
      });
    }
    getDiseaseData();

    $scope.serach = function() {
      getDiseaseData();
    };
  }
]);
