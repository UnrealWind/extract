angular.module('infi-basic').service('RecordService', ['$http', 'SYS', function ($http, SYS) {
    // 所有页面的数据请求的service 文件
    this.ajaxList = function (filter) {
        return $http.get(SYS.titleUrl + 'list.json').then(function (data) {
            return data.data;
        });
    };

    this.ajaxColumns = function (name) {
        return $http.get(SYS.titleUrl + name + '.columns.json').then(function (data) {
            return data.data;
        });
    };

    /**
     * 获取默认值json
     * @returns {*}
     */
    this.getDefaultValue = function () {
        var url = SYS.titleUrl + 'record.default.value.json';
        return $http.get(url).then(function success(msg) {
            return msg.data;
        })
    };

    /**
     * 获取门诊信息
     * @returns {*}
     */
    this.getCaseList = function (type, patientId, xlMedicalId) {
        var url = SYS.url + 'outpatientinfo/crud/' + patientId + '/' + xlMedicalId;
        //现在请求的是本地的数据
        return $http({
            method: 'get',
            url: url
        }).then(function success(msg) {
            convertObject2BooleanValue(type, msg.data.data);
            return {
                type: type,
                data: msg.data
            };
        })
    };

    this.getCaseInfo = function (patientId, xlMedicalId) {
        var url = SYS.url + 'outpatientinfo/crud/' + patientId + '/' + xlMedicalId;
        return $http({
            method: 'get',
            url: url
        }).then(function success(msg) {
            return msg.data;
        })
    };

    this.getSigle = function (patientId) {
        var url = SYS.url + 'firstentry/basicinfo/crud/' + patientId;
        return $http({
            method: 'get',
            url: url
        }).then(function success(msg) {
            return msg.data;
        })
    };

    this.getSigleInfo = function (patientId) {
        var url = SYS.url + 'basic/patient/crud/' + patientId;
        //现在请求的是本地的数据
        return $http({
            method: 'get',
            url: url
        }).then(function success(msg) {
            return msg.data;
        })
    };
    /**
     * 用户录入数据的保存
     * @param filter
     * @param entity
     * @returns {*}
     */
    this.saveFirst = function (filter, entity) {
        var copiedEntity = angular.copy(entity);
        convertBooleanValue2Object(copiedEntity);
        var url = SYS.url + filter;
        return $http.post(url, copiedEntity).then(function (msg) {
            return msg.data;
        })
    };

    this.saveBasicInfo = function (basicInfo) {
        var url = SYS.url + 'outpatientinfo/crud';
        var copiedEntity = angular.copy(basicInfo);
        convertBooleanValue2Object(copiedEntity);
        return $http.post(url, copiedEntity).then(function (msg) {
            return msg.data;
        })
    };

    function convertObject2BooleanValue(type, entity) {
        var idx, idy,
            values;

        if (angular.isArray(entity)) {
            for (idx = 0; idx < entity.length; idx++) {
                convertObject2BooleanValue(type, entity[idx]);
            }
        } else if (entity) {
            for (idx in entity) {
                if (entity[idx] != undefined && isCheckbox(type, idx)) {
                    values = entity[idx].split(',');
                    entity[idx] = {};
                    for (idy = 0; idy < values.length; idy++) {
                        entity[idx][values[idy]] = true;
                    }
                    entity[idx + 'OTHER'] = {};
                }
            }
        }
    }

    /**
     * 这里边放的所有多选项
     * @param type
     * @param name
     * @returns {*}
     */
    function isCheckbox(type, name) {
        var checkboxNames = {
            'basic.contraception': true,
            'basic.pregnancyDisease': true,
            'maternal.maternalComplication': true,
            'previous.pastHistory': true,
            'previous.personalHistory': true,
            'previous.loverFamilyHistory': true,
            'previous.myFamilyHereditaryDisease': true,
            'pregnancy.position': true,
            'dangerous.highRiskScore': true,
            'basic.vaccination': true,
            'basic.position': true,
            'basic.highRiskScore': true,
            'daily.highRiskScore': true,
            'basicInfo.educationClass': true,
            'basic.pregnancyDrug': true
        };

        return checkboxNames[type + '.' + name];
    }

    function convertBooleanValue2Object(entity) {
        var idx, idy,
            originalName, otherName,
            values;

        if (angular.isArray(entity)) {
            for (idx = 0; idx < entity.length; idx++) {
                convertBooleanValue2Object(entity[idx]);
            }
        } else if (entity) {
            for (idx in entity) {
                if (( entity[idx] && angular.isObject(entity[idx])) || ( entity[idx + 'OTHER'] && angular.isObject(entity[idx + 'OTHER']))) {
                    originalName = idx.replace('OTHER', '');
                    otherName = originalName + 'OTHER';
                    values = entity[originalName];

                    if (!angular.isString(values)) {
                        if (values && angular.isObject(values)) {
                            values = [];
                            for (idy in entity[originalName]) {
                                if (entity[originalName][idy] === true) {
                                    values.push(idy);
                                }
                            }
                        }
                        if (entity[otherName] && angular.isObject(entity[otherName])) {
                            values = values && values.push ? values : [];
                            for (idy in entity[otherName]) {
                                if (entity[otherName][idy] === true) {
                                    values.push(idy);
                                }
                            }
                        }
                        entity[originalName] = values.join(',');
                    }


                }
            }
        }

    }

    /**
     * 获取病例列表信息
     * @param page
     * @param num
     * @param keyWords
     * @returns {*}
     */
    this.getPage = function (page, num, keyWords) {
        //var url= SYS.url+'basic/patient/page?page_pageNo='+page+'&page_pageSize='+num+'&filter__depts='+depts;
        var url = SYS.url + 'basic/patient/page?filter__pageNo=' + page + '&filter__pageSize=' + num;
        //var url = SYS.url+'basic/patient/page?filter__pageNo='+page+'&filter__pageSize='+num;
        if (keyWords) {
            if (keyWords.startDate && keyWords.startDate == '') {
                url += '&filter__patiId=' + keyWords.patiId + '&filter__name=' + keyWords.name + '&filter__endDate=' + keyWords.endDate;
            } else if (keyWords.startDate == '' && keyWords.startDate) {
                url += '&filter__patiId=' + keyWords.patiId + '&filter__name=' + keyWords.name + '&filter__startDate=' + keyWords.startDate;
            } else if (keyWords.startDate == '' && keyWords.startDate == '') {
                url += '&filter__patiId=' + keyWords.patiId + '&filter__name=' + keyWords.name;
            } else {
                url += '&filter__patiId=' + keyWords.patiId + '&filter__name=' + keyWords.name + '&filter__startDate=' + keyWords.startDate + '&filter__endDate=' + keyWords.endDate;
            }
        }
        return $http.get(url).then(function success(msg) {
            msg.data.number++;
            return msg.data;
        })
    };

    // 获取tabs的type
    this.getTypeData = function (filter) {
        var url = SYS.titleUrl + filter + '.json';
        return $http({
            method: 'get',
            url: url
        }).then(function success(msg) {
            return msg.data;
        })
    };

    /**
     * 获取首次录入信息数据
     * @param filter
     * @param patientId
     * @param type
     * @returns {*}
     */
    this.getObstetricsInfo = function (type, filter, patientId, xlMedicalId) {
        var url = SYS.url + 'firstentry/' + filter + '/' + patientId + '/' + xlMedicalId;
        return $http.get(url).then(function success(msg) {
            convertObject2BooleanValue(type, msg.data.data);
            return {
                type: type,
                data: msg.data
            };
        })
    };

    /**
     * 获取日常信息
     * @param type
     * @param filter
     * @param patientId
     * @param week
     * @returns {*}i
     */
    this.getDaily = function (type, filter, patientId, week, xlMedicalId) {
        var url = SYS.url + filter + '/' + patientId + '/' + week + '/' + xlMedicalId;
        return $http.get(url).then(function success(msg) {
            convertObject2BooleanValue(type, msg.data.data);
            return {
                type: type,
                data: msg.data
            };
        })
    };

    this.saveDaily = function (filter, entity) {
        var copiedEntity = angular.copy(entity);
        convertBooleanValue2Object(copiedEntity);
        return $http.post(SYS.url + filter, copiedEntity).then(function success(msg) {
            return msg.data;
        })
    };

    this.saveDailyList = function (filter, entity) {
        return $http.post(SYS.url + filter, entity).then(function success(msg) {
            return msg.data;
        })
    };

    this.getDailyList = function (patientId, xlMedicalId) {
        var url = SYS.url + 'daily/fileinfo/list?filter__EQ_patiId=' + patientId + '&filter__EQ_xlMedicalId=' + xlMedicalId;
        return $http.get(url).then(function success(msg) {
            return msg.data;
        })
    };

    /**
     * 删除孕检档案
     * @param filter
     * @param patientId
     * @param week
     * @returns {*}
     */
    this.deleteDaily = function (filter, patientId, week, xlMedicalId) {
        return $http.delete(SYS.url + filter + patientId + '/' + week + '/' + xlMedicalId).then(function success(msg) {
            return msg.data;
        })
    };

    /**
     * 获取42天 信息录入数据
     * @param patientId
     * @param xlMedicalId
     * @returns {*}
     */
    this.getForty = function (patientId, xlMedicalId) {
        return $http.get(SYS.url + 'fourtytwo/postpartumftcheck/crud/' + patientId + '/' + xlMedicalId).then(function success(msg) {
            convertObject2BooleanValue('basic', msg.data.data);
            return {
                type: 'basic',
                data: msg.data
            };
        })
    };

    /**
     * 保存42天录入的数据;
     * @param entity
     * @returns {*}
     */
    this.saveForty = function (entity) {
        var copiedEntity = angular.copy(entity);
        convertBooleanValue2Object(copiedEntity);
        return $http.post(SYS.url + 'fourtytwo/postpartumftcheck/crud', copiedEntity).then(function success(msg) {
            return msg.data;
        })
    };


    this.getInfo = function (xlmedicalId, xlpatientId, type, patientId, urlId, date) {
        if (date) {
            var url = SYS.url + 'unite/resource/single/' + urlId + '?filter__xlPatientId=' + xlpatientId + '&filter__diagnosisDate=' + date;
        } else if (xlmedicalId != undefined && xlpatientId) {
            var url = SYS.url + 'unite/resource/single/' + urlId + '?filter__xlPatientId=' + xlpatientId + '&filter__xlMedicalId=' + xlmedicalId;
        } else if (xlpatientId && xlmedicalId == undefined) {
            var url = SYS.url + 'unite/resource/single/' + urlId + '?filter__xlPatientId=' + xlpatientId
        } else {
            var url = SYS.url + 'unite/resource/single/' + urlId + '?filter__patiId=' + patientId + '&filter__xlMedicalId=' + xlmedicalId;
        }
        return $http.get(url).then(function success(msg) {
            return {
                type: type,
                data: msg.data
            };
        })
    };

    //统一视图tab
    this.getOverviewType = function (url) {
        return $http.get(SYS.titleUrl + url).then(function success(msg) {
            return msg.data;
        })
    };
    /**
     * 获取历次就诊信息下的某一个详情里的检验信息
     * @param xlmedicalId
     * @param xlpatientId
     * @param type
     * @param patientId
     * @param urlId
     * @param testclass
     * @param date
     * @returns {*}
     */
    this.getExam = function (xlmedicalId, xlpatientId, type, patientId, urlId, testclass, date) {
        var test = encodeURIComponent(testclass);

        var url = SYS.url + 'unite/resource/single/' + urlId + '?filter__xlPatientId=' + xlpatientId + '&filter__xlMedicalId=' + xlmedicalId + "&filter__testClass=" + test + "&filter__diagnosisDate=" + date;
        return $http.get(url).then(function success(msg) {
            return msg.data;
        })
    };

    /**
     * 获取住院检验类型下的检验详情
     * @param xlpatientId
     * @param xlmedicalId
     * @param type
     * @param patientId
     * @param urlId
     * @param testclass
     * @returns {*}
     */
    this.getfExam = function (xlpatientId, xlmedicalId, type, patientId, urlId, testclass) {
        var test = encodeURIComponent(testclass);
        var url = SYS.url + 'unite/resource/single/' + urlId + '?filter__xlPatientId=' + xlpatientId + '&filter__xlMedicalId=' + xlmedicalId + "&filter__testClass=" + test;
        return $http.get(url).then(function success(msg) {
            return msg.data;
        })
    };

    this.getUserInfo = function () {
        var url = 'basic/patient/userinfo';
        return $http.get(url).then(function success(msg) {
            return msg.data;
        })
    };

    /**
     * 删除孕产史
     * @param maternalId
     * @returns {*}
     */
    this.deleteMaternal = function (maternalId) {
        var url = SYS.url + 'firstentry/maternalhistory/crud/' + maternalId;
        return $http.delete(url).then(function success(msg) {
            return msg.data;
        })
    };

    /**
     * 修改用户密码
     * @param password
     * @returns {*}
     */
    this.alterPasswordInfo = function (password) {
        var url = SYS.url + 'sys/user/password/password/update' + '?filter_oldPassword=' + password.oldWord + '&filter_newPassword=' + password.newWord;
        return $http.post(url).then(function success(msg) {
            return msg.data;
        })
    };

    this.getLoginName = function (credentials) {
        var url = SYS.url + 'login';
        return $http.get(url).then(function (msg) {
            return msg.data;
        })
    };

    /**
     * 获取血压体重录入的数据
     * @param patientId
     * @param xlMedicalId
     * @returns {*}
     */
    this.getDailyssss = function (patientId, xlMedicalId) {
        var url = SYS.url + 'daily/pregnancycheck/list?filter__patiId=' + patientId + '&filter__xlMedicalId=' + xlMedicalId;
        return $http.get(url).then(function success(msg) {
            return msg.data;
        })
    };

    /**
     * 获取血压高压数据
     * @param patientId
     * @param xlMedicalId
     * @returns {*}
     */
    this.getDailyHighList = function(patientId, xlMedicalId){
        var url = SYS.url + 'daily/pregnancycheck/highPressList?filter__patiId=' + patientId + '&filter__xlMedicalId=' + xlMedicalId;
        return $http.get(url).then(function success(msg) {
            return msg.data;
        })
    };
    /**
     * 获取血压低压数据
     * @param patientId
     * @param xlMedicalId
     * @returns {*}
     */
    this.getDailyLowList = function(patientId, xlMedicalId){
        var url = SYS.url + 'daily/pregnancycheck/lowPressList?filter__patiId=' + patientId + '&filter__xlMedicalId=' + xlMedicalId;
        return $http.get(url).then(function success(msg) {
            return msg.data;
        })
    };
    /**
     * 获取体重数据
     * @param patientId
     * @param xlMedicalId
     * @returns {*}
     */
    this.getDailyWeightList = function(patientId, xlMedicalId){
        var url = SYS.url + 'daily/pregnancycheck/weightList?filter__patiId=' + patientId + '&filter__xlMedicalId=' + xlMedicalId;
        return $http.get(url).then(function success(msg) {
            return msg.data;
        })
    };

    /**
     * 武警医院孕检档案打印需要性别和年龄另发一个请求
     * @param xlMedicalId
     * @param xlPatientId
     * @param patiId
     * @returns {*}
     */
    this.getArchiveBasic = function(xlPatientId,xlMedicalId,patiId){
        return $http.get(SYS.url + 'unite/resource/single/65?filter__xlPatientId='+xlPatientId+'&filter__xlMedicalId='+xlMedicalId+'&filter__patiId='+patiId).then(function success(msg){
            return msg.data;
        })
    };
}]);
