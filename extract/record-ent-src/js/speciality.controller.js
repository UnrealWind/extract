angular.module('infi-basic').controller('specialityController', ['$scope','specialityService',function ($scope,specialityService){

    $scope.rkjcTabs = {
        value:"zkjc_ekjx",
        name:"zkjc_rkjc",
        tabs:[
            {
                label:"耳廓畸形",
                name:"zkjc_ekjx",
                active:true
            },{
                label:"耳廓炎症",
                name:"zkjc_ekyz",
                active:false
            },{
                label:"耳廓肿瘤",
                name:"zkjc_ekzl",
                active:false
            },{
                label:"耳廓外伤",
                name:"zkjc_ekws",
                active:false
            },{
                label:"耳廓其他异常",
                name:"zkjc_ekqt",
                active:false
            }
        ]
    };
    $scope.wedjcTabs = {
        value:"zkjc_wedjx",
        name:"zkjc_wedjc",
        tabs:[
            {
                label:"外耳道畸形",
                name:"zkjc_wedjx",
                active:true
            },{
                label:"外耳道肿瘤",
                name:"zkjc_wedzl",
                active:false
            },{
                label:"外耳道外伤",
                name:"zkjc_wedws",
                active:false
            },{
                label:"外耳道异物",
                name:"zkjc_wedyw",
                active:false
            },{
                label:"外耳道炎症",
                name:"zkjc_wedyz",
                active:false
            },{
                label:"外耳道其他异常",
                name:"zkjc_wedqt",
                active:false
            }
        ]
    };

    $scope.gmjcTabs = {
        value:"zkjc_gmjx",
        name:"zkjc_gmjc",
        tabs:[
            {
                label:"鼓膜畸形",
                name:"zkjc_gmjx",
                active:true
            },{
                label:"鼓膜炎症",
                name:"zkjc_gmyz",
                active:false
            },{
                label:"鼓膜外伤",
                name:"zkjc_gmws",
                active:false
            },{
                label:"鼓膜异物",
                name:"zkjc_gmyw",
                active:false
            },{
                label:"鼓膜其他异常",
                name:"zkjc_gmqt",
                active:false
            }
        ]
    };

    $scope.rtjcTabs = {
        value:"zkjc_rtjx",
        name:"zkjc_rtjc",
        tabs:[
            {
                label:"乳突畸形",
                name:"zkjc_rtjx",
                active:true
            },{
                label:"乳突炎症",
                name:"zkjc_rtyz",
                active:false
            },{
                label:"乳突肿瘤",
                name:"zkjc_rtzl",
                active:false
            },{
                label:"乳突异物",
                name:"zkjc_rtyw",
                active:false
            },{
                label:"乳突其他异常",
                name:"zkjc_rtqt",
                active:false
            }
        ]
    };

    $scope.gsjcTabs = {
        value:"zkjc_gsjx",
        name:"zkjc_gsjc",
        tabs:[
            {
                label:"鼓室畸形",
                name:"zkjc_gsjx",
                active:true
            },{
                label:"鼓室炎症",
                name:"zkjc_gsyz",
                active:false
            },{
                label:"鼓室肿瘤",
                name:"zkjc_gszl",
                active:false
            },{
                label:"鼓室异物",
                name:"zkjc_gsyw",
                active:false
            },{
                label:"鼓室其他异常",
                name:"zkjc_gsqt",
                active:false
            }
        ]
    };

    /********************************颈部*******************************/
    $scope.jbjcTabs = {
        value:"zkjc_jbyc",
        name:"zkjc_jbjc",
        tabs:[
            {
                label:"颈部异常",
                name:"zkjc_jbyc",
                active:true
            },{
                label:"颈部外伤",
                name:"zkjc_jbws",
                active:false
            },{
                label:"颈部炎症",
                name:"zkjc_jbyz",
                active:false
            }
        ]
    };

    $scope.nhgjqycTabs = {
        value:"zkjc_nhgjqyc",
        name:"zkjc_nhgjqyc",
        tabs:[
            {
                label:"颞颌关节区异常",
                name:"zkjc_nhgjqyc",
                active:true
            },{
                label:"颞颌关节区炎症",
                name:"zkjc_nhgjqyz",
                active:false
            }
        ]
    };

    $scope.switchTable = function(list,entity){
        angular.forEach(list.tabs,function(tabs){
            tabs.active = false;
            if(tabs.name == entity.name){
                tabs.active = true;
                list.value = tabs.name;
            }
        })
    }
}]).service('specialityService',['$http',function($http){
    this.getJson = function(){
        return $http.get('data_gen/dimensions.json').then(function success(msg){
            return msg.data;
        })
    }
}]);