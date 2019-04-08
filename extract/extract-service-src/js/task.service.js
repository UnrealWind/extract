angular.module('infi-basic').service("TaskService",['$http','SYS',function ($http,SYS) {
    /**
     * 各种列表
     */
    function getListData(url,page,size) {
        return $http.get(SYS.url+url+"page_number="+page+"&page_size="+size).then(function success(msg) {
            if(msg.data.page&&msg.data.page.number){
                ++msg.data.page.number;
            }
            return msg.data;
        })
    }
    /**
     * 获取列表表头
     * @returns {*}
     */
    function getColumn(name) {
        return $http.get(SYS.infiUrl+name+".json").then(function success(msg) {
            return msg.data;
        });
    }
    /**
     * 待审核任务页面，提交后调用接口
     * @param id
     * @param filter
     * @returns {*}
     */
    function checkTask(id,filter,subject) {
        var subjectFilter = JSON.parse(subject);
        var data = {
            filter_opinion:filter.checkReason,
            filter_isPassed:filter.checkResult
        }
        var url = "rule/auth/"+id+"?filter_opinion="+filter.checkReason+"&filter_isPassed="+filter.checkResult+"&filter_subjectId="+subjectFilter.subjectId+"&filter_subjectGroupId="+subjectFilter.subjectGroupId;
        return $http.get(SYS.url+url).then(function success(msg) {
            return msg.data;
        })
    }
    /**
     * 列表的删除
     * @param filter
     * @returns {*}
     */
    function deleteDetail(filter) {
        return $http.get(SYS.url+filter.url+filter.id).then(function success(msg) {
            return msg.data;
        })
    }
    /**
     * 调用左侧tab的数据*
     * @returns {*}
     */
    function getSummaryList(filter,subject){
        var subjectFilter = JSON.parse(subject),
            url = "config/tree/select/alltree?filter_used="+filter+"&filter_subjectId="+subjectFilter.subjectId+"&filter_subjectGroupId="+subjectFilter.subjectGroupId;
        return $http.get(SYS.url+url).then(function success(msg){
            return msg.data;
        })
    }
    /**
     * 调用姓名等下的详情数据*
     * @param id
     */
    function getInfoDetailData(filter,subject) {
        var subjectFilter = JSON.parse(subject);
        return $http.get(SYS.url+"config/tag/select/all?filter_used="+filter+"&filter_subjectId="+subjectFilter.subjectId+"&filter_subjectGroupId="+subjectFilter.subjectGroupId).then(function success(msg){
            return msg.data;
        })
    }
    /**
     * 获取筛选逻辑配置页面绘图数据
     */
    function getChartData(id,data,subject) {
        var subjectFilter = JSON.parse(subject);
        var data = {
            id:id,
            logicJson:(data==null || data.length == 0)?"":JSON.stringify(data)
        }
        return $http.post(SYS.url+"rule/features?filter_subjectId="+subjectFilter.subjectId+"&filter_subjectGroupId="+subjectFilter.subjectGroupId,data).then(function success(msg){
            return msg.data;
        }) 
    }
    /**
     * 保存筛选条件选取页面的json
     * @param data 筛选的json
     * @returns {*}
     */
    function saveFilterData(url,data) {
        return $http.post(SYS.url+url,data).then(function success(msg) {
            return msg.data;
        })
    }
    /**
     * 得到保存的规则或者推荐任务
     * @param id
     * @returns {*}
     */
    function getGroupData(url,id) {
        return $http.get(SYS.url+url+id).then(function success(msg) {
            return msg.data;
        })
    }
    /**
     * 逻辑配置页面上一步、下一步保存数据
     * @returns {*}
     */
    function saveLogic(url,data){
        return $http.post(SYS.url+url,data).then(function success(msg) {
            return msg.data;
        })
    }
    /**
     * 创建规则
     * @param data
     * @returns {*}
     */
    function creatRule(data) {
        return $http.post(SYS.url+"rule/createRule",data).then(function success(msg) {
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

    //获取全部科室
    function getAllDept() {
        return $http.get(SYS.url+"rule/sect/all").then(function success(msg) {
            return msg.data;
        });
    }
    /**
     * 保存推荐结果
     * @param data
     */
    function savePushTask(data) {
        return $http.post(SYS.url+"pushTask/saveTask",data).then(function success(msg) {
            return msg.data;
        });
    }
    /**
     * 执行任务详情的kpi
     * @param id
     * @returns {*}
     */
    function getPushTaskKpi(id) {
        return $http.get(SYS.url+"resultRecord/kpi/"+id).then(function success(msg) {
            return msg.data;
        });
    }

    /**
     * 执行推送任务
     * @param id
     * @returns {*}
     */
    function implementPushTask(id) {
        return $http.get(SYS.url+"pushTask/executePushTask/"+id).then(function success(msg) {
            return msg.data;
        });
    }
    
    
    
    function getSerachData(type) {
        return $http.get(SYS.infiUrl+type).then(function success(msg) {
            return msg.data;
        });
    }

    /**
     * 获取医生和科室
     */
    function getAllDR(api) {
        return $http.get(SYS.url + api).then(function success(msg) {
            return msg.data;
        });
    }

    /**
     * 选择医生和科室
     * 
     */
    function selectDoctor(room, doctor, obj) {
       if (!obj.sendObj[room.id + '_' + doctor.id]) {
            obj.sendObj[room.id + '_' + doctor.id] = {
                recommendDoctorId: doctor.id,
                recommendDoctorName: doctor.name,
                recommendSectorId: room.id,
                recommendSector: room.name
            }
            obj.sendArray.push(room.id + '_' + doctor.id)
       } else {
           delete obj.sendObj[room.id + '_' + doctor.id]
           obj.sendArray.splice(obj.sendArray.indexOf(room.id + '_' + doctor.id), 1)
       }
       return obj;
    }

    /**
     * 保存医生
     */
    function saveDR(data) {
        return $http.post(SYS.url+"rule/create").then(function success(msg) {
            return msg.data;
        });
    }


    
    return{
        getColumn:getColumn,
        getListData:getListData,
        checkTask:checkTask,
        deleteDetail:deleteDetail,
        getSummaryList:getSummaryList,
        getInfoDetailData:getInfoDetailData,
        getChartData:getChartData,
        saveFilterData:saveFilterData,
        getGroupData:getGroupData,
        saveLogic:saveLogic,
        creatRule:creatRule,
        getSearchData:getSearchData,
        getAllDept:getAllDept,
        savePushTask:savePushTask,
        getPushTaskKpi:getPushTaskKpi,
        implementPushTask:implementPushTask,
        getSerachData:getSerachData,
        selectDoctor: selectDoctor,
        getAllDR: getAllDR,
        saveDR: saveDR
    }
}])