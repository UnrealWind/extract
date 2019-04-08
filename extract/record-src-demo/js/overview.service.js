angular.module('infi-basic').service('OverviewService', ['$http', 'SYS', function ($http, SYS) {
    this.ajaxOverviews = function (filter__xlPatientId,param) {
        var data = {};
        param.type == 'disease'?data = {filter__type: param.type,filter__diseaseId: param.disease}: data = {filter__type:param.type};
        data['filter__xlPatientId'] = filter__xlPatientId;
        return $http({
            method: 'get',
            url: SYS.url + '/unite/resource/single/59',
            params:data
        }).then(function (msg) {
            var data = convertTimeline(msg.data.data.result);
            msg.data.data = data;
            return msg.data;
        })
    };

    function convertTimeline(list) {
        var idx, length = list.length,
            old, entity,
            result = [];

        for (idx = 0; idx < length; idx++) {
            old = list[idx];
            entity = {
                time: old.medical_date,
                type: old.medical_type_id,
                xlPatientId: old.xl_patient_id,
                xlMedicalId: old.xl_medical_id,
                patientId: old.pati_id,
                details: [],
                title: old.title
            };

            entity.time && entity.time!=='' && entity.time!==null?(function () {
                    entity.date = new Date(entity.time);
                    entity.year = entity.date.getFullYear();
                    entity.month = entity.date.getMonth() + 1;
                    entity.day = entity.date.getDate();
                })():(function () {
                    entity.date = '??';
                    entity.year = '????';
                    entity.month = '??';
                    entity.day = '??';
            })()

            entity.details = [old.note];
            entity.url = '#/record-detail/'+list[idx].xl_patient_id+'/'+list[idx].xl_medical_id;

            if (entity.type == 2) {
                entity.type = 'menzhen';
            }else if(entity.type == 3){
                entity.type = 'tijain';
            }else if(entity.type == 1){
                entity.type = 'zhuyuan';
            }

            result.push(entity);
        }

        return result;
    }
}]);
