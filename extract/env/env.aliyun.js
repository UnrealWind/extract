/**
 * 定义后台的接口地址
 */
var backApi = {
    'record-collect-src': {
        'url': 'http://47.92.143.156:49271/inquiry-doctor/',
        'treatUrl': 'http://47.92.111.164:19094/recommend-plan/', //治疗
        'prescriptUrl': 'http://47.92.143.156:49272/prescription/', //门诊处方
        'abnormalUrl': 'http://47.92.143.156:32806/abnormal_view/', //异常视图
        'mockUrl': 'http://47.92.143.156:12138'
    },
    'record-src-demo': {
        'url': "http://47.92.143.156:32806/obstetrics/",
        ' titleUrl': 'data/',
        'abnormalUrl': 'http://47.92.143.156:32806/abnormal_view/',   //异常视图
        'viewDetailUrl': "http://192.168.1.178:2000/record-src-demo/#/record/"
    }, 'study-src': {
        'url': ''
    },
    'extract-src-CRF': {
        'url': ''
    },
    'chronic-disease-V2-src': {
        'url': 'http://47.92.143.156:33015/chronic/'
    },
    'system-management': {
        'url': 'http://47.92.143.156:21026/security-server/'
    },
    'navi': {
        url: 'http://47.92.143.156:21026/security-server/menu/platform/tree'
    }
}
