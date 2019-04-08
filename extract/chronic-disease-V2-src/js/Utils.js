angular.module("infi-basic").service("Utils", [
  function() {
    /**
     * 防抖
     */
    this.debounce = function(func, wait, immediate) {
      var timeout, result;

      return function() {
        var context = this;
        var args = arguments;

        if (timeout) clearTimeout(timeout);
        if (immediate) {
          // 如果已经执行过，不再执行
          var callNow = !timeout;
          timeout = setTimeout(function() {
            timeout = null;
          }, wait);
          if (callNow) result = func.apply(context, args);
        } else {
          timeout = setTimeout(function() {
            func.apply(context, args);
          }, wait);
        }
        return result;
      };
    };

    /**
     * 日期格式化
     * @param {*} date
     * @param {*} fmt
     */
    this.formatDate = function(date, fmt) {
      var _date = new Date(date);
      var _fmt = fmt || "yyyy-MM-dd hh:mm:ss";
      var o = {
        "M+": _date.getMonth() + 1, //月份
        "d+": _date.getDate(), //日
        "h+": _date.getHours(), //小时
        "m+": _date.getMinutes(), //分
        "s+": _date.getSeconds() //秒
      };
      if (/(y+)/.test(_fmt)) {
        _fmt = _fmt.replace(
          RegExp.$1,
          (_date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(_fmt)) {
          _fmt = _fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return _fmt;
    };

    /**
     * 拼音搜索
     * @param {*} keyword
     * @param {*} data
     * @param {*} regStr
     */
    this.pinyinSearch = function(keyword, data, regStr) {
      var pinyinEngine = new PinyinEngine(data, [regStr]);
      return pinyinEngine.query(keyword);
    };


    /**
     * 生成图表
     * @param {*} node 
     * @param {*} opts 
     */
    this.chartFactory = function(node, opts) {
        var chartWrapper = document.getElementById(node),
            myChart = echarts.init(chartWrapper)
        myChart.setOption(opts)
    }

    /**
     * 修复因精度丢失导致的四舍五入误差问题
     * @param num 需要操作的数字
     * @param remain 需要保留的小数位数
     */
    this.fixedRound = function(num, remain) {
      var times = Math.pow(10, remain)
      var des = num * times
      des = Math.round(des) / times
      return des + ''
    }


    /**
     * 状态机修改状态
     * @param name 改变当前状态的动作名称
     */
    this.changeState = function() {
      return function (name) {
        var state = this.currState
        if(this.stateMachine[state][name]) {
            this.currState = this.stateMachine[state][name]
        }
  
        console.log(`${state} + ${name} --> ${this.currState}`)
      }
    }

    /**
     * 检测数据类型
     */
    this.typeIs = (function () {
      var class2type = {};

      // 生成class2type映射
      "Boolean Number String Function Array Date RegExp Object Error".split(" ").map(function(item, index) {
          class2type["[object " + item + "]"] = item.toLowerCase();
      })

      return function (obj) {
          // 一箭双雕
          if (obj == null) {
              return obj + "";
          }
          return typeof obj === "object" || typeof obj === "function" ?
              class2type[Object.prototype.toString.call(obj)] || "object" :
              typeof obj;
      }
    })()

    /**
     * 获取调整方案的下拉框维表信息分类
     */
    this.fixOptRange = function(original) {
      var tarObj = {}
  
      angular.forEach(original, (ele, ind) => {
        if (!tarObj[ele.type]) tarObj[ele.type] = []
        tarObj[ele.type].push(ele)
      })
  
      return tarObj
    }


    /**
     * 在数组内寻找指定 key 名对应的属性值等于指定值的对象
     * @param array 要搜索的数组
     * @param key   指定的字段名
     * @param value 字段名对应的值
     * 
     * @returns <obj> isIn 是否存在, obj 找到的对象, ind 对象的索引
     */
    this.findObjectByKey = function(array, key, value) {
      if (array) {
        for (var i = 0; i < array.length; i++) {
          if (array[i][key] === value) {
            return {
              isIn: true,
              obj: array[i],
              ind: i
            };
          }
        }
      }

      return {
        isIn: false
      };
    };
  }
]);
