angular.module('infi-basic').service('ListService', ['$http', 'SYS', function ($http, SYS) {
    /**
     * 获取本地json
     * @param type  json的文件名
     * @returns {*}
     */
    this.ajaxJson = function(type){
        return $http.get(SYS.jsonUrl+type+'.json').then(function success(msg){
            return msg.data;
        })
    };

    /**
     * 新建一份新建患者的表单数据
     * @returns {}
     */
    this.createPatient = function(){
        return {
            id:"",
            patientName:null,
            sex:null,
            age:null,
            patientId:null,
            deptId:null,
            wardId:null,
            isHospitalization:"院内",
            enterHospitalTime:null,
            telephone:null,
            visitId:null,
            diagnosis:null
        }
    };

    /**
     * 获取科室和病区
     * @returns {*}
     */
    this.getDepart = function(){
        return $http.get(SYS.url+'condition/option').then(function success(msg){
            return msg.data;
        })
    };

    /**
     * 获取表格内容
     * @returns {*}
     */
    this.getContent = function (filter) {
        var url = SYS.url + 'patient/list?';
        var params = [];
        filter.dept!=undefined&&filter.dept!=""?params.push("filter_dept="+filter.dept):params.push("filter_dept=");
        filter.ward!=undefined&&filter.ward!=""?params.push("filter_ward="+filter.ward):params.push("filter_ward=");
        filter.tubeType!=undefined&&filter.tubeType!=""?params.push("filter_tubeType="+filter.tubeType):params.push("filter_tubeType=");
        filter.riskGrade!=undefined&&filter.riskGrade!=""?params.push("filter_riskGrade="+filter.riskGrade):params.push("filter_riskGrade=");
        filter.startTime!=undefined&&filter.startTime!=""?params.push("filter_startTime="+filter.startTime):params.push("filter_startTime=");
        filter.endTime!=undefined&&filter.endTime!=""?params.push("filter_endTime="+filter.endTime):params.push("filter_endTime=");
        filter.search!=undefined&&filter.search!=""?params.push("filter_search="+filter.search):params.push("filter_search=");
        filter.page!=undefined&&filter.page!=""?params.push("filter_pageNo="+filter.page):params.push("filter_pageNo="+SYS.DEFAULT_PAGE_NUMBER);
        filter.size!=undefined&&filter.size!=""?params.push("filter_pageSize="+filter.size):params.push("filter_pageSize="+SYS.DEFAULT_PAGE_SIZE);
        filter.tab!=undefined&&filter.tab!=""?params.push("filter_isHospitalization="+filter.tab):params.push("filter_isHospitalization=");
        filter.type!=undefined&&filter.type!=""?params.push("filter_type="+filter.type):params.push("filter_type=0");
        url = url + params.join('&');
        return $http.get(url).then(function success(msg){
            return msg.data;
        })
    };

    /**
     * 保存新增患者信息
     * @param list
     * @param status
     * @returns {*}
     */
    this.savePatient = function(list,status) {
        var method = '';
        status == SYS.ADD ? method = 'post':method = 'put';
        return $http({
            url:SYS.url + 'patient/save',
            method:method,
            data:list
        }).then(function(msg){
            return msg.data;
        });
    };

    /**
     * 获取科室
     * @returns {*}
     */
    this.getDepart = function(){
        return $http.get(SYS.url + 'unite/resource/single/1').then(function(msg){
            return msg.data;
        })
    };

    /**
     * 获取病区
     * @param id
     * @returns {*}
     */
    this.getArea = function(id){
        var url = SYS.url + 'unite/resource/single/2';
        if(id){
            url = url + "?filter__sectId="+id;
        }
        return $http.get(url).then(function(msg){
            return msg.data;
        })
    };

    /**
     * 获取置管类型
     * @returns {*}
     */
    this.getCatheterType = function(){
        return $http.get(SYS.url + 'unite/resource/single/3').then(function(msg){
            return msg.data;
        })
    };
    /**
     * 获取置管类型
     * @returns {*}
     */
    this.getRiskLevel = function(){
        return $http.get(SYS.url + 'unite/resource/single/4').then(function(msg){
            return msg.data;
        })
    };

    /**
     * 检查病案号是否重复
     * @param patientId
     * @param id
     * @returns {*}
     */
    this.checkId = function(patientId,id){
        return $http.get(SYS.url + 'patient/repeatInfo?patientId='+patientId+'&id='+id).then(function(msg){
            return msg.data;
        })
    }
}]);