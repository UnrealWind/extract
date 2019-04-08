angular.module('infi-basic')
  .service("ListService", ['$http', 'SYS', 'Utils', '$q', function ($http, SYS, Utils, $q) {

    /**
     * 获取已收藏模板列表
     * @param {*} page 页数
     * @param {*} size 每页展示条数
     */
    this.getTemplateList = function (page, size) {
      return $http.get(SYS.url + "config/template/page?page_number=" + page + "&page_size=" + size).then(function(msg) {
        var fixedData = _fixPageData(msg.data)

        // if(fixedData.page&&fixedData.page.number){
        //     ++fixedData.page.number;
        // }

        return fixedData;

      })
    }


    function _fixPageData(obj) {
      var tmp = {
        page: {
          number: obj.page.number + 1,
          numberOfElements: obj.page.numberOfElements,
          size: obj.page.size,
          totalElements: obj.page.totalElements,
          totalPages: obj.page.totalPages
        }
      }

      obj.page.content.length > 0 ? tmp.page.content = obj.page.content : tmp.page = null

      return tmp
    }

    /**
     * 保存新模板
     */
    this.saveNewTemp = function(data) {
      return $http.post(SYS.url + "config/template", data).then(function(msg) {
        return msg
      }, function(error) {
        console.dir(error)
      })
    }
    

    this.entityOps = function(type, param, $scope) {
      var tip = null

      $q(function(res, rej) {
        switch (type) {
          case 'config': 
            window.location.href = '#/config/' + param.id
              break
  
          case 'delete': 
            $http.delete(SYS.url + 'config/template/' + param.id).then(function(msg) {
              if (msg.data.status == 'blank') {
                tip = {
                  status:'ok',
                  description:"删除成功!"
                }
                res(tip)
              }
            }, function(error) {
              console.log(error)
            })
  
            break
  
          case 'active':
            // 1 激活
            $http.put(SYS.url + 'config/template/change/' + param.id + '/1').then(function(msg) {
              if (msg.data.status == SYS.STATUS_SUCCESS) {

                sessionStorage.setItem('currActive', param.id)
                
                tip = {
                  status:'ok',
                  description:"激活成功!",
                  type: 'active'
                }
                res(tip)
              }
            }, function(error) {
              console.log(error)
            })
  
            break
            
          case 'offline':
            // 0 下线
            $http.put(SYS.url + 'config/template/change/' + param.id + '/0').then(function(msg) {
              if (msg.data.status == SYS.STATUS_SUCCESS) {
                tip = {
                  status:'ok',
                  description:"下线成功!"
                }
                res(tip)
              }
            }, function(error) {
              console.log(error)
            })
  
            break
        }
      }).then(function(tip) {
        Utils.sysTip($scope, tip, function() {
          if (tip.type && tip.type == 'active') {

            window.location.href = "http://"+location.hostname+":"+location.port+"/iDiagnosis-src/index";
          }

          tip.status == 'ok' ? $scope.updatePage($scope.currentPage || SYS.DEFAULT_PAGE_NUMBER) : undefined
        }) 
      })
    }

    

    // /**
    //  * 删除模板
    //  * @param {*} tmpId 
    //  */
    // this.deleteTmplate = function(tmpId) {
    //   return $http.delete(SYS.url + 'config/template/' + tmpId).then(function(msg) {
    //     return msg
    //   }, function(error) {
    //     console.dir(error)
    //   })
    // }

    // /**
    //  * 激活模板
    //  * @param {*} tmpId 
    //  */
    // this.activeTemplate = function(tmpId) {
    //   return $http.put(SYS.url + 'customtemplate/template/activation/' + tmpId ).then(function(msg) {
    //     return msg
    //   }, function(error) {
    //     console.log(error)
    //   })
    // }


    // /**
    //  * 下线模板
    //  * @param {*}} tmpId 
    //  */
    // this.offlineTemplate = function(tmpId) {
    //   return $http.put(SYS.url + 'customtemplate/template/close/' + tmpId ).then(function(msg) {
    //     return msg
    //   }, function(error) {
    //     console.log(error)
    //   })
    // }
}])