angular.module("infi-basic").service('DataService',['$http','SYS',function ($http,SYS) {
    /**
     * 普通的get请求
     * @param num  请求的数据库id
     * @param method  请求方式
     * @param date  时间,给监控页面专用
     * @param filter  查询的配置
     * @returns {*}
     */
    function requestData(num,method,date,filter) {
        var urlAll = SYS.url+"unite/resource/single/"+num,
        // var urlAll = SYS.jsonUrl+num+".json",
            params = [];
        if(filter){
            filter.identity != undefined ? params.push("filter__identity="+filter.identity) : undefined;  //身份
            filter.number != undefined ? params.push("filter__numType="+filter.number) : undefined;  //号类
            filter.region != undefined ? params.push("filter__region="+filter.region) : undefined;  //地域
            filter.channel != undefined ? params.push("filter__registWay="+filter.channel) : undefined;  //挂号途径
            filter.department != undefined ? params.push("filter__dept="+filter.department) : undefined;  //科室
            filter.itemName != undefined ? params.push("filter__itemName="+filter.itemName) : undefined;  //检验项目
            filter.type != undefined ? params.push("filter__type="+filter.type) : undefined;  //联动的选择类型
            filter.diagType != undefined ? params.push("filter__diagType="+filter.diagType) : undefined;  //挂号时段构成选择的类型
            filter.otherDate != undefined ? params.push("filter__otherDate="+filter.otherDate) : undefined;  //预约的他日时间
            filter.startDate != undefined ? params.push("filter__startDate="+filter.startDate) : undefined;  //开始时间
            filter.endDate != undefined ? params.push("filter__endDate="+filter.endDate) : undefined;  //结束时间

            filter.staType != undefined ? params.push("filter__statisticalType="+filter.staType) : undefined;  //挂号分析的统计类型
            filter.outpatientType != undefined ? params.push("filter__outpatientType="+filter.outpatientType) : undefined;  //挂号分析的门诊类型

            filter.time != undefined ? params.push("filter__time="+filter.time) : undefined;  //就诊监控的科室就诊情况监控时间选择

            filter.rankType != undefined ? params.push("filter__rankType="+filter.rankType) : undefined;  //接诊分析的科室/医生排行/收费或者人次
            filter.docName != undefined ? params.push("filter__docName="+filter.docName) : undefined;  //接诊分析的医生接诊排行选择的医生

            filter.viewSize != undefined ? params.push("filter__viewSize="+filter.viewSize) : undefined;  //费用监控-显示个数
            filter.patientIdentity != undefined ? params.push("filter__patientIdentity="+filter.patientIdentity) : undefined;  //费用监控-患者身份
            filter.doctorType != undefined ? params.push("filter__doctorType="+filter.doctorType) : undefined;  //费用监控-医生类型

            filter.examType != undefined ? params.push("filter__examType="+filter.examType) : undefined;  //流程监控-检查类型
            filter.drugType != undefined ? params.push("filter__drugType="+filter.drugType) : undefined;  //流程监控-药房类别

            filter.itemType != undefined ? params.push("filter__itemType="+filter.itemType) : undefined;  //费用统计-项目排行

            filter.detailType != undefined ? params.push("filter__detailType="+filter.detailType) : undefined;  //费用统计-项目排行
        }
        params.length > 0 ? urlAll = urlAll+"?"+params.join("&"):undefined;
        
        //gqm_debug 此处只用于开始的演示,以后会将此处去掉
        if(filter!=undefined&&date!=undefined){
            urlAll = urlAll+"&filter__visitDate="+date;
        }else if(filter==undefined&&date!=undefined){
            urlAll = urlAll+"?filter__visitDate="+date;
        }
        
        if(method == "get"){
            return $http.get(urlAll).then(function success(msg) {
                return msg.data;
            });
        }else if(method == "post"){
            return $http.post(urlAll,data).then(function success(msg) {
                return msg.data;
            });
        }
    }

    /**
     * 手动筛查中的查找
     * @param data
     * @param filter
     * @returns {*}
     */
    function searchList(data,filter) {
        --filter.pageNo;
        // return $http.post(SYS.url+"manual/list/page?filter__pageNo="+filter.pageNo+"&filter__pageSize="+filter.pageSize,data).then(function success(msg) {
        //     if(msg.data.page&&msg.data.page.number){
        //         ++msg.data.page.number;
        //     }
        //     return msg.data;
        // });
        return $http.get(SYS.jsonUrl+'page.json').then(function success(msg) {
            if(msg.data.page&&msg.data.page.number){
                ++msg.data.page.number;
            }
            return msg.data;
        });
    }

    /**
     * 列表表头的json
     * @param type
     * @returns {*}
     */
    function requestColumn(type) {
        return $http.get(SYS.infiUrl+type+".json").then(function success(msg) {
            return msg.data;
        });
    }

    return {
        requestData:requestData,
        searchList:searchList,
        requestColumn:requestColumn
    }
}]);