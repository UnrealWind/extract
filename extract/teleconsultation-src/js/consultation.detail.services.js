
angular.module('infi-basic').service('consultationDetailServices',['$http','SYS',function($http,SYS){

	this.genDetailData = function(currentData,details){
		var GenData  = function(details,currentData){
			this.details = details;
			this.currentData = currentData.version;
		}

		GenData.prototype = {
			init:function(){
				var that = this;
				that.genData(that.details,that.currentData);
			},
			genData : function(details,currentData){
				var that = this;
				currentData.forEach(function(n,i){
					n.type !== '菜单'?that.fixData(details,n):that.genData(details,n.children);
				})
			},
			fixData : function(details,data){
				var that = this;

				//如果有需要特殊处理的类型的话,就直接在这个switch里面加就行
				switch(data.type){
					case '文本输入-双值':
						data.value =='' || data.value == null || !data.value?data.value={}:undefined;
						data.dimension.options.forEach(function(n,i){
							data.value[n.name] = details[n.name];
							n.value = details[n.name];
						})
						break;
					case '文件上传':
						data.value = details[data.name];
						break;	
					case '图片上传-多张':
						data.value = details[data.name];
						break;	
					default:
						data.value = details[data.name];
						break;
				}
			}
			
		}

		var genData = new GenData(details,currentData);
		genData.init();
	}

}]); 