angular.module('infi-basic').service("TaskService",['$http','SYS','Utils', '$rootScope',function ($http,SYS,Utils, $rootScope) {
  /**
   * 获取静态数据
   */
    this.joinUrl = function(mark, type) {
        var url = null
        switch (mark){
            case 0 : url = SYS.url + type + '/symptom'
                break;
            case 1 : url = SYS.url + type + '/sign'
                break;
            case 2 : url = SYS.url + type +'/history'
                break;
            case 3 : url = SYS.url + type +'/exam'
                break;
            case 4 : url = SYS.url + type +'/test'
                break;
        }

        return url
    }


  this.getStaticData = function(tag, currStep) {
    var url = SYS.url + 'config/tag/get/tree/' + tag.id

    return $http.get(url).then(function success(msg){
        return msg.data.data;
    }, function(error) {
        console.log('获取全部数据错误(config/tag/get/tree):' + error.status)
    })
  }

  /**
   * 获取当页 relate 数据
   */
  function flatRcoValueIds(valueIds) {
    var finalArr = [],
        _recuiseData = function(data) {
            angular.forEach(data, function(val, key) {
                if (Utils.type(val) != 'array') finalArr.push(val)
                else {
                    _recuiseData(val)
                }
            })
        }

        _recuiseData(valueIds)
        
        return finalArr
  }

  this.getRelate = function() {
    
    var data = flatRcoValueIds($rootScope.recommandAbout.valueIds)

    return $http.post(SYS.url + 'config/relate/by/tag/value/' + $rootScope.recommandAbout.tagId, data).then(function success(msg){
        return msg.data;
    })
  }

  /**
   * 搜索
   * @param {} scope 
   */
  this.search = function (node,scope) {
    if(scope.searchData.keyword) {
        scope.getRst = true
        $http.get(SYS.url + 'dim/search/' + node + '?wd=' + scope.searchData.keyword).then(function success(msg){
            scope.getRst = false
            scope.searchData.searchRst = msg.data;
        }, function error(e) {
            console.log(e)
        })
    } else {
        scope.searchData.searchRst = null
    }

  }


  
  var modelIndex = null,
      tag = null

  function flatObj (obj, that) {
    var tmp =[]

    angular.forEach(obj, function(value, key) {
        var objItem = {},
            specArr = ['既往史', '检查', '检验']

        objItem.id = value.id

        if(value.modelIndex >= 0) {
            modelIndex = value.modelIndex   // 缓存当前选项卡 index 
            tag = value.label               // 缓存当前 tag
            objItem.label = value.label
        } else {
            objItem.value = value.label
        }

        // 既往史、检查、检验添加 label 属性，值为上一级
        // if(modelIndex >= 2 && !value.children) {
        //     objItem.label = value.tagLabel.split('：')[0]
        // }

        if(specArr.indexOf(tag) >= 0 && value.clazz == 'value') {
            objItem.label = value.classify
        }

        // 如果当前元素有 children 则递归调用自身
        if (value.children && !that.isEmptyObj(value.children)) {
            objItem.children = flatObj(value.children, that)
        }

        tmp.push(objItem)
    })

    return tmp
  }


  /**
   * 将最终的 finalResult 转化为后台数据分析所需要的格式
   */
  this.convertToAnalysis = function(finalResult) {


    var convertRst = flatObj(finalResult, this)

    
    convertRst[0].extraInfo = finalResult[0].extraInfo

    return convertRst
  }





    /**
     * 已保存模板
     * @returns {*}
     */
    this.getExportList = function(page,size){
        return $http.get(SYS.url+"collect/template/page?page_num="+page+"&page_size="+size).then(function success(msg) {
            var fixedData = fixPageData(msg.data)
            
            if(fixedData.page&&fixedData.page.number){
                ++fixedData.page.number;
            }
            return fixedData;
        })
    }

    function fixPageData(obj) {
        var tmp = {
            page: {
                number: obj.page.number,
                numberOfElements: obj.page.numberOfElements,
                size: obj.page.size,
                totalElements: obj.page.totalElements,
                totalPages: obj.page.totalPages
            }
        }
    
        obj.page.content.length > 0 ? tmp.page.content = obj.page.content : tmp.page = null
    
        return tmp
      }



  // 判断对象是否为空
  this.isEmptyObj = function(obj) {
    return JSON.stringify(obj) == '{}'? true : false
  }


    /**
     * 匹配对象属性或者数组元素并删除
     * @param {*} str < string > 需要匹配的关键字
     * @param {*} obj < object | array > 目标匹配对象或数组
     */
    this.deleteEntity = function(str, obj) {
        var reg = new RegExp('^' + str, 'i'),
            objType = Utils.type(obj)

        switch (objType) {
            case 'object':
                angular.forEach(obj, function (value, key) {
                    if (reg.test(key)) {
                        delete obj[key]
                    }
                })
                break
            case 'array':
                angular.forEach(obj, function (value, index) {
                    if (reg.test(value)) {
                        obj.splice(index, 1)
                    }
                })
        }
    }

  

  /**
   * POST 请求工具函数
   */
  this.httpPOST = function(url, data) {
    return $http.post(url, data).then(function success(msg) {
        return msg
    }, function error(e) {
        return e
    })
  }

  /**
   * DELETE 请求工具函数
   */

  this.httpDELE = function(url, data) {
    return $http.delete(url, data).then(function success(msg) {
        return msg
    }, function err(e) {
        return e
    })
  }


  /**
   * GET 请求工具函数
   * @param {*} url 
   */

  this.httpGET = function(url) {
    return $http.get(url).then(function success(msg) {
        return msg
    }, function err(e) {
        return e
    })
  }
  
}])