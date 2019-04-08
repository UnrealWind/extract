angular.module('infi-basic')
.service('RecordListServices',['$http','SYS','$routeParams',function($http,SYS,$routeParams){
    this.getRecordList = function (params,pageNum,pageSize) {
        var data = {
            page_number:pageNum,
            page_size:pageSize
        };
        if(params.search != ''){
            if(!isNaN(params.search)){
                data.filter_LIKE_caseId = params.search;
            }else {
                data.filter_LIKE_name = params.search;
            }
        }

        params.time.key?data[params.time.key] = params.time.value:'';

        return $http({
            method:'get',
            url:SYS.url + 'subject/'+$routeParams.subjectId+'/group/'+params.groupId+'/record/page',
            params:data,
            data:''
        }).then(function (msg) {
            return msg.data
        })
    }

    this.getRecordGroup = function () {
        return $http({
            method:'get',
            url:SYS.url + 'subject/'+$routeParams.subjectId+'/group',
            params:{},
            data:''
        }).then(function (msg) {
            return msg.data
        })
    }

    this.addFlup = function (groupId,recordId,flupData) {
        var data = {};
        flupData.forEach(function (n,i) {
            data[n.name] = n.value
        })
        return $http({
            method:'post',
            url:SYS.url + 'subject/'+$routeParams.subjectId+'/group/'+groupId+'/record/'+recordId+'/temp/interview',
            params:data,
            data:''
        }).then(function (msg) {
            flupData.forEach(function (n,i) {
                n.value = '';
            });
            return msg.data
        })
    }

    this.newRecord = function (newCRFData,groupId) {
        var data = {};
        newCRFData.forEach(function (n,i) {
            data[n.name] = n.value;
        });
        return $http({
            method:'post',
            url:SYS.url + 'subject/'+$routeParams.subjectId+'/group/'+groupId+'/record',
            params:{},
            data:data
        }).then(function (msg) {
            return msg.data
        })
    }
    this.getModifyRecord = function ($routeParams) {
        return $http({
            method:'get',
            url:SYS.url + 'record/'+$routeParams.recordId+'/interview/'+$routeParams.interviewId+'/get/log',
        }).then(function (msg) {
            return msg.data
        })
    }
}]);
