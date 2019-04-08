angular.module('infi-basic')
    .controller('explorationController',[ '$scope',function ($scope) {
        $scope.condition = [
            {name:'NIHSS_出入院评分变化',active:'',value:"wuxu",data: {
                label:"NIHSS_出入院评分变化",
                data:[
                    ['0','1983','37.0'],
                    ['1','3381','63.0'],
                    ['总计','5364','100.0']
                ]
            }},
            {name:'性别',active:'',value:"wuxu",data:{
                label:"性别",
                data:[
                    ['女','1289','24.0'],
                    ['男','4075','76.0'],
                    ['总计','5364','100.0']
                ]
            }},
            {name:'高血压',active:'',value:"wuxu",data:{
                label:"高血压",
                data:[
                    ['0','2050','38.2'],
                    ['1','3314','61.8'],
                    ['总计','5364','100.0']
                ]
            }},
            {name: '高脂血症',active: '',value:"wuxu",data: {
                label: '高脂血症',
                data: [
                    ['0','4413','82.3'],
                    ['1','951','17.7'],
                    ['总计','5364','100.0']
                ]

            }},
            {
                name:"糖尿病",
                active:"",
                value:"wuxu",
                data:{
                    label:"糖尿病",
                    data:[
                        ['0','3560','66.4'],
                        ['1','1804','33.6'],
                        ['总计','5364','100.0']
                    ]

                }
            },
            {
                name:"饮酒史",
                active:"",
                value:"wuxu",
                data:{
                    label:"饮酒史",
                    data:[
                        ['0','2551','47.6'],
                        ['1','1751','32.6'],
                        ['总计','4302','80.2'],
                        ['缺失','1062','19.8'],
                        ['总计','5364','100.0']
                    ]
                }
            },
            {
                name:"阿托伐他汀_是否用药",
                active:"",
                value:"wuxu",
                data:{
                    label:"阿托伐他汀_是否用药",
                    data:[
                        ['0','1726','32.2'],
                        ['1','3638','67.8'],
                        ['总计','5364','100.0']
                    ]
                }
            },
            {
                name:"阿司匹林_是否用药",
                active:"",
                value:"wuxu",
                data:{
                    label:"阿司匹林_是否用药",
                    data:[
                        ['0','1676','31.2'],
                        ['1','3688','68.8'],
                        ['总计','5364','100.0']
                    ]
                }
            },
            {
                name:"氯吡格雷_是否用药",
                active:"",
                value:"wuxu",
                data:{
                    label:"氯吡格雷_是否用药",
                    data:[
                        ['0','2136','39.8'],
                        ['1','3228','60.2'],
                        ['总计','5364','100.0']
                    ]
                }
            },
            {
                name:"肝素_是否用药",
                active:"",
                value:"wuxu",
                data:{
                    label:"肝素_是否用药",
                    data:[
                        ['0','3920','73.1'],
                        ['1','1444','26.9'],
                        ['总计','5364','100.0']
                    ]
                }
            },
            {name:'年龄',active:'',value:"lianxu",data:{
                label:"年龄",
                data:['年龄','59.9355','12.51597','7.00','97.00','52.0000','60.0000','69.0000']
            }},
            {name:'住院天数',value:"lianxu",active:'',data:{
                label:"住院天数",
                data:['住院天数','-1.9174','361.47823','-9999.00','315.00','7.0000','10.0000','14.0000']

            }},
            {name:'收缩压',value:"lianxu",active:'',data:{
                label:"收缩压",
                data:['收缩压','-266.1048','2141.04992','-9999.00','17090.00','123.0000','140.0000','155.0000']
            }},
            {name:'舒张压',value:"lianxu",active:'',data:{
                label:"舒张压",
                data:['舒张压','-346.0511','2038.80262','-9999.00','902.00','75.0000','80.0000','90.0000']
            }},
            {name:'体重',value:"lianxu",active:'',data:{
                label:"体重",
                data:['体重','72.7541','12.59658','5.00','190.00','65.0000','72.0000','80.0000']
            }},
            {name:'bmi',value:"lianxu",active:'',data:{
                label:"bmi",
                data:['bmi','52.5497','1333.69148','1.00','83333.00','23.0000','25.0000','28.0000']
            }},
            {name:'甘油三酯',value:"lianxu",active:'',data:{
                label:"甘油三酯",
                data:['甘油三酯','1.6009','1.09056','0.22','33.69','1.0200','1.3800','1.8900']
            }},
            {name:'高密度脂蛋白',value:"lianxu",active:'',data:{
                label:"高密度脂蛋白",
                data:['高密度脂蛋白','1.1862','0.33108','0.28','3.58','.9600','1.1500','1.3700']
            }},
            {name:'低密度脂蛋白',value:"lianxu",active:'',data:{
                label:"低密度脂蛋白",
                data:['低密度脂蛋白','2.3729','0.89876','0.33','6.71','1.7000','2.2600','2.9500']
            }},
            {name:'总胆固醇',value:"lianxu",active:'',data:{
                label:"总胆固醇",
                data:['总胆固醇','3.9196','1.07287','1.30','11.47','3.1400','3.8000','4.5700']
            }},
            {name:'纤维蛋白原',value:"lianxu",active:'',data:{
                label:"纤维蛋白原",
                data:['纤维蛋白原','3.5609','1.09922','0.42','11.41','2.8300','3.3600','4.0600']
            }},
            {name:'国际标准化比值',value:"lianxu",active:'',data:{
                label:"国际标准化比值",
                data:['国际标准化比值','1.0247','0.16401','0.75','4.13','0.9600','1.0000','1.0500']
            }},
            {name:'糖化血红蛋白',value:"lianxu",active:'',data:{
                label:"糖化血红蛋白",
                data:['糖化血红蛋白','6.5269','1.51488','3.80','13.70','5.5000','6.0000','7.2000'
                ]
            }},
            {name:'丙氨酸氨基转移酶',value:"lianxu",active:'',data:{
                label:"丙氨酸氨基转移酶",
                data:['丙氨酸氨基转移酶','24.7053','24.50557','1.00','362.00','13.0000','18.0000','28.0000'
                ]
            }},
            {name:'肌酐',value:"lianxu",active:'',data:{
                label:"肌酐",
                data:['肌酐','67.4002','25.07306','19.00','714.00','54.0000','64.0000','75.0000'

                ]
            }},
            {name:'葡萄糖',value:"lianxu",active:'',data:{
                label:"葡萄糖",
                data:['葡萄糖','6.5728','2.60737','1.47','25.50','4.9400','5.6700','7.3100'
                ]
            }}
        ];
        $scope.tablesWuxu = [];

        $scope.tablesLianxu = [];

        $scope.selectedData = '';
        $scope.selectLeftData = '';
        $scope.selectLeft = function(){
            if( $scope.selectLeftData == 1 ){
                $scope.condition = [
                    {name:'NIHSS_出入院评分变化',active:'infi-analysis-background',value:"wuxu",data: {
                        label:"NIHSS_出入院评分变化",
                        data:[
                            ['0','1983','37.0'],
                            ['1','3381','63.0'],
                            ['总计','5364','100.0']
                        ]
                    }},
                    {name:'性别',active:'',value:"wuxu",data:{
                        label:"性别",
                        data:[
                            ['女','1289','24.0'],
                            ['男','4075','76.0'],
                            ['总计','5364','100.0']
                        ]
                    }},
                    {name:'高血压',active:'',value:"wuxu",data:{
                        label:"高血压",
                        data:[
                            ['0','2050','38.2'],
                            ['1','3314','61.8'],
                            ['总计','5364','100.0']
                        ]
                    }},
                    {name: '高脂血症',active: '',value:"wuxu",data: {
                        label: '高脂血症',
                        data: [
                            ['0','4413','82.3'],
                            ['1','951','17.7'],
                            ['总计','5364','100.0']
                        ]

                    }},
                    {
                        name:"糖尿病",
                        active:"",
                        value:"wuxu",
                        data:{
                            label:"糖尿病",
                            data:[
                                ['0','3560','66.4'],
                                ['1','1804','33.6'],
                                ['总计','5364','100.0']
                            ]

                        }
                    },
                    {
                        name:"饮酒史",
                        active:"",
                        value:"wuxu",
                        data:{
                            label:"饮酒史",
                            data:[
                                ['0','2551','47.6'],
                                ['1','1751','32.6'],
                                ['总计','4302','80.2'],
                                ['缺失','1062','19.8'],
                                ['总计','5364','100.0']
                            ]
                        }
                    },
                    {
                        name:"阿托伐他汀_是否用药",
                        active:"",
                        value:"wuxu",
                        data:{
                            label:"阿托伐他汀_是否用药",
                            data:[
                                ['0','1726','32.2'],
                                ['1','3638','67.8'],
                                ['总计','5364','100.0']
                            ]
                        }
                    },
                    {
                        name:"阿司匹林_是否用药",
                        active:"",
                        value:"wuxu",
                        data:{
                            label:"阿司匹林_是否用药",
                            data:[
                                ['0','1676','31.2'],
                                ['1','3688','68.8'],
                                ['总计','5364','100.0']
                            ]
                        }
                    },
                    {
                        name:"氯吡格雷_是否用药",
                        active:"",
                        value:"wuxu",
                        data:{
                            label:"氯吡格雷_是否用药",
                            data:[
                                ['0','2136','39.8'],
                                ['1','3228','60.2'],
                                ['总计','5364','100.0']
                            ]
                        }
                    },
                    {
                        name:"肝素_是否用药",
                        active:"",
                        value:"wuxu",
                        data:{
                            label:"肝素_是否用药",
                            data:[
                                ['0','3920','73.1'],
                                ['1','1444','26.9'],
                                ['总计','5364','100.0']
                            ]
                        }
                    }
                ]
            }else if( $scope.selectLeftData == 2){
                $scope.condition = [
                    {name:'年龄',active:'infi-analysis-background',value:"lianxu",data:{
                        label:"年龄",
                        data:['年龄','59.9355','12.51597','7.00','97.00','52.0000','60.0000','69.0000']
                    }},
                    {name:'住院天数',value:"lianxu",active:'',data:{
                        label:"住院天数",
                        data:['住院天数','-1.9174','361.47823','-9999.00','315.00','7.0000','10.0000','14.0000']

                    }},
                    {name:'收缩压',value:"lianxu",active:'',data:{
                        label:"收缩压",
                        data:['收缩压','-266.1048','2141.04992','-9999.00','17090.00','123.0000','140.0000','155.0000']
                    }},
                    {name:'舒张压',value:"lianxu",active:'',data:{
                        label:"舒张压",
                        data:['舒张压','-346.0511','2038.80262','-9999.00','902.00','75.0000','80.0000','90.0000']
                    }},
                    {name:'体重',value:"lianxu",active:'',data:{
                        label:"体重",
                        data:['体重','72.7541','12.59658','5.00','190.00','65.0000','72.0000','80.0000']
                    }},
                    {name:'bmi',value:"lianxu",active:'',data:{
                        label:"bmi",
                        data:['bmi','52.5497','1333.69148','1.00','83333.00','23.0000','25.0000','28.0000']
                    }},
                    {name:'甘油三酯',value:"lianxu",active:'',data:{
                        label:"甘油三酯",
                        data:['甘油三酯','1.6009','1.09056','0.22','33.69','1.0200','1.3800','1.8900']
                    }},
                    {name:'高密度脂蛋白',value:"lianxu",active:'',data:{
                        label:"高密度脂蛋白",
                        data:['高密度脂蛋白','1.1862','0.33108','0.28','3.58','.9600','1.1500','1.3700']
                    }},
                    {name:'低密度脂蛋白',value:"lianxu",active:'',data:{
                        label:"低密度脂蛋白",
                        data:['低密度脂蛋白','2.3729','0.89876','0.33','6.71','1.7000','2.2600','2.9500']
                    }},
                    {name:'总胆固醇',value:"lianxu",active:'',data:{
                        label:"总胆固醇",
                        data:['总胆固醇','3.9196','1.07287','1.30','11.47','3.1400','3.8000','4.5700']
                    }},
                    {name:'纤维蛋白原',value:"lianxu",active:'',data:{
                        label:"纤维蛋白原",
                        data:['纤维蛋白原','3.5609','1.09922','0.42','11.41','2.8300','3.3600','4.0600']
                    }},
                    {name:'国际标准化比值',value:"lianxu",active:'',data:{
                        label:"国际标准化比值",
                        data:['国际标准化比值','1.0247','0.16401','0.75','4.13','0.9600','1.0000','1.0500']
                    }},
                    {name:'糖化血红蛋白',value:"lianxu",active:'',data:{
                        label:"糖化血红蛋白",
                        data:['糖化血红蛋白','6.5269','1.51488','3.80','13.70','5.5000','6.0000','7.2000'
                        ]
                    }},
                    {name:'丙氨酸氨基转移酶',value:"lianxu",active:'',data:{
                        label:"丙氨酸氨基转移酶",
                        data:['丙氨酸氨基转移酶','24.7053','24.50557','1.00','362.00','13.0000','18.0000','28.0000'
                        ]
                    }},
                    {name:'肌酐',value:"lianxu",active:'',data:{
                        label:"肌酐",
                        data:['肌酐','67.4002','25.07306','19.00','714.00','54.0000','64.0000','75.0000'

                        ]
                    }},
                    {name:'葡萄糖',value:"lianxu",active:'',data:{
                        label:"葡萄糖",
                        data:['葡萄糖','6.5728','2.60737','1.47','25.50','4.9400','5.6700','7.3100'
                        ]
                    }}
                ]
            }else{
                $scope.condition = [
                    {name:'NIHSS_出入院评分变化',active:'',value:"wuxu",data: {
                        label:"NIHSS_出入院评分变化",
                        data:[
                            ['0','1983','37.0'],
                            ['1','3381','63.0'],
                            ['总计','5364','100.0']
                        ]
                    }},
                    {name:'性别',active:'',value:"wuxu",data:{
                        label:"性别",
                        data:[
                            ['女','1289','24.0'],
                            ['男','4075','76.0'],
                            ['总计','5364','100.0']
                        ]
                    }},
                    {name:'高血压',active:'',value:"wuxu",data:{
                        label:"高血压",
                        data:[
                            ['0','2050','38.2'],
                            ['1','3314','61.8'],
                            ['总计','5364','100.0']
                        ]
                    }},
                    {name: '高脂血症',active: '',value:"wuxu",data: {
                        label: '高脂血症',
                        data: [
                            ['0','4413','82.3'],
                            ['1','951','17.7'],
                            ['总计','5364','100.0']
                        ]

                    }},
                    {
                        name:"糖尿病",
                        active:"",
                        value:"wuxu",
                        data:{
                            label:"糖尿病",
                            data:[
                                ['0','3560','66.4'],
                                ['1','1804','33.6'],
                                ['总计','5364','100.0']
                            ]

                        }
                    },
                    {
                        name:"饮酒史",
                        active:"",
                        value:"wuxu",
                        data:{
                            label:"饮酒史",
                            data:[
                                ['0','2551','47.6'],
                                ['1','1751','32.6'],
                                ['总计','4302','80.2'],
                                ['缺失','1062','19.8'],
                                ['总计','5364','100.0']
                            ]
                        }
                    },
                    {
                        name:"阿托伐他汀_是否用药",
                        active:"",
                        value:"wuxu",
                        data:{
                            label:"阿托伐他汀_是否用药",
                            data:[
                                ['0','1726','32.2'],
                                ['1','3638','67.8'],
                                ['总计','5364','100.0']
                            ]
                        }
                    },
                    {
                        name:"阿司匹林_是否用药",
                        active:"",
                        value:"wuxu",
                        data:{
                            label:"阿司匹林_是否用药",
                            data:[
                                ['0','1676','31.2'],
                                ['1','3688','68.8'],
                                ['总计','5364','100.0']
                            ]
                        }
                    },
                    {
                        name:"氯吡格雷_是否用药",
                        active:"",
                        value:"wuxu",
                        data:{
                            label:"氯吡格雷_是否用药",
                            data:[
                                ['0','2136','39.8'],
                                ['1','3228','60.2'],
                                ['总计','5364','100.0']
                            ]
                        }
                    },
                    {
                        name:"肝素_是否用药",
                        active:"",
                        value:"wuxu",
                        data:{
                            label:"肝素_是否用药",
                            data:[
                                ['0','3920','73.1'],
                                ['1','1444','26.9'],
                                ['总计','5364','100.0']
                            ]
                        }
                    },
                    {name:'年龄',active:'',value:"lianxu",data:{
                        label:"年龄",
                        data:['年龄','59.9355','12.51597','7.00','97.00','52.0000','60.0000','69.0000']
                    }},
                    {name:'住院天数',value:"lianxu",active:'',data:{
                        label:"住院天数",
                        data:['住院天数','-1.9174','361.47823','-9999.00','315.00','7.0000','10.0000','14.0000']

                    }},
                    {name:'收缩压',value:"lianxu",active:'',data:{
                        label:"收缩压",
                        data:['收缩压','-266.1048','2141.04992','-9999.00','17090.00','123.0000','140.0000','155.0000']
                    }},
                    {name:'舒张压',value:"lianxu",active:'',data:{
                        label:"舒张压",
                        data:['舒张压','-346.0511','2038.80262','-9999.00','902.00','75.0000','80.0000','90.0000']
                    }},
                    {name:'体重',value:"lianxu",active:'',data:{
                        label:"体重",
                        data:['体重','72.7541','12.59658','5.00','190.00','65.0000','72.0000','80.0000']
                    }},
                    {name:'bmi',value:"lianxu",active:'',data:{
                        label:"bmi",
                        data:['bmi','52.5497','1333.69148','1.00','83333.00','23.0000','25.0000','28.0000']
                    }},
                    {name:'甘油三酯',value:"lianxu",active:'',data:{
                        label:"甘油三酯",
                        data:['甘油三酯','1.6009','1.09056','0.22','33.69','1.0200','1.3800','1.8900']
                    }},
                    {name:'高密度脂蛋白',value:"lianxu",active:'',data:{
                        label:"高密度脂蛋白",
                        data:['高密度脂蛋白','1.1862','0.33108','0.28','3.58','.9600','1.1500','1.3700']
                    }},
                    {name:'低密度脂蛋白',value:"lianxu",active:'',data:{
                        label:"低密度脂蛋白",
                        data:['低密度脂蛋白','2.3729','0.89876','0.33','6.71','1.7000','2.2600','2.9500']
                    }},
                    {name:'总胆固醇',value:"lianxu",active:'',data:{
                        label:"总胆固醇",
                        data:['总胆固醇','3.9196','1.07287','1.30','11.47','3.1400','3.8000','4.5700']
                    }},
                    {name:'纤维蛋白原',value:"lianxu",active:'',data:{
                        label:"纤维蛋白原",
                        data:['纤维蛋白原','3.5609','1.09922','0.42','11.41','2.8300','3.3600','4.0600']
                    }},
                    {name:'国际标准化比值',value:"lianxu",active:'',data:{
                        label:"国际标准化比值",
                        data:['国际标准化比值','1.0247','0.16401','0.75','4.13','0.9600','1.0000','1.0500']
                    }},
                    {name:'糖化血红蛋白',value:"lianxu",active:'',data:{
                        label:"糖化血红蛋白",
                        data:['糖化血红蛋白','6.5269','1.51488','3.80','13.70','5.5000','6.0000','7.2000'
                        ]
                    }},
                    {name:'丙氨酸氨基转移酶',value:"lianxu",active:'',data:{
                        label:"丙氨酸氨基转移酶",
                        data:['丙氨酸氨基转移酶','24.7053','24.50557','1.00','362.00','13.0000','18.0000','28.0000'
                        ]
                    }},
                    {name:'肌酐',value:"lianxu",active:'',data:{
                        label:"肌酐",
                        data:['肌酐','67.4002','25.07306','19.00','714.00','54.0000','64.0000','75.0000'

                        ]
                    }},
                    {name:'葡萄糖',value:"lianxu",active:'',data:{
                        label:"葡萄糖",
                        data:['葡萄糖','6.5728','2.60737','1.47','25.50','4.9400','5.6700','7.3100'
                        ]
                    }}
                ]
            }
        };

        $scope.conditionClick = function(data){
            var chartOption;
            var chartContinuity;
            if(data.active){
                data.active = '';
                if($scope.selectedData.indexOf(data.name)>-1){

                    $scope.selectedData = $scope.selectedData.replace(data.name+' , ','');
                }
                if(data.value=='wuxu'){
                    angular.forEach($scope.tablesWuxu,function (table,index) {
                        if( table.label == data.name ){
                            $scope.tablesWuxu.splice(index,1);
                            return false;
                        }
                    })
                }else{
                    angular.forEach($scope.tablesLianxu,function(teble,index){
                        if(teble.label==data.name){
                            $scope.tablesLianxu.splice(index,1);
                        }
                    })
                }

            }else{
                data.active = 'infi-analysis-background';
                $scope.selectedData = data.name +' , '+ $scope.selectedData;
                if(data.value=='wuxu'){
                    $scope.tablesWuxu.push(data.data);
                    data.type = 'bar';
                    chartOption = genOption(data);
                    data.option = chartOption;
                    drawChart(chartOption,'wuxu_'+data.name);

                }else{
                    $scope.tablesLianxu.push(data.data);
                    data.type='shadow';
                    chartContinuity = getoptionss(data);
                    data.option = chartContinuity;
                    drawChart(chartContinuity,'lianxu_'+data.name);
                }
            }

        };
        $scope.conditionClick($scope.condition[0]);
        $scope.conditionClick($scope.condition[10]);
        $scope.switch = function(data,type){
            var chartOption;
            datas={
                name:data.label,
                value:"wuxu",
                data:data
            };
            datas.type = type;
            if( type == 'bar'){
                chartOption = genOption(datas);
            }else if(type == 'pie'){
                $scope.aaa = [];
                for(var i = 0 ; i < data.data.length ; i++){
                    $scope.aaa.push({value:data.data[i][1],name:data.data[i][0]});
                }
                chartOption =  {
                    title : {
                        text: data.label,
                        x:'left'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    series : [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '40%'],
                            data:$scope.aaa,
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };
            }

            drawChart(chartOption,'wuxu_'+datas.name);

        };

        function genOption(table){
            // 绘图当中不需要总计信息;
            table.data.data.splice(2,1);
            var option = {
                title: {
                    text: table.name
                },
                tooltip: {},
                xAxis: {
                    data: []
                },
                yAxis: {},
                series: [{
                    name: table.name,
                    type: table.type,
                    barWidth:'35%',
                    data: []
                }]
            };
            var idx=0;
            var entity;
            option.xAxis.data = [];
            option.series[0].data = [];
            for(idx=0;idx<table.data.data.length;idx++){
                entity=table.data.data[idx];
                option.xAxis.data.push(entity[0]);
                option.series[0].data.push({
                    value:entity[1],
                    name:entity[1]
                });
            }
            return option;
        }

        function drawChart(option,id){
            setTimeout(function () {
                myChart = echarts.init(document.getElementById(id));
                myChart.clear();
                myChart.setOption(option);
            },100)
        }


        function getoptionss(table){
            var tables = angular.copy(table);
            tables.data.data.splice(0,1);
            $scope.wraps = [];
            $scope.wraps.push(tables.data.data);
            var data = echarts.dataTool.prepareBoxplotData($scope.wraps);
            var optionsMain = {
                title : {
                    text: table.name,
                    x:'left'
                },
                tooltip: {
                    trigger: 'item',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '15%'
                },
                xAxis: {
                    type: 'category',
                    data: data.axisData,
                    boundaryGap: true,
                    nameGap: 30,
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        formatter: table.name
                    },
                    splitLine: {
                        show: false
                    }
                },
                yAxis: {
                    type: 'value',
                    splitArea: {
                        show: true
                    }
                },
                series: [
                    {
                        name: 'boxplot',
                        type: 'boxplot',
                        data: data.boxData,
                        tooltip: {
                            formatter: function (param) {
                                return [
                                    'Experiment ' + param.name + ': ',
                                    'upper: ' + param.data[4],
                                    'Q3: ' + param.data[3],
                                    'median: ' + param.data[2],
                                    'Q1: ' + param.data[1],
                                    'lower: ' + param.data[0]
                                ].join('<br/>')
                            }
                        }
                    },
                    {
                        name: 'outlier',
                        type: 'scatter',
                        data: data.outliers
                    }
                ]
            };
            return optionsMain;
        }

        $scope.swithBottom = function(data,type){
            var chartOption;
            datas = {
                name:data.label,
                value:'lianxu',
                data:data
            }
            if(type == 'shadow' ){
                chartOption = getoptionss(datas)
            }else{
                datas.name = data.label
                var dataAll = [
                    [
                        [10.0, 8.04],
                        [8.0, 6.95],
                        [13.0, 7.58],
                        [9.0, 8.81],
                        [11.0, 8.33],
                        [14.0, 9.96],
                        [6.0, 7.24],
                        [4.0, 4.26],
                        [12.0, 10.84],
                        [7.0, 4.82],
                        [5.0, 5.68]
                    ]
                ];

                var markLineOpt = {
                    animation: false,
                    label: {
                        normal: {
                            formatter: 'y = 0.5 * x + 3',
                            textStyle: {
                                align: 'right'
                            }
                        }
                    },
                    lineStyle: {
                        normal: {
                            type: 'solid'
                        }
                    },
                    tooltip: {
                        formatter: 'y = 0.5 * x + 3'
                    },
                    data: [[{
                        coord: [0, 3],
                        symbol: 'none'
                    }, {
                        coord: [20, 13],
                        symbol: 'none'
                    }]]
                };
                var chartOption = {
                    title: {
                        text: datas.name,
                        x: 'left',
                        y: 0
                    },
                    grid: [
                        {x: '7%', y: '7%', width: '80%', height: '80%'}
                    ],
                    tooltip: {
                        formatter: 'Group {a}: ({c})'
                    },
                    xAxis: [
                        {gridIndex: 0, min: 0, max: 20}
                    ],
                    yAxis: [
                        {gridIndex: 0, min: 0, max: 15}
                    ],
                    series: [
                        {
                            name: 'I',
                            type: 'scatter',
                            xAxisIndex: 0,
                            yAxisIndex: 0,
                            data: dataAll[0],
                            markLine: markLineOpt
                        }
                    ]
                };
            }

            drawChart(chartOption,'lianxu_'+datas.name);
        };

    }]);