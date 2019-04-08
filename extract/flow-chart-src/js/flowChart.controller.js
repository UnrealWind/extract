angular.module('infi-basic').controller('FlowChartController',
    ['$scope', '$routeParams', 'SYS','$http','FlowChartServices','$timeout','$rootScope',
    function ($scope, $routeParams, SYS,$http,FlowChartServices,$timeout,$rootScope) {

        $scope.tipData = null;
        $scope.conditions = [
            { group: "nodes", data: { id: new Date().getTime() ,label:"and"},classes:'fce-shape-diamond',type:"single" },
            { group: "nodes", data: { id: new Date().getTime() ,label:"or"},classes:'fce-shape-diamond',type:"single" }
        ];

        $scope.groupActive = true;

        $scope.choseGroupShow  = function () {
            $scope.groupActive = !$scope.groupActive;
        };

        (function init() {
            FlowChartServices.getBasicData().then(function (msg) {
                $scope.datas = msg.data;
            })

            FlowChartServices.getGroups().then(function (msg) {
                $scope.groups = msg.data;
            })
        })();


        $scope.drag  = function ($event) {
            $event.stopPropagation();
            var target = $($event.target).scope();
            $event.originalEvent.dataTransfer.setData('text/plain', JSON.stringify(target.data));
        }

        $scope.allowDrop = function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
        }

        $scope.dragEnd = function(ev){
            stopDefault(ev);
            ev.stopPropagation();
        }

        $scope.drop = function($event) {
            stopDefault($event);
            $event.stopPropagation();
            FlowChartServices.DropSortData($event);
        }

        function stopDefault(e) {
            var event = e||window.event;
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        }

}]);
