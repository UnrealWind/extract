angular.module('infi-basic').controller('UpdateRollImgController',['$scope','$location','SYS','$rootScope','ManagementService',function ($scope,$location,SYS,$rootScope,ManagementService) {
    $scope.rollImg = {
        title:null,  //标题
        pic:null,//图片
        weight:null,   //权重
        location:null//发布位置
    };

    $scope.upadateImg = function (that) {
        var tagUrl = null;
        var file = that.files[0];
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
            tagUrl = this.result;
            $scope.rollImg.pic = tagUrl;
        }

    }

    /**
     * 确定
     */
    $scope.update = function(){
        ManagementService.saveRollImg($scope.rollImg).then(function(msg){
            console.log(msg);
        })
    }
}]);