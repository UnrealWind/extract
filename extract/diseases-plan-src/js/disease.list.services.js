angular.module('infi-basic').
service('DiseaseListServices'
    ,['$http','SYS',function($http,SYS){

        this.getListData = function(pageNo, pageSize,param){
            return $http({
                'url':SYS.url+'patient/list?'+'filter_pageNo='+pageNo+'&filter_pageSize='
                +pageSize+'&filter_disease='+param.disease.value+'&filter_startTime='+param.startTime
                +'&filter_endTime='+param.endTime+'&filter_search='+param.search
                +'&filter_wardId='+param.ward.value+'&filter_diagType='+param.diagType.value,
                //'url':'./data/diseaseList'+param.disease.value+'.json',
                'method':'get'
            }).then(function success(msg){
                var data = {
                    'page':{}
                };

                //适配器，贼坑
                data.page = msg.data;
                data.page['content'] = msg.data.result;
                data.page['number'] = pageNo;
                data.page['size'] = pageSize;
                data.page['totalElements'] = msg.data.totalCount;
                data.page['totalPages'] = msg.data.totalPages;
                data.page['description'] = msg.data.desc;
                return data;
            });
        }

    }]);