angular.module('infi-basic').service("TaskListService",['$http','SYS',function ($http,SYS){
    //全部任务，待审核任务等表格中的向后台调用的接口
    /**
     * 查看全部任务
     * @param page
     * @param size
     * @returns {*}
     */
    function getAllTask(page,size) {
        return $http.get(SYS.url+"task/page?page_number="+page+"&page_size="+size).then(function success(msg) {
            if(msg.data.page&&msg.data.page.number){
                ++msg.data.page.number;
            }
            return msg.data;
        })
    }

    /**
     * 查看待审核任务
     * @param page
     * @param size
     * @returns {*}
     */
    function getPendingAudit(page,size) {
        return $http.get(SYS.url+"task/page?page_number="+page+"&page_size="+size+"&filter_EQ_taskStatus=AUDIT_PRE").then(function success(msg) {
            if(msg.data.page&&msg.data.page.number){
                ++msg.data.page.number;
            }
            return msg.data;
        })
    }

    /**
     * 表格表头数据
     * @returns {*}
     */
    function getColumns() {
        return $http.get(SYS.infiUrl+"view-column.json").then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 任务提取
     * @param id
     * @returns {*}
     */
    function extractTask(id) {
        return $http.get(SYS.url+"task/extract/"+id).then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 任务下载
     * @param id
     * @returns {*}
     */
    function downloadTask(id) {
        return $http.get(SYS.url+"task/download/"+id).then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 查看成果备案
     * @param id
     * @returns {*}
     */
    function getRecord(id) {
        return $http.get(SYS.url+"achievement/view/"+id).then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 预览导出结果前五条
     */
    function previewExport(id) {
        return $http.get(SYS.url + 'task/view/' + id).then(function success(msg) {
            return msg.data;
        })
    }


    /**
     * 下载成果说明
     * @param <achievementId> <filename>
     * @return I/O
     */

    function downloadFile(fileName, achievementId) {
        if (achievementId == null) {
            return
        }
        window.location.href = SYS.url + "achievement/download/"+ achievementId;
    }


    return {
        getAllTask:getAllTask,
        getColumns:getColumns,
        extractTask:extractTask,
        downloadTask:downloadTask,
        getPendingAudit:getPendingAudit,
        getRecord: getRecord,
        downloadFile: downloadFile,
        previewExport: previewExport,
    }
}])
