//新增患者
angular.module('infi-basic').directive('infiPatient', [function () {
    return {
        restrict: 'A',
        templateUrl: 'html/tpl/add-patient.html'
        // scope: {
        //     patient:'=',
        //     addPatient:'&',
        //     departList:'=',
        //     areaList:'=',
        //     changeDepart:'&'
        // }
    }
}]);
//患者详情页的基本信息
angular.module('infi-basic').directive('basicInfo', [function () {
    return {
        restrict: 'A',
        templateUrl: 'html/tpl/basicInfo.html',
        scope: {
            basic:'='
        },
        link: ''
    }
}]);

//出院记录模态框
angular.module('infi-basic').directive('dischargeRecord', [function () {
    return {
        restrict: 'A',
        templateUrl: 'html/tpl/discharge.record.html'
    }
}]);

//入院记录模态框
angular.module('infi-basic').directive('admissionRecord', [function () {
    return {
        restrict: 'A',
        templateUrl: 'html/tpl/admission.record.html'
    }
}]);

//新增置管
angular.module('infi-basic').directive('addCatheter', ['$location',function ($location) {
    return {
        restrict: 'A',
        templateUrl: 'html/tpl/add.catheter.html',
        scope:{
            evaluate:'=',  //可行性评估
            entity:'='
        },
        link:function(scope){
            scope.tubeTartget = function(type){
                $("#addCatheter").modal('hide');
                setTimeout(function(){
                    if(scope.evaluate){
                        window.location.href = "#/catheter-record/catheter/add/"+scope.entity.patientId+"/"+type+"?feasibilityId="+scope.evaluate.uniqueId;
                    }else{
                        window.location.href = "#/catheter-record/catheter/add/"+scope.entity.patientId+"/"+type;
                    }
                },500)
            };
            // 暂时不能用,因为取消的话也会关闭模态框
            // $('#addCatheter').on('hidden.bs.modal', function () {
            //     window.location.href = "#/catheter-details";
            // })
        }
    }
}]);

//多层级的表单录入
angular.module('infi-basic').directive('formRecord', [function () {
    return {
        restrict: 'A',
        templateUrl: 'html/tpl/form.record.html',
        scope:{
            list:'='
        },
        link:function(scope){

        }
    }
}]);

//表单录入,一行显示一个表单控件
angular.module('infi-basic').directive('partFormOne', [function () {
    return {
        restrict: 'A',
        templateUrl: 'html/tpl/part.form.one.html',
        scope:{
            formOne:'='
        }
    }
}]);

//表单录入,一行显示两个表单控件,多用于交互出来的表单
angular.module('infi-basic').directive('partFormTwo', [function () {
    return {
        restrict: 'A',
        templateUrl: 'html/tpl/part.form.two.html',
        scope:{
            formTwo:'='
        }
    }
}]);

//置管记录的录入页,因为它自己有两层交互,所以单独写
angular.module('infi-basic').directive('formCatheter', [function () {
    return {
        restrict: 'A',
        templateUrl: 'html/tpl/form.catheter.html',
        scope:{
            formOne:'=',
            lengthBlur:'&'
        }
    }
}]);

//置管记录的录入页,因为它自己有两层交互,所以单独写
angular.module('infi-basic').directive('formDetails', [function () {
    return {
        restrict: 'A',
        templateUrl: 'html/tpl/form.details.html',
        scope:{
            detailsList:'='
        }
    }
}]);
//确认删除
angular.module('infi-basic').directive('confirmDeletion', [function () {
    return {
        restrict: 'A',
        templateUrl: 'html/tpl/confirm.deletion.html',
        scope:{
            data:'=',
            confirmDelete:'&'
        }
    }
}]);


/**
 * 提示框
 */
angular.module('infi-basic').directive('sysTip',['$timeout',function($timeout){
    return {
        restrict : 'A',
        template:'<div ng-if="sysTip.status" '+
        'ng-class="{\'ok\':\'notice\',\'querying\':\'notice\',\'error\':\'notice_error\'}[sysTip.status]">'+
        '{{sysTip.description}}</div>'
    };
}]);