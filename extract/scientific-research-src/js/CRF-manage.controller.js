angular.module("infi-basic").controller('CRFManageController',
    ['$scope','SYS','$http','CRFManageService','$routeParams','$timeout','subjectDetailService',
        function ($scope,SYS,$http,CRFManageService,$routeParams,$timeout,subjectDetailService) {

            $scope.CRFTemplateList = [];
            $scope.updateCRFShow = false;
            $scope.viewDetailShow = false;
            $scope.viewTemplateId = null;
            $scope.deptList = [];
            $scope.typeLists = $scope.typeList;
            $scope.params = {
                dept:'',
                type:'',
                name:''
            }
            $scope.CRFparams = {
                dept:'',
                type:'',
                name:''
            }
            $scope.showData = false;
            $scope.paramsData = {};
            $scope.getCRFTemplateList = function (pageNum,pageSize) {
                $scope.paramsData.page_number = pageNum;
                $scope.paramsData.page_size = pageSize;
                return subjectDetailService.getCRFTemplateList($scope.paramsData).then(function (msg) {
                    if(msg.status == SYS.STATUS_SUCCESS){
                        $scope.CRFTemplateList = msg.page;
                        $scope.CRFTemplatePage = msg.page;
                        $scope.CRFTemplatePage.number ++;
                        $scope.showData = false;
                    }else{
                        $scope.CRFTemplateList = {};
                        $scope.showData = true;
                    }
                })
            };
            $scope.updatePageAttend = function (pageNum) {
                $scope.getCRFTemplateList(pageNum,10);
            }

            ;(function init() {
                CRFManageService.getDeptList().then(function (msg) {
                    $scope.deptList = msg.data;
                });
                CRFManageService.getDeptType().then(function (msg) {
                    $scope.typeList = msg.data;
                });
                $scope.getCRFTemplateList(1,10);
            })();

            $scope.searchCRFPage = function () {
                $scope.paramsData = {};
                if($scope.params.name != ''){
                    $scope.paramsData.filter_LIKE_name = $scope.params.name;
                }
                if($scope.params.dept != ''){
                    $scope.paramsData.filter_EQ_deptId = $scope.params.dept;
                }
                if($scope.params.type != ''){
                    $scope.paramsData.filter_EQ_typeId = $scope.params.type;
                }
                $scope.getCRFTemplateList(1,10);
            };

            $scope.updateCRF = function () {
                $scope.updateCRFShow = true;
                $('#updateCRF').modal('show');
            }
            $scope.onFileSelect = function($files){
                CRFManageService.uploadCRF($files,$scope.CRFparams).then(function (data) {
                    if(data.data == true){
                        $('#updateCRF').modal('hide');
                        $scope.promptMainContent = '上传成功';
                        $('#general-prompt').modal('show');
                        $scope.getCRFTemplateList(1,10);
                    }else{
                        $('#updateCRF').modal('hide');
                        $scope.promptMainContent = '上传失败';
                        $('#general-prompt').modal('show');
                    }
                });
            };
            $scope.modalHide = function () {
                if($scope.promptMainContent == '上传成功' || $scope.promptMainContent == '上传失败'){
                    $('#general-prompt').modal('hide');
                }
            }
            
            $scope.viewDetail = function (opt) {
                $scope.viewTemplateId = opt.id
                $scope.viewDetailShow = false;
                $timeout(function () {
                    $scope.viewDetailShow = true;
                },0)

            }
}])