angular.module('infi-basic').service('DetailsService',['$http','SYS','CheckDeviceService', function($http,SYS,CheckDeviceService){

    /**
     * 获取器官的定位
     * @returns {*}
     */
    this.getOrganJson = function(jsonName){
        return $http.get(SYS.jsonUrl + jsonName).then(function(msg){
            return msg.data;
        })
    };

    /**
     * 获取器官的json
     * @returns {*}
     */
    this.getPositionJson = function(){
        return $http.get(SYS.jsonUrl + 'position.json').then(function(msg){
            return msg.data;
        })
    };

    /**
     * 获取基本信息
     * @param filter
     * @returns {*}
     */
    this.getInfo = function(filter){
        return $http.get(SYS.url + 'patient/info?filter_wuhan='+filter.wuhan+'&filter_identityNum='+filter.identityId).then(function(msg){
            return msg.data;
        });
    };

    /**
     * 获取器官状态
     * @param filter
     */
    this.getHealthyChart = function(filter){
        var url = SYS.url + 'exhibition/'+filter.patiId+'/'+filter.patiVisitId+'/healthyPortrait';
        var params = [];
        if(filter.signature) {
            params.push("signature="+filter.signature);
        }
        if(filter.caseId){
            params.push("caseId="+filter.caseId);
        }
        if(params.length>0){
            url = url + "?" + params.join("&");
        }
        return $http.get(url).then(function(msg){
            return msg.data;
        })
    };

    /**
     * 获取异常项目(检查,检验)
     * @param filter
     */
    this.getExceptionProject = function(filter){

        var url = SYS.url + 'exhibition/'+filter.patiId+'/'+filter.patiVisitId+'/exceptionProject';
        var params = [];
        if(filter.signature) {
            params.push("signature="+filter.signature);
        }
        if(filter.caseId){
            params.push("caseId="+filter.caseId);
        }
        if(params.length>0){
            url = url + "?" + params.join("&");
        }
        return $http.get(url).then(function(msg){
            return msg.data;
        });
    };

    /**
     * 获取异常解读
     * @param filter
     * @returns {*}
     */
    this.getAbnormalInterpretation = function(filter,type){
        return $http({
            url:SYS.url + 'exhibition/interpretation',
            method:'get',
            params:filter
        }).then(function(msg){
            return msg.data;
        });
    };
    
    //获取异常解读的折线图数据
    this.drowEcharts = function (filter,patiId,patiVisitId) {
        return $http({
            url: SYS.url + 'exhibition/test/' + patiId + '/' + patiVisitId + '/' + filter.keyName,
            method: 'get'
        }).then(function (msg) {
            var arrDate = [], arrValue = [],type = 'line';
            msg.data.data.forEach(function (n,i) {
                arrDate.push(n.label);
                arrValue.push(n.value);
            });
            arrDate.length>1? type = 'line': type = 'bar';
            draw(arrDate,arrValue,type,filter.keyName);
        });
        function draw(arrDate,arrValue,type,name) {
            require(['echarts','echarts/chart/line','echarts/chart/bar'],function(echarts , line,bar){
                var myChart = echarts.init(document.getElementById('checkout'));
                var option = {
                    xAxis: {
                        type: 'category',
                        data: arrDate,
                        axisTick: {
                            alignWithLabel: true
                        },
                        splitLine: {
                            show:true
                        }
                    },
                    yAxis: {
                        type: 'value'
                    },
                    grid: {
                        height: '50%',
                        y: '20%',
                        x:'10%'
                    },
                    tooltip:{
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    series: [{
                        data: arrValue,
                        type: type,
                        name: name,
                        itemStyle: {
                            normal: {
                                color: '#ff7f50'
                            }
                        },
                        barWidth: '20'
                    }]
                };
                myChart.setOption(option);
            });
        }
    };
    /**
     * 获取诊断
     * @returns {*}
     */
    this.getDiagnosis = function(filter){
        // return $http.get(SYS.url + 'exhibition/'+filter.patiId+'/'+filter.patiVisitId+'/diag?signature=signature&caseId=1').then(function(msg){
        //     if(msg.status == 'fail'){
        //         var mss = {
        //             data:msg.msg,
        //             status:msg.status
        //         };
        //         return mss;
        //     }else{
        //         return msg.data;
        //     }
        // });
        var url = SYS.url + 'exhibition/'+filter.patiId+'/'+filter.patiVisitId+'/diag';
        var params = [];
        if(filter.signature) {
            params.push("signature="+filter.signature);
        }
        if(filter.caseId){
            params.push("caseId="+filter.caseId);
        }
        if(params.length>0){
            url = url + "?" + params.join("&");
        }
        return $http.get(url).then(function(msg){
            return msg.data;
        })
    };

    /**
     * 获取健康诊断
     * @param filter
     * @returns {*}
     */
    this.getHealthy = function(filter){
        // return $http.get(SYS.url + 'exhibition/' +filter.patiId+'/'+ filter.patiVisitId +'/'+ filter.url +'?signature=signature&caseId=1').then(function(msg){
        // return $http.get(SYS.url + 'exhibition/' +filter.patiId+'/'+ filter.patiVisitId +'/'+ filter.url).then(function(msg){
        //     if(msg.status == 'fail'){
        //         var mss = {
        //             data:msg.msg,
        //             status:msg.status
        //         };
        //         return mss;
        //     }else{
        //         return msg.data;
        //     }
        // })
        var url = SYS.url + 'exhibition/' +filter.patiId+'/'+ filter.patiVisitId +'/'+ filter.url;
        var params = [];
        if(filter.signature) {
            params.push("signature="+filter.signature);
        }
        if(filter.caseId){
            params.push("caseId="+filter.caseId);
        }
        if(params.length>0){
            url = url + "?" + params.join("&");
        }
        return $http.get(url).then(function(msg){
            return msg.data;
        })
    };

    /**
     * 将json数据和返回的器官状态整合成图标用到的数据
     */
    this.filterChart = function(organJson,positionJson,healthyChart){
        var size = 0;
        if(CheckDeviceService.checkDevice() == "pc"){//设置图片大小，手机端屏幕比较小，所以图片小
            size = 40;
        }else{
            size = 20;
        }
        var data = {
            markPointData:[],
            markLinkData:[]
        };
        angular.forEach(organJson.children,function(json){
            var image = json.icon,describe=json.name + '正常';
            angular.forEach(healthyChart.organsInfo,function(chart){
                if(json.name == chart.organsName){
                    if(chart.status == "异常"){
                        image = json.icon + "-danger";
                        describe = chart.msg;
                    }
                }
            });
            data.markPointData.push({
                name:json.name,
                value:'',
                discribe:describe,
                geoCoord:json.position[1],
                symbol:'image://../../src/image/organ/'+image+'.png',
                symbolSize:size
            });
            var position = [
                {geoCoord:json.position[0]},
                {geoCoord:json.position[1]}
            ];
            data.markLinkData.push(position);
        });
        angular.forEach(healthyChart.partsInfo,function(part){
            angular.forEach(positionJson,function(position){
                if(part.partName == position.name){
                    position.value = 100;
                }
            })
        });
        data.series = positionJson;
        return data;
    }
    
}]);