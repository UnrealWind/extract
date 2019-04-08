angular.module('infi-basic').controller('ListController', ['$scope','DataService','EMR','Utils','SYS','$location',function ($scope,DataService,EMR,Utils,SYS,$location) {
    $scope.projectName = 'A0301';

    $scope.record = {
        patientName:"",
        patientId:"",
        patientVisitId:"",
        sectName:""
    };
    $scope.opts = {
        label:"操作",
        btns:[
            // {
            //     label:"详情",
            //     type:"show"
            // },
            {
                label:"修改",
                type:"update"
            },{
                label:"删除",
                type:"del"
            }
        ]
    };
    $scope.admission = function(){
        $scope.record = {
            patientName:"",
            patientId:"",
            patientVisitId:"",
            sectName:""
        };
      $('#infi-listcreate').modal({backdrop: 'static'});
    };

    $scope.hideAdmission = function(){
        $('#infi-listcreate').modal('hide');
    };

    $scope.getList = function (page,size){
      DataService.ajaxList({
          "projectName": $scope.projectName,
          "number":page,
          "size":size
      }).then(function(data){
          if(data.status == SYS.STATUS_SUCCESS){
              $scope.listData=data;
              $scope.listData.page.number ++ ;
          }else{
              $scope.listData = {};
          }
      });
    };
    
    $scope.updateList = function(pages){
        $scope.getList(pages,EMR.PAGE_SIZE);
    };

    /**
     * 操作
     * @param entity
     * @param type
     */
    $scope.operation = function(entity,type){
        if(type == 'update'){
            // zyz_deubg　用ｗｉｎｄｏｗ的话下一个页面不能显示新增的ｏｐｔｉｏｎｓ
            // window.location.href = '#/input/'+entity.id;
            $location.path('input/'+entity.id);
        }else if(type == 'del'){
            $scope.delOperation(entity);
        }
    };

    $scope.delOperation = function(entity){
        var msg = {
            status:"",
            description:""
        };
        DataService.delRecord({
            id:entity.id,
            version:entity.version
        }).then(function(data){
            $scope.getList(EMR.PAGE_NUMBER,EMR.PAGE_SIZE);
            if(data.status == SYS.STATUS_SUCCESS){
                msg.status = SYS.STATUS_SUCCESS;
                msg.description = '删除成功';
            }else{
                msg.status = SYS.STATUS_ERROR;
                msg.description = '删除失败';
            }
            Utils.sysTip($scope,msg);
        })
    };

    $scope.createRecord = function(){
        var msg = {
            status:"",
            description:""
        };
        DataService.createRecord({
            projectName:$scope.projectName,
            record:$scope.record
        }).then(function(data){
            var recordId = data.data.id;
            if(data.status == SYS.STATUS_SUCCESS) {
                msg.status = SYS.STATUS_SUCCESS;
                msg.description = '病历创建成功';
            }else{
                msg.status = SYS.STATUS_ERROR;
                msg.description = '病历创建失败';
            }
            Utils.sysTip($scope,msg);
            $scope.hideAdmission();
            $scope.getList(EMR.PAGE_NUMBER,EMR.PAGE_SIZE);
            if(data.status == SYS.STATUS_SUCCESS) {
                setTimeout(function(){
                    // window.location.href = '#/input/'+recordId;
                    $location.path('input/'+recordId);
                },500);

            }
        })
    };
    function getListColumns(){
      DataService.ajaxColumns('list').then(function(data){
        $scope.listColumns = data.data;
      });
    }

    $scope.getList(EMR.PAGE_NUMBER,EMR.PAGE_SIZE);
    getListColumns();
  }]);
