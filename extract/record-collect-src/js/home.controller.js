angular.module('infi-basic')
    .controller('HomeController', ['$scope', 'SYS', '$rootScope','naviServices','Session', function ($scope, SYS,$rootScope,naviServices,Session) {
        $rootScope.targetTemplate = null;
        /**
         * 用户登录成功之后重新请求用户信息,解决用户名不同步的情况
         */
        $rootScope.$on('$routeChangeSuccess', function (event,current,previous) {
            //初始化方法的调用
            if(current&&current.loadedTemplateUrl&&current.loadedTemplateUrl.indexOf('login.html')>-1){
                //退出后清空所有homecontroller判断项
                $scope.name = null;  //必清项
            }else{
                //解决重新登录用户名不同步问题
                if(!$scope.name){
                    var user = Session.getUser();
                    if(user){
                        $scope.name = user.name;
                    }
                }
            }
        });

        function judgeWindow() {
           if(window.innerWidth < 1280){
               $scope.screenSize = '1024';
           }else if(1280 <= window.innerWidth &&  window.innerWidth<1855){
               $scope.screenSize = '1280';
           }else if(1855 <= window.innerWidth){
               $scope.screenSize = '1920';
           }
        };
        judgeWindow();

        $(window).resize(function () {
            judgeWindow();
        });

        // 全局监听点击空白处事件
        ;(function(){
            $(document).unbind().bind('click',function(event){
                //浏览器兼容性
                var e = event || window.event;
                var elem = e.target || e.srcElement;

                //循环判断至跟节点，防止点击的是div子元素
                while (elem) {
                    if ($(elem).hasClass('input-wrapper') === true  || $(elem).hasClass('search-rst-wrapper') === true) {
                        return;
                    }
                    elem = elem.parentNode;
                }

                //点击的不是div或其子元素则隐藏
                $scope.$broadcast('clickOutside');
                //$scope.$apply();
            });
        })();



        // 全局监听指定 input 元素（处方）
        $(function () {
            var focusedElement;
            $(document).on('focus', 'input.sticky', function () {
                if (focusedElement == this) return; //already focused, return so user can now place cursor at specific point in input.
                focusedElement = this;
                setTimeout(function () { focusedElement.select(); focusedElement = null }, 50); //select all text in any field on focus for easy re-entry. Delay sightly to allow focus to "stick" before selecting.
            });
        });

        // 开启或关闭 console.log
        // console.log = function() {

        // }
    }]);
