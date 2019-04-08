/**
 * Created by geqimeng on 17-11-15.
 */
angular.module("infi-basic").directive('inputModal',function(){
    return {
        restrict: 'E',
        templateUrl: _CTX+'/resources/js/load/template/inputModal.html',
        replace: true
    };
})

/**
 * 待完善
 *  单选需要清除按钮,清除时需要注意事件
 *  查看详情时,打印按钮放置在页面上方,加上一模块,下一模块,去除提交按钮;没有数据的,提示暂未录入数据
 */
angular.module("infi-basic").directive('inputText',function(){
    return {
        restrict: 'E',
        template: '<div class="infi-input-box">'
        +'<div class = "infi-input-left">'
        +'<p ng-class="{\'true\':\'self-font-red\'}[input.changed]"><span ng-if="input.notNull" ng-class="{\'true\':\'self-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
        +'</div>'
        +'<div class = "infi-input-right form-group">'
        +'<div class="infi-input-opt input-group">'
        +'<input class="form-control" ng-if="input.bizName === \'基本信息_a_基本信息_a_1000\' || input.bizName === \'基本信息_a_基本信息_a_1003\'" disabled = "disabled" type="text" name="{{input.name}}" ng-model="input.value" >'
        +'<input ng-if="input.bizName !== \'基本信息_a_基本信息_a_1000\' && input.bizName !== \'基本信息_a_基本信息_a_1003\'" class="form-control" type="text" name="{{input.name}}" ng-model="input.value" >'
        +'<div ng-if="input.unit" class="input-group-addon">{{input.unit}}</div>'
        +'</div>'
        +'</div>'
        +'</div>',
        replace: true
    };
})

angular.module("infi-basic").directive('inputNumber',function(){
    return {
        restrict: 'E',
        template: '<div class="infi-input-box">'
        +'<div class = "infi-input-left">'
        +'<p ng-class="{\'true\':\'self-font-red\'}[input.changed]"><span ng-if="input.notNull" ng-class="{\'true\':\'self-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
        +'</div>'
        +'<div class = "infi-input-right form-group">'
        +'<div class="infi-input-opt input-group">'
        +'<input class="form-control" ng-if="input.bizName === \'基本信息_a_基本信息_a_1004\'" disabled = "disabled" type="text" name="{{input.name}}" ng-model="input.value" >'
        +'<input ng-if="input.bizName !== \'基本信息_a_基本信息_a_1004\'" class="form-control" type="text" name="{{input.name}}" ng-model="input.value" >'
        +'<div ng-if="input.unit" class="input-group-addon">{{input.unit}}</div>'
        +'</div>'
        +'</div>'
        +'</div>',
        replace: true
    };
})

angular.module("infi-basic").directive('inputDates',['Service',function(Service){
    return {
        restrict: 'E',
        template: '<div class="infi-input-box">'
        +'<div class = "infi-input-left">'
        +'<p ng-class="{\'true\':\'self-font-red\'}[input.changed]"><span ng-if="input.notNull" ng-class="{\'true\':\'self-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
        +'</div>'
        +'<div class = "infi-input-right">'
        +'<div class="infi-input-opt">'
        +'<label>'
        +'<input class="form-control" type="text" name="{{input.name}}" readonly="readonly"'
        +'ng-model="input.value"  ng-click="timePlugin(input.name,input.format)">'
        +'</label>'
        +'</div>'
        +'</div>'
        +'</div>',
        replace: true,
        link:function (scope,element,attrs){
            scope.timePlugin = function(name,format){
                Service.timePlugin(name,format);
            };
        }
    };
}])

