angular.module('infi-basic')
  .controller('ViewController', ['$scope',function ($scope) {
    $scope. admission = function(){
      $('#infi-inputsave').modal({backdrop: 'static'});
    };


  }]);
