angular.module("infi-basic").filter('nullFilter',function () {
    return function (original) {
        if(!original){
            return 0;
        }else{
            return original;
        }
    }
});