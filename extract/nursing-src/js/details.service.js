angular.module('infi-basic').service('DetailsService', ['$http', 'SYS', function ($http, SYS) {
    var that = this;
    /**
     * 获取基本信息
     * @param patientId
     * @returns {*}
     */
    that.getBasic = function(patientId){
        return $http.get(SYS.url + 'patient/info/'+patientId).then(function success(msg){
            return msg.data;
        })
    };

    /**
     * 获取时间轴数据(评估数据)
     * @param filter
     * @returns {*}
     */
    that.getPreLines = function(filter){
        // filter.createTime !=undefined?params.push("filter_createTime="+filter.createTime):'';
        return $http.get(SYS.url + 'tube/ableInfo/'+filter.patientId).then(function success(msg){
            return msg.data;
        })
    };
    /**
     * 获取时间轴数据(置管数据)
     * @param filter
     * @returns {*}
     */
    that.getCatheterLines = function(filter){
        // filter.createTime !=undefined?params.push("filter_EQ_createTime="+filter.createTime):'';
        return $http.get(SYS.url + 'tube/tubeRecord/'+filter.patientId).then(function success(msg){
            return msg.data;
        })
    };

    that.filterTimeline = function(arr){
        var data = {
            first:null,
            second:null
        };
        var array = [];
        if(arr.first.status == SYS.STATUS_SUCCESS){
            data.first = that.filterPreline(arr.first.data);
        }
        if(arr.second.status == SYS.STATUS_SUCCESS){
            data.second = that.filterCatheterline(arr.second.data);
        }
        if(arr.first.status == SYS.STATUS_SUCCESS && arr.second.status == SYS.STATUS_SUCCESS){
            array = data.first.concat(data.second);
        }else if(arr.first.status == SYS.STATUS_SUCCESS && arr.second.status != SYS.STATUS_SUCCESS){
            array = data.first;
        }else if(arr.first.status != SYS.STATUS_SUCCESS && arr.second.status == SYS.STATUS_SUCCESS){
            array = data.second;
        }else {
            array = [];
        }
        return array;
    };

    that.filterPreline = function(list){
        var idx, length = list.length,
            old, entity,
            result = [];

        for (idx = 0; idx < length; idx++) {
            old = list[idx];
            var entity = old;
            entity.time = old.feasibilityTime;

            //获取时间用于匹配控件
            entity.date = new Date(entity.time);
            entity.year = entity.date.getFullYear();
            entity.month = entity.date.getMonth() + 1;
            entity.day = entity.date.getDate();

            //加一个类型,用于区分是置管还是评估
            entity.type = "pre";
            //加一个描述
            if(entity.visitId){
                entity.details = [];
                entity.details.push("患者第"+entity.visitId+"次入院");
            }
            //时间轴显示的标题
            entity.title = "置管可行性评估";
            entity.btns = {
                label:"开始置管"
            };
            entity.btns2 = {
                label:"删除"
            };
            //拼接url
            entity.url = '#/pre-details/pre/details/' + entity.patientId + "/" +entity.id;

            result.push(entity);
        }
        return result;
    };

    that.filterCatheterline = function(list){
        var idx, length = list.length,
            old, entity,
            result = [];

        for (idx = 0; idx < length; idx++) {
            old = list[idx];
            var entity = old;
            entity.time = old.tubeTime;

            //获取时间用于匹配控件
            entity.date = new Date(entity.time);
            entity.year = entity.date.getFullYear();
            entity.month = entity.date.getMonth() + 1;
            entity.day = entity.date.getDate();

            //加一个类型,用于区分是置管还是评估
            entity.type = "catheter";
            //加一个描述
            if(entity.visitId){
                entity.details = [];
                entity.details.push("患者第"+entity.visitId+"次入院");
            }
            //时间轴显示的标题
            entity.title = "第"+(length - idx)+"次"+entity.tubetype+"置管情况";
            //拼接url
            entity.url = '#/catheter-details/' + entity.patientId + "/" +entity.id;
            entity.btns2 = {
                label:"删除"
            };

            result.push(entity);
        }
        return result;
    };

    that.saveDischarge = function(list){
        return $http.put(SYS.url + 'patient/update',list).then(function(msg){
            return msg.data;
        })
    };

    /**
     * 确认删除
     * @param data
     * @returns {*}
     */
    that.confirmDelete = function(data){
        var url = '';
        data.type == 'catheter'?url = 'tube/delete?':url = 'assessment/delete?';
        return $http.get(SYS.url + url + "id=" + data.uniqueId).then(function(msg){
            return msg.data;
        })
    }
}]);