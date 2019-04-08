angular.module("infi-basic").controller("ListController", [
  "$scope",
  "APIService",
  "SYS",
  "Utils",
  "$q",
  function($scope, APIService, SYS, Utils, $q) {
    const createPatiModal = $('#creatPatiDiag')                   // 新建患者模态框

    $scope.totast = {                                             // totast 通知
      mainBody: null
    }

    $scope.filterAbout = {                                        // 筛选条件相关
      patiName: '',                                                 // 患者姓名
      depId: '',                                                    // 门诊 ID
      patiGroup: null                                               // 当前所在护理组
    }

    $scope.groupAbout = {                                         // 护理组下拉框相关
      groupOrgData: null,                                           // 原始数据
      changeGroup: (newGroup) => {
        $scope.filterAbout.patiGroup = newGroup  
        sessionStorage.setItem('currGroup', JSON.stringify(newGroup))
      }
    }


    $scope.patiTabAbout = {                                         // 患者列表相关 
      state: {
        currState: 'init',
        stateMachine: {
          'init': {
            fetch: 'fetching'
          },
          'fetching': {
              success: 'showRst',
              failure: 'showErr',
          },
          'showRst': {
              refetch: 'init'
          },
          'showErr': {
              refetch: 'init'
          }
        },
        stateChange: Utils.changeState()
      },
      fillData: null,                                             // 填充数据  
      columns: [                                                  // 列名
        { label: "门诊 ID", width: '8%' },
        { label: "姓名", width: '8%' },
        { label: "性别", width: '5%' },
        { label: "护理组", width: '8%' },
        // { label: "提示", width: '60%' },
        { label: "操作", width: '11%' },
      ],
      contentMap: [                                               // 单元格数据与源数据映射关系
        "pid", 
        "name", 
        "sex", 
        "groupName", 
        // "tips"
      ],
      jumpPage: 1
    }

    $scope.patiAbout = {                                          // 存储要查找的患者的信息               
      depId: null,                                                    // pid
      isExisted: null,                                              // 是否已经存在
      pInfo: null                                                   // 患者相关信息
    }
    
    $scope.checkPatiAbout = {                                    // 新建患者搜索相关信息
      currState: 'init',                                            // 搜索栏的当前状态
      stateMachine: {
        'init': {
          fetch: 'fetching'
        },
        'fetching': {
            success: 'showRst',
            failure: 'showErr',
        },
        'showRst': {
            refetch: 'init'
        },
        'showErr': {
            refetch: 'init'
        }
      },
      stateChange: Utils.changeState(),                           // 更改状态函数
      search: Utils.debounce(function () {                         // pid 搜索主函数
        this.currState = 'init'
        if ($scope.patiAbout.depId) {
          this.stateChange('fetch')                                 
          // 拼接接口所需的参数
          var param = { depId: $scope.patiAbout.depId, groupId: $scope.filterAbout.patiGroup.id }
          
          APIService.ifPatiExist(param).then((msg) => {
            this.stateChange('success')
            $scope.patiAbout.isExisted = msg.isExisted
            $scope.patiAbout.pInfo = msg.pInfo
          }, function(error) {
            this.stateChange('failure')
          })
        } else {
          this.currState = 'init'
          $scope.$apply()
        }
      }, 500, false)
    }


    $scope.createPatiAbout = {                                    // 创建患者相关
      currState: 'init',                                            // 创建的当前状态
      stateMachine: {                                               // 创建相关的状态机
        'init': {
          create: 'creating'
        },
        'creating': {
          success: 'created',
          failure: 'creatErr',
        },
        'created': {
          evaluate: 'init'
        },
        'creatErr': {
          recreate: 'init'
        }
      },
      stateChange: Utils.changeState(),                              // 更改状态
      newPatiFormEntity: {                                           // 创建全新患者的表单实例
        'brandNewPatiForm': null,                                         // 基本信息表单
        'groupForm': null                                                 // 护理组表单
      }
    }


    /**
     * 获取护理组下拉框原始数据函数
     */
    var getGroup = APIService.getGroup

    /**
     * 获取列表数据
     */
    $scope.getList = function (num) {
      var param = { num, size: SYS.DEFAULT_PAGE_SIZE, filterAbout: $scope.filterAbout }

      $scope.patiTabAbout.state.stateChange('fetch')

      var deferred = $q.defer()

      return APIService.getList(param).then(function(msg) {
        $scope.patiTabAbout.state.stateChange('success')
        $scope.patiTabAbout.fillData = msg
        return deferred.resolve()
      }, function(error) {
        $scope.patiTabAbout.state.stateChange('failure')
        return deferred.reject()
      })
    }

    /**
     * 更改筛选条件
     */
    $scope.filterChange = Utils.debounce(function() {
      $scope.patiTabAbout.state.stateChange('refectch')
      $scope.getList(SYS.DEFAULT_PAGE_NUMBER)
        .then(function() {
          // 更新缓存的当前分组
          sessionStorage.setItem('currGroup', JSON.stringify($scope.filterAbout.patiGroup))
        })

    }, 500, false)

    /**
     * 创建患者
     */
    $scope.createPatiAction = function() {
      $scope.patiAbout.pInfo['pid'] = $scope.patiAbout.depId            // 为新建的患者添加 depId 即 pId

      var param = {
        pInfo: $scope.patiAbout.pInfo
      }
      $scope.createPatiAbout.stateChange('create')

      APIService.creatPati(param).then(function(msg) {
        // 创建成功
        $scope.createPatiAbout.stateChange('success')
        sessionStorage.setItem('currPati', JSON.stringify(msg))                // 当前操作的患者信息
        sessionStorage.setItem('currInterview', JSON.stringify(msg.interview)) // 存储当前随诊信息

        $scope.totast.mainBody = {                                             // 通知提示语定义
          status: 'ok',
          description: '创建成功！',
          callback: function() {
            createPatiModal.modal("hide")
            // 重写新建患者模态框收起回调事件
            createPatiModal.on('hidden.bs.modal', function(e) {
              location.href = `#/scaleEnter/${msg.pid}/${msg.groupId}/${msg.interview.id}/${msg.interview.crfTemplateId}/0`
            })
          },
          delay: 1000
        }
      }, function(error) {
        // 创建失败
        $scope.createPatiAbout.stateChange('failure')
        $scope.totast.mainBody = {                                  // 通知提示语定义
          status: 'error',
          description: '创建失败，请重试！',
          callback: function() {
            $scope.createPatiAbout.stateChange('recreate')          // 重置状态机
          },
          delay: 2000
        }
      })

    }


    /**
     * 前往管理页
     */
    $scope.toManage = function(target, param) {
      var actMap = {
        // 由新建患者跳转管理页
        'create': () => {
          createPatiModal.unbind('hidden.bs.modal')                            // 解除先前的模态框隐藏回调事件绑定
          createPatiModal.on('hidden.bs.modal', function(e) {                  // 重新赋值模态框隐藏回调事件绑定
            location.href = `#/patiManage/${$scope.patiAbout.depId}`
          })

          createPatiModal.modal('hide')
        },
        // 由患者列表跳转管理页
        'table': (item) => {
          sessionStorage.clear()                                              // 由列表进入时清掉所有 session 缓存
          sessionStorage.setItem('currPati', JSON.stringify(item))             // 当前操作的患者信息
          sessionStorage.setItem('currInterview', JSON.stringify(item.interview)) // 缓存当前 interview，用于患者没有方案时点击去评估获取 crf 数据用。有方案的患者忽略
          location.href = `#/patiManage/${item.pid}`
        }
      }

      // act
      actMap[target](param)
    }





    /**
     * 页面初始化函数
     */
    ;(function init() {
      // 获取护理组下拉框原始数据
      getGroup().then(function(msg) {
        $scope.groupAbout.groupOrgData = msg                              // 赋值给下拉框
        $scope.filterAbout.patiGroup = JSON.parse(sessionStorage.getItem('currGroup')) || $scope.groupAbout.groupOrgData[0]  // 设置默认选中组
        sessionStorage.setItem('currGroup', JSON.stringify($scope.filterAbout.patiGroup))
        $scope.getList(SYS.DEFAULT_PAGE_NUMBER)                           // 获取列表数据             
      })


      // 初始化新建患者模态框收起回调事件
      createPatiModal.on('hidden.bs.modal', function(e) {
        $scope.patiAbout = {                                          // 存储要查找的患者的信息               
          depId: null,                                                  // pid
          isExisted: null,                                              // 是否已经存在
          pInfo: null                                                   // 患者相关信息
        }

        $scope.createPatiAbout.currState = 'init'                     // 重置创建按钮状态
        $scope.checkPatiAbout.currState = 'init'                     // 重置检查患者是否存在提示语的状态
      })

    })()

  }
]);
