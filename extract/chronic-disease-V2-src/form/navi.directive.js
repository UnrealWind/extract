angular.module('infi-basic').directive('affix',[function($http,$routeParams,SYS,$timeout){
	return {
		restrict: 'ECMA',
        template: '<div><div><div id="affix" class="affix-nav" role="complementary">'
						+'<ul id="affix-nav" class="nav " role="tablist">'
							+'<li class="infi-nav-outside " ng-repeat = "model in navigates" ng-class="{true:\'active\',false:\'\'}[currModuleName === model.name]">'
								+'<a style="padding-right: 0px;" href="javascript:;" style="position: relative;" ng-click = "changeModule(model,\'details\')"><span ng-if="model.hasNotNull" style="position:absolute;left:-8px;font-size:16px;top:2px;"><em class="glyphicon" ng-class="{true:\'glyphicon-ok-sign\',false:\'glyphicon-exclamation-sign\'}[!model.hasNecessary]"></em></span>{{model.label}}</a>'

							+'</li>'
						+'</ul>'
					+'</div>'
					+'<div id="interviewTemplate" class="modal fade" tabindex="-1" role="dialog">' +
						'<div class="modal-dialog" role="document">' +
						' <div class="modal-content">' +
						'	<div class="modal-header">' +
								'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n' +
								' 	<h4 class="modal-title">选择模板</h4>' +
						'	</div>' +
						'	<div class="modal-body">' +
						'        <table class="table">' +
									'<thead>' +
										'<tr><th class="checkallth"><label class="checkall">全选&nbsp;&nbsp;<input ng-change="checkAll()" ng-model="checkAllTemplate" type="checkbox"></label></th><th>序号</th><th>CRF表</th><th>操作</th></tr> ' +
								'	</thead>' +
									'<tbody>' +
									'<tr ng-repeat="opt in chosedInterviews">' +
									'<td><label class="checkalltd"><input ng-model="opt.checked" name="opt.name" value="1" type="checkbox"></label></td>' +
									'<td>{{$index+1}}</td><td>{{opt.name}}</td><td><a  ng-click="viewDetail(opt)">预览问卷</a></td>' +
									'</tr>' +
									'</tbody>'+
								'</table>' +
								'<div ng-if="!chosedInterviews" class="alert alert-danger">暂无数据！！！</div>' +
						'      </div>' +
						'	 <div class="modal-footer">' +
						'        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>' +
								'<button type="button" class="btn btn-primary" ng-click="addTemplateCRF()">确定</button>' +
						'      </div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>',
		replace: true,
		link:function(scope,element,attrs){
			scope.checkAllTemplate = false;
			scope.addCRFTemplate = function (typeId) {
				$http.get(SYS.url+'crf/template/group/'+$routeParams.groupId+'/type/'+typeId+'/list').then(function (msg) {
					scope.chosedInterviews = msg.data.data;
					$('#interviewTemplate').modal('show');
                })
            }
            
            scope.checkAll = function () {

                scope.checkAllTemplate?scope.chosedInterviews.forEach(function (n,i) {
					n['checked'] = true;
                }):scope.chosedInterviews.forEach(function (n,i) {
                    n['checked'] = false;
                })
            }
            
            scope.addTemplateCRF = function () {
                scope.chosedInterviews?(function () {
                        scope.chosedInterviews.forEach(function (n,i) {
                            n['templateId'] = n.id;
                            n['checked']?(function () {
                                var add = true;
                                scope.sessionInterview.interviewTemplates.forEach(function (nx,ix) {
                                    nx.templateId == n.templateId?add=false:'';
                                });
                                add?(scope.getNaviData(n.id,scope.sessionInterview.id),
                                    scope.sessionInterview.interviewTemplates.push(n)):'';
                            })():'';
                        });
                    })():'';
                $('#interviewTemplate').modal('hide');
                scope.checkAllTemplate = false;
            }

            scope.viewDetail = function (opt) {
                scope.viewTemplateId = opt.id;
                scope.viewDetailShow = false;
                $timeout(function () {
                    scope.viewDetailShow = true;
                },0)

            }

		}
	};
}])