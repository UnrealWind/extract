angular.module('infi-basic')
    .service('DataService',['$http','SYS',function($http,SYS) {
        //建立模型中的空值处理
        this.ajaxModelNullProcess = function(id){
            return $http({
                method:'get',
                url:SYS.url+'analyze/build/deal/data/'+id
            }).then(function(data){
                return data.data;
            });
        }

        //F5
        this.ajaxModelF5Data = function(id){
            return $http({
                method:'get',
                url:SYS.url+'analyze/build/clear/cache/'+id
            }).then(function(data){
                return data.data;
            });
        }

        //建立模型取消左侧选中的数据
        this.ajaxModelUnchecked = function(id,searchWord){
            return $http({
                method:'get',
                url:SYS.url+'analyze/build/clear/data/'+id,
                params:{
                    searchWord:searchWord
                }
            }).then(function(data){
                return data.data;
            });
        }

        //探查1搜索
        this.ajaxExplorationSetDataSearch = function(id,searchWord){
            return $http({
                method:'get',
                url:SYS.url+'data/head/search/orig/'+id,
                params:{
                    searchWord:searchWord
                }
            }).then(function(data){
                return data.data
            })
        }

        //已建模型 -- delete
        this.ajaxCompleteData = function(id){
            return $http({
                method:'get',
                url:SYS.url+'analyze/model/data/'+id,
            }).then(function(data){
                return data.data
            });
        }
        //已建模型 -- delete
        this.ajaxCompleteDelete = function(id){
            return $http({
                method:'get',
                url:SYS.url+'analyze/build/data/delete/'+id,
            }).then(function(data){
                return data.data
            });
        }

        //已建模型 -- list
        this.ajaxCompleteDataList = function(page){
            return $http({
                method:'get',
                url:SYS.url+'analyze/build/data/page',
                params:{
                    filter_pageNo:page,
                    filter_pageSize:10
                }
            }).then(function(data){
                return data.data
            });
        }

        //建模保存
        this.ajaxTrueSave = function(id,data,name){
            return $http({
                method:'post',
                url:SYS.url+'analyze/build/save/'+id,
                data:{
                    buildResult:data,
                    modelName:name
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(obj) {
                    //console.log(obj);
                    var str = [];
                    strp = JSON.stringify(obj.modelName);
                    strps = JSON.stringify(obj.buildResult);
                    str.push(encodeURIComponent('modelName') + "=" + encodeURIComponent(strp));
                    str.push(encodeURIComponent('buildResult') + "=" + encodeURIComponent(strps));
                    return str.join("&");
                }
            }).then(function(data){
                return data.data
            });
        }

        //建模 -- 单条数据
        this.ajaxModelDataLeft = function(id,data){
            return $http({
                method:'get',
                url:SYS.url+'analyze/build/get/data/'+id,
                params:{
                    searchWord:data
                }
            }).then(function(data){
                return data.data
            });
        }

        //筛选设置 -- detailNext
        this.ajaxFilterSetDetailNext = function(id){
            return $http({
                method:'get',
                url:SYS.url+'filter/save/data/'+id
            }).then(function(data){
                return data.data;
            });
        }

        //筛选设置 -- detailData
        this.ajaxFilterSetListDetails = function(filterId,pageNo){
            return $http({
                method:'get',
                url:SYS.url+'filter/get/page/'+filterId,
                params:{'filter_pageNo':pageNo,'filter_pageSize':10}
            }).then(function(data){
                return data.data;
            });
        }
        //筛选设置 -- 平衡正负确定
        this.ajaxFilterSetSaves = function(id,ids,groupCompare){
            return $http({
                method:'get',
                url:SYS.url+'filter/save/model/'+id,
                params:{
                    filterIds:ids,
                    groupCompare:groupCompare
                }
            }).then(function(data){
                return data.data;
            });
        }

        //筛选设置 -- 修改
        this.ajaxFilterSetModify = function(filterId){
            return $http({
                method:'get',
                url:SYS.url+'filter/get/'+filterId,
            }).then(function(data){
                return data.data;
            });
        }

        //筛选设置 -- 保存 选择项
        this.ajaxFilterSetSaveSDdata = function(filterId,data){
            return $http({
                method:'get',
                url:SYS.url+'filter/save/type/'+filterId,
                params:{
                    type:data
                }
            }).then(function(data){
                return data.data;
            });
        }
        //筛选设置 -- 确定
        this.ajaxFilterSetSaveData = function(ids){
            return $http({
                method:'post',
                url:SYS.url+'filter/get/count/'+ids,
            }).then(function(data){
                return data.data;
            });
        }

        //筛选设置 -- 删除
        this.ajaxFilterSetDelete = function(filterId){
            return $http({
                method:'post',
                url:SYS.url+'filter/delete/data/'+filterId,
            }).then(function(data){
                return data.data;
            });
        }

        //筛选设置 -- 保存
        this.ajaxFilterSetSave = function(filterId,data){
            return $http({
                method:'post',
                url:SYS.url+'filter/save/record',
                data:data
            }).then(function(data){
                return data.data;
            });
        }

        //筛选设置 -- 新增筛选设置
        this.ajaxFilterSetAddFilter = function(id){
            return $http({
                method:'get',
                url:SYS.url+'filter/create/'+id
            }).then(function(data){
                return data.data;
            });
        }

        //筛选设置 -- 列表数据
        this.ajaxFilterSetLisData = function(id){
            return $http({
                method:'get',
                url:SYS.url+'filter/get/list/'+id
            }).then(function(data){
                return data.data;
            });
        }

        // 数据预处理 -- 下一步
        this.ajaxVariableSetDatanext = function(id,data){
            return $http({
                method:'post',
                url:SYS.url+'analyze/deal/data/save/'+id
            }).then(function(data){
                return data.data;
            });
        }

        //数据预处理 -- 空值 处理
        this.ajaxDataPretreatmentDataProcess = function(id,data,way,type){
            return $http({
                method:'get',
                url:SYS.url+'analyze/deal/data/deal/'+id,
                params:{
                    ruleCode:data,
                    way:way,
                    headType:type
                }
            }).then(function(data){
                return data.data;
            });
        }

        // 数据预处理 -- 空值 点击变量请求数据
        this.ajaxDataPretreatmentDataDK = function(id,data,type){
            return $http({
                method:'get',
                url:SYS.url+'analyze/deal/data/get/'+id,
                params:{
                    ruleCode:data,
                    headType:type
                }
            }).then(function(data){
                return data.data;
            });
        }

        //变量设置 -- 全部数据
        this.ajaxVariableSetData = function(id){
            return $http({
                method:'get',
                url:SYS.url+'data/head/get/'+id
            }).then(function(data){
                return data.data;
            });
        }
        //变量设置 -- 搜索
        this.ajaxVariableSetDataSearch = function(id,searchWord){
            //console.log(searchWord);
            return $http({
                method:'get',
                url:SYS.url+'data/head/search/'+id,
                params:{
                    searchWord:searchWord
                }
            }).then(function(data){
                return data.data
            })
        }
        //变量设置 -- 保存
        this.ajaxVariableSetDataSave = function(id,data){
            //console.log(data);
            return $http({
                method:'post',
                url:SYS.url+'data/head/update/'+id,
                data:data
            }).then(function(data){
                return data.data
            });
        }

        //探查1前
        this.ajaxDataSelectExploration = function(id){
            return $http({
                method:'get',
                url:SYS.url+'data/head/get/orig/'+id
            }).then(function(data){
                return data.data
            })
        }
        //原始 --> 探查1 data
        this.ajaxConditionData = function(id,data){
            return $http({
                method:'get',
                url:SYS.url+'analyze/get/data/'+id,
                params:{
                    searchWord:data
                }
            }).then(function(data){
                return data.data
            })
        }
        //修改 --> 探查1 data
        this.ajaxConditionXiuGaiData = function(id,data){
            return $http({
                method:'get',
                url:SYS.url+'analyze/model/get/data/'+id,
                params:{
                    searchWord:data
                }
            }).then(function(data){
                return data.data
            })
        }
        
        //数据选择列表数据
        this.ajaxDataSelectList = function(page){
            //console.log(page);
            if(page == '' || page == undefined){
                page = 1;
            }
            return $http({
                method:'get',
                url:SYS.url+'analyze/data/page',
                params:{
                    filter_pageNo:page,
                    filter_pageSize:5
                }
            }).then(function(data){
                return data.data;
            });
        }
        //数据选择列表数据
        this.ajaxDataSelectNext = function(id){
            return $http({
                method:'get',
                url:SYS.url+'analyze/model/data/create/'+id
            }).then(function(data){
                return data.data;
            });
        }

        //数据选择数据删除
        this.ajaxDataSelectInviteDelete = function(id){
            return $http({
                method:'post',
                url:SYS.url+'analyze/data/delete/'+id
            }).then(function(data){
                return data.data;
            });
        }
        // //数据选择 -- 原始数据
        // this.ajaxDataSelectListDetails = function(id){
        //     return $http({
        //         method:'get',
        //         url:SYS.url+'analyze/data/load/'+id
        //     }).then(function(data){
        //         return data.data;
        //     });
        // }
        //数据选择 -- 原始数据
        this.ajaxDataSelectListDetails = function(id,page){
            return $http({
                method:'get',
                url:SYS.url+'analyze/data/load/page/'+id,
                params:{
                    filter_pageNo:page,
                    filter_pageSize:10
                }
            }).then(function(data){
                return data.data;
            });
        }

        // // 数据选择 -- 修改后的数据
        // this.ajaxDataSelectListModifyDetails = function(id){
        //     return $http({
        //         method:'get',
        //         url:SYS.url+'analyze/model/data/get/'+id
        //     }).then(function(data){
        //         return data.data;
        //     });
        // }

        // 数据选择 -- 修改后的数据
        this.ajaxDataSelectListModifyDetails = function(id,page){
            return $http({
                method:'get',
                url:SYS.url+'analyze/model/data/page/'+id,
                params:{
                    filter_pageNo:page,
                    filter_pageSize:10
                }
            }).then(function(data){
                return data.data;
            });
        }
        
        //数据选择 -- 修改下一步
        this.ajaxDataSelectModifyNext = function(id){
            return $http({
                method:'get',
                url:SYS.url+'analyze/model/modify/create/'+id
            }).then(function(data){
                return data.data;
            });
        }

        //获取比例
        // this.ajax
        
        this.ajaxDataDeals = function(title,data){
            var datas = {
                'title':title,
                'exp':data
            }
            return $http({
                method:'post',
                url:SYS.urls,
                data:datas,
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(obj) {
                    //console.log(obj);
                    var str = [];
                    strp = JSON.stringify(obj.exp);
                    strps = JSON.stringify(obj.title);
                    str.push(encodeURIComponent('exp') + "=" + encodeURIComponent(strp));
                    str.push(encodeURIComponent('title') + "=" + encodeURIComponent(strps));
                    return str.join("&");
                }
            }).then(function(data){
                return data.data
            });
        }
        this.ajaxSingleFactor = function(title,exp,ctrl,ratio){

            return $http({
                method:'post',
                url:SYS.urls,
                data:{
                    title:title,
                    exp:exp,
                    ctrl:ctrl,
                    ratio:ratio
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(obj) {
                    //console.log(obj);
                    var str = [];
                    strp = JSON.stringify(obj.exp);
                    strps = JSON.stringify(obj.title);
                    strpss = JSON.stringify(obj.ctrl);
                    strpsss = JSON.stringify(obj.ratio);
                    str.push(encodeURIComponent('exp') + "=" + encodeURIComponent(strp));
                    str.push(encodeURIComponent('title') + "=" + encodeURIComponent(strps));
                    str.push(encodeURIComponent('ctrl') + "=" + encodeURIComponent(strpss));
                    str.push(encodeURIComponent('ratio') + "=" + encodeURIComponent(strpsss));
                    return str.join("&");
                }
            }).then(function(data){
                return data.data
            });
        }

        //多重共线性计算
        this.ssss = function(title,exp,ctrl,ratio){

            return $http({
                method:'post',
                url:SYS.moreTraning,
                data:{
                    title:title,
                    exp:exp,
                    ctrl:ctrl,
                    ratio:ratio
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(obj) {
                    //console.log(obj);
                    var str = [];
                    strp = JSON.stringify(obj.exp);
                    strps = JSON.stringify(obj.title);
                    strpss = JSON.stringify(obj.ctrl);
                    strpsss = JSON.stringify(obj.ratio);
                    str.push(encodeURIComponent('exp') + "=" + encodeURIComponent(strp));
                    str.push(encodeURIComponent('title') + "=" + encodeURIComponent(strps));
                    str.push(encodeURIComponent('ctrl') + "=" + encodeURIComponent(strpss));
                    str.push(encodeURIComponent('ratio') + "=" + encodeURIComponent(strpsss));
                    return str.join("&");
                }
            }).then(function(data){
                return data.data
            });
        }

        //模型训练
        this.modelTrain = function(title,exp,ctrl,ratio){

            return $http({
                method:'post',
                url:SYS.modelTrain,
                data:{
                    title:title,
                    exp:exp,
                    ctrl:ctrl,
                    ratio:ratio
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(obj) {
                    //console.log(obj);
                    var str = [];
                    strp = JSON.stringify(obj.exp);
                    strps = JSON.stringify(obj.title);
                    strpss = JSON.stringify(obj.ctrl);
                    strpsss = JSON.stringify(obj.ratio);
                    str.push(encodeURIComponent('exp') + "=" + encodeURIComponent(strp));
                    str.push(encodeURIComponent('title') + "=" + encodeURIComponent(strps));
                    str.push(encodeURIComponent('ctrl') + "=" + encodeURIComponent(strpss));
                    str.push(encodeURIComponent('ratio') + "=" + encodeURIComponent(strpsss));
                    return str.join("&");
                }
            }).then(function(data){
                return data.data
            });
        }

        this.ajaxDanYinShuFenXi = function(title,exp,ctrl,ratio){

            return $http({
                method:'post',
                url:SYS.urlsss,
                data:{
                    title:title,
                    exp:exp,
                    ctrl:ctrl,
                    ratio:ratio
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                transformRequest: function(obj) {
                    //console.log(obj);
                    var str = [];
                    strp = JSON.stringify(obj.exp);
                    strps = JSON.stringify(obj.title);
                    strpss = JSON.stringify(obj.ctrl);
                    strpsss = JSON.stringify(obj.ratio);
                    str.push(encodeURIComponent('exp') + "=" + encodeURIComponent(strp));
                    str.push(encodeURIComponent('title') + "=" + encodeURIComponent(strps));
                    str.push(encodeURIComponent('ctrl') + "=" + encodeURIComponent(strpss));
                    str.push(encodeURIComponent('ratio') + "=" + encodeURIComponent(strpsss));
                    return str.join("&");
                }
            }).then(function(data){
                return data.data
            });
        }


        
        
        
    }])
    .service('MethodService',['$http','SYS',function($http,SYS) {
        this.homeNavHeader = function(url,data){
            //console.log(url,1);
            //console.log(data,2);
            var status = true;
            for(var i = 0 ; i < data.length ; i++){
                if(url.indexOf(data[i].navUrl) > 0){
                    data[i].className = 'infi-header-active';
                    status = false;
                }else if(status){
                    data[i].className = 'infi-analysis-modifyed';
                }else if(!status){
                    data[i].className = '';
                }
            }
        }

        //当前时间
        this.getNowFormatDate = function() {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            // + " " + date.getHours() + seperator2 + date.getMinutes()
            // + seperator2 + date.getSeconds()
                ;
            return currentdate;
        }

        //变量设置 -- 保存的数据
        this.variableSetProcessData = function(data,variableName,variableValue){
            for(var i = 0 ; i < data.length ; i++){
                data[i].name =  variableName[i].name;
                data[i].type =  variableValue[i].value;
            }
            return data
        }
    }]);