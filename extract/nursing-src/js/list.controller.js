angular.module('infi-basic').controller('ListController', ['$scope', 'SYS', 'ListService', '$location', 'Utils', 'DetailsService', function ($scope, SYS, ListService, $location, Utils, DetailsService) {
    //tab列表
    $scope.tabs = [
        {
            label:"院内管理",
            value:"hosptial",
            name:"院内",
            active:true
        },{
            label:"院后管理",
            value:"after",
            name:"院后",
            active:false
        }
    ];
    $scope.searchWords = "";
    //是新增患者还是编辑
    $scope.status = SYS.ADD;
    //新增患者时校验病案号状态
    $scope.checkList = {
        status:'',
        patientName:null
    };
    // $scope.formDisable = false;
    $scope.SYS = SYS;
    //当前选中的tab
    $scope.currentTab = {
        label:"院内管理",
        name:"院内"
    };

    $scope.opts = {
        label:"操作",
        btns:[
            {
                label:"查看详情",
                type:"show"
            },{
                label:"修改",
                type:"edit"
            }
        ]
    };

    $scope.newPatient = null;
    $scope.departList = {
        value:"",
        options:[]
    };
    $scope.areaList = {
        value:"",
        options:[]
    };

    //筛选条件
    $scope.screen = {
        hosptial:{
            tableTab:{
                value:"",
                options:[
                    {
                        label:"全部显示",
                        value:0,
                        active:true
                    },{
                        label:"最近7天计划维护",
                        value:1,
                        active:false
                    },{
                        label:"历史计划维护",
                        value:2,
                        active:false
                    }
                ]
            },
            depart:{
                value:"",
                options:[]
            },
            area:{
                value:"",
                options:[]
            },
            tubeType:{
                value:"",
                options:[]
            },
            tubeTime:{
                startTime:"",
                endTime:""
            },
            riskLevel:{
                value:"",
                options:[]
            },
            columns:{},
            content:null
        },
        after:{
            tableTab:{
                value:"",
                options:[
                    {
                        label:"全部显示",
                        value:0,
                        active:true
                    },{
                        label:"最近7天计划维护",
                        value:1,
                        active:false
                    },{
                        label:"历史计划维护",
                        value:2,
                        active:false
                    }
                ]
            },
            depart:{
                value:"",
                options:[]
            },
            area:{
                value:"",
                options:[]
            },
            tubeType:{
                value:"",
                options:[]
            },
            tubeTime:{
                startTime:"",
                endTime:""
            },
            riskLevel:{
                value:"",
                options:[]
            },
            columns:{},
            content:null
        }
    };
    function init() {
        //获取院内列表表头
        ListService.ajaxJson('hosptial.columns').then(function(msg){
            if(msg.status == SYS.STATUS_SUCCESS){
                $scope.screen.hosptial.columns = msg.data;
            }
        });
        //获取院后列表表头
        ListService.ajaxJson('after.columns').then(function(msg){
            if(msg.status == SYS.STATUS_SUCCESS){
                $scope.screen.after.columns = msg.data;
            }
        });
        getContent(SYS.DEFAULT_PAGE_NUMBER,SYS.DEFAULT_PAGE_SIZE);
        getDepart();
        getArea();
        getCatheterType();
        getRiskLevel()
    }

    /**
     * 获取科室列表
     */
    function getDepart(){
        ListService.getDepart().then(function(msg){
            $scope.screen.hosptial.depart.options = msg.data.result;
            $scope.screen.after.depart.options = msg.data.result;
            $scope.departList.options = msg.data.result;
        })
    }

    /**
     * 传过来的参数都是自己的tab类型下的
     * @param dept
     * @param ward
     * @param tubeType
     * @param riskGrade
     * @param startTime
     * @param endTime
     * @param page
     * @param size
     * @param type
     */
    $scope.updateList = function(dept,ward,tubeType,riskGrade,startTime,endTime,type,page,size){
        //如果搜索框有值,禁用三级筛选
        if(!($scope.searchWords!=null && $scope.searchWords!="")){
            var filter = {
                dept:dept,
                ward:ward,
                tubeType:tubeType,
                riskGrade:riskGrade,
                startTime:startTime,
                endTime:endTime,
                page:page,
                size:size,
                tab:$scope.currentTab.name,
                type:type
            };
            ListService.getContent(filter).then(function(msg){
                if($scope.currentTab.name == "院内"){
                    $scope.screen.hosptial.content = msg;
                }else{
                    $scope.screen.after.content = msg;
                }
            })
        }
    };

    /**
     * 新增患者之后刷新
     */
    $scope.refreshList = function(){
        if( $scope.currentTab.name == "院内"){
            $scope.updateList($scope.screen.hosptial.depart.value,$scope.screen.hosptial.area.value,$scope.screen.hosptial.tubeType.value,
                $scope.screen.hosptial.riskLevel.value,$scope.screen.hosptial.tubeTime.startTime,$scope.screen.hosptial.tubeTime.endTime,$scope.screen.hosptial.tableTab.value);
        }else if( $scope.currentTab.name == "院后"){
            $scope.updateList($scope.screen.after.depart.value,$scope.screen.after.area.value,$scope.screen.after.tubeType.value,
                $scope.screen.after.riskLevel.value,$scope.screen.after.tubeTime.startTime,$scope.screen.after.tubeTime.endTime,$scope.screen.after.tableTab.value);
        }
    };
    /**
     * 切换科室
     * @param id
     * @param type
     */
    $scope.hospitalChange = function(id,type){
        ListService.getArea(id).then(function(msg){
            if(type == 'hosptial'){
                $scope.screen.hosptial.area.value = "";
                $scope.screen.hosptial.area.options = msg.data.result;
                $scope.updateList($scope.screen.hosptial.depart.value,$scope.screen.hosptial.area.value,$scope.screen.hosptial.tubeType.value,
                    $scope.screen.hosptial.riskLevel.value,$scope.screen.hosptial.tubeTime.startTime,$scope.screen.hosptial.tubeTime.endTime,$scope.screen.hosptial.tableTab.value);
            }else if(type == 'after'){
                $scope.screen.after.area.value = "";
                $scope.screen.after.area.options = msg.data.result;
                $scope.updateList($scope.screen.after.depart.value,$scope.screen.after.area.value,$scope.screen.after.tubeType.value,
                    $scope.screen.after.riskLevel.value,$scope.screen.after.tubeTime.startTime,$scope.screen.after.tubeTime.endTime,$scope.screen.after.tableTab.value);
            }
        })
    };

    function getCatheterType(){
        ListService.getCatheterType().then(function(msg){
            $scope.screen.hosptial.tubeType.options = msg.data.result;
            $scope.screen.after.tubeType.options = msg.data.result;
        })
    }
    function getRiskLevel(){
        ListService.getRiskLevel().then(function (msg) {
            $scope.screen.hosptial.riskLevel.options = msg.data.result;
            $scope.screen.after.riskLevel.options = msg.data.result;
        })
    }
    function getArea(){
        ListService.getArea().then(function(msg){
            $scope.screen.hosptial.area.options = msg.data.result;
            $scope.screen.after.area.options = msg.data.result;
            $scope.areaList.options = msg.data.result;
        })
    }

    function getContent(page,size){
        //获取院后列表内容
        ListService.getContent({
            page:page,
            size:size,
            tab:$scope.currentTab.name
        }).then(function(msg){
            if($scope.currentTab.name == "院内"){
                $scope.screen.hosptial.content = msg;
            }else{
                $scope.screen.after.content = msg;
            }
        });
    }
    init();

    /**
     * 分页数据
     * @param dept
     * @param ward
     * @param tubeType
     * @param riskGrade
     * @param startTime
     * @param endTime
     * @param search
     * @param page
     * @param size
     */
    $scope.updatePage = function(dept,ward,tubeType,riskGrade,startTime,endTime,search,type,page,size){
        var filter = null;
        if(search!=""){
            filter = {
                search:search,
                page:page,
                size:size
            }
        }else{
            filter = {
                dept:dept,
                ward:ward,
                tubeType:tubeType,
                riskGrade:riskGrade,
                startTime:startTime,
                endTime:endTime,
                page:page,
                size:size,
                tab:$scope.currentTab.name,
                type:type
            }
        }
        ListService.getContent(filter).then(function(msg){
            if($scope.currentTab.name == "院内"){
                $scope.screen.hosptial.content = msg;
            }else{
                $scope.screen.after.content = msg;
            }
        })
    };

    /**
     * 需要判断请求哪一个tab类型下的表格内容(搜索关键词)
     * @param word
     */
    $scope.updateListType = function(word){
        if(word=="" || word==null){
            var tips = {
                status:SYS.STATUS_ERROR,
                description:'请输入搜索值'
            };
            Utils.sysTip($scope,tips);
        }else{
            var filter = {
                search:word
            };
            ListService.getContent(filter).then(function(msg){
                //考虑到切换,院内院后数据都要替换
                $scope.screen.hosptial.content = msg;
                $scope.screen.after.content = msg;
            })
        }
    };

    /**
     * 院内院后切换
     * @param tab
     */
    $scope.switchTab = function (tab) {
        angular.forEach($scope.tabs,function(tabs){
            tabs.active = false;
            if(tabs.label == tab.label){
                tabs.active = true;
                $scope.currentTab.label = tabs.label;
                $scope.currentTab.name = tabs.name;
            }
        });
        //如果搜索框有值,不能刷新
        if(!($scope.searchWords!="")) {
            $scope.refreshList();
        }
    };
    //新增患者
    $scope.showAdd = function(){
        $scope.status = SYS.ADD;
        //清空上次校验留下的数据
        $scope.checkList = {
            status:'',
            patientName:null
        };
        $scope.newPatient = ListService.createPatient();
        $('#add-patient').modal({backdrap:'static'});
    };
    //修改患者
    $scope.showEdit = function(entity){
        $scope.status = SYS.EDIT;
        //清空上次校验留下的数据
        $scope.checkList = {
            status:'',
            patientName:null
        };
        //获取基本信息
        DetailsService.getBasic(entity.patient_id).then(function(msg){
            $scope.newPatient = msg.data;
            $('#add-patient').modal({backdrap:'static'});
        });
    };

    /**
     * 新增患者(确定按钮)
     */
    $scope.addPatient = function(entity){
        if(!(entity.patientName!=""&&entity.patientName!=null && entity.patientId!=""&&entity.patientId!=null && entity.dept!=""&&entity.dept!=null &&
            entity.isHospitalization!=""&&entity.isHospitalization!=null && entity.visitId!=""&&entity.visitId!=null && entity.diagnosis!=""&&entity.diagnosis!=null)){
            var msg = {
                status:SYS.STATUS_ERROR,
                description:"必填项不能为空"
            };
            Utils.sysTip($scope,msg);
        }else{
            ListService.savePatient(entity,$scope.status).then(function(msg){
                var mss = {
                    status:msg.data.viewStatus,
                    description:msg.data.statusDetail
                };
                Utils.sysTip($scope,mss);
                if(msg.data.viewStatus == SYS.STATUS_SUCCESS){
                    angular.forEach($scope.tabs,function(tab){
                        if(tab.name == msg.data.isHospitalization){
                            $scope.switchTab(tab);
                        }
                    });
                    $('#add-patient').modal('hide');
                }
            })
        }
    };

    $scope.showDetails = function(entity,type){
        if(type == 'show'){
            $location.path("details/"+entity.patientId);
        }
    };
    // $scope.updatePage = function(page){
    //     getContent(page,SYS.DEFAULT_PAGE_SIZE);
    // };
    /**
     * 新增患者时科室切换
     * @param value
     */
    $scope.changeDepart = function(value){
        ListService.getArea(value).then(function(msg){
            $scope.areaList.options = msg.data.result;
        })
    };
    /**
     * 检查病案号是否重复
     * @param patientId
     * @param id
     */
    $scope.checkId = function(patientId,id){
        if(patientId){
            ListService.checkId(patientId,id).then(function(msg){
                if(msg.data.viewStatus == SYS.STATUS_SUCCESS){
                    $scope.checkList.status = msg.data.viewStatus;
                }else{
                    $scope.checkList.status = msg.data.viewStatus;
                    $scope.checkList.patientName = msg.data.patientName;
                }
            })
        }else{
            $scope.checkList.status = '';
            $scope.checkList.patientName = "";
        }
    };
    /**
     * 校验到重复后查看详情
     * @param patient
     */
    $scope.showCheckPatient = function(patient){
        $("#add-patient").modal('hide');
        setTimeout(function(){
            window.location.href = "#/details/"+patient.patientId;
        },500);
    };

    /**
     * 表格tab切换
     * @param tab
     * @param type
     */
    $scope.choseTableTab = function(tab,type){
        angular.forEach($scope.screen[type].tableTab.options,function(option){
            option.active = false;
            if(option.value == tab.value){
                $scope.screen[type].tableTab.value = option.value;
                option.active = true;
                $scope.updateList($scope.screen[type].depart.value,$scope.screen[type].area.value,$scope.screen[type].tubeType.value,
                    $scope.screen[type].riskLevel.value,$scope.screen[type].tubeTime.startTime,$scope.screen[type].tubeTime.endTime,$scope.screen[type].tableTab.value);
            }
        })
    };
    /**
     * 检查表单是否禁用(搜索框有值表单禁用)
     */
    // $scope.checkDisable = function () {
    //     if($scope.searchWords!=""){
    //         $scope.formDisable = true;
    //     }else{
    //         $scope.formDisable = false;
    //     }
    // };
    
    // $scope.updateAfterPage = function(page){
    //
    // };

    //时间插件
    $scope.timePlugin = function(tagName,projectName,refreshList){
        var that = this;
        $('input[name="'+tagName+'"]').datetimepicker({
            format: 'yyyy-mm-dd',
            language:"zh-CN",
            minView :2,
            autoclose: true,
            forceParse:true,
            todayBtn: true
        }).trigger('focus')
    }
}]);