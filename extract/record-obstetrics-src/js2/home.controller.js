angular.module('infi-basic')
    .controller('HomeController', ['$scope', 'RecordService', 'SYS', 'Utils', '$rootScope','naviServices','Session', function ($scope, RecordService, SYS, Utils, $rootScope,naviServices,Session) {
        $scope.recordwj_navigation = [
            {'name': '统一视图', 'cls': '-list-alt', 'active': 'list-group-active'}
        ];

        $scope.infi_wj_nav = function (nav) {
            angular.forEach($scope.recordwj_navigation, function (datas, i) {
                $scope.recordwj_navigation[i].active = '';
                angular.forEach(datas.child, function (data, i) {
                    datas.child[i].active = '';
                })
            });
            nav.active = 'list-group-active';
        };
        // $scope.infi_wj_navs = function (nav) {
        //     angular.forEach($scope.recordwj_navigation, function (datas, i) {
        //         $scope.recordwj_navigation[i].active = '';
        //         angular.forEach(datas.child, function (data, i) {
        //             datas.child[i].active = '';
        //         })
        //     });
        //     nav.active = 'list-group-active';
        // };
        // $scope.mOver = true;

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

        //============================
        // 修改密码的相关操作
        //============================
        /**
         * 页面上绑定的新密码以及再次输入的新密码
         * @type {{newWord: string, newWordAgain: string}}
         */
        $scope.password = {
            oldWord: '',
            newWord: '',
            newWordAgain: ''
        };
        /**
         * 显示修改密码的模态框,并将表单进行数据清空
         */
        $scope.alterPasswordModal = function () {
            $('#alterPassword').modal('show');
            $scope.password = {
                oldWord: '',
                newWord: '',
                newWordAgain: ''
            }
        };

        /**
         * 向后台提交新密码,并且进行密码的更新(需要将旧密码和新密码传到后台)
         */
        $scope.alterPassword = function () {
            $('#alterPassword').modal('hide');
            var password = $scope.password;
            password.oldWord = md5($scope.password.oldWord);
            password.newWord = md5($scope.password.newWord);
            RecordService.alterPasswordInfo(password).then(function success(msg) {
                if (msg.status == SYS.STATUS_SUCCESS) {
                    msg.description = '密码修改成功,请重新登陆!';
                    setTimeout(function () {
                        angular.element("#logout-click").click()
                    }, 1000)
                }
                Utils.sysTip($scope, msg);
            })
        }
    }]);
