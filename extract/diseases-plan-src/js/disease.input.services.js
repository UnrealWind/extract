angular.module('infi-basic').
	service('DiseaseInputServices'
	,['$http','SYS','groupServices',function($http,SYS,groupServices){
	
	this.getDetail = function(currentData,$routeParams){
		return $http({
            'url':SYS.url+$routeParams.type+'/patient/info?filter_patiId='+$routeParams.pati_id+'&filter_patiVisitId='+$routeParams.pati_visit_id+'&class_id='+$routeParams.class_id,
            //'url':'../diseases-plan-src/data/diseaseInput'+$routeParams.class_id+'.json',
            'method':'get'
        }).then(function success(msg){

        	var detailData = msg.data;

        	//由于其强行需要对慢阻肺的加重期稳定器进行互斥关系的验证，所以在这个地方对这两个数据进行强行验证。使其具备初始的互斥关系
            (function judgeSpecial(){
                !detailData.info['wdq_type'] && !detailData.info['jzq_class']?
                    detailData.info['wdq_type'] ='1':undefined;
            })();
            if(currentData != ''){
                currentData.forEach(function(n,i){
                    initData(n.data);
                    initDatas(n.data);
                });

            }
            function initData(arr){
                arr.forEach(function(ny,iy){
                    ny['write'] = 'default';
                    ny.defaultVal = ny.value;
                    if(detailData && detailData.info[ny.name]&& detailData.info[ny.name] !== ''){
                        ny.defaultVal = ny.value = detailData.info[ny.name];
                        ny.value =='1' && ny.type =="开关"?ny.switchChecked = 'checked':undefined;
                        ny['hasVal'] = true;
                    }

                    detailData.message && detailData.message!==null&& detailData.message[ny.name+'_info']?
                        ny.prompt = detailData.message[ny.name+'_info']:undefined;

                    detailData.status[ny.name+'_status'] && detailData.status[ny.name+'_status'] == '1'?ny['write'] = 'green':undefined;
                    ny.children&& ny.children.length>0?initData(ny.children):undefined;

                });
            }

            function initDatas(arr){
                arr.forEach(function(ny,iy){

                    //非0且有children，则直接调用原有的click方法进行操作，模拟用户点击
                    if(ny.children&& ny.children.length>0){
                        groupServices.updateChildren(ny.value,ny,arr);
                    }

                    ny.children&& ny.children.length>0?initDatas(ny.children):undefined;
                });
            }

            return currentData;
        });
	}

	this.saveDetail = function(opt,$routeParams){
		opt['pati_id'] = $routeParams.pati_id;
        opt['pati_visit_id'] = $routeParams.pati_visit_id;

		return $http({
            'url':'',
            'method':'put',
            'data':opt
        }).then(function success(msg){
        	return msg
        });
	}
}]); 


angular.module("infi-basic").directive('inputPlanTemplate',function(){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        templateUrl: './html/input.template.html',
        replace: true
    };
});


