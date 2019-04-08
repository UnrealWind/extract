/**
 * Created by geqimeng on 17-11-14.
 */

angular.module("infi-basic").directive('recordList',[function(){
    return {
        // href="'+_CTX+'/load/data/info/{{$root.project.value}}/{{opt.recordId}}
        restrict: 'ECMA',
        template:'<div class="search-item">'
        +'<table>'
        +'<tbody>'
        +'<tr>'
        +'<td class=\'font-big\' colspan="6"><a target="_blank" ng-click="goToDetail($root.project.value,opt)" class="self-font-black">{{opt.title}}</a></td>'
        +'</tr>'
        +'<tr>'
        +'<td class="self-font-blue" width=\'50\'>性别:</td>'
        +'<td>{{opt.gender}}</td>'
        +'<td class="self-font-blue" width=\'80\'>出生日期:</td>'
        +'<td>{{opt.birthday}}</td>'
        +'<td rowspan="2" colspan="2" ><span ng-class="{\'女\':\'infi-icon infi-icon-female\',\'男\':\'infi-icon infi-icon-male\'}[opt.gender]"></span></td>'
        +'</tr>'
        +'<tr>'
        +'<td class="self-font-blue">简要病史:</td>'
        +'<td title="{{opt.history}}" class="infi-long-font-td" class="box-sick" colspan="3">{{opt.history}}</td>'
        +'<td colspan="2"></td>'
        +'</tr>'
        +'<tr>'
        +'<td class="self-font-blue">主要临床诊断:</td>'
        +'<td  title="{{opt.diagnosis}}" class="infi-long-font-td" class="box-sick" colspan="3">{{opt.diagnosis}}</td>'
        +'<td colspan="2"></td>'
        +'</tr>'
        +'<tr>'
        +'<td class=\'self-font-blue\' style=\'vertical-align:top\'>搜索理由:</td>'
        +'<td class="infi-long-font-td" colspan="3">'
        +'<p ng-bind-html="opt.reason"></p>'
        +'</td>'
        +'<td colspan="2"></td>'
        +'</tr>'
        +'</tbody>'
        +'</table>'
        +'</div>',
        replace: true
    };
}])


angular.module("infi-basic").directive('symptomOpt',function(){
    return {
        restrict: 'ECMA',
        template: '<div ng-if="keyWord.show === true" class="tab-pane fade in active" role="tabpanel" aria-labelledby="-tab" ng-repeat = "keyWord in model.keyWords">'
        +'<ul class="symptomOpt-list">'
        +'<li ng-repeat = "symptom in keyWord.symptom">'
        +'<h5>'
        +'<a id="" href="javascript:" ng-click= "searchWords(symptom.symptomName)">{{symptom.symptomName}}:</a>'
        +'</h5>'
        +'<p>'
        +'<a ng-repeat = "children in symptom.children" value="" href="javascript:" ng-click= "searchWords(children.name)">{{children.label}}</a>'
        +'</p>'
        +'</li>'
        +'</ul>'
        +'</div>',
        replace: true
    };
})

angular.module("infi-basic").directive('diseaseOpt',function(){
    return {
        restrict: 'ECMA',
        template: '<ul class="nav nav-tabs self-tabs">'
        +'<li ng-class="{true:\'active\',false:\'\'}[keyWord.show]" role="presentation" ng-repeat = "keyWord in model.keyWords">'
        +'<a href="#" ng-click = "changeNav(keyWord)">{{keyWord.diseaseName}}'
        +'<span ng-if = "keyWord.show === true"></span>'
        +'</a>'
        +'</li>'
        +'</ul>',
        replace: true
    };
})

angular.module("infi-basic").directive('hotWord',function(){
    return {
        restrict: 'ECMA',
        template: '<ul class="list-inline">'
        +'<li>热门关键词：</li>'
        +'<li ng-repeat = "hotWord in model.hotWords">'
        +'<a href="javascript:;" ng-click = "searchWords(hotWord.label)">{{hotWord.label}}</a>'
        +'</li>'
        +'</ul>',
        replace: true
    };
})

angular.module("infi-basic").directive('pageList',function(){
    return {
        restrict: 'ECMA',
        template:'<div class="self-page" ng-if="!description">'
        +'<div class="to-page">{{model.pageData.number+1}} '
        +'/{{model.pageData.totalPages}}页</div>'
        +'<ul class="pagination">'
        +'<li ng-click="changePage(model.pageData.number)"><a href="javascript:;"><</a></li>'
        +'<li ng-repeat = "opt in model.pageList" ng-click="changePage(opt.value)" ng-class="{true:\'active\',false:\'\'}[{{opt.pageNum}}]"><a href="javascript:;">{{opt.value}}</a></li>'
        +'<li ng-click="changePage(model.pageData.number+2)"><a href="javascript:;">></a></li>'
        +'</ul>'
        +'</div>',
        replace: true
    };
})


