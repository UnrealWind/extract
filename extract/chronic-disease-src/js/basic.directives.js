angular
  .module("infi-basic")
  .directive("toastPop", [
    "$timeout",
    function($timeout) {
      // totast 提示框
      return {
        restrict: "ECMA",
        templateUrl: "js/html/toastPop.html",
        replace: true,
        scope: {
          totast: "="
        },
        link: function(scope) {
          var timeDelay = scope.totast.delay || 4000;

          var _delay = $timeout(function() {
            $timeout.cancel(_delay);
            if (scope.totast.callback) scope.totast.callback();
            scope.totast = null;
          }, timeDelay);
        }
      };
    }
  ])
  .directive("existedPati", [
    function() {
      // 已存在患者
      return {
        restrict: "ECMA",
        templateUrl: "js/html/existed_addNew.html",
        replace: true,
        scope: {
          group: "=",
          createInfo: "="
        },
        link: function(scope) {
          scope.info = [
            { label: "姓名", modal: "name", colspan: 4 },
            { label: "性别", modal: "sex", colspan: 4 },
            { label: "年龄", modal: "age", colspan: 4 },
            { label: "身份证号", modal: "idCard", colspan: 8 },
            { label: "身高", modal: "height", colspan: 4 },
            { label: "体重", modal: "weight", colspan: 4 },
            { label: "BMI", modal: "bmi", colspan: 4 },
            { label: "婚姻", modal: "marrage", colspan: 4 },
            { label: "文化程度", modal: "education", colspan: 4 },
            { label: "职业", modal: "job", colspan: 4 },
            { label: "支付方式", modal: "charType", colspan: 4 },
            { label: "家庭人均收入", modal: "income", colspan: 4 },
            { label: "居住情况", modal: "liveSituation", colspan: 4 },
            { label: "居住地", modal: "address", colspan: 4 },
            { label: "是否吸烟", modal: "smokeSituation", colspan: 8 },
            {
              label: "从事过接触粉尘/烟煤的职业",
              modal: "dustAndSoot",
              colspan: 12
            },
            { label: "合并其他疾病", modal: "otherDisease", colspan: 12 }
          ];
        }
      };
    }
  ])
  .directive("brandNewPati", [
    function() {
      // 全新的患者
      return {
        restrict: "ECMA",
        templateUrl: "js/html/brand_addNew.html",
        replace: true,
        scope: {
          group: "=",
          createInfo: "="
        },
        link: function(scope) {
          scope.createInfo.groupId = scope.group.patiGroup.id  // 默认选中 列表筛选条件里的护理组
          scope.info = [
            {
              type: "input",
              label: "姓名",
              model: 'name'
            },
            {
              type: "radio",
              label: "性别",
              opts: [{ label: "男", value: '男' }, { label: "女", value: '女' }],
              model: 'sex'
            },
            {
              type: "input",
              label: "身份证号",
              model: 'idCard'
            }
          ];
        }
      };
    }
  ])
  .directive("basicInfo", [
    function() {  // 基本信息
      return {
        restrict: "ECMA",
        templateUrl: "js/html/scaleTpl/basicInfo.html",
        replace: true,
        scope: {},
        link: function(scope) {
          scope.tmpData = [
            { type: "text", label: "姓名", model: null, hasUnit: false },
            { type: "text", label: "电话", model: null, hasUnit: false },
            {
              type: "radio", 
              label: "性别", 
              options: [
                {
                  label: '男',
                  value: '0'
                },
                {
                  label: '女',
                  value: '1'
                }
              ], 
              model: null,
              hasUnit: false
            },
            { type: "number", label: "年龄", model: null, hasUnit: true, unit: '岁' },
            {
              type: "radio", 
              label: "民族",
              options: [
                {
                  label: '汉族',
                  value: '0'
                },
                {
                  label: '其他',
                  value: '1'
                }
              ],
              model: null, 
              hasUnit: false 
            },
            {
              type: "radio", 
              label: "文化程度",
              options: [
                {
                  label: '大学本、专科或以上',
                  value: '0'
                },
                {
                  label: '高中(包括中专)',
                  value: '1'
                },
                {
                  label: '初中',
                  value: '2'
                },
                {
                  label: '小学',
                  value: '3'
                },
                {
                  label: '文盲',
                  value: '4'
                },
                {
                  label: '不详',
                  value: '5'
                }
              ],
              model: null, 
              hasUnit: false 
            },
            {
              type: "radio", 
              label: "医保类型",
              options: [
                {
                  label: '城镇职工医保',
                  value: '0'
                },
                {
                  label: '商业保险',
                  value: '1'
                },
                {
                  label: '公费医疗',
                  value: '2'
                },
                {
                  label: '自费',
                  value: '3'
                },
                {
                  label: '不详',
                  value: '4'
                }
              ],
              model: null, 
              hasUnit: false 
            }
          ];
        }
      };
    }
  ])
  .directive("episodeInfo", [
    function() {  // 发作情况
      return {
        restrict: "ECMA",
        templateUrl: "js/html/scaleTpl/episode.html",
        replace: true,
        scope: {},
        link: function(scope) {
          scope.data = [
            {
              label:'危急加重',
              children: [
                {
                  type: 'number',
                  label: '过去一年中因慢阻肺急性加重住院次数'
                },
                {
                  type: 'number',
                  label: '过去一年中因慢阻肺急性加重急诊或门诊就诊次数'
                }
              ]
            },
            {
              label:'治疗方面',
              children: [
                {
                  type: 'textarea',
                  label: '戒烟治疗'
                },
                {
                  type: 'textarea',
                  label: '药物治疗'
                }
              ]
            }
          ]
        }
      };
    }
  ])
  .directive("lungsFunc", [
    function() {  // 肺功能检查
      return {
        restrict: "ECMA",
        templateUrl: "js/html/scaleTpl/lungsFunc.html",
        replace: true,
        scope: {},
        link: function(scope) {
          

        }
      };
    }
  ])
  .directive("breathHard", [
    function() {  // 呼吸困难指数
      return {
        restrict: "ECMA",
        templateUrl: "js/html/scaleTpl/breath.html",
        replace: true,
        scope: {},
        link: function(scope) {
          scope.tmpData = [
            {
              label: "mMRC 评估呼吸困难严重程度",
              type: 'radio',
              name: "mMRC-evaluation",
              options: [
                {label: "我仅在费力运动时出现呼吸困难", value: 0},
                {label: "我平地快步行走或步行爬小坡时出现气短", value: 1},
                {label: "我由于气短,平地行走时比同龄人慢或者需要停下来休息", value: 2},
                {label: "我在平地行走 100 米左右或数分钟后需要停下来喘气", value: 3},
                {label: "我因严重呼吸困难以至于不能离开家,或在衣服、脱衣服时出现呼吸困难", value: 4}
              ]
            }
          ]

        }
      };
    }
  ])
  .directive("lifeEvaluate", [
    function() {  // 生活质量自我评估
      return {
        restrict: "ECMA",
        templateUrl: "js/html/scaleTpl/lifeEvaluate.html",
        replace: true,
        scope: {},
        link: function(scope) {

        }
      };
    }
  ])
  .directive("walkTest", [
    function() {  // 六分钟步行实验
      return {
        restrict: "ECMA",
        templateUrl: "js/html/scaleTpl/walkTest.html",
        replace: true,
        scope: {},
        link: function(scope) {
          
        }
      };
    }
  ])
  .directive("nervousVol", [
    function() {  // 焦虑抑郁量表
      return {
        restrict: "ECMA",
        templateUrl: "js/html/scaleTpl/nervousVol.html",
        replace: true,
        scope: {},
        link: function(scope) {
          
        }
      };
    }
  ])
  .directive("sanGeorge", [
    function() {  // 圣乔治
      return {
        restrict: "ECMA",
        templateUrl: "js/html/scaleTpl/sanGeorge.html",
        replace: true,
        scope: {},
        link: function(scope) {
          
        }
      };
    }
  ])
  .directive("unitViewSecRight", [
    function() {  // 圣乔治
      return {
        restrict: "ECMA",
        templateUrl: "js/html/unitViewSecRight.html",
        replace: true,
        scope: {},
        link: function(scope) {
            scope.data = [
              {
                label: "2018年",
                children: [
                  {
                    label: "随诊三, 2018年9月17"
                  },
                  {
                    label: "随诊二, 2018年9月17"
                  },
                  {
                    label: "首次随诊, 2018年9月17"
                  },
                ]
              },
              {
                label: "2017年",
                children: [
                  {
                    label: "随诊三, 2018年9月17"
                  },
                  {
                    label: "随诊二, 2018年9月17"
                  },
                  {
                    label: "首次随诊, 2018年9月17"
                  },
                ]
              }
            ]
        }
      };
    }
  ])
  .directive("unitViewSecLeftChart", [
    "Utils",
    function(Utils) { 
      return {
        restrict: "ECMA",
        replace: true,
        scope: {
          opts: "=",
          ele: "="
        },
        link: function(scope) {
          Utils.chartFactory(scope.ele, scope.opts)
        }
      };
    }
  ])
  .directive("univiewNav", [
    "$anchorScroll",
    function($anchorScroll) {  // 统一视图左侧导航
      return {
        restrict: "ECMA",
        templateUrl: "js/html/univiewNav.html",
        replace: false,
        scope: {
          target : '=',
          parent: '=',
          targetTemplate:'='
        },
        link: function(scope) {
          scope.navData = [
            {
              label: '2018年4月7日慢阻肺护理',
              active: true,
              children: [
                {
                  label: '2018年9月17日 随诊一',
                  active: true,
                  children: [
                    {
                      label: '发作情况',
                      children: []
                    },
                    {
                      label: '肺功能检查',
                      children: []
                    }
                  ]
                }
              ]
            }
          ]


          scope.scrollTo = function(anch) {
            $anchorScroll(anch)
          }
        }
      };
    }
  ])
  .directive("modalInit", [
    function() {
      // 模态框初始化
      return {
        restrict: "ECMA",
        scope: {
          modalId: "=",     // 模态框 id
          addNew: "="       // 模态框填充数据
        },
        link: function(scope) {

        }
      };
    }
  ])
  .directive('iptDate', [
    "Utils",
    function(Utils) {
    // 时间选择
    return {
      restrict: 'ECMA',
      link:function (scope, element) {
        $(element).daterangepicker({
          "startDate": Utils.formatDate(new Date().setFullYear(new Date().getFullYear() ), 'yyyy-MM-dd'),
          "singleDatePicker": true,
          "autoApply": true,
          "locale": {
              "format": "YYYY-MM-DD",
              "applyLabel": "应用",
              "cancelLabel": "取消",
          }
        }, function(start, end, label) {});
  
        $(element).on('apply.daterangepicker', function(ev, picker) {
          scope.newInterAbout[scope.item.modal] = picker.startDate.format('YYYY-MM-DD')
          scope.$apply();
        });
      }
    }
  }])
  