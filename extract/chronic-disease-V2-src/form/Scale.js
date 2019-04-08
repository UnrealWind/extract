angular.module("infi-basic").directive('scaleModal',['SYS','$http','Session',function(SYS,$http,Session){
	return {
		restrict: 'E',
        template: '<div class="modal fade" id="infi-u-scale">'
					+'<div class="modal-dialog modal-lg">'
					    +'<div class="modal-content">'
					      +'<div class="modal-header">'
					        +'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
					        +'<h1 class="modal-title">量表信息</h1>'
					      +'</div>'
					     /* +'<div ng-show = "scaleData.showWarning == true">'
							+'<div class="alert alert-warning infi-alert">请回答完所有题目以后再提交！</div>'
						  +'</div>'*/
					      +'<div class="modal-body">'
					      	+'<h1 class="infi-title">{{scaleData.tagInputData.label}}</h1>'
					      	+'<div class="infi-box-containter detail-main">'
					      		+'<div class="healthtestnav center-block">'
					      			+'<ul>'
					      				+'<li  ng-repeat = "opt in scaleData.data"><a ng-class="{true:\'active\',false:\'\'}[opt.showOptIdx]" index="{{$index+1}}" ng-click = "changeSubject(0,$index)">{{$index+1}}</a></li>'
					      			+'</ul>'
					      		+'</div>'
					      		+'<div class="text-check">'
					      			+'<form id="filterForm">'
					      				+'<a class="glyphicon glyphicon-chevron-left to-left prev" aria-hidden="true" ng-click = "changeSubject(-1)"> </a>'
					      					+'<ul class="list-inline">'
					      						+'<li ng-repeat = "options in scaleData.data" ng-class="{true:\'active\',false:\'\'}[options.showOpt]">'
					      							+'<p>{{$index+1}} . {{options.questionName}}</p>'
					      							+'<div ng-repeat = "opt in options.scaleQuestionOptions" class="radio">'
														+'<label class="checkbox-inline">'
															+'<input type="radio" ng-checked = "options.valueId == opt.id" value="{{opt.id}}" name="{{opt.questionName}}" ng-change = "changeOptIdx(options)" ng-model = "options.valueId">{{opt.optionName}}'
														+'</label>'
													+'</div>'
					      						+'</li>'
					      					+'</ul>'
					      				+'<a class="glyphicon glyphicon-chevron-right to-right next" aria-hidden="true" ng-click = "changeSubject(1)"> </a>'
					      			+'</form>'
					      		+'</div>'
					      	+'</div>'
					      +'</div>'
					      +'<div class="modal-footer">'
					      	/*+'<input ng-if="scaleData.showWarning == true" id="scale" class="btn btn-fix infi-btn-primary btn-submit" type="button" disabled="disabled" value="提交">'*/
					      	+'<button id="scale" class="btn btn-fix infi-btn-primary btn-submit" type="button" ng-click = "saveScale()">保存</button>'
					        +'<button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>'
					      +'</div>'
					    +'</div><!-- /.modal-content -->'
					  +'</div><!-- /.modal-dialog -->'	
				 +'</div>',
		replace: true,
		link:function(scope,element,attrs){

			scope.changeSubject = function(changeMark,navNum){
				var data = scope.scaleData.data;
				for(var index in data){
					if(data[index].showOpt === true){
						if(index == 0 && changeMark == -1 || index==data.length-1 && changeMark==1){
							return;
						}
						data[index].showOpt = false;
						if(navNum||navNum==0){
							data[Number(navNum)].showOpt = true;
							return
						}
						data[Number(index)+Number(changeMark)].showOpt = true;
						return;
					}
				}
			}

			scope.changeOptIdx =function(options){
				options.showOptIdx = true;
				var idx = 0;
				scope.scaleData.data.forEach(function(n,i){
					if(n.showOptIdx == true){
						idx++;
					}
				});

				if(idx === scope.scaleData.data.length){
					scope.scaleData.showWarning = false;
				}
			}

			scope.saveScale = function(){
				var data = angular.copy(scope.scaleData).data;
				var tagData = [];
				
				//fydebug 删除无关紧要的数据
				data.forEach(function(n,i){
					delete n.$$hashKey;
					delete n.showOpt;
					delete n.order;
					n.scaleQuestionOptions.forEach(function(ny,iy){
						delete ny.$$hashKey;
					});
					if(n.showOptIdx){
						delete n.showOptIdx;
						tagData.push(n);
					}
				});
                var user = Session.getUser();
                var params = 'eu='+user.eu+'&ep='+user.ep;
				$.ajax({

				 	//把整个scaleData传回后台，其中包含了用户的选项
				 	data : JSON.stringify(tagData),
				 	url :  SYS.url+'/scale/save/'+scope.scaleData.tagInputData.scaleUrl+'?'+params,
				 	type : 'post',
				 	contentType: "application/json",
				 	async: false,
				 	success:function(msg){
				 		var scaleArry = msg.data.message.split('##');
				 		scope.scaleData.tagInputData.value =scaleArry[0];
			 			scope.scaleData.tagInputData.score =scaleArry[1];
				 		if(scaleArry[1]>-1){
				 			scope.scaleData.tagInputData.tip = scope.scaleData.tagInputData.score;
				 		}else{
				 			scope.scaleData.tagInputData.tip = '点击继续填写！';
				 		}
				 		$('#infi-u-scale').modal('hide');
				 		/*refreshScaleData(scope.currentData);
				 		function refreshScaleData(arry){
				 			arry.forEach(function(n,i){
				 				if(n.children && n.children.length>0){
				 					refreshScaleData(n.children);
				 				}
				 				if(n.type === '量表' && n.name === scope.scaleData.tagInputData.name){
				 					n.value = scope.scaleData.tagInputData.value;
				 					n.score = scope.scaleData.tagInputData.score;
				 				}
				 			});
				 		};*/
				 	}
				});  
			}
		}
	};
}])
// 慢病自个的量表模态框
.directive('chronScaleModal', ['SYS', '$http', '$routeParams', function (SYS, $http, $routeParams) {
	return {
		restrict: 'ECMA',
		replace : true,
		templateUrl: './form/basic-template/chron-scale-modal.html',
		link:function(scope,element,attrs){
			// 本页的工具函数
			var utils = {
				recur: function(data, callback) {
					var calle = arguments.callee

					data.forEach(function(ele) {
						if(ele.type != 'question') {
							calle(ele.childs, callback)
						} else {
							callback(ele)
						}
					})
				},
				buildResult: function(scalRst, input) {
					if(!sessionStorage.getItem('savedScales')) {
						var fistRst = {}
	
						fistRst[input.label] = scalRst
	
						sessionStorage.setItem('savedScales', JSON.stringify(fistRst))
	
					} else {
						var savedRst = JSON.parse(sessionStorage.getItem('savedScales'))
	
						savedRst[input.label] = scalRst
	
						sessionStorage.setItem('savedScales', JSON.stringify(savedRst))
					}
				}
			}


			scope.calcRst = {																													// 计算结果相关变量及状态
				rst: null,																															// 计算结果
				currState: 'init',																											// 当前状态
				stateMachine: {																													// 状态机
					'init': {
						calc: 'calclating'
					},
					'calclating': {
						success: 'showRst',
						failure: 'showErr'
					},
					'showRst': {
						calc: 'calclating'
					},
					'showErr': {
						calc: 'calclating'
					}
				},
				changeState: function(name) {                       // 修改状态
					var state = scope.calcRst.currState

					if(scope.calcRst.stateMachine[state][name]) {
							scope.calcRst.currState = scope.calcRst.stateMachine[state][name]
					}
				}
			}

			/**
			 * 判定是否可以点击计算结果
			 * @description 在 recurScaleContent directive 中的 setCheckbox 和 setRadio 方法分别进行广播
			 * 							这里监听到以后会递归检查是否存在没有选择的项
			 */
			scope.checkedRad = []
			scope.$on('canCalcuRst', function() {
				utils.recur(scope.modelData.questionList, function(ele) {
					if(ele.choicedOptionList && ele.choicedOptionList.length > 0) scope.checkedRad = scope.checkedRad.concat(ele.choicedOptionList)
				})
			})


			/**
			 * 计算结果
			 */
			scope.calcScale = function() {
				var checkedRad = []
				// 当前护理组，用于拼接计算结果接口地址
				var currGroup = JSON.parse(sessionStorage.getItem('currGroup'))
				// 用于拼接计算结果接口地址的 flag 参数
				var flag = currGroup.type == 'picc' ? 'picc' : ''

				utils.recur(scope.modelData.questionList, function(ele) {
					// 时间选择类型
					if(ele.checkBox === '时间-年月日') checkedRad.push(ele.optionList[0])
					// 小文本输入类型
					if(ele.checkBox === '小文本输入') checkedRad.push(ele.optionList[0])

					// 单选多选类型
					if((ele.checkBox === '单选' || ele.checkBox === '多选')  && ele.choicedOptionList && ele.choicedOptionList.length > 0) checkedRad = checkedRad.concat(ele.choicedOptionList)
				})

				scope.calcRst.changeState('calc')																		// 更改状态为 计算中(calclating)

				

				// 发送选中项， 获得计算结果
				$http.post(`${SYS.url}research/evoluation/form/${scope.input.scaleUrl}/result?flag=${flag}`, checkedRad).then(function (msg) {
					if(msg.data.status == 'ok') {
						scope.calcRst.changeState('success')														// 更改状态为 计算成功(showRst)
						scope.calcRst.rst = msg.data.data
					} else if(msg.data.status == 'blank') {		
						scope.calcRst.changeState('success')														// 更改状态为 计算成功(showRst), 但是结果集为空
						scope.calcRst.rst = []
					} else {								
							scope.calcRst.changeState('failure')													// 更改状态为 计算失败(showErr)
							scope.calcRst.rst = []
					}
				}, function(error) {
					scope.calcRst.changeState('failure')
					scope.calcRst.rst = []
				})
			}


			/**
			 * 清空当前
			 */
			scope.retest = function() {
				scope.calcRst.rst = null																											// 重置结果
				scope.calcRst.currState = 'init'

				utils.recur(scope.modelData.questionList, function(ele) {
					// 时间选择类型
					if(ele.checkBox === '时间-年月日') ele.optionList[0].score = null
					// 小文本输入类型
					if(ele.checkBox === '小文本输入') ele.optionList[0].score = null
					
					ele.choicedOptionList = null																								// 重置选项

				})

				scope.checkedRad = []

				// setTimeout(() => {
				// 	scope.$apply()
				// }, 0)
			}

			/**
			 * 保存计算结果
			 */
			scope.saveScale = function () {
				utils.buildResult(scope.calcRst.rst, scope.input)																						// 拼接保存并返回时所需参数
				scope.input.value = `${scope.calcRst.rst.resultLevel},${scope.calcRst.rst.id}`
				scope.input.score = scope.calcRst.rst.score
				$(`#${scope.input.name}`).modal('hide')
			}
		}
	}
}])

