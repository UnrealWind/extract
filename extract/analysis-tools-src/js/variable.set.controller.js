angular.module('infi-basic')
    .controller('VariableSetController',[ '$scope',function ($scope) {
        $('body').removeClass("modal-open");
        $(".modal-backdrop").remove();
    }]);