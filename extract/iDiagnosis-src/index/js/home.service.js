angular.module('infi-basic').service("HomeService", ['$rootScope', 'TaskService', 'SYS', 'Utils', '$http', function ($rootScope, TaskService, SYS, Utils, $http) {
    /**
     * 初始化获取 nav 标签
     * @param {*} tmpId 
     */
    this.getInitTag = function (tmpId) {
        return $http.get(SYS.url + 'config/tag/by/template/' + tmpId).then(function (msg) {
            return msg.data
        }, function (error) {
            console.log('获取 tag 失败' + error.status)
        })
    }


    /**
     * 性别切换
     * @param {*} radioIndex 
     * @param {*} data 
     */
    this.changeRadio = function (radioIndex, data) {
        var genderMap = ['男', '女']

        data.gender = {
        index: radioIndex,
        value: genderMap[radioIndex]
        }
    }

    /**
    * 上一步 / 下一步 / 导航条切换
    */
    this.changeStep = function (type, step, $scope) {
        switch (type) {
            // 上一步
            case 0:
                $scope.currentStep = --$scope.currentStep > 0 ? $scope.currentStep : 0
                location.href = $scope.navMap[$scope.currentStep]
                break
            // 下一步
            case 1:
                if (++$scope.currentStep < $scope.navMap.length - 1) {
                    $scope.currentStep = $scope.currentStep
                    location.href = $scope.navMap[$scope.currentStep]
                } else {

                    $scope.currentStep = $scope.navMap.length - 1

                    // 转换为后台数据分析所需格式
                    var genRst = TaskService.convertToAnalysis($scope.finalResult)

                    $scope.hasRst = true

                    /**
                     * 请求诊断结果失败
                     */
                    function getRstErr() {
                        var tip = {
                            status: 'error',
                            description: "生成失败，请尝试重新生成！"
                        }

                        Utils.sysTip($scope, tip);

                        $scope.changeStep(2, $scope.navMap.length - 2)
                        $scope.hasRst = false
                    }

                    TaskService.httpPOST(SYS.url + 'model/diagnosis', genRst).then(function success(msg) {

                        if (Utils.type(msg.data) == 'object') {

                            location.href = $scope.navMap[$scope.currentStep]
                            // 需要等到上句代码对应的 controller 加载完成后再广播获取数据成功事件
                            $scope.$on('$viewContentLoaded', function () {
                                $scope.$broadcast('genSuccess', msg)
                            });
                        } else {
                            getRstErr()
                        }
                    }, function error(e) {
                        getRstErr()
                    })

                }
                break
            // navbar 点击跳转
            case 2:
                $scope.currentStep = step
                location.href = $scope.navMap[step]
                break
        }

    }

    /**
     * 右侧编辑
     */
    this.editChose = function (part) {
        $("#selection-pop").modal('show')
        $rootScope.popId = part.id


        $rootScope.curPopData.parent = part.origin
        $rootScope.curPopData.part = part.origin
    }

    /**
     * 右侧取消
     * @param {*} part 
     * @param {*} value 
     * @param {*} scope 
     */
    this.cancelChose = function (part, value, scope) {
        var infoData = scope.finalResult[scope.currentStep],
            popParent = value

        scope.$broadcast('hideLink')


        if (part.children && popParent.hasChild) {
            angular.forEach(part.children, function (value, index) {
                value.checked = !value.checked
                $rootScope.selectedClass.splice($rootScope.selectedClass.indexOf(value.id + '_' +value.label), 1)
            })

            part.checked = false
            delete infoData.children[part.id]
            $rootScope.selectedClass.splice($rootScope.selectedClass.indexOf(part.id + '_' + part.label), 1)


            // 删除 valueId
            delete $rootScope.recommandAbout.valueIds[part.id]


        } else {
            if (part.tagLabel) {

                part.checked = false
                delete infoData.children[popParent.id].children[popParent.id + '_' + part.id]
                $rootScope.selectedClass.splice($rootScope.selectedClass.indexOf(popParent.id + '_' + part.id), 1)

                // 删除 valueId
                var valInd = $rootScope.recommandAbout.valueIds[popParent.id].indexOf(part.id)
                $rootScope.recommandAbout.valueIds[popParent.id].splice(valInd, 1)


                if (JSON.stringify(infoData.children[popParent.id].children) == '{}') {
                    infoData.children[popParent.id].hasChild = false;
                } else {
                    infoData.children[popParent.id].hasChild = true;
                }
            } else {
                popParent.checked = false
                delete infoData.children[popParent.id]
                $rootScope.selectedClass.splice($rootScope.selectedClass.indexOf(part.id + '_' + part.label), 1)

                // 删除 valueId
                delete $rootScope.recommandAbout.valueIds[popParent.id]

            }
        }

        infoData['show'] = TaskService.isEmptyObj(infoData.children) ? false : true;

    }


    this.contrUtils = {
        mkFinalResult: function (modArr) {
            var finalResult = [],
                singleEle = {}

            angular.forEach(modArr, function (val, ind) {
                singleEle = {
                    modelIndex: ind,
                    id: ind,
                    label: val.label,
                    children: {},
                    originData: null
                }

                finalResult.push(singleEle)
            })

            finalResult[0]['extraInfo'] = {
                gender: {},
                age: null
            }

            return finalResult
        },
        mkNavmap: function (orgMap) {
            var orgNavMap = {
                "体征": {
                    link: '#/symptoms'
                },
                "症状": {
                    link: '#/info'
                },
                "既往史": {
                    link: "#/history"
                },
                "检查": {
                    link: "#/check"
                },
                "检验": {
                    link: "#/checkout"
                }
            },
                finalMap = [],
                tmpEle = null

            angular.forEach(orgMap, function (val, ind) {
                tmpEle = orgNavMap[val.label].link
                finalMap.push(tmpEle)
            })

            finalMap.push('#/detail')

            return finalMap
        }
    }


}])