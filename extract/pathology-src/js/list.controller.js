angular.module('infi-basic')
.controller('ListController', ['$scope', 'APIService', 'SYS', 'Utils', 'Session', '$interval' , function ($scope, APIService, SYS, Utils, Session, $interval) {
  // totast
  $scope.totast = {
    mainBody: null
  }
  
  // tabel about
  $scope.tableAbout = {
    columns: ['ID 号', '入院次数', '患者姓名', '性别', '病区', '送检医师', '申请时间', '申请单', '送检单', '病理报告'],
    page: null,
    contentMap: ['patiId', 'patiVisitId', 'name', 'sex', 'ward', 'sendDoctor', 'applicationDate', 'applicationFormStatus', 'sendFormStatus', 'pathologyReportStatus'],
    loading: 'pending',
    optsCellInd: [7, 8, 9],
    jumpPage: null
  }

  $scope.tableSearch = {
    filter_patiId: '',
    filter_patiName: '',
    filter_pathological: '',
    filter_clinical: ''
  }

  // add new applyForm
  $scope.newApplyFormData = {
    showForm: false,
    wards: null,
    formData: {
      patiId: null,
      patiWard: null,
      visitId: null,
      patiName: null,
      patGender: null
    }
  }

  // -------------- param define end -----------------//

  /**
   * 翻页
   * @param {*} number 
   */
  $scope.updatePage = Utils.debounce(function(number) {
    $scope.tableAbout.loading = 'pending'
    APIService.getList(number, SYS.DEFAULT_PAGE_SIZE, $scope.tableSearch).then(function(msg) {
      if(msg.status != "blank") {
        $scope.tableAbout.loading = 'resolved'  // 更改 loading 状态
        $scope.tableAbout.page = msg.page // 存储表格数据
      } else if(msg.status == 'blank') {
        $scope.tableAbout.loading = 'nondata'
        $scope.tableAbout.page = null
      }
      else {
        $scope.totast = {
          mainBody: {
            status: "error",
            description: msg.description
          }
        }
      }
    }, function(error) {
      $scope.tableAbout.loading = 'rejected'
      $scope.tableAbout.page = {
        content: null,
        error: error
      }
    })
  }, 800, false)

  /**
   * 重置筛选
   */
  $scope.resetFilter = function() {
    $scope.tableSearch = {
      filter_patiId: '',
      filter_patiName: '',
      filter_pathological: '',
      filter_clinical: ''
    }

    // 初始化列表数据
    APIService.getList(SYS.DEFAULT_PAGE_NUMBER, SYS.DEFAULT_PAGE_SIZE, $scope.tableSearch).then(function(msg) {
      $scope.tableAbout.loading = 'resolved'  // 更改 loading 状态
      $scope.tableAbout.page = msg.page // 存储表格数据
    }, function(error) {
      $scope.tableAbout.loading = 'rejected'
      $scope.tableAbout.page = {
        content: null,
        error: error
      }
    })
  }


  /**
   * 新建申请单点击事件
   */
  $scope.addNewApplyForm = function() {
    // 面板展开/收起
    $scope.newApplyFormData.showForm = !$scope.newApplyFormData.showForm

    // 获取及缓存数据
    if(!sessionStorage.getItem('allWards')) {
      APIService.getWards().then(function(msg) {
        sessionStorage.setItem('allWards', JSON.stringify(msg.data))
        $scope.newApplyFormData.wards = msg.data
      }, function(error) {
        $scope.totast.mainBody = error
      })
    } else {
      $scope.newApplyFormData.wards = JSON.parse(sessionStorage.getItem('allWards'))
    }
  }





  ;(function init () {
    // 初始化列表数据
    APIService.getList(SYS.DEFAULT_PAGE_NUMBER, SYS.DEFAULT_PAGE_SIZE, $scope.tableSearch).then(function(msg) {
      if(msg.status == 'blank') {
        $scope.tableAbout.loading = 'nondata'
        $scope.tableAbout.page = null
      } else {
        $scope.tableAbout.loading = 'resolved'  // 更改 loading 状态
        $scope.tableAbout.page = msg.page // 存储表格数据
      }
      
    }, function(error) {
      $scope.tableAbout.loading = 'rejected'
      $scope.tableAbout.page = {
        content: null,
        error: error
      }
    })

    // 获取角色
    if(Session.getUser()) {
      $scope.currUsr = Session.getUser()
      $scope.currUsrRole = $scope.currUsr.companyId
    }

    // 获取用户角色信息
    APIService.getEnName().then(function(data) {
      $scope.currUsr['enname'] = data.data.enname
    })

    


    $('#newApplyFormWrapper').collapse('toggle') // 新建申请单 collapse 初始化

    sessionStorage.setItem('currOpt', null)
    sessionStorage.setItem('genedReport', null)

    // 10 分钟定时刷新页面
    var pageRefresh = $interval(function() {
      // 刷新列表数据
      APIService.getList(SYS.DEFAULT_PAGE_NUMBER, SYS.DEFAULT_PAGE_SIZE, $scope.tableSearch).then(function(msg) {
        $scope.tableAbout.loading = 'resolved'  // 更改 loading 状态
        $scope.tableAbout.page = msg.page // 存储表格数据
      }, function(error) {
        $scope.tableAbout.loading = 'rejected'
        $scope.tableAbout.page = {
          content: null,
          error: error
        }
      })
    }, 3600*8)
    


    // controller 销毁时需要重置的一些东西
    $scope.$on('$destroy', function() {
      $interval.cancel(pageRefresh)
    })



  })()
}]);