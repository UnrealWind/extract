angular.module('infi-basic')
    .controller('CRFDetailsController', ['$scope',function ($scope) {
        $scope.CRFDetailsUse = function(){
            $('#CRFDetailsUse').modal({backdrop: 'static'});
        }
    }]);