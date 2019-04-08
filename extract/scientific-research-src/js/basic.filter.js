angular.module('infi-basic')
.filter('bindTime',function(){
    return function(value){
        var str = '';
        (function () {
            str += value.time;
            if(value.startDate && value.endDate){
                str += '访视周期：' + value.startDate + '-' + value.endDate;
            }

            if(value.loopValue) {
                value.startDate && value.endDate?str += '，':'';
                str += '访视间隔时间：' + value.loopValue;
            }
        })();
        if(!str || str == 'null'){
            return '';
        }else {
            return str;
        }
    }
});
