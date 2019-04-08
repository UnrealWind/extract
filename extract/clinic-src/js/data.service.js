angular.module("infi-basic").service('DataService',['$http','SYS',function ($http,SYS) {
    function getMenu() {
        return $http.get(SYS.localUrl+"menu.json").then(function success(msg) {
            return msg.data;
        });
    }

    //获得科室名称信息
    function getDepartmentName() {
        var url = "data/department.json";
        return $http.get(SYS.url+"unite/resource/single/15").then(function success(msg) {
            return msg.data;
        });
    }

    //获取总量分析数据
    function getCombinationData(startTime,endTime) {
        var url = "data/combination.json";
        return $http.get(SYS.url+"unite/resource/single/11?filter__startDate="+startTime+"&filter__endDate="+endTime).then(function success(msg) {
            return msg.data;
        });
    }

    //获取科室排行分析数据
    function getProportionData(depName,startTime,endTime) {
        var url= "data/proportion.json";
        return $http.get(SYS.url+"unite/resource/single/14?filter__deptName="+depName+"&filter__startDate="+startTime+"&filter__endDate="+endTime).then(function success(msg) {
            return msg.data;
        });
    }

    //会诊分析弧数据
    function getArcAnalysisData(startTime,endTime,combination) {
        var url = "data/arc-analysis.json";
        return $http.get(SYS.url+"unite/resource/single/12?filter__type="+combination+"&filter__startDate="+startTime+"&filter__endDate="+endTime).then(function success(msg) {
            return msg.data;
        });
    }

    //科室分析圆数据
    function getNodeAnalysisData(startTime,endTime,combination) {
        var url = "data/node-analysis.json";
        return $http.get(SYS.url+"unite/resource/single/13?filter__type="+combination+"&filter__startDate="+startTime+"&filter__endDate="+endTime).then(function success(msg) {
            return msg.data;
        });
    }

    return {
        getDepartmentName:getDepartmentName,
        getCombinationData:getCombinationData,
        getProportionData:getProportionData,
        getArcAnalysisData:getArcAnalysisData,
        getNodeAnalysisData:getNodeAnalysisData,
        getMenu:getMenu
    }
}]);