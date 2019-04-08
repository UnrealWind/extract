angular.module('infi-basic').service("ConfigureService",['$http','SYS',function ($http,SYS) {
    //配置页面的http请求
    /**
     * 获取配置的list数据
     */
    function getConfigurePage(filter) {
        return $http.get(SYS.url+"config"+filter.type+filter.type1+"/page?page_number="+filter.page+"&page_size="+filter.pageSize).then(function success(msg) {
            if(msg.data.page&&msg.data.page.number){
                ++msg.data.page.number;
            }
            return msg.data;
        })
    }

    /**
     * 获取所有不分页数据
     * @param filter
     * @returns {*}
     */
    function getConfigureAll(filter) {
        return $http.get(SYS.url+"config"+filter.type+filter.type1+"/select/all").then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 获取表头本地文件
     * @param type
     * @returns {*}
     */
    function getColumn(type) {
        return $http.get(SYS.infiUrl+type+".json").then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 维表资源\标签值分类\搜索资源数据请求
     * @param type
     */
    function getDimensionList(type) {
        return $http.get(SYS.url+"config/custom/dimension/select/type/"+type).then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 获取核实资源数据
     */
    function getValidateList() {
        return $http.get(SYS.url+"config/validate/select/all").then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 保存新建的数据
     * @param filter
     * @returns {*}
     */
    function saveCreatedData(filter) {
        return $http.post(SYS.url+"config"+filter.type+filter.type1+"/create",filter.data).then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 通过id获取数据
     * @param filter
     * @returns {*}
     */
    function getDetail(filter) {
        return $http.get(SYS.url+"config/"+filter.type+"/"+filter.type1+"/select/"+filter.id).then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 保存修改的数据
     * @param filter
     * @returns {*}
     */
    function saveChangedData(filter) {
        return $http.post(SYS.url+"config/"+filter.type+"/"+filter.type1+"/update",filter.data).then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 通过id删除数据
     * @param filter
     * @returns {*}
     */
    function deleteDetail(filter) {
        return $http.get(SYS.url+"config"+filter.type+filter.type1+"/delete/"+filter.id).then(function success(msg) {
            return msg.data;
        })
    }

    return{
        getConfigurePage:getConfigurePage,
        getColumn:getColumn,
        getDimensionList:getDimensionList,
        getValidateList:getValidateList,
        saveCreatedData:saveCreatedData,
        getDetail:getDetail,
        deleteDetail:deleteDetail,
        saveChangedData:saveChangedData,
        getConfigureAll:getConfigureAll
    }
}]);