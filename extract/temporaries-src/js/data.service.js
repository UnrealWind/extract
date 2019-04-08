angular.module("infi-basic").service('DataService',['$http','SYS',function ($http,SYS) {
    function getMenu() {
        return $http.get(SYS.localUrl+"menu.json").then(function success(msg) {
            return msg.data;
        });
    }

    //获得科室名称信息
    function getDepartmentName(opt) {
        var url = "data/department.json";
        return $http.get(SYS.url+"unite/resource/single/75?filter__typeName="+opt.tagVal.combination).then(function success(msg) {
            return msg.data;
        });
    }

    //获取总量分析数据
    function getCombinationData(opt) {
        var url = "data/combination.json";
        return $http.get(SYS.url+"unite/resource/single/71?" +
            "filter__grade="+opt.tagVal.hy+"&filter__degree="+opt.tagVal.lv+
            "&filter__startTime="+opt.tagVal.startTime+"&filter__endTime="+opt.tagVal.endTime+
            "&filter__typeName="+opt.tagVal.combination).then(function success(msg) {
            return msg.data;
        });
    }

    //获取科室排行分析数据
    function getProportionData(depName,startTime,endTime) {
        var url= "data/proportion.json";
        return $http.get(SYS.url+"unite/resource/single/74?filter__deptName="+depName+"&filter__startDate="+startTime+"&filter__endDate="+endTime).then(function success(msg) {
            return msg.data;
        });
    }

    //会诊分析弧数据
    function getArcAnalysisData(opt) {
        var url = "data/arc-analysis.json";
        return $http.get(SYS.url+"unite/resource/single/72?"+
        "filter__grade="+opt.tagVal.hy+"&filter__degree="+opt.tagVal.lv+
        "&filter__startTime="+opt.tagVal.startTime+"&filter__endTime="+opt.tagVal.endTime+
        "&filter__typeName="+opt.tagVal.combination).then(function success(msg) {
            return msg.data;
        });
    }

    //科室分析圆数据
    function getNodeAnalysisData(opt) {
        var url = "data/node-analysis.json";
        return $http.get(SYS.url+"unite/resource/single/73?"+
            "filter__grade="+opt.tagVal.hy+"&filter__degree="+opt.tagVal.lv+
            "&filter__startTime="+opt.tagVal.startTime+"&filter__endTime="+opt.tagVal.endTime+
            "&filter__typeName="+opt.tagVal.combination).then(function success(msg) {
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