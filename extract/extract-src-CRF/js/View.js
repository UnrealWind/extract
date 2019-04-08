
//fydebug 这里link下的函数尽量进行移植，需要调用的参数不一定要在scope中获取，也可以通过参数传递获取
angular.module("infi-basic").directive('infiNav',function(){
	return {
		restrict:'E',
		template:'<ol ng-class="{\'basic\':\'background-1 row\',\'detaile\':\'background-2 row\',\'export\':\'background-3 row\'}[showStep]">'
					+'<li ng-class="{\'basic\':\'col-md-4 z-sel\',\'detaile\':\'col-md-4\',\'export\':\'col-md-4\'}[showStep]">'
						+'<h1>1.基本信息筛选</h1>'
					+'</li>'
					+'<li ng-class="{\'basic\':\'col-md-4\',\'detaile\':\'col-md-4 z-sel\',\'export\':\'col-md-4\'}[showStep]">'
						+'<h1>2.详细信息关系筛选</h1>'
					+'</li>'
					+'<li ng-class="{\'basic\':\'col-md-4\',\'detaile\':\'col-md-4\',\'export\':\'col-md-4 z-sel\'}[showStep]">'
						+'<h1>3.数据导出</h1>'
					+'</li>'
				+'</ol>',
		replace: true,		
        link:function(scope,element,attrs){
        	
        }	
	};
})

	/*第一页相关模板*/
angular.module("infi-basic").directive('attrNav',function(){
	return {
		restrict: 'E',
        template: '<ul class="list-group">'
	        	 		+'<li class="list-group-item {{opt.show}}" ng-repeat="opt in basic.attrData">'
							+'<a ng-click="changeNav(basic.attrData[$index])" class="">{{opt.attrName}}'
								+'<span></span>'
							+'</a>'
						+'</li>'
					+'</ul>',
        replace: true,
        link:function(scope,element,attrs){
        	scope.changeNav = function(attrData){
				scope.basic.attrData.forEach(function(n,i){
					n.show = '';
				});
				attrData.show = 'active';
				scope.basic.attrOpt = attrData.attrOpt;
			};
        }	
	};
})

angular.module("infi-basic").directive('attrOpt',['Service',function(Service){
	return {
		restrict: 'E',
        template: 
					'<div class="tab-content">'
						+'<div class="children-list checkbox">'
							+'<ul class="list-inline children-list">'
								+'<li ng-repeat="opt in basic.attrOpt">'
									+'<label class="radio-inline">'
										+'<input class="filter-tagName" type="checkbox" name="{{opt.name}}" value="{{opt.value}}" '
										+'ng-model="opt.checked" ng-checked = "opt.checked " ng-click = "checkChoseOpt()">'
										+'{{opt.label}}'
									+'</label>'
								+'</li>'
							+'</ul>'
						+'</div>'
					+'</div>',			
		replace: true,
        link:function(scope,element,attrs){
        	scope.checkChoseOpt = function(){
        		scope.basic.showChoseOpt = Service.checkChoseOpt(scope.basic.showChoseOpt,scope.basic.attrData);
        	}
        }	
	};
}]);

//fydebug 更改了ui所以之前的结构作废重新写
angular.module("infi-basic").directive('attrOptList',['Service',function(Service){
	return {
		restrict: 'E',
        template: '<ul>'
        			+'<li ng-repeat = "option in basic.attrData">'
        				+'<div class="infi-input-box">'
		        			+'<div class = "infi-input-left">'
								+'<p>{{option.label}}：</p>'
							+'</div>'
							+'<div class = "infi-input-right">'
								+'<div class="infi-input-opt">'
									+'<label class="checkbox-inline" ng-repeat = "opt in option.children">'
										+'<input class="filter-tagName" type="checkbox" name="{{opt.name}}" value="{{opt.value}}" '
										+'ng-model="opt.checked" ng-checked = "opt.checked " ng-click = "checkChoseOpt()">'
										+'{{opt.label}}'
									+'</label>'
								+'</div>'
							+'</div>'
						+'</div>'
        			+'</li>'
        		  +'</ul>',			
		replace: true,
        link:function(scope,element,attrs){
        	scope.checkChoseOpt = function(){
        		scope.basic.showChoseOpt = Service.checkChoseOpt(scope.basic.showChoseOpt,scope.basic.attrData);
        	}
        }	
	};
}]);

