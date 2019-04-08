angular.module('infi-basic').service('ExpertsService', ['$http', 'SYS', function ($http, SYS) {

    this.getExpertsColumns = function () {
        return $http({
            url: '../teleconsultation-src/data/consultation.experts.columns.json',
            method: 'get'
        }).then(function success(msg) {
            return msg.data;
        })
    };

    this.getExpertsInviteColumns = function () {
        return $http({
            url: '../teleconsultation-src/data/consultation.experts.invite.columns.json',
            method: 'get'
        }).then(function success(msg) {
            return msg.data;
        });
    };
    
    /**
     * 获取已经邀请的医生表格数据
     * @returns {*}
     */
    this.getTableData = function (filter) {
        return $http({
            url: SYS.url + 'doctor/list',
            method: 'get',
            params: {
                filter_EQ_consultationId: filter.id,
                filter_pageNo: filter.pageNo,
                filter_pageSize: filter.pageSize
            }
        }).then(function success(msg) {
            if (msg.data.status == SYS.STATUS_SUCCESS) {
                msg.data.page.number++;
                return entity = escapeName(msg.data)
            } else {
                return msg.data
            }
        });
    };

    /**
     * 医师名称转义
     * @param entity
     * @returns {*}
     */
    function escapeName(entity) {
        if (entity && entity.page.content.length > 0) {
            var idx = 0,
                wrap,
                length = entity.page.content.length;
            for (idx; idx < length; idx++) {
                wrap = entity.page.content[idx];
                wrap.role == 'attending' ? wrap.role = '主诊医师' : wrap.role = '辅诊医师';
            }
            return entity;
        }
    }


    /**
     * 将获取的需要新邀请的数据进行处理
     * @returns {*}
     */
    this.getIntiate = function (filter) {
        return $http({
            url: SYS.url + 'doctor/page',
            method: 'get',
            params: {
                filter_pageNo: filter.pageNo,
                filter_pageSize: filter.pageSize,
                filter_consultationId: filter.consultationId,
                filter_searchParam: filter.keyWords
            }
        }).then(function success(msg) {
            if (msg.data.status == SYS.STATUS_SUCCESS) {
                msg.data.page.number++;
                return initiateData = formattingInitiateData(msg);
            }
        })
    };

    function formattingInitiateData(msg) {

        var initiateData = msg.data;
        var idx = 0,
            idy = 0,
            entity,
            initiateLength = initiateData.page.content.length;
        for (idx; idx < initiateLength; idx++) {
            entity = initiateData.page.content[idx];
            entity.docHosp = entity.consultationDoc.docHosp;
            entity.docDept = entity.consultationDoc.docDept;
            entity.docName = entity.consultationDoc.docName;
        }
        for (idy; idy < initiateLength; idy++) {
            initiateData.page.content[idy].listSelect = {};
            initiateData.page.content[idy].consultationRole = {};
            initiateData.page.content[idy].listSelect.value = false;
        }
        return initiateData;
    }


    this.saveIniate = function (doctorList, id) {
        var idx = 0,
            doctorEntity,
            wrap = {},
            wraps = [],
            length = doctorList.length;
        for (idx; idx < length; idx++) {
            doctorEntity = doctorList[idx];
            wrap = {
                consultationId: id,
                docId: doctorEntity.consultationDoc.docId,
                role: doctorEntity.consultationRole.value
            };
            wraps.push(wrap)
        }
        return $http({
            url: SYS.url + 'doctor/info',
            method: 'post',
            data: wraps
        }).then(function success(msg) {
            return msg.data
        })
    }
}]);