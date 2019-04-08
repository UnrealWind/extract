

angular.module("infi-basic").directive('rootCrfConfig',['crfConfigServices','SYS','Upload',function(crfConfigServices,SYS,Upload){
    return {
        restrict: 'ECMA',
        templateUrl: './html3/rootCrfConfig.html',
        replace: true,
        scope:{
            crfData:'='
        },
        link:function(scope,element,attrs){

            !scope.crfData?init():undefined;
            function init(){
                crfConfigServices.getCRFinitData().then(function (msg) {
                    scope.crfData = msg.data;
                });
            }

            scope.showMark = '';
            scope.submit = {
                label:'',
                value:'',
                parentKey:''
            };
            scope.onFileSelect = function($files,input){
                for(var i = 0; i < $files.length; i++){
                    upload($files[i]);
                }
                function upload(file){
                    var url = SYS.url+'load/profiles/save?project='+sessionStorage["tagVal"];
                    var data = {};
                    scope.upload = Upload.upload({
                        url: url,
                        method: 'post',
                        file: file,
                        params: data
                    }).progress(function(evt){
                        scope.showTip = 'blue';
                    }).then(function (msg){
                        msg.data.status=='ok'?scope.showTip = 'green':scope.showTip = 'red';
                    });
                };
            };
            scope.changeTip = function () {
                scope.showTip = false;
            };
            scope.save = function () {

                scope.submit.parentKey = sessionStorage["tagParentKey"];
                crfConfigServices.saveChild(scope.submit).then(function (msg) {
                    msg.data['arrow'] = 'right';
                    sessionStorage["tagParentKey"] == ''?scope.crfData.push(msg.data):add(scope.crfData);
                    function add(arr) {
                        arr.forEach(function (n,i) {
                            n.treeKey == sessionStorage["tagParentKey"]?n.children.push(msg.data):undefined;
                            n.children && n.children.length>0?add(n.children):undefined;
                        })
                    }
                });
                scope.submit = {
                    label:'',
                    value:'',
                    parentKey:''
                };

            }

            scope.modal = function (data,mark) {
                scope.showTip = false;
                sessionStorage["tagParentKey"] = '';
                mark == 'child'|| mark =='crf'?$('#'+mark).modal():$('#update').modal();
            }
        }
    };
}]);

angular.module("infi-basic").directive('crfConfig',['crfConfigServices',function(crfConfigServices){
    return {
        restrict: 'ECMA',
        templateUrl: './html3/crfConfig.html',
        replace: true,
        scope:{
            crfData:'=',
            showMark:'='
        },
        link:function(scope,element,attrs){
            scope.choseNavi = function (navi) {
                navi.arrow == 'down'?navi.arrow = 'right':navi.arrow = 'down';
            }

            scope.modal = function (data,mark) {
                sessionStorage["tagVal"] = data.value;
                sessionStorage["tagLabel"] = data.label;
                sessionStorage["tagParentKey"] = data.treeKey;
                mark == 'child'|| mark =='crf'?$('#'+mark).modal():$('#update').modal();
            }
        }
    };
}]);