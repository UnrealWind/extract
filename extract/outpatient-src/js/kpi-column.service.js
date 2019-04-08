angular.module("infi-basic").service('KpiColumnService',['$http','SYS',function ($http,SYS) {
    var that = this;
    //挂号监控-今日挂号总体情况
    that.kpiRegisterToday = function () {
        return {
            col:"col-md-4",
            child:[{
                image: "visit-total.png",
                child: [{
                    name: "门急诊总人次",
                    key: "mjz_size"
                },{
                    name: "军人人次",
                    key: "mjzj_size"
                },{
                    name: "军人占比",
                    key: "mjzjzb_size"
                }]
            },{
                image: "visit-outpatient.png",
                child: [{
                    name: "门诊人次",
                    key: "mz_size"
                },{
                    name: "军人人次",
                    key: "mzj_size"
                },{
                    name: "军人占比",
                    key: "mzjzb_size"
                }]
            },{
                image: "visit-emergency.png",
                child: [{
                    name: "急诊人次",
                    key: "jz_size"
                },{
                    name: "军人人次",
                    key: "jzj_size"
                },{
                    name: "军人占比",
                    key: "jzjzb_size"
                }]
            }]
        };
    }
    //挂号监控-今日挂号总体情况
    that.kpiBookingToday = function () {
        return {
            col:"col-md-4",
            child:[{
                image: "visit-order.png",
                child: [{
                    name: "预约人次",
                    key: "yy_size"
                },{
                    name: "军人人次",
                    key: "yyj_size"
                },{
                    name: "军人占比",
                    key: "yyjzb_size"
                }]
            },{
                image: "visit-expert.png",
                child: [{
                    name: "专家号人次",
                    key: "zj_size"
                },{
                    name: "军人人次",
                    key: "zjj_size"
                },{
                    name: "军人占比",
                    key: "zjjzb_size"
                }]
            },{
                image: "visit-ordinary.png",
                child: [{
                    name: "普通号人次",
                    key: "pt_size"
                },{
                    name: "军人人次",
                    key: "ptj_size"
                },{
                    name: "军人占比",
                    key: "ptjzb_size"
                }]
            }]
        };
    }
    //挂号监控-今日爽约总体情况
    that.kpiMissToday = function () {
        return {
            col:"col-md-4",
            child:[{
                image: "visit-total.png",
                child: [{
                    name: "门急诊总人次",
                    key: "mjzzrs"
                },{
                    name: "军人人次",
                    key: "jrzrs"
                },{
                    name: "军人占比",
                    key: "jrzb"
                }]
            },{
                image: "visit-miss.png",
                child: [{
                    name: "爽约人次",
                    key: "syrs"
                },{
                    name: "军人人次",
                    key: "syjrrs"
                },{
                    name: "军人占比",
                    key: "syzb"
                }]
            },{
                image: "visit-missrate.png",
                child: [{
                    name: "爽约率",
                    key: "syl"
                },{
                    name: "军人爽约率",
                    key: "jrsyl"
                }]
            }]
        };
    }
    //挂号监控-今日退号总体情况
    that.kpiBackNoToday = function () {
        return {
            col:"col-md-4",
            child:[{
                image: "visit-total.png",
                child: [{
                    name: "门急诊总人次",
                    key: "mjzs_size"
                },{
                    name: "军人人次",
                    key: "mjzjs_size"
                },{
                    name: "军人占比",
                    key: "mjzjszb_size"
                }]
            },{
                image: "visit-miss.png",
                child: [{
                    name: "退号人次",
                    key: "ths_size"
                },{
                    name: "军人人次",
                    key: "thjs_size"
                },{
                    name: "军人占比",
                    key: "thjszb_size"
                }]
            },{
                image: "visit-miss.png",
                child: [{
                    name: "退今日号人次",
                    key: "tjrhs_size"
                },{
                    name: "军人人次",
                    key: "tjrhjs_size"
                },{
                    name: "军人占比",
                    key: "tjrhjszb_size"
                }]
            }
            //     ,{
            //     child: [{
            //         name: "开诊前退号人次",
            //         key: "tjrhs_size"
            //     },{
            //         name: "军人人次",
            //         key: "tjrhjs_size"
            //     },{
            //         name: "军人占比",
            //         key: "tjrhjszb_size"
            //     }]
            // },{
            //     child: [{
            //         name: "开诊后退号人次",
            //         key: "tjrhs_size"
            //     },{
            //         name: "军人人次",
            //         key: "tjrhjs_size"
            //     },{
            //         name: "军人占比",
            //         key: "tjrhjszb_size"
            //     }]
            // }
            ]
        };
    }
    //费用监控-收费总体情况/费用分析-收费总体情况
    that.kpiTotalChargeTop = function () {
        return {
            col:"col-md-4",
            child:[{
                image: "total-cost.png",
                child: [{
                    name: "总收费",
                    key: "qyzsf_total",
                    unit:"万元"
                },{
                    name: "军人收费",
                    key: "qyzsf_jr",
                    unit:"万元"
                },{
                    name: "非军人收费",
                    key: "qyzsf_fjr",
                    unit:"万元"
                }]
            },{
                image: "service-cost.png",
                child: [{
                    name: "医事服务费",
                    key: "ysfw_total",
                    unit:"万元"
                },{
                    name: "军人收费",
                    key: "ysfw_jr",
                    unit:"万元"
                },{
                    name: "非军人收费",
                    key: "ysfw_fjr",
                    unit:"万元"
                }]
            },{
                image: "drug-cost.png",
                child: [{
                    name: "药品收费",
                    key: "ypsf_total",
                    unit:"万元"
                },{
                    name: "军人收费",
                    key: "ypsf_jr",
                    unit:"万元"
                },{
                    name: "非军人收费",
                    key: "ypsf_fjr",
                    unit:"万元"
                }]
            }]
        };
    }
    that.kpiTotalChargeBottom = function () {
        return {
            col:"col-md-4",
            child:[{
                image: "check-cost.png",
                child: [{
                    name: "检查收费",
                    key: "jcsf_total",
                    unit:"万元"
                },{
                    name: "军人收费",
                    key: "jcsf_jr",
                    unit:"万元"
                },{
                    name: "非军人收费",
                    key: "jcsf_fjr",
                    unit:"万元"
                }]
            },{
                image: "test-cost.png",
                child: [{
                    name: "检验收费",
                    key: "jysf_total",
                    unit:"万元"
                },{
                    name: "军人收费",
                    key: "jysf_jr",
                    unit:"万元"
                },{
                    name: "非军人收费",
                    key: "jysf_fjr",
                    unit:"万元"
                }]
            },{
                image: "zhiliao-cost.png",
                child: [{
                    name: "治疗收费",
                    key: "zlsf_total",
                    unit:"万元"
                },{
                    name: "军人收费",
                    key: "zlsf_jr",
                    unit:"万元"
                },{
                    name: "非军人收费",
                    key: "zlsf_fjr",
                    unit:"万元"
                }]
            }]
        };
    }
    //挂号分析-门急诊总体情况
    that.kpiTotalOutpatient = function () {
        return {
            col:"col-md-3",
            child:[{
                image: "visit-total.png",
                child: [{
                    name: "门急诊总人次",
                    key: "mjz_size"
                },{
                    name: "军人人次",
                    key: "mjzj_size"
                },{
                    name: "军人占比",
                    key: "mjzjzb_size"
                }]
            },{
                image: "visit-outpatient.png",
                child: [{
                    name: "门诊人次",
                    key: "mz_size"
                },{
                    name: "军人人次",
                    key: "mzj_size"
                },{
                    name: "军人占比",
                    key: "mzjzb_size"
                }]
            },{
                image: "visit-emergency.png",
                child: [{
                    name: "急诊人次",
                    key: "jz_size"
                },{
                    name: "军人人次",
                    key: "jzj_size"
                },{
                    name: "军人占比",
                    key: "jzjzb_size"
                }]
            },{
                image: "back-number.png",
                child: [{
                    name: "退号人次",
                    key: "ths_size"
                },{
                    name: "退号率",
                    key: "thszb_size"
                }]
            }]
        };
    }
    //接诊分析-接诊总体情况
    that.kpiTotalVisit = function () {
        return {
            col:"col-md-4",
            child:[{
                image: "visit-cz-total.png",
                child: [{
                    name: "全院医生出诊总次数",
                    key: "zczcs_size"
                },{
                    name: "专家",
                    key: "zj_zczcs_size"
                },{
                    name: "普通",
                    key: "pt_zczcs_size"
                }]
            },{
                image: "visit-jz-total.png",
                child: [{
                    name: "全院医生总接诊人次",
                    key: "zjzrc_size"
                },{
                    name: "专家",
                    key: "zj_zjzrc_size"
                },{
                    name: "普通",
                    key: "pt_zjzrc_size"
                }]
            },{
                image: "visit-jjz-total.png",
                child: [{
                    name: "医生次均接诊人次",
                    key: "cjjzrc_size"
                },{
                    name: "专家",
                    key: "zj_cjjzrc_size"
                },{
                    name: "普通",
                    key: "pt_cjjzrc_size"
                }]
            }]
        };
    }
}]);