/**
 * 定义后台的接口地址
 */
var backApi = {
    'record-collect-src': {
        'url': '',
        //'url':'http://192.168.1.173:19092/inquiry-doctor/',  //主体内容
        'treatUrl': '',  //治疗
        'prescriptUrl': '', //门诊处方
        'abnormalUrl': '', //异常视图
        'mockUrl': 'http://127.0.0.1:12138'
    },
    'record-src-demo': {
        'url': "http://192.168.1.179:30030/obstetrics/",
        ' titleUrl': 'data/',
        'abnormalUrl': 'http://192.168.1.179:18096/abnormal_view/',
        'viewDetailUrl': "http://192.168.1.179:2000/record-src-demo/#/record/"
    },
    'study-src': {
        'url': 'http://192.168.1.179:30040/platform/'
    },
    'extract-src':{
        'url':'http://192.168.1.179:30020/extracting'
    },
    'extract-src-CRF': {
        'url': 'http://192.168.1.179:30040/platform/'
    },
    'system-management': {
        'url': 'http://192.168.1.179:33005/security-server/'
    },
    'navi':{
        url:'http://192.168.1.179:33005/security-server/menu/platform/tree'
    }
}
