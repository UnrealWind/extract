angular.module("infi-basic").directive('inputTemplate',function(){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        templateUrl: './form/basic-template/input.template.html',
        replace: true,
        link: function(scope) {
        }
    };
});

angular.module("infi-basic").directive('inputDetailTemplate',function(){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        templateUrl: './form/basic-template/input.detail.template.html',
        replace: true
    };
});

// 需要公式计算的 inputCalc
angular.module("infi-basic").directive('inputTextCalc',['Utils', function(Utils){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: "="
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
                                +`<input ng-readonly="input.name == '肺功能检查_a_检查内容_a_38' || input.name == '肺功能检查_a_检查内容_a_43'" class="form-control" type="text" name="{{input.name}}" ng-change="calc(input.formulaName)()" ng-model="input.value" >`
                                +'<div ng-if="input.unit" class="input-group-addon" ng-bind="input.unit"></div>'
                                +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
                            +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            $('.glyphicon-question-sign',element).popover()

            // 计算公式对照表
            var formulaMap = {
                // 计算 BMI
                'BMI': function() {
                    if(scope.parent[5].value && scope.parent[4].value && scope.parent[5].value > 0 && scope.parent[5].value > 0) {
                        var rst = scope.parent[5].value / Math.pow(scope.parent[4].value / 100, 2)
                        // BMI 赋值
                        scope.parent[6].value = Utils.fixedRound(rst, 2)
                    } else {
                        scope.parent[6].value = ''
                    }
                },
                // 计算 FEV1%pred
                "FEV1%pred": function() {
                    if(scope.parent[0].value && scope.parent[1].value && scope.parent[0].value > 0 && scope.parent[1].value > 0) {
                        var rst = scope.parent[1].value / scope.parent[0].value * 100
                        scope.parent[2].value = Utils.fixedRound(rst, 2)
                    } else {
                        scope.parent[2].value = ''
                    }

                    formulaMap['GOLD分级']()
                },
                'FEV1/FVC实测值': function() {
                    if(scope.parent[1].value && scope.parent[3].value && scope.parent[1].value > 0 && scope.parent[3].value > 0) {
                        var rst = scope.parent[1].value / scope.parent[3].value * 100
                        scope.parent[4].value = Utils.fixedRound(rst, 2)
                    } else {
                        scope.parent[4].value = null
                        scope.parent[6].value = null
                    }

                    formulaMap['GOLD分级']()

                },
                'GOLD分级': function() {
                    if (scope.parent[4].value && scope.parent[4].value < 70) {
                        var rstTxt = null

                        if(scope.parent[2].value && scope.parent[2].value > 0) {
                            switch (true) {
                                case +scope.parent[2].value >= 80:
                                    rstTxt = 'GOLD 1 轻度'
                                    break
                                case +scope.parent[2].value >= 50:
                                    rstTxt = 'GOLD 2 中度'
                                    break
                                case +scope.parent[2].value >= 30:
                                    rstTxt = 'GOLD 3 重度'
                                    break
                                case +scope.parent[2].value >= 0:
                                    rstTxt = 'GOLD 4 非常重度'
                                    break
                            }

                            scope.parent[6].value = rstTxt
                        } else {
                            scope.parent[6].value = null
                        }
                    } else if(scope.parent[4].value && scope.parent[4].value >= 70) {
                        scope.parent[6].value = '正常'
                    }
                }
            }

            /**
             * 真实计算方法
             * @param formulas 公式名称
             */
            scope.calc = function(formula) {
                var formulas = formula.split(',')
                formulas.forEach(function(e, i) {
                    formulaMap[e]()
                })
            }
        }
    };
}]);




