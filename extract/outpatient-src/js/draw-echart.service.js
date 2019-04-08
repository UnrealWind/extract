angular.module("infi-basic").service('DrawEchartService',['EchartOptionService','DataAdapter','SYS',function (EchartOptionService,DataAdapter,SYS) {
    //设置初始化,通过不同类型判断绘制不同图形
    var that = this;
    that.drawChart = function (type,id,data,callback) {
        var myChart = echarts.init(document.getElementById(id)),option;
        if(type == 'nested'){
            option = EchartOptionService.setNestedRingOption(data);
        }else if(type == 'pie'){
            option = EchartOptionService.setPieOption(data);
        }else if(type == 'bar'){
            option = EchartOptionService.setBarOption(data);
        }else if(type == 'verticalBar'){
            option = EchartOptionService.setVerticalBarOption(data);
        }else if(type == 'line'){
            option = EchartOptionService.setLineOption(data);
        }else if(type == 'line-bar'){
            option = EchartOptionService.setLineBarOption(data);
        }else if(type == 'verticalStackBar'){
            option = EchartOptionService.setVerticalStackBarOption(data);
        }else if(type == 'region'){
            option = EchartOptionService.setRegionOption(data);
        }

        myChart.setOption(option,true);  //有时候echarts不绘图,加上true后就重新绘图了

        //页面大小发生改变时重新绘制图形,引用外部文件'html-resize.js',绘图div大小改变则重新绘图
        $('.infi-main').resize(function(){
            myChart.resize(option);
            //setTableHeightCommon("leftTableNum","rightTableNum");  //挂号监控-现场预约他日号源监控
        });
        
        //只有特定的图形可以点击联动
        if(callback){
            myChart.off('click');  //防止绑定多次,重复调用
            myChart.on('click',  function eConsole(param) {
                callback(param.data.type);
            });
        }

        /**
         * 左右两侧的table在页面发生大小变化时仍然等高
         * @param first
         * @param second
         */
        function setTableHeightCommon(first,second) {
            var leftHeight = $('#'+first).height(),
                rightHeight = $('#'+second).height();
            if(leftHeight>-1&&rightHeight>-1){
                if(leftHeight > rightHeight){
                    $('#'+second).height(leftHeight);
                }else if(leftHeight < rightHeight){
                    $('#'+first).height(rightHeight);
                }
            }
        }
    }

    that.getChartData = function (type,id,original,callback,callbackKey) {
        if(type == 'nested'){
            changeData(DataAdapter.transformNested);
        }else if(type == 'pie'){
            changeData(DataAdapter.transformPie);
        }else if(type == 'bar'){

        }else if(type == 'verticalBar'){
            changeData(DataAdapter.transformBar);
        }else if(type == 'line'){
            changeData(DataAdapter.transformLine);
        }else if(type == 'line-bar'){
            changeData(DataAdapter.transformLineBar);
        }else if(type == 'verticalStackBar'){
            changeData(DataAdapter.transformVerticalStackBar);
        }else if(type == 'region'){
            changeData(DataAdapter.transformRegion);
        }
        
        function changeData(transform) {
            transform(original);
            if(original.status == SYS.STATUS_SUCCESS){
                $("#"+id).removeAttr('_echarts_instance_');
                that.drawChart(type,id,original,callback);
                callback?callback(original.data.result[0][callbackKey]):undefined;
            }else{
                $("#"+id).text(original.description);
                callback?callback():undefined;
            }
        }
    }
}]);