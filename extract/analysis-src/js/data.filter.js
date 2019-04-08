angular.module('infi-basic')
    .filter('sortName',function(){
        return function(value){
            if(value == null || value == ''){
                value = '---'
            }
            return value;
        }
    })
    .filter('a',function(){
        if( value == '1' ){
            value = '逻辑回归';
        }else if( value == '2' ){
            value = '支持向量机';
        }else if( value == '3' ){
            value = '贝叶斯分类模型';
        }
    })
    .filter('floatNumber',function(){
        return function(value){
            if(value < 0.001 ){
                value = '< 0.001'
            }
            return value;
        }
    })
    .filter('pvalueFloat',function(){
        return function(value){
            if(value == 0){
                value = '0.0000'
            }
            return value
        }
    })
    .filter('kongValue',function(){
        return function(value){
            if(value == null || value == ''){
                value = '空值'
            }
            return value;
        }
    })
    .filter('pointValue',function(){
        return function(value){
            var a = Math.floor(value * 100) / 100
            return a;
        }
    })
    .filter('modificationData',function(){
        return function(value){
            if(value == null || value == ''){
                value = 'displayNone'
            }else{
                value = ''
            }
            return value;
        }
    });