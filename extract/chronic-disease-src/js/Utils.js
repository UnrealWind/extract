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
  }
]);
