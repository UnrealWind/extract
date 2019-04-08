angular.module('infi-basic')
.service('PatiManageService',[function(){

  /**
   * 转化指标趋势原始数据为 normalLine 
   * @param {*} orgData 
   */
  this.fixGraphData = function(orgData) {
    var fixedData = {
      xAxis: [],
      seriesData: []
    }


    angular.forEach(orgData, function(val, ind) {
      fixedData.xAxis.push(val.name)
      fixedData.seriesData.push(val.value)
    })

    return fixedData
  }

  /**
   * 转化指标趋势原始数据为 specyAxisLine
   * @param {*} orgData 
   */
  this.fixSpecyAxisLineData = function(orgData) {
    var fixedData = {
      xAxis: [],
      yAxis:[],
      seriesData: [],
      markLine: {
        silent: true,
        data: []
      }
    }

    angular.forEach(orgData, function(val, ind) {
      fixedData.xAxis.push(val.name)
      fixedData.yAxis.push(val.value.split(',')[0])
      fixedData.seriesData.push([val.name, val.value.split(',')[0]])
      fixedData.markLine.data.push({
        yAxis: val.value.split(',')[0]
      })
    })

    return fixedData
  }

}]);    
    
    
    
    