angular.module("infi-basic").directive('choseOpt',['Service',function(Service){
	return {
		restrict:'E',
		template:'<label class="filter-title">过滤条件：</label>'
					+'<div class="content">'
						+'<ul class="list-inline selected">'
							+'<a class="close" ng-click="delAllOpt(basic.attrData)" title = "清除所有数据">X</a>'
							+'<span ng-repeat = "attrOpt in basic.attrData">'
								+'<li class="chosed-filter-tagName" ng-repeat = "opt in attrOpt.attrOpt" ng-if= "opt.checked ===true">'
									+'{{opt.label}}'
									+'<span class="glyphicon glyphicon-remove" ng-click = "delOpt(opt)"></span>'
								+'</li>'
							+'</span>'
						+'</ul>'
					+'</div>',
        link:function(scope,element,attrs){
        	scope.delOpt = function(opt){
        		opt.checked = false;
        		scope.basic.showChoseOpt = Service.checkChoseOpt(scope.basic.showChoseOpt,scope.basic.attrData);
        	}
        	scope.delAllOpt = function(attrData){
        		attrData.forEach(function(n,i){
        			n.attrOpt.forEach(function(ny,iy){
        				ny.checked = false;
        			})
        		});
        		scope.basic.showChoseOpt = false;
        	}
        }	
	};
}]);


  /*end of first page basic info*/

  /*第二页相关模板*/

angular.module("infi-basic").directive('inputRelation',['Service',function(Service){
	return {
		restrict:'E',
		template:'<span class="infi-u-tt">设置条件：</span>'
					+'<div class="infi-inline">'
						+'<label>'
							+'<input ng-click = "changeRelation()" id="infi-f-single" ng-model = "detaile.relation" class="infi-f-cond" type="radio" name="filter_relation" value="or">满足以下任一条件即可'
						+'</label>'
						+'<label>'
							+'<input ng-click = "changeRelation()" id="infi-f-all" class="infi-f-cond infi-f-cond-all" type="radio" ng-model = "detaile.relation" value="and" name="filter_relation">必须满足以下全部条件'
						+'</label>'
					+'</div>',
        link:function(scope,element,attrs){
        	scope.changeRelation = function(){
        		if(	scope.detaile.relation === scope.detaile.checkedList.relation){
        			return false;
        		}
        		var checkedList = JSON.parse(JSON.stringify(scope.detaile.checkedList));
        		delete checkedList.$$hashKey;
        		if(!checkedList.value){
        			return false;
        		}
        		checkedList.value.forEach(function(n,i){
        			n.mark = '#666';
        		})
        		checkedList.relation = scope.detaile.relation;

        		//fydebug checkedList和checkedLists需要把值更新，当时没注意结果出了bug
        		scope.detaile.checkedList = checkedList;
        		scope.detaile.checkedLists.unshift(checkedList);

        		//触发这个事件的时候把按钮置成不可点击的状态
				scope.detaile.getEchartsOver = 'disabled';

        		//fydebug这里增加刷新echarts的的方法，直接调用services中的方法即可
        		//callback中存储了后台传回来的数据，
				var callBack = null;

				//这里需要刷新echarts的数据以及拿到新的病例数
				callBack= Service.getNewEchartsData(scope.detaile.detaileOpt,scope.detaile.relation,scope.detaile.groupId,scope.entryName);
				scope.detaile.totalSize = callBack.size;

				//然后成功完成这个事件以后再把它置回来
				scope.detaile.getEchartsOver = callBack.getEchartsOver;
        	}
        }	
	};
}]);

angular.module("infi-basic").directive('inputCheckbox',function(){
	return {
		restrict:'E',
		template:'<div class="infi-m-tag infi-m-tag-more">'
					+'<div class="infi-u-tt">{{opt.label}}：</div>'
					+'<div class="infi-u-tag">'
						+'<ul class="infi-u-lst dataBox">'
							+'<li ng-repeat = "childOpt in opt.opt">'
								+'<label>'
									+'<input ng-click = "genDetaileData(childOpt,opt.label,opt.name,\'checkbox\')" type="checkbox" ng-model="childOpt.checked" ng-checked = "childOpt.checked" name="{{opt.name}}" value="{{childOpt.value}}">{{childOpt.label}}'
								+'</label>'
							+'</li>'
						+'</ul>'
					+'</div>'
				+'</div>',
		replace: true,
        link:function(scope,element,attrs){

        }
	};
});

