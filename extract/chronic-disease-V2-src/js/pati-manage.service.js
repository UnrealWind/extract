angular.module('infi-basic')
.service('PatiManageService',[
  "$q",
  "Utils",
  "graphConfig",
  function($q, Utils, graphConfig){
    /**
     * 寻找当前 testType 匹配的图表类型
     */ 
    var graphTypeMap = function(testType) {
      var type = null
      
      var typeSet = {
        // 基础类型 例： CAT 评分 / GOLD 分级 / BMI / 心率 / 血氧 / 体温
        '1': ['36', '44', '3', '10', '9', '14'],
        // 纵轴为 category 类型 例： 呼吸困难指数(mmRc)
        '2': ['35'],
        // 血压单独类型
        '3': ['1'],
        // fev1 三兄弟
        '4': ['fev1', 'pef', 'fvc']
      }

      angular.forEach(typeSet, (val, key) => {
        if(val.indexOf(testType) >= 0) type = key
      })

      return type
    }
    
    

    /**
     * 加工原始数据的方法集
     */
    var fixOrgDataMeths = {
      // 基础类型 例： CAT 评分
      '1': (org) => {
        var fixedData = {
          'xAxisData': [],
          'seriesData': [],
          'series0Name': org[0].label
        }

        org.forEach((ele) => {
          fixedData.xAxisData.push(ele.name)
          fixedData.seriesData.push(ele.value)
        })

        return fixedData
      },
      // 纵轴为 category 类型 例： 呼吸困难指数(mmRc)
      '2': (org) => {
        var fixedData = {
          'xAxisData': [],
          'yAxisData': [],
          'seriesName': null,
          'seriesData': [],
          'markLineData': []
        }


        org.forEach((ele) => {
          fixedData.xAxisData.push(ele.name)
          fixedData.yAxisData.push(ele.value)
          fixedData.seriesName = ele.label
          fixedData.seriesData.push([
            ele.name,
            ele.value
          ])
          fixedData.markLineData.push({
            'yAxis': ele.value
          })
        })

        return fixedData
      },
      // 血压单独类型
      '3': (org) => {
        // 高压 series
        var seriesHighVal = []
        // 低压
        var seriesLowVal = []

        org.forEach((ele) => {
          seriesHighVal.push([
            ele.time,
            ele.highValue
          ])

          seriesLowVal.push([
            ele.time,
            ele.lowValue
          ])
        })

        return {
          'seriesHighVal': seriesHighVal,
          'seriesLowVal': seriesLowVal
        }
      },
      // fev1 三兄弟
      '4': (org) => {
        return org
      }
    }

    /**
     * 将加工过后的配置数据与模板配置相结合
     */
    var setConfigMeths = {
      // 基础类型 例： CAT 评分
      '1': (fixedData) => {
        graphConfig['1'].xAxis.data = fixedData.xAxisData
        graphConfig['1'].series[0].data = fixedData.seriesData
        graphConfig['1'].series[0].name = fixedData.series0Name

        return graphConfig['1']
      },
      // 纵轴为 category 类型 例： 呼吸困难指数(mmRc)
      '2': (fixedData) => {
        graphConfig['2'].xAxis.data = fixedData.xAxisData
        graphConfig['2'].yAxis.data = fixedData.yAxisData
        graphConfig['2'].series.name = fixedData.seriesName
        graphConfig['2'].series.data = fixedData.seriesData
        graphConfig['2'].series.markLine.data = fixedData.markLineData

        return graphConfig['2']
      },
      // 血压单独类型
      '3': (fixedData) => {
        graphConfig['3'].legend.data = ['舒张压', '收缩压']
        graphConfig['3'].series[0].data = fixedData.seriesHighVal
        graphConfig['3'].series[1].data = fixedData.seriesLowVal

        console.log(graphConfig['3'])

        return graphConfig['3']
      },
      // fev1三兄弟
      '4': (fixedData) => {
        graphConfig['4'].legend.data = ['上午', '下午']
        graphConfig['4'].series[0].data = fixedData.morning
        graphConfig['4'].series[1].data = fixedData.noon

        console.log(graphConfig['4'])

        return graphConfig['4']
      },
    }

    
    /**
     * 
     *  @param testType 指标类型
     *         org 转化前的数据
     */
    var adeptData = function(testType, org) {
      // 因为 BMI / 心率 / 血氧 / 体温 图表类型属于类型 1，但是原始数据字段无法满足类型 1 预处理图表配置数据的代码（fixOrgDataMeths）
      // 所以特写如下适配器先将数据适配一下后再进入 fixOrgDataMeths 操作
      var rules = {
        // BMI
        '3': {
          'bmi': 'value',
          'time': 'name'
        },
        // 心率
        '10': {
          'heartRate': 'value',
          'time': 'name'
        },
        // 血氧
        '9': {
          'spoValue': 'value',
          'time': 'name'
        },  
        // 体温
        '14': {
          'bodyTemperature': 'value',
          'time': 'name'
        },
        // mmRc
        '35': {
        },
        // COPD
        '36': {
        },
        // GOLD
        '44': {
        },
      }

      if(rules.hasOwnProperty(testType)) {
        org.forEach((ele) => {
          angular.forEach(rules[testType] ,(val, key) => {
            ele[val] = ele[key]
            delete ele[key]
          })
        })

        return org
      }


      // fev1 / pef / fvc 原始数据适配
      var fevRules = ['fev1', 'fvc', 'pef']
      
      if(fevRules.indexOf(testType) >= 0) {
        // 修复好的数据
        var fixedData = {
          morning: [],
          noon: []
        }

        // 提取出来原始的上下午时间
        var orgMorning = []
        var orgNoon = []

        if(fevRules.indexOf(testType) >= 0) {
          org.forEach((ele) => {
            if(ele.hasOwnProperty('mdata')) {
              orgMorning = ele
              delete ele['mdata']
            } 
            else if(ele.hasOwnProperty('adata')) {
              orgNoon = ele
              delete ele['adata']
            }
          })

          // 构建加工后的上午数据
          angular.forEach(orgMorning, (val, key) => {
            fixedData.morning.push( [key, val] )
          })

          // 构建加工后的下午数据
          angular.forEach(orgNoon, (val, key) => {
            fixedData.noon.push( [key, val] )
          })

          return fixedData
        }
      }

      // 如果上述两种类型都不属于，则返回原始数据
      return org
    }
    

    /**
     * 根据 testType 匹配处理原始数据的方法
     */
    this.matchGraphType = function(option, org) {
      if(org.length > 0) {
        var testType = option.testType
        // 适配原始数据
        org = adeptData(testType, org)

        var fixedData = fixOrgDataMeths[graphTypeMap(testType)](org)
        var graphConfig = setConfigMeths[graphTypeMap(testType)](fixedData)
        
        return graphConfig
      }
    }

}]);    
    
    
    
    