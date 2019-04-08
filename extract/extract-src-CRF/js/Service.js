angular.module("infi-basic").service('Service',['$http','Event','SYS', function($http, Event,SYS) {
	this.getAttrData = function(subjectId,subjectGroupId) {
		return $http({
			method : 'get',
			url : SYS.url + 'subject/'+subjectId+'/group/'+subjectGroupId+'/filter-tags'
		}).then(function(msg) {
			var data = msg.data.data;

			//这里校验一下，无数据则返回null
			if(data === null){
				return data;
			}

			//适配器
			data.forEach(function(n) {
				n.attrName = n.category;
				n.attrOpt = n.children;
			});

			// 初始化的时候需要增加navshow的标示,默认第一个为true 其他为false
			data.forEach(function(n, i) {
				n.attrOpt.forEach(function(ny, iy) {
					ny.checked = false;
				});
				n.show = '';
			});
			data[0].show = 'active';
			return data;
		});
	}

	//改变attropt的值，点击谁就显示谁下的数据，
	this.checkChoseOpt = function(showChoseOpt, attrData) {
		showChoseOpt = false;
		attrData.forEach(function(n, i) {
			n.attrOpt.forEach(function(ny, iy) {
				if (ny.checked === true) {
					showChoseOpt = true;
				}
			})
		});
		return showChoseOpt;
	}

	this.getDetaile = function(subjectId,subjectGroupId) {
		return $http({
			method : 'get',
			url : SYS.url + 'subject/'+subjectId+'/group/'+subjectGroupId+'/list-filter-tags'
		}).then(function(msg) {
			var result = msg.data;

			//增加一个私有方法校验个位数月份使之增加一个0
			function changeDate(date){
				if(date<10){
					date = '0'+date;
				}
				return date;
			}

			result.data.forEach(function(n, i) {

				//这里校验一下
				if(msg.data.data === null){
					return false;
				}

				n.checked = false;

				// 时间类型永远处于相当于check的状态之中，需要特殊处理
				if (n.tagType === 'date') {
					n.checked = true;

					//设一个初始值，如果有的话就不用了，否则value就一直是null
					if(n.value === null){
						var date = new Date();
						if(date.getMonth()>1){
							var first = date.getFullYear()+"-"+changeDate(date.getMonth())+"-"+changeDate(date.getDate());
						}else{
							var first = (date.getFullYear()-1)+"-12-"+changeDate(date.getDate());
						}
 						var second = date.getFullYear()+"-"+changeDate(date.getMonth()+1)+"-"+changeDate(date.getDate());
						n.value = first+' - '+second;
					}
				}

				//number类型的数据也需要稍微处理下，因为其中并没有含有范围的字段，
				if(n.tagType === 'number'){
					n.range = {
						"min":"",
						"max":""
					}
				}

				//适配器
				n.opt = n.hots;
				if(n.opt===null){
					n.opt = [];
				}
				n.opt.forEach(function(ny,iy){
					n.opt[iy] = {
						"label":ny,
						"value":ny
					}
				});

				//特殊情况下的海量枚举暂未出现，这边的适配器就不做了，未来估计会出现，不过现在也看不到后台给的数据会是什么样子的，所以遗留
				if (n.children) {
					n.children.forEach(function(ny, iy) {
						ny.mainOpt.checked = false;
						ny.childrenOpt.forEach(function(nz, iz) {
							nz.checked = false;
						})
					})

				}
			})
			return result;
		});
	}

	this.getNewEchartsData = function(detaileOpt,relation,groupId,subjectId,subjectGroupId){
		var data = '';
		var size = 0;
		var callBackGroupId = 0;
		var historyListDate = {};
		data += 'filter__relation='+relation;

		//暂时将项目参数放到此处,后续需要改为url中
		// data += '&filter__projectName='+entryName;

		//这里只有后续刷新的时候才会传递groupId的参数
		if(groupId){
			data += '&filter__group__id='+groupId;
		}

		//主要用于拼接后台需要的数据格式，
		//fydebug 特殊状态的海量枚举也增加了 = = 避不开，
		//fydebug 这里应该将不同状态下的数据的处理放在factory中，来调用
		detaileOpt.forEach(function(n,i){

			//date 以及number属性的需要进行特殊处理
			if(n.opt === null || n.tagType === 'date' && n.checkedAttr === true){
				data += '&filter__tag__range__'+n.bizName+'='+n.value;
				historyListDate = {
					"label":n.label,
					"name" : n.name,
					"parent" : n.label,
					"inputType":n.tagType,
					"value": n.value,
					"relation": relation,
					"size":size
				};
			}
			if(n.tagType === 'number' && (n.range.min !== '' || n.range.max !== '')){
				data += '&filter__tag__range__'+n.bizName+'='+n.range.min+'__'+n.range.max;

				//目前暂时将输入框中的数值作为优先级比较高的一方，所以在这里就直接return了，
				return;
			}

			var mark = 0;
			n.opt.forEach(function(ny,iy){
				var opt = genAjaxData(n,ny,data,mark);
				data = opt.data;
				mark = opt.mark;
			})
			if(n.searchGroup){
				n.searchGroup.checkedSearchData.forEach(function(ny,iy){
					var opt = genAjaxData(n,ny,data,mark);
					data = opt.data;
					mark = opt.mark;
				})
				n.searchGroup.searchData.forEach(function(ny,iy){
					var opt = genAjaxData(n,ny,data,mark);
					data = opt.data;
					mark = opt.mark;
				})
			}
		})
		return $http({
			data:data,
			url : `${SYS.url}subject/${subjectId}/group/${subjectGroupId}/extract/group/filters?filter__subject__id=${subjectId}&filter__subject__group__id=${subjectGroupId}&${data}`,
			// url : SYS.url + 'extract/group/filters?filter__subject__id='+subjectId+'&'+'filter__subject__group__id='+subjectGroupId+'&' + data,
			method:'post'
		}).then(function (msg) {
			//setEcharts 用于将opt设置到echarts中
			var msg = msg.data;
			Event.setEcharts(msg);
			size = msg.data.size;
			callBackGroupId = msg.data.groupId;
			return {
				"size":size,
				"groupId":callBackGroupId,
				"getEchartsOver":'',
				"historyListDate": historyListDate
			};
		});

		//加一个私有方法，用于拼接字符串
		function genAjaxData(n,ny,data,mark){
			if(ny.checked && mark === 0){
				data += '&filter__tag__in__'+n.bizName+'='+ny.value;
				mark = 1;
			}else if(ny.checked && mark === 1 ){
				data += '__'+ny.value;
			}
			return opt = {
				"data":data,
				"mark":mark
			};
		}
	}

	this.genDetaileData = function(options) {

		//将参数传递过来，这里转化一下，只是为了好看一些，没什么特别的实际作用
		var checkedList, checkedLists, opt, size,relation, label, name, inputType;
		checkedList = options.checkedList;
		checkedLists = options.checkedLists;
		opt = options.opt;
		size = options.size;
		relation = options.relation;
		label = options.label;
		name = options.name;
		inputType = options.inputType;
		
		//接受参数的集合之后再函数的开始进行处理，将其转化为私有属性，最后将处理后的属性return，
		checkedLists = JSON.parse(JSON.stringify(checkedLists));
		checkedList = JSON.parse(JSON.stringify(checkedList));

		checkedList.size = size;
		checkedList.relation = relation;

		// fydebug
		// 这边因为是不断地重复将一个数组push进另外一个数组，所以$$hashKey会有重复，会导致angularjs的冲突，需要删除
		// 这边的处理逻辑有点乱，暂时未找到更好的方法，
		delete checkedList.$$hashKey;

		checkedList = Event.judgeCheckedList(opt, checkedList, label, name, inputType);

		checkedLists.unshift(checkedList);
		return {
			"checkedLists" : checkedLists,
			"checkedList" : checkedList
		};
	}

	this.getExportData = function(subjectId,subjectGroupId) {
		return $http({
			method : 'get',
			url : SYS.url + 'subject/'+subjectId+'/group/'+subjectGroupId+'/export-tags'
		}).then(function(msg) {

			//这里校验一下
			if(msg.data.data === null){
				return false;
			}

			var result = msg;
			
			//适配器
			//fydebug 这里对适配器进行说明，这个东西现在因为部分数据未知，所以还不完全，特此声明
			result.data.attr = result.data.data;

			// 初始化的时候需要增加navshow的标示,默认第一个为true 其他为false
			result.data.attr.forEach(function(n, i) {
				n.attrName = n.category;
				n.attrOpt = n.children;
				n.attrOpt.forEach(function(ny, iy) {

					//fydebug如果是hots这一版先使其不显示下拉
					if((ny.hots && ny.hots!==null) && (!ny.children && ny.children === null)){
						return false;
					}

					ny.frontData = {};
					ny.frontData.limitsName = ny.name+'.text';
					ny.frontData.textName = ny.name+'.limits';
					if(ny.children && ny.children !== null &&ny.children.length>0){
						ny.icon = 'down';
						ny.relationData = ny.children;
					}
					if(ny.filterEvents && ny.filterEvents!==null && ny.filterEvents.length>0){
						ny.frontData.filter={};
						ny.frontData.filter.opt = ny.filterEvents;
						ny.frontData.filter.checked = false;
					}
					if(ny.hots && ny.hots!==null &&ny.hots.length>0){
						ny.icon = 'down';
						ny.frontData.opt = [];
						ny.hots.forEach(function(nz,iz){
							ny.frontData.opt.push({"label":nz,"value":nz});
						})
					}else{
						ny.frontData = false;
					}
					ny.checked = false;
				});
				n.show = '';
			});
			result.data.attr[0].show = 'active';

			return result.data.attr;
		});
	}

	this.getSearchData = function(searchWords, inputOpt) {
		$http({
			url : '',
			method : 'post',
			params : {
				'searchWords' : searchWords
			}
		}).then(function(msg) {
			msg.data = [ {
				"label" : "陈旧性心肌梗塞",
				"value" : "陈旧性心肌梗塞"
			}, {
				"label" : "冠心病",
				"value" : "冠心病"
			}, {
				"label" : "编不出来了",
				"value" : "编不出来了"
			}, {
				"label" : "某种不知名病",
				"value" : "某种不知名病"
			}, {
				"label" : "天坛医院",
				"value" : "天坛医院"
			} ]
			Event.searchModel(searchWords, msg.data, inputOpt);
		})
	}

	this.changeStepData = function(mark, basicData, detaileData) {

		var checkedBasicData = [];

		//筛选出一个清单用于比对数据
		basicData.attrData.forEach(function(n, i) {
			n.attrOpt.forEach(function(ny, iy) {
				if (ny.checked) {
					checkedBasicData.push(ny.label);
				}
			})
		})
		
		//根据筛选出来的清单对第二部的数据进行一些修改
		detaileData.detaileOpt.forEach(function(n, i) {
			n.checkedAttr = false;
			checkedBasicData.forEach(function(ny, iy) {
				if (ny === n.label) {
					n.checkedAttr = true;
					return;
				}
			})
		})

		//以前选中然后到现在不选了的需要把里面的数据清空
		detaileData.detaileOpt.forEach(function(n, i) {
			if (n.checkedAttr === false) {
				if (n.opt) {
					n.opt.forEach(function(ny, iy) {
						ny.checked = false;
					})
				}
				if (n.children) {
					n.children.forEach(function(ny, iy) {
						ny.mainOpt.checked = false;
						ny.childrenOpt.forEach(function(nz, iz) {
							nz.checked = false;
						})
					})
				}
			}
		})

		basicData.showChoseOpt = false;
	}

	this.submitExport = function(exportData,groupId,recordName,subjectName,subjectGroupName){
		var callback = null;

		//需要从第二步中拿到groupId
		var data = 'filter__group__id='+groupId;
		data += '&label='+recordName;
		data += '&filter__subject__id='+subjectName;
		data += '&filter__subject__group__id='+subjectGroupName;

		//这边就是在迭代数据，然后调用方法返回对应的字符串
		exportData.forEach(function(n,i){
			n.attrOpt.forEach(function(ny,iy){
				var mark = 0;
				if(ny.checked){
					ny.value = true;
					var opt = genAjaxData(ny.name,ny,data,mark);
					data = opt.data; 
					mark = opt.mark;
				}
				if(ny.frontData){
					if(ny.frontData.filter){
						mark = 0;
						if(ny.frontData.filter.checked){
							ny.frontData.filter.value = ny.frontData.filter.checked;
						}
						var opt = genAjaxData(ny.frontData.textName,ny.frontData.filter,data,mark);
						data = opt.data;
						mark = opt.mark;
					};
						
					mark = 0;
					if(ny.frontData.children){
						ny.frontData.children.forEach(function(nz,iz){
							if(nz.mainOpt.checked){
								var opt = genAjaxData(ny.frontData.limitsName,nz.mainOpt,data,mark);
								data = opt.data;
								mark = opt.mark;
							}
							nz.childrenOpt.forEach(function(child,index){
								var opt = genAjaxData(ny.frontData.limitsName,child,data,mark);
								data = opt.data;
								mark = opt.mark;
							})
						});
					}
					ny.frontData.opt.forEach(function(nz,iz){
						var opt = genAjaxData(ny.frontData.limitsName,nz,data,mark);
						data = opt.data;
						mark = opt.mark;
					});
					if(ny.frontData.searchGroup){
						ny.frontData.searchGroup.checkedSearchData.forEach(function(nz,iz){
							var opt = genAjaxData(ny.frontData.limitsName,nz,data,mark);
							data = opt.data;
							mark = opt.mark;
						})
						ny.frontData.searchGroup.searchData.forEach(function(nz,iz){
							var opt = genAjaxData(ny.frontData.limitsName,nz,data,mark);
							data = opt.data;
							mark = opt.mark;
						})
					}
				}
				if(ny.relationData){
					ny.relationData.forEach(function(nz,iz){

						//relation所有的name都各不相同，通过置0来达成效果
						mark = 0;
						if(nz.checked){
							nz.value = true;
						}
						var opt = genAjaxData(nz.name,nz,data,mark);
						data = opt.data;
						mark = opt.mark;
					})
				}
			})
		});
		return $http({
			data:data,

			//fydebug 这里加上url以后就不会有三个请求了，
			url : SYS.url + 'extract/task/create?'+data,
			method:'post'
		}).then(function (msg) {
			return msg.data;
		});

		//callback 用于帮助标示提示的状态
		function genAjaxData(name,ny,data,mark){
			
			//mark的作用主要用于区分这个input是否属于同一个name，
			if(ny.checked && mark === 0){
				data += '&export__tag__'+name+'='+ny.value;
				mark = 1;
			}else if(ny.checked && mark === 1 ){
				data += '__'+ny.value;
			}
			return opt = {
				"data":data,
				"mark":mark
			};
		}
	}
}])