angular.module("infi-basic").directive('inputNum',function(){
	return {
		restrict:'E',
		template:'<div class="infi-m-tag infi-m-tag-num">'
					+'<div class="infi-u-tt">{{opt.label}}：</div>'
					+'<div class="infi-u-tag">'
						+'<ul class="infi-u-lst dataBox">'
							+'<li ng-repeat = "childOpt in opt.opt">'
								+'<label>'
									+'<input ng-click = "genDetaileData(childOpt,opt.label,opt.name,\'checkbox\')" type="checkbox" ng-model="childOpt.checked" ng-checked = "childOpt.checked" name="{{opt.name}}" value="{{childOpt.value}}">{{childOpt.label}}'
								+'</label>'
							+'</li>'
						+'</ul>'
						+'<div class="infi-u-range">'
							+'<input class="minValue" ng-change = "genDetaileData(opt,opt.label,opt.name,\'number\')" ng-model = "opt.range.min" type="text" name="{{opt.name}}" placeholder="最小值">'
							+'<i style="margin:0 5px;">-</i>'
							+'<input class="maxValue" ng-change = "genDetaileData(opt,opt.label,opt.name,\'number\')" ng-model = "opt.range.max" type="text" name="{{opt.name}}" placeholder="最大值">'
						+'</div>'
					+'</div>'
				+'</div>',
		replace: true,
        link:function(scope,element,attrs){
        	
        }
	};
});

angular.module("infi-basic").directive('inputDate',function(){
	return {
		restrict:'E',
		template:'<div class="infi-m-tag infi-m-date">'
					+'<div class="infi-u-tt">{{opt.label}}：</div>'
						+'<div class="infi-u-tag">'
							+'<div class="infi-u-lst">'
							+'<div class="infi-u-date">'
								+'<input ng-click= "timePlugin(opt)" class="form-control startTime infi-u-inputDate active" type="text" placeholder="开始日期"' 
								+'value="{{opt.value}}" name="{{opt.name}}" readonly="readonly">'
							+'</div>'
						+'</div>'
					+'</div>'
				+'</div>',
		replace: true,		
        link:function(scope,element,attrs){

        	//写在这里是为了能够使用bootstrap原生的change事件，ng-change不足以支持其这个功能
        	scope.timePlugin = function(opt){
        		$('input[name="'+opt.name+'"]').daterangepicker({showfrontDatas:true}, function(start, end, label) {
					opt.value = $('.startTime').val();
					scope.genDetaileData(opt,opt.label,opt.name);
					
					//非angular原生的事件均需要自己触发其脏检测
					scope.$apply;
		        }).trigger('focus');
        	};
        }	
	};
});

