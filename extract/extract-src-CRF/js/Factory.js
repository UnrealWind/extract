angular.module("infi-basic").factory('Event',function() {
	var factory = {};
	factory.setEcharts = function(msg) {

		//fydebug 
		// require(
		// 	[ 'plugins/echarts', 'echarts/chart/pie','echarts/chart/map' ],function(ec) {
			if (msg.status === 'ok') {

				// 三个饼图
				msg.data.data.forEach(function(n, i) {
					n = JSON.parse(n);
					if(n.series[0].data.length == 0){
						$('#group-feature-'+i).html('<div class="alert alert-danger" role="alert">暂无数据！</div>');
						return;
					}
					var echartp = echarts.init(document.getElementById('group-feature-'+ i));
					echartp.setOption(n);
				});
				// 地图
				// var echartp = echarts.init(document.getElementById('group-feature-map'));
				// msg.data.regionMap = JSON.parse(msg.data.regionMap);
				// if(msg.data.regionMap.series[0].data.length == 0){
				// 		$('#group-feature-map').html('<div class="alert alert-danger" role="alert">暂无数据！</div>');
				// 	}
				// echartp.setOption(msg.data.regionMap);
			} else {
				$('.chart-containter').each(function(i,n) {
					$(n).html('<div class="alert alert-danger" role="alert">暂无数据！</div>');
				})
			}
		// });
	}

	factory.judgeCheckedList = function(opt, checkedList,label, name, inputType) {
		if (checkedList.value == null) {
			checkedList.value = [];
		}
		
		//这个功能应该尽可能的调用一个方法来完成，现在先通过if分开写
		//这里主要处理number 类型的 history list
		if(!opt.checked && opt.range && (opt.range.min !== '' || opt.range.max !== '') && inputType === "number"){
			var isCheck = false;
			checkedList.value.forEach(function(n, i) {
				n.mark = '#666';

				//如果name相同的话，则更新label value即可，这种类型不会存在追加的可能性
				if (n.name == name) {
					isCheck = true;
					n.label =  opt.label;
					n.value =  opt.range.min+'<'+opt.range.max;
					n.mark = 'red';
					check = true;
					return checkedList;
				}	
			})

			//没有的话则追加进去，
			if(isCheck === false){

				checkedList.value.push({
					"name" : name,
					"value" : opt.range.min+'<'+opt.range.max,
					"label" : opt.label,
					"mark" : "red",
					"parent" : label
				});
			}
		}else if (opt.checked !== false) {

			//checkbox类型的会出现向后追加的可能性，radio类型的会更新数据
			// 这个check用于判断是否是添加，
			var check = false;
			checkedList.value.forEach(function(n, i) {
				n.mark = '#666';
				if (n.name == name && inputType === 'checkbox') {
					n.label += ',' + opt.label;
					n.value += ',' + opt.value;
					n.mark = 'red';
					check = true;
					return checkedList;
				} else if (n.name == name && !inputType) {
					n.label = opt.label;
					n.value = opt.value;
					n.mark = 'red';
					check = true;
					return checkedList;
				}
			});

			if (check === false) {
				checkedList.value.push({
					"name" : name,
					"value" : opt.value,
					"label" : opt.label,
					"mark" : "red",
					"parent" : label
				});
			}

			//取消选择的情况则需要删除对应位置的字符，如果为空的话则需要清除该条数据
		} else if(!opt.checked && !opt.range) {
			checkedList.value.forEach(function(n, i) {
				n.mark = '#666';
				if (n.value.indexOf(opt.value) > -1) {
					var start = n.value.indexOf(opt.value);
					n.value = n.value.replace(n.value.substring(start - 1, start+ opt.value.length+ 1), '')
					n.label = n.label.replace(n.label.substring(start - 1, start+ opt.label.length+ 1), '')
					if (n.value === '') {
						checkedList.value.splice(i, 1)
					}
				}
			})
		}
		return checkedList;
	}

	factory.searchModel = function(searchWords, data, inputOpt) {
		if (!inputOpt.searchGroup) {
			inputOpt.searchGroup = {

				// 选中状态的input
				"initData" : [],

				// 查出来的与之前不重复的input,未选中状态的input
				"searchData" : [],

				// 查出来的与之前不重复的input,选中状态的input
				"checkedSearchData" : []
			};
		}
		if (searchWords !== '') {

			// 这个状态是需要重置的
			inputOpt.searchGroup.initData = [];

			inputOpt.searchState = true;

			// 暂时没想到别的办法，迭代数组更新数据
			// 这个方法用于筛选出所有的选中的数据
			inputOpt.opt.forEach(function(n, i) {
				if (n.checked) {
					inputOpt.searchGroup.initData.push(n)
				}
			})
			if(inputOpt.children){
				inputOpt.children.forEach(function(n, i) {
					if (n.mainOpt.checked) {
						inputOpt.searchGroup.initData
								.push(n.mainOpt)
					}
					n.childrenOpt.forEach(function(ny, iy) {
						if (ny.checked) {
							inputOpt.searchGroup.initData.push(ny)
						}
					})
				})
			}
			

			inputOpt.searchGroup.searchData.forEach(function(n,
					i) {
				if (n.checked) {
					inputOpt.searchGroup.checkedSearchData
							.push(n)
				}
			})

			/* 得到完整的searchGroup ，需要验证其中的数值是否与搜索出的有重复，有重复还需要去除 */
			inputOpt.searchGroup.initData
					.forEach(function(n, i) {
						data.forEach(function(ny, iy) {
							ny.checked = false;
							if (ny.value === n.value) {
								data.splice(iy, 1)
							}
						})
					})

			inputOpt.searchGroup.checkedSearchData
					.forEach(function(n, i) {
						delete inputOpt.searchGroup.checkedSearchData.$$hashKey;
						if (!n.checked) {
							inputOpt.searchGroup.checkedSearchData
									.splice(i, 1)
						}
						data.forEach(function(ny, iy) {
							if (ny.value === n.value) {
								data.splice(iy, 1)
							}
						})
					})
			inputOpt.searchGroup.searchData = [];

			// 合成最终用于显示的数据
			inputOpt.searchGroup.searchData = data

		} else {
			inputOpt.searchState = false;

			// 如果用户在搜索模式改变了原来选中的值，需要重置，
			inputOpt.searchGroup.initData
				.forEach(function(n, i) {
					if (!n.checked) {
						inputOpt.opt.forEach(function(ny,iy) {
							if (ny.value === n.value) {
								ny.checked = false;
							}
						})
						if(inputOpt.children){
							inputOpt.children.forEach(function(ny, iy) {
								if (ny.mainOpt.value === n.value) {
									ny.checked = false;
								}
								ny.childrenOpt.forEach(function(nz, iz) {
									if (nz.value === n.value) {
										nz.checked = false;
									}
								})
							})
						}
 					}
				});
			inputOpt.searchGroup.searchData.forEach(function(n,
					i) {
				var isInitData = false
				if (n.checked) {

					inputOpt.opt.forEach(function(ny, iy) {
						if (ny.value === n.value) {
							ny.checked = true;
							isInitData = true;
						}
					})
					if(inputOpt.children){
						inputOpt.children.forEach(function(ny, iy) {
							if (ny.mainOpt.value === n.value) {
								ny.checked = true;
								isInitData = true;
							}
							ny.childrenOpt.forEach(function(nz, iz) {
								if (nz.value === n.value) {
									nz.checked = true;
									isInitData = true;
								}
							})
						})
					}
					
					if (!isInitData) {
						inputOpt.searchGroup.checkedSearchData
								.push(n);
					} else {
						inputOpt.searchGroup.searchData.splice(
								i, 1)
					}
				}
			});

			inputOpt.searchGroup.searchData = [];
			inputOpt.searchGroup.checkedSearchData.forEach(function(n, i) {
				if (!n.checked) {
					inputOpt.searchGroup.checkedSearchData.splice(i, 1)
				}
			});
		}
	}

	return factory;
});