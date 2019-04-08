angular.module('infi-basic').
controller('AdversePdfController',
    ['$scope', 'SYS','$routeParams','Session',
        function ($scope, SYS,$routeParams,Session) {
            var user= Session.getUser();
            console.log($scope.user)

            $scope.tagUrl = '../bower_components/pdfjs-build/generic/web/viewer.html?file='+
                SYS.url+'adverse/prediction/literatures/'+$routeParams.id;
        }]);