angular.module('infi-basic').service("infoTabService", ['$rootScope', 'TaskService', function ($rootScope, TaskService) {
  /**
   * 最后一级点击
   * @param {*} part 
   * @param {*} model 
   * @param {*} scope 
   */ 
  this.choserPop = function (part, classify, scope) {

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
          scope.hideLink = true

          if ($rootScope.selectedClass.indexOf(part.id + '_' + part.label) >= 0) {
              $("#selection-pop").modal('show')

          } else {

              $rootScope.selectedClass.push(part.id + '_' + part.label)

              // 保存 valueId
              $rootScope.recommandAbout.valueIds[part.id] = [part.id]

              $rootScope.hasCheckedTag = part.attributeNodes

              if (part.relateNodes.length > 0 && $rootScope.recommandAbout.tag.label == "症状") scope.recommendLink = part.relateNodes

              $("#selection-pop").modal('show')

              infoData.children[popParent.id] = {
                  "id": popParent.id,
                  "label": popParent.label,
                  "checked": true,
                  "origin": popParent,
                  "children": {},
                  "classify": classify.label,
                  "clazz": popParent.clazz
              }
          }

      } else {
          // 隐藏相应症状
          scope.hideLink = false


          if ($rootScope.selectedClass.indexOf(part.id + '_' + part.label) >= 0) {

            
            delete infoData.children[part.id]
            
            $rootScope.selectedClass.splice($rootScope.selectedClass.indexOf(part.id + '_' + part.label), 1)

            // 删除 valueId
            delete $rootScope.recommandAbout.valueIds[part.id]

          } else {
              infoData.children[part.id] = {
                  "id": part.id,
                  "label": part.label,
                  "checked": true,
                  "classify": classify.label,
                  "clazz": part.clazz
              }
              
              $rootScope.selectedClass.push(part.id + '_' + part.label)


              // 保存 valueId
              $rootScope.recommandAbout.valueIds[part.id] = part.id

          }

      }


      // 只要是点击过选项就改变根数据源以回显
      infoData['show'] = TaskService.isEmptyObj(infoData.children) ? false : true;
  }

}])