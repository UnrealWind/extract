angular.module('infi-basic').filter('changeNULL',function(){
    return function(value){
        if( value==null){
            return "-";
        } else if (value==''){
            return "-";
        }else if (value==undefined){
            return "-";
        }
        return value;
    }
});

angular.module('infi-basic').filter('statusIll',function(){
    return function(value){
        if( value=='1'){
            return "待接诊";
        } else if (value=='5'){
            return "已接诊";
        }
        return value;
    }
});

angular.module('infi-basic').filter('statusCheck',function(){
    return function(value){
        if( value=='created'){
            return "待检查";
        } else if (value=='finish'){
            return "已检查";
        }
        return value;
    }
});

angular.module('infi-basic').filter('BlankData', function() {
    return function(value){
        if(!value) {
            return ''
        }

        return value
    }
})
