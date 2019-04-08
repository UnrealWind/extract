angular.module('infi-basic')
.controller('ConfigController', ['$scope', 'ConfigService', 'Utils', '$q', 'configValue', 'SYS', '$routeParams',function($scope, ConfigService, Utils, $q, configValue, SYS, $routeParams) {
  
  // 历史记录
  $scope.stepHeader = 0

  $scope.confHistory = [
    {
      'currClazz': 'tag',   // 当前层级
      'byClazz': 'template',  // 父层级
      'byId': +$routeParams.tempId, // 父层级 Id
      'currTag': null // 当前所在 tag
    }
  ]

  // 保存当前返回数据
  $scope.currOpts = {
    'currSaved': null,
    'origOpts': null
  }

  // 前台备份数据
  $scope.copyedData = {
    'currSavedCp': []
  }

  // 用于显示每一层级可以操作按钮的对应关系
  $scope.addBtnMap = configValue.addBtnMap

  // 搜索相关变量
  $scope.searchAbout = {
    keyword: null,
    rst: null
  }


  // --------------------- params end ------------------------------- //
  
  /**
   * 树拖拽
   */
  $scope.treeOptions = {
    dragStart: function(event) {
      
    },
    dragMove: function(event) {
      
    },
    dropped: function(event) {
    }
  };
  
  /**
   * 中间选择区挑选元素
   * @param {*} orgOpt 当前点击的原始数据元素
   */
  $scope.pickOpts = function(orgOpt) {
    if (!orgOpt.isChecked) {
      orgOpt.isChecked = !orgOpt.isChecked

      var tmpObj = {},
          _varMap = {
            'template': 'templateId',
            'tag': 'tagNodeId',
            'classify': 'classifyNodeId',
            'attribute': 'attributeNodeId',
            'value': 'valueNodeId',
          },
          currHistory = $scope.confHistory[$scope.stepHeader],
          specField = _varMap[currHistory.byClazz]
          
      // 复制一份模板数据, 为了拼接保存时后台需要的格式
      angular.copy(configValue.saveDataMap[$scope.confHistory[$scope.stepHeader].currClazz], tmpObj)
  
      tmpObj.clazz = orgOpt.clazz
      tmpObj.label = orgOpt.label
      tmpObj.value = orgOpt.value
      if (currHistory.currClazz != 'relate') tmpObj[specField] = currHistory.byId
      else tmpObj.id = orgOpt.id
      
      $scope.copyedData.currSavedCp.push(tmpObj)

    } else {
      orgOpt.isChecked = !orgOpt.isChecked

      contrUtils.findSpecObj({
        'orgArr': [orgOpt],
        'destinArr': $scope.copyedData.currSavedCp,
        'targetKey': 'value'
      }, function(msg) {
        $scope.copyedData.currSavedCp.splice(msg.destinEle.destinInd, 1)

      })

    }

  }

  /**
   * 中间区搜索
   */
  $scope.searchAction = function() {
    $scope.searchAbout.keyword ?
      ConfigService.searchAction($scope.searchAbout, $scope.currOpts.origOpts) : 
      undefined
  }


  /**
   * 为当前层级添加元素, 即向下增进一个层级, 历史记录对应增加一条记录
   * @param {*} currClazz 添加的层级分类, 即下一个历史记录的 currClazz. 页面左侧当前显示的层级
   * @param {*} byClazz   从哪里来的层级的分类
   */
  $scope.addSubEle = function(currClazz, byClazz) {
    var newStep = {}

    newStep.currClazz = currClazz
    newStep.byClazz = byClazz.clazz
    newStep.byId = byClazz.id

    newStep.currTag = (byClazz.clazz == 'tag' ? byClazz : $scope.confHistory[$scope.stepHeader].currTag)

    $scope.confHistory.push(newStep)

    $scope.stepHeader++   // 当前历史记录头指针 +1, 表示前进一步


    contrUtils.changeOrgAndSaved()  // 刷新数据

  }

  /**
   * 返回上一步操作
   */
  $scope.stepBack = Utils.debounce(function() {
    $scope.stepHeader-- // 头指针向前移动
    $scope.confHistory.pop()  // 从历史记录删除

    
    contrUtils.changeOrgAndSaved()  // 刷新数据

  }, 800, true) 

  /**
   * 全选/反选
   * @param {*} type 0: 全选, 1: 反选
   */
  $scope.selectAction = function(type) {
    ConfigService.selectAction(type, $scope)
  }


  /**
   * 保存当前操作数据
   */
  $scope.saveSelected = function() {

    contrUtils.deleteSpecKey('$$hashKey', $scope.copyedData.currSavedCp)


    ConfigService.saveSelected($scope.copyedData.currSavedCp, $scope.confHistory[$scope.stepHeader]).then(function(msg) {
      contrUtils.changeOrgAndSaved()
    })
  }
  
  // 当前 controller 工具函数
  var contrUtils = {
    changeOrgAndSaved: function() {
      var that = this

      ConfigService.getOrgAndSavedData($scope.confHistory[$scope.stepHeader]).then(function(arr) {
        $scope.currOpts.currSaved = arr.currSaved
        $scope.currOpts.origOpts = arr.origData

        that.findSpecObj({
          'orgArr': $scope.currOpts.currSaved,
          'destinArr': $scope.currOpts.origOpts,
          'targetKey': 'value'
        }, function(msg) {
          msg.destinEle.destinVal['isChecked'] = true
        })


        // 备份原始数据到 copyedData
        angular.copy(arr.currSaved, $scope.copyedData.currSavedCp)

      })
    },
    findSpecObj: function(conf, callback) {
      angular.forEach(conf.orgArr, function(val, ind) {
        angular.forEach(conf.destinArr, function(desVal, desInd) {
          if (val[conf.targetKey] == desVal[conf.targetKey]) {
            callback({
              'orgEle': {
                'orgAllVal': val,
                'orgAllInd': ind
              },
              'destinEle': {
                'destinVal': desVal,
                'destinInd': desInd
              }
            })
          }
        })
      })
    },
    deleteSpecKey: function(keyName, arr) {
      angular.forEach(arr, function(val, ind) {
        if (val[keyName]) delete val[keyName]
      })
    }
  }
  
  
  // 初始化
  ;(function() {
    // 初始化 tag 层级展示数据
    contrUtils.changeOrgAndSaved()
  })()
}])