angular.module("infi-basic").directive('inputSearch',function(){
	return {
		restrict:'E',
		template:'<div class="infi-m-tag infi-m-tag-more">'
					+'<div class="infi-u-tt">{{opt.label}}：</div>'
					+'<div class="infi-u-tag">'
						+'<div class="infi-u-sch">'
							+'<label class="infi-f-sch">'
								+'<input class="search-keywords" ng-change="searchWords(opt)" type="text" ng-model = "opt.searchWords" placeholder="请输入{{opt.label}}搜索">'
							+'</label>'

							+'<i class="glyphicon glyphicon-search infi-u-i"></i>'
							+'<span style="margin-left: 20px;">如需导出更多{{opt.label}}，请使用搜索</span>'
						+'</div>'

						+'<ul ng-if="opt.searchState" class="infi-u-lst dataBox massiveEnumeration">'
							+'<li ng-repeat = "searchOpt in opt.searchGroup.initData">'
								+'<label>'
									+'<input ng-click = "genDetaileData(childOpt,opt.label,opt.name,\'checkbox\')" type="checkbox" ng-model="searchOpt.checked" ng-checked = "searchOpt.checked " name="{{opt.name}}" value="{{searchOpt.value}}">{{searchOpt.label}}'
								+'</label>'
							+'</li>'
							+'<li ng-repeat = "childOpt in opt.searchGroup.checkedSearchData">'
								+'<label>'
									+'<input ng-click = "genDetaileData(childOpt,opt.label,opt.name)" type="checkbox" ng-model="childOpt.checked" ng-checked = "childOpt.checked " name="{{opt.name}}" value="{{childOpt.value}}">{{childOpt.label}}'
								+'</label>'
							+'</li>'
							+'<li ng-repeat = "searchOpt in opt.searchGroup.searchData">'
								+'<label>'
									+'<input ng-click = "genDetaileData(childOpt,opt.label,opt.name,\'checkbox\')" type="checkbox" ng-model="searchOpt.checked" ng-checked = "searchOpt.checked " name="{{opt.name}}" value="{{searchOpt.value}}">{{searchOpt.label}}'
								+'</label>'
							+'</li>'
						+'</ul>'

						+'<ul ng-if="!opt.searchState" class="infi-u-lst dataBox massiveEnumeration">'
							+'<li ng-repeat = "childOpt in opt.searchGroup.checkedSearchData">'
								+'<label>'
									+'<input ng-click = "genDetaileData(childOpt,opt.label,opt.name)" type="checkbox" ng-model="childOpt.checked" ng-checked = "childOpt.checked " name="{{opt.name}}" value="{{childOpt.value}}">{{childOpt.label}}'
								+'</label>'
							+'</li>'
							+'<table>'
								+'<tbody>'
									+'<tr ng-repeat = "child in opt.children">'
										+'<th>'
											+'<li>'
												+'<label>'
													+'<input ng-click = "genDetaileData(child.mainOpt,opt.label,opt.name)" type="checkbox" ng-model="child.mainOpt.checked" ng-checked = "child.mainOpt.checked " value="{{child.mainOpt.value}}" name="{{opt.name}}">{{child.mainOpt.label}}'
												+'</label>'
											+'</li>'
										+'</th>'
										+'<td>'
											+'<span class="infi-u-searchPrompt">【</span>'
											+'<li ng-repeat = "childOpt in child.childrenOpt">'
												+'<label>'
													+'<input ng-click = "genDetaileData(childOpt,opt.label,opt.name)" type="checkbox" ng-model="childOpt.checked" ng-checked = "childOpt.checked " value="{{childOpt.value}}" name="{{opt.name}}">{{childOpt.label}}'
												+'</label>'
											+'</li>'
											+'<span class="infi-u-searchPrompt">】</span>'
										+'</td>'
									+'</tr>'
								+'</tbody>'
							+'</table>'
							+'<li ng-repeat = "childOpt in opt.opt">'
								+'<label>'
									+'<input ng-click = "genDetaileData(childOpt,opt.label,opt.name)" type="checkbox" ng-model="childOpt.checked" ng-checked = "childOpt.checked " name="{{opt.name}}" value="{{childOpt.value}}">{{childOpt.label}}'
								+'</label>'
							+'</li>'
						+'</ul>'
					+'</div>'
				+'</div>',
		replace: true,		
        link:function(scope,element,attrs){
        	
        }	
	};
});

angular.module("infi-basic").directive('echartsBox',function(){
	return {
		restrict:'E',
		template:'<h2 class="infi-title">病历群特征'
					+'<span class="infi-group-size infi-describe">'
						+'[共筛选得<i>{{detaile.totalSize}}</i>份病历]'
					+'</span>'
					+'<span class="infi-detailsView"></span>'
				+'</h2>'
				+'<div id="group-feature" class="infi-box-containter infi-m-ct">'
					+'<div class="col-md-4 chart infi-inner-box">'
						+'<div id="group-feature-0" class="chart-containter" style="height: 290px; background-color: transparent; cursor: default;">'
						+'</div>'
					+'</div>'
					+'<div class="col-md-4 chart infi-inner-box">'
						+'<div id="group-feature-1" class="chart-containter" style="height: 290px; background-color: transparent; cursor: default;">'
						+'</div>'
					+'</div>'
					+'<div class="col-md-4 chart infi-inner-box">'
						+'<div id="group-feature-2" class="chart-containter" style="height: 290px; background-color: transparent; cursor: default;">'
						+'</div>'
					+'</div>'
					+'<div class="col-md-12 chart infi-inner-box">'
						+'<div id="group-feature-map" class="chart-containter" style="height: 600px; background-color: transparent; cursor: default;">'
						+'</div>'
					+'</div>'
				+'</div>',
        link:function(scope,element,attrs){
        	
        }	
	};
});

