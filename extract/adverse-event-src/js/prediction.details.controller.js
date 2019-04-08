angular.module('infi-basic').controller('PredictionDetailsController', ['$scope', 'SYS', '$location','PredictionDetailsService','$routeParams', function($scope,SYS,$location,PredictionDetailsService,$routeParams){

    $scope.params = {
        patientId:$routeParams.patientId,
        date:$routeParams.date
    };
    $scope.showTime = "";
    $scope.navi = "";
    $scope.patientBasic = "";
    $scope.currentNaviName = "";
    $scope.dataSort = [];
    $scope.dataSort1 = [];
    $scope.dataSort2 = [];
    $scope.lock = false;
    $scope.tabs = [
        {
            label:"预测依据",
            active:true,
            name:"basis",
            url:"adverse/prediction/accord/gist",
            // url:"basic.content.json",
            data:""
        },{
            label:"相关危险因素处理",
            active:false,
            name:"danger",
            url:"adverse/prediction/danger/factor",
            // url:"danger.content.json",
            data:""
        },{
            label:"不良事件相关文献",
            active:false,
            name:"adverse",
            url:"adverse/prediction/literature",
            // url:"literature.content.json",
            data:""
        }
    ];
    $scope.currentTab = $scope.tabs[0];
    function init(){
        //获取左侧tab导航
        // PredictionDetailsService.getNavi().then(function(msg){
        //     $scope.navi = msg.data;
        // });

        PredictionDetailsService.getNavi($scope.params.patientId,$scope.params.date).then(function(msg){
            $scope.navi = filterContent(msg.data);
            angular.forEach($scope.navi,function(navi,index){
                if(index == 0){
                    navi.active = true;
                    $scope.currentNaviName = navi.secondEvent;
                    $scope.getNaviData(navi.id);
                }
            })
        });
        //显示日期
        if($scope.params.date){
            $scope.showTime = $scope.params.date;
        }
        $scope.switchTab($scope.tabs[0]);
    }
    /**
     * 切换tab(按右侧tab)
     * @param tab
     */
    $scope.switchTab = function(tab){
        angular.forEach($scope.tabs,function(tabs){
            tabs.active = false;
            if(tabs.label == tab.label){
                tabs.active = true;
                $scope.currentTab = tabs;
            }
        });
    };

    /**
     * 给每一行设置状态
     * @param content
     * @returns {*}
     */
    function filterContent(content){
        angular.forEach(content,function(entity){
            if(Number(entity.occurPro) <50 || entity.occurPro==""){
                entity.status = 'green';
            }else if(Number(entity.occurPro)>=50 && Number(entity.occurPro)<60){
                entity.status = 'yellow';
            }else if(Number(entity.occurPro)>=60 && Number(entity.occurPro)<80){
                entity.status = 'orange';
            }else if(Number(entity.occurPro)>=80){
                entity.status = 'red';
            }
        });
        return content;
    }

    /**
     * 切换左侧导航
     * @param entity
     */
    $scope.switchNavi = function(entity){
        angular.forEach($scope.navi,function(navi){
            navi.active = false;
            $scope.lock = false;
            if(navi.secondEvent == entity.secondEvent){
                navi.active = true;
                $scope.currentNaviName = navi.secondEvent;
                $scope.getNaviData(navi.id);
            }
        })
    };
    /**
     *
     * 根据当前事件获取右侧数据
     * @param id
     */
    $scope.getNaviData = function(id){
        $scope.dataSort1 = [];//每次都清空，防止重复添加
        $scope.dataSort2 = [];
        $('.tfooter').css('display','block');
        //获取基本信息
        PredictionDetailsService.getBasic($scope.params.patientId,id).then(function(msg){
            //获取基本信息
            if(msg.success && msg.data.length>0){
                $scope.patientBasic = msg.data[0];
            }else{
                $scope.patientBasic = null;
            }
            angular.forEach($scope.tabs,function(tabs,index){
                PredictionDetailsService.getTabContent({
                    url:tabs.url,
                    patientId:$scope.params.patientId,
                    id:id
                }).then(function(msg){
                    if(tabs.label == '预测依据'){
                        $scope.dataSort = msg.data;
                        angular.forEach($scope.dataSort,function (data) {
                            if(data.type == 'reason') {
                                $scope.dataSort1.push(data);
                            }else {
                                $scope.dataSort2.push(data);
                            }
                        })
                    }
                    tabs.data = msg.data;
                });
                if(index == 0){
                    tabs.active = true;
                }
            });
        });

    };
    $scope.addMoreData = function(){
        angular.forEach($scope.dataSort2,function (data) {
            $scope.dataSort1.push(data);
        });
        $scope.lock = true;
    };
    $scope.viewPdf = function(entity){
        window.open('#/adverse-pdf/'+entity.value);
    };
    init();

}]).service('PredictionDetailsService',['SYS','$http',function(SYS,$http){
    /**
     * 获取左侧导航
     * @returns {*}
     */
    this.getNavi = function(patiId,date){
        return $http.get(SYS.url+'adverse/prediction/today?filter_patiId='+patiId+"&filter_happenDate="+date).then(function(msg){
        // return $http.get(SYS.jsonUrl + 'today.json').then(function(msg){
            return msg.data;
        })
    };
    /**
     * 获取基本信息
     * @returns {*}
     */
    this.getBasic = function(patientId,id){
        return $http.get(SYS.url + 'adverse/prediction/accord/basic?filter_patiId='+patientId+'&filter_id='+id).then(function(msg){
        // return $http.get(SYS.jsonUrl + 'person.basic.json').then(function(msg){
            return msg.data;
        })
    };

    /**
     * 获取tab内容
     * @param filter
     * @returns {*}
     */
    this.getTabContent = function(filter){
        return $http.get(SYS.url+filter.url+'?filter_patiId='+filter.patientId+'&filter_id='+filter.id).then(function(msg){
        // return $http.get(SYS.jsonUrl+url).then(function(msg){
            return msg.data;
        })
    }
}]);