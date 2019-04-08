angular.module('infi-basic').service('CatheterDetailsService', ['$http', 'SYS', function ($http, SYS) {
    //获取风险评估表格标题
    this.getRiskContent = function(){
        return $http.get(SYS.jsonUrl+'risk.content.json').then(function success(msg){
            return msg.data;
        })
    };

    /**
     * 获取折线图数据
     * @returns {*}
     */
    this.getCharts = function(tubeInfoId){
        return $http.get(SYS.url + 'risk/riskResult/'+tubeInfoId).then(function (msg) {
            return msg.data;
        })
    };

    /**
     * 获取表格数据
     * @returns {*}
     */
    this.getTable = function(filter){
        var url = SYS.url + 'risk/riskTable/'+filter.tubeInfoId+'?';
        var params = [];
        filter.page!=undefined?params.push("page_number="+filter.page):params.push("page_number="+SYS.DEFAULT_PAGE_NUMBER);
        filter.size!=undefined?params.push("page_size="+filter.size):params.push("page_size="+SYS.DEFAULT_PAGE_SIZE);
        url = url + params.join("&");
        return $http.get(url).then(function (msg) {
            if(msg.data.status == SYS.STATUS_SUCCESS){
                var data = filterContent(msg.data);
                msg.data = data;
            }
            return msg.data;
        })
    };
    function filterContent(list){
        angular.forEach(list.page.content,function(data){
            data.resultLabel = data.riskGrade+"("+data.riskTotalScore+"分)";
        });
        return list;
    }

    /**
     * 获取置管基本信息
     * @param tubeInfoId
     * @returns {*}
     */
    this.getTubeDetails = function(tubeInfoId){
        return $http.get(SYS.url + 'tube/tubeInfo/'+tubeInfoId).then(function(msg){
            return msg.data;
        })
    };

    /**
     * 获取置管详情
     * @param feasibilityId
     * @returns {*}
     */
    this.getPreDetails = function(feasibilityId){
        return $http.get(SYS.url + 'assessment/info/'+feasibilityId).then(function(msg){
            return msg.data;
        })
    };

    /**
     * 获取随访记录详情
     */
    this.getDetails = function(tubeInfoId,url,type){
        return $http.get(SYS.url+url+'/'+tubeInfoId).then(function(msg){
            msg.data.type = type;
            return msg.data;
        });
    }
}]);