angular.module('infi-basic')
    .service('subjectNewsService',['$http','SYS',function($http,SYS){
        //获取未处理列表
        this.getSubjectNews = function (userId) {
            return $http({
                method: 'get',
                url: SYS.url + 'subject/list/' + userId,

            }).then(function (msg) {
                return msg.data;
            })
        }
        //同意申请查看
        this.accept = function (status,id) {
            return $http({
                method: 'get',
                url: SYS.url + 'subject/member/apply/' + id ,
                params: {
                    reply: status
                }
            }).then(function (msg) {
                return msg.data;
            })
        }

    }]);