angular.module('infi-basic')
.controller('HomeController',['$scope','$rootScope','TaskService','HomeService', 'Utils','SYS', function($scope,$rootScope,TaskService,HomeService,Utils, SYS) {

    // 存储被选中的数据，用于匹配左侧选中状态
    $rootScope.selectedClass = []

    $rootScope.hasCheckedTag = null

    // 存储右侧已选中的所有 valueId 和 tagId
    $rootScope.recommandAbout = {
        valueIds: {},
        tagId: null,
        tag: null
    }


    // 缓存当前点击弹窗的数据，以供 selection-pop 指令使用
    $rootScope.curPopData = {
        parent: null,
        part: null
    }


    // 页面跳转
    $scope.changeStep = function(type, step) {
        HomeService.changeStep(type, step, $scope)
    }

    // radio 切换
    $scope.changeRadio = function(radioIndex, data) {
        HomeService.changeRadio(radioIndex, data)
    }

    // 监听结果页加载完成，关闭 loading
    $scope.$on('detailLoaded', function(e, m) {
        $scope.hasRst = false
        $scope.canCancel = false
    })

    /**
     * 右侧点击取消选中
     */
    $scope.cancelChose = function(part, value) {
        HomeService.cancelChose(part, value, $scope)
    }

    /**
     * 右侧编辑
     */
    $scope.editChose = function(part) {
        HomeService.editChose(part)
    }

    $scope.chose = function(key) {
        $scope.finalResult[$scope.currentStep].children[key].active = false
        delete $scope.finalResult[$scope.currentStep].children[key];

        key = key.split('：').join('-')

        $rootScope.selectedClass.splice($rootScope.selectedClass.indexOf(key), 1)

        $scope.finalResult[$scope.currentStep]['show'] =
            TaskService.isEmptyObj($scope.finalResult[$scope.currentStep].children) ? false : true
    }

    /**
     * 查看已收藏的模板
     */
    $scope.check_savedModel = function() {
        $("#savedModelList").modal({backdrop: 'static'});

        $scope.$broadcast('changeContent', SYS.DEFAULT_PAGE_NUMBER)
    }
    
    /**
     * 收藏当前模板
     */

    $scope.save_model = function() {
        $("#save-model-propt").modal({backdrop: 'static'});
    }

    // 保存的模板数据
    $scope.$on('saveModel', function(e, model) {
        var savedModel = {
            "name": model.collectName,
            "createTime": null,
            "own": null,
            "selectedClass": JSON.stringify($rootScope.selectedClass),
            "finalResult": JSON.stringify($scope.finalResult),
            "describes": null
        }

        
        TaskService.httpPOST(SYS.url + 'collect/template', savedModel).then(function success(msg) {
            var tip = {}

            if(msg.data) {
                tip = {
                    status:'ok',
                    description:"保存成功"
                }
        
                $('#save-model-propt').modal('hide');
        
                // 保存成功 通知子元素清空内容
                $scope.$broadcast('saveSuccess')
            } else {
                tip = {
                    status:'error',
                    description:"保存失败，请重新保存！"
                }
            }

            Utils.sysTip($scope,tip);
        }, function error (e) {

            var tip = {
                status:'error',
                description:"保存失败，请检查网络！"
            }

            Utils.sysTip($scope,tip);

        })
    })


    /**
     *  监听应用收藏模板事件
     */
    $scope.$on('applyModel', function(e, model) {
        $scope.finalResult = model.finalResult
        $rootScope.selectedClass = model.selectedClass

        var tip = {
            status:'ok',
            description:"应用成功"
        }

        Utils.sysTip($scope,tip);

        $("#savedModelList").modal('hide');
    })

    /**
     * 监听删除收藏模板事件
     */

    $scope.$on('deleteModel', function(e, model) {
        var tip = {}

        TaskService.httpDELE(SYS.url + 'collect/template/' + model.entity.id).then(function success(msg) {
            if(msg.data) {
                var tip = {
                    status:'ok',
                    description:"删除成功！"
                }

                $scope.$broadcast('changeContent', model.pageNumber)
                
                Utils.sysTip($scope,tip);
            }
        }, function err(e) {
            var tip = {
                status:'error',
                description:"请求出错，请稍后再试！"
            }

            Utils.sysTip($scope,tip);

        })
    })


    /**
     * 初始化
     */
    function init() {
        // 获取初始 tag 值
        var _tmpId = null

        if (sessionStorage.getItem('currActive')) _tmpId = sessionStorage.getItem('currActive')
        else _tmpId = 8


        HomeService.getInitTag(_tmpId).then(function(msg) {
            $scope.tagOrgData = msg.data
            $scope.finalResult = HomeService.contrUtils.mkFinalResult(msg.data)

            // 构建导航条初始状态
            $scope.navData = angular.copy($scope.finalResult)
            $scope.navMap = HomeService.contrUtils.mkNavmap($scope.navData)
            $scope.currentStep = 0; // 初始化 tab 位置
            $scope.changeStep(2, 0)
        })

    }

    init();
}])