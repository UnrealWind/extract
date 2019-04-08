angular.module('infi-basic')
    .controller('DataSelect1Controller',[ '$scope','SYS','DataService','$routeParams',function ($scope,SYS,DataService,$routeParams) {

        $scope.exploration1 = '#/exploration1';
        $scope.selectData = true;
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
        $scope.contents = [
            {
                name:'PCI手术',
                header:[
                    {name:'门诊号'},
                    {name:'入院第几次'},
                    {name:'入院时间'},
                    {name:'出院时间'},
                    {name:'糖尿病'},
                    {name:'高血压'},
                    {name:'高血脂'},
                    {name:'肾功能'}
                ],
                data:[
                    [
                        {value:11169},
                        {value:7},
                        {value:'2010/06/09 15:08:00'},
                        {value:'2010/06/12 10:10:00'},
                        {value:0},
                        {value:1},
                        {value:1},
                        {value:0}
                    ],
                    [
                        {value:134157},
                        {value:3},
                        {value:'2012/04/20 15:47:00'},
                        {value:'2012/06/04 15:32:00'},
                        {value:0},
                        {value:1},
                        {value:0},
                        {value:1}
                    ]
                ]
            },
        ]
        $scope.updatePage = function(data){
            DataService.ajaxDataSelectPage(data.page).then(function(data){
                $scope.tableTbody = []
                $scope.tableTbodys = []
                for(var i = 0 ; i < data.length ; i++){
                    angular.forEach(data[i], function(data,index,array){
                        $scope.tableTbody.push({'value':data})
                    });
                    $scope.tableTbodys.push($scope.tableTbody);
                    $scope.tableTbody = []
                }
            })
        }
        $scope.inviteDelete = function(name){
            for(var i = 0 ; i < $scope.contents.length ; i++){
                if(name == $scope.contents[i].name){
                    // delete $scope.contents[i];
                    $scope.contents.splice(i,1);
                    console.log($scope.contents);
                }
            }
        }
        $scope.onFileSelect = function($file){
            if($file.length > 0){
                $('#execl-data').modal({backdrop:'static'});
            }
        }
        $scope.execlSave = function(){
            $('#execl-data').modal('hide');
            $scope.contents = [
                {
                    name:'test1',
                    header:[
                        {name:'pati_id'},
                        {name:'hearing_outcome'},
                        {name:'sex'},
                        {name:'age'},
                        {name:'time_elapse'},
                        {name:'opposite_HL'},
                        {name:'opposite_audiogram'},
                        {name:'bt_avg_new'}
                    ],
                    data:[
                        [
                            {value:48392},
                            {value:1},
                            {value:1},
                            {value:79},
                            {value:5},
                            {value:''},
                            {value:''},
                            {value:94.17}
                        ],
                        [
                            {value:60698},
                            {value:0},
                            {value:1},
                            {value:83},
                            {value:2},
                            {value:2},
                            {value:2},
                            {value:70}
                        ]
                    ]
                },
                {
                    name:'PCI手术',
                    header:[
                        {name:'门诊号'},
                        {name:'入院第几次'},
                        {name:'入院时间'},
                        {name:'出院时间'},
                        {name:'糖尿病'},
                        {name:'高血压'},
                        {name:'高血脂'},
                        {name:'肾功能'}
                    ],
                    data:[
                        [
                            {value:11169},
                            {value:7},
                            {value:'2010/06/09 15:08:00'},
                            {value:'2010/06/12 10:10:00'},
                            {value:0},
                            {value:1},
                            {value:1},
                            {value:0}
                        ],
                        [
                            {value:134157},
                            {value:3},
                            {value:'2012/04/20 15:47:00'},
                            {value:'2012/06/04 15:32:00'},
                            {value:0},
                            {value:1},
                            {value:0},
                            {value:1}
                        ]
                    ]
                }
            ]
        }
        $scope.extract = function(){
            // $('#extract-modal').modal({backdrop:'static'});
            window.location.href= '/extract-demo-src/#/view';
        }
        $scope.tableTbody = []
        $scope.rawDataModal = function(){
            $scope.selectData = false;
            DataService.ajaxRawDataModal().then(function(data){
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
        $scope.previous = function(){
            $scope.selectData = true;
        }
        $scope.next = function(){
            window.location.href = '#/data.select2';
        }
        if($routeParams.id){
            $scope.contents = [
                {
                    name:'test1',
                    header:[
                        {name:'pati_id'},
                        {name:'hearing_outcome'},
                        {name:'sex'},
                        {name:'age'},
                        {name:'time_elapse'},
                        {name:'opposite_HL'},
                        {name:'opposite_audiogram'},
                        {name:'bt_avg_new'}
                    ],
                    data:[
                        [
                            {value:48392},
                            {value:1},
                            {value:1},
                            {value:79},
                            {value:5},
                            {value:''},
                            {value:''},
                            {value:94.17}
                        ],
                        [
                            {value:60698},
                            {value:0},
                            {value:1},
                            {value:83},
                            {value:2},
                            {value:2},
                            {value:2},
                            {value:70}
                        ]
                    ]
                },
                {
                    name:'PCI手术',
                    header:[
                        {name:'门诊号'},
                        {name:'入院第几次'},
                        {name:'入院时间'},
                        {name:'出院时间'},
                        {name:'糖尿病'},
                        {name:'高血压'},
                        {name:'高血脂'},
                        {name:'肾功能'}
                    ],
                    data:[
                        [
                            {value:11169},
                            {value:7},
                            {value:'2010/06/09 15:08:00'},
                            {value:'2010/06/12 10:10:00'},
                            {value:0},
                            {value:1},
                            {value:1},
                            {value:0}
                        ],
                        [
                            {value:134157},
                            {value:3},
                            {value:'2012/04/20 15:47:00'},
                            {value:'2012/06/04 15:32:00'},
                            {value:0},
                            {value:1},
                            {value:0},
                            {value:1}
                        ]
                    ]
                }
            ]
        }
    }]);