/**
 * 
 */
angular.module("infi-basic").controller('multiChose', ['$scope','$http','ProjectNameService','SYS',function($scope,$http,ProjectNameService,SYS){

	(function(){
    	$(document).unbind().bind('click',function(event){
    		
    		//浏览器兼容性
    		var e = event || window.event; 
    		var elem = e.target || e.srcElement;
    		
    		//循环判断至跟节点，防止点击的是div子元素
    		while (elem) { 
	    		if ($(elem).hasClass('showSele') === true  || $(elem).hasClass('multicon') === true) {
		    		return;
		    		}
	    		elem = elem.parentNode;
    		}
    		
    		//点击的不是div或其子元素则隐藏
    		$scope.show = false;
    		$scope.$apply();
		}); 
	})();

	$scope.show = false;

	//get原始数据
	ProjectNameService.getInitData().then(function(msg){
		$scope.standard = msg.data;
		ProjectNameService.getExistProject().then(function(msg){

			//适配一下数据，方便页面使用
			msg.data.forEach(function(n,i){
				findProject(n,$scope.standard);
		 	});
		 	$scope.standard.forEach(function(n,i){
				addType(n,0);
			});
			$scope.options = $scope.standard;
			$scope.$watch('$scope.$root.project',function(oldValue,newValue){
        		if( !$scope.chosedValue ){
        			$scope.chosedValue = getItem($scope.options,$scope.$root.project.value);
        		}
        	});
		});
	});
	
	function findProject(obj , array){
		array.forEach(function(n){
			if($.trim(obj['label']) === n['label']){
				n['value'] = obj['name'];
				return ;
			}
			if($.isArray(n.children)){
				findProject(obj , n.children)
			}
		})
	}

	//给数据添加一个标示，这个标示用于完成显示隐藏的动作,以及增加一个样式上的区分，value是‘’的话需要置成灰色
	function addType(opt,num,prevData,firstData){
		num++;
		opt.type = 'down';
		opt.haveValue = false;
		opt.children.forEach(function(ny,iy){
			if(ny.value !== '' && ny.value !== null){
				ny.haveValue = true;
				opt.haveValue = true;
				if(prevData){
					prevData.haveValue = true;
				}
				if(firstData){
					firstData.haveValue = true;
				}
			}else{
				ny.haveValue =false;
			}
			if(num>1){
				opt.type = 'right';
			}
			if(ny.children && ny.children.length>0){
				addType(ny,num,opt,prevData);
			}
		})
	}

	function getItem(array,key){
		if( array && array instanceof Array ){
			for( var idx=0;idx<array.length;idx++ ){
				if( array[idx].value == key ){
					return array[idx];
				}
				var child = getItem(array[idx].children,key);
				if( child ){
					return child;
				}
			}
		}
	}
	
}]);

angular.module("infi-basic").service('ProjectNameService',['$http','SYS',function($http,SYS){
	this.getInitData = function(){
		return $http({
		    method: 'get',
	    	url: SYS.url+'/load/projects/disease'
		}).then(function(msg){
			return msg.data;
		});
	}

	this.getExistProject = function(){
		return $http({
		    method: 'get',
	   	 	url: SYS.url+'/load/projects/user'
		}).then(function(msg){
			return msg.data;
		});
	}
}])

angular.module("infi-basic").directive('chose',function(){
	return {
		restrict: 'A',
        template: '<div><div style="cursor:pointer;" class="showSele" ng-click="showContent()" ><span style="float: right;" class="fa fa-chevron-down"></span>{{chosedValue.label}} </div>\
        	<div class="multicon" ng-show="show">\
        		<ul >\
        			<li ng-repeat="option in options" ng-class="{active:option.selected}">\
        				<span ng-class="{false:\'notAllowed\',true:\'allowed\'}[{{option.haveValue}}]"><i class="fa fa-caret-down"></i>&nbsp;&nbsp; {{option.label}}</span>\
			        	<ul>\
							<li ng-repeat="option in option.children" ng-class="{active:option.selected}">\
								<span ng-class="{false:\'notAllowed\',true:\'allowed\'}[{{option.haveValue}}]" ng-click = "changeType(option)" ng-if="option.children.length>0"><i class="fa fa-caret-{{option.type}}"></i>&nbsp;&nbsp;{{option.label}}</span>\
								<a ng-class="{false:\'notAllowed\',true:\'allowed\'}[{{option.haveValue}}]" href="javascript:;" ng-if="option.children.length==0"  ng-click="choseValue(option)"><i class="fa fa-file-text"></i>&nbsp;&nbsp; {{option.label}}</a>\
						        	<ul ng-show = "option.type === \'down\'">\
									<li ng-repeat="option in option.children" ng-class="{active:option.selected}">\
										<span ng-class="{false:\'notAllowed\',true:\'allowed\'}[{{option.haveValue}}]" ng-click = "changeType(option)" ng-if="option.children.length>0"><i class="fa fa-caret-{{option.type}}"></i>&nbsp;&nbsp;{{option.label}}</span>\
										<a ng-class="{false:\'notAllowed\',true:\'allowed\'}[{{option.haveValue}}]" href="javascript:;" ng-if="!option.children || option.children.length==0" ng-click="choseValue(option)"><i class="fa fa-file-text"></i>&nbsp;&nbsp; {{option.label}}</a>\
								        	<ul ng-show = "option.type === \'down\'">\
											<li ng-repeat="option in option.children" ng-class="{active:option.selected}">\
												<a ng-class="{false:\'notAllowed\',true:\'allowed\'}[{{option.haveValue}}]" href="javascript:;" ng-click="choseValue(option)"><i class="fa fa-file-text"></i>&nbsp;&nbsp;{{option.label}}</a>\
											</li>\
										</ul>\
									</li>\
								</ul>\
    						</li>\
						</ul>\
        			</li>\
        		</ul>\
        	</div>\
        	</div>',
        replace: true,
        link:function(scope,element,attrs){
        	scope.showContent = function(){
        		scope.show = true;
        	};
        	
   			scope.choseValue = function(item){
        		if( item.value && item.value!=''){
        			scope.chosedValue = {label: item.label,value: item.value};
            		scope.$root.project = item;
            		scope.show = false;

            		//将项目名称放在cookie中，这个cookie关闭浏览器就清空。类似于root单页面全局变量的意思
            		$.cookie('projectName',item.value,{path:"/"});
        		}
        		
        	};

        	scope.changeType = function(opt){
        		if(opt.type === 'down'){
        			opt.type = 'right';
        		}else{
        			opt.type = 'down';
        		}
        	}
   			
   			
        }
	}
});