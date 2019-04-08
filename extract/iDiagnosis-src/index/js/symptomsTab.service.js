angular.module('infi-basic').service("symptomsTabService", ['$rootScope', 'TaskService', function ($rootScope, TaskService) {
    /**
     * 最后一级点击
     * @param {*} part 
     * @param {*} model 
     * @param {*} scope 
     */
    this.choserPop = function (part, scope) {
        if (!$rootScope.curPopData.part) {
            $rootScope.curPopData.part = part
        }

        part.attributeNodes.length>0 ? $rootScope.curPopData.parent = part : undefined;

        // 缓存变量
        var infoData = scope.$parent.finalResult[scope.$parent.currentStep],
            popParent = $rootScope.curPopData.parent

        if (part.attributeNodes.length>0) {
            // 保存带弹层的 part.id 用于提取弹出层的数据
            $rootScope.popId = part.id
            // 显示相应症状
            scope.hideLink = false

            if ($rootScope.selectedClass.indexOf(part.id) >= 0) {
                $("#selection-pop").modal('show')

            } else {
                $rootScope.selectedClass.push(part.id)

                $("#selection-pop").modal('show')

                infoData.children[popParent.id] = {
                    "id": popParent.id,
                    "label": popParent.label,
                    "checked": true,
                    "origin": popParent,
                    "children": {}
                }
            }

        } else {
            // 隐藏相应症状
            scope.hideLink = true


            if ($rootScope.selectedClass.indexOf(part.id) >= 0) {
                delete infoData.children[part.id]

                $rootScope.selectedClass.splice($rootScope.selectedClass.indexOf(part.id), 1)

            } else {
                infoData.children[part.id] = {
                    "id": part.id,
                    "label": part.label,
                    "checked": true,
                }

                $rootScope.selectedClass.push(part.id)
            }

        }

        // 只要是点击过选项就改变根数据源以回显
        infoData['show'] = TaskService.isEmptyObj(infoData.children) ? false : true;
    }


}])