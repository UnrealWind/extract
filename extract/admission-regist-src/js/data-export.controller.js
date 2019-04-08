angular.module('infi-basic')
.controller('DataExportController', ['$scope', 'Utils', '$timeout', 'SYS', 'DataExportService', 'ViewService',function ($scope, Utils, $timeout, SYS, DataExportService, ViewService) {
  // 全局请求状态
  $scope.totast = {
    requstStatus: '',
    text: ''
  }

  // 任务列表
  $scope.columns = {
    filed: ['creator', 'cout', 'creatTime', 'status'],
    label: ['创建人', '数量', '创建时间', '任务状态']
  } 

  // 获取任务列表数据
  $scope.updatePage = Utils.debounce(function(page) {
    var _param = {
      page_number: page,
      page_size: 10
    }

    $scope.loading = 'pending'
    $scope.content = null

    DataExportService.updatePage(_param).then(function(msg) {
      if(msg.status == 'blank') {
        $scope.loading = 'blank'
        return 
      } else { 
        $scope.content = msg
        $scope.loading = 'resolved'
      }
    }, function(error) {
      $scope.content = null
      $scope.loading = 'rejected'
    })
  }, 900, false)
  
  
  

  // 导出筛选字段 (传回后台)
  $scope.exportDateFilter = {
    date: {
      startDate: Utils.formatDate(new Date().setFullYear(new Date().getFullYear() -1 ), 'yyyy-MM-dd'),
      endDate:  Utils.formatDate(new Date(), 'yyyy-MM-dd')
    },
    type: {
      label: 'adm',
      value: "入院记录"
    }
  }

  $scope.exportFilterSelect = {
    items: [
      {
        label: 'adm',
        value: "入院记录"     
      },
      {
        label: 'disc',
        value: "出院记录"        
      }
    ]
  }
  // 入院类型选中
  $scope.exportFilterSelected = $scope.exportFilterSelect.items[0]
  
  

  // 切换入院类型
  $scope.selectItem = function() {
    $scope.exportDateFilter.type = $scope.exportFilterSelected
  }


  // 病区选择搜索
  $scope.wardSearchObj = {
    keyword: '',
    result: [],
    selected: {},
    filterRst: [],
    showWards: false
  }

  // 展开收起病区
  $scope.extendWard = function() {
    $scope.wardSearchObj.showWards = !$scope.wardSearchObj.showWards
  }

  // 病区列表搜索
  $scope.wardSearch = function() {
    $scope.wardSearchObj.result = 
      !!$scope.wardSearchObj.keyword ? Utils.pinyinSearch($scope.wardSearchObj.keyword, $scope.wards, 'label') : $scope.wards
  }

  // 病区选择
  $scope.selectWard = function(val, event) {
    $scope.wardSearchObj.selected = val
    $scope.wardSearchObj.showWards = false
  }



  // 导出数据
  $scope.exportData = function() {
    $scope.totast.requstStatus = "pending"

    var param = {
      "exportDateFilter": $scope.exportDateFilter,
      "wardSearchObj": $scope.wardSearchObj
    }

    DataExportService.exportData(param).then(function(msg) {
      var totastType = {
        "success": function() {
          $scope.totast = {
            requstStatus: "resolved",
            text: "导出成功!"
          }
          var show = null
          $timeout.cancel(show);
          show = $timeout(function() {
            $scope.totast = {
              requstStatus: "",
              text: ""
            }
          }, 1000)
        },
        "failure": function(code) {
          $scope.totast = {
            requstStatus: "rejected",
            text: "导出失败!" + code
          }
    
          var show = null
          $timeout.cancel(show);
          show = $timeout(function() {
            $scope.totast = {
              requstStatus: "",
              text: ""
            }
          }, 2000)
        }
      }


      if (msg.status == 'ok') {

        totastType.success()

        // 刷新列表
        $scope.updatePage(SYS.DEFAULT_PAGE_NUMBER)


      } else {
        totastType.failure('bg-error')
      }
    },function(error) {
      totastType.failure(error.status)
    })
  }



  // 初始化
  function init() {
    // 初始化本页 daterangepicker
    Utils.dateRangeSelect([
      {
        selector: '#exportDate-filter',
        options: {
          "locale": {
            "format": "YYYY-MM-DD",
            "separator": "~",
            "applyLabel": "应用",
            "cancelLabel": "取消",
          },
          "startDate": $scope.exportDateFilter.date.startDate,
          "endDate": $scope.exportDateFilter.date.endDate
        },
        callback: function(start, end, label) {
          $scope.exportDateFilter.date.startDate = start.format('YYYY-MM-DD')
          $scope.exportDateFilter.date.endDate = end.format('YYYY-MM-DD')
        }
      }
    ])



    // 获取 page 数据
    $scope.updatePage(SYS.DEFAULT_PAGE_NUMBER)


    // 出入院病区下拉框数据初始化
    ViewService.getwrads().then(function(msg) {
      if(msg.data.length > 1){
          msg.data.unshift({
              label: '全部',
              value: ''
          })
          $scope.wardSearchObj.selected = msg.data[1];
      }else {
          $scope.wardSearchObj.selected = msg.data[0];
      }
      $scope.wards = msg.data;
      return $scope.wards
    })
  }

  init()
}]);