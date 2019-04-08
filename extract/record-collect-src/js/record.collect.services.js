angular.module('infi-basic').service('RecordCollectService', ['$http', 'SYS','$routeParams', function ($http, SYS,$routeParams) {
    // 所有页面的数据请求的service 文件
    this.getBasicInfo = function (params) {
        return $http({
            method:'get',
            url:SYS.url +'basic/info/'+params.patientId+'/'+params.visitId,
        }).then(function (msg) {
            return msg.data;
        });
    };

    this.saveBasicInfo = function (params,data,mark) {

        //这里由于用了jq的插件，需要强制同步一下现住址的数据
        data['presentAddress'] = $('.presentAddress').val();
        var param = {};
        mark?param['filter_flag'] = 'save':'';
        return $http({
            method:'put',
            url:SYS.url +'basic/info/'+params.patientId+'/'+params.visitId,
            data:data,
            params:param
        }).then(function (msg) {
            return msg.data;
        });
    };

    this.getTemplateData = function (params) {
        return $http({
                method:'put',
                url:SYS.url +'view/right/resource/'+params.resourceId+'/moduleTemplate/'+params.moduleTemplate,
                params:{
                    filter_templateId:params.templateId,
                    filter_xlPatientId:params.patientId,
                    filter_xlVisitId:params.visitId,
                    filter_xlPreTemplateId:params.preTemplateId
                }
            }).then(function (msg) {
            msg.data.data?msg.data.data.forEach(function (n,i) {
                n.data.forEach(function (ni,ii) {
                    ni?ni['moduleId'] = n.moduleId:'';
                })
            }):'';
            return msg.data;
        });
    };

    this.getAttr = function (params,moduleId) {
        return $http({
            method:'get',
            url:SYS.url +'view/left/resource/'+params.resourceId+'/module/'+moduleId,
            params:{
                filter_templateId:params.templateId,
                filter_xlPatientId:params.patientId,
                filter_xlVisitId:params.visitId
            }
        }).then(function (msg) {
            return msg.data;
        });
    };

    this.addQuestion = function (attrs,attr,params) {
        var that = this;

        return $http({
            method:'get',
            url:SYS.url +'view/left/resource/'+params.resourceId+'/handler/'+params.data.kid+'/kid/'+attr.kid,
            params:{
                filter_templateId:params.templateId,
                filter_xlPatientId:params.patientId,
                filter_xlVisitId:params.visitId
            }
        }).then(function (msg) {
            msg.data.data?attr.childs = msg.data.data.childs:'';
            that.addAttr(attrs,attr,params);
        });
    };

    this.saveLeft = function (workSpaceInfo,wholeInfo) {
        var that = this;

        //第一次确认，不含data的不进行后续操作
        if(!workSpaceInfo.data || workSpaceInfo.data.childs==null){
            return
        };
        var targetData = null;

        /* 在这里进行判断如果是主诉的话则需要同时向主诉和现病史之中存储这份数据*/
        if(workSpaceInfo.data.kid == 1 ){
            workSpaceInfo.data.childs.forEach(function (n,i) {
                n.active?targetData = n:'';
            });
            targetData?save([1]):'';
        }else if(workSpaceInfo.data.moduleId == 3 ||workSpaceInfo.data.moduleId == 4){
            that.saveAll(workSpaceInfo,[workSpaceInfo.data],wholeInfo)
        }else if( workSpaceInfo.data.moduleId == 2){
            that.saveAll(workSpaceInfo,wholeInfo.templateData,wholeInfo)
        }else if(workSpaceInfo.data.moduleId == 5||workSpaceInfo.data.moduleId == 6){
            that.saveAll(workSpaceInfo,[wholeInfo.templateData[workSpaceInfo.data.moduleId-1]],wholeInfo)
        }else{
            workSpaceInfo.data.childs.forEach(function (n,i) {
                n.active?targetData = n:'';
            });
            targetData?save([workSpaceInfo.data.kid]):'';
        };

        function save(arrId) {
            arrId.forEach(function (n,i) {
                $http({
                    method:'put',
                    url:SYS.url +'view/left/resource/'+workSpaceInfo.resourceId+'/handler/'+n+'/kid/'+targetData.kid,
                    params:{
                        filter_templateId:workSpaceInfo.templateId,
                        filter_xlPatientId:workSpaceInfo.patientId,
                        filter_xlVisitId:workSpaceInfo.visitId
                    },
                    data:targetData
                }).then(function (msg) {

                    var has = false;
                    if(workSpaceInfo.data.moduleId == 1 && n == 1){
                        !wholeInfo.templateData[1].data[0].childs?wholeInfo.templateData[1].data[0].childs = []:'';
                        wholeInfo.templateData[1].data[0].childs.forEach(function (n,i) {
                            n.kid == targetData.kid?(n.childs=targetData.childs,has = true):'';
                        })
                        !has?wholeInfo.templateData[1].data[0].childs.push(targetData):'';
                    }

                    that.getDiagnosisData(workSpaceInfo.patientId,workSpaceInfo.visitId,wholeInfo);
                });
            })
        }

        function saveAll(workSpaceInfo) {

        }

    };
    this.saveAll = function (params,data,wholeInfo,mark) {
        var that = this;
        var param = {
            filter_xlPatientId:params.patientId,
            filter_xlVisitId:params.visitId,
            filter_templateId:params.templateId,
        }
        mark?param['filter_flag'] = 'save':'';
        return $http({
            method:'put',
            url:SYS.url +'view/right/save',
            params:param,
            data:data
        }).then(function (msg) {

            that.getDiagnosisData(params.patientId,params.visitId,wholeInfo);
            return msg.data;
        });
    }

    /**
     * 保存处方
     */
    this.savePrescript = function(data, param,mark,initSaveMark) {
        var map = {
            'exams': {
                type: 'arr'
            },
            'tests': {
                type: 'arr'
            },
            'drugs': {
                type: 'arr'
            },
            'chinesePrescription': {
                type: 'obj',
                nextLevelKey: 'chineseDrugs'
            }
        }

        var copyData = angular.copy(data)

        angular.forEach(map, function(val, key) {
            if (val.type == 'arr') {
                copyData[key].forEach((sval) => {
                    delete sval.id
                })
            } else if (val.type == 'obj') {
                delete copyData[key].id

                copyData[key][val.nextLevelKey].forEach((subVal) => {
                    delete subVal.id
                })

            }
        })
        var url;
        mark ?url = `${SYS.prescriptUrl}prescribe?xlPatientId=${param.xlPatientId}&xlVisitId=${param.xlVisitId}&filter_flag=save`
            :url = `${SYS.prescriptUrl}prescribe?xlPatientId=${param.xlPatientId}&xlVisitId=${param.xlVisitId}`

        initSaveMark == 1? url+='&init='+initSaveMark:"";
        return $http.put(url, copyData).then(function(msg) {
            return msg.data
        })
    }

    this.addAttr = function(attrs,attr,workSpaceInfo) {
        attrs.childs.forEach(function (n,i) {
            n['active'] = false;
        });
        attr['active'] = true;
        //中文标示
        if(attrs.moduleId == '6' || attrs.moduleId == '5') return;
        workSpaceInfo.data = attrs;
        workSpaceInfo.mark = 'question';
    }

    /**
     * 既往史、过敏史 搜索方法
     */
    this.searchFilter = function(labelKid, kw, params) {
        return $http({
            method:'get',
            url:SYS.url +'view/handler/'+labelKid+'/search',
            params:{
                filter_xlPatientId:params.patientId,
                filter_xlVisitId:params.visitId,
                filter_LIKE_searchValue:kw
            }
        }).then(function (msg) {
            if (msg.data.status == 'ok') {
                return msg.data.data
            } else {
                return null
            }
        },function (error) {
            return null
        });
    }

    this.search = function (labelKid,val,params) {
        return $http({
            method:'get',
            url:SYS.url +'view/handler/'+labelKid+'/search',
            params:{
                filter_xlPatientId:params.patientId,
                filter_xlVisitId:params.visitId,
                filter_LIKE_searchValue:val
            }
        }).then(function (msg) {
            return msg.data;
        });
    }

    this.getTemplateList= function (userId,val) {
        return $http.get(SYS.url +'template/all?userId='+userId+'&type='+val).then(function (msg) {
            return msg.data;
        });
    }

    this.getDiagnosisData = function (patientId,visitId,wholeInfo,workSpaceInfo) {
        return $http({
            method:'get',
            url:SYS.url +'view/diag/result',
            params:{
                filter_xlPatientId:patientId,
                filter_xlVisitId:visitId
            }
        }).then(function (msg) {
            msg.data.data = JSON.parse(msg.data.data);
            wholeInfo.diagnosisData = msg.data.data;

            !wholeInfo.diagnosisData?workSpaceInfo.showRight = false:'';
            console.log(wholeInfo.diagnosisData,'diagnosisData')
        });
    }

    this.getIllModalData = function (data) {
        return $http({
            method:'put',
            url:`${SYS.treatUrl}form/data?recordId=${$routeParams.recordId}`,
            data:data
        }).then(function (msg) {
            return msg.data
        });
    }

    this.getIllData = function (data) {
        return $http({
            method:'put',
            url:`${SYS.treatUrl}form/recommend`,
            params:'',
            data:data
        }).then(function (msg) {
            return msg.data
        });
    }

    this.getPlanData = function (planId) {
        return $http({
            method:'get',
            url:`${SYS.treatUrl}recommend/plan/explain/${planId}`,
            params:''
        }).then(function (msg) {
            return msg.data
        });
    }

    this.getPlanTarget = function (planId) {
        return $http({
            method:'get',
            url:`${SYS.treatUrl}treatment/target/${planId}`,
            params:''
        }).then(function (msg) {
            return msg.data
        });
    }

    this.getPage = function (str,planId) {
        if(str == 'guide'){
            url = `${SYS.treatUrl}reference/guide/page/`
        }else if(str == 'drug'){
            url = `${SYS.treatUrl}drug/literature/page/`
        }else if(str == 'disease'){
            url = `${SYS.treatUrl}plan/literature/page/`
        }
        return $http({
            method:'get',
            url:url+planId,
            params:''
        }).then(function (msg) {
            return msg
        });
    }

    this.bindPrint = function(){
        jqprintDiv();
        var HKEY_Root, HKEY_Path, HKEY_Key;
        HKEY_Root = "HKEY_CURRENT_USER";
        HKEY_Path = "\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
        function jqprintDiv() {
            $(".print").print();
        }

        function PageSetup_Null() {
            try {
                var Wsh = new ActiveXObject("WScript.Shell");
                HKEY_Key = "header";
                Wsh.RegWrite(HKEY_Root + HKEY_Path + HKEY_Key, "");
                HKEY_Key = "footer";
                Wsh.RegWrite(HKEY_Root + HKEY_Path + HKEY_Key, "");
            }
            catch (e) { }
        }
    };

    this.changeStatus = function (arr,moduleId) {
        arr.forEach(function (n,i) {
            n.moduleId == moduleId?n.status == 'close'?n.status = 'open':n.status = 'close':'';
        })
    }


}]);
