angular.module('infi-basic').directive('updateCRF', ['$http','SYS','CRFManageService',
    function ($http,SYS,CRFManageService) {
        return {
            restrict: 'ECMA',
            templateUrl: './html/updateCRF.template.html',

            link: function (scope,element,attrs) {

            }
        }
    }]);

angular.module('infi-basic').directive('viewDetail', ['$http','SYS','formNaviServices','formServices',
    function ($http,SYS,formNaviServices,formServices) {
        return {
            restrict: 'ECMA',
            templateUrl: './html/viewDetail.template.html',
            scope:{
                viewTemplateId:'='
            },
            link: function (scope,element,attrs) {
                scope.currentData = [];
                formNaviServices.ajaxNaviData(scope.viewTemplateId,0).then(function(msg){
                    msg.data.forEach(function (n,i) {
                        var callBack = formServices.ajaxModuleData(n,'');
                        scope.currentData.push(callBack.version[0]);
                    });
                    $('#viewDetail').modal('show');
                });

            }
        }
    }]);
