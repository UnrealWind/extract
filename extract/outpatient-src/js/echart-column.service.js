angular.module("infi-basic").service('ChartColumnService',['$http','SYS',function ($http,SYS) {
    var that = this;
    //按天/周/月统计按钮列表
    that.filterDaysBtnList = function () {
        return [{label:'按天统计',value:'day'},{label:'按周统计',value:'week'},{label:'按月统计',value:'month'}];
    };

    //检验项目,检查项目,药品按钮列表
    that.filterProjectBtnList = function () {
        return [{label:'检验项目',value:'testItem'},{label:'检查项目',value:'examItem'},{label:'药品',value:'drug'}];
    }

    //收费/人次排行列表
    that.filterChartBtnList = function () {
        return [{label:'按收费排行',value:'fy_size'},{label:'按人次排行',value:'rc_size'}];
    }
    //isRight--内容居右显示;isClick--此列可点击,进行级联
    //挂号监控-预约他日号源清单
    that.tableOhterDayNum = function () {
        return {
            id:"rightTableNum",
            child:[
                {name: "患者姓名", key:"name"},
                {name: "联系方式",key:"phone"},
                {name: "号别",key:"card_type"},
                {name: "其他科室挂号情况",key:"other_sect"},
                {name: "预约挂号日期",key:"regist_date"}
            ]
        }
    }
    //就诊监控-科室就诊情况
    that.tableVisitSituation = function () {
        return {
            id:"docVisitTime",
            child:[
                {name: "号类", key:"name"},
                {name: "已诊人数",key:"already",isRight:true},
                {name: "未诊人数",key:"noAlready",isRight:true},
                {name: "医生数",key:"doc",isRight:true}
            ]
        }
    }
    //就诊监控-医生接诊时间监控
    that.tableDocVisitTime = function () {
        return {
            id:"leftTableNum",
            child:[
                {name: "医生姓名", key:"name",isClick:'name'},
                {name: "科室",key:"dept"},
                {name: "号别",key:"doctor_type"},
                {name: "开诊时间",key:"start_time"},
                {name: "结诊时间",key:"end_time"},
                {name: "人均接诊时间(分钟)",key:"rjjz_times",isRight:true},
                {name: "患者人均等候时间(分钟)",key:"rjdh_times",isRight:true}
            ]
        }
    }
    //就诊监控-医生接诊时间患者列表监控
    that.tableDocVisitTimePatient = function () {
        return {
            id:"rightTableNum",
            child:[
                {name: "患者姓名", key:"patient_name"},
                {name: "联系方式",key:"patient_phone"},
                {name: "地域",key:"patient_place"},
                {name: "候诊时长(分钟)",key:"hz_times",isRight:true},
                {name: "就诊时长(分钟)",key:"jz_times",isRight:true}
            ]
        }
    }
    //就诊监控-未报到患者详情
    that.tableNoVisit = function () {
        return {
            id:"NoVisit",
            child:[
                {name: "患者姓名", key:"pati_name"},
                {name: "联系方式",key:"pati_phone"},
                {name: "患者身份",key:"pati_identity"},
                {name: "地域",key:"pati_place"},
                {name: "挂号途径",key:"regist_way"},
                {name:"其他科室挂号情况",key:"other_dept"}
            ]
        }
    }
    //就诊监控-初诊患者详情
    that.tableFirstVisit = function () {
        return {
            id:"firstVisit",
            child:[
                {name: "患者姓名", key:"pati_name"},
                {name: "联系方式",key:"pati_phone"},
                {name: "患者身份",key:"pati_identity"},
                {name: "地域",key:"pati_place"},
                {name: "挂号途径",key:"regist_way"}
            ]
        }
    }
    //流程监控-候诊情况监控
    that.tableWaiting = function () {
        return {
            id:"",
            child:[
                {name: "姓名", key:"doctor"},
                {name: "应诊人次",key:"yzrc_size",isRight:true},
                {name: "候诊人次",key:"hzrc_size",isRight:true},
                {name: "诊毕人次",key:"zbrc_size",isRight:true},
                {name: "平均候诊时长(min)",key:"pjhzsc_size",isRight:true}
            ]
        }
    }
    //流程监控-检查情况监控
    that.tableChecking = function () {
        return {
            id:"",
            child:[
                {name: "科室", key:"examination_room"},
                {name: "应检人次",key:"yjrc_size",isRight:true},
                {name: "等候人次",key:"dhrc_size",isRight:true},
                {name: "检毕人次",key:"jbrc_size",isRight:true},
                {name: "平均等候时长(min)",key:"pjdhsc_size",isRight:true}
            ]
        }
    }
    //流程监控-采血情况监控
    that.tableBooding = function () {
        return {
            id:"",
            child:[
                {name: "采血窗口", key:"name"},
                {name: "应采血人次",key:"cxrc_size",isRight:true},
                {name: "等候人次",key:"dhrc_size",isRight:true},
                {name: "采血完成人次",key:"cxwc_size",isRight:true},
                {name: "平均等候时长(min)",key:"pjdh_size",isRight:true}
            ]
        }
    }
    //流程监控-取药情况监控
    that.tableDruging = function () {
        return {
            id:"",
            child:[
                {name: "取药窗口", key:"name"},
                {name: "应取药人次",key:"cyrc_size",isRight:true},
                {name: "等候人次",key:"dhrc_size",isRight:true},
                {name: "已取药人次",key:"qyrc_size",isRight:true},
                {name: "平均等候时长(min)",key:"pjdhsc_size",isRight:true}
            ]
        }
    }
    //费用监控-某医生患者人均次均费用列表
    that.tableCostPatient = function () {
        return {
            id:"",
            child:[
                {name: "患者姓名", key:"pati_name"},
                {name: "患者身份",key:"pati_identity"},
                {name: "地域",key:"pati_place"},
                {name: "总费用",key:"all_cost",isRight:true},
                {name: "药品费用",key:"drug_cost",isRight:true},
                {name: "药占比",key:"drug_proportion",isRight:true}
            ]
        }
    }
}]);