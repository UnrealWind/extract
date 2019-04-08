angular.module('infi-basic')
.filter('changeNULL',function(){
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
})
.filter('BlankData', function() {
    return function(value){
        if(!value) {
            return ''
        }

        return value
    }
})