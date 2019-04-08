angular.module('infi-basic')
.controller('ListController',['$scope', 'SYS', 'ListService', 'Utils', function($scope, SYS, ListService, Utils) {
    $scope.content = [];
    $scope.columns = [{label:"模板名称",name:"name"},{label:"创建时间",name:"createTime"}];

    /**
     * 列表翻页
     * @param {*} page 下一页的页码
     */
    $scope.updatePage = function (page) {
        $scope.currentPage = page

        ListService.getTemplateList(page,SYS.DEFAULT_PAGE_SIZE).then(function (msg) {
            $scope.content = msg;
        });
    }

    /**
     * 保存新模板
     */
    $scope.saveNewTemp = function() {
        
        var data = {
            'name': $scope.newTempName
        }
        
        $scope.forbidSave = true

        ListService.saveNewTemp(data).then(function(msg) {

            var tip = null

            switch(true) {
                case (msg.data.status == SYS.STATUS_SUCCESS):
                    $scope.forbidSave = false
                    
                    tip = {
                        status:'ok',
                        description:"保存成功"
                    }

                    $('#addNewTemp').modal('hide');

                    break

                case (msg.data.status == 'fail'):
                    $scope.forbidSave = false

                    tip = {
                        status:'error',
                        description: msg.data.reason
                    }
                    break
            }

            Utils.sysTip($scope, tip, function() {
                tip.status == 'ok' ? $scope.updatePage(SYS.DEFAULT_PAGE_NUMBER) : undefined
            })

        }, function(error) {
            $scope.forbidSave = false
            tip = {
                status:'error',
                description:"保存失败，请稍后再试..."
            }

            Utils.sysTip($scope, tip)
        })
    }


    /**
     * 列表具体操作
     */
    $scope.optCollectList = function(entity, type) {
        ListService.entityOps(type, entity, $scope)
    }


    /**
     * 初始化
     */
    function _init() {
        // 初始化已保存列表
        $scope.updatePage(SYS.DEFAULT_PAGE_NUMBER)

        /**
         * 模态框消失事件监听
         */
        $('#addNewTemp').on('hidden.bs.modal', function (e) {
            $scope.newTempName = null
            $scope.$apply()
        })

    }

    _init()



}])