angular.module('infi-basic')
    .controller('CRFtemplateController', ['$rootScope','$scope','DataService','$routeParams','$http','SYS',function ($rootScope,$scope,DataService,$routeParams,$http,SYS){

    	//fydebug = =  这俩方法要抽象成一个
       $scope.quantityChange = function(data){
            for( var i = 0 ; i < $scope.experiment.length ; i++){
                if($scope.experiment[i].name == data.name){
                    $scope.experiment[i].distributionTable = [];
                }
            }
        }
        $scope.sysCollection = false;

        $scope.quantityChanges = function(data){
            for( var i = 0 ; i < $scope.controls.length ; i++){
                if($scope.controls[i].name == data.name){
                    $scope.controls[i].distributionTable = [];
                }
            }
        }
        $scope.numberPeople = '';
        $scope.currentData = [];
        $scope.optionValue = [
            {name:'全部',value:''},
            {name:'系统模板',value:'system'},
            {name:'自定义',value:'definded'},
            {name:'收藏',value:'collection'}
        ];

        $scope.HosDep = [];
        $scope.setKeyword = '';
        $scope.experiment = [];
        $scope.controls = [];
        $scope.step=1;

        //请求全部数据
        /*DataService.ajaxInputData($routeParams.id).then(function(data){
            // console.log(data.data.subjectGroup,'发过来的全部数据');
            var experimentData = [];
            var controlsData =[];
            for(var i = 0 ; i < data.data.subjectGroup.length ; i++){
                var name = data.data.subjectGroup[i].type.substring(0,3);
                if(name == '实验组'){
                    experimentData.push( data.data.subjectGroup[i]);
                    $scope.setAdd(0);
                }else if(name == '对照组'){
                    controlsData.push( data.data.subjectGroup[i]);
                    $scope.setAdd(1);
                }
            }

            for(var i = 0 ; i < experimentData.length ; i++){
                // console.log(experimentData[i],'实验组数据');
                // experimentData[i].configFileUpload = []
                $scope.experiment[i].one[0].value = experimentData[i].code;
                $scope.experiment[i].one[1].value = experimentData[i].name;
                $scope.experiment[i].one[2].value = experimentData[i].recordSize;
                $scope.experiment[i].casesValue = experimentData[i].description;
                $scope.experiment[i].id = experimentData[i].id;
                if(experimentData[i].configFileUpload !== null){
                    $scope.experiment[i].CRFValue = experimentData[i].configFileUpload.originName;
                }
                if(experimentData[i].recordNum == 0){
                    $scope.experiment[i].CrfDisabled = false;
                }else{
                    $scope.experiment[i].CrfDisabled = true;
                }

                $scope.experiment[i].CRFData= experimentData[i].configFileUpload;

                //分配的数据
                for(var ii = 0 ; ii < experimentData[i].taskGroup.length ; ii++){
                    $scope.experiment[i].distributionTable[ii] = {}
                     $scope.experiment[i].distributionTable[ii].hospital = experimentData[i].taskGroup[ii].officeName
                     $scope.experiment[i].distributionTable[ii].departments = experimentData[i].taskGroup[ii].sectName
                     $scope.experiment[i].distributionTable[ii].number = experimentData[i].taskGroup[ii].taskSize
                }
            }
            for(var i = 0 ; i < controlsData.length ; i++){
                // console.log(controlsData[i],'对照组数据');
                // controlsData[i].configFileUpload = []
                $scope.controls[i].one[0].value = controlsData[i].code;
                $scope.controls[i].one[1].value = controlsData[i].name;
                $scope.controls[i].one[2].value = controlsData[i].recordSize;
                $scope.controls[i].casesValue = controlsData[i].description;
                $scope.controls[i].id = controlsData[i].id;
                if(controlsData[i].configFileUpload !== null){
                    $scope.controls[i].CRFValue = controlsData[i].configFileUpload.originName;
                }
                $scope.controls[i].CRFData= controlsData[i].configFileUpload;

                if(controlsData[i].recordNum == 0){
                    $scope.controls[i].CrfDisabled = false;
                }else{
                    $scope.controls[i].CrfDisabled = true;
                }
                //分配的数据
                for(var ii = 0 ; ii < controlsData[i].taskGroup.length ; ii++){
                    $scope.controls[i].distributionTable[ii] = {}
                    $scope.controls[i].distributionTable[ii].hospital = controlsData[i].taskGroup[ii].officeName
                    $scope.controls[i].distributionTable[ii].departments = controlsData[i].taskGroup[ii].sectName
                    $scope.controls[i].distributionTable[ii].number = controlsData[i].taskGroup[ii].taskSize
                }
            }
        });*/

        //点击上一步
        $scope.invitePrevious = function(){
            location.href = '#/topics.input.group/'+$routeParams.id;
        }

        $scope.btnDel = function(data,num){
            $scope.taskGroupName = data;
            $scope.taskGroupNum = num;
            $scope.promptMainContent = '确定删除"'+data+'"么?';
            $('#general-prompt').modal({backdrop:'static'});
        }
        
        $scope.btnDels = function(data,num){
            // 0代表添加实验组 , 1代表对照组
            if( num == 0 ){
                for(var i = 0 ; i < $scope.experiment.length ; i++ ){
                    if($scope.experiment[i].name == data){
                        $scope.experiment.splice(i,1);
                    }
                }
                for(var i = 0 ; i < $scope.experiment.length ; i++ ){
                    var num = 1+i;
                    $scope.experiment[i].name = '实验组'+num;
                }
            }else if( num == 1 ){
                for(var i = 0 ; i < $scope.controls.length ; i++ ){
                    if($scope.controls[i].name == data){
                        $scope.controls.splice(i,1);
                    }
                }
                for(var i = 0 ; i < $scope.controls.length ; i++ ){
                    var num = 1+i;
                    $scope.controls[i].name = '对照组'+num;
                }
            }
            $('#general-prompt').modal('hide');
        }

        $scope.setAdd = function(data){
            // 0代表添加实验组 , 1代表对照组
            if( data == 0 ){
                var Num = $scope.experiment.length+1;
                // console.log(Num);
                $scope.experiment.push(
                    {name:'实验组'+Num,one:[
                        {name:'分组编码',value:''},
                        {name:'分组名称',value:''},
                        {name:'病例数量',value:''}
                    ],casesNumber:'描述',casesValue:'',CRF:'CRF模板',CRFValue:'',CRFData:{},distribution:'任务分配',
                        distributionTable:[
                        ]
                    });
            }else if( data == 1 ){
                var Nums = $scope.controls.length+1;
                // console.log(Nums);
                $scope.controls.push(
                    {name:'对照组'+Nums,one:[
                        {name:'分组编码',value:''},
                        {name:'分组名称',value:''},
                        {name:'病例数量',value:''}
                    ],casesNumber:'描述',casesValue:'',CRF:'CRF模板',CRFValue:'',CRFData:{},distribution:'任务分配',
                        distributionTable:[
                        ]
                    })
            }
        }

        $scope.listDatas = {};
        $scope.listColumns = {};
        $scope.tableOpt = {
            label: '操作',
            btns: [
                {label: '查看详情',type: 'view'}/*,
                {label: '使用',type: 'user'}*/
            ]
        };
        $scope.sysListDatas = {};
        $scope.sysListColumns = {};

        //模板选择 --我的模态框和分页
        $scope.setCrf = function(filter,type,name){
            $scope.listDatas = {};
            $scope.listColumns = {};
            //console.log(filter,1);
            //console.log(type,1);
            //console.log(name,2);
            if(name){
                $scope.conform = name;
            }
            //获取内容
            DataService.ajaxSetCrfList(filter,'10','own',$scope.sourceType,$scope.setKeyword,'').then(function(data){
                $scope.listDatas = data.data;
                if(data.data.status == 'ok'){
                    $scope.listDatas.page.number++;
                }
            });
            //获取标题
            DataService.ajaxSetCrfColumn('','','').then(function(data){
                $scope.listColumns = data.data;
                $('#set-CrfModal').modal({backdrop: 'static'});
            });
        }
        $scope.setCrf();
        //$scope.CrfTab(1)
        //我的CRF 搜索
        $scope.setSearch = function(){
            $scope.setKeyword = $('#setSearch').val();
            $scope.sourceType=$('#sourceType').val();
            //console.log('own',$scope.sourceType,$scope.setKeyword,'发送的数据');
            $scope.setCrf();
        }

        //导航结构html结构
        // $scope.Navigational = [
        //     {name:'一级导航',arrow:'down',display:'block',
        //         navTwo:[
        //             {name:'二级导航',arrow:'down',display:'block',
        //                 text:[
        //                     {name:'文本1'},
        //                     {name:'文本2'}
        //                 ]
        //             }
        //         ]
        //     }
        // ];
        $scope.setKeywords = $('#setKeywords').val();
        //系统crf
        $scope.topicsNav = function(data){
            // //console.log(data,9999999999999);
            // $scope.listDatas = {};
            // $scope.sysListDatas = {};
            if(data.value){
                $scope.systemValue=data.value
                DataService.ajaxSetCrfList(1,'10','sys','',$scope.setKeywords,$scope.systemValue).then(function(data){
                    $scope.sysListDatas = data.data;
                    if(data.data.status == 'ok'){
                        $scope.sysListDatas.page.number++;
                    }
                });

                DataService.ajaxSetCrfColumns('','','').then(function(data){
                    $scope.sysListColumns = data.data;
                });
            }

            for(var i = 0 ; i < $scope.Navigational.length ; i++){
                if($scope.Navigational[i].children){
                    for(var ii = 0 ; ii < $scope.Navigational[i].children.length ; ii++){
                        if($scope.Navigational[i].children[ii].children){
                            for(var iii = 0 ; iii < $scope.Navigational[i].children[ii].children.length ; iii++){
                                if(data.id !== $scope.Navigational[i].children[ii].children[iii].id){
                                    $scope.Navigational[i].children[ii].children[iii].arrow = 'right';
                                    $scope.Navigational[i].children[ii].children[iii].display = 'none';
                                }
                            }
                        }
                    }
                }
            }

            if(data.display == 'block'){
                data.display = 'none';
                data.arrow = 'right';
            }else{
                data.display = 'block';
                data.arrow = 'down';
            }
        }

        //模板选择--系统crf分页
        $scope.setCrfs = function(filter,type,name){
            //获取内容
            $scope.sysListDatas = {};
            DataService.ajaxSetCrfList(filter,'10','sys','',$scope.setKeywords,$scope.systemValue).then(function(data){
                $scope.sysListDatas = data.data;
                if(data.data.status == 'ok'){
                    $scope.sysListDatas.page.number++;
                }
            });
            DataService.ajaxSetCrfColumns('','','').then(function(data){
                $scope.sysListColumns = data.data;
            });
        }

        //系统CRF 搜索
        $scope.setSearchs = function(){
            $scope.setKeywords = $('#setSearchs').val();
            // //console.log('sys',$scope.setKeyword,'发送的数据');
            $scope.setCrfs();
        }
        
        $scope.Navigational = [];
        //系统CFR模板导航
        $scope.CrfTab = function(data){

           // DataService.ajaxProjectList().then(function(data){
                //$scope.Navigational=data.data.data;
                for(var i = 0 ; i < $scope.Navigational.length ; i++){
                    $scope.Navigational[i].arrow = 'right'
                    $scope.Navigational[i].display = 'none'
                    if($scope.Navigational[i].children){
                        for(var ii = 0 ; ii < $scope.Navigational[i].children.length ; ii++){
                            $scope.Navigational[i].children[ii].arrow = 'right'
                            $scope.Navigational[i].children[ii].display = 'none'
                            if($scope.Navigational[i].children[ii].children){
                                for(var iii = 0 ; iii < $scope.Navigational[i].children[ii].children.length ; iii++){
                                    $scope.Navigational[i].children[ii].children[iii].arrow = 'right';
                                    $scope.Navigational[i].children[ii].children[iii].display = 'none';
                                }
                            }
                        }
                    }
                }
                //console.log($scope.Navigational);
            //});
            $scope.step = data;
            if($scope.step == 1){
                $scope.setCrf();
            }
        }

        $scope.pageFns = function pageFn(entity,type){
            if( type == 'view' ){
                $scope.setView(entity);
            }else if( type == 'user' ){
                $scope.serUser(entity);
            }
        }
        $scope.setView = function(entity){
            //跳转进入详情
            //$scope.step=3;
            $http({
                url:SYS.url+'/load/data/profile/'+entity.project+'/detail',
                type:'get'
            }).success(function(msg){
                $scope.currentData= msg.data;

                //回传的数据如果有value就强行置空
                update($scope.currentData);
                function update(arry){
                    arry.forEach(function(n,i){
                        if(n.value !==''||n.value !==null){
                            n.value =null
                        }
                        if(n.children){
                            update(n.children)
                        }
                    })
                }
                $('#infi-third-step').modal('show');
            })
            if( $scope.step == 2 ){
                $scope.sysCollection = true;
                $scope.sysCollectionId = entity.id;
                $scope.sysCollectionProject = entity.project;
            }else if($scope.step == 1){
                $scope.sysCollection = false;
            }
            
        };

        $scope.sysCollectionClick = function(){
            DataService.ajaxSysCollection($scope.sysCollectionId,$scope.sysCollectionProject).then(function(data){
                if(data.data.status === 'ok'){
                    $('#general-prompt').modal({backdrop:'static'});
                    $('#infi-third-step').modal('hide');
                    $scope.promptMainContent = '收藏成功！！！';
                }
            });

        }

        //模板使用按钮  我的crf和系统crf通用方法
        $scope.serUser = function(entity){
            console.log(entity);
            //点击使用
            var data = $scope.conform.substring(0,3);
            for(var i = 0 ; i < $scope.listDatas.page.content.length ; i++){
                $scope.listDatas.page.content[i].backgroundColor = false;
            }
            if($scope.sysListDatas.page){
                for(var i = 0 ; i < $scope.sysListDatas.page.content.length ; i++){
                    $scope.sysListDatas.page.content[i].backgroundColor = false;
                }
            }

            //console.log(entity);
            entity.backgroundColor = true;
            if( data == '实验组'){
                for(var i=0;i < $scope.experiment.length;i++){
                    //console.log($scope.experiment[i],66666666666);
                    if($scope.conform == $scope.experiment[i].name){
                        $scope.experiment[i].CRFValue = entity.originName;
                        $scope.experiment[i].CRFData = entity;
                    }
                }
            }else if( data == '对照组'){
                for(var i=0;i < $scope.controls.length;i++){
                    if($scope.conform == $scope.controls[i].name){
                        $scope.controls[i].CRFValue = entity.originName;
                        $scope.controls[i].CRFData = entity;
                    }
                }
            }

        }
        $scope.setReturn = function(){
            $scope.step=1;
        }
        $scope.updatePage2 = function(page,size){
            //console.log('分页请求数据： page: %s ',arguments);
        }

        //分配按钮
        $scope.setDist = function(data){
            var verification =  /^[0-9]*$/g;
            if(!verification.test(data.one[2].value)){
                $scope.promptMainContent = '病例数量不为数字!';
                $('#general-prompt').modal({backdrop:'static'});
                return
            }
            $scope.fenPei = data.name;
            $scope.HosDep = [];
            var idx = 0;
            DataService.ajaxSetDist($routeParams.id).then(function(msg){
                angular.forEach(msg.data.data, function(opt,index){
                    for(var i = 0 ; i < opt.length ; i++){
                        var value = 0
                        data.distributionTable.length >0?value = data.distributionTable[idx].number:undefined;
                        $scope.HosDep.push({name:index,names:opt[i],value:value})
                    }
                    idx++;
                });
            });
            //用来显示第几组
            $scope.GroupName = data.name;
            //分配人数
            $scope.numberPeople = data.one[2].value;
            $('#set-distribution').modal({backdrop: 'static'});
        }

        //确认份分配
        $scope.totalPeoplePrompt = false;
        $scope.groupSuccess = function(){
            //控制分配人数的默认值
            $scope.totalPeople = 0;
            for(var j = 0 ; j < $scope.HosDep.length ; j++){
                $scope.totalPeople = $scope.totalPeople + parseInt($scope.HosDep[j].value);
            }
            if($scope.totalPeople > $scope.numberPeople || $scope.numberPeople == ''){
                $scope.totalPeoplePrompt = true;
                return;
            }

            var data = $scope.fenPei.substring(0,3)
            if(data == '实验组'){
                for(var ii = 0 ; ii < $scope.experiment.length ; ii++){
                    if($scope.fenPei == $scope.experiment[ii].name){
                        $scope.experiment[ii].distributionTable = []
                        for(var i = 0 ; i < $scope.HosDep.length ; i++){
                            $scope.experiment[ii].distributionTable[i] = {};
                            $scope.experiment[ii].distributionTable[i].hospital = $scope.HosDep[i].name;
                            $scope.experiment[ii].distributionTable[i].departments = $scope.HosDep[i].names;
                            $scope.experiment[ii].distributionTable[i].number = $scope.HosDep[i].value;
                        }
                    }
                }
            }else if(data == '对照组'){
                for(var ii = 0 ; ii < $scope.controls.length ; ii++){
                    if($scope.fenPei == $scope.controls[ii].name){
                        $scope.controls[ii].distributionTable = []
                        for(var i = 0 ; i < $scope.HosDep.length ; i++){
                            $scope.controls[ii].distributionTable[i] = {};
                            $scope.controls[ii].distributionTable[i].hospital = $scope.HosDep[i].name;
                            $scope.controls[ii].distributionTable[i].departments = $scope.HosDep[i].names;
                            $scope.controls[ii].distributionTable[i].number = $scope.HosDep[i].value;
                        }
                    }
                }
            }
            $('#set-distribution').modal('hide');
        }

        //第三步保存
        $scope.setSave =function(){
            $scope.promptMainContent = '';
            // //console.log($scope.experiment);
            // //console.log($scope.controls);
            $scope.subjectGroups = [];
            //实验组数据
            for(var i = 0 ; i < $scope.experiment.length ; i++){
                $scope.subjectGroupsData = {
                    "id":$scope.experiment[i].id,
                    "type":$scope.experiment[i].name,
                    "code":$scope.experiment[i].one[0].value ,           //分组编码
                    "name": $scope.experiment[i].one[1].value,         //分组名称
                    "recordSize":$scope.experiment[i].one[2].value,
                    "description": $scope.experiment[i].casesValue,     //分组描述
                    "configFileUpload": $scope.experiment[i].CRFData,
                    "taskGroup": [                   //任务分配

                    ]};
                for(var ii = 0 ; ii < $scope.experiment[i].distributionTable.length; ii++ ){
                    $scope.subjectGroupsData.taskGroup[ii] = {
                        "officeName": $scope.experiment[i].distributionTable[ii].hospital,       //任务分配医院
                        "sectName": $scope.experiment[i].distributionTable[ii].departments,         //任务分配的科室
                        "taskSize": $scope.experiment[i].distributionTable[ii].number           //任务分配数量
                    }
                }
                if( !$scope.subjectGroupsData.configFileUpload.id || $scope.subjectGroupsData.taskGroup == 0 || $scope.subjectGroupsData.name == '' || $scope.subjectGroupsData.code == '' || $scope.subjectGroupsData.description == ''){
                    // delete $scope.subjectGroupsData.configFileUpload
                    $scope.promptMainContent = ' * 号为必填项!!';
                    $('#general-prompt').modal({backdrop:'static'});
                    return false;
                }
                $scope.subjectGroups.push($scope.subjectGroupsData);
            }
            //对照组数据
            for(var i = 0 ; i < $scope.controls.length ; i++){
                $scope.subjectGroupsData = {
                    "id":$scope.controls[i].id,
                    "type":$scope.controls[i].name,
                    "code":$scope.controls[i].one[0].value ,           //分组编码
                    "name": $scope.controls[i].one[1].value,         //分组名称
                    "recordSize":$scope.controls[i].one[2].value,
                    "description": $scope.controls[i].casesValue,     //分组描述
                    "configFileUpload": $scope.controls[i].CRFData,
                    "taskGroup": [                   //任务分配

                    ]};
                for(var ii = 0 ; ii < $scope.controls[i].distributionTable.length; ii++ ){
                    $scope.subjectGroupsData.taskGroup[ii] = {
                        "officeName": $scope.controls[i].distributionTable[ii].hospital,       //任务分配医院
                        "sectName": $scope.controls[i].distributionTable[ii].departments,         //任务分配的科室
                        "taskSize": $scope.controls[i].distributionTable[ii].number           //任务分配数量
                    }
                }

                if( !$scope.subjectGroupsData.configFileUpload.id || $scope.subjectGroupsData.taskGroup == 0 || $scope.subjectGroupsData.name == '' || $scope.subjectGroupsData.code == '' || $scope.subjectGroupsData.description == ''){
                    // delete $scope.subjectGroupsData.configFileUpload
                    $scope.promptMainContent = ' * 号为必填项!!';
                    $('#general-prompt').modal({backdrop:'static'});
                    return false;
                }
                $scope.subjectGroups.push($scope.subjectGroupsData);
            }
            //console.log($scope.subjectGroups,'保存发送的数据');
            //url没发现在哪里
            if($scope.controls.length == 0 && $scope.experiment.length == 0){
                $('#general-prompt').modal({backdrop:'static'});
                $scope.promptMainContent = '没有添加实验组和对照组';
                return false;
            }
            if($scope.promptMainContent === ''){
                DataService.setSave($routeParams.id,$scope.subjectGroups).then(function(data){
                    location.href='/study-src/#/topics';
                        //console.log(data,346573243);
                }); 
            }
        }

        //病例数量不为数字,删除提示
        $scope.promptMainContentSave = function(){
            if( $scope.promptMainContent == '病例数量不为数字' ) {
                $('#general-prompt').modal('hide');
            }else if($scope.promptMainContent == ' * 号为必填项!!'){
                $('#general-prompt').modal('hide');
                $('#general-prompt').on('hidden.bs.modal', function (e) {
                   /* DataService.setSave($routeParams.id,$scope.subjectGroups).then(function(data){
                        location.href='/study-src/#/topics';
                        //console.log(data,346573243);
                    });*/
                })
            }else if($scope.promptMainContent == '没有添加实验组和对照组'){
                DataService.setSave($routeParams.id,$scope.subjectGroups).then(function(data){
                    location.href='/study-src/#/topics';
                    //console.log(data,346573243);
                });
            }else if($scope.promptMainContent == '收藏成功！！！'){
                $('#general-prompt').modal('hide');
                
            }
        }
        
    }]);