// 普通文本
angular.module("infi-basic").directive('inputText',[function(){
    return {
        restrict: 'ECMA',
        scope:{
            input : '='
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
                                +`<input ng-readonly="input.name=='基本资料_a_7' || input.name== '肺功能检查_a_检查内容_a_82'" class="form-control" type="text" name="{{input.name}}" ng-model="input.value" >`
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

angular.module("infi-basic").directive('scaleScore',['formServices','SYS',function(formServices,SYS){
    return {
        restrict: 'ECMA',
        scope:{
            input : '='
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
        +'<input readonly="readonly" class="form-control" type="text" name="{{input.name}}" ng-model="input.value" ><button style="position: absolute;margin-left:10px;" class="btn btn-primary" ng-click="saveScale()">计算评分</button>'
        +'<div ng-if="input.unit" class="input-group-addon" ng-bind="input.unit"></div>'
        +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
        +'</div>'
        +'</div>'
        +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            $('.glyphicon-question-sign',element).popover();
            var $scope = scope.$parent.$parent.$parent.$parent.$parent;
            scope.saveScale = function () {
                formServices.saveScale($scope,SYS.url+'crf/template/'+$scope.currentModule.templateId+'/score').then(function (msg) {
                    scope.input.value = msg.data.data;
                })
            }
        }
    };
}]);


angular.module("infi-basic").directive('inputTextDouble',[function(){
    return {
        restrict: 'ECMA',
        scope:{
            input : '='
        },
        template: '<div class="infi-input-box">'
                        +'<div class = "infi-input-left">'
                            +'<p class="infi-font-red">'
                                +'<span ng-if="input.notNull" class="infi-font-red">*</span>'
                                +'<span ng-bind="input.label"></span>'
                            +'</p>'
                        +'</div>'
                        +'<div class = "infi-input-right form-group">'
                            +'<div class="infi-input-opt input-group row">'
                                +'<div ng-repeat = "opt in input.dimension.options" class="col-md-4 infi-input-text-double">'
                                    +'<input class="form-control" type="text" name="{{input.name}}" ng-model="input.value[opt.name]">'
                                    +'<span ng-if="$index === 1">-</span>'
                                    +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
                                +'</div>'
                            +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            $('.glyphicon-question-sign',element).popover()
        }
    };
}]);


angular.module("infi-basic").directive('inputNumber',[function(){
    return {
        restrict: 'ECMA',
        scope:{
            input : '='
        },
        template: '<div class="infi-input-box">'
                        +'<div class = "infi-input-left">'
                            +'<p class="infi-font-red">'
                                +'<span ng-if="input.notNull" class="infi-font-red">*</span>'
                                +'<span ng-bind="input.label"></span>'
                            +'</p>'
                        +'</div>'
                        +'<div class = "infi-input-right form-group">'
                            +'<div class="infi-input-opt input-group">'
                                +'<input ng-disabled="input.name==\'基本信息_a_基本信息_a_1000\' || input.name==\'基本信息_a_基本信息_a_1003\' || input.name==\'基本信息_a_基本信息_a_1004\'" class="form-control" type="text" name="{{input.name}}" ng-model="input.value" >'
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

angular.module("infi-basic").directive('inputDate',['groupServices',function(groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '='
        },
        template: '<div class="infi-input-box">'
                        +'<div class = "infi-input-left">'
                            +'<p class="infi-font-red">'
                                +'<span ng-if="input.notNull" class="infi-font-red">*</span>'
                                +'<span ng-bind="input.label"></span>'
                            +'</p>'
                        +'</div>'
                        +'<div class = "infi-input-right">'
                            +'<div class="infi-input-opt">'
                                +'<label>'
                                    +'<input class="form-control" type="text" name="{{input.name}}" readonly="readonly"'
                                    +'ng-model="input.value"  ng-click="timePlugin(input.name,input.format)">'
                                    +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
                                +'</label>'
                            +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            scope.timePlugin = function(tagName,format){
                groupServices.timePlugin(tagName,format);
            };
            $('.glyphicon-question-sign',element).popover()
        }
    };
}]);

angular.module("infi-basic").directive('inputScale',['groupServices',function(groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        templateUrl:'./form/basic-template/scale.html',
        replace: true,
        link:function(scope,element,attrs){
            //缺失的数据会在这里得到添加
            groupServices.updateValue.update(scope.input);
            scope.scaleModal = function(input){
                //data为null的话，说明并没有请求新的scale数据，所以直接使用自己input中缓存的数据即可
                var data = groupServices.getScaleData(input);
                if(data == null){
                    scope.scaleData = input.scaleData;
                }else{
                    input.scaleData= data;
                    scope.scaleData = data;
                }
                scope.scaleData.tagInputData = input;
                $('#infi-u-scale').modal({backdrop: 'static'});
            }
        }
    };
}]);

// 慢病自个的量表指令
angular.module("infi-basic").directive('inputChronScale',['groupServices', function(groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent: '='
        },
        templateUrl:'./form/basic-template/chron-scale.html',
        replace: true,
        link:function(scope,element,attrs){
            scope.modelData = null	                                                // 存储量表的模板数据

            
            scope.scaleModal = function(input){
                var resultId = ''

                if(input.value) {
                    resultId = input.value.split(',')[1]
                }

                groupServices.chronGetScaleData(input, resultId).then(function(data) {        
                    scope.modelData = data
                    $(`#${input.name}`).modal({backdrop: 'static'});
                })
            }
        }
    };
}]);

angular.module("infi-basic").directive('inputRadio',['groupServices',function(groupServices){
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
                        +'<div class = "infi-input-right">'
                            +'<div class="infi-input-opt">'
                                +'<ul>'
                                   +'<li ng-repeat = "opt in input.dimension.options">'
                                        +'<label class="radio-inline">'
                                            +'<input ng-checked="opt.value === input.value" type="radio" value="{{opt.value}}" name="{{input.name}}"'
                                            +'ng-model="input.value" ng-change="updateChildren(opt.value)">{{opt.label}}'
                                        +'</label>'
                                    +'</li>'
                                    +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
                                +'</ul>'
                            +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            scope.updateChildren = function(value){
                groupServices.updateChildren(value,scope.input,scope.parent);
            }
            $('.glyphicon-question-sign',element).popover()
        }
    };
}]);


