angular.module('infi-basic').controller('RecordInputController',
	['$scope','formNaviServices','formServices','Upload','FileService','SYS','$routeParams','Session','FileUploadServices','RecordListServices',
	function($scope,formNaviServices,formServices,Upload,FileService,SYS,$routeParams,Session,FileUploadServices,RecordListServices){
	//上一模块，下一模块的按钮状态标示，fydebug这个标示不应该直接暴漏在$scope下
	$scope.prevshow = 'disabled';
	$scope.nextshow = '';

	// 当前使用的数据，包括表单解构，表单值
	$scope.currentData = null;
	
	// 保存后台传来的表单结构
	$scope.originalForm = null;
	
	//存储当前模块的模块名
	$scope.currModuleName = null;

	$scope.currentModule = null;

	//存储当前所有模块的数据
	$scope.moduleNameArr = [];

	//存储当前量表的数据
	$scope.scaleData = null;
	
	// 记录表单,菜单的下标
	$scope.formIndex = {};

	//存储最近一次提交的数据
	$scope.auditPassData = null;

	//图片上传滚动条初始的位置
	$scope.scrollTopn = 0;

	//待上传列表数据
	$scope.datas = [];

	$scope.navigates = [];
	//私有方法用于控制翻页按钮的状态,fydebug 这个需要移植到services里面，
	function controlFilp(modelName){
		$scope.prevshow = '';
		$scope.nextshow = '';

		//根据传过来的modelName，对input的状态进行判断以及更改，其实就是对第一个以及最后一个的特殊状态进行判断 
		for(var index in $scope.moduleNameArr){
			if($scope.moduleNameArr[index] === modelName){
				if(index == 0){
					$scope.prevshow = 'disabled';
				}else if(index == $scope.moduleNameArr.length-1){
					$scope.nextshow = 'disabled';
				}
			}
		};
	};

	$scope.updateModuleForm = function(model,detailsMark){

		//强制使页面跳转到页面顶部
		$('body').animate( {scrollTop: 0}, 500);

		controlFilp(model.name);
		var callback = formServices.ajaxModuleData(model,detailsMark)
		$scope.currentData = callback.version;
		$scope.currModuleName = model.name;
        $scope.currentModule = model;
	};

	$scope.getNaviData = function(templateId,interviewId,i) {
		formNaviServices.ajaxNaviData(templateId,interviewId).then(function(msg){
			$scope.navigates = $scope.navigates.concat(msg.data)

			//缓存下来模块的数据
			$scope.navigates.forEach(function(n,i){
				$scope.moduleNameArr.push(n.name)
			});
			i == 0 ?$scope.updateModuleForm($scope.navigates[0],'details'):'';
			console.log($scope.navigates)
		});

	};

	(function init() {
		$scope.sessionInterview = JSON.parse(sessionStorage.getItem('interview'));
		$routeParams.interviewId = $scope.sessionInterview.id;
        $scope.sessionInterview.interviewTemplates.forEach(function (n,i) {
            $scope.getNaviData(n.templateId,$scope.sessionInterview.id,i);
        });

    })();

    //用于触发请求所有的input数据
	$scope.print = function(){
		var callback = formServices.print($scope.navigates,$scope);
		$scope.currentData = callback.currentData;
    	$scope.auditPassData = callback.auditPassData;
	};

    //用于判断页面完成渲染后，调用jquery打印功能
	$scope.$on('renderOver', function () {
         formServices.bindPrint();
	});

	//历史审核数据完成渲染之后添加disabled属性
	$scope.$on('renderOverHistory', function () {
         $('.history-audit-pass input,.history-audit-pass textarea').attr('disabled','disabled');
         $('.history-audit-pass .infi-add-attr-group').remove();
	});

	$scope.continue = true;
	$scope.changeModule = function(model,details,num){
		//console.log($scope.navigates)
		//调用保存api
        $scope.continue = true;
		formServices.saveModule($scope).then(function (msg) {
           if($scope.continue){
               num?(function () {
                   for(var index in $scope.navigates){
                       if($scope.navigates[index].name === $scope.currModuleName){
                           $scope.updateModuleForm($scope.navigates[Number(index)+Number(num)],details);
                           return;
                       }
                   }
               })():$scope.updateModuleForm(model,details);
		   }
        });
	};
	
	$scope.saveModule = function () {
        formServices.saveModule($scope).then(function (msg) {
			formServices.saveAllModule($scope.sessionInterview);
		})
    }

    $scope.onFileSelect = function($files,input,isMultiple,attachment){
        FileUploadServices.upload($files,input,isMultiple,attachment,$scope);

    };

	//设置图片上传成功后显示在中下方
	$scope.scrollTop = function(){
		var iCount = setInterval(function(){
			$scope.scrollTopn = $scope.scrollTopn + 30;
			$('#load-success').scrollTop($scope.scrollTopn);
			if($scope.stopload == true){
				clearInterval(iCount);
			}
		}, 30);
	}

	//scaleInput 中存储了对应的scale量表的数据
	$scope.scaleModal = function(input){
		
		//data为null的话，说明并没有请求新的scale数据，所以直接使用自己input中缓存的数据即可
		var data = formServices.getScaleData(input);
		if(data == null){
			$scope.scaleData = input.scaleData;
		}else{
			 input.scaleData= data;
			 $scope.scaleData = data;
		}
		$scope.scaleData.tagInputData = input;
		$('#infi-u-scale').modal({backdrop: 'static'});
	}
	
	//这个用于使显示图片的模态框显示出来
	$scope.showImgModal = function(imgId,callBackData){
		if(!callBackData instanceof Array){
			callBackData = callBackData.data;
		}
		
		$scope.getImgData(imgId,callBackData);
		FileService.showImgModal();
	}
	
	$scope.showDownloadModel = function(callBackData){
		$scope.getDownloadImgData(callBackData);
		$('#downloadImg').modal('show');
	}

	$scope.goToRecordModify = function () {
		location.href = '#/record-modify/'+$routeParams.subjectId+'/'+$routeParams.groupId+'/'+$routeParams.recordId+'/'+$routeParams.interviewId;
    }
    $scope.modalHide = function () {
        $('#general-prompt').modal('hide');

    }


}]);