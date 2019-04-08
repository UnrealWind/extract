angular.module('infi-basic').
controller('diseasePdfController', 
    ['$scope', 'SYS','BasicServices','$routeParams', 
    function ($scope, SYS,BasicServices,$routeParams) {

    $scope.tagUrl = '../bower_components/pdfjs-build/generic/web/viewer.html?file='
            +SYS.url+$routeParams.type+'/literature/'+$routeParams.planType+'/'+$routeParams.literature
        +'&pageNum='+$routeParams.pageNum;
}]);