angular.module("infi-basic").directive('crfInputTemplate',function(){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        templateUrl: './html/crf.input.template.html',
        replace: true
    };
});


angular.module("infi-basic").directive('crfInputText',[function(){
    return {
        restrict: 'ECMA',
        scope:{
            input : '='
        },
        template: '<div class="infi-input-box">'
        +'<div class = "infi-input-left">'
        +'<p class="infi-font-red">'
        +'<span ng-if="input.required" class="infi-font-red">*</span>'
        +'<span ng-bind="input.name" class="{{input.write}}" ng-class="{true:\'orange\'}[input.defaultVal !== input.value]"></span>'
        +'<a ng-show="input.prompt && input.prompt != null &&input.prompt != \'\'" tabindex="0" type="button" role="button" class="prompt glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="top" data-content="{{input.prompt}}"></a>'
        +'</p>'
        +'</div>'
        +'<div class = "infi-input-right form-group">'
        +'<div class="infi-input-opt input-group">'
        +'<input ng-disabled="input.name==\'基本信息_a_基本信息_a_1000\' || input.name==\'基本信息_a_基本信息_a_1003\'|| input.name==\'基本信息_a_基本信息_a_1004\'" class="form-control" type="text" name="{{input.name}}" ng-model="input.value" >'
        +'<div ng-if="input.unit" class="input-group-addon" ng-bind="input.unit"></div>'
        +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
        +'</div>'
        +'</div>'
        +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            $('.glyphicon-question-sign',element).popover()
        }
    };
}]);

angular.module("infi-basic").directive('crfInputRadio',['groupServices',function(groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        template: '<div class="infi-input-box">'
        +'<div class = "infi-input-left">'
        +'<p class="infi-font-red">'
        +'<span ng-if="input.required" class="infi-font-red">*</span>'
        +'<span ng-bind="input.name" class="{{input.write}}" ng-class="{true:\'orange\'}[input.defaultVal !== input.value]"></span>'
        +'<a ng-show="input.prompt && input.prompt != null &&input.prompt != \'\'" tabindex="0" type="button" role="button" class="prompt glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="top" data-content="{{input.prompt}}"></a>'
        +'</p>'
        +'</div>'
        +'<div class = "infi-input-right">'
        +'<div class="infi-input-opt">'
        +'<ul>'
        +'<li ng-repeat = "input in valueList">'
        +'<label class="radio-inline">'
        +'<input ng-checked="value == input" ng-click="changeChecked(input)"  type="radio" value="{{input.value}}" name="{{input}}"'
        +'>{{input}}'
        +'</label>'
        +'</li>'
        +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
        +'</ul>'
        +'</div>'
        +'</div>'
        +'</div>',
        replace : true,
        link:function(scope,element){
            $('.glyphicon-question-sign',element).popover();
            scope.valueList = scope.input.valueList.split('，');
            scope.changeChecked = function (value) {
                scope.value = value;
            }
        }
    };
}]);

angular.module("infi-basic").directive('crfInputRadioExtend',['groupServices',function(groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        template: '<div class="infi-input-box">'
        +'<div class = "infi-input-left">'
        +'<p class="infi-font-red">'
        +'<span ng-if="input.required" class="infi-font-red">*</span>'
        +'<span ng-bind="input.name"></span>'
        +'</p>'
        +'</div>'
        +'<div class = "infi-input-right">'
        +'<div class="infi-input-opt">'
        +'<ul>'
        +'<li ng-repeat = "item in valueList">'
        +'<label class="radio-inline">'
        +'<input ng-checked="value == item" type="radio" value="{{item}}" name="{{item}}"'
        +'ng-click="changeChecked(item)" >{{item}}'
        +'</label>'
        +'</li>'
        +'<li class="">'
        +'<label>'
        +'<input class="form-control radio-input" type="text" name="" placeholder="请输入其他">'
        +'</label>'
        +'<button class="btn btn-default btn-sm" type="button" ng-click = "addExtendOpt()">添加</button>'
        +'</li>'
        +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
        +'</ul>'
        +'</div>'
        +'</div>'
        +'</div>',
        replace : true,
        link:function(scope,element){
            $('.glyphicon-question-sign',element).popover();
            scope.valueList = scope.input.valueList.split('，');
            scope.changeChecked = function (value) {
                scope.value = value;
            }
            scope.addExtendOpt = function () {
                $('<input class="form-control radio-input"  type="text" name="" placeholder="请输入其他">').insertAfter('.radio-input:last');
            }
        }
    };
}]);

