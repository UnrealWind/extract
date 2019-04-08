angular.module('infi-basic').
controller('diseasePlanDetailController',
    ['$scope', 'SYS','BasicServices','$routeParams','DiseasePlanDetailServices', 
    function ($scope, SYS,BasicServices,$routeParams,DiseasePlanDetailServices) {

    //tablist数据
    $scope.tabList = {
    	data:[
		    {
		    	"label":"方案推荐依据"
		    },
		    {
		    	"label":"方案介绍"
		    },
		    {
		    	"label":"降压目标"
		    },
		    {
		    	"label":"相关危险因素处理"
		    },
		    {
		    	"label":"方案相关文献"
		    },
		    {
		    	"label":"药品不良反应相关文献"
		    },
		    {
		    	"label":"典型病例"
		    }
	    ],
	    tagValue:'方案推荐依据',
		strDiscribe:'推荐理由',
		class_id:$routeParams.class_id
    }
    
    //全部的详情数据均放在这个对象之中
    $scope.detailData = {

	    //方案推荐依据
	    planBasis:null
    }

    //切换tab
    $scope.changeTab = function(opt){
    	$scope.tabList.tagValue = opt.label;
    }

    //回上一页
    $scope.back = function(){
    	window.location.href='#/diseases-plan-list/'+$routeParams.pati_id+'/'+$routeParams.pati_visit_id
			+'/'+$routeParams.class_id+'/'+$routeParams.type;
    }

    //获取左侧导航，采用的上一页列表接口
    DiseasePlanDetailServices.getLeftTab(sessionStorage.getItem('diseaseParam'),$routeParams).then(function success(msg) {
        $scope.plan = msg.data.data;
        $scope.tabList.strDiscribe = msg.discribe;
        init ($routeParams.recordId,$routeParams.planId);
	});

    //获取一下模板数据
	BasicServices.getData({
            'data':'',
            'url':'../diseases-plan-src/data/inputFiles'+$routeParams.class_id+'.json',
            'method':'get'
        }).then(function success(msg) {
        $scope.defaultData = msg;
    });

    //初始化，刷新全部的数据都依赖于这个方法
	function init (recordId,planId){

		//患者基本信息
		DiseasePlanDetailServices.getBasicInfo(recordId,planId,$scope.defaultData,$routeParams).then(function success(msg) {
	        $scope.basicInfo = msg;
		});

        //方案推荐依据
        DiseasePlanDetailServices.getPlanBasis(recordId,planId,$scope.defaultData,$routeParams).then(function success(msg) {
            $scope.planBasis = msg;
        });

		//标准来源
	    DiseasePlanDetailServices.getStandardSource(planId,$routeParams).then(function success(msg) {
	        $scope.standardSource = msg.data;
		});

		//方案相关文献
	    DiseasePlanDetailServices.getPlanLiterature(planId,$routeParams).then(function success(msg) {
	        $scope.planLiterature = msg.data;
		});

		//药物不良反应
	    DiseasePlanDetailServices.getDrugLiterature(planId,$routeParams).then(function success(msg) {
	        $scope.drugLiterature = msg.data;
		});

		//药品介绍
	    DiseasePlanDetailServices.getDrugIntroduce(planId,$routeParams).then(function success(msg) {
	        $scope.drugIntroduce = msg.data;
		});

		//典型病例
	    DiseasePlanDetailServices.getTypicalRecord(planId,$routeParams).then(function success(msg) {
	        $scope.typicalRecord = msg.data;
		});

		//相关危险因素处理
	    DiseasePlanDetailServices.getDangerInfo(recordId,$routeParams).then(function success(msg) {
	        $scope.dangerInfo = msg.data;
		});

        //降压目标
        DiseasePlanDetailServices.getHyperAim(recordId,$routeParams).then(function success(msg) {
            $scope.hyperAim = msg.data;
        });

	}

	//刷新
	$scope.refreshDetail = function(opt,str){
        $scope.tabList.strDiscribe = str;
		init ($routeParams.recordId,opt.uuid);
		DiseasePlanDetailServices.changeLeftTab($scope.plan,opt);
	}

	//pdf
	$scope.viewPDF = function (id,planType) {
    	window.open('#/disease-pdf/'+$routeParams.type+'/'+id+'/'+planType+'/1')
    }
}]);