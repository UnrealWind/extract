angular.module("infi-basic").service('PageInteractiveService',['$interval','DataService','DataAdapter','DrawEchartService','Utils','$filter',function ($interval,DataService,DataAdapter,DrawEchartService,Utils,$filter) {
    //设置初始化,通过不同类型判断绘制不同图形
    var that = this;

    /**
     * 挂号分析重置按钮操作
     * @param entity  需要重置的数据
     */
    that.clearSelected = function (entity,date) {
        entity.department = "";
        entity.staType = "day";  //默认按天统计
        //循环checkbox,将原始数据中选中的置为选中
        function setChecked(original) {
            angular.forEach(original,function (select) {
                angular.forEach(select.$datas,function (data) {
                    data.checked == 'true' ? data.$checked = true : data.$checked = false;
                });
            });
        }
        setChecked(entity.select);
        setChecked(entity.selectType);
        that.searchAnalysisData(entity,date);  //重新绘图
    }

    /**
     * '挂号分析'图形查找数据获取
     * @param id
     * @param original
     * @param date
     * @param selected  当前选中的checkbox
     * @param scope  选中的checkbox不符合条件则给出提示
     */
    that.searchAnalysisData = function (original,date,selected,scope) {
        var filter = {   //链接参数配置
            startDate : date.startDate,
            endDate : date.endDate,
            department:original.department,
            staType:original.staType,
            outpatientType:""   //左侧checkbox选择拼接字符串
        };
        var chartData = { //盛放拼写的折线图的数据
            xAxis : [],  //x轴
            xAxisMapping:{}, //x轴的mapping数据
            data:{},  //绘制图形的线数据
            index:0  //有的图形需要获取两份数据,两份数据都完毕后才绘图
        };

        //多行的筛选条件要发送多个请求,将多份数据合并拼写绘图数据
        angular.forEach(original.ids,function (id,idx) {
            if(selected&&selected.$type=='right'){  //后台传递的数据包括所有右侧的数据,所以右侧checkbox改变,不会重新发送请求
                var list = original.recordData[idx];
                ++chartData.index;
                list ? drawChart(list) : undefined;
            }else{
                //左侧筛选条件匹配方法
                getCheckboxChecked(original.select[idx],filter,'outpatientType');
                DataService.requestData(id,'get',undefined,filter).then(function (msg) {
                    original.recordData[idx] = msg;  //保存返回的数据,右侧筛选条件点击时不会发送请求
                    //使用'指标'的checkbox列表与查询到的数据中的key匹配,拼写线的name和value,后台给的数据无法查找
                    msg.$selectType = original.selectType[idx].$datas ? original.selectType[idx].$datas : [];
                    ++chartData.index;
                    drawChart(msg);
                });
            }
        });

        //公用的绘图的数据
        //因为调用是在循环里调用，所以会执行两遍，主要判断异步数据全部存在才往下执行，所以if条件判断两条数据都存在之后才执行下边的操作
        function drawChart(msg) {
            msg.chartData = chartData;  //将chartData给msg赋值,方便数据拼写.由于赋值为浅拷贝,所以chartData会一直随着数据改变,不会被覆盖
            DataAdapter.transformLine(msg);  //整理数据
            if(chartData.index == original.ids.length){  //有的图形需要获取两份数据,两份都获取完成才能绘图,因为http请求异步,所以不确定哪份数据先完成
                //需要根据整理的真实数据来判断是否绘图,因为根据状态码判断,其中一份请求没数据在后,但是另一份有数据在前就会造成错误
                $('#'+original.htmlId).removeAttr('_echarts_instance_');
                if(Object.keys(msg.chartData.data).length > 0){
                    msg.$staType = original.staType;  //图形tooltip根据选择的不同'统计类型'显示不同的提示
                    msg.$xName = "日期";
                    msg.$yName = "人次";
                    DrawEchartService.drawChart('line',original.htmlId,msg);
                }else{
                    $('#'+original.htmlId).text('未查询到数据');
                }
            }
        }
    }

    /**
     * 获取左侧,右侧选中的checkbox数据
     * @param datas  原始数据
     * @param filter 链接参数配置
     * @param type   需要放到filter中的数据的key(参数名)
     */
    function getCheckboxChecked(datas,filter,type) {
        if(datas.$datas&&datas.$datas.length > 0){
            var contrainer = [];
            angular.forEach(datas.$datas,function (entity) {
                if(entity.$checked){
                    contrainer.push(entity.value);
                }
            });
            contrainer.length > 0 ? filter[type] = contrainer.join(',') : undefined;  //选中的数据以,隔开发送给后台
        }
    }

    /**
     * 费用监控-收费项目排行监控图形绘制
     * @param original
     * @param count 各自的筛选条件所在的commom的idx
     * @param visitData 查找的时间
     */
    that.searchCostRanking = function (original,count,visitData) {
        var common = original.common[count],
            filter = {department:original.department,patientIdentity:original.identity,rankType:common.rank,
            viewSize:common.displayNumber};
        DataService.requestData(common.urlId,'get',visitData,filter).then(function (msg){
            DataAdapter.transformBar(msg,'horizontal');
            if(msg.status == 'ok'){
                // that.transformCostRankName(msg);   //去掉了收费条形图左侧名称部分显示
                msg.$tooltipName = filter.rankType == 'fy_size'?'收费':'人次';
                msg.$xName = filter.rankType == 'fy_size'?'元':'人次';
                msg.$yName = "收费项目";
                DrawEchartService.drawChart('bar',common.id,msg);
            }else{
                $('#'+common.id).text(msg.description);
            }
        });
    }
    /**
     * 收费项目的y轴title转化,大于8个字符则折行,少于8个则补空格
     * @param original
     */
    that.transformCostRankName= function(original) {
        var titleArray = [],size = 8;
        angular.forEach(original.titleAxis,function (title) {
            var newstr = "";
            if(title.length<=size){
                for(var idx=0;idx<(size-title.length);idx++){
                    newstr +="    ";  //补空格,4个空格相当于一个汉字
                }
                newstr += title;
            }else{
                for(var i=0;i<title.length;i+=size){
                    var tmp=title.substring(i, i+size);  //取5个
                    newstr+=tmp+'\n';
                }
            }
            titleArray.push(newstr);
        });
        original.titleAxis = titleArray;
    }

    /**
     * 历史分析页面,按天,周,月统计需要根据时间段的变化而变化
     * @param searchDate
     * @returns {string}
     */
    that.setTimeInterval = function (searchDate) {
        var startTime = Date.parse(new Date(searchDate.startDate)),
            endTime = Date.parse(new Date(searchDate.endDate)),
            timer = Math.abs(parseInt((endTime - startTime + 1)/1000/3600/24));
        //间隔0~14--day,间隔15~90--week,以上--month
        return timer <= 14 ? 'day' : timer > 14 && timer <= 90 ? 'week' : 'month';
    }

    /**
     * 实时监控页面10分钟刷新一次数据
     * @param callback
     */
    that.setIntervalData = function (callback) {
        var timeout_upd = $interval(function () {
            callback();
        },1000*10*60);

        return timeout_upd;
    }
    /**
     * 清除实时刷新,目前是单页面应用,即使从A页面到B页面,A页面的Interval方法仍在继续,所以需要离开页面时清除上一个监控
     * @param timeout
     */
    that.clearInterval = function (timeout) {
        $interval.cancel(timeout);
    }

    /**
     * 实时监控页面获取当前时间用于查询
     * @returns {*}
     */
    that.getTodayTime = function () {
        var myDate = new Date(),
            myYear = myDate.getFullYear(),
            myMonth = myDate.getMonth() + 1,
            myDay = myDate.getDate();
        //杨
        // return "2018-04-25"
        // return "2017-12-22";
        // 121时间
        // return "2016-2-1";
        // return "2017-10-10";
        //167时间
        // return "2017-10-13";
        return $filter('date')(new Date(),'yyyy-MM-dd');
    }

    /**
     * 历史分析页面默认查询时间段
     * 开始时间,结束时间
     * @returns {{startDate: string, endDate: string}}
     */
    that.setTimeRange = function () {
        // 121时间
        // return {startDate:"2017-6-1",endDate:"2018-6-30"};
        //167时间
        // return {startDate:"2018-03-01",endDate:"2018-03-07"};
        // 上线用
        return {startDate:$filter('date')(new Date(new Date()-8*24*60*60*1000),'yyyy-MM-dd'),endDate:$filter('date')(new Date()-24*60*60*1000,'yyyy-MM-dd')};
        // return {startDate:"2018-01-30",endDate:"2018-02-28"};
        //167时间
        // return {startDate:"2018-03-01",endDate:"2018-03-07"};
        //164时间
        // return {startDate:"2018-03-01",endDate:"2018-07-07"};
    }
}]);