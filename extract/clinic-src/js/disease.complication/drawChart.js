/**
 * 设置图上线的显示title
 * @param d
 * @param titleTip
 * @returns {title}
 */
function creat_lineTip(d,titleTip) {
    var CAND_IDS = d.CAND_ID;
    if(CAND_IDS.split(",").length > 1){
        //线
        title = d.title;
    }else{
        //弧
        title = titleTip;
    }
    return title;
}

/**
 * 获取分析图名称的科室分类json数据
 */
// function getCategoryData(startTime,endTime,combination,SYS,callback) {
//     var paramesCategory = {
//         type:"category",
//         fileName:"category"
//     }
//     var url = SYS.localUrl+"department.json";
//     $.get(url,paramesCategory,function (data) {
//         var categoryName = {},
//             categoryID = {};
//         //将科室分类数据转换成以科室名称为key的object类型，方便后面使用
//         for(var i=0;i < data.length;i++){
//             categoryName[data[i].dept_name] = data[i];
//             categoryID[data[i].dept_id] = data[i];
//         }
//         //为了防止异步请求时已经在绘制图形可是categoryName不存在
//         //获取分析图总量json数据
//         options = {
//             startTime: startTime,
//             endTime: endTime,
//             combination:combination,
//             callback: callback,
//             categoryName:categoryName,
//             categoryID:categoryID,
//             SYS:SYS
//         };
//         getAnalysisData(options);
//     });
// }
//
// function getAnalysisData(options) {
//     var paramesTotal = {
//         type:"totalAnalysis",
//         fileName:"totalAnalysis",
//         startTime: options.startTime,
//         endTime: options.endTime
//     }
//     var url = options.SYS.localUrl+"combination.json";
//     $.get(url,paramesTotal,function (data) {
//         var dataSum = {};
//         for(var i=0;i<data.length;i++){
//             dataSum[data[i].dept_name] = +data[i].many_dept_con + +data[i].alone_dept_con;
//             // dataSum[data[i].dept_name]["total"] = +data[i].many_dept_con + +data[i].alone_dept_con;
//         }
//         options.dataSum = dataSum;
//         getConsultationData(options);
//     });
// }
//
// /**
//  * 向后台获取多科就诊图所需数据
//  * @param callback
//  */
// function getConsultationData(options) {
//     var result = {
//         link: false,
//         node: false,
//     }
//
//     //获取arcs的数据
//     var paramesArc = {
//         startTime: options.startTime,
//         endTime: options.endTime,
//         combination:options.combination==2?'0,1':options.combination,
//         combinationSum:options.combination == 2?2:1,
//         type:"arcAnalysis",
//         fileName:"arcAnalysis"
//     }
//     var url = options.SYS.localUrl+"arc-analysis.json";
//     $.get(url,paramesArc, function (data) {
//         result.arc = true;
//         result.arcs = data;
//         //给弧上数据加上对应科室的访问总量
//         setArcsSum(options);
//         executeCallBack(options);
//     });
//
//     // 获取nodes的数据
//     var paramesnode = {
//         startTime: options.startTime,
//         endTime: options.endTime,
//         combination:options.combination==2?0:options.combination,
//         combinationSum:options.combination == 2?2:1,
//         type:"nodeAnalysis",
//         fileName:"nodeAnalysis"
//     }
//     var url1 = options.SYS.localUrl+"node-analysis.json";
//     $.get(url1,paramesnode, function (data) {
//         result.node = true;
//         result.nodes = data;
//         //给nodes加上CAND_ID属性和PTY属性
//         setNodesId(options);
//         executeCallBack(options);
//     });
//
//     function setArcsSum(options) {
//         options.arcs = {};
//         result.arcs.forEach(function (d) {
//             var isHave = typeof (options.dataSum[d.CMTE_NM]) != "undefined";
//             d.Sum = isHave?options.dataSum[d.CMTE_NM]:"";
//             // options.arcs[d.CMTE_ID] = d;
//         })
//     }
//
//     function setNodesId(options) {
//         for(var idx=0;idx<result.nodes.length;idx++){
//             var names = result.nodes[idx].CAND_NAME.split('&');
//             var isCommon = true,
//                 PtyPre,
//                 PtyNext;
//             for(var idy=0;idy<names.length;idy++){
//                 if(idy < names.length-1){
//                     PtyPre = options.categoryName[names[idy]].type;
//                     PtyNext = options.categoryName[names[idy+1]].type;
//                     if(PtyPre != PtyNext){
//                         isCommon = false;
//                     }
//                 }
//                 names[idy] = options.categoryName[names[idy]].dept_id;
//             }
//             result.nodes[idx].CAND_ID = names.join(',');
//             if(isCommon){
//                 result.nodes[idx].PTY =  PtyPre;
//             }else{
//                 result.nodes[idx].PTY = "OTH";
//             }
//         }
//     }
//
//     function executeCallBack(options) {
//         if (result.arc === true && result.node === true) {
//             //当没有查询到数据时，显示提示消息
//             if(result.arcs.length == 0 || result.nodes.length == 0){
//                 $("#errorTip").html("没有查询到数据，请修改查询条件");
//             }else{
//                 $("#errorTip").html("");
//                 //设置links数据
//                 setLinks(options);
//                 //运行函数
//                 if(options.callback){
//                     options.callback(result);
//                 }
//             }
//         }
//     }
//
//     /**
//      * 设置links的数据
//      * @param result
//      */
//     function setLinks(options) {
//         //还没有加PTY
//         var arc = result.arcs,
//             node = result.nodes,
//             link = [];
//         for(var idx=0;idx<node.length;idx++){
//             var candId = node[idx].CAND_ID;
//             var ids = candId.split(',');
//             for( var idy=0;idy<ids.length;idy++){
//                 for(var idz=0;idz<arc.length;idz++){
//                     if(ids[idy] == arc[idz].CMTE_ID){
//                         var record = {};
//                         record.total = node[idx].total;
//                         record.CAND_ID = node[idx].CAND_ID;
//                         record.TRANSACTION_AMT = node[idx].Amount;
//                         record.CMTE_ID = ids[idy];
//                         //线的显示颜色
//                         record.PTY = options.categoryID[ids[idy]].type;
//                         //node的颜色控制是通过links数据来控制的，所以新增此变量来标识node的颜色
//                         record.PTYN = node[idx].PTY;
//                         //图上线的显示title为与此线相连的node的title，增加此变量来标识links的显示title
//                         record.title = node[idx].CAND_NAME;
//                         record.Sum = options.dataSum[options.categoryID[ids[idy]]['dept_name']];
//                         link.push(record);
//                         break;
//                     }
//                 }
//             }
//         }
//         result.links = link;
//     }
// }

/**
 * 将node的颜色改变，都是内科门诊的组合显示内科颜色，都是外科门诊的组合显示外科颜色，是两者的组合则显示另外一种颜色
 * pacsById[office + "_" + ids[idx]].CMTE_NM
 */
function changeNodeColor(d) {
    return (d.PTY=="DEM") ? demColor : (d.PTY=="REP") ? repColor : otherColor;
}

/**
 * 将link的颜色改变，线在的弧上是内科就显示内科的颜色，弧是外科就显示外科的颜色
 */
function changeLineColor(d) {
    var CAND_IDS = d.CAND_ID;
    if(CAND_IDS.split(",").length > 1){
        //线
        return d.PTY == "DEM" ? demColor : repColor;
    }
}
