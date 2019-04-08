angular.module('infi-basic')
    .controller('CRFSystemController', ['$scope',function ($scope) {
        $scope.templateUse = function(){
            $('#templateUse').modal({backdrop: 'static'});
        }
    }])