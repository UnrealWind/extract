angular.module('infi-basic')
    .service('FileUploadServices',['$http','SYS',function($http,SYS){
        //上传
       this.upload = function ($files,input,isMultiple,attachment,$scope) {
           //后台需要这个状态区分不同功能的图片上传
           var pic_type = null;
           if(input.type =='图片上传-多张'){
               pic_type = 'all';
           }else if(input.type =='影像图片上传-多张'){
               pic_type = 'dicom';
           }else {
               pic_type='common';
           }

           //上传成功列表数据,每次需要进行清空,不能提到函数外面
           $scope.upls = [];

           //控制上传按钮的开启和关闭,不能提到函数外面
           $scope.stopload = false;

           //记录上传的个数,判断是否传完,不能提到函数外面
           $scope.num = 0;

           //每次上传初始化,不能提到函数外面
           $scope.datas.length = 0;

           //初始滚动条在最上面
           $('#load-body').scrollTop(0);
           $scope.scrollTop();
           for(var i = 0; i < $files.length; i++){
               $scope.datas[i] = {};
               $scope.datas[i].name = $files[i].name;
               $scope.datas[i].status = '';
               $scope.datas[i].upshow = true;
               $scope.datas[i].evt = '0';
               $scope.datas[i].result = '...正在上传...';
               if( i == 0 ){
                   $('#imgLoad').modal({backdrop: 'static'});
               }
               upload($files[i],$scope.datas[i]);
           }

           function upload(file,obj){
               var url = '';
               var data = null;
               if(attachment){
                   url=SYS.url+'/subject/record/file/save';
                   data = {fileType:isMultiple,recordId:SYS.routeParams.recordId};
               }else{
                   url=SYS.url+'/load/data/file/'+$scope.routeParams.projectName+'/'+$scope.routeParams.recordId;
                   data = {filter:true};
               }
               $scope.upload = Upload.upload({
                   url: url+'?pic_type='+pic_type,
                   method: 'post',
                   file: file,
                   params: data
               }).progress(function(evt){
                   var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                   obj.evt = progressPercentage-1;
               }).then(function (msg){

                   //如果是附件查看
                   if(attachment){
                       var arr = []
                       arr.push(msg.data.data);
                       msg.data.data = arr;
                   }
                   if(msg.data.status == 'ok'){
                       FileService.makeUpFileOpt(input,msg,isMultiple,attachment);
                       obj.status = 'good';
                       obj.result = '上传成功';
                       obj.evt = 100;
                   }else if(msg.data.status == 'error' || msg.data.status == 'blank'){
                       obj.status = 'red';
                       obj.result = '上传失败';
                       obj.evt = 0;
                   }
                   $scope.upls.push({name:obj.name , status:obj.status ,result:obj.result});
                   obj.upshow = false;
                   $scope.num++;
                   if($scope.datas.length == $scope.num){
                       $scope.stopload = true;
                   }

                   if(attachment){
                       input.files.push(msg.data.data[0]);
                       $scope.getImgData(msg.data.data[0].id,input.files);

                       //创建下载文件url数组
                       $scope.attachmentDownloadList = [];
                       input.value.forEach(function(n,i){
                           $scope.attachmentDownloadList.push(SYS.url+'/subject/record/load/'+n)
                       })
                   }else{
                       $scope.downloadList = [];
                       input.value.forEach(function(n,i){
                           $scope.downloadList.push(SYS.url+'/load/data/file/'+n)
                       })
                   }

               });
           }
       }
    }]);