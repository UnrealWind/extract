angular.module('infi-basic').service('subjectListService',['$http','SYS',function($http,SYS){
    //获取我的课题列表
    this.getSubjectList = function (pageNum,status) {
        var params = {}
        if(status == 'all') {
            params ={
                page_number: pageNum,
                page_size: 10,
                filter_subjectMemberStatus: 'attended'
            }
        }else {
            params ={
                page_number: pageNum,
                page_size: 10,
                filter_subjectStatus: status,
                filter_subjectMemberStatus: 'attended'
            }
        }
        return $http({
            url: SYS.url + 'subject/page',
            method: 'get',
            params: params
        }).then(function (msg) {
            return msg.data;
        });
    }
    //获取邀请列表
    this.getInviteList = function (pageNum) {
        return $http({
            url: SYS.url + 'subject/page',
            method: 'get',
            params: {
                page_number: pageNum,
                page_size: 10,
                filter_subjectMemberStatus: 'notattend',
            }
        }).then(function (msg) {
            return msg.data;
        })
    }
    //接受邀请
    this.acceptInvite = function (subjectId) {
        return $http({
            url: SYS.url + 'subject/'+subjectId+'/accepts',
            method: 'put'
        }).then(function (msg) {
            return msg;
        })
    }
    this.subjectCreate = function () {
        return $http({
            url: SYS.url + 'subject/create',
            method: 'post'
        }).then(function (msg) {
            return msg.data;
        })
    }

}]);