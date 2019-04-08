angular.module('infi-basic').service('OverviewService', ['$http', 'SYS', function ($http, SYS) {
    this.ajaxOverviews = function (patientId) {
        return $http({
            method: 'get',
            url: SYS.url + 'unite/resource/single/59?filter__xlPatientId=' + patientId
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
            entity.date = new Date(entity.time);
            entity.year = entity.date.getFullYear();
            entity.month = entity.date.getMonth() + 1;
            entity.day = entity.date.getDate();
            entity.details.push(old.note);

            if (entity.type == 2) {
                entity.type = 'menzhen';
                entity.url = '#/overview/outpatient/' + entity.xlPatientId + '/' + entity.xlMedicalId + '/' + entity.patientId;
            }
            if (entity.type == 3) {
                entity.type = 'tijain';
                entity.url = '#/overview/inhospital/' + entity.xlPatientId + '/' + entity.xlMedicalId + '/' + entity.patientId;
            }
            result.push(entity);
        }

        return result;
    }
}]);
