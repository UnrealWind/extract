angular.module('infi-basic').value('SYS',{
    STATUS_SUCCESS: 'ok',
    infiUrl:'data/',
    url:'http://192.168.1.66:8080/extracting/',  //连接后台的url
    parentUrl:'http://192.168.1.200:8810/',  //嵌入的主系统的访问url
    // 分页时默认请求第1页数据
    DEFAULT_PAGE_NUMBER: '1',
    DEFAULT_PAGE_SIZE:'10',
    PARENT_HREF:{
        "oper":"knowledge/operation?type_id=3",
        "exam":"knowledge/exam?type_id=4",
        "test":"knowledge/test?type_id=5",
        "illn":"knowledge/illness?type_id=2",
        "drug":"knowledge/drug?type_id=1"
    }
});