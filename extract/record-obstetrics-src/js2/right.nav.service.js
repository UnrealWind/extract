
//3个视图页面中的右侧导航栏的service文件

angular.module('infi-basic').service('rightNavService', [function () {

    this.filterByYear = function (list) {
        var listData = list.data;
        var idx, event, current, result = [], listLength = listData.length;
        for (idx = 0; idx < listLength; idx++) {
            event = listData[idx];
            if (event.title.indexOf("住院") != -1) {
                if (current == undefined || current.year != event.year) {
                    current = {
                        id: uuid(),
                        year: event.year,
                        label: event.year + '年',
                        events: [],
                        type: event.type
                    };
                    result.push(current);
                }
                event.id = uuid();
                if (event.title) {
                    event.label = event.title;
                } else {
                    event.label = event.month + '月--' + mappingTypeLabel(event.type);
                }
                current.events.push(event);
            }
        }
        return result;

    };

    this.filterYearDoor = function (list) {
        var listData = list.data;
        var idx, event, current, result = [], listLength = listData.length;
        for (idx = 0; idx < listLength; idx++) {
            event = listData[idx];
            if (event.title.indexOf("门诊") != -1) {
                if (current == undefined || current.year != event.year) {
                    current = {
                        id: uuid(),
                        year: event.year,
                        label: event.year + '年',
                        events: [],
                        type: event.type
                    };
                    result.push(current);
                }
                event.id = uuid();
                if (event.title) {
                    event.label = event.title;
                } else {
                    event.label = event.month + '月--' + mappingTypeLabel(event.type);
                }
                current.events.push(event);
            }
        }
        return result;

    };


    var tIndex = 1;

    function uuid() {
        return 'uuid_' + tIndex++;
    }

    function mappingTypeLabel(value) {
        var mapping = {
            'menzhen': '门诊',
            'zhuyuan': '住院',
            'tijian': '体检'
        };
        return mapping[value] ? mapping[value] : '未知';
    }
}]);