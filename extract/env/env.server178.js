/**
 * 定义后台的接口地址
 */
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
