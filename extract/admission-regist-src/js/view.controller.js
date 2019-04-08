angular.module('infi-basic')
.controller('ViewController', ['$scope', '$rootScope', 'Utils', 'ViewService', 'SYS', function ($scope, $rootScope, Utils, ViewService, SYS) {
  // 概览
  $scope.columns = {
    filed: ['admission_date_time', 'pati_id', 'pati_visit_id', 'name', 'sex_name', 'dept_icu_name', 'pati_source', 'admission_flag','discharge_flag' ],
    label: ['入院时间/录入时间', 'ID 号', '入院次数', '患者姓名', '性别', '病区', '患者来源', '入院登记', '出院登记']
  } 



  // 概览过滤条件
  $scope.filteProfile = {
    patName: '',
    patiId: '',
    patiDisease: '',
    patiWard: ''
  };

  // add new applyForm
  $scope.newApplyFormData = {
      showForm: false,
      wards: null,
      formData: {
          patiId: null,
          deptIcuName: null,
          deptIcuId: null,
          patiVisitId: null, //入院次数
          name: null,
          sex: null,
          createTime: null,
          xlPatientId: null,
          xlMedicalId: null,
          patiSource: null,     // 患者来源
          deptSource: null   // 来源科室
      }
    };
    /**
     * 新建申请单点击事件
     */
    $scope.addNewApplyForm = function() {
        // 面板展开/收起
        $scope.newApplyFormData.showForm = !$scope.newApplyFormData.showForm;
    }
  /**
   * 获取概览数据
   * @param {*} param {当前页数: filter_pageNo; 单页显示数量: filter_pageSize; 患者 ID : filter_patId; 患者姓名: filter_name}
   */
  $scope.updatePage = Utils.debounce(function(page) {
    var _param = {
      page_number: page,
      page_size: SYS.DEFAULT_PAGE_SIZE,
      filter__patiId: $scope.filteProfile.patiId,
      filter__name: $scope.filteProfile.patName,
      filter__disease: $scope.filteProfile.patiDisease,
      filter__wardId: $scope.filteProfile.patiWard
    }

    $scope.loading = 'pending'
    $scope.content = null

    ViewService.updatePage(_param).then(function(msg) {
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
  }, 800, false)

  /**
   * 重置筛选
   */
  $scope.resetFilter =function() {
    $scope.filteProfile = {
      patName: '',
      patiId: '',
      patiDisease: '',
      patiWard: ''
    }

    $scope.updatePage(SYS.DEFAULT_PAGE_NUMBER);
  }


  // 登记/已登记编辑
  $scope.editRegist = function(type, action, entity) {
    var param = {
      type: type,
      action: action,
      entity: entity
    }

    sessionStorage.setItem('curRegistVal', JSON.stringify(param))


    switch (type) {
      case 'entry' : 
        location.href = '#/entryRegist'
        break
      case 'exit' : 
        location.href = '#/exitRegist'
        break
    }
  }


  // ------------------------ page sepreator -------------------------- //


  
  // 出入院统计
  $scope.medicalFilter = {
    date: {
      startDate: Utils.formatDate(new Date().setFullYear(new Date().getFullYear() -1 ), 'yyyy-MM-dd'),
      endDate:  Utils.formatDate(new Date(), 'yyyy-MM-dd')
    },
    region: {
      value: null,
      id: null
    }
  }

  // 出入院统计选择病区搜索
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


   // 获取出入院统计结果
   var _getStatistics = function() {
    return ViewService.getStatistics({
      startDate: $scope.medicalFilter.date.startDate,
      endDate: $scope.medicalFilter.date.endDate,
      ward: $scope.wardSearchObj.selected.value
    })
   }

  // 出入院统计选择病区选择
  $scope.selectItem = function(val, event) {
    $scope.wardSearchObj.selected = val
    $scope.wardSearchObj.showWards = false

    // 获取出入院统计结果
    _getStatistics().then(function(msg) {
      $scope.wardSearchObj.filterRst = msg.data

      // 计算每一项的其它人数
      angular.forEach($scope.wardSearchObj.filterRst, function(val, ind) {
        val.otherValue = val.totalValue - val.singleValue
      })

      initPageGraph()
    })
  }


  // 创建图表
  function initPageGraph() {
    var entryGraph = echarts.init(document.getElementById('entryPie'))
    var exitGraph = echarts.init(document.getElementById('exitPie'))
    
    // 入院绘图
    entryGraph.setOption({
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      title: {
        text: $scope.wardSearchObj.filterRst[0].totalValue + '人',
        textStyle: {
          fontSize: fixGraTitFonSiz($scope.wardSearchObj.filterRst[0].totalValue)
        },
        subtext: $scope.wardSearchObj.filterRst[0].itemName,
        subtextStyle: {
          color: '#2f4354',
          fontSize: 16
        },
        left: 'center',
        top: '43%'
      },
      series: [
          {
              name:'入院人数',
              type:'pie',
              radius: ['50%', '60%'],
              avoidLabelOverlap: false,
              data: [
                {value: $scope.wardSearchObj.filterRst[0].singleValue, name: "当前病区"},
                {value: $scope.wardSearchObj.filterRst[0].otherValue, name: "其他病区"}
              ]
          }
      ]
    })

    // 出院绘图
    exitGraph.setOption({
      tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      title: {
        text: $scope.wardSearchObj.filterRst[1].totalValue + '人',
        textStyle: {
          fontSize: fixGraTitFonSiz($scope.wardSearchObj.filterRst[1].totalValue)
        },
        subtext: $scope.wardSearchObj.filterRst[1].itemName,
        subtextStyle: {
          color: '#2f4354',
          fontSize: 16
        },
        left: 'center',
        top: '43%'
      },
      series: [
          {
              name:'出院人数',
              type:'pie',
              radius: ['50%', '60%'],
              avoidLabelOverlap: false,
              data: [
                {value: $scope.wardSearchObj.filterRst[1].singleValue, name: "当前病区"},
                {value: $scope.wardSearchObj.filterRst[1].otherValue, name: "其他病区"}
              ]
          }
      ]
    })
  }

  /**
   * 自适应图表 title 的 font-size
   * @param data 文本数据
   */
  function fixGraTitFonSiz(data) {
    var dataArr = (data +'').split('')

    if(dataArr.length > 8) return 19
    else return 23
  }


  function _init() {
    // 初始化概览数据
    $scope.updatePage(SYS.DEFAULT_PAGE_NUMBER);

    // 本页面日期范围控件初始化
    Utils.dateRangeSelect([
      {
        selector: '#statistics-filter',
        options: {
          "locale": {
            "format": "YYYY-MM-DD",
            "separator": "~",
            "applyLabel": "应用",
            "cancelLabel": "取消",
          },
          "startDate": $scope.medicalFilter.date.startDate,
          "endDate": $scope.medicalFilter.date.endDate
        },
        callback: function(start, end, label) {
          $scope.medicalFilter.date.startDate = start.format('YYYY-MM-DD')
          $scope.medicalFilter.date.endDate = end.format('YYYY-MM-DD')

          // 获取出入院统计结果
          _getStatistics().then(function(msg) {
            $scope.wardSearchObj.filterRst = msg.data

            // 计算每一项的其它人数
            angular.forEach($scope.wardSearchObj.filterRst, function(val, ind) {
              val.otherValue = val.totalValue - val.singleValue
            })

            initPageGraph()
          })
        }
      }
    ])

    // 出入院病区下拉框数据初始化
    ViewService.getwrads().then(function(msg) {
      $scope.wards = msg.data
      return $scope.wards
    }).then(function(msg) {
      msg.unshift({
        label: '全部',
        value: ''
    })

    $scope.wardSearchObj.selected = msg[1]

    // 获取出入院统计结果
    _getStatistics().then(function(msg) {
        $scope.wardSearchObj.filterRst = msg.data

        // 计算每一项的其它人数
        angular.forEach($scope.wardSearchObj.filterRst, function(val, ind) {
          val.otherValue = val.totalValue - val.singleValue
        })

        initPageGraph()
      })
    })
  }

  _init()


}]);