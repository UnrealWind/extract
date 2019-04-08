angular.module("infi-basic").service("Utils", [
  "$timeout",
  function($timeout) {
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
