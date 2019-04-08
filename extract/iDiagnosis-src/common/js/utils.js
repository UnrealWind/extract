angular.module('infi-basic').service('Utils', ['$timeout', function ($timeout) {
    function sysTip($scope, tip, callback) {
        $scope.sysTip = angular.copy(tip);
        var show;
        $timeout.cancel(show);
        show = $timeout(function () {
            if ($scope.sysTip) {
                $scope.sysTip.status = undefined;
                callback ? callback() : undefined
            }
        }, 1200);
    }

    function sysTipBefore($scope, description) {
        sysTip($scope, {
            status: SYS.STATUS_QUERYING,
            description: description
        });
    }


    // 判断对象是否为空
    function isEmptyObj(obj) {
        return JSON.stringify(obj) == '{}' ? true : false
    }


    /**
     * 匹配对象属性或者数组元素并删除
     * @param {*} str < string > 需要匹配的关键字
     * @param {*} obj < object | array > 目标匹配对象或数组
     */
    function deleteEntity(str, obj) {
        var reg = new RegExp('^' + str, 'i'),
            objType = type(obj)

        switch (objType) {
            case 'object':
                angular.forEach(obj, function (value, key) {
                    if (reg.test(key)) {
                        delete obj[key]
                    }
                })
                break
            case 'array':
                angular.forEach(obj, function (value, index) {
                    if (reg.test(value)) {
                        obj.splice(index, 1)
                    }
                })
        }
    }

    /**
   * 防抖
   */
    function debounce(func, wait, immediate) {

        var timeout, result;

        return function () {
            var context = this;
            var args = arguments;

            if (timeout) clearTimeout(timeout);
            if (immediate) {
                // 如果已经执行过，不再执行
                var callNow = !timeout;
                timeout = setTimeout(function () {
                    timeout = null;
                }, wait)
                if (callNow) result = func.apply(context, args)
            }
            else {
                timeout = setTimeout(function () {
                    func.apply(context, args)
                }, wait);
            }
            return result;
        }

    }



    /**
     * 类型判断工具函数
     * @param {*} obj 
     */
    function type(obj) {
        var class2type = {};

        // 生成class2type映射
        "Boolean Number String Function Array Date RegExp Object Error".split(" ").map(function (item, index) {
            class2type["[object " + item + "]"] = item.toLowerCase();
        })

        if (obj == null) {
            return obj + "";
        }
        return typeof obj === "object" || typeof obj === "function" ?
            class2type[Object.prototype.toString.call(obj)] || "object" :
            typeof obj;
    }

    /**
     * 元素互换位置
     */
    function eleExchange(eleA, eleB) {
        eleA = [eleB, eleB = eleA][0]
    }



    return {
        sysTip: sysTip,
        sysTipBefore: sysTipBefore,
        type: type,
        isEmptyObj: isEmptyObj,
        deleteEntity: deleteEntity,
        eleExchange: eleExchange,
        debounce: debounce
    }
}]);

angular.module('infi-basic')
    .directive('sysTip', [function () {
        return {
            restrict: 'ECMA',
            replace: true,
            template: '<div ng-if="sysTip.status" ' +
                'ng-class="{\'ok\':\'notice\',\'querying\':\'notice\',\'error\':\'notice_error\',\'black\':\'notice_error\'}[sysTip.status]">' +
                '{{sysTip.description}}</div>'
        }
    }])
