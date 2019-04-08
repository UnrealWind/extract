angular.module('infi-basic').controller('RecordCollectController',
    ['$scope', '$routeParams', 'SYS','$http','$rootScope','$timeout','RecordCollectService','$routeParams','$q','naviServices',
        function ($scope, $routeParams, SYS,$http,$rootScope,$timeout,RecordCollectService,$routeParams,$q,naviServices) {

        //因为angularjs内部路由进行跳转的时候无法触发 导航的自动刷新以及定位active事件，所以强行触发，每次进入的时候都强行触发
        naviServices.getNaviData().then(function(msg){
            msg.data?$rootScope.naviData = msg.data.menus:undefined;
            var strIdx = naviServices.getIndex(window.location.href,$rootScope.naviData);
            var callback = naviServices.restoreNavi($rootScope.naviData,strIdx);
            $rootScope.naviData = callback.naviData;
            $rootScope.secondNavi = callback.second;
            $rootScope.secondTitleOpt = callback.secondTitleOpt;
            $rootScope.shrinkfirst = naviServices.judgeShrink($rootScope.secondNavi);
        });


        $('.main').css('height',window.innerHeight-108+'px');

        $scope.routeParams = $routeParams;

        //用于控制展开主区域的选项
        $scope.showMainModuleNum = false;

        $scope.showMainModule = function(){
            $scope.showMainModuleNum =!$scope.showMainModuleNum
        }

        $scope.wholeInfo = {
            charge:null,
            source:null,
            basicInfo:null,
            templateData:null,
            templateList:null,
            diagnosisData:null,
            illData:null,
            illModalData:null,
            checkPrintData:null,
            plan:{
                introduct:null,
                target:null,
                guide:null,
                drug:null,
                disease:null
            }
        };

        $scope.workSpaceInfo = {
            data:null,
            mark:null,
            relPatientId:$routeParams.patientId,
            patientId:$routeParams.xlPatientId,
            visitId:$routeParams.xlVisitId,
            moduleTemplate:1,
            templateId:1,
            preTemplateId:0,
            userId:1,   //用户id session
            resourceId:1,
            planId:null,
            showRight:$routeParams.right == 'view' && !$routeParams.hideR,
        };

        (function init() {
            $http.get(SYS.url + '/resource').then(function (msg) {
                $scope.workSpaceInfo.resourceId = msg.data.data.id;
                $scope.workSpaceInfo.moduleTemplate = msg.data.data.moduleTemplateId;
                RecordCollectService.getTemplateList($scope.workSpaceInfo.userId,'我的模板').then(function (msg) {
                    $scope.wholeInfo.templateList = msg.data;

                    $routeParams.templateId && $routeParams.templateId!='null'?(function (){
                        $scope.wholeInfo.templateList.forEach(function (n,i) {
                            n.id == $routeParams.templateId?(
                                $scope.workSpaceInfo.templateId = n.id,
                                $scope.workSpaceInfo.userId = n.userId,
                                n['active'] = true
                            ):'';
                        })
                    })():(
                        $scope.workSpaceInfo.templateId = $scope.wholeInfo.templateList[0].id,
                        $scope.workSpaceInfo.userId = $scope.wholeInfo.templateList[0].userId,
                        $scope.wholeInfo.templateList[0]['active'] = true
                    );

                    getData();
                    RecordCollectService.getDiagnosisData($scope.workSpaceInfo.patientId,$scope.workSpaceInfo.visitId,$scope.wholeInfo,$scope.workSpaceInfo)
                })
            })
        })();

        function getData() {
            RecordCollectService.getBasicInfo($scope.workSpaceInfo).then(function (msg) {
                $http.get(SYS.url+'kno/cost/info/list').then(function (msg) {
                    $scope.wholeInfo.charge = msg.data.data;
                });

                $http.get(SYS.url+'kno/source/data/list').then(function (msg) {
                    $scope.wholeInfo.source = msg.data.data;
                });
                $scope.wholeInfo.basicInfo = msg.data;
                $scope.wholeInfo.basicInfo.idType = '身份证';
                $('.presentAddress').kuCity();
            });

            //目前定死了用这两个id
            RecordCollectService.getTemplateData($scope.workSpaceInfo).then(function (msg) {
                $scope.wholeInfo.templateData = msg.data;

                //这里控制初始化显示啥
                $scope.workSpaceInfo.data = msg.data[0].data[0];
                $scope.workSpaceInfo.mark = 'attr';
                console.log($scope.wholeInfo.templateData,'templateData');

            });

            $http.get(`${SYS.prescriptUrl}prescribe?xlPatientId=${$routeParams.xlPatientId}&xlVisitId=${$routeParams.xlVisitId}`).then(function(msg) {
                if(msg.data.status == 'ok') {
                    $scope.wholeInfo['prescription'] = msg.data.data;
                }
            });
        };

        $scope.changeTemplate = function (template) {
            if(template.id == $scope.workSpaceInfo.templateId) return;
            $('.tips').modal('show');
            $scope.tipDescription = '切换模板后，上一份模板内编辑内容将自动取消!';

            $scope.workSpaceInfo.preTemplateId = $scope.workSpaceInfo.templateId
            $scope.workSpaceInfo.templateId = template.id;

            //这里说不进行保存操作了
            // $scope.saveAll();
            /*getData();
            $scope.wholeInfo.templateList.forEach(function (n,i) {
               n['active'] = false;
            });
            template.active = true;*/

        }

        $scope.tipCancel = function(){
            $scope.workSpaceInfo.preTemplateId = 0;
            $scope.workSpaceInfo.templateId =$scope.workSpaceInfo.preTemplateId;
            $('.tips').modal('hide');
        }

        $scope.tipCallback = function(){
            getData();
            $scope.wholeInfo.templateList.forEach(function (n,i) {
                n['active'] = false;
                n.id == $scope.workSpaceInfo.templateId?n.active = true:'';
            });
            $('.tips').modal('hide');
        }

        $scope.saveAll = function (callback,mark) {
            $scope.description = mark;
            $scope.hasFailed = false;
            $scope.couldClose = false;
            $('.saveTip').modal({backdrop: 'static'});

            // 所有保存请求
            $q.all({
                'saveBasicInfo': RecordCollectService.saveBasicInfo($scope.workSpaceInfo,$scope.wholeInfo.basicInfo,'save'),
                'saveAll': RecordCollectService.saveAll($scope.workSpaceInfo,$scope.wholeInfo.templateData,$scope.wholeInfo,mark),
                'savePrescript': RecordCollectService.savePrescript($scope.wholeInfo.prescription, {'xlPatientId': $routeParams.xlPatientId, 'xlVisitId': $routeParams.xlVisitId},'save')
            }).then(function(obj) {
                // 迭代返回的保存状态,是否有保存失败
                angular.forEach(obj, function(val,key) {
                    if(!val.status || val.status != 'ok') $scope.hasFailed = true;
                })
                $scope.couldClose = true;
                // 根据标示选择相应的提示语
                if($scope.hasFailed) {
                    $scope.description = '保存失败, 请重试!'
                } else {
                    $scope.description = '保存成功'
                }

                callback && !$scope.hasFailed?(function () {
                    setTime();
                    $('.saveTip').on('hidden.bs.modal', function () {
                        callback();
                    });
                })():(function () {
                    getData();
                    setTime();
                })()

            }, function(error) {
                $scope.description = '保存失败, 请重试!'
                getData();
                setTime();
            })
        }

        var timeout;
        function setTime() {
            timeout = setTimeout(function () {
                $('.saveTip').modal('hide')
            },2000);
        }

        $scope.clear = function () {
            clearTimeout(timeout);
            $('.saveTip').modal('hide');
        }

        $scope.jump = function (mark,discribe) {
            var callback = function(){
                mark == 'view'?''
                    /*(function () {
                        //'http://'+window.location.hostname+':'+window.location.port+'/record-src-demo#/record/'+$routeParams.xlPatientId
                        window.open('www.baidu.com',"blank");
                    })()*/
                :(function () {
                        !$routeParams.hideR && $routeParams.right ?
                            window.location.href = 'http://'+window.location.hostname+':'+window.location.port+'/record-collect-src/#/record-list'
                            :window.location.href = 'http://'+window.location.hostname+':'+window.location.port+'/record-collect-src/#/record-list/1'
                    })();
            };

            callback();
            $scope.saveAll(callback,discribe);
        }

        $scope.changeRight = function () {
            $scope.workSpaceInfo.showRight = !$scope.workSpaceInfo.showRight;
        }

        $scope.print = function (mark) {
            RecordCollectService.bindPrint()
        }
}]);
