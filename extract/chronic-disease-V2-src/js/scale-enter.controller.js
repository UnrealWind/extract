angular.module('infi-basic').controller('ScaleEnterController',
	['$scope', 'formNaviServices', 'formServices', 'FileService', '$routeParams', 'FileUploadServices', 'APIService',
		function ($scope, formNaviServices, formServices, FileService, $routeParams, FileUploadServices, APIService) {
			var routeParam = $routeParams

			$scope.totast = {                                             // totast 通知
				mainBody: null
			}


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

			// 是否显示分配方案按钮的控制开关
			// 更具路由中 :entry 进行控制
			var canSetPlanMap = {
				'0': true,							// 新建患者进入
				'1': false, 						// 患者管理页基本信息进入,
				'2': true, 							// 患者管理页的非第一次评估和随访进入
				'3': true								// 患者管理页的第一次评估进入
			}
			$scope.canSetPlan = canSetPlanMap[routeParam.entry]


			// 左侧导航列表
			$scope.navigates = [];

			//私有方法用于控制翻页按钮的状态,fydebug 这个需要移植到services里面，
			function controlFilp(modelName) {
				$scope.prevshow = '';
				$scope.nextshow = '';

				//根据传过来的modelName，对input的状态进行判断以及更改，其实就是对第一个以及最后一个的特殊状态进行判断 
				for (var index in $scope.moduleNameArr) {
					if ($scope.moduleNameArr[index] === modelName) {
						if (index == 0) {
							$scope.prevshow = 'disabled';
						} else if (index == $scope.moduleNameArr.length - 1) {
							$scope.nextshow = 'disabled';
						}
					}
				};
			};

			$scope.updateModuleForm = function (model, detailsMark) {

				//强制使页面跳转到页面顶部
				$('body').animate({
					scrollTop: 0
				}, 500);

				controlFilp(model.name);
				var callback = formServices.ajaxModuleData(model, detailsMark)
				$scope.currentData = callback.version;
				$scope.currModuleName = model.name;
				$scope.currentModule = model;
			};

			var utilsFunc = {
				// 左侧导航默认激活
				'findDefaultInd': (whole, single) => {
					var tarInd = 0
					whole.forEach((ele, ind) => {
						if (ele.name === single.name) {
							tarInd = ind
						}
					})
					return tarInd
				}
			}

			$scope.getNaviData = function (templateId, interviewId, i) {
				formNaviServices.ajaxNaviData(templateId, interviewId).then(function (msg) {
					$scope.navigates = $scope.navigates.concat(msg.data)
					//缓存下来模块的数据
					$scope.navigates.forEach(function (n, i) {
						$scope.moduleNameArr.push(n.name)
					});

					var ind = utilsFunc.findDefaultInd($scope.navigates, $scope.sessionInterview)

					$scope.updateModuleForm($scope.navigates[ind], 'details')

					// i == 0 ?$scope.updateModuleForm($scope.navigates[0],'details'):'';
				});
			};



			/**
			 * 改变当前 interview 的状态
			 */
			var changePlanItemState = function(callback) {
				var currInter = JSON.parse(sessionStorage.getItem('currInterview'))

				// status map
				var statusMap = {
					'未执行': '已执行',
					'已执行': '已执行'
				}
				// statusCode map
				var statusCode = {
					'waiting': 'finish',
					'finish': 'finish'
				}

				APIService.changePlanItemStatus({
					'status': statusMap[currInter.status],
					'statusCode': statusCode[currInter.statusCode]
				}, currInter)
					.then(function(msg) {
						callback ? callback() : undefined
					}, function(error) {
							$scope.totast.mainBody = {                                  // 通知提示语定义
								status: 'error',
								description: '出错了,请重新保存!',
								delay: 1500
						}
					})
			}


			/**
			 * 分配方案
			 */
			$scope.setPlan = function () {
				formServices.saveModule($scope).then(function (msg) {
					formServices.saveAllModule($scope.sessionInterview, function (data) {
						var currInter = JSON.parse(sessionStorage.getItem('currInterview'))
						// 排除 “基本资料” 和 “患者基本资料的情况”， 因为他们不需要更改状态。status、statusCode 为 null
						if (currInter.type !== 'default') { 
							// 改变状态
							changePlanItemState(() => {
								location.href = `#/viewEvaluateRst/${routeParam.depId}/${routeParam.groupId}/${routeParam.interviewId}/${routeParam.crfTemplateId}`
							})
						} else {
							location.href = `#/viewEvaluateRst/${routeParam.depId}/${routeParam.groupId}/${routeParam.interviewId}/${routeParam.crfTemplateId}`
						}
					})
				})
			}

			// 保存并返回
			$scope.saveModule = function () {
				formServices.saveModule($scope).then(function (msg) {
					formServices.saveAllModule($scope.sessionInterview, function (data) {
						var currInter = JSON.parse(sessionStorage.getItem('currInterview'))
						// 排除 “基本资料” 和 “患者基本资料的情况”， 因为他们不需要更改状态。status、statusCode 为 null
						if (currInter.type !== 'default') { 
							changePlanItemState(() => {
								location.href = `#/patiManage/${$routeParams.depId}`
							})
						} else {
							location.href = `#/patiManage/${$routeParams.depId}`
						}
					});
				})
			}

			// 返回
			$scope.backward = function() {
				location.href=`#/patiManage/${$routeParams.depId}`
			}



			;
			(function init() {
				// 清除无用缓存
				sessionStorage.removeItem('savedScales')																						// 清除已保存结果的量表信息，以免影响当前评估

				$scope.sessionInterview = JSON.parse(sessionStorage.getItem('currInterview'));
				$scope.getNaviData(routeParam.crfTemplateId, routeParam.interviewId, 0)
			})();

			//用于触发请求所有的input数据
			$scope.print = function () {
				var callback = formServices.print($scope.navigates, $scope);
				$scope.currentData = callback.currentData;
				$scope.auditPassData = callback.auditPassData;
			};

			//用于判断页面完成渲染后，调用jquery打印功能
			$scope.$on('renderOver', function () {
				formServices.bindPrint();
			});

			//历史审核数据完成渲染之后添加disabled属性
			$scope.$on('renderOverHistory', function () {
				$('.history-audit-pass input,.history-audit-pass textarea').attr('disabled', 'disabled');
				$('.history-audit-pass .infi-add-attr-group').remove();
			});

			$scope.continue = true;
			$scope.changeModule = function (model, details, num) {
				//console.log($scope.navigates)
				//调用保存api
				$scope.continue = true;
				formServices.saveModule($scope).then(function (msg) {
					if ($scope.continue) {
						num ? (function () {
							for (var index in $scope.navigates) {
								if ($scope.navigates[index].name === $scope.currModuleName) {
									$scope.updateModuleForm($scope.navigates[Number(index) + Number(num)], details);
									return;
								}
							}
						})() : $scope.updateModuleForm(model, details);
					}
				});
			};


			$scope.onFileSelect = function ($files, input, isMultiple, attachment) {
				FileUploadServices.upload($files, input, isMultiple, attachment, $scope);
			};

			//设置图片上传成功后显示在中下方
			$scope.scrollTop = function () {
				var iCount = setInterval(function () {
					$scope.scrollTopn = $scope.scrollTopn + 30;
					$('#load-success').scrollTop($scope.scrollTopn);
					if ($scope.stopload == true) {
						clearInterval(iCount);
					}
				}, 30);
			}

			//scaleInput 中存储了对应的scale量表的数据
			$scope.scaleModal = function (input) {
				//data为null的话，说明并没有请求新的scale数据，所以直接使用自己input中缓存的数据即可
				var data = formServices.getScaleData(input);
				if (data == null) {
					$scope.scaleData = input.scaleData;
				} else {
					input.scaleData = data;
					$scope.scaleData = data;
				}
				$scope.scaleData.tagInputData = input;
				$('#infi-u-scale').modal({
					backdrop: 'static'
				});
			}

			//这个用于使显示图片的模态框显示出来
			$scope.showImgModal = function (imgId, callBackData) {
				if (!callBackData instanceof Array) {
					callBackData = callBackData.data;
				}

				$scope.getImgData(imgId, callBackData);
				FileService.showImgModal();
			}

			$scope.showDownloadModel = function (callBackData) {
				$scope.getDownloadImgData(callBackData);
				$('#downloadImg').modal('show');
			}

			$scope.goToRecordModify = function () {
				location.href = '#/record-modify/' + $routeParams.subjectId + '/' + $routeParams.groupId + '/' + $routeParams.recordId + '/' + $routeParams.interviewId;
			}
			$scope.modalHide = function () {
				$('#general-prompt').modal('hide');

			}


		}
	]);