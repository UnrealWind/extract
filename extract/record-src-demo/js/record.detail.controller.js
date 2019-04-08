angular.module('infi-basic').controller('RecordDetailController',
    ['$scope', '$routeParams', 'RecordService', 'OverviewService', 'Utils', 'SYS','$http','$rootScope','$timeout',
        function ($scope, $routeParams, RecordService, OverviewService, Utils, SYS,$http,$rootScope,$timeout) {
    $scope.naviData = [];
    $scope.doRefresh = true; //强制刷新标示，通过重置这个值进行directive的重新刷新

    //当初因为都是走的最终结尾为数字的api，所以就把他们统一写到了这个对象之中，但是其中参数差别随着需求的增加不断变化
    //导致这其中包含了很多特殊的字段，还不如当时直接都分开写了，，，
    $scope.apiInfo = {
        currentType:'',  //表示当前是门诊，住院还是体检
        medicalRecordTypeId:'', //点击电子病历的时候需要这个id
        recordTime:'',//用于记录诊疗记录的日期
        classId:'',//检查检验获取头所需要的id
        targetId:'',//检查检验的唯一标示
        recordId:'',//每份电子病例的唯一标示
        hosp:{
            api:[
                {key:'hospitalizedBaseInfo',label:'住院基本信息',api:18},
                {key:'hospitalizedDiag',label:'住院诊断信息',api:19},
                {key:'hospitalComplaint',label:'住院主诉信息',api:24},
                {key:'hospitalFamily',label:'住院家族史信息',api:27},
                {key:'hospitalPast',label:'住院既往史信息',api:29},
                {key:'hospitalPersonal',label:'住院个人史信息',api:25},
                {key:'hospitalBody',label:'住院个体格检查信息',api:28}
            ],
            filter__xlPatientId:$routeParams.filter__xlPatientId,
            filter__xlMedicalId:''
        },
        menzhen:{
            api:[
                {key:'outpatientBaseInfo',label:'门诊基本信息',api:49},
                {key:'hospitalComplaint',label:'住院主诉信息',api:24},

                {key:'presentHistory',label:'住院现病史信息',api:52},
                {key:'pastCheck',label:'住院既往检查信息',api:77},
                {key:'pastExam',label:'住院既往检验信息',api:76},
                {key:'menzhenCheckBody',label:'住院个体格检查信息',api:39},

                {key:'hospitalFamily',label:'住院家族史信息',api:27},
                {key:'hospitalPast',label:'住院既往史信息',api:29},
                {key:'hospitalPersonal',label:'住院个人史信息',api:25},
                {key:'outpatientDiag',label:'门诊诊断信息',api:50},
                {key:'outpatientDrug',label:'门诊药品信息',api:51}
            ],
            filter__xlPatientId:$routeParams.filter__xlPatientId,
            filter__xlMedicalId:''
        },
        checkup:{
            api:[
                {key:'checkBaseInfo',label:'体检基本信息',api:71}
            ],
            filter__xlPatientId:$routeParams.filter__xlPatientId,
            filter__xlMedicalId:''
        }

    };

    //初始化，在这里集中获取导航数据，在导航数据获取之后进行全部模块的加载，这里可优化的在于
    //由于诊断信息会包含所有信息，所以在大量数据情况下会相当的卡，可以做成队列加载
    (function init() {
        RecordService.getNaviData($routeParams.filter__xlPatientId).then(function (msg) {
            $scope.naviData = msg.data;
            fixNaviData(); //这里处理一下数据

            //没有filter__xlMedicalId 则按照拿回来的数据默认显示第一个
            $routeParams.filter__xlMedicalId && $routeParams.filter__xlMedicalId!=='' && $routeParams.filter__xlMedicalId!==null?
                getData($routeParams.filter__xlMedicalId):getData($scope.naviData[0].value);
        });

        RecordService.getNumApi($routeParams.filter__xlPatientId,$routeParams.filter__xlMedicalId,75).then(function (msg) {
            $scope.allResults = msg.data.result;
        });
    })();

    function getData(filter__xlMedicalId) {
        $scope.naviData.forEach(function (n,i) {

            //这里是在给匹配的navi中的数据增加初始化的状态，以及丰富apiInfo的数据
            n.value == filter__xlMedicalId?(function(){

                $scope.naviData[i].active = true;
                $scope.apiInfo.currentType = $scope.naviData[i].type;//初始选中第一个，门诊
                $scope.apiInfo.currentType=='hosp'?$scope.naviData[i].children[1].active = true:$scope.naviData[i].children[0].active = true;

                $rootScope.targetTemplate = $scope.naviData[i].template;//这个是在页面初始化时第一个tab显示出来

                $scope.apiInfo[n.type].filter__xlMedicalId = n.value;
                $scope.apiInfo[n.type].api.forEach(function (ny,iy) {
                    RecordService.getNumApi($routeParams.filter__xlPatientId,n.value,ny.api).then(function (msg) {
                        $scope[ny.key] = msg.data.result;
                    });
                });
            })():undefined;
        })

    }

    function fixNaviData() {
        (function fix(arr,mark) {
            arr.forEach(function (n,i) {
                n.id = i;
                n['parent'] = mark;

                //虽然已经有唯一标示用来标示各种不同的template了。但是还没来得及改，牵扯的太多了
                n.label == '检查信息'||n.label == '检验信息'||n.label == '医嘱'||
                n.label == '手术信息'||n.label == '诊疗记录'||n.parent=='电子病历'
                ||n.label=='专科检查'?
                    n.template = n.label:n.template = null;

                //电子病历初始化特殊的id
                (n.label == '电子病历' ) && (!n.children || !n.children == null || !n.children.length == 0)?
                    (function () {
                        n.template = n.children[0].label;
                         n.medicalRecordTypeId =n.children[0].medicalRecordTypeId;
                    })():undefined;

                (n.label == '电子病历' ) && (n.children && (n.children == null || n.children.length == 0))?
                    (function () {
                        n.template = n.label;
                    })():undefined;

                // 诊疗记录需要拿到默认的时间，通过这个时间来确认数据，这个字段的有无是区分模板是拿的诊疗记录的数据还是正常无数据
                n.xlMedicalId == $routeParams.filter__xlMedicalId && n.label == '诊疗记录'?$scope.apiInfo.recordTime = n.children[0].label:undefined;

                //门诊状态下的默认检查信息。住院默认诊疗记录
                mark?delete n.type:(function () {
                    if(n.type == 'menzhen'){
                        n.template = '检查信息'
                        n.children[3].children.length>0 ?$scope.apiInfo.classId = n.children[3].children[0].examClassId:'';
                    }else if(n.type == 'checkup'){
                        n.template = '专科检查'
                    }else if(n.type == 'hosp'){
                        n.template = '诊疗记录'
                    }
                })();　

                n.children?(function () {

                    //初始化active字段
                    n['active'] = false;
                    return fix(n.children,n.label)

                })():undefined;
            })
        })($scope.naviData);
    }

    $scope.changeTab  =function (target,parent) {

        //这里踩了个史前巨坑，之前逻辑应该复用左侧导航的，但是并没有，脑抽风了，目前改为直接触发navidirective
        RecordService.showChild(target,parent);

        //强制刷新directive
        target.active && target.type?(function () {
            $scope.$emit('doRefresh',{
                target:target
            });
            $(".infi-main").scrollTop(0);
        })():undefined;

        //绑定新的template
        target.template?$scope.$root.targetTemplate = target.template:undefined;

        //父级controller有一个curentType表示当前值
        $scope.$emit('currentNavi',{
            currentNavi:target
        });

        $scope.$emit('changeDiagnosis',{
            target:target
        });
    }

    /**
     * tab切换后给currentType覆上当前值
     */
    $scope.$on('doRefresh',function (event,args) {
        $scope.doRefresh = false;
        getData(args.target.value);
        $timeout(function(){
            $scope.doRefresh = true
        },0);
    });

    $scope.$on('currentNavi',function(event,args){
        $scope.apiInfo.medicalRecordTypeId = '';
        args.currentNavi.type?$scope.apiInfo.currentType = args.currentNavi.type:'';
        $timeout(function () {
            args.currentNavi.medicalRecordTypeId && args.currentNavi.medicalRecordTypeId!=null?
                $scope.apiInfo.medicalRecordTypeId = args.currentNavi.medicalRecordTypeId:undefined;
        },0);
    });

    $scope.$on('changeDiagnosis',function(event,args){
        $scope.apiInfo.recordTime = '';
        $scope.apiInfo.classId = '';
        args.target.label == "电子病历"?$scope.apiInfo.recordId = args.target.children[0].recordId:''
        args.target.parent == "电子病历"?$scope.apiInfo.recordId = args.target.recordId:'';
        $timeout(function () {
            args.target.label == "诊疗记录"?$scope.apiInfo.recordTime = args.target.children[0].label:undefined;
            args.target.parent == "诊疗记录"?$scope.apiInfo.recordTime = args.target.label:undefined;

            args.target.label == "检查信息"?(function () {
                $scope.apiInfo.classId = args.target.children[0].examClassId;
                $scope.apiInfo.targetId = args.target.children[0].examNo;
            })():undefined;
            args.target.parent == "检查信息"?(function () {
                $scope.apiInfo.classId = args.target.examClassId;
                $scope.apiInfo.targetId = args.target.examNo;
            })():undefined;
            args.target.label == "检验信息"?(function () {
                $scope.apiInfo.classId = args.target.children[0].testClassId
                $scope.apiInfo.targetId = args.target.children[0].testNo;
            })():undefined;
            args.target.parent == "检验信息"?(function () {
                $scope.apiInfo.classId = args.target.testClassId
                $scope.apiInfo.targetId = args.target.testNo;
            })():undefined;
        },0);
    });
    $scope.goBack = function () {
        location.href = '#/record/' + $routeParams.filter__xlPatientId;
    }
}]);
