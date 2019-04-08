angular.module('infi-basic').
controller('diseaseInput', 
    ['$scope', 'SYS','DiseaseInputServices','BasicServices','$routeParams', 
    function ($scope, SYS,DiseaseInputServices,BasicServices,$routeParams) {

    //获取表单初始 数据
    BasicServices.getData({
            'data':'',
            'url':'../diseases-plan-src/data/inputFile'+$routeParams.class_id+'.json',
            'method':'get'
        }).then(function success(msg) {
        $scope.defaultData = msg;
        getDetail()
    });


    function getDetail(){
        DiseaseInputServices.getDetail($scope.defaultData,$routeParams).then(function success(msg) {
            $scope.currentData = msg;
        });
    }

    $scope.save = function(){
        var opt ={};
        if($routeParams.type == 'pneumonia'){
            if($scope.currentData != ''){
                $scope.currentData.forEach(function(n,i){
                    var pne = [];
                    n.data.forEach(function (ni,i) {
                        pne.push({"item_id":ni.id, "value": ni.value, "item_name": ni.label})
                    })
                    opt[n.name] = pne;
                })
            }
        }else {
            if($scope.currentData != ''){
                $scope.currentData.forEach(function(n,i){
                    initData(n.data)
                })
            }
            function initData(arr){
                arr.forEach(function(ny,iy){
                    ny.type!== '虚拟菜单'?opt[ny.name] = ny.value:undefined;
                    if(ny.children && ny.children.length>0){
                        ny.children.forEach(function(ni,ii){
                            ni.children.forEach(function(nz,iz){
                                opt[nz.name] = nz.value;
                                if(nz.children && ny.children.length>0){
                                    initData(nz.children)
                                };
                            })
                        });
                    }
                    if(ny.type== '虚拟菜单'){
                        initData(ny.children);
                    };
                });
            }
        }

        sessionStorage.setItem('diseaseParam',JSON.stringify(opt));
        //DiseaseInputServices.saveDetail(opt,$routeParams).then(function success(msg) {
            window.location.href='#/disease-plan-list/'+$routeParams.pati_id+'/'+$routeParams.pati_visit_id+'/'
        +$routeParams.class_id+'/'+$routeParams.type;
        //});
    }

    $scope.back = function(){
        window.location.href = '#/disease-list/'+$routeParams.type;
    }

}]);