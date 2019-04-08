angular
  .module("infi-basic")
  .directive("curveLine", [
    function() {
      // 折线图
      return {
        restrict: "A",
        scope: {
          config: "<"
        },
        link: function(scope, element) {
          var myChart = echarts.init(element[0]);


          // 默认配置
          var defaultConfig = {
            tooltip : {
              trigger: 'axis',
              formatter: "{b}: {c}"
            }
          }

          scope.$watch('config', function(newVal, oldVal) {
            var wholeConfig  = $.extend(true, defaultConfig, newVal)

            console.log(wholeConfig)

            // 画图
            myChart.setOption(wholeConfig, true);
          })
        }
      };
    }
  ])