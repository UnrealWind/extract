angular.module('infi-basic')
    .controller('CompleteController',[ '$scope','$routeParams',function ($scope,$routeParams) {
        $('body').removeClass("modal-open");
        $routeParams.id = 1;
        $scope.a = $routeParams.id = 1;
        $(".modal-backdrop").remove();
        $scope.contents = [
            {
                name:'脑梗死患者逻辑回归'
            }
        ]
        $scope.getNowFormatDate = function() {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            // + " " + date.getHours() + seperator2 + date.getMinutes()
            // + seperator2 + date.getSeconds()
                ;
            return currentdate;
        }
        $scope.time = $scope.getNowFormatDate();
        $scope.inviteDelete = function(name){
            for(var i = 0 ; i < $scope.contents.length ; i++){
                if(name == $scope.contents[i].name){
                    // delete $scope.contents[i];
                    $scope.contents.splice(i,1);
                }
            }
        }
    }]);