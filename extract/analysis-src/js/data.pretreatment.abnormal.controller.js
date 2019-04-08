angular.module('infi-basic')
    .controller('DataPretreatmentAbnormalController',[ '$scope',function ($scope) {
        var myChartsBefore = echarts.init(document.getElementById('main'));
        var myChartsAfter = echarts.init(document.getElementById('mains'));
        //控制处理前的样式显示
        $scope.before = false;
        //已选变量的名称
        $scope.name = '';
        //控制处理前的样式显示
        $scope.after = false;
        //识别策略弹出框
        $scope.leach = false;
        $scope.leachs = false;
        // 可选项
        $scope.condition = [
            {name:'性别',active:''},
            {name:'高血压',active:''},
            {name:'高脂血症',active:''},
            {name:'年龄',active:''},
            {name:'收缩压',active:''},
            {name:'住院天数',active:''},
            {name:'NIHSS_出入院评分变化',active:''},{name:'身高',active:''},{name:'体重',active:''},{name:'bmi',active:''},{name:'糖尿病',active:''},{name:'吸烟史',active:''},{name:'饮酒史',active:''},{name:'甘油三酯',active:''},{name:'高密度脂蛋白',active:''},{name:'低密度脂蛋白',active:''},{name:'总胆固醇',active:''},{name:'纤维蛋白原',active:''},{name:'国际标准化比值',active:''},{name:'糖化血红蛋白',active:''},{name:'丙氨酸氨基转移酶',active:''},{name:'肌酐',active:''},{name:'葡萄糖',active:''},{name:'阿托伐他汀_是否用药',active:''}
        ]

        //处理策略 -- 连续选项
        $scope.LXData = {
            value:'',
            data:[
                {name:'请选择',value:''},
                {name:'删除',value:'删除'},
                {name:'中位数插值',value:'中位数插值'},
                {name:'众数插值',value:'众数插值'},
                {name:'回归插值',value:'回归插值'},
                {name:'拉格朗日',value:'拉格朗日'}
            ]
        }
        //处理策略 -- 分类选项
        $scope.FLData = {
            value:'',
            data:[
                {name:'请选择',value:''},
                {name:'删除',value:'删除'}
            ]
        }

        //分类总容器
        $scope.selectMethodData = {
            value:'',
            data:[
                {name:'请选择',value:''},
                {name:'删除',value:'删除'},
                {name:'中位数插值',value:'中位数插值'},
                {name:'众数插值',value:'众数插值'},
                {name:'回归插值',value:'回归插值'},
                {name:'拉格朗日',value:'拉格朗日'}
            ]
        }

        //识别策略 -- 选项
        $scope.identifyData = {
            value:'',
            data:[
                {name:'请选择',value:''},
                {name:'自定义区间',value:'自定义区间'},
                {name:'四分位数法',value:'四分位数法'}
            ]
        };
        //识别策略 -- 分类
        $scope.SFLData = {
            value:'',
            data:[
                {name:'自定义内容',value:'自定义内容'}
            ]
        };
        //识别策略 -- 连续
        $scope.SLXData = {
            value:'',
            data:[
                {name:'自定义区间',value:'自定义区间'},
                {name:'四分位数法',value:'四分位数法'}
            ]
        };

        //识别策略 -- 内容
        $scope.identifyInput = [
            {value:''}
        ]
        //识别策略 -- 选项按钮
        $scope.identifyClick = function(){
            if($scope.identifyData.value == '四分位数法'){
                $scope.saveClick();
            }else if($scope.identifyData.value !== ''){
                $scope.leach = true;
            }else if($scope.identifyData.value !== ''){
                $scope.leachs = true;
            }
        }
        //识别策略 -- 添加按钮
        $scope.addClick = function(){
            $scope.identifyInput.push({value:''});
        }
        //识别策略 -- 确定按钮
        $scope.saveClick = function(){
            $scope.before = true;
            $scope.leach = false;

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
                        data:[
                            {value:335, name:'直接访问'},
                            {value:310, name:'邮件营销'},
                            {value:234, name:'联盟广告'},
                            {value:135, name:'视频广告'},
                            {value:1548, name:'搜索引擎'}
                        ],
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
            myChartsBefore.setOption(options);
        }

        //处理前后的list数据
        $scope.beforeContent = [
            {name:'a',value:'a'}
        ]
        $scope.afterContent = [
            {name:'a',value:'a'}
        ]
        //处理前后的样本量数据
        $scope.beforeNumber = '1';
        $scope.afterNumber = '1';

        //搜索关键字
        $scope.searchData = '';
        //搜索方法
        $scope.search = function(){
        }

        //确认处理按钮
        $scope.process = function(){
            $scope.after = true;
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
                        data:[
                            {value:335, name:'直接访问'},
                            {value:310, name:'邮件营销'},
                            {value:234, name:'联盟广告'},
                            {value:135, name:'视频广告'},
                            {value:1548, name:'搜索引擎'}
                        ],
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
            myChartsAfter.setOption(options);
        }

        $scope.selectLeftData = {
            value:'',
            data:[
                {name:'全部',value:'全部'},
                {name:'分类变量',value:'分类变量'},
                {name:'连续变量',value:'连续变量'}
            ]
        }

        //处理策略方法
        $scope.processMethod = function(){
        }

        // 分类连续变量选择
        $scope.selectLeft = function(){
        }

        $scope.conditionClick = function(data){
            $scope.name = data.name;
            $scope.data = data;
            for(var i = 0 ; i < $scope.condition.length ; i++){
                if($scope.condition[i].name == $scope.data.name){
                    $scope.data.active = 'infi-analysis-background';
                }else{
                    $scope.condition[i].active = '';
                }
            }

        }
    }]);