angular.module("infi-basic").directive('crfInputCheckbox',['groupServices',function(groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        template: '<div class="infi-input-box">'
        +'<div class = "infi-input-left">'
        +'<p class="infi-font-red">'
        +'<span ng-if="input.required" class="infi-font-red">*</span>'
        +'<span ng-bind="input.name"></span>'
        +'</p>'
        +'</div>'
        +'<div class = "infi-input-right">'
        +'<div class="infi-input-opt">'
        +'<ul>'
        +'<li ng-repeat = "input in valueList">'
        +'<label class="checkbox-inline">'
        +'<input type="checkbox" value="{{input}}" name="{{input}}"'
        +'">{{input}}'
        +'</label>'
        +'</li>'
        +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
        +'</ul>'
        +'</div>'
        +'</div>'
        +'</div>',
        replace : true,
        link:function(scope,element){
            $('.glyphicon-question-sign',element).popover();
           scope.valueList = scope.input.valueList.split('，');
        }
    };
}]);

angular.module("infi-basic").directive('crfInputCheckboxExtend',['groupServices',function(groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        template: '<div class="infi-input-box">'
        +'<div class = "infi-input-left">'
        +'<p class="infi-font-red">'
        +'<span ng-if="input.required" class="infi-font-red">*</span>'
        +'<span ng-bind="input.name"></span>'
        +'</p>'
        +'</div>'
        +'<div class = "infi-input-right">'
        +'<div class="infi-input-opt">'
        +'<ul>'
        +'<li ng-repeat = "item in valueList">'
        +'<label class="checkbox-inline">'
        +'<input type="checkbox" value="item" name="item"'
        +'>{{item}}'
        +'</label>'
        +'</li>'
        +'<li class="">'
        +'<label>'
        +'<input class="form-control checkbox-input" type="text" name="" placeholder="请输入其他" ng-model = "input.extendValue">'
        +'</label>'
        +'<button class="btn btn-default btn-sm" type="button" ng-click = "addCheckboxExtendOpt()">添加</button>'
        +'</li>'
        +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
        +'</ul>'
        +'</div>'
        +'</div>'
        +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            scope.valueList = scope.input.valueList.split('，');
            $('.glyphicon-question-sign',element).popover();
            scope.addCheckboxExtendOpt = function () {
                $('<input class="form-control checkbox-input"  type="text" name="" placeholder="请输入其他">').insertAfter('.checkbox-input:last');
            }
        }
    };
}]);

angular.module("infi-basic").directive('crfInputTextarea',[function(){
    return {
        restrict: 'ECMA',
        scope:{
            input : '='
        },
        template: '<div class="infi-input-box">'
        +'<div class = "infi-input-left">'
        +'<p class="infi-font-red">'
        +'<span ng-if="input.required" class="infi-font-red">*</span>'
        +'<span ng-bind="input.name"></span>'
        +'</p>'
        +'</div>'
        +'<div class = "infi-input-right">'
        +'<div class="infi-input-opt">'
        +'<label class="">'
        +'<textarea class="form-control" ng-model="input.value" name="{{input.name}}" ></textarea>'
        +'</label>'
        +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
        +'</div>'
        +'</div>'
        +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            $('.glyphicon-question-sign',element).popover()
        }
    };
}]);
angular.module("infi-basic").directive('crfInputDate',['groupServices',function(groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '='
        },
        template: '<div class="infi-input-box">'
        +'<div class = "infi-input-left">'
        +'<p class="infi-font-red">'
        +'<span ng-if="input.required" class="infi-font-red">*</span>'
        +'<span ng-bind="input.name"></span>'
        +'</p>'
        +'</div>'
        +'<div class = "infi-input-right">'
        +'<div class="infi-input-opt">'
        +'<label>'
        +'<input class="form-control" type="date" '
        +'ng-model="input.value">'
        +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
        +'</label>'
        +'</div>'
        +'</div>'
        +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            $('.glyphicon-question-sign',element).popover()
        }
    };
}]);