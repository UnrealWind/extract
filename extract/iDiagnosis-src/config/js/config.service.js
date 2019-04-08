angular.module('infi-basic')
  .service("ConfigService", ['$http', 'SYS', 'Utils', '$routeParams', '$q',function ($http, SYS, Utils, $routeParams, $q) {
    /**
     * 获取中间选择区域原始数据和左侧已保存数据
     * @param {*} currLoc 
     */
    this.getOrgAndSavedData = function(confHistory) {
      // 因为 tag 原始数据的接口和其他不一样, 这里单独区分
      var _url = null

      if (confHistory.currClazz == 'tag') {
        _url = SYS.url + 'knowledge/get/tag'
      } else if (confHistory.currClazz == 'relate') {
        _url = SYS.url + 'config/relate/by/tag/' + confHistory.currTag.id
      } else {
        _url = SYS.url + 'knowledge/get/value/' + confHistory.currTag.value + '/' + confHistory.currClazz
      }

      var saveUrl = null

      if (confHistory.currClazz == 'relate') {
        saveUrl = SYS.url + 'config/relate/by/tag/value/' + confHistory.currTag.id + '/' + confHistory.byId
      } else {
        saveUrl = SYS.url + 'config/' + confHistory.currClazz + '/by/' + confHistory.byClazz + '/' + confHistory.byId
      }

      return $q.all({
        'origData': this.getOrigData(_url).then(function(msg) {
          return msg
        }),
        'currSaved': this.modeCurrSaved(saveUrl, null, 'get').then(function(msg) {
          return msg
        })
      })
    }


    /**
     * 
     * @param {*} savedata 要保存的数据
     * @param {*} currLoc 当前位置
     * @param {*} url 当前位置构成的接口 url
     */
    this.saveSelected = function(savedata, confHistory) {
      var saveUrl = null

      if (confHistory.currClazz == 'relate') {
        saveUrl = SYS.url + 'config/relate/by/tag/value/' + confHistory.currTag.id + '/' + confHistory.byId
      } else {
        saveUrl = SYS.url + 'config/' + confHistory.currClazz + '/by/' + confHistory.byClazz + '/' + confHistory.byId
      }
      

      // 发送保存请求
      return this.modeCurrSaved(saveUrl, savedata, 'put')
    }

    /**
     * 中间区域原始数据
     * @param {*} url 
     */
    this.getOrigData = function(url) {
      return $http.get(url).then(function(msg) {
        switch (msg.data.status) {
          case SYS.STATUS_SUCCESS:
            return msg.data.data
            break

          case 'blank':
            return []
            break
        }
      }, function(error) {
        console.log(error)
      })
    }

    /**
     * 左侧当前已保存数据
     * @param {*} sUrl 
     */
    this.modeCurrSaved = function(sUrl, data, type) {
      console.log(sUrl)
      switch (type) {
        case 'get': return $http.get(sUrl).then(function(msg) {
          switch (msg.data.status) {
            case SYS.STATUS_SUCCESS:
              return msg.data.data
              break
  
            case 'blank':
              return []
              break
          }
        }, function(error) {
          console.log(error)
        })
        break

        case 'put': return $http.put(sUrl, data).then(function(msg) {
          switch (msg.data.status) {
            case SYS.STATUS_SUCCESS:
              return msg.data.data
              break
  
            case 'blank':
              return []
              break
          }
        }, function(error) {
          console.log(error)
        })
        break
      }
    }


    /**
     * 前端搜索
     * @param {*} searchAbout 索引关键字
     * @param {*} options 搜索集
     */
    this.searchAction = function(searchAbout, options) {
      var pinyinEngine = new PinyinEngine(options, ['label'])

      searchAbout.rst = pinyinEngine.query(searchAbout.keyword)
    }

    /**
     * 全选/反选
     * @param {*} type 0: 全选, 1: 反选
     * @param {*} scope 
     */
    this.selectAction = function(type, scope) {
      switch(type) {
        case 0: 
          angular.forEach(scope.currOpts.origOpts, function(val, ind) {
            if (!val.isChecked) {
              scope.pickOpts(val)
            }
          })
          break
        case 1: 
            angular.forEach(scope.currOpts.origOpts, function(val, ind) {
              scope.pickOpts(val)
            })
          break

      }
    }
}])
