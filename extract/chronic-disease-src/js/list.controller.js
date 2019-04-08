angular.module("infi-basic").controller("ListController", [
  "$scope",
  "APIService",
  "SYS",
  "Utils",
  function($scope, APIService, SYS, Utils) {
    // totast
    $scope.totast = {
      mainBody: null
    }

    
    $scope.tableAbout = {   // 列表相关
      page: null,             // 列表数据
      loading: "pending",     // 表格的加载状态
      jumpPage: null,         // 手动跳页的 ng-model 值
      columns: [              // 列名
        "门诊 ID", 
        "姓名", 
        "性别", 
        "护理组", 
        "提示", 
        "操作"
      ],
      contentMap: [           // 单元格数据与源数据映射关系
        "pid", 
        "name", 
        "sex", 
        "groupName", 
        "tips"
      ]
    }

    
    $scope.filterAbout = {  // filter 筛选条件
      patiName: '',           // 患者姓名筛选条件
      deptID: '',             // 门诊 ID 筛选条件
      patiGroup: null,        // 分组筛选条件
      groupOrgData: null      // 分组原始数据
    }

    
    $scope.addNewPati = {   // 新建患者
      deptID: null,           // 输入的部门 ID
      isNewPati: null,        // 标示是否已经存在
      createInfo: null,       // 用于在点击完创建之后展示用数据, 并且在点击保存后进行回传
      canSave: false          // 控制保存按钮是否显示
    }



    // -------------- param define end -----------------//


    /**
     * 更新列表数据
     * @param {*} num 
     */
    $scope.updatePage = function(num) {
      $scope.tableAbout.loading = "pending"

      APIService.getList(num, SYS.DEFAULT_PAGE_SIZE, $scope.filterAbout)    // 初始化列表数据
        .then(function(msg) { 
          if(msg.status != "blank") {
            $scope.tableAbout.loading = 'resolved'  // 更改表格的加载状态
            $scope.tableAbout.page = msg.page       // 存储表格数据
          } else if(msg.status == 'blank') {
            $scope.tableAbout.loading = 'nondata'
            $scope.tableAbout.page = null
          }
          else {
            $scope.tableAbout.loading = 'rejected'
          }
        })
    }


    /**
     * 更改筛选条件, 刷新列表数据
     */
    $scope.filterChange = Utils.debounce(function() {
      $scope.updatePage(SYS.DEFAULT_PAGE_NUMBER)
    }, 1000)
    
    
    /**
     * 点击新建患者按键
     */
    $scope.addNewPatiAct = function() {
      $("#addNewPatiModal").modal("show");
      
      $("#addNewPatiModal").on("hidden.bs.modal", function(e) {         // 监听模态框收起事件
        $scope.addNewPati.canSave = false                               // 隐藏创建按钮
        $scope.addNewPati.deptID = null                                 // 清空上次填写的部门 ID
      })
    }


    /**
     * 创建新患者, 检测是否已经存在
     */
    $scope.createPati = Utils.debounce(function() {
      $scope.addNewPati.isNewPati = null            // 将控制显示搜索结果区域的标示全部重置
      $scope.addNewPati.createInfo = null           
      $scope.addNewPati.canSave = 'loading'         // 提示语
      $scope.$apply()

      if($scope.addNewPati.deptID) {
        APIService.ifPatiExist($scope.addNewPati.deptID, $scope.filterAbout).then(function(msg) {
          $scope.addNewPati.canSave = true          // 隐藏创建按钮, 显示保存按钮
          if(msg.status == 'blank') {               // 不存在, 展示 existed-pati
            $scope.addNewPati.isNewPati = true
          } else if(msg.status == 'ok') {           // 已存在, 展示 brand-new-pati
            $scope.addNewPati.isNewPati = false
          }
          
          $scope.addNewPati.createInfo = msg.data
  
          console.log($scope.addNewPati.createInfo)
        })
      } else {
        $scope.addNewPati.isNewPati = null          // 将控制显示搜索结果区域的标示全部重置
        $scope.addNewPati.createInfo = null
        $scope.addNewPati.canSave = false
        $scope.$apply()
      }
    }, 500)
    
    
    


    /**
     * 保存新建患者相关信息
     */
    $scope.savePati = Utils.debounce(function() {
      $("#addNewPatiModal").on("hidden.bs.modal", function(e) {          // 监听模态框收起事件
        
        sessionStorage.setItem('currPati', JSON.stringify($scope.addNewPati.createInfo))     // 存储当前管理的用户信息(这条信息在回到 list 会被清掉), 同样的赋值会在列表页点击 管理 按键时发生.

        if ($scope.addNewPati.isNewPati) {
          sessionStorage.setItem('currInterview', JSON.stringify($scope.addNewPati.createInfo.healthPlan.interviews[0])) // 存储当前随诊信息
          location.href = `#/scaleEnter/1/1/${$scope.addNewPati.createInfo.pid}/${$scope.addNewPati.createInfo.healthPlan.interviews[0].id}`  // 全新用户跳转到量表录入页
        } 
        else location.href = `#/patiManage/1/1/${$scope.addNewPati.createInfo.pid}`
        
      })
      
      $scope.addNewPati.createInfo['pid'] = $scope.addNewPati.deptID    // 拼接后台需要的数据格式

      if($scope.addNewPati.isNewPati) {                                 // 只有当全新的患者才走 create 保存接口
        APIService.saveCreatePati($scope.addNewPati.createInfo)           // 发送保存请求, 将数据回传
          .then(function(msg) {
            if(msg.status == 'ok') {
              $scope.addNewPati.createInfo = msg.data                     // 保存新创建的用户信息
  
              $scope.totast.mainBody = {                                  // 通知提示语定义
                status: 'ok',
                description: '创建成功!',
                callback: function() {
                  $("#addNewPatiModal").modal("hide");
                },
                delay: 2000
              }
            }
        }, function(error) {
          $scope.totast.mainBody = {                                      // 通知提示语定义
            status: 'error',
            description: `创建失败! 请稍后再试. 错误内容:${error}`,
            delay: 2000
          }
        })
      } else {
        $("#addNewPatiModal").modal("hide");
      }
    }, 800)
    
    

    /**
     * 管理单个用户
     */
    $scope.patiManage = function(row) {
      sessionStorage.setItem('currPati', JSON.stringify(row))
      location.href = `#/patiManage/1/1/${row.pid}`;
    };

    
    // 初始化
    ;(function init() {
      sessionStorage.clear()                                                  // 清除所有 sessionStorage

      APIService.getGroup().then(function(msg) {
        $scope.filterAbout.groupOrgData = msg.data;                           // 获取护理组下拉框数据
        $scope.filterAbout.patiGroup = $scope.filterAbout.groupOrgData[0]     // 默认选中护理组第一项数据
      }).then(function() {
        $scope.updatePage(SYS.DEFAULT_PAGE_NUMBER)                            // 初始化列表数据
      })
    })();
  }
]);
