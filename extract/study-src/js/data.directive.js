//新建病历信息模态框
angular.module('infi-basic')    
    .directive('generalPrompt',[function(){
        return {
            restrict: 'EA',
            template: 
            '<div class="modal fade"  id="general-prompt">' +
                '<div class="modal-dialog"> ' +
                    '<div class="modal-content"> ' +
                        '<div class="modal-header"> ' +
                            '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> ' +
                            '<h4 class="modal-title">提示</h4> ' +
                        '</div> ' +
                        '<div class="modal-body"> ' +
                            '<p>{{promptMainContent}}</p> ' +
                        '</div>' +
                        '<div class="modal-footer"> ' +
                            '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button> ' +
                            '<button type="button" class="btn btn-primary" ng-click="promptMainContentSave()">确定</button>' +
                        '</div> ' +
                    '</div><!-- /.modal-content --> ' +
                '</div><!-- /.modal-dialog --> ' +
            '</div><!-- /.modal -->',
            link:function(scope){
                
            }
        }
}])
    .directive('modalRecord',function(){
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

angular.module('infi-basic')
    .directive('hospitalModal',function($http){
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


angular.module('infi-basic')
.directive('shiyanzuForm',['DataService',function(DataService){
    return {
        restrict: 'EA',
        templateUrl: '../study-src/html/shiyanzu.form.html',
        scope:{
            experiment:'=experiment',
            asd:'&'
        },
        link:function($scope,$rootScope){
            // $scope.setDist = function(data){
            //     // HosDep=[];
            //     // $rootScope.topicsId
            //     $scope.fenPei = data;
            //     $scope.HosDep = [];
            //     DataService.ajaxSetDist().then(function(data){
            //         angular.forEach(data.data, function(data,index){
            //             $scope.HosDep.push({name:index,names:data})
            //             console.log($scope.HosDep);
            //         });
            //     });
            //     $scope.GroupName = data;
            //
            //     $('#set-distribution').modal({backdrop: 'static'});
            // }

            $scope.btnDel = function(data,num){
                // 0代表添加实验组 , 1代表对照组
                if( num == 0 ){
                    for(var i = 0 ; i < $scope.experiment.length ; i++ ){
                        if($scope.experiment[i].name == data){
                            console.log($scope.experiment[i].name);
                            $scope.experiment.splice(i,1);
                        }
                    }
                    for(var i = 0 ; i < $scope.experiment.length ; i++ ){
                        var num = 1+i;
                        $scope.experiment[i].name = '实验组'+num;
                    }
                }else if( num == 1 ){
                    for(var i = 0 ; i < $scope.controls.length ; i++ ){
                        if($scope.controls[i].name == data){
                            console.log($scope.controls[i].name);
                            $scope.controls.splice(i,1);
                        }
                    }
                    for(var i = 0 ; i < $scope.experiment.length ; i++ ){
                        var num = 1+i;
                        $scope.experiment[i].name = '实验组'+num;
                    }
                }
            }

            $scope.setAdd = function(data){
                // 0代表添加实验组 , 1代表对照组
                if( data == 0 ){
                    var Num = $scope.experiment.length+1;
                    $scope.experiment.push(
                        {name:'实验组'+Num,one:[
                            {name:'分组编码',value:''},
                            {name:'分组名称',value:''},
                            {name:'病例数量',value:''}
                        ],casesNumber:'描述',casesValue:'',CRF:'CRF模板',CRFValue:'',distribution:'任务分配',
                            distributionTable:[
                            ]
                        });
                }else if( data == 1 ){
                    var Nums = $scope.controls.length+1;
                    $scope.controls.push(
                        {name:'对照组'+Nums,one:[
                            {name:'分组编码',value:''},
                            {name:'分组名称',value:''},
                            {name:'病例数量',value:''}
                        ],casesNumber:'描述',casesValue:'',CRF:'CRF模板',CRFValue:'',distribution:'任务分配',
                            distributionTable:[
                            ]
                        })
                }
            }
        }
    }
}])
    .directive('duizhaozuForm',[function(){
        return {
            restrict: 'EA',
            templateUrl: '../study-src/html/duizhaozu.form.html',
            scope:{
                controls:'=controls'
            },
            link:function($scope){
                $scope.setAdd = function(data){
                    // 0代表添加实验组 , 1代表对照组
                    if( data == 0 ){
                        var Num = $scope.experiment.length+1;
                        $scope.experiment.push(
                            {name:'实验组'+Num,one:[
                                {name:'分组编码',value:''},
                                {name:'分组名称',value:''},
                                {name:'病例数量',value:''}
                            ],casesNumber:'描述',casesValue:'',CRF:'CRF模板',CRFValue:'',distribution:'任务分配',
                                distributionTable:[
                                ]
                            });
                    }else if( data == 1 ){
                        var Nums = $scope.controls.length+1;
                        $scope.controls.push(
                            {name:'对照组'+Nums,one:[
                                {name:'分组编码',value:''},
                                {name:'分组名称',value:''},
                                {name:'病例数量',value:''}
                            ],casesNumber:'描述',casesValue:'',CRF:'CRF模板',CRFValue:'',distribution:'任务分配',
                                distributionTable:[
                                ]
                            })
                    }
                }
            }
        }
    }]);

