angular.module("infi-basic").service('DataAdapter',['SYS',function (SYS) {
    var that = this;
    //获得环形嵌套图数据
    function setNestedData(original){
        original.inner=[];  //嵌套内圆显示数据
        original.outer=[];  //嵌套外圆显示数据
        angular.forEach(original.data.result,function (entity) {
            //level=0,内环数据;level=其他外环数据
            entity.level == 0 ? original.inner.push(entity) : original.outer.push(entity);
        });
        original.inner.length>0?original.inner[0].selected=true:undefined;  //里面圆的第一个选中
    }

    //获取饼图数据
    function setPieData(original) {
        original.outer=[];  //圆形显示数据
        angular.forEach(original.data.result,function (entity) {
            original.outer.push(entity);  //饼图要求按降序展示
        });
    }

    //获取柱状图数据
    function setBarData(original) {
        var optionType = original.$optionType,
            original = original.data;
        original.titleAxis=[];  //x轴数据
        original.dataAxis=[];  //y轴title
        if(optionType){  //横向图形从数组的最后一个取
            for(var idx=original.data.result.length-1;idx >= 0;idx--){
                getData(original.data.result[idx]);
            }
        }else{  //纵向图形从数组的第一个取
            for(var idx=0;idx<original.data.result.length;idx++){
                getData(original.data.result[idx]);
            }
        }

        function getData(entity) {
            if(original.$valueType){  //放入绘图数据中的值的key不是'value'时,使用自定义的$valueType
                original.dataAxis.push({value:entity[original.$valueType],type:entity.type});
            }else{
                original.dataAxis.push({value:entity.value,type:entity.type});
            }
            original.titleAxis.push(entity.name);
        }
    }

    //获取折线图数据
    function setLineData(original) {
        var original = original.data;
        angular.forEach(original.data.result,function (ori) {
            if(!original.chartData.xAxisMapping[ori.visit_date]){
                original.chartData.xAxis.push(ori.visit_date); //准备放入x轴的数据在mapping数据中未出现,则将x轴数据放入数组中
                original.chartData.xAxisMapping[ori.visit_date] = ori.visit_date;//准备放入x轴的数据在mapping数据中未出现,则将x轴数据放入mapping中
            }
            //循环后台给的数据,因为给的数据中不能准确表明'指标'名称和对应的数据,需要与'指标'checkbox列表相匹配
            $.each(ori,function (idx) {
                angular.forEach(original.$selectType,function (type) {  ///循环'指标'checkbox列表
                    if(type.key == idx && type.$checked){
                        var name = ori.outpatient_type?ori.outpatient_type+'-':'';  //拼接tooltip的name;费用分析中只有'指标',outpatient_type不存在
                        var chart = original.chartData.data[name + type.label];  //将类型名称与指标名称拼写成组合名称
                        if(!chart){
                            //组合名称对应的key未存放在数据中,将此份数据加入绘图数据中.
                            chart = {name:name + type.label,values:[]};
                            chart.values.push({value:ori[idx],ratio:ori[idx+'_ratio']});  //盛放组合名称在所有横坐标下的数据以及比率
                            ori[idx+'_hb_ratio'] ? chart.values[chart.values.length - 1].hb_ratio = ori[idx+'_hb_ratio'] : undefined;
                            original.chartData.data[name + type.label] = chart;
                        }else{
                            chart.values.push({value:ori[idx],ratio:ori[idx+'_ratio']});  //组合名称已经存在,盛放组合名称在所有横坐标下的数据以及比率
                            ori[idx+'_hb_ratio'] ? chart.values[chart.values.length - 1].hb_ratio = ori[idx+'_hb_ratio'] : undefined;
                        }
                    }
                })
            });
        });
    }
    
    //堆叠柱状图数据
    function setStackBarData(original) {
        original = original.data;
        original.xAxisTitle = []; //盛放x轴名称
        var data = {};
        angular.forEach(original.data.result,function (entity) {
            original.xAxisTitle.push(entity.name);  //一个x轴一个柱的x轴title
            angular.forEach(original.$xAxis,function (xAxis) {
                var name = xAxis.label;
                    value = entity[xAxis.key];
                if(data[name]){  //判断后台的名称在最终数据中是存在过
                    data[name].value.push({value:value,ratio:entity[xAxis.key+'_ratio'],type:entity.type});  //ratio用于柱状图堆叠显示比例的图形
                }else{
                    data[name] = {
                        name:name,
                        //设置不同的statk,组合图中另外一个不与其他数据堆叠的图形.单个图中,stack相同
                        stack:!original.$otherBar?'bar':entity.name == original.$otherBar ? 'doctor' : 'patient',
                        value:[]
                    }
                    data[name].value.push({value:value,ratio:entity[xAxis.key+'_ratio'],type:entity.type});
                }
            });
        });
        // angular.forEach(original.data.result,function (entity) {
        //     var isSingle = !entity.type;  //为true则一个x轴一个柱
        //     isSingle ? original.xAxisTitle.push(entity.name) : undefined;  //一个x轴一个柱的x轴title
        //     angular.forEach(original.$xAxis,function (xAxis) {
        //         var isDouble = entity.type&&xAxis.type == entity.type,  //为true则一个x轴多个柱
        //             name = isSingle?xAxis.label:isDouble?entity.name:undefined,  //一个柱上的不同数据显示的各子name
        //             value = isSingle?entity[xAxis.key]:isDouble?entity.value:undefined; //一个柱上的不同数据显示的各子name的value值
        //         if(data[name]){  //判断后台的名称在最终数据中是存在过
        //             data[name].value.push({value:value,ratio:entity[xAxis.key+'_ratio']});  //ratio用于柱状图堆叠显示比例的图形
        //         }else{
        //             data[name] = {
        //                 name:name,
        //                 //设置不同的statk,组合图中另外一个不与其他数据堆叠的图形.单个图中,stack相同
        //                 stack:!original.$otherBar?'bar':entity.name == original.$otherBar ? 'doctor' : 'patient',
        //                 value:[]
        //             }
        //             data[name].value.push({value:value,ratio:entity[xAxis.key+'_ratio']});
        //         }
        //     });
        // });
        original.dataAxis = data;
    }

    //折柱混合图
    function setLineBarData(original) {
        original = original.data;
        original.xAxisTitle = [];  //盛放x轴title
        original.title = [];  //x轴每个点显示的几个数值名称
        original.dataAxis = {};  //盛放柱,线的数据
        angular.forEach(original.$title,function (x) {
            original.title.push(x.label);
            original.dataAxis[x.label] = {
                name:x.label,
                type:x.type,  //区分是柱还是线
                values:[]
            }
        });
        angular.forEach(original.data.result,function (entity,idx) {
            original.xAxisTitle.push(entity[original.$xAxis]);  //x轴title
            angular.forEach(original.$title,function (xAxis) {
                original.dataAxis[xAxis.label].values.push({
                    value:entity[xAxis.key],
                    ratio:entity[xAxis.key+'_ratio']  //适用于接诊分析-全院接诊概况 tooltip里面的显示
                });
                //分别找到数值和比率里面的最大值和最小值.original.$minMax存在则不需要最大值\最小值.目前没有需要最小值\最大情况
                // if(xAxis.type == 'line'&&!original.$minMax){  //y轴右侧需要显示的数据坐标
                //     if(idx == 0){  //给最大比率,最小比率赋初始值
                //         original.yAxis[1].min = entity[xAxis.key];
                //         original.yAxis[1].max = entity[xAxis.key];
                //     }
                //     entity[xAxis.key] < original.yAxis[1].min ? original.yAxis[1].min = entity[xAxis.key] : undefined;
                //     entity[xAxis.key] > original.yAxis[1].max ? original.yAxis[1].max = entity[xAxis.key] : undefined;
                // }else if(xAxis.type == 'bar'&&!original.$minMax){  //y轴左侧需要显示的数据坐标
                //     if(idx == 0){  //给最大值,最小值赋初始值
                //         original.yAxis[0].min = entity[xAxis.key];
                //         original.yAxis[0].max = entity[xAxis.key];
                //     }
                //     entity[xAxis.key] < original.yAxis[0].min ? original.yAxis[0].min = entity[xAxis.key] : undefined;
                //     entity[xAxis.key] > original.yAxis[0].max ? original.yAxis[0].max = entity[xAxis.key] : undefined;
                // }
            })
        });
    }
    /**
     * 绘制图形需要的方法
     * @param original
     * @param callback
     */
    function dataLegality(original) {
        var idx=0;
        //result里面value全空,不显示图形
        angular.forEach(original.data.data.result,function (ori) {
            ori.value&&ori.value!=0 ? undefined : idx++;
        });
        if(idx == original.data.data.result.length){
            original.data.status = 'blank';
            original.data.description = '未查询到数据';
        }else{
            if(original.$type == 'nest'){
                setNestedData(original.data);
            }else if(original.$type == 'pie'){
                setPieData(original.data);
            }else if(original.$type == 'bar'){
                setBarData(original);
            }
        }
    }

    /**
     * 转化kpi数据
     * @param original
     */
    function getKpi(original) {
        var ori = original.data.data.result[0],
            column = original.columnData;
        angular.forEach(column.child,function (entity) {
            angular.forEach(entity.child,function (child) {
                child.num = ori[child.key];
            })
        });
        original.data.$data = column;
    }

    /**
     * 判断原始数据的状态
     * @param original  原始数据
     * @param callback  判断完状态下一步需要进行的方法
     * @param dataLegality  绘制图形需要的方法
     * @returns {*}
     */
    function judgeStatus(original,callback) {
        if(original.data.status == SYS.STATUS_SUCCESS){ //外层状态判断,给出提示
            if(original.data.data&&original.data.data.status == SYS.STATUS_SUCCESS){  //data里面状态判断,判断是否有数据
                if(original.data.data.result&&original.data.data.result.length>0){  //判断result里面是否有数据
                    callback?callback(original):undefined;
                }else{
                    original.data.status = 'blank';
                    original.data.description = '未查询到数据';
                }
            }else{
                original.data.status = 'blank';
                original.data.description = '未查询到数据';
            }
        }
        return original.data;
    }

    /**
     * 嵌套图形数据转化
     * @param original  后台返回的数据
     * @returns {*}
     */
    that.transformNested = function (original) {
        var oriObj = {data:original,$type:'nest'};
        return judgeStatus(oriObj,dataLegality);
    }

    /**
     * 饼图数据转化
     * @param original 后台返回的数据
     * @param type 图形的类型
     * @returns {*}
     */
    that.transformPie = function (original) {
        var oriObj = {data:original,$type:'pie'};
        return judgeStatus(oriObj,dataLegality);
    }

    /**
     * 柱状图转化
     * @param original  原始数据
     * @param type  标识是横向图还是纵向图 type存在并且为'horizontal'则为横向图
     * @returns {*}
     */
    that.transformBar = function (original,type) {
        var oriObj = {data:original,$type:'bar',$optionType:type};
        return judgeStatus(oriObj,dataLegality);
    }

    /**
     * 折线图转化
     * @param original
     */
    that.transformLine = function (original) {
        var oriObj = {data:original};
        judgeStatus(oriObj,setLineData);
    }

    /**
     * 堆叠柱状图转化
     * @param original
     */
    that.transformVerticalStackBar = function (original) {
        var oriObj = {data:original};
        judgeStatus(oriObj,setStackBarData);
    }

    /**
     * 折柱混合图转化
     * @param original
     */
    that.transformLineBar = function (original) {
        var oriObj = {data:original};
        judgeStatus(oriObj,setLineBarData);
    }
    
    that.transformRegion = function (original) {
        var oriObj = {data:original};
        judgeStatus(oriObj);
    }

    //获取checkbox数据
    function getCheckBox(original) {
        var datas = [];
        angular.forEach(original.data.data.result,function (entity) {
            if(original.$id == entity.name_id){
                entity.checked == 'true' ? entity.$checked = true : entity.$checked = false;  //后台传递的checked为字符型,不能绑定checkbox
                original.$type == 'left' ? entity.$type = 'left' : entity.$type = 'right';  //给checkbox列表放置标示位
                datas.push(entity);
            }
        });
        original.data.$datas = $.extend(true,[],datas);  //深拷贝匹配的checkbox列表,防止所有列表数据被覆盖
    }

    /**
     * 挂号分析页面checkbox列表数据整理
     * @param id  不同的列表对应的原始数据中的id
     * @param original  原始数据
     * @param type  标示是左侧checkbox还是右侧checkbox
     * @returns {*}
     */
    that.getAnalysisCheckbox = function (id,original,type) {
        var oriObj = {data:original,$id:id,$type:type};
        return judgeStatus(oriObj,getCheckBox)
    }
    /**
     * 转化kpi数据
     * @param original  查询到的数据
     * @param column  对应的展示内容
     * @returns {*}
     */
    that.transformKpi = function (column,original) {
        var oriObj = {data:original,columnData:column};
        return judgeStatus(oriObj,getKpi)
    }
}]);