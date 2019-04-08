angular.module('infi-basic').
controller('diseasePdfController',
    ['$scope', 'SYS','$routeParams',
    function ($scope, SYS,$routeParams) {
    var url;
    if($routeParams.type == 'guide'){
        url = `${SYS.treatUrl}reference/guide/id/`;
    }else if($routeParams.type == 'drug'){
        url = `${SYS.treatUrl}drug/literature/id/`;
    }else if($routeParams.type == 'disease'){
        url = `${SYS.treatUrl}plan/literature/id/`;
    }
    $scope.tagUrl = '../bower_components/pdfjs-build/generic/web/viewer.html?file='
            +url+$routeParams.id;
}]);
