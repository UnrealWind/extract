angular.module('infi-basic')
    .service('subjectCreateService',['$http','SYS','Upload',function($http,SYS,Upload){
        //新建课题
        this.subjectCreate = function (data) {
            return $http({
                method: 'post',
                url: SYS.url + 'subject',
                data: {
                    userId: data.userId,
                    name: data.name,
                    ename: data.ename,
                    ecode: data.ecode,
                    no: data.no,
                    visible: data.visible,
                    center: data.center,
                    type: data.type,
                    level: data.level,
                    reason: data.reason,
                    source: data.source,
                    describes: data.describes,
                    reason: data.reason,
                    meaning: data.meaning,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    subjectOffices: data.subjectOffices,
                    objectives: data.objectives,
                    company: data.company,
                    own: data.own,
                    phone: data.phone,
                    email: data.email,
                    remark: data.remark
                }
            }).then(function (msg) {
                return msg.data;
            })
        }
        //查看课题信息
        this.getSubjectInfo = function (id) {
            return $http({
                method: 'get',
                url: SYS.url + 'subject/' + id,
                
            }).then(function (msg) {
                return msg.data;
            })
        }
        //修改课题
        this.subjectModify = function (id,data) {
            return $http({
                method: 'put',
                url: SYS.url + 'subject/' + id,
                data: {
                    userId: data.userId,
                    name: data.name,
                    ename: data.ename,
                    ecode: data.ecode,
                    no: data.no,
                    visible: data.visible,
                    center: data.center,
                    type: data.type,
                    level: data.level,
                    reason: data.reason,
                    source: data.source,
                    describes: data.describes,
                    reason: data.reason,
                    meaning: data.meaning,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    subjectOffices: data.subjectOffices,
                    objectives: data.objectives,
                    company: data.company,
                    own: data.own,
                    phone: data.phone,
                    email: data.email,
                    remark: data.remark,
                    flag: data.flag
                }
            }).then(function (msg) {
                return msg.data;
            })
        }
        //获取科室列表
        this.getDepartmentsData = function () {
            return $http({
                method: 'get',
                url: SYS.url+'dim/dept'
            }).then(function(data){
                return data;
            });
        }
        // 获取课题负责人列表
        this.getOwnList = function () {
            return $http({
                method: 'get',
                url: SYS.url+'dim/user'
            }).then(function(data){
                return data;
            });
        }

        this.uploadCRF = function ($files,subjectId) {
            for(var i = 0; i < $files.length; i++){
                if(i == $files.length-1){
                    return upload($files[i]);
                }else {
                    upload($files[i]);
                }
            }
            function upload(file){
                var url = SYS.url + 'subject/'+ subjectId +'/file';
                return Upload.upload({
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
                    url: url,
                    method: 'post',
                    file: file
                }).then(function (msg) {
                    return msg.data;
                });
            }
        }
        this.deleteFile = function (fileId) {
            return $http({
                method: 'delete',
                url: SYS.url+'subject/file/'+fileId,

            }).then(function(msg){
                return msg.data;
            });
        }
        this.getUploadList = function (pageNum,pageSize,subjectId) {
            return $http({
                method: 'get',
                url: SYS.url+'subject/file/page',
                params: {
                    page_number: pageNum,
                    page_size: pageSize,
                    filter_EQ_subjectId: subjectId
                }
            }).then(function(msg){
                return msg.data;
            });
        }
        this.downLoad = function (id) {
            location.href = SYS.url+'subject/file/' + id;
        }
    }]);