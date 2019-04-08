angular.module('infi-basic')
    .controller('DataSelectController',[ '$scope','SYS','DataService','$routeParams',function ($scope,SYS,DataService,$routeParams) {

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
            {name:'NIHSS_出入院评分变化'},{name:'门诊号'},{name:'入院次数'},{name:'性别'},{name:'年龄'},{name:'住院天数'},{name:'收缩压'},{name:'舒张压'},{name:'身高'},{name:'体重'},{name:'bmi'},{name:'高血压'},{name:'高脂血症'},{name:'糖尿病'},{name:'吸烟史'},{name:'饮酒史'},{name:'甘油三酯'},{name:'高密度脂蛋白'},{name:'低密度脂蛋白'},{name:'总胆固醇'},{name:'纤维蛋白原'},{name:'国际标准化比值'},{name:'糖化血红蛋白'},{name:'丙氨酸氨基转移酶'},{name:'肌酐'},{name:'葡萄糖'},{name:'阿托伐他汀_是否用药'},{name:'阿司匹林_是否用药'},{name:'氯吡格雷_是否用药'},{name:'肝素_是否用药'}

        ]
        $scope.contents = [
            // {
            //     name:'脑梗死患者分析',
            //     header:[
            //         {name:'NIHSS出入院评分变化'},{name:'门诊号'},{name:'入院次数'},{name:'性别'},{name:'年龄'},{name:'住院天数'},{name:'收缩压'},{name:'舒张压'},{name:'身高'},{name:'体重'},{name:'bmi'},{name:'高血压'},{name:'高脂血症'},{name:'糖尿病'},{name:'吸烟史'},{name:'饮酒史'},{name:'甘油三酯'},{name:'高密度脂蛋白'},{name:'低密度脂蛋白'},{name:'总胆固醇'},{name:'纤维蛋白原'},{name:'国际标准化比值'},{name:'糖化血红蛋白'},{name:'丙氨酸氨基转移酶'},{name:'肌酐'},{name:'葡萄糖'},{name:'阿托伐他汀_是否用药'},{name:'阿司匹林_是否用药'},{name:'氯吡格雷_是否用药'},{name:'肝素_是否用药'}
            //     ],
            //     data:[
            //         [
            //             {value:'0 '},{value:'24393200'},{value:'2'},{value:'男'},{value:'57 '},{value:'11 '},{value:'133 '},{value:'80 '},{value:'180 '},{value:'100 '},{value:'31 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'2.02 '},{value:'0.99 '},{value:'2.88 '},{value:'4.44 '},{value:'3.45 '},{value:'0.93 '},{value:'6.60 '},{value:'21 '},{value:'77 '},{value:'6.17 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'1 '}
            //         ],
            //         [
            //             {value:'0 '},{value:'24403300'},{value:'6'},{value:'男'},{value:'61 '},{value:'6 '},{value:'150 '},{value:'80 '},{value:'165 '},{value:'69 '},{value:'25 '},{value:'1 '},{value:'0 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'1.67 '},{value:'0.89 '},{value:'3.22 '},{value:'4.25 '},{value:'4.38 '},{value:'0.91 '},{value:''},{value:'18 '},{value:'75 '},{value:'10.13 '},{value:'0 '},{value:'0 '},{value:'1 '},{value:'1 '}
            //         ]
            //     ]
            // }
        ]

        $scope.getNowFormatDate = function() {
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                // + " " + date.getHours() + seperator2 + date.getMinutes()
                // + seperator2 + date.getSeconds()
                ;
            return currentdate;
        }
        $scope.time = $scope.getNowFormatDate();

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
                    name:'脑梗死患者分析',
                    header:[
                        {name:'NIHSS出入院评分变化'},{name:'门诊号'},{name:'入院次数'},{name:'性别'},{name:'年龄'},{name:'住院天数'},{name:'收缩压'},{name:'舒张压'},{name:'身高'},{name:'体重'},{name:'bmi'},{name:'高血压'},{name:'高脂血症'},{name:'糖尿病'},{name:'吸烟史'},{name:'饮酒史'},{name:'甘油三酯'},{name:'高密度脂蛋白'},{name:'低密度脂蛋白'},{name:'总胆固醇'},{name:'纤维蛋白原'},{name:'国际标准化比值'},{name:'糖化血红蛋白'},{name:'丙氨酸氨基转移酶'},{name:'肌酐'},{name:'葡萄糖'},{name:'阿托伐他汀_是否用药'},{name:'阿司匹林_是否用药'},{name:'氯吡格雷_是否用药'},{name:'肝素_是否用药'}
                    ],
                    data:[
                        [
                            {value:'0 '},{value:'24393200'},{value:'2'},{value:'男'},{value:'57 '},{value:'11 '},{value:'133 '},{value:'80 '},{value:'180 '},{value:'100 '},{value:'31 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'2.02 '},{value:'0.99 '},{value:'2.88 '},{value:'4.44 '},{value:'3.45 '},{value:'0.93 '},{value:'6.60 '},{value:'21 '},{value:'77 '},{value:'6.17 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'1 '}
                        ],
                        [
                            {value:'0 '},{value:'24403300'},{value:'6'},{value:'男'},{value:'61 '},{value:'6 '},{value:'150 '},{value:'80 '},{value:'165 '},{value:'69 '},{value:'25 '},{value:'1 '},{value:'0 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'1.67 '},{value:'0.89 '},{value:'3.22 '},{value:'4.25 '},{value:'4.38 '},{value:'0.91 '},{value:''},{value:'18 '},{value:'75 '},{value:'10.13 '},{value:'0 '},{value:'0 '},{value:'1 '},{value:'1 '}
                        ]
                    ]
                },
                // {
                //     name:'脑梗死患者分析',
                //     header:[
                //         {name:'NIHSS出入院评分变化'},{name:'门诊号'},{name:'入院次数'},{name:'性别'},{name:'年龄'},{name:'住院天数'},{name:'收缩压'},{name:'舒张压'},{name:'身高'},{name:'体重'},{name:'bmi'},{name:'高血压'},{name:'高脂血症'},{name:'糖尿病'},{name:'吸烟史'},{name:'饮酒史'},{name:'甘油三酯'},{name:'高密度脂蛋白'},{name:'低密度脂蛋白'},{name:'总胆固醇'},{name:'纤维蛋白原'},{name:'国际标准化比值'},{name:'糖化血红蛋白'},{name:'丙氨酸氨基转移酶'},{name:'肌酐'},{name:'葡萄糖'},{name:'阿托伐他汀_是否用药'},{name:'阿司匹林_是否用药'},{name:'氯吡格雷_是否用药'},{name:'肝素_是否用药'}
                //     ],
                //     data:[
                //         [
                //             {value:'0 '},{value:'24393200'},{value:'2'},{value:'男'},{value:'57 '},{value:'11 '},{value:'133 '},{value:'80 '},{value:'180 '},{value:'100 '},{value:'31 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'2.02 '},{value:'0.99 '},{value:'2.88 '},{value:'4.44 '},{value:'3.45 '},{value:'0.93 '},{value:'6.60 '},{value:'21 '},{value:'77 '},{value:'6.17 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'1 '}
                //         ],
                //         [
                //             {value:'0 '},{value:'24403300'},{value:'6'},{value:'男'},{value:'61 '},{value:'6 '},{value:'150 '},{value:'80 '},{value:'165 '},{value:'69 '},{value:'25 '},{value:'1 '},{value:'0 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'1.67 '},{value:'0.89 '},{value:'3.22 '},{value:'4.25 '},{value:'4.38 '},{value:'0.91 '},{value:''},{value:'18 '},{value:'75 '},{value:'10.13 '},{value:'0 '},{value:'0 '},{value:'1 '},{value:'1 '}
                //         ]
                //     ]
                // }
            ]
        }
        $scope.extract = function(){
            // $('#extract-modal').modal({backdrop:'static'});
            window.location.href= '/extract-src-record/#/view';
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
            window.location.href = '#/variable.set';
        }
        if($routeParams.id){
            $scope.contents = [
                {
                    name:'脑梗死患者分析',
                    header:[
                        {name:'NIHSS出入院评分变化'},{name:'门诊号'},{name:'入院次数'},{name:'性别'},{name:'年龄'},{name:'住院天数'},{name:'收缩压'},{name:'舒张压'},{name:'身高'},{name:'体重'},{name:'bmi'},{name:'高血压'},{name:'高脂血症'},{name:'糖尿病'},{name:'吸烟史'},{name:'饮酒史'},{name:'甘油三酯'},{name:'高密度脂蛋白'},{name:'低密度脂蛋白'},{name:'总胆固醇'},{name:'纤维蛋白原'},{name:'国际标准化比值'},{name:'糖化血红蛋白'},{name:'丙氨酸氨基转移酶'},{name:'肌酐'},{name:'葡萄糖'},{name:'阿托伐他汀_是否用药'},{name:'阿司匹林_是否用药'},{name:'氯吡格雷_是否用药'},{name:'肝素_是否用药'}
                    ],
                    data:[
                        [
                            {value:'0 '},{value:'24393200'},{value:'2'},{value:'男'},{value:'57 '},{value:'11 '},{value:'133 '},{value:'80 '},{value:'180 '},{value:'100 '},{value:'31 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'2.02 '},{value:'0.99 '},{value:'2.88 '},{value:'4.44 '},{value:'3.45 '},{value:'0.93 '},{value:'6.60 '},{value:'21 '},{value:'77 '},{value:'6.17 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'1 '}
                        ],
                        [
                            {value:'0 '},{value:'24403300'},{value:'6'},{value:'男'},{value:'61 '},{value:'6 '},{value:'150 '},{value:'80 '},{value:'165 '},{value:'69 '},{value:'25 '},{value:'1 '},{value:'0 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'1.67 '},{value:'0.89 '},{value:'3.22 '},{value:'4.25 '},{value:'4.38 '},{value:'0.91 '},{value:''},{value:'18 '},{value:'75 '},{value:'10.13 '},{value:'0 '},{value:'0 '},{value:'1 '},{value:'1 '}
                        ]
                    ]
                },
                // {
                //     name:'脑梗死患者分析',
                //     header:[
                //         {name:'NIHSS出入院评分变化'},{name:'门诊号'},{name:'入院次数'},{name:'性别'},{name:'年龄'},{name:'住院天数'},{name:'收缩压'},{name:'舒张压'},{name:'身高'},{name:'体重'},{name:'bmi'},{name:'高血压'},{name:'高脂血症'},{name:'糖尿病'},{name:'吸烟史'},{name:'饮酒史'},{name:'甘油三酯'},{name:'高密度脂蛋白'},{name:'低密度脂蛋白'},{name:'总胆固醇'},{name:'纤维蛋白原'},{name:'国际标准化比值'},{name:'糖化血红蛋白'},{name:'丙氨酸氨基转移酶'},{name:'肌酐'},{name:'葡萄糖'},{name:'阿托伐他汀_是否用药'},{name:'阿司匹林_是否用药'},{name:'氯吡格雷_是否用药'},{name:'肝素_是否用药'}
                //     ],
                //     data:[
                //         [
                //             {value:'0 '},{value:'24393200'},{value:'2'},{value:'男'},{value:'57 '},{value:'11 '},{value:'133 '},{value:'80 '},{value:'180 '},{value:'100 '},{value:'31 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'2.02 '},{value:'0.99 '},{value:'2.88 '},{value:'4.44 '},{value:'3.45 '},{value:'0.93 '},{value:'6.60 '},{value:'21 '},{value:'77 '},{value:'6.17 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'1 '}
                //         ],
                //         [
                //             {value:'0 '},{value:'24403300'},{value:'6'},{value:'男'},{value:'61 '},{value:'6 '},{value:'150 '},{value:'80 '},{value:'165 '},{value:'69 '},{value:'25 '},{value:'1 '},{value:'0 '},{value:'1 '},{value:'1 '},{value:'1 '},{value:'1.67 '},{value:'0.89 '},{value:'3.22 '},{value:'4.25 '},{value:'4.38 '},{value:'0.91 '},{value:''},{value:'18 '},{value:'75 '},{value:'10.13 '},{value:'0 '},{value:'0 '},{value:'1 '},{value:'1 '}
                //         ]
                //     ]
                // }
            ]
        }
    }]);