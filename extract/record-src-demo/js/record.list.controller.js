angular.module('infi-basic').controller('RecordListController', ['$scope', 'SYS', 'RecordService', 'PatiProfileService', 'EMR', '$timeout', '$sce' , function ($scope, SYS, RecordService, PatiProfileService, EMR, $timeout,$sce) {

   // 列表页（首页）对应controller

    /**
     * 用于列表数据的搜索，注意要进行数据的初始化
     * 门诊id,以及患者姓名,这个需要注意的点是需要对数据进行初始化不应该出现数据为undefined的情况
     * @type {{patiId: string, visitId: string}}
     */
    $scope.IdEntity = {
        name: '',
        patiId: '',
        startDate: '',
        endDate: ''
    };

    /**
     * 获取表头以及患者列表信息
     */
    RecordService.ajaxColumns('list').then(function (msg) {
        $scope.listColumns = msg.data;
    });

    /**
     * 获取列表信息
     */
    $scope.getCaseList = function (page, size, keywords) {
        beforeQuery();
        RecordService.getPage(page, size, keywords).then(function (msg) {
            $scope.listData = msg;
        });
    };
    $scope.getCaseList(EMR.PAGE_NUMBER, EMR.PAGE_SIZE);


    /**
     * 根据患者姓名以及病例号进行模糊搜索
     */
    $scope.searchList = function () {
        beforeQuery();
        //zyz-deubg 为什么要延时
        $timeout(function () {
            RecordService.getPage(EMR.PAGE_NUMBER, EMR.PAGE_SIZE, $scope.IdEntity).then(function success(msg) {
                $scope.listData = msg;
            });
        }, 300);
    };


    $scope.updatePage = function () {
        $scope.getCaseList($scope.listData.pageNo, EMR.PAGE_SIZE, $scope.IdEntity);
    };

    function beforeQuery() {
        $scope.listData = {
            status: false,
            desc: '数据查询中'
        };
    };

    /**
     * 对搜索条件进行清空并且将列表数据还原为初始化的状态
     */
    $scope.emptyConditions = function () {
        $scope.IdEntity = {
            name: '',
            patiId: '',
            startDate: '',
            endDate: ''
        };
        $scope.getCaseList(EMR.PAGE_NUMBER, EMR.PAGE_SIZE);
    }

    //讲配置文件中的配置拿到scope中
    $scope.systemConf = SYS;

    $scope.modalIframe = function(id){
        // ----- iframe 嵌套实现代码 ----- //
        // $scope.ChinaEleUrl = $sce.trustAsResourceUrl(SYS.ChinaEleUrl+id);
        // ----- iframe 嵌套实现代码 ----- //
        
        
        $scope.hasData = 'init'          // 是否获取到异常视图渲染数据
        
        var param = {
            xlPatientId: id
        }

        PatiProfileService.getAbnormalView(param).then(function(flatData) {
            $scope.hasData = true

            $scope.flatOrgData = flatData

        }, function(error) {
            $scope.hasData = false
        })


        $('.modalChinaEle').modal('show');
    }
}]);
