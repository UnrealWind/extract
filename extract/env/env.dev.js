/**
 * 定义后台的接口地址
 */
var backApi = {
  'record-collect-src': {
      'url': 'http://192.168.1.173:19092/inquiry-doctor/',
      'treatUrl': 'http://192.168.1.173:19094/recommend-plan/', //治疗
      'prescriptUrl': 'http://192.168.1.173:29092/prescription/', //门诊处方
      'abnormalUrl': 'http://192.168.1.166:36005/abnormal_view/', //异常视图
      'mockUrl': 'http://127.0.0.1:12138'
  },
  'record-src-demo': {
      'url': "http://192.168.1.173:18082/obstetrics/",
      'titleUrl': 'data/',
      'abnormalUrl': 'http://192.168.1.173:18096/abnormal_view/',
      'viewDetailUrl': "http://192.168.1.173:2000/record-src-demo/#/record/"
  },
  'study-src': {
      'url': 'http://192.168.1.173:18083/platform/'
  },
  'scientific-research-src':{
      'url':'http://192.168.1.173:18091/research/'
  },
  'extract-src-CRF': {
      'url':'http://192.168.1.173:18091/research/'
  },
  'extract-src': {
       'url':'http://192.168.1.19:8080/extracting/',
  },
  'system-management': {
      'url': 'http://192.168.1.173:18086/security-server/'
      // 'url': 'http://192.168.1.174:21026/security-server/'
  },
  'admission-regist-src': {
      'url': 'http://192.168.1.55:8080/admission_regist'
      //'url':'http://192.168.1.175:35112/admission_regist',

  },
  'pathology-src': {
      'url':'http://192.168.1.55:8080/admission_regist/pathology/',
      //'url':'http://192.168.1.175:35112/admission_regist/pathology/',
  },
  'daily-shift-src': {
      'url':'http://192.168.1.55:8080/admission_regist/',
  },
  'outpatient-src': {
      'url':'http://192.168.1.55:8080/301_outpatient/'
  },
  'extract-service-src': {
      'url':'http://192.168.1.19:8080/extracting/'
  },
  'navi': {
      'url': 'http://192.168.1.173:18086/security-server/menu/platform/tree',
      // 'url': 'http://192.168.1.174:21026/security-server/menu/platform/tree'
  },
  'chronic-disease-V2-src': {
      'url': 'http://192.168.1.19:8081/chronic/',
      'wechatUrl': 'http://192.168.1.174:33025/chronic-wechat/',
      // 'url': 'http://192.168.1.19:1995/chronic/',
      // 'url': 'http://192.168.1.181:33015/chronic/',
      'mockUrl': 'http://localhost:1995/chronic1.2/',
  },
  'diseases-plan-src': {
      'url':'http://192.168.1.174:30050/recommend/'
  }
}

/*
var backApi = {
    'record-collect-src': {
        'url': 'http://192.168.1.178:19092/inquiry-doctor/',
        'treatUrl': 'http://192.168.1.178:19094/recommend-plan/',
        'prescriptUrl': 'http://192.168.1.178:29092/prescription/', //门诊处方
        'abnormalUrl': 'http://192.168.1.166:36005/abnormal_view/', //异常视图
        'mockUrl': 'http://127.0.0.1:12138'
    },
    'record-src-demo': {
        'url': "http://192.168.1.178:19095/obstetrics/",
        ' titleUrl': 'data/',
        'abnormalUrl': 'http://192.168.1.178:18096/abnormal_view/',
        'viewDetailUrl': "http://192.168.1.178:2000/record-src-demo/#/record/"
    }, 'study-src': {
        'url': ''
    },
    'extract-src-CRF': {
        'url': ''
    },
    'system-management': {
        'url': 'http://192.168.1.178:21026/security-server/'
    },
    'navi': {
        url: 'http://192.168.1.178:21026/security-server/menu/platform/tree'
    }
}
*/