angular.module("infi-basic").directive('historyBox',function(){
	return {
		restrict:'E',
		template:'<h2 class="infi-title">筛选记录</h2>'
					+'<div class="infi-box-containter" style="overflow: auto;">'
						+'<table class="table table-striped">'
							+'<thead>'
								+'<tr>'
									+'<td>筛选条件</td>'
									+'<td class="detailsView-minLength">病例数</td>'
								+'</tr>'
							+'</thead>'
							+'<tbody>'
								+'<tr ng-repeat = "checkedList in detaile.checkedLists">'
									+'<td>'
										+'<span ng-repeat = "opt in checkedList.value" ng-if="checkedList.value.length>0">'
											+'<span style="color:#333" ng-if = "checkedList.value.length!==1 && $index !==0">{{checkedList.relation}}</span>'
											+'<span style = "color:{{opt.mark}};margin:0 8px;">{{opt.parent}}_{{opt.value}}</span>'
										+'</span>'
										+'<span><span ng-if="checkedList.value.length === 0" style= "color:red;margin:0 9px;">您没有选择任何数据 ！</span></span>'
									+'</td>'
									+'<td>{{checkedList.size}}</td>'
								+'</tr>'
							+'</tbody>'
						+'</table>'
					+'</div>',
        link:function(scope,element,attrs){
        	
        }
	};
});

/*end of second page basic info*/


 /*第三页相关模板*/

angular.module("infi-basic").directive('exportNav',function(){
	return {
		restrict: 'E',
        template: '<ul class="list-group">'
	        	 		+'<li class="list-group-item {{opt.show}}" ng-repeat="opt in export.exportData">'
	        	 			
							+'<a ng-click="changeNav(export.exportData[$index])" class="">{{opt.attrName}}'
								+'<span></span>'
							+'</a>'
						+'</li>'
					+'</ul>',
        replace: true,
        link:function(scope,element,attrs){
        	scope.changeNav = function(exportData){
				scope.export.exportData.forEach(function(n,i){
					n.show = '';
				});
				exportData.show = 'active';
				scope.export.exportOpt = exportData.attrOpt;
			};
        }	
	};
});

