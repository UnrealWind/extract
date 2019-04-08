angular.module("infi-basic").controller("PatiManageController", [
  "$scope",
  "APIService",
  "PatiManageService",
  "Utils",
  "SYS",
  "$routeParams",
  function($scope, APIService, PatiManageService, Utils, SYS, $routeParams) {
    // totast
    $scope.totast = {
      mainBody: null
    }

    $scope.tableAbout = {   // 列表相关
      page: null,             // 列表数据
      loading: "pending",     // 表格的加载状态
      jumpPage: null,         // 手动跳页的 ng-model 值
      columns: [              // 列名
        "",
        "计划时间", 
        "执行时间", 
        "执行情况", 
        "操作"
      ],
      contentMap: [           // 单元格数据与源数据映射关系
        "name", 
        "createTime", 
        "executeTime", 
        "status"
      ]
    }
    
    $scope.patiRelateAbout = {                                // 患者相关疾病下拉框
      orgData: null,                                            // 原始数据
      selected: null                                            // 当前选中
    }

    $scope.indexAbout = {                                     // 指标趋势下拉框
      orgData: null,                                            // 原始数据
      selected: null                                            // 当前选中
    }

    $scope.indexGrap = {                                      // 指标趋势绘图区相关标示
      hasData: false                                            // 是否有数据
    }
    
    $scope.newInterAbout = {                                  // 新建随诊相关信息
      name: null,                                               // 随诊姓名
      planTime: Utils.formatDate(new Date().setFullYear(new Date().getFullYear() -1 ), 'yyyy-MM-dd')
                                                                // 计划时间(默认当天)
    }

    // 新建随诊模板信息
    $scope.newInterTpl = [{ label: "随诊名称", type: "text", modal: "name" }, { label: "计划时间", type: "time", modal: "planTime" }];



    /**
     * 增加新随诊
     */
    $scope.addNewInterview = function() {
      $("#newInterview").modal("show");
      $("#newInterview").on("hidden.bs.modal", function(e) {      // 监听模态框收起事件
        $scope.newInterAbout = {                                  // 新建随诊相关信息
          name: null,                                               // 随诊姓名
          planTime: Utils.formatDate(new Date().setFullYear(new Date().getFullYear() ), 'yyyy-MM-dd')
                                                                    // 计划时间(默认当天)
        };
      });
    }

    /**
     * 保存新建随诊信息
     */
    $scope.saveNewInterview = Utils.debounce(function() {
      APIService.saveNewInterview ({
        patiRelateAbout: $scope.patiRelateAbout.selected,
        newInterAbout: $scope.newInterAbout,
      }).then(function(msg) {
        if(msg.status == 'ok') {
          $scope.totast.mainBody = {                                  // 通知提示语定义
            status: 'ok',
            description: '创建成功!',
            callback: function() {
              $("#newInterview").modal("hide")
              $scope.updatePage(SYS.DEFAULT_PAGE_NUMBER)
            },
            delay: 2000
          }
        }
      })
    }, 800)
    
    



    /**
     * 更新列表数据
     * @param {*} num 
     */
    $scope.updatePage = function(num) {
      $scope.tableAbout.loading = "pending"

      APIService.getInterviewList(num, $scope.patiRelateAbout.selected)
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
     * 跳转患者视图
     */
    $scope.patiView = function() {
      location.href = "#/timeline";
    };

    /**
     * 编辑单条随诊记录
     */
    $scope.editSuiZhen = function(row) {
      sessionStorage.setItem('currInterview', JSON.stringify(row)) // 存储当前随诊信息
      location.href = `#/scaleEnter/1/1/${row.pid}/${row.id}`          // 1: diseaseId  1: projectId  pid interviewId
    }


    $scope.changeTrendInd = function(val) {
      APIService.getIndex({                                           // 获取指标趋势绘图数据
        pid: $routeParams.pid,
        val: val
      }).then(function(data) {
        if(data.status == 'blank') {
          $scope.indexGrap.hasData = false
        } else if (data.status == 'ok') {
          $scope.indexGrap.hasData = true

          var graphTypeMap = {
            '82': 'specyAxisLine',  // GOLD
            '48': 'specyAxisLine',  // 呼吸困难mMRC
            '49': 'normalLine',     // COPD CAT 评分表
            '72': 'normalLine',     // 焦虑筛查问卷(GAD-7)
            '78': 'normalLine',     // 抑郁
            '79': 'normalLine',     // 慢病自我管理
            '80': 'normalLine',     // 慢阻肺
            '81': 'normalLine',     // 圣乔恩
          }

          var fixedData = null

          switch(graphTypeMap[val]) {
            case 'specyAxisLine':
              fixedData = PatiManageService.fixSpecyAxisLineData(data.data)
              setTimeout(function() {
                Utils.chartFactory('trend', {
                  tooltip: {
                    trigger: 'axis',
                  },
                  xAxis: {
                    type: 'category',
                    data: fixedData.xAxis
                  },
                  yAxis: {
                    type: 'category',
                    data: fixedData.yAxis
                  },
                  series: {
                    name: $scope.indexAbout.selected.label,
                    type: "line",
                    data: fixedData.seriesData,
                    markLine: {
                      data: fixedData.markLine.data
                    }
                  }
                })
              })
              break
            case 'normalLine':
              fixedData = PatiManageService.fixGraphData(data.data)

              setTimeout(function() {
                Utils.chartFactory('trend', {
                  tooltip: {
                    trigger: "axis"
                  },
                  xAxis: {
                    data: fixedData.xAxis
                  },
                  yAxis: {
                    splitLine: {
                      show: false
                    }
                  },
                  series: {
                    name: $scope.indexAbout.selected.label,
                    type: "line",
                    data: fixedData.seriesData,
                  }
                })
              })
              break
          }




          // var fixedData = PatiManageService.fixGraphData(data.data)

          // setTimeout(function() {
          //   Utils.chartFactory("trend", {
          //     tooltip: {
          //       trigger: "axis"
          //     },
          //     xAxis: {
          //       data: fixedData.xAxis
          //     },
          //     yAxis: {
          //       splitLine: {
          //         show: false
          //       }
          //     },
          //     series: {
          //       name: $scope.indexAbout.selected.label,
          //       type: "line",
          //       data: fixedData.seriesData,
          //     }
          //   });
          // }, 0)
        }
      })
    }









    ;(function init () {
      $scope.currPati = JSON.parse(sessionStorage.getItem('currPati'))     // 缓存当前操作的用户信息

      APIService.patiRelateDisease($routeParams.pid)
        .then(function(msg) {
          $scope.patiRelateAbout = {                                    // 患者相关疾病下拉框
            orgData: msg.data,                                            // 原始数据
            selected: msg.data[0]                                         // 当前选中
          }
        })
        .then(function() {
          $scope.updatePage(SYS.DEFAULT_PAGE_NUMBER) //  初始化列表数据
        })

        

      APIService.getIndexs($routeParams.pid).then(function(msg) {        // 获取指标趋势下拉框原始数据
        $scope.indexAbout = {
          orgData: msg.data,                                              // 原始数据
          selected: msg.data[0]                                           // 当前选中
        }

        return $scope.indexAbout.selected.value
      }).then(function(indVal) {
        $scope.changeTrendInd(indVal)
      })

      sessionStorage.removeItem('savedScales')                          // 清除量表页缓存的量表数据
      
    })();
  }
]);
