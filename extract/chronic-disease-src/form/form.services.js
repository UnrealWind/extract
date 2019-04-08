
angular.module('infi-basic').service('formServices',['$http','SYS','Session','$routeParams',
	function($http,SYS,Session,$routeParams){
	
    this.ajaxModuleData = function(model,detailsMark){
		var that = this;
		var url = `${SYS.url}1/1/content/${model.templateId}/${model.interviewId}/${model.name}`
    	// var url = SYS.url+'crf/template/content/'+model.templateId+'/'+model.interviewId+'/'+model.name
    	var tagData = null;
        var ctoken = window.localStorage.getItem('ctoken');
    	$.ajax({
			data:'',
			url: url,
			type:'get',
			async:false,
            beforeSend: function(xhr){xhr.setRequestHeader('ctoken', ctoken);},
			success:function(msg){
				if( msg.status === 'ok'){
					if(!msg.data.stableVersion){
						msg.data.stableVersion = [];
					}

					//如果是details的情况下，就进行验证module中是否有value是非空的
					if(detailsMark){
						msg.data.stableVersion = that.checkModule(msg.data.stableVersion);
						msg.data.version = that.checkModule(msg.data.version);
					}
				}
				tagData = msg;
			}
		});
		return tagData.data;
    };

    this.saveScale = function ($scope,url) {
		var that = this;
		return that.saveModule($scope,url);
    }

    this.saveModule = function($scope,url){
		!url?url = `${SYS.url}1/1/interview/edit/${$scope.currentModule.interviewId}/${$scope.currentModule.templateId}/${$scope.currentModule.name}`:''
		var tarData = filter($scope.currentData);
		var name = $scope.currModuleName;
		function filter(array){
			var newData = [];
			for(var index in array){
				var entity = array[index];
				if( entity ){
					var transformedEntity = {};
					if( entity.value && entity.value!=''){
						if( entity.type.indexOf('多选')>=0 ||entity.type.indexOf('超链接')>=0){
							var values = [];
							for( var idy in entity.value ){
								if( entity.value[idy] ){
									values.push( idy );
								}
							}
							transformedEntity.value = values.join(',');
						} else if(entity.value instanceof Array) {
							transformedEntity.value = entity.value.join(',');
						}else if(entity.type.indexOf('量表')>= 0 ){
							transformedEntity.value = entity.value
							// transformedEntity.value = entity.value+'##'+entity.score;
						}else {
							transformedEntity.value = entity.value;
						}

                        if (entity.type != '菜单' && entity.notNull &&  entity.value != '' ){
                            for(var index in $scope.navigates){
                                if($scope.navigates[index].name === $scope.currModuleName){
                                    $scope.navigates[index].hasNecessary = false;
                                }
                            }
						}
					}else if(entity.type != '菜单' && (entity.value == null || entity.value == '' ) && entity.notNull && entity.parent == '患者基本信息'){
						$('#general-prompt').modal('show');
                        $scope.promptMainContent = '红色标注为必填项！！！';
                        $scope.continue = false;
					}else if(entity.type != '菜单' && entity.notNull && (entity.value == null || entity.value == '' )){
                        console.log(1)
						for(var index in $scope.navigates){
                            if($scope.navigates[index].name === $scope.currModuleName){
                                $scope.navigates[index].hasNecessary = true;
                                return;
                            }
                        }

					}
					
					transformedEntity.type = entity.type;
					transformedEntity.name = entity.name;
					
					//fydebug 李博同学需要增加这个label
					transformedEntity.label = entity.label;
					transformedEntity.bizName = entity.bizName;
					
					//必选字段要作为一个标记传回去
					transformedEntity.notEmpty = entity.notNull;

					

					newData.push(transformedEntity);
					
					if( entity.children && entity.children.length> 0 ){ //array[index].value==undefined && 
						transformedEntity.children = filter(entity.children);
					}
				}
			};
			return newData;
		}

		return $http({
			url: url,
			method: 'put',
			data: JSON.stringify(tarData)
		}).then(function(msg){
			return msg;
		});

    };

    this.saveAllModule = function (interview) {
		var savedScales = JSON.parse(sessionStorage.getItem('savedScales'))

		interview.result = savedScales																	// 填充过的量表数据

        return $http({
			url: `${SYS.url}1/1/record/interview`,
            // url: SYS.url+'subject/'+$routeParams.subjectId+'/group/'+$routeParams.groupId+'/record/'+$routeParams.recordId+'/interview',
            method: 'put',
            data: interview
        }).then(function(msg){
            history.go(-1);
            return msg;
        });
    }


    this.checkModule = function(arry){
    	
		if(arry.length == 0){
			return;
		};
		var data = arry;
		// 这里初始化一下
		data[0].notEmpty = false;
		check(data);
		// zjl_debug 临时实现,需要优化
		checkValue(data[0]);
		checkValue2(data[0]);
		function check(arry){
			arry.forEach(function(element,iz){
				if(element.value !== undefined && element.value !== null && element.value !=='' && element.type !=="虚拟菜单"){
					//fydebug 这里module是单独放在数组里加载进来的，所以是data[0]
					data[0].notEmpty = true;
				}
			});
		}
		function checkValue(node){
			if( node.children && node.children instanceof Array ){
				for( var idx=0;idx<node.children.length;idx++){
					if( node.children[idx] && node.children[idx].value && node.children[idx].value!='' && node.children[idx].type !=="虚拟菜单"){
						node.notEmpty = true;
					}
					checkValue(node.children[idx]);
				}
			}
		}
		
		function checkValue2(node){
			if( node.children && node.children instanceof Array ){
				for( var idx=0;idx<node.children.length;idx++){
					if( node.children[idx] && node.children[idx].notEmpty){
						node.notEmpty = true;
					}
					checkValue2(node.children[idx]);
				}
			}
		}
		return data;
	};

	this.print = function(naviData,$scope){
    	var that = this;
    	
    	var currentData = [];
    	var auditPassData = [];

    	//直接调用原有的api获取到数据
    	naviData.forEach(function(n,i){

    		n.children.forEach(function(module,iy){
    			var moduleName = module.name;
				var data = that.ajaxModuleData(moduleName,'details',$scope.routeParams);
    			if(data.version){
    				if(data.stableVersion && data.stableVersion!=null && data.stableVersion.length>0){
    					auditPassData.push(data.stableVersion[0]);
    				}
    				currentData.push(data.version[0]);
    			}else{
    				currentData.push(data[0])
    			}
    			
    		})
    	});

    	return {
    		'currentData':currentData,
    		'auditPassData':auditPassData
    	};
    };

    this.bindPrint = function(){
    	jqprintDiv();
    	var HKEY_Root, HKEY_Path, HKEY_Key;
	        HKEY_Root = "HKEY_CURRENT_USER";
	        HKEY_Path = "\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
        function jqprintDiv() {
			$("#printArea").print();
        }

        function PageSetup_Null() {
            try {
                var Wsh = new ActiveXObject("WScript.Shell");
                HKEY_Key = "header";
                Wsh.RegWrite(HKEY_Root + HKEY_Path + HKEY_Key, "");
                HKEY_Key = "footer";
                Wsh.RegWrite(HKEY_Root + HKEY_Path + HKEY_Key, ""); 
            }
            catch (e) { }
        }
    };

}]); 