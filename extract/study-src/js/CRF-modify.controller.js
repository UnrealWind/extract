angular.module('infi-basic')
    .controller('CRFModifyController', ['$scope',function ($scope) {
        $scope.CRFModifyUse = function(){
            $('#CRFModifyUse').modal({backdrop: 'static'});
        }
    }]);