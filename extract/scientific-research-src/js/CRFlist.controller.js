angular.module("infi-basic").controller('CrfListController',
    ['$scope','SYS','$http','$timeout','crfCustomizeServices',function ($scope,SYS,$http,$timeout,crfCustomizeServices) {

        //获取分页及处理数据
        $scope.page = {};
        $scope.page.number = 1;

        crfCustomizeServices.getCrfList($scope.page.number).then(function (data) {
            $scope.data = data.page.content;
            $scope.page = data.page;
        });
        $scope.updatePageAttend = function (pageNo) {
            crfCustomizeServices.getCrfList(pageNo).then(function (data) {
                $scope.data = data.page.content;
                $scope.page = data.page;
                $scope.page.number++;
            });
        }
        $scope.delete = function (item) {
            $scope.promptMainContent = '确认删除' + ' ' + item.name + ' ' + '?';
            $('#crf-prompt').modal();
            $scope.item = item;
        }
        $scope.deleteCrf = function() {
            crfCustomizeServices.deleteCrf($scope.item.id).then(function () {
                $scope.updatePageAttend();
            });
        }

        //修改crf属性页面跳转
        $scope.jumpToCustomize = function (ev) {
            location.href = '#/CRF-customize/' + ev.id;
        }

        //修改CRF状态
        $scope.modifyStatus = function (data) {
            $scope.statusData = data;
            $scope.status = data.status.name;
            crfCustomizeServices.modifyStatus($scope.statusData.id,$scope.status).then(function (data) {
                if(data == 'ok') {
                    $scope.modifyPrompt = '发布成功';
                    $('#modify-success').modal();
                    $timeout(function () {
                        $('#modify-success').modal('hide');
                    },2000)
                }
                if($scope.page.number == 0) $scope.page.number=1;
                crfCustomizeServices.getCrfList($scope.page.number).then(function (data) {
                    $scope.data = data.page.content;
                    $scope.page = data.page;
                });
            })
        }

        //跳转预览页面
        $scope.jumpToView = function (id) {
            location.href = '#/CRF-view/' + id;
        }
    }]);
