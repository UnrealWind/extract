app.service('InputService',['$http','SYS','EMR',function($http,SYS,EMR){

    var strChineseFirstPY = EMR.FIRSTPY;
    /**
     * 保存病历录入信息
     * @param filter
     * @returns {*}
     */
    this.saveRecord = function(filter){
        return $http.post(SYS.url+'load/data/save/'+ filter.id,filter.record).then(function(data){
            return data.data;
        })
    };

    this.saveRecordText = function(filter){
        return $http.post(SYS.url + 'text/info/'+filter.id,filter.text).then(function(data){
            return data.data;
        })
    };

    /**
     * 获取病历录入信息
     * @param filter
     * @returns {*}
     */
    this.getRecord = function(filter){
        return $http.get(SYS.url+'load/data/get/'+ filter.id).then(function(data){
            return data.data;
        })
    };

    /**
     * 获取病历文本信息
     * @param filter
     * @returns {*}
     */
    this.getTextArea = function(filter){
        return $http.get(SYS.url+'text/info/'+ filter.id).then(function(data){
            return data.data;
        })
    };

    /**
     * 获取既往史json
     * @param type
     * @returns {*}
     */
    this.getJws = function(type){
        return $http.get(SYS.titleUrl+type+'.tpl.json').then(function(data){
            return data.data;
        })
    };

    // this.getMoreOptions = function(data,dimensions,optionMore){
    //     angular.forEach(data,function(value,key){
    //         //判断新添的多选项添加进dimension中
    //         if(typeof(value) == 'object'){
    //             angular.forEach(value,function(value2,key2){
    //                 if(!matchOption(dimensions,key2,key)){
    //                     var arr = key2.split('_');
    //                     if(key == 'name_1055'){
    //                         var option = {
    //                             label:arr[1],
    //                             name:key2,
    //                             entityName:key2
    //                         };
    //                         dimensions.options.push(option);
    //                     }else{
    //                         var option = {
    //                             label:arr[1],
    //                             name:key2
    //                         };
    //                         dimensions[key].options.push(option);
    //                         if(optionMore[key]){
    //                             optionMore[key].push(option);
    //                         }
    //                     }
    //
    //                 }
    //             })
    //         }
    //     });
    //     // return data;
    // };
    //
    // function matchOption(dimensions,value,key){
    //     var flag = false;
    //     if(key == 'name_1055'){
    //         angular.forEach(dimensions.options,function(option){
    //             if(option.entityName == value){
    //                 flag = true;
    //             }
    //         });
    //     }else{
    //         angular.forEach(dimensions[key].options,function(option){
    //             if(option.name == value){
    //                 flag = true;
    //             }
    //         });
    //     }
    //     return flag;
    // }

    /**
     * 获取首字母组合
     * @returns {*}
     */
    this.getCodePy = function(){
        return $http.get(SYS.titleUrl+'code.py.json').then(function(msg){
            return msg.data;
        })
    };

    /**
     * 返回当前单词的首字母的组合
     * @param str
     * @param oMultiDiff
     * @returns {string[]}
     */
    this.makePy = function(str,oMultiDiff){
        var arrResult = [];
        for (var i = 0, len = str.length; i < len; i++) {
            var ch = str.charAt(i);
            arrResult.push(checkCh(ch,oMultiDiff));
        }
        return mkRslt(arrResult);
    };
    /**
     * 查找当前汉字的首字母
     * @param ch
     * @param oMultiDiff
     * @returns {*}
     */
    function checkCh(ch,oMultiDiff){
        var uni = ch.charCodeAt(0);
        if(uni > 40869 || uni < 19968)
            return ch;
        return (oMultiDiff[uni]?oMultiDiff[uni]:(strChineseFirstPY.charAt(uni-19968)));
    }

    /**
     * 首字母拼接
     * @param arr
     * @returns {string[]}
     */
    function mkRslt(arr){
        var arrRslt = [""];
        for(var i=0,len=arr.length;i<len;i++){
            var str = arr[i];
            var strlen = str.length;
            if(strlen == 1){
                for(var k=0;k<arrRslt.length;k++){
                    arrRslt[k] += str;
                }
            }else{
                var tmpArr = arrRslt.slice(0);
                arrRslt = [];
                for(k=0;k<strlen;k++){
                //复制一个相同的arrRslt
                    var tmp = tmpArr.slice(0);
                    //把当前字符str[k]添加到每个元素末尾
                    for(var j=0;j<tmp.length;j++){
                        tmp[j] += str.charAt(k);
                    }
                    //把复制并修改后的数组连接到arrRslt上
                    arrRslt = arrRslt.concat(tmp);
                }
            }
        }
        return arrRslt;
    }
    
}]);