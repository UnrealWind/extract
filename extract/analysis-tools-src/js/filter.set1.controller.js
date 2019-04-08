angular.module('infi-basic')
    .controller('FilterSet1Controller',[ '$scope','SYS','DataService',function ($scope,SYS,DataService) {
        $scope.content = {
            "page":{
                "totalPages": 5,
                "firstPage": true,
                "lastPage": true,
                "numberOfElements": 10,
                "totalElements": 50,
                "size": 10,
                "number": 0
            }
        }
        $scope.filterData = []
        $scope.filterNameValue = '';
        $scope.hasData = false;
        $scope.selectData = true;
        $scope.zhubie = {value:''};
        $scope.zhubieValue = [
            {name:'全部',value:''},
            {name:'实验组',value:'1'},
            {name:'对照组',value:'2'}
        ]
        $scope.tableTheader = [
            {name:'pati_id'},
            {name:'hearing_outcome'},
            {name:'sex'},
            {name:'age'},
            {name:'time_elapse'},
            {name:'opposite_HL'},
            {name:'opposite_audiogram'},
            {name:'bt_avg_new'},
            {name:'PTA_bt'},
            {name:'infectious_etiology'},
            {name:'dyslipidemia'},
            {name:'hypertension'},
            {name:'diabetes'},
            {name:'BMI'},
            {name:'systematic_steroids'},
            {name:'local_steroids'},
            {name:'Hypoglycemic_agents'},
            {name:'antidinic_drug'},
            {name:'antidepressive_drugs'},
            {name:'EGb761'},
            {name:'Alprostadil'},
            {name:'WBC_max'},
            {name:'ALT_max'},
            {name:'monocytes_max'}
        ]
        $scope.exploration1 = '#/exploration2';
        $scope.addFilter = function(){
            $scope.filterNameValue = '';
            $scope.increase = '';
            $scope.range = '';
            $scope.ranges = '';
            $scope.rules = '';
            $('#set-modal').modal({backdrop:'static'});
        }
        $scope.updatePage = function(data){
            DataService.ajaxDataFilterPage(data.page).then(function(data){
                $scope.tableTbody = []
                $scope.tableTbodys = []
                for(var i = 0 ; i < data.length ; i++){
                    angular.forEach(data[i], function(data,index,array){
                        $scope.tableTbody.push({'value':data})
                    });
                    $scope.tableTbodys.push($scope.tableTbody);
                    $scope.tableTbody = []
                }
            });
        }
        $scope.dataCheckClick = function(data){
            if(data.bb){
                data.select = true
            }else{
                data.select = false
            }
        }
        $scope.entitysSelectData = {value:''}
        $scope.entitysSelect = function(entitys){
            if(entitys.value == 1){
                for(var i = 0 ; i < $scope.filterData.length ; i++){
                    $scope.filterData[i].option.splice(1,1);
                }
                entitys.option.push({name:'实验组',value:'1'})
            }
        }
        $scope.setSave = function(){
            $scope.filterData.push({name:$scope.filterNameValue,value:'',bb:'',select:false,option:[{name:'对照组',value:'2'},{name:'实验组',value:'1'}]});
            $scope.hasData = true;
            $('#set-modal').modal('hide');
        }
        $scope.save = function(){
            $('#set-save').modal({backdrop:'static'});
        }

        $scope.zhubieClick = function(){
            $scope.content = {
                "page":{
                    "totalPages": 5,
                    "firstPage": true,
                    "lastPage": true,
                    "numberOfElements": 10,
                    "totalElements": 50,
                    "size": 10,
                    "number": 0
                }
            }
            if($scope.zhubie.value == 1){
                DataService.ajaxshiyanzuModal().then(function(data){
                    $scope.tableTbody = []
                    $scope.tableTbodys = []
                    for(var i = 0 ; i < data.length ; i++){
                        angular.forEach(data[i], function(data,index,array){
                            $scope.tableTbody.push({'value':data})
                        });
                        $scope.tableTbodys.push($scope.tableTbody);
                        $scope.tableTbody = []
                    }
                });
            }else if($scope.zhubie.value == 2){
                DataService.ajaxduizhaozuModal().then(function(data){
                    $scope.tableTbody = []
                    $scope.tableTbodys = []
                    for(var i = 0 ; i < data.length ; i++){
                        angular.forEach(data[i], function(data,index,array){
                            $scope.tableTbody.push({'value':data})
                        });
                        $scope.tableTbodys.push($scope.tableTbody);
                        $scope.tableTbody = []
                    }
                });
            }else{
                DataService.ajaxDataFilterPage().then(function(data){
                    $scope.tableTbody = []
                    $scope.tableTbodys = []
                    for(var i = 0 ; i < data.length ; i++){
                        angular.forEach(data[i], function(data,index,array){
                            $scope.tableTbody.push({'value':data})
                        });
                        $scope.tableTbodys.push($scope.tableTbody);
                        $scope.tableTbody = []
                    }
                });
            }

        }
        $scope.balanceSave = function () {
            $('#set-save').modal('hide');
            $scope.selectData = false;
            DataService.ajaxDataFilterPage().then(function(data){
                $scope.tableTbody = []
                $scope.tableTbodys = []
                for(var i = 0 ; i < data.length ; i++){
                    angular.forEach(data[i], function(data,index,array){
                        $scope.tableTbody.push({'value':data})
                    });
                    $scope.tableTbodys.push($scope.tableTbody);
                    $scope.tableTbody = []
                }
            });
            // $('#raw-filter').modal({backdrop:'static'});
        }

        $scope.next = function(){
            window.location.href = '#/model';
        }

        $scope.increase = false;
        $scope.rules = false;
        $scope.range = false;
        $scope.ranges = false;
        $scope.rulesData = {value:''};
        $scope.rulesClick = function(){
            if($scope.rulesData.value == 4){
                $scope.range = true;
                $scope.ranges = true;
            }else{
                $scope.range = true;
                $scope.ranges = false;
            }
        }
        $scope.increaseClick = function(){
            $scope.rules = true;
        }
        $scope.addRule = function(){
            $scope.increase = true;
        }
        $scope.previous = function(){
            $scope.selectData = true;
        }
    }]);