angular.module("infi-basic").directive('inputSwitchSpecial',['groupServices',function(groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        template: '<div class="infi-input-box">'
                        +'<div class = "infi-input-left">'
                            +'<p class="infi-font-red">'
                                +'<span ng-if="input.notNull" class="infi-font-red">*</span>'
                                +'<span ng-bind="input.label" class="{{input.write}}" ng-class="{true:\'orange\'}[input.defaultVal != input.value]"></span>'
                                +'<a ng-show="input.prompt && input.prompt != null &&input.prompt != \'\'" tabindex="0" type="button" role="button" class="prompt glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="top" data-content="{{input.prompt}}"></a>'
                            +'</p>'
                        +'</div>'
                        +'<div class = "infi-input-right">'
                            +'<div class="infi-input-opt">'
                                +'<label class="ui-switch">'
                                    +'<span ng-class="{true:\'active\'}[input.switchChecked == \'checked\']"></span>'
                                    +'<input name="{{input.name}}" class="hide" ng-click="changeValSpecial(input)" type="checkbox" ng-checked="input.switchChecked == \'checked\'">'
                                +'</label>'
                            +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            scope.changeValSpecial = function(input){

                //这里之所以这么写是因为业务混淆了单选与开关的定义，开关只有是否之分，但是业务却
                //希望其是否的意义上累加单选选项中的选项意义以及互斥关系，十分坑爹。
                //后人请警醒，
                if(input.value == "0" &&(input.name == 'xlsc_type'||input.name == 'if_hmxxlsc'
                        ||input.name == 'if_sgnbq_under'||input.name == 'if_sgnbq_over')){
                    judgeSpecil(scope.parent,input.name);
                }

                input.value == "0"?input.value = "1":input.value = "0";
                input.switchChecked == 'checked'?input.switchChecked = '':input.switchChecked = 'checked';
                groupServices.updateChildren(input.value,scope.input,scope.parent);

            }

            //...谁有闲心优化就优化吧，，
            function judgeSpecil(arr,tagName){
                for(var i= arr.length-1;i>=0;i--){

                    //  ||arr[i].name == 'if_sgnbq_under'||arr[i].name == 'if_sgnbq_over'
                    //本身按钮需要重置他们的值和状态通过默认时间达成互斥的形态
                    if(tagName == 'xlsc_type'||tagName == 'if_hmxxlsc'){
                        if(arr[i].name && (arr[i].name == 'xlsc_type'||arr[i].name == 'if_hmxxlsc')){
                            arr[i].value = 0;
                            arr[i].switchChecked = '';
                        }

                        //含有是虚拟菜单的，去找children中是否含有对应的表单
                        if(arr[i].type && arr[i].type == "虚拟菜单"){
                            judgeSpecil(arr[i].children,tagName);
                        }

                        if(arr[i].type == "虚拟菜单" && (arr[i].name == 'xlsc_type_a_1'||arr[i].name == 'if_hmxxlsc_a_1')){
                            arr.splice(i,1);
                        }
                    }else if(tagName == 'if_sgnbq_under'||tagName == 'if_sgnbq_over'){
                        if(arr[i].name && (arr[i].name == 'if_sgnbq_under'||arr[i].name == 'if_sgnbq_over')){
                            arr[i].value = 0;
                            arr[i].switchChecked = '';
                        }

                        //含有是虚拟菜单的，去找children中是否含有对应的表单
                        if(arr[i].type && arr[i].type == "虚拟菜单"){
                            judgeSpecil(arr[i].children,tagName);
                        }

                        if(arr[i].type == "虚拟菜单" && (arr[i].name == 'if_sgnbq_under_a_1'||arr[i].name == 'if_sgnbq_over_a_1')){
                            arr.splice(i,1);
                        }
                    }

                }
            }

            $('.glyphicon-question-sign',element).popover();
        }
    };
}]);

angular.module("infi-basic").directive('inputSelectSpecial',['groupServices',function(groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        template: '<div class="infi-input-box">'
                    +'<div class = "infi-input-left">'
                        +'<p class="infi-font-red">'
                        +'<span ng-if="input.notNull" class="infi-font-red">*</span>'
                        +'<span ng-bind="input.label" class="{{input.write}}" ng-class="{true:\'orange\'}[input.defaultVal !== input.value]"></span>'
                        +'<a ng-show="input.prompt && input.prompt != null &&input.prompt != \'\'" tabindex="0" type="button" role="button" class="prompt glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="top" data-content="{{input.prompt}}"></a>'
                        +'</p>'
                    +'</div>'
                    +'<div class = "infi-input-right form-group">'
                        +'<div class="infi-input-opt input-group">'
                            +'<select ng-model="input.value" class="form-control" ng-change="changeValSpecial(input)">'
                            +'<option  ng-checked="input.value == option.value" ng-repeat="option in input.dimension.options" value="{{option.value}}">{{option.label}}</option>'
                            +'</select>'
                        +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){

            scope.changeValSpecial = function(input){
                if(input.name == 'wdq_type' ||input.name == 'jzq_class'){
                    judgeOriSpecial(scope.parent,input);

                }

            }

            //新特例，在第一级别也存在了互斥关系，而且还不是开关按钮，以及默认选中关系
            // 再次声明，后人如果有不幸接了这个需求的，我也是没有办法
            //确实可以根据工厂模式进行条理性的实现，但是时间上并不允许，而且实在是太折腾人了，就这样吧
            //这个样子的话对初始化的要求会比较高需要直接确定其初始的互斥关系
            function judgeOriSpecial(arr,tagInput) {
                if(tagInput.name == 'wdq_type' && tagInput.value !=='0'){
                    arr.forEach(function (n,i) {
                        n.name == 'jzq_class'?n.value = '0':undefined;
                    })
                } else if(tagInput.name == 'jzq_class' && tagInput.value !=='0'){
                    arr.forEach(function (n,i) {
                        n.name == 'wdq_type'?n.value = '0':undefined;
                    })
                }

            }

            $('.glyphicon-question-sign',element).popover();
        }
    };
}]);