angular.module("infi-basic").directive('inputSwitch',['groupServices',function(groupServices){
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
                                    +'<input class="hide" ng-click="changeVal(input)" type="checkbox" ng-checked="input.switchChecked == \'checked\'">'
                                +'</label>'
                            +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            scope.changeVal = function(input){
                input.value == "0"?input.value = "1":input.value = "0";
                input.switchChecked == 'checked'?input.switchChecked = '':input.switchChecked = 'checked';
                groupServices.updateChildren(input.value,scope.input,scope.parent);
            }

            $('.glyphicon-question-sign',element).popover();
        }
    };
}]);

angular.module("infi-basic").directive('inputSelect',['groupServices',function(groupServices){
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
                                +'<select ng-model="input.value" class="form-control">'
                                    +'<option ng-checked="input.value == option.value" ng-repeat="option in input.dimension.options" value="{{option.value}}">{{option.label}}</option>'
                                +'</select>'
                            +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            $('.glyphicon-question-sign',element).popover();
        }
    };
}]);

angular.module("infi-basic").directive('inputRadioExtend',['groupServices',function(groupServices){
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
                                +'<span ng-bind="input.label"></span>'
                            +'</p>'
                        +'</div>'
                        +'<div class = "infi-input-right">'
                            +'<div class="infi-input-opt">'
                                +'<ul>'
                                    +'<li ng-repeat = "opt in input.dimension.options">'
                                         +'<label class="radio-inline">'
                                            +'<input ng-checked="opt.value === input.value" type="radio" value="{{opt.value}}" name="{{input.name}}"'
                                            +'ng-model="input.value" ng-change="updateChildren(opt.value)">{{opt.label}}'
                                        +'</label>'
                                    +'</li>'
                                    +'<li class="addOther" ng-show = "input.value === \'其他\'">'
                                        +'<label>'
                                            +'<input class="" type="text" name="" placeholder="请输入其他" ng-model = "input.extendValue">'
                                        +'</label>'
                                        +'<button class="btn btn-default btn-sm" type="button" ng-click = "addExtendOpt()">添加</button>'
                                    +'</li>'
                                    +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
                                +'</ul>'
                            +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){

            //缺失的数据会在这里得到添加
            groupServices.updateValue.update(scope.input);

            //控制分支
            scope.updateChildren = function(value) {
                groupServices.updateChildren(value,scope.input,scope.parent);
            }

            //扩充输入
            scope.addExtendOpt = function(){
                groupServices.addRadioExtendOpt(scope.input);
            }
            $('.glyphicon-question-sign',element).popover()
        }
    };
}]);

angular.module("infi-basic").directive('inputCheckbox',['groupServices',function(groupServices){
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
                                +'<span ng-bind="input.label"></span>'
                            +'</p>'
                        +'</div>'
                        +'<div class = "infi-input-right">'
                            +'<div class="infi-input-opt">'
                                +'<ul>'
                                    +'<li ng-repeat = "opt in input.dimension.options">'
                                        +'<label class="checkbox-inline">'
                                            +'<input ng-checked="input.value[opt.value]===true" type="checkbox" value="{{opt.value}}" name="{{input.name}}"'
                                            +'ng-model="input.value[opt.value]" ng-change="updateChildren(opt.value)">{{opt.label}}'
                                        +'</label>'
                                    +'</li>'
                                    +'<a ng-show="input.description != null && input.description != \'\'" tabindex="0" type="button" role="button" class="glyphicon glyphicon-question-sign" data-container="body" data-trigger="hover" data-toggle="popover" data-placement="right" data-content="{{input.description}}"></a>'
                                +'</ul>'
                            +'</div>'
                        +'</div>'
                    +'</div>',
        replace : true,
        link:function(scope,element,attrs){
            //缺失的数据会在这里得到添加
            groupServices.updateValue.update(scope.input);

            scope.updateChildren = function(value){
                groupServices.updateChildren(value,scope.input,scope.parent)
            }
            $('.glyphicon-question-sign',element).popover()
        }
    };
}]);