angular.module("infi-basic").directive('inputRadio',function(TreeService){
    return {
        restrict: 'E',
        template: '<div class="infi-input-box">'
        +'<div class = "infi-input-left">'
        +'<p ng-class="{\'true\':\'self-font-red\'}[input.changed]"><span ng-if="input.notNull" ng-class="{\'true\':\'self-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
        +'</div>'
        +'<div class = "infi-input-right">'
        +'<div class="infi-input-opt">'
        +'<label ng-mouseleave="input.imgShow = false" class="radio-inline" ng-repeat = "opt in input.dimension.options">'
        +'<input ng-checked="opt.value === input.value" type="radio" value="{{opt.value}}" name="{{input.name}}" '
        +'ng-model="input.value" ng-change="updateChildren(input,opt.value)">{{opt.label}}'
        +'</label>'
        +'<img ng-if="input.imgId" ng-src="'+_CTX+'/resources/images/ear{{input.imgId}}.png"/>'
        +'</div>'
        +'</div>'
        +'</div>',
        replace: true,
        link:function(scope,element,attrs){

            scope.updateChildren = function(input,checkedValue){
                // 这边数据需要去standard找
                var canonicalName = TreeService.getCanonicalName(input.name);
                var standardInput = TreeService.getNode(scope.originalForm,canonicalName.name,false);
                if( standardInput && standardInput.children.length>0){
                    TreeService.removeVirtualCategoryNodes(scope,scope.currentData,input.name + '_a_');
                    for( var idx=0;idx<standardInput.children.length;idx++){
                        var vcanonicalName = input.name + '_a_' + checkedValue;
                        if( standardInput.children[idx].value == checkedValue ){
                            //TreeService.addVirtualCategoryNodes(scope.currentData,input.children[idx].children,input.name);
                            TreeService.addVirtualCategoryNodes(scope.currentData,standardInput.children[idx],vcanonicalName,input.name);
                        }
                    }
                }
            }
        }
    };
})

angular.module("infi-basic").directive('inputRadioExtend',function(){
    return {
        restrict: 'E',
        template: '<div class="infi-input-box">'
        +'<div class = "infi-input-left">'
        +'<p ng-class="{\'true\':\'self-font-red\'}[input.changed]"><span ng-if="input.notNull" ng-class="{\'true\':\'self-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
        +'</div>'
        +'<div class = "infi-input-right">'
        +'<div class="infi-input-opt">'
        +'<label class="radio-inline" ng-repeat = "opt in input.dimension.options"'
        +'ng-hide="opt.value === \'其他\' && input.value === \'其他\'">'
        +'<input ng-checked="opt.value === input.value" type="radio" value="{{opt.value}}" '
        +'name="{{input.name}}" ng-model="input.value"  >{{opt.label}}'
        +'</label>'
        +'<div class="btn-input-group" ng-show = "input.value === \'其他\'">'
        +'<label>'
        +'<input class="form-input-text" type="text" name="" placeholder="请输入其他" ng-model = "input.add">'
        +'</label>'
        +'<button class="btn btn-default btn-sm btn-append-other" style="display: inline-block;" '
        +'type="button" ng-click = "addOpt()">添加</button>'
        +'</div>'
        +'</div>'
        +'</div>'
        +'</div>',
        replace: true,
        link:function(scope,element,attrs){
            scope.addOpt = function(){
                if(scope.input.add == '' || !scope.input.add ){
                    return false;
                }
                scope.input.dimension.options.splice(scope.input.dimension.options.length-1,0,{'label':scope.input.add,'value':scope.input.add});
                scope.input.value = scope.input.add;
                scope.input.add = '';
            }
        }
    };
})

// angular.module("infi-basic").directive('inputCheckbox',function(TreeService){
//     return {
//         restrict: 'E',
//         template: '<div class="infi-input-box">'
//         +'<div class = "infi-input-left">'
//         +'<p ng-class="{\'true\':\'self-font-red\'}[input.changed]"><span ng-if="input.notNull" ng-class="{\'true\':\'self-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
//         +'</div>'
//         +'<div class = "infi-input-right">'
//         +'<div class="infi-input-opt">'
//         +'<label class="checkbox-inline" ng-repeat = "opt in input.dimension.options">'
//         +'<input  ng-checked="input.value[opt.value]===true" type="checkbox" value="{{opt.value}}" '
//         +'name="{{input.name}}" ng-model="input.value[opt.value]" ng-change="updateCheckboxChildren(input,opt.value,input.value[opt.value])">{{opt.label}}'
//         +'</label>'
//         +'</div>'
//         +'</div>'
//         +'</div>',
//         replace: true,
//         link:function(scope,element,attrs){
//             scope.updateCheckboxChildren = function(input,checkedValue,checkedType){
//
//                 // 这边数据需要去standard找
//                 var canonicalName = TreeService.getCanonicalName(input.name);
//                 var standardInput = TreeService.getNode(scope.originalForm,canonicalName.name,false);
//                 if( standardInput && standardInput.children.length>0){
//                     if(!checkedType){
//                         TreeService.removeVirtualCategoryNodes(scope,scope.currentData,input.name + '_a_'+checkedValue);
//
//                     } else{
//                         for( var idx=0;idx<standardInput.children.length;idx++){
//                             var vcanonicalName = input.name + '_a_' + checkedValue;
//                             if( standardInput.children[idx].value == checkedValue ){
//                                 //TreeService.addVirtualCategoryNodes(scope.currentData,input.children[idx].children,input.name);
//                                 TreeService.addVirtualCategoryNodes(scope.currentData,standardInput.children[idx],vcanonicalName,input.name);
//                             }
//                         }
//                     }
//
//                 }
//             }
//         }
//     };
// })

