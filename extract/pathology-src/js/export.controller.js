angular.module('infi-basic')
.controller('DataExportController', ['$scope', 'Utils', 'SYS', 'APIService',function ($scope,Utils,SYS, APIService) {
$scope.totast = {
  mainBody: null
}


// 当前角色
if(localStorage.getItem('user')) {
  $scope.currUsr = JSON.parse(localStorage.getItem('user')).companyId
}


// 表格状态
$scope.loading = null

// 按钮状态
$scope.varstatus = {
  exportStatus: 'init'
}


// 导出筛选字段 (传回后台)
$scope.exportDateFilter = {
  date: {
    startDate: Utils.formatDate(new Date().setMonth(new Date().getMonth() -1 ), 'yyyy-MM-dd'),
    endDate:  Utils.formatDate(new Date(), 'yyyy-MM-dd')
  },
  type: {
    label: '申请单',
    value: "1",
  }
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

// 任务列表
$scope.columns = {
  filed: ['creator', 'cout', 'creatTime', 'status'],
  label: ['创建人', '数量', '创建时间', '任务状态']
} 

// 单据类型 options
$scope.exportFilterSelect = {
  items: {
    // 临床
    '30': [
      {
        label: '申请单',
        value: "1",
      },
      { 
        label: '送检单',
        value: "2",
      },
      {
        label: "页面列表",
        value: "5",
      }
    ],
    // 病理
    '27': [
      {
        label: '申请单',
        value: "1",
      },
      { 
        label: '送检单',
        value: "2",
      },
      {
        label: '详细版病理报告',
        value: "3",
      },
      {
        label: "最终生成版病理报告",
        value: "4",
      },
    ]
  }
}

// 单据类型 default selected
$scope.exportFilterSelected = $scope.exportFilterSelect.items[$scope.currUsr][0]

// ----------------------- param define end ----------------------------- //


/**
 * 切换页码
 */
$scope.updatePage = Utils.debounce(function(page) {
  var _param = {
    page_number: page,
    page_size: 10
  }

  $scope.loading = 'pending'
  $scope.content = null

  APIService.exportUpdatePage(_param).then(function(msg) {
    if(msg.status != 'blank') {
      $scope.content = msg
      $scope.loading = 'resolved'
    } else {
      $scope.loading = 'nondata'
    }

  }, function(error) {
    $scope.content = null
    $scope.loading = 'rejected'
  })
}, 900, false)


/**
 *  切换单据类型
 */
$scope.selectItem = function() {
  $scope.exportDateFilter.type = $scope.exportFilterSelected
}  

/**
 * 导出数据
 */
$scope.exportData = function() {
  var param = {
    "exportDateFilter": $scope.exportDateFilter,
    "wardSearchObj": $scope.wardSearchObj
  }

  APIService.exportData(param).then(function(msg){
    if (msg.status == 'ok') {
      $scope.varstatus.exportStatus = 'init',
      $scope.totast.mainBody = {
        status: 'ok',
        description: '导出成功!',
        delay: 2000
      }

    // 刷新 page 数据
    $scope.updatePage(SYS.DEFAULT_PAGE_NUMBER)

    }
  }, function(error) {
    $scope.varstatus.saveStatus = 'init'
    $scope.totast.mainBody = error
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
  APIService.getwrads().then(function(msg) {
    $scope.wards = msg.data
    return $scope.wards
  }).then(function(msg) {

    if(msg.length > 1) {
      msg.unshift({
        label: '全部',
        value: ''
      })

      $scope.wardSearchObj.selected = msg[1]
    } else {
      $scope.wardSearchObj.selected = msg[0]
    }


    
  })
}

init()


}]);




