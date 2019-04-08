angular.module('infi-basic').service('DataService',['$http','SYS',function($http,SYS){

  /**
   * 请求列表数据
   * @param filter
   * @returns {*}
     */
  this.ajaxList = function(filter){
    // var url = SYS.url + 'load/records/'+ filter.projectName +'/page';
    // return $http({
    //   method: 'post',
    //   url:url,
    //   params:{
    //     page_number:  filter.number,
    //     page_size:    filter.size,
    //     eu:           '777bbb7869ae8193249f8ff7d3e59afe',
    //     eq:           '777bbb7869ae8193249f8ff7d3e59afe'
    //   }
    // }).then(function (data){
    //   return data.data;
    // });
    return $http.post(SYS.url + 'load/records/'+ filter.projectName +'/page?page_number='+ filter.number+'&page_size='+filter.size).then(function(data){
      return data.data;
    });
  };

  /**
   * 删除一条病历
   * @param filter
   * @returns {*}
     */
  this.delRecord = function(filter){
    return $http.post(SYS.url + 'text/info/'+filter.id+ '/' + filter.version).then(function(data){
        return data.data;
    })
  };

  /**
   * 获取表格标题
   * @param name
   * @returns {*}
     */
  this.ajaxColumns = function(name){
    return $http.get('data/'+name+'.columns.json').then(function(data){
      return data.data;
    });
  };

  this.getNavList = function(name){
    return $http.get('data/record.input.nav.json').then(function(data){
      return data.data;
    });
  };

  this.ajaxDimensions = function(){
    return $http.get('data_gen/dimensions.json').then(function(data){
      return data.data;
    });
  };

  /**
   * 创建病历
   * @param filter
   * @returns {*}
     */
  this.createRecord = function(filter){
    return $http.post(SYS.url+'load/records/'+filter.projectName,filter.record).then(function(data){
      return data.data;
    })
  };

  this.getDefaultValue = function(){
    return $http.get('data/default.value.json').then(function success(msg){
      return msg.data;
    })
  };

  this.getLoginName = function (credentials) {
    var url = SYS.url + 'login';
    return $http.get(url).then(function (msg) {
      return msg.data;
    })
  };
}]);