//fydebug 这里directive过长，暂时还没有好的方法进行解决，这个需要百度一下，
angular.module("infi-basic").directive('exportOpt',function(){
	return {
		restrict: 'E',
        template: 
					'<div class="tab-content">'
						+'<div class="children-list checkbox">'
							+'<ul class="list-inline children-list">'
								+'<li ng-repeat="opt in export.exportOpt">'
									+'<div class="infi-m-menu checkbox">'
										+'<label class="radio-inline">'
											+'<input class="filter-tagName" type="checkbox" name="{{opt.name}}" value="{{opt.value}}" '
											+'ng-model="opt.checked" ng-checked = "opt.checked " ng-click = "changeIcon(opt)">'
											+'{{opt.label}}'
										+'</label>'
										+'<span ng-click = "changeIcon(opt)" ng-if = "opt.frontData || opt.relationData" class="glyphicon glyphicon-chevron-{{opt.icon}}" aria-hidden="true"></span>'
										+'<span ng-if = "opt.icon ===\'up\' && (opt.frontData || opt.relationData) " class="z-lst-corner cornerFix"></span>'
										+'<div class="infi-m-lst" ng-if = "opt.icon ===\'up\' && (opt.frontData || opt.relationData)">'
											+'<div>'
												+'<div class="infi-u-relation" ng-if = "opt.frontData">'
													+'<h2>设置前置条件：</h2>'
													+'<div class="infi-m-sch">'
														+'<div class="infi-u-tag">'
															+'<div class="infi-u-sch">{{opt.frontData.label}}文本过滤：'
																+'<span ng-if="opt.tagType === \'huge\'">'
																	+'<label class="infi-f-sch">'
																		+'<input class="search-keywords" ng-change="searchWords(opt.frontData)" type="text" ng-model = "opt.frontData.searchWords" placeholder="请输入{{opt.frontData.label}}搜索">'
																	+'</label>'

																	+'<span style="margin-left: 20px;">如需导出更多{{opt.frontData.label}}，请使用搜索</span>'
																+'</span>'
															+'</div>'

															+'<ul ng-if="opt.frontData.searchState" class="infi-u-lst dataBox massiveEnumeration">'
																+'<li ng-repeat = "searchOpt in opt.frontData.searchGroup.initData">'
																	+'<label>'
																		+'<input type="checkbox" ng-model="searchOpt.checked" ng-checked = "searchOpt.checked " name="{{opt.frontData.limitsName}}" value="{{searchOpt.value}}">{{searchOpt.label}}'
																	+'</label>'
																+'</li>'
																+'<li ng-repeat = "childOpt in opt.frontData.searchGroup.checkedSearchData">'
																	+'<label>'
																		+'<input type="checkbox" ng-model="childOpt.checked" ng-checked = "childOpt.checked " name="{{opt.frontData.limitsName}}" value="{{childOpt.value}}">{{childOpt.label}}'
																	+'</label>'
																+'</li>'
																+'<li ng-repeat = "searchOpt in opt.frontData.searchGroup.searchData">'
																	+'<label>'
																		+'<input type="checkbox" ng-model="searchOpt.checked" ng-checked = "searchOpt.checked " name="{{opt.frontData.limitsName}}" value="{{searchOpt.value}}">{{searchOpt.label}}'
																	+'</label>'
																+'</li>'
															+'</ul>'  

															+'<ul ng-if="!opt.frontData.searchState" class="infi-u-lst dataBox massiveEnumeration">'
																+'<li ng-repeat = "childOpt in opt.frontData.searchGroup.checkedSearchData">'
																	+'<label>'
																		+'<input type="checkbox" ng-model="childOpt.checked" ng-checked = "childOpt.checked " name="{{opt.frontData.limitsName}}" value="{{childOpt.value}}">{{childOpt.label}}'
																	+'</label>'
																+'</li>'
																+'<table>'
																	+'<tbody>'
																		+'<tr ng-repeat = "child in opt.frontData.children">'
																			+'<th>'
																				+'<li>'
																					+'<label>'
																						+'<input type="checkbox" ng-model="child.mainOpt.checked" ng-checked = "child.mainOpt.checked " value="{{child.mainOpt.value}}" name="{{opt.frontData.limitsName}}">{{child.mainOpt.label}}'
																					+'</label>'
																				+'</li>'
																			+'</th>'
																			+'<td>'
																				+'<span class="infi-u-searchPrompt">【</span>'
																				+'<li ng-repeat = "childOpt in child.childrenOpt">'
																					+'<label>'
																						+'<input type="checkbox" ng-model="childOpt.checked" ng-checked = "childOpt.checked " value="{{childOpt.value}}" name="{{opt.frontData.limitsName}}">{{childOpt.label}}'
																					+'</label>'
																				+'</li>'
																				+'<span class="infi-u-searchPrompt">】</span>'
																			+'</td>'
																		+'</tr>'
																	+'</tbody>'
																+'</table>'
																+'<li ng-repeat = "childOpt in opt.frontData.opt">'
																	+'<label>'
																		+'<input  type="checkbox" ng-model="childOpt.checked" ng-checked = "childOpt.checked " name="{{opt.frontData.limitsName}}" value="{{childOpt.value}}">{{childOpt.label}}'
																	+'</label>'
																+'</li>'
															+'</ul>'
														+'</div>'
													+'</div>'

													+'<div class="infi-u-sch" ng-if = "opt.frontData.filter.opt">'
														+'<label>{{opt.frontData.label}}事件过滤：</label>'
														+'<ul class="infi-u-lst dataBox massiveEnumeration">'
															+'<li ng-repeat = "childOpt in opt.frontData.filter.opt">'
																+'<label class="radio-inline">'
																	+'<input type="radio" ng-model="opt.frontData.filter.checked" ng-checked = "opt.frontData.filter.checked === childOpt.value" value="{{childOpt.value}}" name="{{opt.frontData.textName}}">{{childOpt.label}}'
																+'</label>'
															+'</li>'
														+'</ul>'
													+'</div>'

												+'</div>'
												+'<div ng-if = "opt.relationData && opt.frontData" class="infi-u-line"></div>'
												+'<div ng-if = "opt.relationData" class="infi-u-main">'
													+'<h2>选择关联属性：</h2>'
													+'<div class="infi-m-sch checkbox">'
														+'<label ng-repeat = "children in opt.relationData">'
															+'<input type="checkbox" ng-checked = "children.checked" ng-model ="children.checked" value="{{children.checked}}" name="{{children.name}}">{{children.label}}'
														+'</label>'
													+'</div>'
												+'</div>'
											+'</div>'
										+'</div>'

									+'</div>'
								+'</li>'
							+'</ul>'
						+'</div>'
					+'</div>',			
		replace: true,
        link:function(scope,element,attrs){

        	//这个方法需要移植到别的地方，
        	scope.changeIcon = function(opt){
        		if(!opt.icon){
        			opt.icon = 'up';
        		}else{
        			if(opt.icon === 'down'){
	        			opt.icon = 'up';
	        			opt.checked = true;
	        		}else{
	        			opt.icon = 'down';
	        		}
        		};

        		//如果是false则需要将其下所有属性清空
        		if(opt.checked === false){
        			if(!opt.frontData){
        				return false;
        			}
        			if(opt.frontData.opt){
        				opt.frontData.searchWords = '';
        				opt.frontData.opt.forEach(function(n,i){
	        				n.checked = false;
	        				if(opt.frontData.searchGroup){
	        					opt.frontData.searchGroup.initData.forEach(function(ny,iy){
	        						ny.checked = false;
	        					})
	        					opt.frontData.searchGroup.checkedSearchData.forEach(function(ny,iy){
	        						ny.checked = false;
	        					})
	        					opt.frontData.searchGroup.searchData.forEach(function(ny,iy){
	        						ny.checked = false;
	        					})
	        				}
	        			});
        			}
        			if(opt.relationData){
        				opt.relationData.forEach(function(n,i){
	        				n.checked = false;
	        			})
        			}
        			scope.searchWords(opt.frontData);
        		}
        		
        	}
        }	
	};
});

