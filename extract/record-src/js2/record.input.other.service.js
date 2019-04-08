angular.module('infi-basic').service('InputRecordOther', [function () {
    // 为了解决龙哥当时 bug 添加其他的service文件

    this.filterOther = function (ele, name, values) {
        var $parent = ele.parent();
        var $input = $('input', $parent);
        if (values != undefined) {
            var todoList = doFilter($input, values, name)
        }

        for (key in todoList) {
            name[key] = true;
        }
        return todoList;

    };


    function doFilter(domList, values, name) {
        var domNames = {},
            todoList = {},
            domName,
            idx, length, defaultValue = [];

        for (idx = 0, length = domList.length; idx < length; idx++) {
            domName = $(domList[idx]).attr('ng-model');
        }
        if (name == 'pregnancy.positionOTHER') {
            defaultValue = ['头位', '臀位', '横位' ,'未查'];
        } else {
            defaultValue = ['无', '不良产科史', '妊娠期糖尿病', '妊娠期高血压疾病', '瘢痕子宫', '妊娠期胆汁淤积综合征', '臀位', '妊娠合并甲状腺疾病',
                '妊娠合并内科疾病', '妊娠合并外科疾病', '多胎妊娠', '软产道异常', '羊水过少', '羊水过多', '先兆流产', '前置胎盘', '胎盘早剥', '过期妊娠',
                '年龄大于35岁', '年龄小于18岁', '骨盆异常', '妊娠期高血压疾病', '瘢痕子宫', '年龄小于18岁'];
        }
        //将中文进行转码
        var idy = 0, defaultLength = defaultValue.length, entity, defaultValueEscap = [];
        for (idy; idy < defaultLength; idy++) {
            entity = defaultValue[idy];
            var wrap = escapeLabel(entity);
            defaultValueEscap.push(wrap);
        }

        for (key in values) {
            if (key != undefined && domNames[name + '.' + key] == undefined && (jQuery.inArray(key, defaultValueEscap)) == -1) {
                delete values[key];
                todoList[key] = true;
            }
        }
        return todoList;
    }

    /**
     * 进行中文转码并处理
     * @param label
     * @returns {*}
     */
    function escapeLabel(label) {
        var value = label;
        value = escape(value);
        value = value.replace(/-/g, '_a_');
        value = value.replace(/\+/g, '_b_');
        value = value.replace(/%/g, '__');
        value = 'name_' + value;
        return value;
    }
}]);
