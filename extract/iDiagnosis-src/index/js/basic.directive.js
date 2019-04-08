angular.module('infi-basic')
.directive('navBar',function (){
  // 顶部导航条
  return {  
      restrict: 'ECMA',
      templateUrl: 'js/html/navBar.html',
      replace: true,
      scope:{
        currentStep: '=',
        changeStep: '=',
        navData: '='
      },
      link:function (scope) {
        /**
         * 计算导航栏每一个的宽度
         * @param {*} navCount 导航条目个数
         */
        function calcNavItemWidth (navCount, callback) {
          var navItemWidth = 100 / (navCount + 1)
          callback(navItemWidth)
          scope.navWidth = {
            'width': navItemWidth + '%'
          }
        }

        /**
         * 改变进度条宽度
         * @param {*} newVal 新标签
         * @param {*} persent 每格进度条百分比
         */
        function changeProcessWidth (currStep, persent) {
          var curProceWidth = (currStep + 1) * persent
          scope.curWidth = {
            'width': curProceWidth + '%'
          }
        }

        calcNavItemWidth(scope.navData.length, function(navItemWidth) {
          scope.$watch('currentStep', function(newVal, oldVal) {
            changeProcessWidth(newVal, navItemWidth)
          })
        })
      }
  }
})
.directive('selectionPop', ['TaskService', '$rootScope', function(TaskService,$rootScope) {
  // 最后一级选项弹窗，例： 点击胸痛弹出。
  return {
    restrict: 'ECMA',
    templateUrl: 'js/html/selectionPop.html',
    replace: true,
    scope: {
      part: '=',   // 胸痛一级,
    },
    link: function(scope) {
      scope.choseDetail = function(part, partDeatil) {
      
      var infoData = scope.$parent.finalResult[scope.$parent.currentStep],
          indexId = $rootScope.curPopData.parent.id + '_' +part.id
      
      if (!infoData.children[$rootScope.curPopData.parent.id].children[indexId]) {
        infoData.children[$rootScope.curPopData.parent.id].children[indexId] = {
          "id": part.id,
          "label": part.label,
          "checked": true,
          "tagLabel": partDeatil.label + ':' + part.label
        }

        // 保存 valueId
        $rootScope.recommandAbout.valueIds[$rootScope.curPopData.parent.id].push(part.id)



        $rootScope.selectedClass.push(indexId)
      } else {


        delete infoData.children[$rootScope.curPopData.parent.id].children[indexId]

        $rootScope.selectedClass.splice($rootScope.selectedClass.indexOf(indexId), 1)


        // 删除 valueId
        var valInd = $rootScope.recommandAbout.valueIds[$rootScope.curPopData.parent.id].indexOf(part.id)
        $rootScope.recommandAbout.valueIds[$rootScope.curPopData.parent.id].splice(valInd, 1)

      }

      infoData.children[$rootScope.curPopData.parent.id].hasChild = TaskService.isEmptyObj(infoData.children[$rootScope.curPopData.parent.id].children) ? false : true;
      }
    }
  }
}])
// 已保存的模板弹窗
.directive('savedModel', ['TaskService', 'SYS', function(TaskService, SYS) {
  return {
    restrict: 'ECMA',
    templateUrl: 'js/html/saved-model.html',
    replace: true,
    link: function(scope) {
      scope.whichPage = 'display'   // 区分列表所属页
      scope.content = [];
      scope.columns = [{label:"模板名称",name:"name"}];
      scope.opts = {
        label:"操作",
        btns:[{
            label:"应用",
            type:"apply"
        },{
            label:"删除",
            type:"delete"
        }]};
      
      
      scope.updatePage = function (page) {
        scope.currentPage = page
        TaskService.getExportList(page,SYS.DEFAULT_PAGE_SIZE).then(function (msg) {
          scope.content = msg;
        });
      }
      // 初始化已保存列表
      scope.updatePage(SYS.DEFAULT_PAGE_NUMBER)

      // 查看已保存模板
      scope.$on('changeContent', function(e, parm) {
        scope.updatePage(parm)
      })


      /**
       * 收藏的模板具体操作
       * @param entity  要操作的数据
       * @param type  判断进行什么操作
       */
      scope.optCollectList = function(entity, type) {
        if(type == "apply"){
          var rst = JSON.parse(entity.finalResult)
              sele = JSON.parse(entity.selectedClass)
          scope.$emit('applyModel', {
            "finalResult": rst,
            "selectedClass": sele
          })
      } else if(type == "delete"){
          scope.$emit('deleteModel', {
            entity: entity,
            pageNumber: scope.currentPage
          })
        }
      }
    }
  }
}])

.directive('saveModelPropt', function() {
  return {
    restrict: 'ECMA',
    templateUrl: 'js/html/save-model-propt.html',
    replace: true,
    scope: {},
    link: function(scope) {
      scope.clear = function(){
        scope.collectName="";
        scope.hasCollectName = true
      };


      scope.clear();
      // 保存成功后
      scope.$on('saveSuccess', function(e) {
        scope.clear();
      })

      // 确认保存
      scope.confirmCollect = function () {
        if (!scope.collectName) {
          scope.hasCollectName = false
        } else {
          scope.hasCollectName = true
          // 进行保存程序
          scope.$emit('saveModel', {
            "collectName": scope.collectName
          })
        }
      }
    }
  }
})
.directive('getDataLoading', function() {
  return {
    restrict: 'ECMA',
    templateUrl: 'js/html/data-loading.html',
    replace: true,
    scope: {
      getRst: '='
    },
    link: function(scope) {
    }
  }
})
.directive('loadingMask', ['$timeout', function($timeout) {
  return {
    restrict: 'ECMA',
    templateUrl: 'js/html/loading-mask.html',
    replace: true,
    scope: {
      hasRst: '=',
    },
    link: function(scope) {
      if(timeout) {
        $timeout.cancel(timeout);
      }  

      var timeout = $timeout(function() {
        scope.canCancel = true
      }, 1000);

      // 取消生成结果
      scope.cancelGenRst = function() {
        scope.$emit('detailLoaded')
      }
    }
  }
}])




