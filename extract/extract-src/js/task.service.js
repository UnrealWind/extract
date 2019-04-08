angular.module('infi-basic').service("TaskService",['$http','SYS','Session',function ($http,SYS,Session) {
    //新建任务的后台接口调用
    /**
     * 调用左侧tab的数据*
     * @returns {*}
     */
    function getSummaryList(filter,subject){
        var url = "config/tree/select/alltree?filter_used="+filter+"&filter_subjectId="+subject.subjectId+"&filter_subjectGroupId="+subject.subjectGroupId;
        return $http.get(SYS.url+url).then(function success(msg){
            return msg.data;
        })
        // return $http.get(SYS.infiUrl+'all-tree.json').then(function success(msg){
        //     return msg.data;
        // })
    }

    /**
     * 调用姓名等下的详情数据*
     * @param id
     */
    function getInfoDetailData(filter,subject) {
        return $http.get(SYS.url+"config/tag/select/all?filter_used="+filter+"&filter_subjectId="+subject.subjectId+"&filter_subjectGroupId="+subject.subjectGroupId).then(function success(msg){
            return msg.data;
        })
        // return $http.get(SYS.infiUrl+"all.json").then(function success(msg){
        //     return msg.data;
        // })
    }

    /**
     * 获取筛选逻辑配置页面绘图数据
     */
    function getChartData(id,data,subject) {
        var data = {
            id:id,
            logicJson:(data==null || data.length == 0)?"":JSON.stringify(data)
        }
        return $http.post(SYS.url+"groupFeature/features?filter_subjectId="+subject.subjectId+"&filter_subjectGroupId="+subject.subjectGroupId,data).then(function success(msg){
            return msg.data;
        }) 
    }

    /**
     * 保存筛选条件选取页面的json
     * 保存筛选条件选取页面的json
     * @param data 筛选的json
     * @param id 在有此group情况下传的id
     * @returns {*}
     */
    function saveFilterData(id,data) {
        var url = id?"saveScrren":"create",
            data = (data==null || data.length==0)?"":JSON.stringify(data),
            saveData = id?{id:id,screenJson:data}:{screenJson:data};
        return $http.post(SYS.url+"group/"+url,saveData).then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 得到传到后台的json组
     * @param id
     * @returns {*}
     */
    function getGroupData(id) {
        return $http.get(SYS.url+"group/getGroup/"+id).then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 逻辑配置页面上一步、下一步保存数据
     * @param filter
     * @returns {*}
     */
    function saveLogic(id,data,history){
        var data = {
            id:id,
            logicJson:(data==null || data.length==0)?"":JSON.stringify(data),
            screenRecord:(history==null || history.length==0)?"":JSON.stringify(history)
        }
        return $http.post(SYS.url+"group/saveLogic",data).then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 导出页面点击上一步保存筛选数据
     * @param data
     * @returns {*}
     */
    function saveExtract(id,data) {
        var data = {
            id:id,
            extractJson:(data==null || data.length==0)?"":JSON.stringify(data)
        }
        return $http.post(SYS.url+"group/saveExtract",data).then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 导出数据
     * @param data
     * @returns {*}
     */
    function creatTask(data) {
        return $http.post(SYS.url+"task/create",data).then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 生成导出结果的触发器
     */
    function previewTask(id) {
        return $http.get(SYS.url+"task/previewTask/" + id).then(function success(msg) {
            return msg.data;
        })
    }


    /**
     * 调用关键字搜索得到数据
     * @param id　　查找的表id
     * @param keyword　　查找关键字
     */
    function getSearchData(id,keyword){
        return $http.post(SYS.url+"data/dimension/data/single/"+id+"?filter_search_name="+keyword).then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 已收藏的筛选条件列表
     * @returns {*}
     */
    function getCollectionList(page,size){
        return $http.get(SYS.url+"group/pageFavoriteList?page_number="+page+"&page_size="+size).then(function success(msg) {
            if(msg.data.page&&msg.data.page.number){
                ++msg.data.page.number;
            }
            return msg.data;
        })
    }

    /**
     * 收藏逻辑配置条件
     * @param data
     */
    function collectLogic(data) {
        return $http.post(SYS.url+"group/saveFavorite",data).then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 收藏提取条件
     */
    function exportExtract(data) {
        return $http.post(SYS.url+"exportFields/save",data).then(function success(msg) {
            return msg.data
        })
    }

    /**
     * 已收藏的筛选条件列表
     * @returns {*}
     */
    function getExportList(page,size){
        return $http.get(SYS.url+"exportFields/page?page_number="+page+"&page_size="+size).then(function success(msg) {
            if(msg.data.page&&msg.data.page.number){
                ++msg.data.page.number;
            }
            return msg.data;
        })
    }

    /**
     * 查看某条收藏的导出条件
     */
    function getExportRecordDetail(id) {
        return $http.get(SYS.url+"exportFields/view/"+id).then(function success(msg) {
            return msg.data;
        })
    }


    /**
     * 删除收藏的导出条件
     * @returns {*}
     */
    function deleteExportRecord(id) {
        return $http.get(SYS.url+"exportFields/delete/"+id).then(function success(msg) {
            return msg.data;
        })
    }
    
    /**
     * 区分不同的课题和模板
     * @returns {*}
     */
    function getSubjectData() {
        return $http.get(SYS.url).then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 删除已经收藏的筛选条件
     * @param id
     * @returns {*}
     */
    function deleteCollection(id) {
        return $http.get(SYS.url+"group/delete/"+id).then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 应用已经收藏的筛选条件
     * @param groupId  group的id
     * @param colletionId  收藏的筛选条件的id
     * @returns {*}
     */
    function applyGroup(groupId,colletionId) {
        return $http.get(SYS.url+"group/useGroup/"+groupId+"/"+colletionId).then(function success(msg) {
            return msg.data;
        })
    }
// =======================================================================================================
    /**
     * 确认导入
     * @returns {*}
     */
    function importFile(data) {
        var datas = JSON.stringify(data);
        return $http.post(SYS.url+"import/list",datas).then(function success(msg) {
            return msg.data;
        }) 
    }

    /**
     * 进入excel导入先新建group
     * @returns {*}
     */
    function createImportGroup() {
        return $http.get(SYS.url+"group/build").then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * excel 导入的无效病例下载
     */
    function export_failed(groupId) {
        var getUser = Session.getUser(),
            parm = '?eu=' + getUser.eu + '&ep=' + getUser.ep

        window.location.href = SYS.url + "import/download/" + groupId + parm;
    }



// =======================================================================================================
    /**
     * 数据检索'病历目录导航'
     * @returns {*}
     */
    function getFrequentTerm() {
        return $http.get(SYS.url+"case/select/all").then(function success(msg) {
            return msg.data;
        })
    }

    /**
     * 数据检索'关键词'列表
     * @returns {*}
     */
    function getKeywordList() {
        return $http.get(SYS.url+"case/show/key").then(function success(msg) {
            return msg.data;
        })
    }
    
    /**
     * 数据检索的搜索
     * @param file
     */
    function getRetrievalSearch(keyword,page,size) {
        return $http.get(SYS.url+"retrieval/retrieve?str="+keyword+"&page_number="+page+"&page_size="+size).then(function success(msg) {
            if(msg&&msg.data&&msg.data.data&&msg.data.data.length>0){
                ++msg.data.data[0].pageNumber;  //后台第一页页数为0,分页按钮第一页为1
            }
            return msg.data;
        })
    }
    
    return{
        getSummaryList:getSummaryList,
        getInfoDetailData:getInfoDetailData,
        getChartData:getChartData,
        saveFilterData:saveFilterData,
        getGroupData:getGroupData,
        saveLogic:saveLogic,
        saveExtract:saveExtract,
        creatTask:creatTask,
        getSearchData:getSearchData,
        getCollectionList:getCollectionList,
        collectLogic:collectLogic,
        getSubjectData:getSubjectData,
        deleteCollection:deleteCollection,
        applyGroup:applyGroup,
        importFile:importFile,
        createImportGroup:createImportGroup,
        getRetrievalSearch:getRetrievalSearch,
        getFrequentTerm:getFrequentTerm,
        getKeywordList:getKeywordList,
        exportExtract: exportExtract,
        getExportList: getExportList,
        deleteExportRecord: deleteExportRecord,
        getExportRecordDetail: getExportRecordDetail,
        previewTask: previewTask,
        export_failed: export_failed
    }
}])