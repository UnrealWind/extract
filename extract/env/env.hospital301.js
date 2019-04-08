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
      ' titleUrl': 'data/',
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
      'url': 'http://172.18.3.2:23115/security-server/'
      // 'url': 'http://192.168.1.174:21026/security-server/'
  },
  'admission-regist-src': {
      'url': 'http://192.168.1.55:8080/admission_regist'
  },
  'pathology-src': {
      'url':'http://192.168.1.55:8080/admission_regist/pathology/',
  },
  'daily-shift-src': {
      'url':'http://192.168.1.55:8080/admission_regist/',
  },
  'outpatient-src': {
      'url':'http://172.18.3.2:23106/301_outpatient/'
  },
  'extract-service-src': {
      'url':'http://172.18.3.2:23109/extracting/'
  },
  'navi': {
      url: 'http://172.18.3.2:23115/security-server/menu/platform/tree'
  },
  'chronic-disease-V2-src': {
      'url': 'http://192.168.1.19:1995/chronic/',
      'mockUrl': 'http://localhost:1995/chronic1.2/',
  }
}