angular.module("infi-basic").directive('inputCheckboxExtend',function(){
    return {
        restrict: 'E',
        template: '<div class="infi-input-box">'
        +'<div class = "infi-input-left">'
        +'<p ng-class="{\'true\':\'self-font-red\'}[input.changed]"><span ng-if="input.notNull" ng-class="{\'true\':\'self-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
        +'</div>'
        +'<div class = "infi-input-right">'
        +'<div class="infi-input-opt">'
        +'<label class="checkbox-inline" ng-repeat = "opt in input.dimension.options" '
        +'ng-hide="opt.value === \'其他\' && input.value[\'其他\'] ">'
        +'<input ng-checked="input.value[opt.value]===true" type="checkbox" value="{{opt.value}}" '
        +'name="{{input.name}}" ng-model="input.value[opt.value]"  >{{opt.label}}'
        +'</label>'
        +'<div class="btn-input-group" ng-show = "input.value[\'其他\']">'
        +'<label>'
        +'<input class="form-input-text" type="text" name="" placeholder="请输入其他" '
        +'ng-model = "input.add">'
        +'</label>'
        +'<button class="btn btn-default btn-sm btn-append-other" style="display: inline-block;" '
        +'type="button" ng-click = "addOpt()">添加</button>'
        +'</div>'
        +'</div>'
        +'</div>'
        +'</div>',
        replace: true,
        link:function(scope,element,attrs){
            scope.addOpt = function(){
                if(scope.input.add == '' || !scope.input.add){
                    return false;
                }
                // zjl_debug 这边顺序有问题
                scope.input.dimension.options.splice(scope.input.dimension.options.length-1,0,{'label':scope.input.add,'value':scope.input.add});
                scope.input.value[scope.input.add] = true;
                scope.input.value['其他'] =false;
                delete scope.input.value.other;
                scope.input.add = '';
            }
        }
    };
})

angular.module("infi-basic").directive('inputTextarea',function(){
    return {
        restrict: 'E',
        template: '<div class="infi-input-box">'
        +'<div class = "infi-input-left">'
        +'<p ng-class="{\'true\':\'self-font-red\'}[input.changed]"><span ng-if="input.notNull" ng-class="{\'true\':\'self-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
        +'</div>'
        +'<div class = "infi-input-right">'
        +'<div class="infi-input-opt">'
        +'<label class="">'
        +'<textarea class="form-control" ng-model="input.value" name="{{input.name}}"  ></textarea>'
        +'</label>'
        +'</div>'
        +'</div>'
        +'</div>',
        replace: true
    };
})

angular.module("infi-basic").directive('appendMore',function(TreeService){
    return {
        restrict: 'E',
        template: '<div class="infi-m-btn">'
        +'<button class="btn btn-primary btn-append-more" style="display: inline-block;" '
        +'type="button" ng-click = "addVirtualCategory(input,$index)">添加</button>'
        //	+'<button class="btn btn-primary" style="display: inline-block;" type="button" ng-click = "deleteVirtualCateory(input,$index)">删除当前</button>'
        +'</div>',
        replace: true,
        link:function(scope,element,attrs){

            scope.addVirtualCategory = function(category,index){
                TreeService.addCategory(scope,scope.currentData,scope.originalForm,category);
                return ;
            }

            scope.deleteVirtualCateory = function(category,index){
                var parent = TreeService.getNode(scope.currentData,category.parent,false);
                parent.children.splice(index,1,null);
            }
        }
    };
})

