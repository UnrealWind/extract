
angular.module('infi-basic').service('formNaviServices',['$http','SYS',function($http,SYS){
	
	//获取测试数据
	this.ajaxNaviData = function(templateId,interviewId){
		return $http({
            url: SYS.url+'crf/template/category/'+templateId+'/'+interviewId,
            method: 'get',
			params: ''
		})
		.then(function(msg){
            msg.data.data.forEach(function (n,i) {
                n['templateId'] = templateId;
                n['interviewId'] = interviewId;
            })
			return msg.data;
		});
    };

}]); 