angular.module('infi-basic').controller('ListController', ['$scope', 'SYS', 'ListService', '$location','CheckDeviceService', function ($scope, SYS, ListService, $location, CheckDeviceService) {
    $scope.columns = null;
    $scope.content = null;

    /**
     * 分页
     * @param page
     */
    $scope.updatePage = function(page){
        ListService.getContent(page).then(function(msg){
            $scope.content = msg;
            $scope.content.page.number ++ ;
        })
    };

    function init(){
        ListService.getColumns().then(function(msg){
            $scope.columns = msg.data;
        });
        $scope.updatePage(SYS.DEFAULT_PAGE_NUMBER);
    }
    init();

    $scope.opts = {
        label:"操作",
        btns:[
            {
                label:"查看详情",
                type:"show"
            }
        ]
    };

    /**
     * 操作
     * @param entity
     */
    $scope.btnCallback = function(entity){
        $location.search('sfzh',entity.identityNum);
        // $location.search('patiId',entity.patientId);
        // $location.search('patiVisitId',entity.patientVisitId);
        if(CheckDeviceService.checkDevice() == 'mobile'){
            $location.path("details");
        }else if(window.location.pathname.toString().indexOf('app_mobile')>0){
            $location.path("details");
        }else{
            $location.path("details");
        }
    }
}]).service('ListService',['SYS','$http',function(SYS,$http){
    /**
     * 获取行
     * @returns {*}
     */
    this.getColumns = function(){
        return $http.get(SYS.jsonUrl + 'list.columns.json').then(function(msg){
            return msg.data;
        })
    };
    /**
     * 获取内容
     * @returns {*}
     */
    this.getContent = function(page){
        return $http.get(SYS.url + 'patient/list?filter_pageNo='+page+'&filter_pageSize=10').then(function(msg){
            return msg.data;
        })
    }
}]);