angular.module("infi-basic").directive('affix',function($http,Service){
    return {
        restrict: 'E',
        template: '<div id="affix" class="affix-nav" role="complementary">'
        +'<ul id="affix-nav" class="nav " role="tablist">'
        +'<li class="infi-nav-outside {{model.showNav}}" ng-repeat = "model in navigates">'
        +'<a style="padding-right: 0px;" href="#{{model.name}}" ng-click = "showNav(model)"><span ng-if="model.hasNecessary" ng-class="{\'true\':\'self-font-red\'}[model.hasNecessary]">*</span>{{model.label}}</a>'
        +'<ul class="infi-nav-inside">'
        +'<li ng-class="{true:\'active\',false:\'\'}[currModuleName === theme.name]" ng-repeat = "theme in model.children" ng-click = "changeModel(theme.name)">'
        +'<a style="padding-right: 0px;" href="#{{theme.name}}"><span ng-if="theme.hasNecessary" ng-class="{\'true\':\'self-font-red\'}[theme.hasNecessary]">*</span>{{theme.label}}</a>'
        +'</li>'
        +'</ul>'
        +'</li>'
        +'</ul>'
        +'</div>',
        replace: true,
        link:function(scope,element,attrs){
            // zjl_debug 这边需要默认展开第一个
            scope.showNav = function(model){
                scope.navigates.forEach(function(n,i){
                    n.showNav = '';
                })
                model.showNav = 'showChildLi';
            }

            scope.changeModel = function(module){
                scope.saveModule();
                scope.updateModuleForm(module);

                /*if(!scope.necessary.hasNecessary){
                 scope.updateModuleForm(module);
                 }*/
            }
        }
    };
})

angular.module("infi-basic").directive('inputScale',function($http){
    return {
        restrict: 'E',
        template: '<div class="infi-input-box">'
        +'<div class = "infi-input-left">'
        +'<p ng-class="{\'true\':\'self-font-red\'}[input.changed]"><span ng-if="input.notNull" ng-class="{\'true\':\'self-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
        +'</div>'
        +'<div class = "infi-input-right form-group">'
        +'<div class="infi-input-opt input-group">'
        +'<input class="form-control" type="text" name="{{input.name}}" ng-model="input.tip" '
        +'readonly="readonly" ng-click="scaleModal(input)">'
        +'</div>'
        +'</div>'
        +'</div>',
        replace: true,
        link:function(scope,element,attrs){

        }
    };
})

angular.module("infi-basic").directive('inputHyperlink',function($http){
    return {
        restrict: 'E',
        template: '<div class="infi-input-box">'
        +'<div class = "infi-input-left">'
        +'<p ng-class="{\'true\':\'self-font-red\'}[input.changed]"><span ng-if="input.notNull" ng-class="{\'true\':\'self-font-red\'}[input.notNull]">*</span>{{input.label}}：</p>'
        +'</div>'
        +'<div class = "infi-input-right form-group">'
        +'<div class="infi-input-opt input-group">'
        +'<input class="form-control" type="text" name="{{input.name}}" value="{{input.showVal}}"'
        +'readonly="readonly" ng-click="choseHospital(input)">'
        +'</div>'
        +'</div>'
        +'</div>',
        replace: true,
        link:function(scope,element,attrs){
        }
    }
})