angular.module("infi-basic").directive('inputCheckboxExtend',['groupServices',function(groupServices){
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
                                +'<span ng-bind="input.label"></span>'
                            +'</p>'
                        +'</div>'
                        +'<div class = "infi-input-right">'
                            +'<div class="infi-input-opt">'
                                +'<ul>'
                                    +'<li ng-repeat = "opt in input.dimension.options">'
                                       +'<label class="checkbox-inline">'
                                            +'<input ng-checked="input.value[opt.value]===true" type="checkbox" value="{{opt.value}}" name="{{input.name}}"'
                                            +'ng-model="input.value[opt.value]" ng-change="updateChildren(opt.value)">{{opt.label}}'
                                        +'</label>'
                                    +'</li>'
                                    +'<li  class="addOther" ng-show = "input.value[\'其他\']">'
                                        +'<label>'
                                            +'<input class="" type="text" name="" placeholder="请输入其他" ng-model = "input.extendValue">'
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

            //缺失的数据会在这里得到添加
            groupServices.updateValue.update(scope.input);

            //控制分支
            scope.updateChildren = function(value) {
                groupServices.updateChildren(value,scope.input,scope.parent);
            }

            //扩充输入
            scope.addCheckboxExtendOpt = function(){
                groupServices.addCheckboxExtendOpt(scope.input);
            }
            $('.glyphicon-question-sign',element).popover()
        }
    };
}]);

angular.module("infi-basic").directive('inputTextarea',[function(){
    return {
        restrict: 'ECMA',
        scope:{
            input : '='
        },
        template: '<div class="infi-input-box">'
                        +'<div class = "infi-input-left">'
                            +'<p class="infi-font-red">'
                                +'<span ng-if="input.notNull" class="infi-font-red">*</span>'
                                +'<span ng-bind="input.label"></span>'
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

//zyz_debug 新增textarea，高度缩短一半
angular.module("infi-basic").directive('inputHalfTextarea',[function(){
    return {
        restrict: 'ECMA',
        scope:{
            input : '='
        },
        template: '<div class="infi-input-box">'
                        +'<div class = "infi-input-left">'
                            +'<p class="infi-font-red">'
                                +'<span ng-if="input.notNull" class="infi-font-red">*</span>'
                                +'<span ng-bind="input.label"></span>'
                            +'</p>'
                        +'</div>'
                        +'<div class = "infi-input-right">'
                            +'<div class="infi-input-opt">'
                                +'<label class="">'
                                    +'<textarea class="form-control infi-area-half-height" ng-model="input.value" name="{{input.name}}" ></textarea>'
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

angular.module("infi-basic").directive('addGroup',['groupServices',function(groupServices){
    return {
        restrict: 'ECMA',
        scope:{
            input : '=',
            parent : '='
        },
        template: '<button class="btn btn-primary infi-add-attr-group" ng-click="addGroup(input.categoryLevel)">添加</button>',
        replace : true,
        link:function(scope,element,attrs){

            groupServices.updateValue.update(scope.input);

            scope.addGroup = function(addType){
                groupServices.addGroup(scope.input,scope.parent,addType);
            }
        }
    };
}]);

//这个directive用于监听历史信息是否渲染完毕
angular.module("infi-basic").directive('repeatHistoryFinish',['$timeout',function($timeout){
    return {
        restrict: 'ECMA',
        link:function(scope,element,attrs){
             if(scope.$last == true){
                $timeout(function() {
                    scope.$emit( 'renderOverHistory');
                });
            }
        }
    }
}])


// 表单将已保存项选项从结果对象转化为选项对象
angular.module("infi-basic").directive('converAnsobjToOptobj',[function() {
    return {
        restrict: 'ECMA',
        scope: {
            secData: "=",
            optObj: "="
        },
        link: function(scope, element) {
            var findObjectByKey = function(array, key, value) {
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
            
            if(scope.secData.choicedOptionList) {
                var findedObj = findObjectByKey(scope.secData.choicedOptionList, 'optionId', scope.optObj.id)

                if(findedObj.isIn) {
                    scope.secData.choicedOptionList[findedObj.ind] = scope.optObj
                }
            }

            
        }
    }
}])
