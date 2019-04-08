angular.module('infi-basic')
    .service('subjectMemberService',['$http','SYS',function($http,SYS){
        //查看课题信息
        this.getSubjectInfo = function (id) {
            return $http({
                method: 'get',
                url: SYS.url + 'subject/' + id,

            }).then(function (msg) {
                return msg.data;
            })
        }
        //获取医院列表
        this.getHospitalData = function () {
            return $http({
                method: 'get',
                url: SYS.url+'dim/hospital'
            }).then(function(data){
                return data;
            });
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
        //获取职称列表
        this.getJobTitlesData = function () {
            return $http({
                method: 'get',
                url: SYS.url+'dim/job-title'
            }).then(function(data){
                return data;
            });
        }
        //获取邀请人员列表
        this.getInvitedList = function (subjectId,params) {
            return $http({
                method: 'get',
                url: SYS.url + 'subject/'+subjectId+'/member/in/page',
                params: params
            }).then(function (msg) {
                return msg.data;
            })
        }
        //获取未邀请人员列表
        this.getUnInvitedList = function (subjectId,params) {
            return $http({
                method: 'get',
                url: SYS.url + 'subject/'+subjectId+'/member/out/page',
                params: params
            }).then(function (msg) {
                return msg.data;
            })
        }
        //删除邀请成员
        this.deleteInvited = function (subjectId,arrId) {
            return $http({
                url: SYS.url + 'subject/'+subjectId+'/member/all',
                method: 'put',
                data: arrId
            }).then(function (msg) {
                return msg
            })
        }
        //添加邀请
        this.addInvited = function (subjectId,invitedData) {
            return $http({
                url: SYS.url + 'subject/' + subjectId + '/invite',
                method: 'put',
                data: invitedData
            }).then(function (msg) {
                return msg;
            })
        }
        //申请查看
        this.applicationView = function (subjectId,data) {
            return $http({
                url: SYS.url + 'subject/member/apply/' + subjectId +'/'+ data.userId,
                method: 'get',
            }).then(function (msg) {
                return msg;
            })
        }
    }]);