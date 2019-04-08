angular.module('infi-basic')
  .controller('UnitViewController', ['$scope', function ($scope) {
    
    // $scope.naviData = [
    //   {
    //     "xlPatientId": "501_0002895780",
    //     "xlMedicalId": "501_1_1",
    //     "id": null,
    //     "label": "2018-06-27 慢阻肺护理",
    //     "value": "501_1_1",
    //     "template": null,
    //     "type": "manzufei",
    //     "medicalRecordTypeId": null,
    //     "children": [
    //       {
    //         "xlPatientId": "501_0002895780",
    //         "xlMedicalId": "501_1_1",
    //         "id": "suizhen",
    //         "label": "2018年9月17日 随诊三",
    //         "value": null,
    //         "template": null,
    //         "type": "suizhen",
    //         "medicalRecordTypeId": null,
    //         "children": [
    //           {
    //             "xlPatientId": "501_0002895780",
    //             "xlMedicalId": "501_1_1",
    //             "id": "suizhen",
    //             "label": "发作情况",
    //             "value": null,
    //             "template": null,
    //             "type": "fazuo",
    //             "medicalRecordTypeId": null,
    //             "children": []
    //           },
    //           {
    //             "xlPatientId": "501_0002895780",
    //             "xlMedicalId": "501_1_1",
    //             "id": "suizhen",
    //             "label": "肺功能检查",
    //             "value": null,
    //             "template": null,
    //             "type": "feigongneng",
    //             "medicalRecordTypeId": null,
    //             "children": []
    //           },
    //           {
    //             "xlPatientId": "501_0002895780",
    //             "xlMedicalId": "501_1_1",
    //             "id": "suizhen",
    //             "label": "六分钟步行试验",
    //             "value": null,
    //             "template": null,
    //             "type": "liufenzhong",
    //             "medicalRecordTypeId": null,
    //             "children": []
    //           },
    //           {
    //             "xlPatientId": "501_0002895780",
    //             "xlMedicalId": "501_1_1",
    //             "id": "suizhen",
    //             "label": "圣乔治呼吸问卷",
    //             "value": null,
    //             "template": null,
    //             "type": "shengqiaozhi",
    //             "medicalRecordTypeId": null,
    //             "children": []
    //           }
    //         ]
    //       },
    //       {
    //         "xlPatientId": "501_0002895780",
    //         "xlMedicalId": "501_1_1",
    //         "id": "suizhen",
    //         "label": "2018年5月7日 随诊二",
    //         "value": null,
    //         "template": null,
    //         "type": "suizhen",
    //         "medicalRecordTypeId": null,
    //         "children": []
    //       },
    //       {
    //         "xlPatientId": "501_0002895780",
    //         "xlMedicalId": "501_1_1",
    //         "id": "suizhen",
    //         "label": "2018年4月7日 随诊一",
    //         "value": null,
    //         "template": null,
    //         "type": "suizhen",
    //         "medicalRecordTypeId": null,
    //         "children": []
    //       }
    //     ]
    //   }
    // ]


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


    // 肺功能检查
    $scope.lungCheck = {
      tooltip: {
          trigger: 'axis'
      },
      xAxis: {
          data: ['首次随诊', '随诊一', '随诊二', '随诊三']
      },
      yAxis: {
        splitLine: {
            show: false
        }
      },
      visualMap: {
        orient: 'horizontal',
        top: 10,
        right: 10,
        pieces: [{
            lte: 10,
            color: '#096',
            label: '轻度'
        }, {
            lte: 20,
            color: '#ffde33',
            label: '中度'
        }, {
            lte: 30,
            color: '#ff9933',
            label: '重度'
        }, {
            lte: 40,
            color: '#cc0033',
            label: '非常严重'
        }],
        outOfRange: {
            color: '#999'
        }
      },
      series: {
          name: 'cat 评测',
          type: 'line',
          data: [2, 15, 28, 12],
          markLine: {
              silent: true,
              data: [{
                  yAxis: 10,
                  label: {
                      normal: {
                          formatter: function() {
                              return '轻度'
                          }
                      }
                  }
              }, {
                  yAxis: 20,
                  label: {
                      normal: {
                          formatter: function() {
                              return '中度'
                          }
                      }
                  }
              }, {
                  yAxis: 30,
                  label: {
                      normal: {
                          formatter: function() {
                              return '重度'
                          }
                      }
                  }
              }, {
                  yAxis: 40,
                  label: {
                      normal: {
                          formatter: function() {
                              return '非常严重'
                          }
                      }
                  }
              }]
          }
      }
  }


    // 呼吸困难
    $scope.breathOpts = {
      title: {
        text: 'mMRC 分级结果'
      },
      tooltip: {
          trigger: 'axis'
      },
      xAxis: {
          data: ['首次随诊', '随诊一', '随诊二', '随诊三']
      },
      yAxis: {
          splitLine: {
              show: false
          }
      },
      visualMap: {
          orient: 'horizontal',
          top: 10,
          right: 10,
          pieces: [{
              lte: 10,
              color: '#096',
              label: '0级'
          }, {
              lte: 20,
              color: '#ffde33',
              label: '1级'
          }, {
              lte: 30,
              color: '#ff9933',
              label: '2级'
          }, {
              lte: 40,
              color: '#cc0033',
              label: '3级'
          }],
          outOfRange: {
              color: '#999'
          }
      },
      series: {
          name: 'mMRC 分级结果',
          type: 'line',
          data: [31, 24, 61, 18],
          markLine: {
              silent: true,
              data: [{
                  yAxis: 10,
                  label: {
                      normal: {
                          formatter: function() {
                              return '0级'
                          }
                      }
                  }
              }, {
                  yAxis: 20,
                  label: {
                      normal: {
                          formatter: function() {
                              return '1级'
                          }
                      }
                  }
              }, {
                  yAxis: 30,
                  label: {
                      normal: {
                          formatter: function() {
                              return '2级'
                          }
                      }
                  }
              }, {
                  yAxis: 40,
                  label: {
                      normal: {
                          formatter: function() {
                              return '3级'
                          }
                      }
                  }
              }]
          }
      }
  }


  // 生活质量自我评估
  $scope.lifeqa = {
    title: {
      text: 'COPD 问卷评估测试(CAT 评分表)'
    },
    tooltip: {
        trigger: 'axis'
    },
    xAxis: {
        data: ['首次随诊', '随诊一', '随诊二', '随诊三']
    },
    yAxis: {
        splitLine: {
            show: false
        }
    },
    visualMap: {
        orient: 'horizontal',
        top: 10,
        right: 10,
        pieces: [{
            lte: 10,
            color: '#096',
            label: '0级'
        }, {
            lte: 20,
            color: '#ffde33',
            label: '1级'
        }, {
            lte: 30,
            color: '#ff9933',
            label: '2级'
        }, {
            lte: 40,
            color: '#cc0033',
            label: '3级'
        }],
        outOfRange: {
            color: '#999'
        }
    },
    series: {
        name: 'COPD 问卷评估测试',
        type: 'line',
        data: [31, 24, 41, 18],
        markLine: {
            silent: true,
            data: [{
                yAxis: 10,
                label: {
                    normal: {
                        formatter: function() {
                            return '0级'
                        }
                    }
                }
            }, {
                yAxis: 20,
                label: {
                    normal: {
                        formatter: function() {
                            return '1级'
                        }
                    }
                }
            }, {
                yAxis: 30,
                label: {
                    normal: {
                        formatter: function() {
                            return '2级'
                        }
                    }
                }
            }, {
                yAxis: 40,
                label: {
                    normal: {
                        formatter: function() {
                            return '3级'
                        }
                    }
                }
            }]
        }
    }
}


  }]);