angular.module('infi-basic')
    .controller('TopicsController', ['$scope','DataService',
        function ($scope,DataService) {
        $('body').removeClass("modal-open");
        $(".modal-backdrop").remove();
        $scope.studyOverview= function(data){
        	var ipPort = 'http://'+window.location.hostname+':'+window.location.port+'/';
            window.location.href = ipPort+'study-src/#/overview/'+data;
        }
        $scope.myData = [];
        $scope.coopData = [];
        $scope.attendPageNo = 1;
        $scope.createPageNo = 1;
        //合作的数据
        $scope.attendData = function(PageNo) {
            DataService.ajaxAttendData(PageNo, 10).then(function (data) {
                //console.log(data, '合作的课题数据');
                $scope.coopData = [];
                if (data.data.status == 'ok') {
                    $scope.contents = data.data;
                    $scope.contents.page.number = $scope.contents.page.number + 1;
                    $scope.displayAttend = false;
                    for (var i = 0; i < data.data.page.content.length; i++) {
                        $scope.coopData[i] = {};
                        $scope.coopData[i].label = data.data.page.content[i].name;
                        $scope.coopData[i].type = data.data.page.content[i].type;
                        $scope.coopData[i].center = data.data.page.content[i].center;
                        $scope.coopData[i].time = data.data.page.content[i].createTime;
                        // $scope.coopData[i].status = data.data.page.content[i].status;
                        $scope.coopData[i].status = '采集中...';
                        $scope.coopData[i].id = data.data.page.content[i].id;
                        $scope.coopData[i].typeName = '课题类型';
                        $scope.coopData[i].centerName = '创建中心';
                        $scope.coopData[i].timeName = '创建时间';
                        $scope.coopData[i].statusName = '课题状态';
                    }
                } else{
                    $scope.displayAttend = true;
                }
            })
        }

        //自己的数据
        $scope.createData = function(PageNo) {
            DataService.ajaxCreateData(PageNo, 10).then(function (data) {
                //console.log(data, '自己的课题数据');
                $scope.myData = [];
                if (data.data.status == 'ok') {
                    $scope.content = data.data;
                    $scope.content.page.number = $scope.content.page.number + 1;
                    $scope.displayCreate = false;
                    for (var ii = 0; ii < data.data.page.content.length; ii++) {
                        $scope.myData[ii] = {};
                        $scope.myData[ii].label = data.data.page.content[ii].name;
                        $scope.myData[ii].type = data.data.page.content[ii].type;
                        $scope.myData[ii].center = data.data.page.content[ii].center;
                        $scope.myData[ii].time = data.data.page.content[ii].createTime;
                        // $scope.myData[ii].status = data.data.page.content[ii].status;
                        $scope.myData[ii].status = '采集中...';
                        $scope.myData[ii].id = data.data.page.content[ii].id;
                        $scope.myData[ii].typeName = '课题类型';
                        $scope.myData[ii].centerName = '创建中心';
                        $scope.myData[ii].timeName = '创建时间';
                        $scope.myData[ii].statusName = '课题状态';
                    }
                } else{
                    $scope.displayCreate = true;
                }
            })
        }
        $scope.createData($scope.createPageNo);
        $scope.attendData($scope.attendPageNo);

        //自己分页
        $scope.updatePageCreate = function(PageNo){
            $scope.createPageNo = PageNo.page;
            $scope.createData($scope.createPageNo);
        }

        //合作分页
        $scope.updatePageAttend = function(PageNo){
            $scope.attendPageNo = PageNo.page;
            $scope.attendData($scope.createPageNo);
        }


    }])
