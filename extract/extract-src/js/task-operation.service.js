angular.module('infi-basic').service("TaskOperationService",['$http','SYS',function ($http,SYS){
    //表格操作按钮进入的页面的接口
    /**
     * 待审核任务，“查看”进入详情页查看具体任务
     * @param id
     * @returns {*}
     */
    function getTaskView(id) {
        return $http.get(SYS.url+"task/view/"+id).then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 待审核任务，“查看”进入详情页调用kpi接口
     * @param id
     * @returns {*}
     */
    function getTaskViewKpi(id) {
        return $http.get(SYS.url+"task/kpi/"+id).then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 详情和审核页查看任务详情，请求任务名称、任务背景和研究目的接口
     * @param id
     * @returns {*}
     */
    function getTaskDetail(id) {
        return $http.get(SYS.url+"task/view/"+id).then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 详情和审查页查看任务详情，请求成果说明接口
     * @param id
     * @returns {*}
     */
    function getResult(id) {
        return $http.get(SYS.url+"achievement/view/"+id).then(function success(msg) {
            return msg.data;
        })
    }



    /**
     * 待审核任务页面，提交后调用接口
     * @param id
     * @param filter 
     * @returns {*}
     */
    function checkTask(id,filter,subject) {
        var url = "task/auth/"+id+"?filter_masking=" + filter.checkMask + "&filter_opinion="+filter.checkReason+"&filter_isPassed="+filter.checkResult+"&filter_subjectId="+subject.subjectId+"&filter_subjectGroupId="+subject.subjectGroupId;
        return $http.get(SYS.url+url).then(function success(msg) {
            return msg.data;
        })
    }
    
    return{
        getTaskViewKpi:getTaskViewKpi,
        checkTask:checkTask,
        getTaskView:getTaskView,
        getTaskDetail: getTaskDetail,
        getResult: getResult
    }
}])