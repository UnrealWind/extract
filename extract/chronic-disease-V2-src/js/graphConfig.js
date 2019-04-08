angular.module('infi-basic')
.value('graphConfig', {
  // 基础类型 例： CAT 评分
  '1': {
    xAxis: {
      type: 'category',
      data: null
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: null,
      type: 'line'
    }]
  },
  // 纵轴为 category 类型 例： 呼吸困难指数(mmRc)
  '2': {
    xAxis: {
      type: 'category',
      data: null
    },
    yAxis: {
      type: 'category',
      data: null
    },
    grid: { 
      left: '20%',
      right: '20%'
    },
    series: {
      name: '',
      type: "line",
      data: null,
      markLine: {
        data: null
      }
    }
  },
  // 血压，两条折线
  '3': {
    tooltip: {
      trigger: null,
      formatter: null
    },
    legend: {
      data: []
    },
    xAxis: {
      type: 'time',
      axisPointer: {
          lineStyle: {
              color: '#004E52',
              opacity: 0.5,
              width: 2
          },
          label: {
              show: true,
              formatter: function (params) {
                  return echarts.format.formatTime('yyyy-MM-dd', params.value);
              },
              backgroundColor: '#004E52'
          }
      },
      splitLine: {
          show: false
      }
    },
    yAxis: {
        type: 'value',
        splitLine: {
            show: false
        },
        axisLabel: {
            formatter: '{value}\n'
        },
        z: 10
    },
    dataZoom: [{
        type: 'slider',
        throttle: 50
    }],
    series: [
        {
            name: '舒张压',
            type:'line',
            symbol: 'circle',
            itemStyle: {
                normal: {
                    color: '#8ec6ad'
                }
            },
            data: null
        },
        {
            name: '收缩压',
            type:'line',
            symbol: 'circle',
            itemStyle: {
                normal: {
                    color: '#d68262'
                }
            },
            data: null
        }
    ]
  },
  // fev1 三兄弟
  '4': {
    tooltip: {
      trigger: null,
      formatter: null
    },
    legend: {
      data: []
    },
    xAxis: {
      type: 'time',
      axisPointer: {
          lineStyle: {
              color: '#004E52',
              opacity: 0.5,
              width: 2
          },
          label: {
              show: true,
              formatter: function (params) {
                  return echarts.format.formatTime('yyyy-MM-dd', params.value);
              },
              backgroundColor: '#004E52'
          }
      },
      splitLine: {
          show: false
      }
    },
    yAxis: {
        type: 'value',
        splitLine: {
            show: false
        },
        axisLabel: {
            formatter: '{value}\n'
        },
        z: 10
    },
    dataZoom: [{
      type: 'slider',
      throttle: 50
    }],
    series: [
      {
          name: '上午',
          type:'line',
          symbol: 'circle',
          itemStyle: {
              normal: {
                  color: '#8ec6ad'
              }
          },
          data: null
      },
      {
          name: '下午',
          type:'line',
          symbol: 'circle',
          itemStyle: {
              normal: {
                  color: '#d68262'
              }
          },
          data: null
      }
    ]
  }
})