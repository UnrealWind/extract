/**
 * 用于患者管理页
 * 为了匹配每种方案内部具体显示哪些字段
 * 例：慢阻肺 --   评估方案	
 *           |      |_ 方案内容
 *           |      |     |_	内容 1	显示：<name>, <freq>
 *           |      |     |_	内容 2
 *           |      |     |_	...
 *           |      |
 *           |      |_ 方案计划
 *           |            |_	内容 1  显示：<time>, <name>, <status>, <opt>
 *           |_	 随访方案
 *           |_	 药品方案
 *           |_  ..
 */

angular.module('infi-basic')
.value('planFieldMap', {
  // 过滤页面不显示字段
  'mzf': {                                               // 慢阻肺
    'evo': {                                                       // 评估方案： 这里的 key 对应后台返回的 type
      'content': {
        'materialName': { 'style': {
          'width': '46%'
        },
        'type': 'evo',
        'index': 0},
        'dateValue': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 1},
        'dateName': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 2},
        'timeValue':  { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 3},
        'timeName': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 4}
      },
      'execuate': {
        'executeTime': { 'style': {
          'width': '25%'
        }, 
        'type': 'evo',
        'index': 0},
        'interviews': {
          'index': 1,
          'type': 'evo',
          'next': {
            'name': { 'style': {
              'width': '33%'
            }, 
            'type': 'evo',
            'index': 0},
            'status': { 'style': {
              'width': '15%'
            }, 
            'type': 'evo',
            'index': 1},
            'statusCode': { 'style': {
              'width': '52%'
            }, 
            'type': 'evo',
            'index': 2}
          }
        }
      }
    },
    'interview': {                                                     // 随访方案
      'content': {
        'materialName': { 'style': {
          'width': '46%'
        }, 
        'type': 'interview',
        'index': 0},
        'dateValue': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'interview',
        'index': 1},
        'dateName': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'interview',
        'index': 2},
        'timeValue':  { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'interview',
        'index': 3},
        'timeName': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'interview',
        'index': 4}
      },
      'execuate': {
        'executeTime': { 'style': {
          'width': '25%'
        }, 
        'type': 'interview',
        'index': 0},
        'interviews': {
          'index': 1,
          'type': 'interview',
          'next': {
            'name': { 'style': {
              'width': '33%'
            }, 
            'type': 'interview',
            'index': 0},
            'status': { 'style': {
              'width': '15%'
            }, 
            'type': 'interview',
            'index': 1},
            'statusCode': { 'style': {
              'width': '52%'
            }, 
            'type': 'interview',
            'index': 2}
          }
        }
      }
    },
    'drug': {                                                      // 药品方案
      'content': {
        'materialName': { 'style': {
          'width': '35%',
          'padding-right': '8%'
        }, 
        'type': 'drug',
        'index': 0},
        'operationName': { 'style': {
          'width': '20%'
        }, 
        'type': 'drug',
        'index': 1},
        'dosageValue': { 'style': {
          'width': 'auto'
        }, 
        'type': 'drug',
        'index': 2},
        'dosageName': { 'style': {
          'width': 'auto'
        }, 
        'type': 'drug',
        'index': 3},
        'frepName': { 'style': {
          'width': '25%',
          'text-align': 'right'
        }, 
        'type': 'drug',
        'index': 4}
      },
      'execuate': {
        'executeTime': { 'style': {
          'width': '35%'
        }, 
        'type': 'drug',
        'index': 0},
        'interviews': {
          'index': 1,
          'type': 'drug',
          'next': {
            'name': { 'style': {
              'width': '65%',
              'padding-right': '8%'
            }, 
            'type': 'drug',
            'index': 0},
            'status': { 'style': {
              'width': '15%'
            }, 
            'type': 'drug',
            'index': 1},
            'statusCode': { 'style': {
              'width': '24%'
            }, 
            'type': 'drug',
            'index': 2}
          }
        }
      }
    },
    'exercise': {                                                      // 呼吸康复训练
      'content': {
        'materialName': { 'style': {
          'width': '35%',
          'padding-right': '8%'
        }, 
        'type': 'exercise',
        'index': 0},
        'periodName': { 'style': {
          'width': 'auto'
        }, 
        'type': 'exercise',
        'index': 1},
        'unitValue': { 'style': {
          'width': 'auto'
        }, 
        'type': 'exercise',
        'index': 2},
        'unitName': { 'style': {
          'width': 'auto'
        }, 
        'type': 'exercise',
        'index': 3},
      },
      'execuate': {
        'executeTime': { 'style': {
          'width': '35%'
        }, 
        'type': 'exercise',
        'index': 0},
        'interviews': {
          'index': 1,
          'type': 'exercise',
          'next': {
            'name': { 'style': {
              'width': '65%',
              'padding-right': '8%'
            }, 
            'type': 'exercise',
            'index': 0},
            'status': { 'style': {
              'width': '15%'
            }, 
            'type': 'exercise',
            'index': 1},
            'statusCode': { 'style': {
              'width': '24%'
            }, 
            'type': 'exercise',
            'index': 2}
          }
        }
      }
    },
    'oxygen': {                                                      // 氧疗
      'content': {
        'materialName': { 'style': {
          'width': '30%',
          'padding-right': '8%'
        }, 
        'type': 'oxygen',
        'index': 0},
        'periodName': { 'style': {
          'width': 'auto'
        }, 
        'type': 'oxygen',
        'index': 1},
        'unitValue': { 'style': {
          'width': 'auto'
        }, 
        'type': 'oxygen',
        'index': 2},
        'unitName': { 'style': {
          'width': 'auto'
        }, 
        'type': 'oxygen',
        'index': 3}
      },
      'execuate': {
        'executeTime': { 'style': {
          'width': '43%'
        }, 
        'type': 'oxygen',
        'index': 0},
        'interviews': {
          'index': 1,
          'type': 'oxygen',
          'next': {
            'name': { 'style': {
              'width': '95%',
              'padding-right': '8%'
            }, 
            'type': 'oxygen',
            'index': 0},
            'status': { 'style': {
              'width': '30%'
            }, 
            'type': 'oxygen',
            'index': 1},
            'statusCode': { 'style': {
              'width': '24%'
            }, 
            'type': 'oxygen',
            'index': 2}
          }
        }
      }
    },
    'nutrition': {                                                      // 营养
      'content': {
        'materialName': { 'style': {
          'width': '100%'
        }, 
        'type': 'nutrition',
        'index': 0},
      },
      'execuate': {
        'executeTime': { 'style': {
          'width': '43%'
        }, 
        'type': 'nutrition',
        'index': 0},
        'interviews': {
          'index': 1,
          'type': 'nutrition',
          'next': {
            'name': { 'style': {
              'width': '54%',
              'padding-right': '14%'
            }, 
            'type': 'nutrition',
            'index': 0},
            'status': { 'style': {
              'width': '33%'
            }, 
            'type': 'nutrition',
            'index': 1},
            'statusCode': { 'style': {
              'width': '16%'
            }, 
            'type': 'nutrition',
            'index': 2}
          }
        }
      }
    },
    'smoke': {                                                      // 戒烟
      'content': {
        'materialName': { 'style': {
          'width': '100%'
        }, 
        'type': 'smoke',
        'index': 0},
      },
      'execuate': {
        'executeTime': { 'style': {
          'width': '43%'
        }, 
        'type': 'smoke',
        'index': 0},
        'interviews': {
          'type': 'smoke',
          'index': 1,
          'next': {
            'name': { 'style': {
              'width': '61%'
            }, 
            'type': 'smoke',
            'index': 0},
            'status': { 'style': {
              'width': '30%'
            }, 
            'type': 'smoke',
            'index': 1},
            'statusCode': { 'style': {
              'width': '24%'
            }, 
            'type': 'smoke',
            'index': 2}
          }
        }
      }
    },
    'health': {                                                      // 健康教育
      'content': {
        'materialName': { 'style': {
          'width': '100%'
        }, 
        'type': 'health',
        'index': 0},
      },
      'execuate': {
        'executeTime': { 'style': {
          'width': '30%'
        }, 
        'type': 'health',
        'index': 0},
        'interviews': {
          'index': 1,
          'type': 'health',
          'next': {
            'name': { 'style': {
              'width': '75%',
              'padding-right': '10%'
            }, 
            'type': 'health',
            'index': 0},
            'status': { 'style': {
              'width': '15%'
            }, 
            'type': 'health',
            'index': 1},
            'statusCode': { 'style': {
              'width': '20%'
            }, 
            'type': 'health',
            'index': 2}
          }
        }
      }
    }
  },
  'huxi': {                                               // 呼吸慢病
    'special': {                                                       // 评估方案： 这里的 key 对应后台返回的 type
      'content': {
        'materialName': { 'style': {
          'width': '46%'
        },
        'type': 'evo',
        'index': 0},
        'dateValue': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 1},
        'dateName': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 2},
        'timeValue':  { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 3},
        'timeName': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 4}
      },
      'execuate': {
        'executeTime': { 'style': {
          'width': '25%'
        }, 
        'type': 'evo',
        'index': 0},
        'interviews': {
          'index': 1,
          'type': 'evo',
          'next': {
            'name': { 'style': {
              'width': '33%'
            }, 
            'type': 'evo',
            'index': 0},
            'status': { 'style': {
              'width': '15%'
            }, 
            'type': 'evo',
            'index': 1},
            'statusCode': { 'style': {
              'width': '52%'
            }, 
            'type': 'evo',
            'index': 2}
          }
        }
      }
    }
  },
  'xs': {                                               // 血栓
    'unDrug': {                                                       // 评估方案： 这里的 key 对应后台返回的 type
      'content': {
        'materialName': { 'style': {
          'width': '46%'
        },
        'type': 'evo',
        'index': 0},
        'dateValue': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 1},
        'dateName': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 2},
        'timeValue':  { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 3},
        'timeName': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 4}
      },
      'execuate': {
        'executeTime': { 'style': {
          'width': '25%'
        }, 
        'type': 'evo',
        'index': 0},
        'interviews': {
          'index': 1,
          'type': 'evo',
          'next': {
            'name': { 'style': {
              'width': '33%'
            }, 
            'type': 'evo',
            'index': 0},
            'status': { 'style': {
              'width': '15%'
            }, 
            'type': 'evo',
            'index': 1},
            'statusCode': { 'style': {
              'width': '52%'
            }, 
            'type': 'evo',
            'index': 2}
          }
        }
      }
    },
    'drug': {                                                     // 随访方案
      'content': {
        'materialName': { 'style': {
          'width': '46%'
        }, 
        'type': 'interview',
        'index': 0},
        'dateValue': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'interview',
        'index': 1},
        'dateName': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'interview',
        'index': 2},
        'timeValue':  { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'interview',
        'index': 3},
        'timeName': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'interview',
        'index': 4}
      },
      'execuate': {
        'executeTime': { 'style': {
          'width': '25%'
        }, 
        'type': 'interview',
        'index': 0},
        'interviews': {
          'index': 1,
          'type': 'interview',
          'next': {
            'name': { 'style': {
              'width': '33%'
            }, 
            'type': 'interview',
            'index': 0},
            'status': { 'style': {
              'width': '15%'
            }, 
            'type': 'interview',
            'index': 1},
            'statusCode': { 'style': {
              'width': '52%'
            }, 
            'type': 'interview',
            'index': 2}
          }
        }
      }
    },
    'evo': {                                                      // 药品方案
      'content': {
        'materialName': { 'style': {
          'width': '35%',
          'padding-right': '8%'
        }, 
        'type': 'drug',
        'index': 0},
        'operationName': { 'style': {
          'width': '20%'
        }, 
        'type': 'drug',
        'index': 1},
        'dosageValue': { 'style': {
          'width': 'auto'
        }, 
        'type': 'drug',
        'index': 2},
        'dosageName': { 'style': {
          'width': 'auto'
        }, 
        'type': 'drug',
        'index': 3},
        'frepName': { 'style': {
          'width': '25%',
          'text-align': 'right'
        }, 
        'type': 'drug',
        'index': 4}
      },
      'execuate': {
        'executeTime': { 'style': {
          'width': '35%'
        }, 
        'type': 'drug',
        'index': 0},
        'interviews': {
          'index': 1,
          'type': 'drug',
          'next': {
            'name': { 'style': {
              'width': '65%',
              'padding-right': '8%'
            }, 
            'type': 'drug',
            'index': 0},
            'status': { 'style': {
              'width': '15%'
            }, 
            'type': 'drug',
            'index': 1},
            'statusCode': { 'style': {
              'width': '24%'
            }, 
            'type': 'drug',
            'index': 2}
          }
        }
      }
    },
  },
  'tt': {                                               // 疼痛                                       
    'interview': {                                              
      'content': {
        'materialName': { 'style': {
          'width': '46%'
        },
        'type': 'evo',
        'index': 0},
        'dateValue': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 1},
        'dateName': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 2},
        'timeValue':  { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 3},
        'timeName': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 4}
      },
      'execuate': {
        'executeTime': { 'style': {
          'width': '25%'
        }, 
        'type': 'evo',
        'index': 0},
        'interviews': {
          'index': 1,
          'type': 'evo',
          'next': {
            'name': { 'style': {
              'width': '33%'
            }, 
            'type': 'evo',
            'index': 0},
            'status': { 'style': {
              'width': '15%'
            }, 
            'type': 'evo',
            'index': 1},
            'statusCode': { 'style': {
              'width': '52%'
            }, 
            'type': 'evo',
            'index': 2}
          }
        }
      }
    },
    'evo': {                                                     // 随访方案
      'content': {
        'materialName': { 'style': {
          'width': '46%'
        }, 
        'type': 'interview',
        'index': 0},
        'dateValue': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'interview',
        'index': 1},
        'dateName': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'interview',
        'index': 2},
        'timeValue':  { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'interview',
        'index': 3},
        'timeName': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'interview',
        'index': 4}
      },
      'execuate': {
        'executeTime': { 'style': {
          'width': '25%'
        }, 
        'type': 'interview',
        'index': 0},
        'interviews': {
          'index': 1,
          'type': 'interview',
          'next': {
            'name': { 'style': {
              'width': '33%'
            }, 
            'type': 'interview',
            'index': 0},
            'status': { 'style': {
              'width': '15%'
            }, 
            'type': 'interview',
            'index': 1},
            'statusCode': { 'style': {
              'width': '52%'
            }, 
            'type': 'interview',
            'index': 2}
          }
        }
      }
    }
  },
  'yy': {                                                // 营养
    'evo': {                                                       
      'content': {
        'materialName': { 'style': {
          'width': '46%'
        },
        'type': 'evo',
        'index': 0},
        'dateValue': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 1},
        'dateName': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 2},
        'timeValue':  { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 3},
        'timeName': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 4}
      },
      'execuate': {
        'executeTime': { 'style': {
          'width': '25%'
        }, 
        'type': 'evo',
        'index': 0},
        'interviews': {
          'index': 1,
          'type': 'evo',
          'next': {
            'name': { 'style': {
              'width': '33%'
            }, 
            'type': 'evo',
            'index': 0},
            'status': { 'style': {
              'width': '15%'
            }, 
            'type': 'evo',
            'index': 1},
            'statusCode': { 'style': {
              'width': '52%'
            }, 
            'type': 'evo',
            'index': 2}
          }
        }
      }
    },
    'home': {                                             
      'content': {
        'materialName': { 'style': {
          'width': '46%'
        },
        'type': 'evo',
        'index': 0},
        'dateValue': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 1},
        'dateName': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 2},
        'timeValue':  { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 3},
        'timeName': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 4}
      },
      'execuate': {
        'executeTime': { 'style': {
          'width': '25%'
        }, 
        'type': 'evo',
        'index': 0},
        'interviews': {
          'index': 1,
          'type': 'evo',
          'next': {
            'name': { 'style': {
              'width': '33%'
            }, 
            'type': 'evo',
            'index': 0},
            'status': { 'style': {
              'width': '15%'
            }, 
            'type': 'evo',
            'index': 1},
            'statusCode': { 'style': {
              'width': '52%'
            }, 
            'type': 'evo',
            'index': 2}
          }
        }
      }
    },
    'unDrug': {                                             
      'content': {
        'materialName': { 'style': {
          'width': '46%'
        },
        'type': 'evo',
        'index': 0},
        'dateValue': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 1},
        'dateName': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 2},
        'timeValue':  { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 3},
        'timeName': { 'style': {
          'width': 'auto', 'margin-right': '3px'
        }, 
        'type': 'evo',
        'index': 4}
      },
      'execuate': {
        'executeTime': { 'style': {
          'width': '25%'
        }, 
        'type': 'evo',
        'index': 0},
        'interviews': {
          'index': 1,
          'type': 'evo',
          'next': {
            'name': { 'style': {
              'width': '33%'
            }, 
            'type': 'evo',
            'index': 0},
            'status': { 'style': {
              'width': '15%'
            }, 
            'type': 'evo',
            'index': 1},
            'statusCode': { 'style': {
              'width': '52%'
            }, 
            'type': 'evo',
            'index': 2}
          }
        }
      }
    }
  }
  
})
// 方案内部按钮展示规则映射
.value('planDetailBtnsMap', {
  'mzf': {                                                                                              // 满足
    'evo': {
      'execuate': {
        'interviews': {
          'next': {
            'status': {
              'waiting': { 'text': '执行', 'className': 'primary', 'planType': 'evo' },                  // 未评估
              'finish': { 'text': '详情', 'className': 'default', 'planType': 'evo' },                  // 已评估
            }
          }
        }
      }
    },
    'interview': {                                                                                     // 随访方案
      'execuate': {
        'interviews': {
          'next': {
            'status': {
              'waiting': { 'text': '执行', 'className': 'primary', 'planType': 'interview' },                  // 未执行
              'finish': { 'text': '详情', 'className': 'default', 'planType': 'interview' },                  // 已执行
            }
          }
        }
      }
    },
    'drug': {                                                                                     // 随访方案
      'execuate': {
        'interviews': {
          'next': {
            'status': {
              'waiting': { 'text': '执行', 'className': 'primary', 'planType': 'drug' },                  // 未执行
            }
          }
        }
      }
    },
    'exercise': {                                                                                     // 呼吸康复
      'execuate': {
        'interviews': {
          'next': {
            'status': {
              'waiting': { 'text': '执行', 'className': 'primary', 'planType': 'exercise' },                  // 未执行
            }
          }
        }
      }
    },
    'oxygen': {                                                                                     // 氧疗
      'execuate': {
        'interviews': {
          'next': {
            'status': {
              'waiting': { 'text': '执行', 'className': 'primary', 'planType': 'oxygen' },                  // 未执行
            }
          }
        }
      }
    },
    'nutrition': {                                                                                     // 营养
      'execuate': {
        'interviews': {
          'next': {
            'status': {
              'waiting': { 'text': '执行', 'className': 'primary', 'planType': 'nutrition' },                  // 未执行
            }
          }
        }
      }
    },
    'smoke': {                                                                                     // 戒烟
      'execuate': {
        'interviews': {
          'next': {
            'status': {
              'waiting': { 'text': '执行', 'className': 'primary', 'planType': 'smoke' },                  // 未执行
            }
          }
        }
      }
    },
    'health': {                                                                                     // 健康教育
      'execuate': {
        'interviews': {
          'next': {
            'status': {
              'waiting': { 'text': '执行', 'className': 'primary', 'planType': 'health' },                  // 未执行
            }
          }
        }
      }
    }
  },
  'huxi': {                                                                                             // 呼吸
    'special': {
      'execuate': {
        'interviews': {
          'next': {
            'status': {
              'waiting': { 'text': '执行', 'className': 'primary', 'planType': 'evo' },                  // 未评估
              'finish': { 'text': '详情', 'className': 'default', 'planType': 'evo' },                  // 已评估
            }
          }
        }
      }
    }
  },
  'xs': {                                                                                               // 血栓
    'unDrug': {
      'execuate': {
        'interviews': {
          'next': {
            'status': {
              'waiting': { 'text': '执行', 'className': 'primary', 'planType': 'unDrug' },                  // 未评估
            }
          }
        }
      }
    },
    'drug': {                                                                                     
      'execuate': {
        'interviews': {
          'next': {
            'status': {
              'waiting': { 'text': '执行', 'className': 'primary', 'planType': 'drug' },                  // 未执行
            }
          }
        }
      }
    },
    'evo': {                                                                                                
      'execuate': {
        'interviews': {
          'next': {
            'status': {
              'waiting': { 'text': '执行', 'className': 'primary', 'planType': 'evo' },                  // 未执行
              'finish': { 'text': '详情', 'className': 'default', 'planType': 'evo' },                  // 已评估
            }
          }
        }
      }
    }
  },
  'tt': {                                                                                               // 疼痛
    'interview': {
      'execuate': {
        'interviews': {
          'next': {
            'status': {
              'waiting': { 'text': '执行', 'className': 'primary', 'planType': 'unDrug' },                  // 未评估
            }
          }
        }
      }
    },
    'evo': {                                                                                                
      'execuate': {
        'interviews': {
          'next': {
            'status': {
              'waiting': { 'text': '执行', 'className': 'primary', 'planType': 'evo' },                  // 未执行
              'finish': { 'text': '详情', 'className': 'default', 'planType': 'evo' },                  // 已评估
            }
          }
        }
      }
    }
  },
  'yy': {                                                                                               // 营养
    'evo': {
      'execuate': {
        'interviews': {
          'next': {
            'status': {
              'waiting': { 'text': '执行', 'className': 'primary', 'planType': 'evo' },                  // 未评估
              'finish': { 'text': '详情', 'className': 'default', 'planType': 'evo' },                  // 已评估
            }
          }
        }
      }
    },
    'home': {
      'execuate': {
        'interviews': {
          'next': {
            'status': {
              'waiting': { 'text': '执行', 'className': 'primary', 'planType': 'evo' },                  // 未评估
              'finish': { 'text': '详情', 'className': 'default', 'planType': 'evo' },                  // 已评估
            }
          }
        }
      }
    },
    'unDrug': {
      'execuate': {
        'interviews': {
          'next': {
            'status': {
              'waiting': { 'text': '执行', 'className': 'primary', 'planType': 'unDrug' },                  // 未评估
            }
          }
        }
      }
    }
  }
})