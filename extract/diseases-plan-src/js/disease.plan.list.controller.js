angular.module('infi-basic').
controller('diseasePlanListController', 
    ['$scope', 'SYS','DiseasePlanListServices','BasicServices','$routeParams', 
    function ($scope, SYS,DiseasePlanListServices,BasicServices,$routeParams) {
    /**
     * 页面初始化获取表格数据
     */
    $scope.tagRecom_reason = {
        data:{},
        length:0
    };

    $scope.schemeOpt =[
        {
            label:'药品',
        },
        {
            label:'手术',
        },
        {
            label:'其他治疗',
        },
        {
            label:'相似病例',
        }
    ]


    $scope.getPlanData = function () {
        BasicServices.getData({
            'data':JSON.parse(sessionStorage.getItem('diseaseParam')),
            'url':SYS.url+$routeParams.type+'/recommendation?'+'class_id='+$routeParams.class_id,
            'method':'post'
        }).then(function success(msg) {
            $scope.plan = msg.data;

            DiseasePlanListServices.prosess($scope.plan,$scope.schemeOpt);

            //这里这个id的位置比较奇怪，所以在这里重新声明一个全局对象拿一下
            $scope.recordId = msg.id;
        });
    };
    $scope.getPlanData();

    //获取表头
    BasicServices.getData({
            'data':'',
            'url':'../diseases-plan-src/data/diseasePlan.columns.json',
            'method':'get'
        }).then(function success(msg) {
        $scope.tableColumns = msg.data;
    });

    var getAdviceData = function (pageNo, pageSize) {
        DiseasePlanListServices.getAdviceData(pageNo, pageSize,$routeParams).then(function success(msg) {
            $scope.tableData = msg;
        });
    };
    getAdviceData(1, 10);

    /**
     * 分页操作
     */
    $scope.getChange = function (page) {
        getAdviceData(page, 10);
    };
    
    $scope.detail = function(id){
        window.open('#/disease-plan-detail/'+$routeParams.pati_id+'/'+$routeParams.pati_visit_id+'/'+$scope.recordId
            +'/'+id+'/'+$routeParams.class_id+'/'+$routeParams.type)
    }

    $scope.back = function(){
        window.location.href = '#/disease-input/'+$routeParams.pati_id+'/'+$routeParams.pati_visit_id+'/'+$routeParams.class_id+'/'+$routeParams.type;
    }


}]);

