angular.module('infi-basic')
// 列表
.directive('viewTable',[function(){
  return {  //取数列表页面表格的显示
      restrict: 'A',
      templateUrl: '../common/directives/table/table.html',
      scope:{
          columns:'=columns',
          content:'=content',
          updatePage:'&updatePage',
          btnCallback: '&btnCallback'
      },
      link:function($scope){
          $scope.$watch('columns',function(){
              updateValue($scope.columns,$scope.content);
          });
          $scope.$watch('content',function(){
              updateValue($scope.columns,$scope.content);
          });

          function updateValue(columns,content) {
              $scope.$columns = angular.copy(columns);
              $scope.$content = [];
              $scope.$hasData = true;
              if( content && content.page ){
                  angular.forEach(content.page.content,function (entity) {
                      var data = {
                          plain: [],
                          original: entity
                      };
                      angular.forEach(columns,function (column) {
                          //这种情况是不需要维表转义，后台直接提供中文
                          data.plain.push({label:entity[column.name]});
                      });
                      $scope.$content.push(data);
                      $scope.$content.totalElements = content.page.totalElements;
                      $scope.$content.totalPages = content.page.totalPages;
                      $scope.$content.number = content.page.number;
                      $scope.$content.size = content.page.size;
                  })
              } else {
                  $scope.$hasData = false;
                  $scope.$description = content&&content.description ? content.description : '暂无数据';
                  $scope.$columnSize = $scope.opts ? columns.length+1 :columns.length;
              }
          }
      }
  }
}])