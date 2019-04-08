angular.module("infi-basic").controller('fetchData', ['$scope','Service','Event','$routeParams',function($scope,Service,Event,$routeParams){

	//这个是默认项目名称，
	$scope.entryName = "Y0001";
	$scope.subjectId = $routeParams.id;
	$scope.subjectGroupId = $routeParams.groupId;

	//用于第一页提示该项目下无数据的标示
	$scope.errorTip =  false;

	//timer字段用于第三页提交后的提示标示，以及倒计时时的事件数字，
	$scope.timer = 'uploading';

	//这个标记用于标记现在显示的是第几步，basic 第一步   detaile 第二步   export 第三步
	$scope.showStep = "basic";


	//basic 中存放了第一页中需要的一些数据
	$scope.basic = {

		//这个主要用于显示左侧导航数据，其中也包含了内容数据，但是内容数据并不用于显示，而是用于产生attrOpt
		"attrData" : null,

		//这个用于显示哪个数据的用于显示的，右侧的input的数据
		"attrOpt" : null,
		
		//这个属性用于标记上方的已选内容是否用于显示 
		"showChoseOpt":false
	};

	//detail 中存放了第二页中需要的一些数据
	$scope.detaile = {

		//第二页的主要数据
		"detaileOpt" : null,

		//病历数
		"totalSize" : null,

		// 当前最近一次的选择记录
		"checkedList":{},

		//整个历史记录数据
		"checkedLists" :[],

		//存放关系，并与页面的input进行双向绑定
		"relation":'or',

		//这个用于存储从后台拿过来的标示，用于区分同一项目下的不同病历
		"groupId": null,

		//这个标示用于标记按钮是否是可以点击的状态
		"getEchartsOver":''
	};

	//第三步用到的一些数据
	$scope.export = {

		//导航
		"exportData":null,

		//具体数据
		"exportOpt":null,

		//填写病历名称模态框时非空标示
		"tip":false,

		//这个用于标记第三步的病历名称
		"recordName" : ''
	}

	//这个方法直接通过传过来的mark来定义show的是第几步
	$scope.changeShowStep = function(mark,change){

		//callback中存储了后台传回来的数据，
		var callBack = null;

		//showStep，根据事件直接更新showstep达成切换效果
		$scope.showStep = mark;

		//三个页面除第一步跳第二步需要进行一些数据上的处理，其他的都只是切换状态即可
		if(mark === 'detaile' && change === true){

			//触发这个事件的时候把按钮置成不可点击的状态
			$scope.detaile.getEchartsOver = 'disabled';

			//调用对应方法切换数据，将第一步以及第二步所有相关数据传过去
			Service.changeStepData(mark,$scope.basic,$scope.detaile);

			//跳转的时候需要进行一次初始化的操作，获取groupId ,并且刷新echarts，第三个参数为groupId，没有groupid的时候不向后台传递，传undefined以区分
			Service.getNewEchartsData($scope.detaile.detaileOpt,$scope.detaile.relation,undefined,$scope.subjectId,$scope.subjectGroupId).then(function (callBack) {
				$scope.detaile.totalSize = callBack.size;
				$scope.detaile.groupId = callBack.groupId;

				if($scope.detaile.checkedLists.length == 0){
					$scope.detaile.checkedList.size = callBack.historyListDate.size;
					$scope.detaile.checkedList.relation = callBack.historyListDate.relation;
					$scope.detaile.checkedList = Event.judgeCheckedList(callBack.historyListDate, $scope.detaile.checkedList, callBack.historyListDate.label,  callBack.historyListDate.name,  callBack.historyListDate.inputType);
					$scope.detaile.checkedLists.push($scope.detaile.checkedList);
				};
				//然后成功完成这个事件以后再把它置回来
				$scope.detaile.getEchartsOver = callBack.getEchartsOver;
			});
		}else if(mark === 'basic'){

			//第二步回第三步一定要显示这个，所以需要更新这个标记
			$scope.basic.showChoseOpt = true;
		}
	}

	$scope.genDetaileData = function(opt,label,name,inputType){

		//触发这个事件的时候把按钮置成不可点击的状态
		$scope.detaile.getEchartsOver = 'disabled';

		//callback中存储了后台传回来的数据，
		var callBack = null;

		//这里需要刷新echarts的数据以及拿到新的病例数
		Service.getNewEchartsData($scope.detaile.detaileOpt,$scope.detaile.relation,$scope.detaile.groupId,$scope.subjectId,$scope.subjectGroupId).then(function (callBack) {
			$scope.detaile.totalSize = callBack.size;

			//这个数据之中存储了时间类型的历史记录，如果选择了的话
			$scope.detaile.historyListDate = callBack.historyListDate;

			//然后成功完成这个事件以后再把它置回来
			$scope.detaile.getEchartsOver = callBack.getEchartsOver;

			//需要传递的参数比较多，放在一个集合里
			//参数依次代表 当前变化的值，存储所有值的集合，变化的值的数据，总病例数，关系，元素隶属于什么父级节点，是否是单选情况
			var options = {
				"checkedList" : $scope.detaile.checkedList,
				"checkedLists" : $scope.detaile.checkedLists,
				"opt" : opt,
				"size" : $scope.detaile.totalSize,
				"relation" : $scope.detaile.relation,
				"label":label,
				"name" : name,
				"inputType":inputType
			}

			var callBack= Service.genDetaileData(options);
			$scope.detaile.checkedList = callBack.checkedList;
			$scope.detaile.checkedLists = callBack.checkedLists;

			// $scope.$apply();
		});

	}

	//searchWords与模板数据进行双向绑定，当change的时候进行事件的触发，更新表单的结构数据
	$scope.searchWords = function(inputOpt){
		var searchWords = inputOpt.searchWords;
		Service.getSearchData(searchWords,inputOpt);
	}

	//提交第三步的数据的后续逻辑，多与显示有关
	$scope.submitExport = function(){
		if($scope.export.recordName===''){
			//必须非空才能提交
			$scope.export.tip = true;
			return false;
		}else{
			//callback中存储了根据后台传过来的标示，提示成功或者失败
			$scope.export.tip = false;
			Service.submitExport($scope.export.exportData,$scope.detaile.groupId,$scope.export.recordName,$scope.subjectId,$scope.subjectGroupId).then(function (msg) {
				$('#infi-u-name').modal('hide');
				$('#infi-u-modalTip').modal({backdrop: 'static'});
				if (msg.status === "AUDIT_PRE") {
					//这个方法处理了成功后的后续事件，时间倒数，页面跳转等，同时也禁止了多次提交的可能性
					$scope.showModalTip();
				}else{
					$scope.timer = 'false';
					return;
				}
			});
		}
		
	}
	
	//关闭病例导出填写病例模态框将病例名称清空
	$scope.clearRecordName = function () {
		$scope.export.recordName = "";
	}

	//单纯的显示病历名称模态框
	$scope.showModal = function(){
		$('#infi-u-name').modal({backdrop: 'static'});
	}

	//初始化，直接封在一个函数式里，这里进行初始数据的加载以及定义
	function init(){

		//这里加载第一个页面的所需数据，
		Service.getAttrData($scope.subjectId,$scope.subjectGroupId).then(function(msg){

			//如果没数据的话会提示没有数据
			if(msg === null){
				$scope.errorTip =  true;
				$scope.basic.showChoseOpt = false;
				return false;
			}else{

				//有数据的时候则会定义第一步的数据，以及加载第二步第三部的数据
				$scope.errorTip =  false;
				$scope.basic.attrData = msg;
				$scope.basic.attrOpt = msg[0].attrOpt;

				//fydebug 第一步正确才会有第二步以及第三步
				Service.getDetaile($scope.subjectId,$scope.subjectGroupId).then(function(msg){
					$scope.detaile.detaileOpt = msg.data;
				});
				
				Service.getExportData($scope.subjectId,$scope.subjectGroupId).then(function(msg){
					$scope.export.exportData = msg;
					$scope.export.exportOpt = msg[0].attrOpt;
				});
			}
		});
	}
	
	//这里借用了筛选功能，
	$scope.$root.project = { value: $scope.entryName};
	(function getProjectName(){
		if($.cookie('projectName') !== null){
			$scope.$root.project.value = $.cookie('projectName');
		}
	})();	
	$scope.$watch('$root.project.value',function(newValue, oldValue){
		$scope.entryName = newValue;
		init();
	});

}])