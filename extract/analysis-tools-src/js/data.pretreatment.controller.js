angular.module('infi-basic')
    .controller('DataPretreatmentController',[ '$scope',function ($scope) {
        $scope.condition = [
            {name:'阿司匹林_是否用药',active:''},
            {name:'氯吡格雷_是否用药',active:''},
            {name:'肝素_是否用药',active:''},
            // {name:'pati_id',active:''},
            // {name:'pati_visit_id',active:''},
            {name:'年龄',active:''},
            {name:'NIHSS_出入院评分变化',active:''},{name:'性别',active:''},{name:'住院天数',active:''},{name:'收缩压',active:''},{name:'舒张压',active:''},{name:'身高',active:''},{name:'体重',active:''},{name:'bmi',active:''},{name:'高血压',active:''},{name:'高脂血症',active:''},{name:'糖尿病',active:''},{name:'吸烟史',active:''},{name:'饮酒史',active:''},{name:'甘油三酯',active:''},{name:'高密度脂蛋白',active:''},{name:'低密度脂蛋白',active:''},{name:'总胆固醇',active:''},{name:'纤维蛋白原',active:''},{name:'国际标准化比值',active:''},{name:'糖化血红蛋白',active:''},{name:'丙氨酸氨基转移酶',active:''},{name:'肌酐',active:''},{name:'葡萄糖',active:''},{name:'阿托伐他汀_是否用药',active:''}
        ]
        // $scope.conditionDatas = [
        //     {name:'NIHSS_出入院评分变化',active:''},{name:'性别',active:''},{name:'住院天数',active:''},{name:'收缩压',active:''},{name:'舒张压',active:''},{name:'身高',active:''},{name:'体重',active:''},{name:'bmi',active:''},{name:'高血压',active:''},{name:'高脂血症',active:''},{name:'糖尿病',active:''},{name:'吸烟史',active:''},{name:'饮酒史',active:''},{name:'甘油三酯',active:''},{name:'高密度脂蛋白',active:''},{name:'低密度脂蛋白',active:''},{name:'总胆固醇',active:''},{name:'纤维蛋白原',active:''},{name:'国际标准化比值',active:''},{name:'糖化血红蛋白',active:''},{name:'丙氨酸氨基转移酶',active:''},{name:'肌酐',active:''},{name:'葡萄糖',active:''},{name:'阿托伐他汀_是否用药',active:''}
        // ]
        $scope.selectss = true;
        $scope.after = false;
        $scope.before = false;
        $scope.leach = false;
        $scope.leachs = false;
        $scope.selectLeftData = '';
        $scope.taskGroup = [
            {name:'空值处理'},
            {name:'异常值处理'}
        ];

        $scope.fenleilianxu = true;
        
        $scope.selectLeft = function(){
            if( $scope.selectLeftData == 1 ){
                $scope.condition = [
                    {name:'阿司匹林_是否用药',active:''},
                    {name:'氯吡格雷_是否用药',active:''},
                    {name:'肝素_是否用药',active:''},
                    {name:'性别',active:''},{name:'高血压',active:''},{name:'高脂血症',active:''},{name:'糖尿病',active:''},{name:'吸烟史',active:''},{name:'阿托伐他汀_是否用药',active:''}
                ]
                $scope.selectss = false;
                $scope.fenleilianxu = false;
            }else if( $scope.selectLeftData == 2){
                $scope.condition = [
                    // {name:'pati_id',active:''},
                    // {name:'pati_visit_id',active:''},
                    {name:'年龄',active:''},
                    {name:'住院天数',active:''},{name:'收缩压',active:''},{name:'舒张压',active:''},{name:'身高',active:''},{name:'体重',active:''},{name:'bmi',active:''},{name:'饮酒史',active:''},{name:'甘油三酯',active:''},{name:'高密度脂蛋白',active:''},{name:'低密度脂蛋白',active:''},{name:'总胆固醇',active:''},{name:'纤维蛋白原',active:''},{name:'国际标准化比值',active:''},{name:'糖化血红蛋白',active:''},{name:'丙氨酸氨基转移酶',active:''},{name:'肌酐',active:''},{name:'葡萄糖',active:''},
                ]
                $scope.selectss = true;
                $scope.fenleilianxu = true;
            }else{
                $scope.condition = [
                    {name:'阿司匹林_是否用药',active:''},
                    {name:'氯吡格雷_是否用药',active:''},
                    {name:'肝素_是否用药',active:''},
                    // {name:'pati_id',active:''},
                    // {name:'pati_visit_id',active:''},
                    {name:'年龄',active:''},
                    {name:'NIHSS_出入院评分变化',active:''},{name:'性别',active:''},{name:'住院天数',active:''},{name:'收缩压',active:''},{name:'舒张压',active:''},{name:'身高',active:''},{name:'体重',active:''},{name:'bmi',active:''},{name:'高血压',active:''},{name:'高脂血症',active:''},{name:'糖尿病',active:''},{name:'吸烟史',active:''},{name:'饮酒史',active:''},{name:'甘油三酯',active:''},{name:'高密度脂蛋白',active:''},{name:'低密度脂蛋白',active:''},{name:'总胆固醇',active:''},{name:'纤维蛋白原',active:''},{name:'国际标准化比值',active:''},{name:'糖化血红蛋白',active:''},{name:'丙氨酸氨基转移酶',active:''},{name:'肌酐',active:''},{name:'葡萄糖',active:''},{name:'阿托伐他汀_是否用药',active:''}
                ]
                $scope.selectss = true;
            }
        }

        //tab切换按钮
        $scope.step = '空值处理';
        $scope.descriptionTab = function(data){
            $scope.step = data;
            $scope.before = false;
            $scope.after = false;
            $scope.selectedData = '';
            myCharts.clear();
            myChartss.clear();
            for( var i = 0 ; i < $scope.condition.length ; i++){
                $scope.condition[i].active=''
            }
        }
        $scope.input2 = false;
        $scope.addClick = function(){
            $scope.input2 = true;
        }

        $scope.saveClick = function(){
            $scope.after = false;
            myChartss.clear();
            $scope.misssss = true;
            $scope.miss = false;
            if($scope.selectedData == ''){
                return
            }
            // $scope.miss = true;
            if( $scope.selectedData == '氯吡格雷_是否用药'){
                $scope.content = [
                    {name:'0',value:'812'},
                    {name:'1',value:'1483'}
                ]
                myCharts.clear();
                $scope.missData = '181';
            }else if( $scope.selectedData == '肝素_是否用药' ){
                $scope.content = [
                    {name:'0',value:'1620'},
                    {name:'1',value:'675'}
                ]
                myCharts.clear();
                $scope.missData = '13';
            }else if( $scope.selectedData == '阿司匹林_是否用药' ){
                $scope.content = [
                    {name:'0',value:'519'},
                    {name:'1',value:'1776'}
                ]
                myCharts.clear();
                $scope.missData = '10';
            }else if( $scope.selectedData == 'pati_id' ){
                $scope.content = [
                    {name:'平均值',value:'43.72'},
                    {name:'最小值',value:'5'},
                    {name:'最大值',value:'89'}
                ]
                myCharts.clear();
                $scope.miss = false;
                $scope.leach = false;
                $scope.leachs = false;
                $scope.before = true;
                return;
            }else if( $scope.selectedData == 'pati_visit_id' ){
                $scope.content = [
                    {name:'平均值',value:'21.56'},
                    {name:'最小值',value:'0'},
                    {name:'最大值',value:'238'}
                ]
                myCharts.clear();
                $scope.miss = false;
                $scope.leach = false;
                $scope.leachs = false;
                $scope.before = true;
                return;
            }else if( $scope.selectedData == '年龄' ){
                $scope.content = [
                    {name:'平均值',value:'60.12'},
                    {name:'最小值',value:'13.00'},
                    {name:'最大值',value:'97.81'}
                ]
                $scope.miss = false;
                myCharts.clear();
                $scope.before = true;
                $scope.leach = false;
                $scope.leachs = false;
                return;
            }
            $scope.before = true;
            $scope.optionsData = [];
            for(var j = 0 ; j < $scope.content.length ; j++){
                $scope.optionsData.push({'value':$scope.content[j].value, 'name':$scope.content[j].name});
            }
            $scope.optionsData.push({'value': $scope.missData, 'name':'缺失'});
            var options = {
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
                        data:$scope.optionsData,
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
            myCharts.setOption(options);
            $scope.leach = false
            $scope.leachs = false
        }

        $scope.conditionClick = function(data){
            $scope.optionsData = [];
            $scope.selectedData = data.name;
            $scope.after = false;
            $scope.misssss = false;
            myChartss.clear();
            for( var i = 0 ; i < $scope.condition.length ; i++){
                $scope.condition[i].active=''
            }
            data.active = 'infi-analysis-background';
            if($scope.step == '异常值处理'){
                $scope.before = false;
                $scope.after = false;
                myCharts.clear();
                myChartss.clear();
                return
            }
            if(data.name == '氯吡格雷_是否用药'){
                $scope.content = [
                    {name:'0',value:'812'},
                    {name:'1',value:'1482'}
                ]
                $scope.missData = '181';
                $scope.miss = true;
            }else if( data.name == '肝素_是否用药' ){
                $scope.content = [
                    {name:'0',value:'1620'},
                    {name:'1',value:'675'}
                ]
                $scope.missData = '13';
                $scope.miss = true;
            }else if( data.name == '阿司匹林_是否用药' ){
                $scope.content = [
                    {name:'0',value:'519'},
                    {name:'1',value:'1776'}
                ]
                $scope.missData = '10';
                $scope.miss = true;
            }else if( $scope.selectedData == 'pati_id' ){
                $scope.content = [
                    {name:'平均值',value:'43.72'},
                    {name:'最小值',value:'5'},
                    {name:'最大值',value:'89'}
                ]
                myCharts.clear();
                $scope.miss = false;
                $scope.before = true;
                return;
            }else if( $scope.selectedData == 'pati_visit_id' ){
                $scope.content = [
                    {name:'平均值',value:'21.56'},
                    {name:'最小值',value:'0'},
                    {name:'最大值',value:'238'}
                ]
                myCharts.clear();
                $scope.miss = false;
                $scope.before = true;
                return;
            }else if( $scope.selectedData == '年龄' ){
                $scope.content = [
                    {name:'平均值',value:'60.12'},
                    {name:'最小值',value:'13.00'},
                    {name:'最大值',value:'97.81'}
                ]
                $scope.miss = false;
                myCharts.clear();
                $scope.before = true;
                return;
            }
            $scope.before = true;
            for(var j = 0 ; j < $scope.content.length ; j++){
                $scope.optionsData.push({'value':$scope.content[j].value, 'name':$scope.content[j].name});
            }
            $scope.optionsData.push({'value': $scope.missData, 'name':'缺失'});
            var options = {
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
                        data:$scope.optionsData,
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
            myCharts.setOption(options);
        }

        $scope.fenleilianxuValue = {a:''};
        $scope.identification = function (data) {
            $scope.input2 = false;
            if(data.a == 1){
                $scope.leach = false;
                $scope.leachs = true;
            }else{
                $scope.leach = true;
                $scope.leachs = false;
            }

        }

        $scope.identifications = function (data) {
            $scope.input2 = false;
            $scope.leach = true;
            $scope.leachs = false;

        }


        $scope.process = function(){
            if($scope.before == false){
                return;
            }
            $scope.optionData = [];
            $scope.after = true;
            if( $scope.selectedData == 'pati_id' || $scope.selectedData == 'pati_visit_id' || $scope.selectedData == '年龄'){
                return;
            }
            for(var j = 0 ; j < $scope.content.length ; j++){
                $scope.optionData.push({'value':$scope.content[j].value, 'name':$scope.content[j].name});
            }
            var option = {
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
                        data:$scope.optionData,
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
            myChartss.setOption(option);
        }

        var myCharts = echarts.init(document.getElementById('main'));
        var myChartss = echarts.init(document.getElementById('mains'));



    }]);