angular.module('infi-basic').controller('DetailController', ['$scope','naviServices','formServices','Upload','FileService','SYS','$routeParams',function($scope,naviServices,formServices,Upload,FileService,SYS,$routeParams){
	
	$scope.routeParams = $routeParams;
	SYS.routeParams = $scope.routeParams;
	//上一模块，下一模块的按钮状态标示，fydebug这个标示不应该直接暴漏在$scope下
	$scope.prevshow = 'disabled';
	$scope.nextshow = '';

	// 当前使用的数据，包括表单解构，表单值
	$scope.currentData = null;
	
	// 保存后台传来的表单结构
	$scope.originalForm = null;
	
	//存储当前模块的模块名
	$scope.currModuleName = null;

	//存储当前所有模块的数据
	$scope.moduleNameArr = [];

	//存储当前量表的数据
	$scope.scaleData = null;
	
	// 记录表单,菜单的下标
	$scope.formIndex = {};

	//存储最近一次提交的数据
	$scope.auditPassData = null;

	//存储修改点
	$scope.changed = {
		'num': 0
	}

	//存储描述
	$scope.discribe = '对比历史通过版本';
	
	//存储那个表单没有填写
	$scope.necessary = null;

	//图片上传滚动条初始的位置
	$scope.scrollTopn = 0;

	//待上传列表数据
	$scope.datas = [];

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
	}

	naviServices.ajaxNaviData($scope.routeParams).then(function(msg){
		$scope.navigates = msg;
		if( !msg[0].children || msg[0].children.length==0 ){
			$scope.navigates = [{name: '12',label:'',children: msg}];
		}
		
		var currentModuleName = $scope.navigates[0].name;
		if( $scope.navigates[0].children ){
			currentModuleName = $scope.navigates[0].children[0].name;
		}
		$scope.navigates[0].showNav = 'showChildLi';

		//缓存下来模块的数据
		$scope.navigates.forEach(function(n,i){
			n.children.forEach(function(ny,iy){
				$scope.moduleNameArr.push(ny.name);
			})
		})

		// 初始化调用 fydebug 初始化的时候 details 默认显示的第一个也需要进行value的检测，
		// 目前因为details与新增修改页面使用的同一个controller所以无法做区分，这个应该使用不同的controller，是一个优化点，现在先默认都校验初始化的状态
		$scope.updateModuleForm(currentModuleName,'details');
	});

	$scope.updateModuleForm = function(modelName,detailsMark){
		
		//强制使页面跳转到页面顶部
		$('body').animate( {scrollTop: 0}, 500);
		
		controlFilp(modelName);

		var callback = formServices.ajaxModuleData(modelName,detailsMark,$scope.routeParams)

		$scope.currentData = callback.version;

		if(callback.stableVersion || callback.stableVersion != null){
			//fydebug 暂时不开放对比功能样式太难写了，不知道怎么弄
			//$scope.auditPassDataList = callback.stableVersion;
			//$scope.auditPassData = JSON.parse(JSON.stringify($scope.auditPassDataList));
		}

		$scope.changed.num = callback.count;
		
		$scope.currModuleName = modelName;
		
	}

	//用于触发请求所有的input数据
	$scope.print = function(){
		var callback = formServices.print($scope.navigates,$scope);
		$scope.currentData = callback.currentData;
    	$scope.auditPassData = callback.auditPassData;

    	$scope.$apply();
	}

	//用于判断页面完成渲染后，调用jquery打印功能
	$scope.$on('renderOver', function () {
         formServices.bindPrint();
	});

	//历史审核数据完成渲染之后添加disabled属性
	$scope.$on('renderOverHistory', function () {
         $('.history-audit-pass input,.history-audit-pass textarea').attr('disabled','disabled');
         $('.history-audit-pass .infi-add-attr-group').remove();
	});
	

	$scope.changeModule = function(num){
		//调用保存api
		$scope.necessary = formServices.saveModule('',$scope);
		if(!$scope.necessary.hasNecessary){
			$scope.navigates = formServices.refreshNavigates($scope.navigates,$scope.currModuleName);
		}
		
		for(var index in $scope.moduleNameArr){
			if($scope.moduleNameArr[index] === $scope.currModuleName){

				//这个方法传过来的num为 +1 或者 -1 主要用于翻页，获取currentModuleName 
				$scope.currModuleName = $scope.moduleNameArr[Number(index)+Number(num)];
				$scope.updateModuleForm($scope.currModuleName,'details');
				$scope.navigates.forEach(function(n,i){
					n.children.forEach(function(ny,iy){
						if(ny.name === $scope.currModuleName){
							$scope.navigates.forEach(function(nz,iz){
								nz.showNav = '';
							});
							n.showNav = 'showChildLi';
						}
					});
				});
				return;
			}
		}	
	};

	
	$scope.onFileSelect = function($files,input,isMultiple,attachment){


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
			upload($files[i],this.datas[i]);
		}

    	function upload(file,obj){
    		var url = '';
    		var data = null;
    		if(attachment){
    			url=SYS.url+'/subject/record/file/save';
    			data = {fileType:isMultiple,recordId:SYS.routeParams.recordId};
    		}else{
    			SYS.url+'/load/data/file/'+$scope.routeParams.projectName+'/'+$scope.routeParams.recordId;
    			data = {filter:true};
    		}
    		$scope.upload = Upload.upload({
				url: url,
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
				}
			});
    	}
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

	$scope.saveModule = function(mark){
		$scope.necessary = formServices.saveModule(mark,$scope);
		if(!$scope.necessary.hasNecessary){
			$scope.navigates = formServices.refreshNavigates($scope.navigates,$scope.currModuleName);
		}
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

	//对比历史记录 
	$scope.contrastHistory =function(){
		if($scope.auditPassData.length>0){
			$scope.auditPassData = [];
			$scope.discribe = '对比历史通过版本';
		}else{
			$scope.auditPassData = JSON.parse(JSON.stringify($scope.auditPassDataList));
			$scope.discribe = '收起历史通过版本';
		}
	}

}]);