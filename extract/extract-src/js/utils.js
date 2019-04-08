angular.module('infi-basic').service('Utils',['SYS','$timeout',function (SYS,$timeout) {
    function sysTip($scope,tip, callback) {
        $scope.sysTip = angular.copy(tip);
        var show ;
        $timeout.cancel(show);
        show = $timeout(function () {
            if( $scope.sysTip ){
                $scope.sysTip.status = undefined;
            }

            callback ? callback() : undefined
        },1500);
    }

    function sysTipBefore($scope,description) {
        sysTip($scope,{
            status: SYS.STATUS_QUERYING,
            description: description
        });
    }

    return {
        sysTip: sysTip,
        sysTipBefore: sysTipBefore
    }
}]);

angular.module('infi-basic').filter('topicCharacter',[function(){
    //运用公共tabel，公共tabel中有个filter，不加入会出现问题,其实并没有用
    return function(value){
        if( value==='manager'){
            return "管理员";
        }else if( value === 'general'){
            return "科研人员";
        }else if( value==='system'){
            return "系统模板";
        }else if( value === 'system'){
            return "自定义";
        }else if( value === 'collection'){
            return "收藏";
        }


        return value;
    }
}]).filter('recordExtractFilter',[function(){
    //筛选条件选取页面筛选条件显示,标签中属性与options中相同要去重
    return function(option,child,parent,childIndex) {
        if(child.$checked){
            var idx,idy,idz;
            if(option.options){  //父级有options,判断options是否有属性与此属性相同
                for(idx=0;idx<option.options.length;idx++){
                    var opt = option.options[idx];
                    if(opt.id == child.id){  //options中有属性与tabs中相同,则将tabs中隐藏
                        return "hide";
                    }
                }
            }
            //如果options没有,则判断同级标签列表中是否有相同属性
            //tabs中如果有相同属性,只保留最后一个属性,其他的隐掉
            var lastTab,lastOption;
            if(idx == option.options.length && option.tabs){
                for(idy = 0;idy < option.tabs.length;idy++){
                    var tab = option.tabs[idy];
                    for(idz=0;idz<tab.options.length;idz++){
                        var opt = tab.options[idz];
                        if(opt.id == child.id){
                            lastTab = tab;  //盛放最后一个相同的属性父级
                            lastOption = idz;  //盛放最后一个属性的index
                        }
                    }
                }
            }
            //最后一个相同属性与本属性的父级相同,最后一个循环属性与本属性index相同,则为最后一个
            if(lastTab.id != parent.id||lastOption != childIndex){
                return "hide";
            }
        }
    }
}]).filter('InputCheckFilter',[function(){
    //校验数值输入框是否输入的为数值
    return function(content,type) {
        if(type == "range"&&(!isNaN(content.min) && !isNaN(content.max))){
            return "hide";
        }else if(type == "context"){  //暂时还没有写前置条件中输入的提示
            if(content&&(!isNaN(content.label))){
                return "hide";
            }else if(!content){
                return "hide";
            }
        }
    }
}]).filter('viewSelect',[function(){
    return function(list,id) {
        if(id){
            for(var i=0;i<list.length;i++){
                if(list[i].id == id){
                    return list[i].name;
                    break;
                }
            }
        }else{
            if(list == 'filter'){
                return '筛选';
            }else if(list == 'export'){
                return '导出';
            }else if(list == true){
                return '是';
            }else if(list == false){
                return '否';
            }
        }

    }
}]);

angular.module('infi-basic')
.directive('repeatFinish',['$timeout',function($timeout){
    //页面中repeat的内容完全生成后进行一系列操作
    return {
        restrict: 'A',
        link:function(scope){
            $timeout(function() {
                //1.数组有多项,最后一个为true,第一个不是true 2.数组有一项,第一个和最后一个都是true
                if(scope.$last == true && (!scope.$first||scope.$first == true) ){
                    scope.$emit( 'domReady' );
                }
            });
        }
    }
}])
.directive('sysTip',[function(){
    return{
        restrict: 'A',
        template:'<div ng-if="sysTip.status" '+
        'ng-class="{\'ok\':\'notice\',\'querying\':\'notice\',\'error\':\'notice_error\',\'black\':\'notice_error\'}[sysTip.status]">'+
        '{{sysTip.description}}</div>'
    }
}])
.directive('showLoad',["Utils","$timeout",function (Utils,$timeout) {
    //条件选取页面内容没加载完全给个遮罩
    return{
        restrict:'A',
        replace:true,
        template:'<div class="infi-mask"><img class="infi-load-img" ng-src="/src/image/loading.gif" /></div>',
        link:function (scope) {
            $timeout(function () {
                if(scope.showLoad){
                    var tip = {
                        status:"error",
                        description:"系统繁忙，稍后重试"
                    }
                    scope.showLoad = false;
                    Utils.sysTip(scope,tip);  //保存不成功的错误提示
                }
            },1000*6)
        }
    }
}])
.directive('centerDisplay',[function () {
    //前置条件中药品或者疾病更多的搜索框位置居中.模态框没有用bootstrap因为有太多定位,致使弹出框显示有问题
    return{
        restrict:'A',
        replace:true,
        link:function (scope,element) {
            var targetWidth = element.width(),
                screenWidth = $(window).width();
            var positionLeft = (screenWidth-targetWidth)/2;
            element.css("left",positionLeft+"px");
        }
    }
}])
.directive('verifyPosition',[function () {
    //弹出框位置动态改变,防止弹出框显示不全或者位置不好
    return{
        restract:'A',
        replace:true,
        link:function (scope,element) {
            var eleWidth = element.outerWidth(),
                leftPosition = element.offset().left,
                screenWidth = $(window).width(),
                rightPosition = screenWidth-leftPosition;
            //弹框的宽度大于距离屏幕右侧的长度，并且弹框长度小于屏幕宽度，弹框向左移动
            if(rightPosition < eleWidth && screenWidth > eleWidth){
                var left = (rightPosition-eleWidth)+"px";
                element.css("left",left);
            }else if(rightPosition < eleWidth && screenWidth < eleWidth){
                //弹框的宽度大于距离屏幕右侧的长度，并且弹框长度大于屏幕宽度，弹框顶到屏幕最左侧
                var left = -screenWidth + "px";
                element.css("left",left);
            }
        }
    }
}]);