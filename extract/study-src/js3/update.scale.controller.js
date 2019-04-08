angular.module('infi-basic').controller('UpdateScaleController',
['$scope','SYS','$routeParams','$http','scaleServices','Upload',
function($scope,SYS,$routeParams,$http,scaleServices,Upload){
	function init(pageNo,pageSize) {
        scaleServices.getTableData(pageNo,pageSize).then(function (msg) {
            $scope.content = msg;
            $scope.content.page.number ++;
        })
    }
    init(1,10);

	$scope.changePage = function (pageNo) {
        init(pageNo.page,10);
    }
    $scope.onFileSelect = function($files,input){
        for(var i = 0; i < $files.length; i++){
            upload($files[i]);
        }
        function upload(file){
            var url = SYS.url+'scale/import/load';
            var data = {};
            $scope.upload = Upload.upload({
                url: url,
                method: 'post',
                file: file,
                params: data
            }).progress(function(evt){
                $scope.showTip = 'blue';
            }).then(function (msg){
                msg.data.success==true?$scope.showTip = 'green':$scope.showTip = 'red';
                init(1,10);
            });
        };
    };

}]);


angular.module('infi-basic').service('scaleServices',['$http','SYS','Session',function($http,SYS,Session){
	this.getTableData = function (pageNo,pageSize) {
        return $http({
            url: SYS.url+'scale/page?filter_pageNo='+pageNo+'&filter_pageSize='+pageSize,
            method: 'get',
            params: ''
        }).then(function(msg){
			return msg.data;
		});
    }


}]);