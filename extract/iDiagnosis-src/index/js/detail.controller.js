angular.module('infi-basic')
.controller('DetailContoller',['$scope','TaskService','$sce', function($scope,TaskService,$sce) {

    $scope.show = {
        showReason:true,
        showDesc:false,
        showInfo:false
    }
    
    $scope.$on('genSuccess', function(e, m) {
        $scope.normalModel = m.data;
        $scope.healthRst = m.data.health_result
    })

    // 内容加载完成，关闭loading
    $scope.$on('$viewContentLoaded', function() {
        $scope.$emit('detailLoaded')
    });

    
    $scope.chose =function (opt) {
        angular.forEach($scope.normalModel, function(val, key) {
            if(key != 'health_result') {
                angular.forEach(val, function(n, i) {
                    n['active'] = false;
                })
            }
        })

        opt.active = true;
        $scope.tagOpt = opt;
    }
    
    $scope.changeTab = function (msg) {
        for(var i in $scope.show){
            $scope.show[i] = false;
        }
        $scope.show[msg] = true;
    }

    $scope.showchild = function (opt) {
        opt['showchild']?opt['showchild'] = false:opt['showchild'] = true;
    }
    
    $scope.viewOrigin = function () {
        angular.forEach($scope.normalModel, function(val, key) {
            if(key != 'health_result') {
                angular.forEach(val, function(n, i) {
                    n['active'] = false;
                })
            }
        })
        
        $scope.tagOpt = false;
    }

}]);