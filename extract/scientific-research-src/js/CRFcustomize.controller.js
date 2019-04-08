angular.module("infi-basic").controller('CrfCustomizeController',
    ['$scope','SYS','$http','$routeParams','crfCustomizeServices',function ($scope,SYS,$http,$routeParams,crfCustomizeServices) {
        $(".modal-backdrop").remove();
        $scope.modulePage = {};
        $scope.modulePage.number = 1;
        $scope.modulePage.size = 10;

        $scope.themePage = {};
        $scope.themePage.number = 1;
        $scope.themePage.size = 10;

        $scope.SubThemePage = {};
        $scope.SubThemePage.number = 1;
        $scope.SubThemePage.size = 10;

        $scope.propertyPage = {};
        $scope.propertyPage.number = 1;
        $scope.propertyPage.size = 10;
        $scope.crfId = $routeParams.id;
        //获取CRF信息
        crfCustomizeServices.getCrfDetail($scope.crfId).then(function (data) {
            $scope.crfName = data.name;
        })
        //获取模块分页列表
        crfCustomizeServices.getModuleList($scope.modulePage,$scope.crfId).then(function (data) {
            if(data.page == null){
                $scope.hasModule = true;
                $scope.moduleData = '';
            }else {
                $scope.hasModule = false;
                $scope.moduleData = data.page.content;
                $scope.modulePage = data.page;
            }
        });
        $scope.updatePageAttendModule = function (modulePage) {
            crfCustomizeServices.getModuleList(modulePage,$scope.crfId).then(function (data) {
                if(data.page == null){
                    $scope.hasModule = true;
                    $scope.moduleData = '';
                }else {
                    $scope.hasModule = false;
                    $scope.moduleData = data.page.content;
                    $scope.modulePage = data.page;
                    $scope.modulePage.number += 1;
                }
            });
        }
        //获取主题分页列表
        crfCustomizeServices.getThemeList($scope.themePage,$scope.crfId).then(function (data) {
            if(data.page == null) {
                $scope.hasTheme = true;
                $scope.themeData = '';
            }else {
                $scope.hasTheme = false;
                $scope.themeData = data.page.content;
                $scope.themePage = data.page;

            }
        });
        $scope.updatePageAttendTheme = function (themePage) {
            crfCustomizeServices.getThemeList(themePage,$scope.crfId).then(function (data) {
                if(data.page == null) {
                    $scope.hasTheme = true;
                    $scope.themeData = '';
                }else {
                    $scope.hasTheme = false;
                    $scope.themeData = data.page.content;
                    $scope.themePage = data.page;
                    $scope.themePage.number += 1;
                }

            });
        }
        //获取子主题分页列表
        crfCustomizeServices.getSubThemeList($scope.SubThemePage,$scope.crfId).then(function (data) {
            if(data.page == null) {
                $scope.hasSubTheme = true;
                $scope.SubThemeData = '';
            }else {
                $scope.hasSubTheme = false;
                $scope.SubThemeData = data.page.content;
                $scope.SubThemePage = data.page;

            }
        });
        $scope.updatePageAttendSubTheme = function (SubThemePage) {
            crfCustomizeServices.getSubThemeList(SubThemePage,$scope.crfId).then(function (data) {
                if(data.page == null) {
                    $scope.hasSubTheme = true;
                    $scope.SubThemeData = '';
                }else {
                    $scope.hasSubTheme = false;
                    $scope.SubThemeData = data.page.content;
                    $scope.SubThemePage = data.page;
                    $scope.SubThemePage.number += 1;
                }
            });
        }

        //获取属性分页列表
        crfCustomizeServices.getPropertyDataList($scope.propertyPage,$scope.crfId).then(function (data) {
            if(data.page == null){
                $scope.hasProperty = true;
                $scope.propertyData = '';
            }else {
                $scope.hasProperty = false;
                $scope.propertyData = data.page.content;
                $scope.propertyPage = data.page;
            }
        });
        $scope.updatePageAttendProperty = function (propertyPage) {
            crfCustomizeServices.getPropertyDataList(propertyPage,$scope.crfId).then(function (data) {
                if(data.page == null){
                    $scope.hasProperty = true;
                    $scope.propertyData = '';
                }else {
                    $scope.hasProperty = false;
                    $scope.propertyData = data.page.content;
                    $scope.propertyPage = data.page;
                    $scope.propertyPage.number += 1;
                }
            });
        }

        //删除节点
        $scope.deleteNode = function(item) {
            $scope.promptMainContent = '确认删除' + ' ' + item.name + ' ' + '?';
            $('#crf-prompt').modal();
            $scope.item = item;
        }
        $scope.deletePropertyNode = function(item){
            $scope.promptMainContent = '确认删除' + ' ' + item.name + ' ' + '?';
            $('#crf-prompt').modal();
            $scope.item = item;
        }
        $('.btn-primary').click(function (modulePage) {
            if($scope.item.type.name == 'MODULE' || $scope.item.type.name == 'THEME' || $scope.item.type.name == 'SUB_THEME') {
                crfCustomizeServices.deleteNode($scope.item, $scope.crfId).then(function () {
                    if($scope.item.type.name == 'MODULE'){
                        $scope.updatePageAttendModule(modulePage);
                    }else if($scope.item.type.name == 'THEME'){
                        $scope.updatePageAttendTheme(modulePage);
                    }else if($scope.item.type.name == 'SUB_THEME'){
                        $scope.updatePageAttendSubTheme(modulePage);
                    }
                });
            }else if($scope.item.type.name == 'PROPERTY'){
                crfCustomizeServices.deletePropertyNode($scope.item, $scope.crfId).then(function () {
                    $scope.updatePageAttendProperty(modulePage);
                });
            }
        });
        //跳转属性页面
        $scope.jumpToPropertyPage = function (id, way) {
            location.href = '#/CRF-propertyPage/' + $scope.crfId + '/' + id + '/' + way;
        }
    }]);
