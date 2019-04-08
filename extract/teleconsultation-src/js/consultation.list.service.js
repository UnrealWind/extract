angular.module('infi-basic').service('ConsultationListService', ['$http', 'SYS', function ($http, SYS) {

    //先保存this
    var that = this;
    /**
     * 获取tab切换数据
     * @returns {*}
     */
    this.getListData = function () {
        return $http({
            url: '../teleconsultation-src/data/consultation.listData.json',
            method: 'get'
        }).then(function success(msg) {
            return msg.data;
        })
    };

    /**
     * 获取具体表格的表头数据
     * @param parameter
     */
    this.getHeaderData = function (parameter) {
        return $http({
            url: '../teleconsultation-src/data/consultation.' + parameter + '.columns.json',
            method: 'get'
        }).then(function success(msg) {
            return msg.data;
        })
    };

    /**
     * 获取登录人信息
     * @param credentials
     * @returns {*}
     */
    this.getUser = function (credentials) {
        var url = SYS.url + 'login';
        return $http.get(url).then(function (msg) {
            return msg.data;
        })
    };

    /**
     * 获取列表数据
     * @param filter
     * @returns {*}
     */
    this.getTableData = function (filter, filterDatas) {
        var filterWrap = $.extend({}, filter, filterDatas);
        return $http({
            url: SYS.url + 'doctor/consultation',
            method: 'get',
            params: filterWrap
        }).then(function success(msg) {
            if (msg.data.status == SYS.STATUS_SUCCESS) {
                msg.data.page.number++;
                return msg.data;
            } else {
                return msg.data;
            }
        })
    };

    /**
     * 获取筛选条件维表数据
     * @param url
     * @returns {*}
     */
    this.getFilterData = function (url) {
        return $http({
            url: SYS.url + url,
            method: 'get'
        }).then(function success(msg) {
            return msg.data;
        })
    };

    /**
     * 获取医生(主诊医师)
     * @param id
     * @returns {*}
     */
    this.getMainDoctor = function (id) {
        return $http({
            url: SYS.url + 'doctor/list',
            method: 'get',
            params: {
                consultationId: id
            }
        }).then(function success(msg) {
            return msg.data;
        })
    };

    /**
     * 列表数据进行整合
     * @param data
     * @returns {*}
     * @constructor
     */
    this.PortfolioList = function (data) {
        if (data && data.page.content.length > 0) {
            var listData = data,
                i = 0,
                j = 0,
                entity,
                length = listData.page.content.length;
            for (i; i < length; i++) {
                j++;
                entity = listData.page.content[i];
                entity.viewStatus = entity.consultation.viewStatus;
                entity.status = entity.consultation.status;
                entity.purpose = entity.consultation.purpose;
                entity.appointmentTime = entity.consultation.appointmentTime;
                entity.diagnosisTimes = entity.consultation.diagnosisTimes;
                entity.createTime = entity.consultation.createTime;
                entity.patientName = entity.consultation.name;
            }
        } else {
            listData = '';
        }
        return listData;
    };

    /**
     * 将医生信息进行整合
     * @param listData
     * @param doctorData
     * @returns {*}
     */
    this.fixDoctor = function (listData, doctorData) {
        angular.forEach(listData.page.content, function (entity) {
            angular.forEach(doctorData, function (doctor) {
                if (doctor.data && entity.consultationId == doctor.data[0].consultationId) {
                    entity.viewName = doctor.data[0].viewName;
                }
            })
        });
        return listData;
    };

    /**
     * 确定会诊角色
     * @param entity
     * @returns {string}
     */
    this.determineRole = function (entity) {
        var roleData = '';
        if (entity.originatorId == entity.consultation.originatorId) {
            roleData = entity.role;
        } else {
            roleData = 'initiate';
        }
        return roleData;
    };

    /**
     * 视频会诊，包括发起视频和取消视频会诊和进入视频会诊
     * @param id
     * @param type
     * @returns {*}
     */
    this.videoCall = function (id, type) {
        var determineMethod;
        if (type == 'open') {
            determineMethod = 'get';
        } else if (type == 'close') {
            determineMethod = 'put'
        }
        return $http({
            url: SYS.url + 'video/url',
            method: determineMethod,
            params: {
                consultationId: id
            }
        }).then(function success(msg) {
            return msg.data;
        })
    };

    /**
     * 结束会诊
     * @param id
     * @returns {*}
     */
    this.videoEnd = function (id) {
        return $http({
            url: SYS.url + 'video/endVideo',
            method: 'get',
            params: {
                consultationId: id
            }
        }).then(function success(msg) {
            return msg.data;
        })
    };

    /**
     * 取消会诊
     * @returns {*}
     */
    this.cancelConsultation = function (consultationId) {
        return $http({
            url: SYS.url + 'consultation/' + consultationId,
            method: 'put'
        }).then(function success(msg) {
            return msg.data;
        })
    };

    this.deleteConsultation = function (id) {
        return $http({
            url: SYS.url + 'consultation/' + id,
            method: 'delete'
        }).then(function (msg) {
            return msg.data;
        })
    };

    /**
     * 是否同意
     * @param filter
     * @returns {*}
     * @constructor
     */
    this.ConfirmStatus = function (filter) {
        return $http({
            url: SYS.url + 'doctor/info',
            method: 'post',
            params: {
                consultationId: filter.consultationId,
                status: filter.status
            }
        }).then(function success(msg) {
            return msg.data;
        })
    };

    /**
     * 做一个对应的参数适配
     * @param type
     * @param filterList
     * @returns {{}}
     */
    this.makefilerData = function (type, filterList) {
        var data = {};
        switch (type.name) {
            case 'await':
                data = {
                    filter_startTime: filterList.startTime,
                    filter_endTime: filterList.endTime,
                    filter_originatorHosp: filterList.hospitalFilter,
                    filter_originatorName: filterList.userFilter,
                    filter_originatorDept: filterList.departFilter
                };
                break;
            case 'origin':
                data = {
                    filter_startTime: filterList.startTime,
                    filter_endTime: filterList.endTime,
                    filter_status: filterList.statusFilter
                };
                break;
            case 'invite':
                data = {
                    filter_startTime: filterList.startTime,
                    filter_endTime: filterList.endTime,
                    filter_originatorHosp: filterList.hospitalFilter,
                    filter_originatorName: filterList.userFilter,
                    filter_originatorDept: filterList.departFilter,
                    filter_status: filterList.statusFilter
                };
                break;
            case 'finish':
                data = {
                    filter_startTime: filterList.startTime,
                    filter_endTime: filterList.endTime,
                    filter_originatorHosp: filterList.hospitalFilter,
                    filter_originatorName: filterList.userFilter,
                    filter_originatorDept: filterList.departFilter
                };
                break;
        }
        return data;
    }
}]);