angular.module("infi-basic").directive('modalName',function(){
	return {
		restrict: 'E',
        template: '<div class="modal fade" id="infi-u-name">'
					+'<div class="modal-dialog">'
						+'<div class="modal-content">'
							+'<div class="modal-header">'
								+'<button type="button" class="close" data-dismiss="modal" aria-label="Close" ng-click="clearRecordName()"><span aria-hidden="true">&times;</span></button>'
								+'<h4 class="modal-title">请填写病历名称 </h4>'
								+'<span style="color:red;" ng-if="export.tip">病历名称不能为空  ！！！</span>'
							+'</div>'
							+'<div class="modal-body">'
								+'<label for="">病历名称:</label><span class="infi-delCheck"></span>'
								+'<input type="text" class="form-control remark" name ="recordName" value = "{{export.recordName}}" ng-model = "export.recordName"/>'
							+'</div>'
							+'<div class="modal-footer">'
								+'<button type="button" class="btn btn-default" data-dismiss="modal" ng-click="clearRecordName()">关闭</button>'
								+'<a class="btn btn-primary"  ng-click="submitExport()">提交</a>'
							+'</div>'
						+'</div><!-- /.modal-content -->'
					+'</div><!-- /.modal-dialog -->'
				+'</div><!-- /.modal -->',
        replace: true,
        link:function(scope,element,attrs){
        	
        }	
	};
});

angular.module("infi-basic").directive('modalTip',['$interval','SYS','$timeout',function($interval,SYS,$timeout){
	return {
		restrict: 'E',
        template: '<div class="modal fade" id="infi-u-modalTip">'
					+'<div class="modal-dialog">'
						+'<div class="modal-content">'
							+'<div class="modal-body">'
								+'<div ng-if = "timer && timer === \'uploading\'" class="alert alert-info" role="alert">数据提交中……</div>'
								+'<div ng-if = "timer && timer === \'false\'" class="alert alert-warning" role="alert">数据提交失败！</div>'
								+'<div ng-if = "(timer && timer >= 0)||!timer" class="alert alert-success" role="alert">数据提交成功！</div>'
								+'<span ng-if = "(timer && timer >= 0)||!timer"><b>{{timer}}</b>秒后自动跳转至列表页</span>'
							+'</div>'
							+'<div class="modal-footer">'
								+'<button ng-if="timer && timer === \'false\'" type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'
								+'<a class="btn btn-primary" ng-click="goToList()">跳转到列表页</a>'
							+'</div>'
						+'</div><!-- /.modal-content -->'
					+'</div><!-- /.modal-dialog -->'
				+'</div><!-- /.modal -->',
        replace: true,
        link:function(scope,element,attrs){
        	scope.showModalTip = function(){
        		var num = 5;
        		scope.timer = num;
        		$interval(
        			function(){
        				num--;
        				if(num === 0){
        					scope.timer = 0;
							scope.goToList();
        				}
        				scope.timer = num;
        			},1000
        		)

				scope.goToList = function () {
					$('#infi-u-modalTip').modal('hide');
					$timeout(function () {
						window.location.href= '#/list/all/'+scope.subjectId;
					},1000)
				}
        	}
        }	
	};
}]);

