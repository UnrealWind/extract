angular.module("infi-basic").service('DataAdapter',[function () {
    var that = this;
    that.setProportionChart = function (original) {
        var radios = [],names=[],nums = [],
            name = original[0].dept_name;
        angular.forEach(original,function (entity) {
            var radio = (entity.ratio*100).toFixed(2);
            radios.push(radio);
            names.push(entity.dept_list);
            nums[entity.dept_list] = entity.dept_num;
        });
        var myChart = echarts.init(document.getElementById('departmentChart'));
        myChart.title = '其他就诊科室排行图';
        var option = {
            title: {
                text: name,
                subtext: ''
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter:function (parems) {
                    return parems[0].name + nums[parems[0].name] + "人次,占比" + parems[0].data+ "%";
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                name:'%'
            },
            yAxis: {
                type: 'category',
                data: names
            },
            series: [
                {
                    name: '',
                    type: 'bar',
                    data: radios
                }
            ]
        };
        myChart.setOption(option);
    }

    /**
     * 将科室数据放入到对象中，方便查找引用
     * @param options
     * @param original
     */
    that.setCategory = function (options,original) {
        //将科室分类数据转换成以科室名称为key的object类型，方便后面使用
        options.categoryName={};
        options.categoryID={};
        for(var i=0;i < original.length;i++){
            options.categoryName[original[i].dept_name] = original[i];
            options.categoryID[original[i].dept_id] = original[i];
        }
    }

    /**
     * 将多科就诊情况下单个科室的多科就诊总量数据 放入对象中方便使用
     * @param options
     * @param original
     */
    that.setTotalAnalysis = function (options,original) {
        options.dataSum={};
        for(var i=0;i<original.length;i++){
            options.dataSum[original[i].dept_name] = +original[i].many_dept_con + +original[i].alone_dept_con;
        }
    }

    /**
     * 给弧上数据添加sum数据，方便求百分比
     * @param options
     */
    that.setArcsSum = function (options){
        options.arcs.forEach(function (d) {
            var isHave = typeof (options.dataSum[d.CMTE_NM]) != "undefined";
            d.Sum = isHave?options.dataSum[d.CMTE_NM]:"";
        })
    }

    /**
     * 给小圆加上id，方便标示、查找
     * @param options
     */
    that.setNodesId = function (options){
        for(var idx=0;idx<options.nodes.length;idx++){
            var names = options.nodes[idx].CAND_NAME.split('&');
            var isCommon = true,
                PtyPre,
                PtyNext;
            for(var idy=0;idy<names.length;idy++){
                if(idy < names.length-1){
                    PtyPre = options.categoryName[names[idy]].type;
                    PtyNext = options.categoryName[names[idy+1]].type;
                    if(PtyPre != PtyNext){
                        isCommon = false;
                    }
                    names[idy] = options.categoryName[names[idy]].dept_id;
                }
            }
            options.nodes[idx].CAND_ID = names.join(',');
            if(isCommon){
                options.nodes[idx].PTY =  PtyPre;
            }else{
                options.nodes[idx].PTY = "OTH";
            }
        }
    }

    /**
     * node\arc数据组合link数据，并执行最后的绘图
     * @param options
     */
    that.executeCallBack = function (options) {
        if (options.arcs && options.nodes) {
            //当没有查询到数据时，显示提示消息
            if(options.arcs.length == 0 || options.nodes.length == 0){
            }else{
                $("#errorTip").html("");
                //设置links数据
                setLinks();
                options.finish = true;
                //运行函数
                $(document).trigger('doConfig');
            }
        }

        function setLinks() {
            //还没有加PTY
            var arc = options.arcs,
                node = options.nodes,
                link = [];
            for(var idx=0;idx<node.length;idx++){
                var candId = node[idx].CAND_ID;
                var ids = candId.split(',');
                for( var idy=0;idy<ids.length;idy++){
                    for(var idz=0;idz<arc.length;idz++){
                        if(ids[idy] == arc[idz].CMTE_ID){
                            var record = {};
                            record.total = node[idx].total;
                            record.CAND_ID = node[idx].CAND_ID;
                            record.TRANSACTION_AMT = node[idx].Amount;
                            record.CMTE_ID = ids[idy];
                            //线的显示颜色
                            record.PTY = options.categoryID[ids[idy]].type;
                            //node的颜色控制是通过links数据来控制的，所以新增此变量来标识node的颜色
                            record.PTYN = node[idx].PTY;
                            //图上线的显示title为与此线相连的node的title，增加此变量来标识links的显示title
                            record.title = node[idx].CAND_NAME;
                            record.Sum = options.dataSum[options.categoryID[ids[idy]]['dept_name']];
                            link.push(record);
                            break;
                        }
                    }
                }
            }
            options.links = link;
        }
    }
}]);
