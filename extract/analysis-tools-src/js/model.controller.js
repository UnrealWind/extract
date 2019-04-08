angular.module('infi-basic')
    .controller('ModelController',[ '$scope','DataService','$routeParams',function ($scope,DataService,$routeParams) {

        $('body').removeClass("modal-open");
        $(".modal-backdrop").remove();
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
        $scope.factorDisplay = true;
        $scope.conditionDatas = [
            {name:'NIHSS_出入院评分变化',active:''},{name:'身高',active:''},{name:'体重',active:''},{name:'bmi',active:''},{name:'糖尿病',active:''},{name:'吸烟史',active:''},{name:'饮酒史',active:''},{name:'甘油三酯',active:''},{name:'高密度脂蛋白',active:''},{name:'低密度脂蛋白',active:''},{name:'总胆固醇',active:''},{name:'纤维蛋白原',active:''},{name:'国际标准化比值',active:''},{name:'糖化血红蛋白',active:''},{name:'丙氨酸氨基转移酶',active:''},{name:'肌酐',active:''},{name:'葡萄糖',active:''},{name:'阿托伐他汀_是否用药',active:''}
        ]
        $scope.condition = [
            {name:'性别',active:'infi-analysis-background'},
            {name:'高血压',active:'infi-analysis-background'},
            {name:'高脂血症',active:''},
            {name:'年龄',active:''},
            {name:'收缩压',active:''},
            {name:'住院天数',active:''}

        ]

        $scope.coefficientData = [
            {"name":"(Intercept)","value":"41.13","value1":"2.709","value2":"0.000","value3":"7.25E+17"},
            {"name":"年龄","value":"0.03","value1":"0.009","value2":"0.007","value3":"1.026"},
            {"name":"收缩压","value":"0.00","value1":"0.006","value2":"0.800","value3":"0.998"},
            {"name":"住院天数","value":"0.01","value1":"0.010","value2":"0.589","value3":"1.006"},
            {"name":"体重","value":"0.01","value1":"0.016","value2":"0.444","value3":"1.012"},
            {"name":"bmi","value":"-1.18","value1":"0.080","value2":"0.000","value3":"0.307"},
            {"name":"高血压","value":"0.07","value1":"0.220","value2":"0.765","value3":"1.068"},
            {"name":"糖尿病","value":"0.51","value1":"0.254","value2":"0.044","value3":"1.671"},
            {"name":"甘油三酯","value":"-0.03","value1":"0.114","value2":"0.789","value3":"0.970"},
            {"name":"高密度脂蛋白","value":"0.32","value1":"0.329","value2":"0.334","value3":"1.374"},
            {"name":"纤维蛋白原","value":"-0.29","value1":"0.099","value2":"0.003","value3":"0.745"},
            {"name":"国际标准化比值","value":"1.10","value1":"0.736","value2":"0.134","value3":"3.013"},
            {"name":"糖化血红蛋白","value":"-1.89","value1":"0.148","value2":"0.000","value3":"0.151"},
            {"name":"肌酐","value":"0.00","value1":"0.004","value2":"0.949","value3":"1.000"},
            {"name":"葡萄糖","value":"-0.12","value1":"0.054","value2":"0.022","value3":"0.884"},
            {"name":"高脂血症","value":"-0.33","value1":"0.215","value2":"0.131","value3":"0.722"}

        ]

        $scope.computeData = [
            {name:'年龄',value:' 1.31',values:'0.76',check:true},
            {name:'收缩压',value:'1.82',values:'0.22',check:true},
            {name:'住院天数',value:'1.91',values:'0.52',check:true},
            {name:'体重',value:'3.81',values:'0.26',check:true},
            {name:'bmi',value:'3.51',values:'0.29',check:true},
            {name:'甘油三酯',value:'2.01',values:'0.50',check:true},
            {name:'高密度脂蛋白',value:'1.76',values:'0.57',check:false},
            {name:'低密度脂蛋白',value:'10.28',values:'0.10',check:false},
            {name:'总胆固醇',value:'13.20',values:'0.08',check:true},
            {name:'纤维蛋白原',value:'1.08',values:'0.92',check:true},
            {name:'国际标准化比值',value:'1.09',values:'0.92',check:true},
            {name:'糖化血红蛋白',value:'2.10',values:'0.48',check:true},
            {name:'肌酐',value:'1.12',values:'0.79',check:true},
            {name:'葡萄糖',value:'2.05',values:'0.49',check:true}
        ]
        $scope.singleFactorData = [
            {name:'年龄',value:'<0.001',check:true},
            {name:'住院天数',value:'<0.001',check:false},
            {name:'收缩压',value:'<0.001',check:true},
            {name:'身高',value:'0.098',check:false},
            {name:'体重',value:'<0.001',check:true},
            {name:'bmi',value:'<0.001',check:true},
            {name:'甘油三酯',value:'<0.001',check:true},
            {name:'高密度脂蛋白',value:'<0.001',check:true},
            {name:'低密度脂蛋白',value:'<0.001',check:true},
            {name:'总胆固醇',value:'<0.001',check:true},
            {name:'纤维蛋白原',value:'<0.001',check:true},
            {name:'国际标准化比值',value:'<0.001',check:true},
            {name:'糖化血红蛋白',value:'<0.001',check:true},
            {name:'丙氨酸氨基转移酶',value:'0.556',check:false},
            {name:'肌酐',value:'<0.001',check:true},
            {name:'葡萄糖',value:'<0.001',check:true},
            {name:'性别',value:'0.003',check:false},
            {name:'高血压',value:'<0.001',check:true},
            {name:'高脂血症',value:'<0.001',check:true},
            {name:'糖尿病',value:'<0.001',check:true},
            {name:'吸烟史',value:'0.138',check:false},
            {name:'饮酒史',value:'0.198',check:false},
            {name:'阿托伐他汀_是否用药',value:'0.114',check:false},
            {name:'性别',value:'0.132',check:false},
            {name:'高血压',value:'0.066',check:false},
            {name:'高脂血症',value:'0.027',check:true}
        ]
        $scope.selectLeftData = '';
        $scope.modelSave = function(){
            $('#modal-save').modal({backdrop:'static'});
        }
        $scope.selectLeft = function(){
            if( $scope.selectLeftData == 1 ){
                $scope.condition = [
                    {name:'性别',active:''},
                    {name:'高血压',active:''},
                    {name:'高脂血症',active:''}
                ]
            }else if( $scope.selectLeftData == 2){
                $scope.condition = [
                    {name:'年龄',active:''},
                    {name:'收缩压',active:''},
                    {name:'住院天数',active:''}
                ]
            }else{
                $scope.condition = [
                    {name:'性别',active:''},
                    {name:'高血压',active:''},
                    {name:'高脂血症',active:''},
                    {name:'年龄',active:''},
                    {name:'收缩压',active:''},
                    {name:'住院天数',active:''}
                ]
            }
        }

        $scope.zubie1 = true;
        $scope.zubie2 = false;
        $scope.tableData = [];
        $scope.shiyanduizao = 1;
        $scope.zubie = function(data){

            $scope.shiyanduizao = data;
            if(data == 1){
                $scope.zubie1 = true;
                $scope.zubie2 = false;
                for(var i = 0 ; i <  $scope.tableData.length ; i++ ){
                    $scope.aaa = [];
                    for(var j = 0 ; j < $scope.shiyanzu.length ; j++){
                        angular.forEach($scope.shiyanzu[j], function(data,index,array){
                            if($scope.tableData[i].name == index){
                                $scope.aaa.push({name:data});

                            }
                        });
                    }
                    $scope.tableData[i].tbody = $scope.aaa;
                }

            }else if(data == 2){
                $scope.zubie1 = false;
                $scope.zubie2 = true;
                for(var i = 0 ; i <  $scope.tableData.length ; i++ ){
                    $scope.aaa = [];
                    for(var j = 0 ; j < $scope.duizhaozu.length ; j++){
                        angular.forEach($scope.duizhaozu[j], function(data,index,array){
                            if($scope.tableData[i].name == index){
                                $scope.aaa.push({name:data});
                            }
                        });
                    }
                    $scope.tableData[i].tbody = $scope.aaa;
                }
            }
        }
        $scope.conditionClick = function(data){
            if($scope.factorDisplay == false){
                return
            }
            $scope.navigation = [
                {name:'模型选择',active:'infi-analysis-modifyed'},
                {name:'变量选择',active:'infi-header-active'},
                {name:'模型执行',active:''}
            ]
            $scope.aaa = [];
            if(data.active){
                data.active = '';

                for(var i = 0 ; i < $scope.tableData.length ; i++){
                     if($scope.tableData[i].name == data.name){
                           $scope.tableData.splice(i,1)
                     }
                }
                return
            }else{
                data.active = 'infi-analysis-background';
            }
            if(data.name == '性别'){
                for(var i = 0 ; i < $scope.dataData.length ; i++){
                    angular.forEach($scope.dataData[i], function(data,index,array){
                        if('性别' == index){
                            $scope.aaa.push({name:data});
                        }
                    });
                }
                $scope.tableData.push({name:'性别',tbody:$scope.aaa});
            }else if(data.name == '高血压'){
                for(var i = 0 ; i < $scope.dataData.length ; i++){
                    angular.forEach($scope.dataData[i], function(data,index,array){
                        if('高血压' == index){
                            $scope.aaa.push({name:data});
                        }
                    });
                }
                $scope.tableData.push({name:'高血压',tbody:$scope.aaa});
            }else if(data.name == '高脂血症'){
                console.log($scope.dataData);
                for(var i = 0 ; i < $scope.dataData.length ; i++){
                    angular.forEach($scope.dataData[i], function(data,index,array){
                        if('高脂血症' == index){
                            $scope.aaa.push({name:data});
                        }
                    });
                }
                $scope.tableData.push({name:'高脂血症',tbody:$scope.aaa});
            }else if(data.name == '收缩压'){
                for(var i = 0 ; i < $scope.dataData.length ; i++){
                    angular.forEach($scope.dataData[i], function(data,index,array){
                        if('收缩压' == index){
                            $scope.aaa.push({name:data});
                        }
                    });
                }
                $scope.tableData.push({name:'收缩压',tbody:$scope.aaa});
            }else if(data.name == '住院天数'){
                for(var i = 0 ; i < $scope.dataData.length ; i++){
                    angular.forEach($scope.dataData[i], function(data,index,array){
                        if('住院天数' == index){
                            $scope.aaa.push({name:data});
                        }
                    });
                }
                $scope.tableData.push({name:'住院天数',tbody:$scope.aaa});
            }else if(data.name == '年龄'){
                for(var i = 0 ; i < $scope.dataData.length ; i++){
                    angular.forEach($scope.dataData[i], function(data,index,array){
                        if('年龄' == index){
                            $scope.aaa.push({name:data});
                        }
                    });
                }
                $scope.tableData.push({name:'年龄',tbody:$scope.aaa});
            }
        }

        DataService.ajaxDataFilterPage().then(function(data){
            $scope.dataData = data;
            $scope.aaa = [];
            for(var i = 0 ; i < $scope.dataData.length ; i++){
                angular.forEach($scope.dataData[i], function(data,index,array){
                    if('性别' == index){
                        $scope.aaa.push({name:data});
                    }
                });
            }

            $scope.tableData.push({name:'性别',tbody:$scope.aaa});
            $scope.aaa = [];
            for(var i = 0 ; i < $scope.dataData.length ; i++){
                angular.forEach($scope.dataData[i], function(data,index,array){
                    if('高血压' == index){
                        $scope.aaa.push({name:data});
                    }
                });
            }
            $scope.tableData.push({name:'高血压',tbody:$scope.aaa});
        });
        DataService.ajaxshiyanzuModal().then(function(data){
            $scope.shiyanzu = data;
        });
        DataService.ajaxduizhaozuModal().then(function(data){
            $scope.duizhaozu = data;

        });
        $scope.navigation = [
            {name:'模型选择',active:'infi-header-active'},
            {name:'变量选择',active:''},
            {name:'模型执行',active:''}
        ]
        $scope.singleFactor = function(){
            $('#single-factor').modal({backdrop:'static'});
        }
        $scope.singleFactorSave = function(){
            $scope.navigation = [
                {name:'模型选择',active:'infi-analysis-modifyed'},
                {name:'变量选择',active:'infi-analysis-modifyed'},
                {name:'模型执行',active:'infi-header-active'}
            ]
            $scope.factorDisplay = false;
            $('#single-factor').modal('hide');
        }
        
        $scope.train = false;
        $scope.trainData = false;
        $scope.compute = function(){
            $scope.train = true;
        }
        $scope.modelTrain = function(){
            $('#model-train').modal({backdrop:'static'});
        }
        $scope.modelTrainSave = function(){
            $('#model-train').modal('hide');
            $scope.trainData = true;
        }
        $scope.name = '逻辑回归'
        $scope.selectModelClick = function(){
             $scope.name= $scope.selectModel;
            
        }
        if($routeParams.id){
            $scope.name = '逻辑回归';
            $scope.factorDisplay = false;
            $scope.train = true;
            $scope.trainData = true;
            $scope.navigation = [
                {name:'模型选择',active:'infi-analysis-modifyed'},
                {name:'变量选择',active:'infi-analysis-modifyed'},
                {name:'模型执行',active:'infi-header-active'}
            ]
        }
    }]);