angular.module("infi-basic").directive('hospitalModal',function($http){
    return {
        restrict: 'E',
        template: '<div class="modal fade" id="infi-u-hospital">'
        +'<div class="modal-dialog modal-lg">'
        +'<div class="self-modal box-hospital ui-draggable ui-draggable-handle" style="margin: 0 auto;">'
        +'<div class="title">'
        +'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
        +'请选择'
        +'<ul>'
        +'<li ng-repeat = "input in hospitals.input.val" style={border:1px solid #11e}>{{input}}</li>'
        +'</ul>'
        +'</div>'
        +'<div class="part">'
        +'<div class="self-box-hospital">'
        +'<table>'
        +'<tbody>'
        +'<tr>'
        +'<td class="city">'
        +'<span  ng-repeat = "opt in hospitals.cities" style="width: auto;"><span style="width: auto;" '
        +'ng-class="{true:\'active\',false:\'\'}[opt.selected]" ng-click = "changeSubject(opt)">{{opt.label}}</span></span>'
        +'</td>'
        +'</tr>'

        +'<tr>'
        +'<td class="hospital">'
        +'<span ng-repeat = "hospital in hospitals.selectedHospitals" '
        +'style="cursor: pointer;display: inline-block;float: left;margin-top: 10px;margin-right: 20px; width: auto;" '
        +' ng-click="chose(hospital)" class="{{hospital.underline}}">{{hospital.label}}'
        +'</span>'
        +'</td>'
        +'</tr>'
        +'</tbody>'
        +'</table>'
        +'</div>'
        +'</div>'
        +'<div class="footer clearfix">'
        +'<input ng-if="scaleData.showWarning == true" id="scale" class="btn btn-fix infi-btn-primary btn-submit" '
        +'type="button" disabled="disabled" value="提交">'
        +'<input ng-if="scaleData.showWarning == false" id="scale" class="btn btn-fix infi-btn-primary btn-submit" '
        +'type="button" value="提交" ng-click = "saveScale()">'
        +'<button type="button" class="btn btn-success btn-xs self-radius self-btn-sm pull-right" data-dismiss="modal" ng-click = "saveHospital(hospitals.input)">确定</button>'
        +'<button class="btn btn-default btn-xs self-radius self-btn-sm pull-right" data-dismiss="modal" type="button">关闭</button>'
        +'</div>'
        +'</div><!-- /.modal-content -->'
        +'</div><!-- /.modal-dialog -->'
        +'</div>',
        replace: true,
        link:function(scope,element,attrs){
            scope.changeSubject = function(item){
                unselected(item);
                filter(item);
            }

            scope.chose = function(item){
                if(scope.hospitals.single){
                    scope.hospitals.input.value = item.label;
                    scope.hospitals.input.number = item.number;
                    $('#infi-u-hospital').modal('hide');
                    return false;
                }
                for(var index in scope.hospitals.input.val){
                    if(item.label === scope.hospitals.input.val[index]){
                        scope.hospitals.input.val.splice(index,1);
                        delete scope.hospitals.input[item.label];
                        item.underline = '';
                        return false;
                    };
                };
                item.underline = 'underline';
                scope.hospitals.input.val.push(item.label);
                scope.hospitals.input.value[item.label] = true;
                //$('#infi-u-hospital').modal('hide');
            }

            scope.saveHospital = function(input){
                input.showVal = '';
                input.val.forEach(function(n,i){
                    i===0?input.showVal += n:input.showVal += ','+n;
                });
            }

            function unselected(item){
                var items = scope.hospitals.cities;
                for( var idx=0;idx<items.length;idx++ ){
                    items[idx].selected = items[idx].label == item.label;
                }
            }

            function filter(parent){
                var hospitals = scope.hospitals.hospitals;
                var selected = [];
                for( var idx=0;idx<hospitals.length;idx++ ){
                    if( parent.label == hospitals[idx].parent){
                        selected.push(hospitals[idx]);
                    }
                }
                scope.hospitals.selectedHospitals = selected;
            }
        }
    };
})

angular.module("infi-basic").directive('modalRecordId',function(){
    return {
        restrict: 'E',
        template: '<div class="modal fade" id="infi-u-inputs">'
        +'<div class="modal-dialog modal-lg">'
        +' <div class="self-modal" style="width:800px;">'
        +'	  <div class="title">'
        +'       <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
        +'       新建病历信息'
        +'     </div>'
        +'    <div class="part">'
        +'    	<form id="mainForm" class="form-inline" method="post">'
        +'		 <div class="infi-box">'
        +'			<div class="alert alert-danger" role="alert" ng-if = "showWarning && showWarning!==null">请填写{{showWarning}} ！！！</div>'
        +'			<div class="infi-box-containter">'
        +'				<div class="form-group" ng-repeat = "input in recordId">'
        +'					<!-- text类型的input -->'
        +'					<div  ng-if="input.type===\'text\' || input.type===\'hyperlink\'" ng-class="{true:\'checkForm\',false:\'\'}[{{input.isRequired}}]">'
        +'						<label for="{{input.name}}">{{input.label}}'
        +'							<i ng-show="input.isRequired === true" class="glyphicon glyphicon-asterisk"></i>：'
        +'						</label>'
        +'						<input ng-if="input.type===\'hyperlink\'" class="form-control" type="text" name="{{input.name}}" ng-model="input.value" readonly="readonly" ng-click="choseHospital(input)">'
        +'						<input ng-if="input.type===\'text\'" class="form-control" type="text" value="{{input.value}}" name="{{input.name}}" ng-model = "input.value">'
        +'					</div>'
        +'				</div>'
        +'			</div>'
        +'		 </div>'
        +'		</form>'
        +'      </div>'
        +'		<div class="footer clearfix">'
        +'			<button type="button" class="btn btn-default btn-xs self-radius self-btn-sm pull-right" data-dismiss="modal">关闭</button>'
        +'			<button class="btn btn-success btn-xs self-radius self-btn-sm pull-right" ng-click="newRecord()" type="button">保存</button>'
        +'		</div>'
        +'  </div><!-- /.modal-content -->'
        +'</div><!-- /.modal-dialog -->'
        +'</div><!-- /.modal -->',
        replace: true,
        link:function(scope,element,attrs){

        }
    };
});

