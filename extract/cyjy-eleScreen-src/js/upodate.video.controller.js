angular.module('infi-basic').controller('UpdateVideoController',['$scope','$location','SYS','$rootScope',function ($scope,$location,SYS,$rootScope) {

    $scope.video = {

    }
    
    $scope.upadateImg = function (that) {
        var tagUrl = null;
        var file = that.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
            tagUrl = this.result;
            console.log(tagUrl)
        }

    }
}]);