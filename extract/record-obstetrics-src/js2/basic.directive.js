angular.module('infi-basic').directive('firstDay', [function () {
    return {
        restrict: 'A',
        templateUrl: 'titleUrl/firstday.html',
        scope: {},
        link: ''
    }
}]);
angular.module('infi-basic').directive('fourDay', [function () {
    return {
        restrict: 'A',
        templateUrl: 'html/firstday.html',
        scope: {},
        link: ''
    }
}]);
angular.module('infi-basic').directive("basicInfo", [function () {
    return {
        restrict: 'A',
        templateUrl: 'html/basic-infomation.html',
        scope: {
            caseList: '='
        }
    }
}]);

angular.module('infi-basic').directive('sysTip', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        template: '<div ng-if="sysTip.status" style="word-wrap:break-word" '
        + 'ng-class="{\'ok\':\'notice\',\'querying\':\'notice\',\'error\':\'notice_error\',\'blank\':\'notice_error\'}[sysTip.status]">'
        + '{{sysTip.description}}' +
        '</div>'
    };


}]);
angular.module('infi-basic').directive("materRadio", [function () {
    return {
        restrict: 'A',
        templateUrl: 'html/mater-radio.html',
        scope: {
            mater: '='
        },
        link: function (scope) {

        }
    }
}]);
angular.module('infi-basic').directive("visitRecord", [function () {
    return {
        restrict: 'A',
        templateUrl: 'html/tpl/overview.obstetrics.visit.record.html',
        scope: {
            diagnose: '=',
            queryParams:'='
        },
        link: function (scope) {

        }
    }
}]);
angular.module('infi-basic').directive("examRecord", [function () {
    return {
        restrict: 'A',
        templateUrl: 'html/tpl/overview.obstetrics.test.record.html',
        scope: {
            exam: '='
        },
        link: function (scope) {

        }
    }
}]);
angular.module('infi-basic').directive("prescriptionRecord", [function () {
    return {
        restrict: 'A',
        templateUrl: 'html/tpl/overview.obstetrics.prescription.record.html',
        scope: {
            mater: '='
        },
        link: function (scope) {

        }
    }
}]);
//右侧导航栏
angular.module('infi-basic').directive("rightNav", [function () {
    return {
        restrict: 'A',
        templateUrl: 'html/tpl/overview.right.nav.html',
        scope: {
            timelineDatas: '=',
            archives: '=',
            queryParams: '=',
            archivesWrap: "=",
            navList: "=",
            navListDoor: "=",
            showArchives: '='  //是否显示产科档案
        },
        link: function ($scope) {
            /**
             * 门诊
             */
            $scope.$watch('navListDoor', function (newValue, oldValue) {
                if ($scope.navListDoor) {
                    var whichData = confirmState($scope.navListDoor);
                    $scope.showList(whichData)
                }
            });

            /**
             * 住院
             */
            $scope.$watch('navList', function (newValue, oldValue) {
                if ($scope.navList) {
                    var whichData = confirmState($scope.navList);
                    $scope.showList(whichData)
                }
            });

            /**
             * 判断当前页面数据
             * @param data
             * @returns {string}
             */
            function confirmState(data) {
                if(data){
                    var thisSection = '';
                    angular.forEach(data,function(wrap){
                        angular.forEach(wrap.events,function(entity){
                            if(entity.xlMedicalId == $scope.queryParams.xlMedicalId){
                                thisSection = wrap;
                            }
                        })
                    });
                    return thisSection;
                }
            }

            /**
             * 标记状态切换
             * @param year
             */
            $scope.showList = function (year) {
                year.active = !year.active;
            }

        }
    }
}]);

//数据提示错误
angular.module('infi-basic').directive("prompt", [function () {
    return {
        restrict: 'A',
        scope: {
            data: '='
        },
        //template:'<div class="alert alert-danger">暂无数据</div>'
        template: '<p class="alert alert-danger infi-alert-danger" ng-if="data.status!=\'ok\'|| data.data.result.length<=0">暂无数据</p>'
    }
}]);

angular.module('infi-basic').directive("dataTip", [function () {
    return {
        restrict: 'A',
        templateUrl: '<p class="alert alert-danger" ng-if="data.status!=\'ok\' || " >暂无数据</p>',
        scope: {
            data: '=data'
        }
    }
}]);
angular.module("infi-basic").directive('infiWjDate', [function () {
    return {
        link: function ($scope, element, attrs) {
            var format = 'yyyy-mm-dd',
                view = 2;
            if (attrs && attrs.infiDate) {
                format = attrs.infiDate;
            }
            if (attrs && attrs.dateView) {
                view = attrs.dateView;
            }
            $(element).click(function () {
                $(this).datetimepicker({
                    format: format,
                    language: "zh-CN",
                    minView: view,
                    autoclose: true,
                    forceParse: true
                }).trigger('focus');
            });
        }
    }
}]);

angular.module('infi-basic').directive('infiInputOther',[function(){
    return {
        scope:{
            pregnancy:'='
        },
        link:function(scope, element, attrs){
            var name = attrs.name.split('.');
            $(element).click(function(event){
                $(document).click();
                $('.infi-wj-'+name[1]).show();
                return false;
            });

            $(document).click(function(){
                $('.infi-wj-'+name[1]).hide()
            });
        }
    }
}]);
//关闭产科档案原因模态框
angular.module('infi-basic').directive('closeObstetrics', [function () {
    return {
        restrict: 'A',
        templateUrl: 'html/tpl/close.obstetrics.html',
        scope:{
            closeReason:'=',
            submitClose:'&'
        }
    }
}]);
//返回前确认有没有保存
angular.module('infi-basic').directive('confirmBack', [function () {
    return {
        restrict: 'A',
        templateUrl: 'html/tpl/confirm.back.html',
        scope:{
            submitBack:'&'
        }
    }
}]);