angular.module("infi-basic").directive('currentState',function(){
    return {
        restrict: 'ECMA',
        template: '<span ng-if="opt.recordNumber">'
        +'<span ng-if="opt.status === \'newed\'" class="">已保存</span>'
        +'<span ng-if="opt.status === \'pre_audit\'" class="self-font-blue">待审核</span>'
        +'<span ng-if="opt.status === \'audit_pass\'" class="self-font-green">审核通过</span>'
        +'<span ng-if="opt.status === \'audit_reject\'" class="self-font-red">审核驳回</span>'
        +'<span ng-if="opt.status === \'audit_pass_saved\'" class="">已保存</span>'
        +'<span ng-if="opt.status === \'audit_pass_pre\'" class="self-font-blue">待审核</span>'
        +'<span ng-if="opt.status === \'deleted\'" class="self-font-red-l">已删除</span>'
        +'<span ng-if="opt.status === \'audit_pass_reject\'" class="self-font-red">审核驳回</span>'
        +'</span>'
        +'<span ng-if="!opt.recordNumber">'
        +'<span ng-if="opt.status === \'EXTRACT_DOWNLOADED\'" class="self-font-cyan">已下载</span>'
        +'<span ng-if="opt.status === \'AUDIT_PRE\'" class="self-font-blue">待审核</span>'
        +'<span ng-if="opt.status === \'AUDIT_PASSED\'" class="self-font-blue">审核通过</span>'
        +'<span ng-if="opt.status === \'AUDIT_REJECT\'" class="self-font-red">审核驳回</span>'
        +'<span ng-if="opt.status === \'EXTRACTING\'" class="self-font-green">数据提取中</span>'
        +'<span ng-if="opt.status === \'EXTRACT_FAILED\'" class="self-font-red-l">数据提取失败</span>'
        +'<span ng-if="opt.status === \'EXTRACT_SUCCESS\'" class="self-font-green">数据提取成功</span>'
        +'</span>',
        link:function(scope,element,attrs){

        }
    }
})

//这个directive用于监听历史信息是否渲染完毕
angular.module("infi-basic").directive('repeatHistoryFinish',function($timeout){
    return {
        restrict: 'ECMA',
        link:function(scope,element,attrs){
            if(scope.$last == true){
                $timeout(function() {
                    scope.$emit( 'renderOverHistory' );
                });
            }
        }
    }
})

//必选提示模态框
angular.module("infi-basic").directive('modalNecessary',function(){
    return {
        restrict: 'E',
        scope:{
            necessary : '='
        },
        template: '<div class="modal fade in" id="necessary">'
        +'<div class="modal-dialog">'
        +' <div class="self-modal">'
        +'	  <div class="title">'
        +'       <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
        +'       提示：填写完当前模块所有必选项才能够保存或者切换!'
        +'     </div>'
        +'     <div class="part">'
        +'			<p ng-bind="necessary.necessaryTip" class="self-font-red"></p>'
        +'      </div>'
        +'		<div class="footer clearfix bootstrapFooterFix" style="height:auto;">'
        +'			<button type="button" class="btn btn-default btn-xs self-radius self-btn-sm pull-right" data-dismiss="modal">关闭</button>'
        +'		</div>'
        +'  </div><!-- /.modal-content -->'
        +'</div><!-- /.modal-dialog -->'
        +'</div><!-- /.modal -->',
        replace: true,
        link:function(scope,element,attrs){

        }
    };
});
