angular.module('infi-basic')
    .controller('TopicsInputController', ['$scope','$rootScope','DataService','Upload','SYS','$http','$routeParams',function ($scope,$rootScope,DataService,Upload,SYS,$http,$routeParams) {

        $scope.basic = {
            visible:'name___u516C__u5F00__u5171__u4EAB'
        };

        $scope.navTopicName = '新建课题';

        $scope.type = false;

        $scope.research = function(){
            $scope.researchTypes();
        }
        $scope.researchTypes = function(){
            $scope.type = true;
            if( $scope.basic.type == 'name___u63CF__u8FF0__u6027__u7814__u7A76'){
                $scope.researchType = [
                    {name:'现状研究',value:'1'},
                    {name:'生态学研究',value:'2'}
                ]
            }else if( $scope.basic.type == 'name___u5206__u6790__u6027__u7814__u7A76'){
                $scope.researchType = [
                    {name:'病例对照研究',value:'name___u75C5__u4F8B__u5BF9__u7167__u7814__u7A76'},
                    {name:'队列研究',value:'name___u961F__u5217__u7814__u7A76'}
                ]
            }else if( $scope.basic.type == 'name___u5B9E__u9A8C__u6027__u7814__u7A76'){
                $scope.researchType = [
                    {name:'临床试验',value:'3'},
                    {name:'现场试验',value:'4'},
                    {name:'社区实验',value:'5'}
                ]
            }else if( $scope.basic.type == 'name___u6570__u636E__u5E93__u53CA__u5176__u5B83'){
                $scope.researchType = [
                    {name:'数据库及其他',value:'6'}
                ]
            }
        }

        if($routeParams.id){

            DataService.ajaxInputData($routeParams.id).then(function(data){
                //修改一步要发送的数据格式
                var datas = {
                    "id":$routeParams.id,
                    "basePoint":data.data.basePoint,
                    "beginTime":data.data.beginTime,
                    "createTime":DataService.newTime(data.data.createTime),
                    "center":data.data.center,
                    "code":data.data.code,
                    "email":data.data.email,
                    "ename":data.data.ename,
                    "endTime":data.data.endTime,
                    "master":data.data.master,
                    "name":data.data.name,
                    "phone":data.data.phone,
                    "projectName":data.data.projectName,
                    "remarks":data.data.remarks,
                    "researchType":data.data.researchType,
                    "researchWay":data.data.researchWay,
                    "serialNumber":data.data.serialNumber,
                    "significance":data.data.significance,
                    "type":data.data.type,
                    "visible":data.data.visible,
                    "creatorId":data.data.creatorId,
                    "hospitalName":data.data.hospitalName,
                    "sectName":data.data.sectName,
                    "attendUsers":data.data.attendUsers,
                    "subjectGroup":data.data.subjectGroup,
                    "subjectFiles":data.data.subjectFiles
                }
                $scope.basic =  datas ;
                $scope.navTopicName = $scope.basic.name
                $scope.researchTypes();
                $scope.basic.beginTime = DataService.newTime(data.data.beginTime);
                $scope.basic.endTime = DataService.newTime(data.data.endTime);
                if($scope.basic.subjectGroup > 0){
                    for(var i = 0 ; i < $scope.basic.subjectGroup.length ; i++){
                        delete $scope.basic.subjectGroup[i].achieve;
                        delete $scope.basic.subjectGroup[i].recordNum;
                        delete $scope.basic.subjectGroup[i].projectName;
                        for(var ii = 0 ; ii < $scope.basic.subjectGroup[i].taskGroup.length ; ii++){
                            delete $scope.basic.subjectGroup[i].taskGroup[ii].achieveSize;
                            delete $scope.basic.subjectGroup[i].taskGroup[ii].recordNum;
                        }
                    }
                }
                
            });
        }

      //zjl_debug 这边表单的生成使用test/do.gen.form.js方式
      //文件上传直接使用冯岩提供的directive
        /*$scope.subjectFiles = [];
        $scope.onFileSelect = function($files,input){
            for(var i = 0 ; i < $files.length; i++){
                $http({
                    method:'post',
                    url:SYS.url+'subject/file/save',
                    // data:jeesite.session.id='8fba80d22749487c87e13ae9471f9036',
                    params:$files[i]
                }).then(function(data){
                    //console.log(data,111111);
                });
                // $scope.upload = Upload.upload({
                //     url: SYS.url+'subject/file/save',
                //     method: 'POST',
                //     file: $files[i]
                // }).then(function (msg){
                //     $scope.subjectFiles.push(msg.data.data);
                //         //console.log(msg.data.data,'文件上传返回的数据');
                // });
                //console.log($files[i],'传输文件的每条信息');
            }
        }*/

        $scope.topicsNext = function(mark){

            if( $scope.basic.name == '' || $scope.basic.name == null || !$scope.basic.name ||
                $scope.basic.master == '' || $scope.basic.master == null || !$scope.basic.master ||
                $scope.basic.center == '' || $scope.basic.center == null || !$scope.basic.center ||
                $scope.basic.visible == '' || $scope.basic.visible == null || !$scope.basic.visible ||
                $scope.basic.type == '' || $scope.basic.type == null || !$scope.basic.type ||
                $scope.basic.researchType == '' || $scope.basic.researchType == null || !$scope.basic.researchType
            ){
                $scope.promptMainContent = '红色标记为必选项'
                $('#general-prompt').modal({backdrop:'static'});
                return
            }

            $scope.promptMainContent = '保存中……';
            $('#general-prompt').modal('show');

            if($routeParams.id){
                console.log($scope.basic,'修改第一步发送的数据');
                DataService.ajaxTopicsModifyNext($scope.basic).then(function(data){
                    //console.log(data,'修改第一步返回的数据');
                    if(mark){
                        $scope.promptMainContent = '保存成功！';
                    }else{
                        $('#general-prompt').modal('hide');
                        $('#general-prompt').on('hidden.bs.modal', function (e) {
                            location.href = '#/topics.input.group/'+$routeParams.id;
                        })
                    }
                })
            }else{
                // console.log($scope.basic,'新建第一步发送的数据');
                DataService.ajaxTopicsNext($scope.basic).then(function(data){
                    //console.log(data,'新建第一步返回的数据');
                    if(mark){
                        $('#general-prompt').modal('hide');
                        $scope.promptMainContent = '保存成功！';
                    }else{
                    	$('#general-prompt').modal('hide');
                        $('#general-prompt').on('hidden.bs.modal', function (e) {
                            location.href = '#/topics.input.group/'+data.data.data.id
                        })
                    }
                })
            }
        };

        //提示框中的确定
        $scope.promptMainContentSave = function(){
            if($scope.promptMainContent == '确定删除么?'){
                $scope.inviteDeletes();
            }else if($scope.promptMainContent == '确定邀请么?'){
                $scope.inviteModalTotal()
            }else if($scope.promptMainContent == '没有邀请人'){
                $('#general-prompt').modal('hide');
                location.href = '#/topics.input.task/'+$routeParams.id;
            }else{
                $('#general-prompt').modal('hide');
            }
        }
    }]);
