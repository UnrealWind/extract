angular.module('infi-basic')
    .service('CRFManageService',['$http','SYS','$routeParams','Upload',function($http,SYS,$routeParams,Upload){
        this.getDeptList = function () {
            return $http({
                method:'get',
                url:SYS.url + 'dim/dept',
                params:{},
                data:''
            }).then(function (msg) {
                return msg.data
            })
        }
        this.getDeptType = function () {
            return $http({
                method:'get',
                url:SYS.url + 'dim/crf/category',
                params:{},
                data:''
            }).then(function (msg) {
                return msg.data
            })
        }

        this.uploadCRF = function ($files,params) {
            for(var i = 0; i < $files.length; i++){
                if(i == $files.length-1){
                    return upload($files[i]);
                }else {
                    upload($files[i]);
                }

            }

            function upload(file){
                var url = SYS.url + 'crf/template/dept/'+params.dept+'/'+'type/'+params.type;

               return Upload.upload({
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    url: url,
                    method: 'post',
                    file: file
                }).then(function (msg) {
                    return msg.data;
               });
            }
        }

    }]);