// 模板内容的递归模板
.directive('recurScaleContent', [function() {
	return {
		restrict: 'ECMA',
		replace: true,
		templateUrl: './form/basic-template/chron-scale-content.html',
		scope: {
			secData: "="
		},
		link: function(scope) {


			scope.findObjectByKey = function(array, key, value) {
				if(array) {
					for (var i = 0; i < array.length; i++) {
						if (array[i][key] === value) {
								return {
									isIn: true,
									ind: i
								};
						}
					}
				}

				return {
					isIn: false,
				}
			}

			// checkbox 点击
			scope.setCheckbox = function(secChild, check) {
				!secChild.choicedOptionList ? secChild.choicedOptionList = [] : undefined

				var checkIsIn = scope.findObjectByKey(secChild.choicedOptionList, 'id', check.id)


				if(checkIsIn.isIn) {
					secChild.choicedOptionList.splice(checkIsIn.ind, 1)
				} else {
					secChild.choicedOptionList.push(check)
				}

				// 向父组件广播通知，控制 "计算结果" 按钮的 disabled
				scope.$emit('canCalcuRst')
			}

			// radio 点击
			scope.setRadio = function(secChild, radio) {
				!secChild.choicedOptionList ? secChild.choicedOptionList = [] : undefined

				secChild.choicedOptionList[0] = radio

				// 向父组件广播通知，控制 "计算结果" 按钮的 disabled
				scope.$emit('canCalcuRst')
			}
		}
	}
}])