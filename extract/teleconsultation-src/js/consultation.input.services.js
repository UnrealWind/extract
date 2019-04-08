
angular.module('infi-basic').service('consultationInputServices',['$http','SYS',function($http,SYS){
	
	//获取页面数据，这里直接获取静态json
	this.getLocalJson = function(opt){
		return $http({
			url: opt.url,
			method: 'get',
			params: opt.data
		})
		.then(function(msg){
			
			if(opt.label === 'tableData'){
				msg.data.data = msg.data;
				if(msg.data.data.page!==null){
					msg.data.data.page.number ++;
					genDoctorInfo(msg.data.data.page.content);
				}
			};
			
			return msg.data
		});

		//后台传递的英文字段转化为中文
		function genDoctorInfo(arr){
			arr.forEach(function(n,i){
				if(n.status === null){
					n.status = '等待对方回应';
					n.fontColor = 'blue';
				}else if(n.status === 'pass'){
					n.status = '同意';
					n.fontColor = 'green';
				}else if(n.status === 'refuse'){
					n.status = '拒绝';
					n.fontColor = 'red';
				}


				if(n.role === 'attending'){
					n.role = '主诊医师';
				}else if(n.role === 'participation'){
					n.role = '参诊医师';
				}

			})
		}
	}

	this.pluginControl = function(plugin){
		var tagData = {};
		plugin = plugin.split('');
		plugin.forEach(function(n,i){
			switch(n){

				//会诊专家
				case 'e':
					tagData['expert'] = true;
						break;

				//会诊报告
				case 'r':
					tagData['report'] = true;
					break;

				//意见反馈
				case 'o':
					tagData['opinion'] = true;
						break;

				//会诊状态
				case 'c':
					tagData['consultationStatus'] = true;
						break;		

				default:
					break; 
			}
		})

		return tagData;

	}

	this.saveModal = function(data,mark,routeParams){
		var Save  = function(data){
			this._Data = data.version;
		}

		Save.prototype = {
			init:function(){
				var that = this;

				//存储后台需要数据
				this.tagData = {};
				that.getTagData(that._Data);
				that.saveData();
			},

			getTagData : function(data){
				var that = this;
				data.forEach(function(n,i){
					n.type !== '菜单' && n.value && n.value !== null && n.value!==''?that.genData(n):that.getTagData(n.children);
				})
			},

			genData : function(data){
				var that = this;

				//如果有需要特殊处理的类型的话,就直接在这个switch里面加就行
				switch(data.type){
					case '文本输入-双值':
						data.dimension.options.forEach(function(n,i){
							data.value[n.name] && data.value[n.name] !== null && data.value[n.name]!==''?that.tagData[n.name] = data.value[n.name]:undefined;
						});
						break;
					case '文件上传':
						var value = '';
						data.value.forEach(function(n,i){
							i === 0? value += n:value += ','+n;
						});
						data.value = value;
						that.tagData[data.name] = data.value;
						break;	
					case '图片上传-多张':
						var value = '';
						data.value.forEach(function(n,i){
							i === 0? value += n:value += ','+n;
						});
						data.value = value;
						that.tagData[data.name] = data.value;
						break;	
					default:
						that.tagData[data.name] = data.value;
						break;
				}

			},

			saveData : function(){
				var that = this;
				mark === 'details'?that.tagData['id'] = routeParams.recordId:undefined;
				$http({
					url: SYS.url+'consultation/info',
					method: 'post',
					data: that.tagData
				})
				.then(function(msg){

					if(mark === 'expert'){
						window.location.href = '#/consultation-experts/'+msg.data.data.id+'/list'
					}else if(mark === 'list'){
						window.location.href = '#/consultation-list/';
					}else if(mark === 'details'){
						window.location.href = '#/consultationDetail/'+routeParams.recordId+'/'+routeParams.plugin+'/'+routeParams.docId+'/'+routeParams.role;
					}

					
				});
			}

		}

		var save = new Save(data);
		save.init();
	}

	this.saveData = function(opt){
		return $http({
			url: opt.url,
			method: 'post',
			data: opt.data
		})
		.then(function(msg){
			return msg.data
		});
	}

}]); 