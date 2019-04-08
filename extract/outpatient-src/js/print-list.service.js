/**
 * Created by geqimeng on 18-3-30.
 */
angular.module("infi-basic").service('PrintListService',[function () {
    //设置初始化,通过不同类型判断绘制不同图形
    var that = this;
    
    //挂号监控id组合
    that.getRegMonIds = function(allList){
        var list = [{id:'rMonKpi',name:"今日挂号总体情况"},{id:'rMonConstitution',name:"今日挂号构成监控"},{id:'rMonStatus',name:"今日挂号情况监控"},
            {id:'rMonChannel',name:"门诊挂号渠道监控"},{id:'rMonTodayNum',name:"预约今日号源监控"},{id:'rMonOtherNum',name:"现场预约他日号源监控"},
            {id:'rMonMissOverall',name:"今日爽约总体情况"},{id:'rMonRetreatOverall',name:"今日退号总体情况"}];
        list = that.checkExist(list,allList);
        return list;
    }

    //就诊监控id组合
    that.getVisMonIds = function(allList){
        var list = [{id:'vMonKpi',name:"就诊总体情况"},{id:'vMonPatient',name:"医患配置监控"},{id:'vMonDepartment',name:"科室接诊情况"},
            {id:'vMonDoc',name:"医生接诊情况监控"},{id:'vMonReport',name:"患者报到情况监控"},{id:'vMonPatientVisits',name:"患者就诊情况监控"}];
        list = that.checkExist(list,allList);
        return list;
    }
    //费用监控id组合
    that.getCosMonIds = function(allList){
        var list = [{id:'cMonKpi',name:"收费总体情况"},{id:'cMonPayment',name:"收费构成监控"},{id:'cMonPayService',name:"收费项目排行监控"},
            {id:'cMonDoctorFee',name:" 医生收费监控"},{id:'cMonRetreatFee',name:"患者退费情况监控"}];
        list = that.checkExist(list,allList);
        return list;
    }

    //流程监控id组合
    that.getProMonIds = function(allList){
        var list = [{id:'pMonWait',name:"候诊情况监控"},{id:'pMonInspect',name:"检查情况监控"},{id:'pMonBlood',name:"采血情况监控"},
            {id:'pMonCheck',name:" 检查情况监控"}];
        list = that.checkExist(list,allList);
        return list;
    }

    //挂号分析id组合
    that.getRegAnaIds = function(allList){
        var list = [{id:'rAnaKpi',name:"门急诊总体情况"},{id:'rAnaTypeTrends',name:"门急诊挂号类型趋势"},{id:'rAnaChannelTrends',name:"门急诊挂号渠道趋势"},
            {id:'rAnaMiss',name:" 门诊爽约情况"},{id:'rAnaBackNumber',name:" 门诊退号情况"}];
        list = that.checkExist(list,allList);
        return list;
    }

    //接诊分析id组合
    that.getVisAnaIds = function(allList){
        var list = [{id:'vAnaKpi',name:"接诊总体情况"},{id:'vAnaHosAdmissions',name:"全院接诊概况"},{id:'vAnaDeptAdmissions',name:"科室接诊概况"},
            {id:'vAnaDocAdmissions',name:" 医生接诊概况"},{id:'rAnaBackNumber',name:" 门诊退号情况"}];
        list = that.checkExist(list,allList);
        return list;
    }

    //费用分析id组合
    that.getChaAnaIds = function(allList){
        var list = [{id:'cAnaKpi',name:"收费总体情况"},{id:'cAnaHospital',name:"全院收费概况"},{id:'cAnaDeptCharge',name:"科室收费概况"},
            {id:'cAnaDocCharge',name:" 医生收费概况"}];
        list = that.checkExist(list,allList);
        return list;
    }

    /**
     * 和总体打印列表对比，是否存在选中的
     * @param list
     * @param allList
     */
    that.checkExist = function(list,allList){
        angular.forEach(list,function(ids){
            angular.forEach(allList,function(all){
                if(all.id == ids.id && all.$checked){
                    ids.$checked = true;
                }
            })
        })
        return list;
    }
}])
