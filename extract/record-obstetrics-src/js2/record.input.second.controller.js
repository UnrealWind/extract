angular.module('infi-basic').controller('RecordInputSecondController', ['$scope', 'RecordService', 'Utils', '$routeParams', 'SYS', '$route', 'InputRecordOther','$filter','PrintService','$location','$q','$rootScope', function ($scope, RecordService, Utils, $routeParams, SYS, $route, InputRecordOther, $filter,PrintService,$location,$q,$rootScope) {
    //孕检档案页面controller文件

    var filter = 'daily-title';
    /**
     * url 参数
     * @type {{patientId: number, xlPatientId: *, xlMedicalId: *}}
     */
    $scope.queryParams = {
        patientId: $routeParams.id,
        xlPatientId: $routeParams.xlPatientId,
        xlMedicalId: $routeParams.xlMedicalId
    };
    $scope.lastGestationalDate = null;
    //定义显示收起信息录入列表
    $scope.isShow = false;
    $scope.pregnancy = {};
    $scope.visitrecord = {
        patiId:$scope.queryParams.patientId,
        xlMedicalId:$scope.queryParams.xlMedicalId,
        gestationalWeek:''
    };
    $scope.operateStatus = 'add';
    /**
     *
     */
    var list = [
        {
            label: '妊娠检查',
            value: 'pregnancy',
            url: 'daily/pregnancycheck/edit',
            saveUrl: 'daily/pregnancycheck/crud/' + $scope.queryParams.xlMedicalId,
            deleteUrl: 'daily/pregnancycheck/crud/'
        },
        {
            label: '复诊信息',
            value: 'visitrecord',
            url: 'daily/visitrecord/edit',
            saveUrl: 'daily/visitrecord/crud/' + $scope.queryParams.xlMedicalId,
            deleteUrl: 'daily/visitrecord/crud/'
        }
    ];

    $scope.printBasic = null;

    //==========================
    // 页面tab 切换相关的操作:包括获取标题数据以及tab切换点击事件
    //=========================
    RecordService.getTypeData(filter).then(function success(msg) {
        $scope.dataTypes = msg.data;
        $scope.dataTypes[0].active = true;
        $scope.currentDataType = $scope.dataTypes[0].value;
    });

    /**
     * tab 切换
     * @param entity
     */
    $scope.activeType = function (entity) {
        angular.forEach($scope.dataTypes, function (option) {
            option.active = false;
        });
        entity.active = true;
        $scope.currentDataType = entity.value;
    };


    //=============================
    // 获取门诊信息以及档案信息
    //=============================
    /**
     * 获取门诊基本信息
     */
    RecordService.getCaseInfo($scope.queryParams.patientId, $scope.queryParams.xlMedicalId).then(function success(msg) {
        $scope.caseList = msg.data;
    });


    //===============================
    // (1) 页面上获取档案信息,并获取表单数据的操作;
    //==============================
    /**
     * 获取档案信息
     */
    $scope.getArchives = function () {
        RecordService.getDailyList($scope.queryParams.patientId, $scope.queryParams.xlMedicalId).then(function success(msg) {
            $scope.archives = msg.data;
            //输出页面用到printList(用于预览)
            if($location.$$path.indexOf('output/pregnancy')>0){
                var archiveId = $routeParams.archiveId;
                angular.forEach($scope.archives,function(archive){
                    if(archive.id == archiveId){
                        $scope.editArchive(archive);
                    }
                });
                RecordService.getArchiveBasic($scope.queryParams.xlPatientId,$scope.queryParams.xlMedicalId,$scope.queryParams.patientId).then(function(msg){
                    if(msg.status == SYS.STATUS_SUCCESS){
                        $scope.printBasic = msg.data.result[0];
                    }
                })
            }else{
                //初始状态判断(若是有今天日期的孕检档案显示当前日期,如没有显示创建的窗口)
                if(msg.status == SYS.STATUS_SUCCESS){
                    var nowDate = $filter('date')(new Date(),'yyyy-MM-dd');
                    var archives = null;
                    var hasDate = false;//是否有当天的日期
                    angular.forEach($scope.archives,function(archive){
                        if(archive.recordDate == nowDate){
                            hasDate = true;
                            archives = archive;
                        }
                    });
                    if(hasDate){
                        $scope.editArchive(archives);
                    }else{
                        $scope.addArchive();
                    }
                }else{
                    $scope.addArchive();
                }
            }
        });
        //获取所有周期的妊娠检查信息(之前的需求是获取日期最大的显示,所以当时新加的接口,获取所有妊娠检查获取日期)
        // RecordService.getInfo('',$scope.queryParams.xlPatientId,'','',66,'').then(function success(msg){
        //     if(msg.data.status == SYS.STATUS_SUCCESS){
        //         $scope.archiveWeek = angular.copy(msg.data.data.result);
        //     }
        // })
    };
    $scope.getArchives();

    /**
     * 保存完后刷新页面
     */
    function saveInit(){
        RecordService.getDailyList($scope.queryParams.patientId, $scope.queryParams.xlMedicalId).then(function success(msg) {
            $scope.archives = msg.data;
        });
        //获取所有周期的妊娠检查信息
        // RecordService.getInfo('',$scope.queryParams.xlPatientId,'','',66,'').then(function success(msg){
        //     if(msg.data.status == SYS.STATUS_SUCCESS){
        //         $scope.archiveWeek = angular.copy(msg.data.data.result);
        //     }
        // })
    }


    /**
     * 将获取高危评分提取为公共的部分
     */
    $scope.getHeighRisk = function () {
        RecordService.getObstetricsInfo('daily', 'highrisk/crud', $scope.queryParams.patientId,
            $scope.queryParams.xlMedicalId).then(function success(msg) {
            if (msg.data.data == null) {
                msg.data.data = {};
            }
            $scope.daily = msg.data.data;
            $scope.daily.highRiskScoreOTHER = InputRecordOther.filterOther($('#daily-other'), "daily.highRiskScoreOTHER ", $scope.daily.highRiskScore);
        })
    };

    /**
     * 编辑档案信息
     */
    $scope.editArchive = function (archive) {
        $scope.operateStatus = 'edit';
        // 当编辑档案时设置为默认显示第一项;
        defaultFirstTab();

        $scope.isShow = true;
        // $scope.queryIndexes(archive.gestationalWeeks);
        $scope.infiarchId = archive.id;

        // 解决值被覆盖的问题,虽然有点挫;
        var entity = list[0];
        RecordService.getDaily(entity.value, entity.url, $scope.queryParams.patientId, archive.gestationalWeeks,
            $scope.queryParams.xlMedicalId).then(function success(msg) {
            if (msg.data.data == null) {
                msg.data.data = {};
            }
            $scope[msg.type] = msg.data.data;

            if (msg.data.status == SYS.STATUS_SUCCESS) {
                var positionAll = angular.copy($scope.pregnancy.position);
                $scope.pregnancy.positionOTHER = InputRecordOther.filterOther($('#pregnancy-other'), "pregnancy.positionOTHER", positionAll);//这个获取'其他'是获取的数组中把默认的去掉,剩下的是其他
                lastGestationalDate();
            }
        });
        //获取高危评分
        $scope.getHeighRisk();

        var wraps = list[1];
        RecordService.getDaily(wraps.value, wraps.url, $scope.queryParams.patientId, archive.gestationalWeeks,
            $scope.queryParams.xlMedicalId).then(function success(msg) {
            if (msg.data.data == null) {
                msg.data.data = {};
            }
            $scope[msg.type] = msg.data.data;
        });
    };

    function lastGestationalDate(){
        var basicUrl = 'basicinfo/crud';
        RecordService.getObstetricsInfo('basic',basicUrl,
            $scope.queryParams.patientId,$scope.queryParams.xlMedicalId).then(function(msg){
            $scope.lastGestationalDate = msg.data.data.lastGestationalDate;
        })
    }

    /**
     * 计算周和天
     */
    $scope.$watch('pregnancy.date',function(newValue,oldValue){
        if(newValue == oldValue){
            return false;
        }
        if($scope.pregnancy.date&&$scope.lastGestationalDate){
            var D_value = DateDiff($scope.lastGestationalDate,$scope.pregnancy.date),
                D_week = D_value/7,
                D_day = D_value%7;
            $scope.pregnancy.pregnancyWeek = Math.floor(D_week);
            $scope.pregnancy.pregnancyDay = D_day;
        }
    });

    /**
     * 根据周和天计算检查日期
     */
    $scope.$watch('pregnancy.pregnancyWeek',function(newValue,oldValue){
        if(newValue == oldValue){
            return false;
        }
        if($scope.pregnancy.pregnancyWeek&&$scope.lastGestationalDate){
            var date = new Date($scope.lastGestationalDate);
            var days = $scope.pregnancy.pregnancyWeek*7 + $scope.pregnancy.pregnancyDay;
            date.setDate(date.getDate()+days);
            $scope.pregnancy.date = $filter('date')(date,'yyyy-MM-dd');
        }
    });

    /**
     * 根据周和天计算检查日期
     */
    $scope.$watch('pregnancy.pregnancyDay',function(newValue,oldValue){
        if(newValue == oldValue){
            return false;
        }
        if($scope.pregnancy.pregnancyDay&&$scope.lastGestationalDate){
            var date = new Date($scope.lastGestationalDate);
            var days = Number($scope.pregnancy.pregnancyWeek*7) + Number($scope.pregnancy.pregnancyDay);
            date.setDate(date.getDate()+days);
            $scope.pregnancy.date = $filter('date')(date,'yyyy-MM-dd');
        }
    });

    function count(){
        var basicUrl = 'basicinfo/crud';
        RecordService.getObstetricsInfo('basic',basicUrl,
            $scope.queryParams.patientId,$scope.queryParams.xlMedicalId).then(function(msg){
            $scope.lastGestationalDate = msg.data.data.lastGestationalDate;
            if($scope.pregnancy.date&&$scope.lastGestationalDate){
                var D_value = DateDiff($scope.lastGestationalDate,$scope.pregnancy.date),
                    D_week = D_value/7,
                    D_day = D_value%7;
                $scope.pregnancy.pregnancyWeek = Math.floor(D_week);
                $scope.pregnancy.pregnancyDay = D_day;
            }
        })

    }

    /**
     * 计算相差天数
     * @param dateLast
     * @param dataPregnancy
     * @returns {number|*}
     * @constructor
     */
    function DateDiff (dateLast,dataPregnancy){
        var differValue,
            a = new Date(dateLast).getTime(),
            b= new Date(dataPregnancy).getTime(),
            c = 60*60*24*1000;
        differValue = (b - a)/c;
        return differValue;
    }

    $scope.setDafaultTime = function(){
        if($scope.pregnancy == undefined || $scope.pregnancy.date == undefined){
            $scope.pregnancy = {};
            //angular进行日期的格式化
            var defaultTime=$filter('date')(new Date(),'yyyy-MM-dd');
            $scope.pregnancy.date = defaultTime;
        }
    };

    /**
     * 添加新的档案信息进行录入
     */
    $scope.addArchive = function () {
        $scope.operateStatus = 'add';
        $scope.isHas = true;
        $scope.isShow = true;

        //当新添加档案时,让其默认显示第一个tab
        defaultFirstTab();

        var idx, entity;
        //当点击添加孕产档案时,应该将列表数据清空;
        for (idx = 0; idx < list.length; idx++) {
            entity = list[idx];
            $scope[entity.value] = '';
            if ($scope.infiarchId) {
                $scope.infiarchId = '';
            }
            // else if ($scope.archives && $scope.archives[0].id) {
            //     $scope.archives[0].id = '';
            // }
        }
        //默认当前时间
        $scope.setDafaultTime();
        count();
        //再添加新的档案信息之后也会
        $scope.getHeighRisk();
        //获取基本信息，是用来计算妊娠期
        lastGestationalDate();
    };


    /**
     *  当添加新的档案信息和编辑档案信息时,设置为默认显示第一项
     */
    function defaultFirstTab() {
        $scope.currentDataType = 'maternal';
        angular.forEach($scope.dataTypes, function (option) {
            option.value == 'maternal' ? option.active = true : option.active = false;
        });
    }

    //=======================================
    //进行档案信息的删除操作,包括调出模态框,以及确认删除操作
    //=======================================
    /**
     * 删除档案信息,主要做的是调出模态框,并设置全局变量
     * @param archive
     */
    $scope.deleteArchive = function (archive) {

        $('#myModal').modal('show');

        //将要删除的周设置为全局变量
        $scope.Archive = archive;
    };

    /**
     * 点击确认删除档案信息
     */
    $scope.deleteThisArchive = function () {
        var ListUrl = 'daily/fileinfo/crud/';
        RecordService.deleteDaily(ListUrl, $scope.queryParams.patientId, $scope.Archive.gestationalWeeks,
            $scope.queryParams.xlMedicalId).then(function success(msg) {
            if (msg.status == SYS.STATUS_SUCCESS) {
                // 删除成功之后重新请求列表信息数据(之前调用页面初始化方法,现在需求变动,重写删除之后的方法)
                // $scope.getArchives();
                RecordService.getDailyList($scope.queryParams.patientId, $scope.queryParams.xlMedicalId).then(function success(msg) {
                    $scope.archives = msg.data;
                    $scope.isShow = false;
                    if(msg.status == SYS.STATUS_SUCCESS){
                        msg.description = "删除成功";
                    }else{
                        msg.description = "删除失败";
                    }
                    Utils.sysTip($scope,msg);
                })
            }
        });
        //(2) 删除该周下的
        eachList(function (entity) {
            RecordService.deleteDaily(entity.deleteUrl, $scope.queryParams.patientId,
                $scope.Archive.gestationalWeeks, $scope.queryParams.xlMedicalId).then(function success(msg) {
                if (msg.status == SYS.STATUS_SUCCESS) {
                    //重新获取当前周的数据
                    $scope[entity.value] = '';
                }
            });
        });
        $('#myModal').modal('hide');
    };


    //==========================
    //表单信息的保存操作
    //==========================
    /**
     * 保存日常录入信息
     */
    $scope.saveDaily = function () {
        // $scope.isShow = false;
        //防止妊娠周后面出现小数点的情况>>(1.)
        var reg = /.*\..*/;
        var tips;
        //限制其必须进行妊娠周期的录入,且必须为数字类型
        if ($scope.pregnancy == undefined || $scope.pregnancy.pregnancyWeek == undefined ||
            $.trim($scope.pregnancy.pregnancyWeek) == '' || isNaN($scope.pregnancy.pregnancyWeek) ||
            reg.test($scope.pregnancy.pregnancyWeek)) {
            tips = {
                description: '请输入正确的妊娠期',
                status: 'error'
            };
            Utils.sysTip($scope, tips);
            return false;
        }
        if($scope.pregnancy.date == undefined || $scope.pregnancy.date == "" || $scope.pregnancy.date == null){
            tips = {
                description: '请输入检查日期',
                status: 'error'
            };
            Utils.sysTip($scope, tips);
            return false;
        }

        //这个地方主要做的处理有向档案信息添加日期孕周，以及复诊信息添加孕周
        $scope.fileInfo = {};
        $scope.fileInfo.patiId = $scope.queryParams.patientId;
        $scope.fileInfo.recordDate = angular.copy($scope.pregnancy.date);
        $scope.fileInfo.gestationalWeeks = angular.copy($scope.pregnancy.pregnancyWeek);
        if ($scope.infiarchId) {
            $scope.fileInfo.id = $scope.infiarchId
        }
        // else if ($scope.archives && $scope.archives[0].id) {
        //     $scope.fileInfo.id = $scope.archives[0].id;
        // }

        //检验孕周是否重复,若重复的话不发任何请求
        if($scope.pregnancy.id && !checkWeek($scope.pregnancy)){
            var msg = {
                status:SYS.STATUS_ERROR,
                description:$scope.pregnancy.pregnancyWeek + "孕周已存在,不能重复添加"
            };
            Utils.sysTip($scope, msg);
            return false;
        }
        //血压值可以保存的情况(1.高压和低压都没有填,2.高压和低压都填了)
        if(!((!$scope.pregnancy.highPressure && !$scope.pregnancy.lowPressure) || ($scope.pregnancy.highPressure && $scope.pregnancy.lowPressure))){
            var msg = {
                status:SYS.STATUS_ERROR,
                description:"请补全血压值"
            };
            Utils.sysTip($scope, msg);
            return false;
        }
        var idx, entity;
        for (idx = 0; idx < list.length; idx++) {
            entity = list[idx];
            //万一页面没有填值,初始化一下,不然传到后台是控制会报错
            if(!$scope[entity.value]){
                $scope[entity.value] = {};
            }
            //向后台保存数据需要带上patientId
            $scope[entity.value].patiId = $scope.queryParams.patientId;
            $scope[entity.value].xlMedicalId = $scope.queryParams.xlMedicalId;
            if (entity.value == 'visitrecord') {
                $scope[entity.value].gestationalWeek = angular.copy($scope.pregnancy.pregnancyWeek);
            }
            RecordService.saveDaily(entity.saveUrl, $scope[entity.value]).then(function success(msg) {
                if(msg.status == SYS.STATUS_SUCCESS){
                    saveInit();
                }
            });
        }
        //保存档案信息
        var url = 'daily/fileinfo/crud/' + $scope.queryParams.xlMedicalId;
        RecordService.saveDailyList(url, $scope.fileInfo).then(function success(msg) {
            if (msg.status == SYS.STATUS_SUCCESS) {
                $scope.isShow = false;
                msg.description = '数据保存成功';
            }
            Utils.sysTip($scope, msg);
        });

        //ljy_debug保存高危评分，这个是因为高危评分和首次录入的高危评分一致
        RecordService.saveFirst('firstentry/highrisk/crud', $scope.daily).then(function success(msg) {

        })
    };

    /**
     * 编辑时检查有没有重复日期
     * @param data
     */
    function checkWeek(data){
        var flag = true;
        angular.forEach($scope.archiveWeek,function(archive){
            if(archive.id != data.id && archive.pregnancy_week == data.pregnancyWeek){
                flag = false;
            }
        });
        return flag;
    }

    function eachList(callback) {
        var idx, entity;
        for (idx = 0; idx < list.length; idx++) {
            entity = list[idx];
            callback(entity)
        }
    }

    /**
     * 打印
     */
    $scope.printPregnancy = function(){
        PrintService.bindPrint("pregnancy");
    };

    /**
     * 返回按钮
     */
    $scope.goBack = function(){
        //保存后将isShow的状态置为false,则内容不显示,如果为true表示还没有保存,提示
        if($scope.isShow){
            $('#confirmBack').modal('show');
        }else{
            window.location.href="#/overview/obstetrics/"+$scope.queryParams.xlPatientId+"/"+$scope.queryParams.xlMedicalId+"/"+$scope.queryParams.patientId;
        }
    };
    /**
     * 确认返回
     */
    $scope.submitBack = function(){
        $('#confirmBack').modal('hide');
        setTimeout(function(){
            window.location.href="#/overview/obstetrics/"+$scope.queryParams.xlPatientId+"/"+$scope.queryParams.xlMedicalId+"/"+$scope.queryParams.patientId;
        },500);
    };

    function getArchive(archive) {
        archive.pregnancy = null;
        archive.visitrecord = null;
        // 解决值被覆盖的问题,虽然有点挫;
        var entity = list[0];
        var wraps = list[1];
        $q.all({first:RecordService.getDaily(entity.value, entity.url, $scope.queryParams.patientId, archive.gestationalWeeks,
            $scope.queryParams.xlMedicalId),second:RecordService.getDaily(wraps.value, wraps.url, $scope.queryParams.patientId, archive.gestationalWeeks,
            $scope.queryParams.xlMedicalId)}).then(function(arr){
            var arr1 = arr.first;
            var arr2 = arr.second;
            if (arr1.data.data == null) {
                arr1.data.data = {};
            }
            archive[arr1.type] = arr1.data.data;

            if (arr1.data.status == SYS.STATUS_SUCCESS) {
                var positionAll = angular.copy(archive.pregnancy.position);
                archive.pregnancy.positionOTHER = InputRecordOther.filterOther($('#pregnancy-other'), "pregnancy.positionOTHER", positionAll);
                // lastGestationalDate();
            }

            if (arr2.data.data == null) {
                arr2.data.data = {};
            }
            archive[arr2.type] = arr2.data.data;
        });
    }
}]);