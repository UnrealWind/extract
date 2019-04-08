angular.module('infi-basic')
    .service('DataService',['$http','SYS',function($http,SYS){
        //crf收藏
        this.ajaxSysCollection = function (id,project) {
            return $http({
                method:'get',
                url:SYS.url+'load/profiles/collect/'+id,
                params: {
                    "projectName":project
                }
            }).then(function(data){
                return data;
            });
        }
        //自动转换
        this.ajaxExcelPreview = function(subjectId){
            return $http({
                method:'get',
                url:SYS.url+'auto/'+subjectId+'/genaral/values'
            }).then(function(data){
                return data;
            });
        }
        //自动转换--生成病例
        this.ajaxGenerate = function(subjectId,subjectGroupId){
            return $http({
                method:'get',
                url:SYS.url+'auto/'+subjectId+'/'+subjectGroupId+'/records'
            }).then(function(data){
                return data;
            });
        }

        //判断权限
        this.ajaxPermissions = function(subjectId){
            return $http({
                method:'get',
                url:SYS.url+'subject/security/'+subjectId
            }).then(function(data){
                return data;
            });
        }

        //审核按钮
        this.ajaxAuditResult = function(id,pass,remarks){
            return $http({
                method:'post',
                url:SYS.url+'load/records/verify/'+id,
                params: {
                    'pass':pass,
                    'remarks':remarks
                }
            }).then(function(data){
                return data;
            });
        }

        //审核列表页
        this.ajaxAuditList = function(subjectId,filter,listEndTime,listStartTime,sourceValue,filter_EQ_sectName,filter_IN_status,filter_EQ_subjectGroupId, filter_EQ_reportHospital,searchWord){
            if(!filter){
                filter = 1;
            }
            return $http({
                method:'get',
                url:SYS.url+'load/records/subject/record/'+subjectId,
                params: {
                    'page_number':filter,
                    'page_size':10,
                    'page_sord':'upTime',
                    'filter_EQ_sourceType':sourceValue,
                    'filter_LTE_createTime':listEndTime,
                    'filter_GTE_createTime':listStartTime,
                    'searchWord':searchWord,
                    'filter_EQ_subjectGroupId':filter_EQ_subjectGroupId,
                    'filter_IN_status':filter_IN_status,
                    'filter_EQ_reportHospital':filter_EQ_reportHospital,
                    'filter_EQ_sectName':filter_EQ_sectName
                }
            }).then(function(data){
                return data;
            });
            // return $http.get('data/cases1.json').then(function(data){
            //     return data;
            // });
        }

        //批量提交
        this.ajaxDataSubmit = function(recordIds,groupId){
            return $http({
                method:'get',
                url:SYS.url+'load/records/execute/record/'+groupId,
                params: {
                    "recordIds":recordIds
                }
            }).then(function(data){
                return data;
            });
        }
        //批量删除
        this.ajaxDataDelete = function(recordIds,groupId){
            return $http({
                method:'get',
                url:SYS.url+'load/records/subject/delete/'+groupId,
                params: {
                    "recordIds":recordIds
                }
            }).then(function(data){
                return data;
            });
        }
        //excel保存
        this.ajaxExcelSave = function(projectName,subjectId,subjectGroupId,taskGroupId){
            return $http({
                method:'get',
                url:SYS.url+'subject/profile/up/'+projectName,
                params: {
                    'subjectId':subjectId,
                    'subjectGroupId':subjectGroupId,
                    'taskGroupId':taskGroupId
                }
            }).then(function(data){
                return data;
            });
        }

        //申请修改
        this.ajaxCasesModification = function(id){
            return $http({
                method:'post',
                url:SYS.url+'load/records/execute/modify/'+id
            }).then(function(data){
                return data;
            });
        }

        //提交单个
        this.ajaxCasesSubmit = function(id){
            return $http({
                method:'post',
                url:SYS.url+'load/records/execute/'+id
            }).then(function(data){
                return data;
            });
        }

        //删除单个
        this.ajaxCasesDelete = function(id){
            return $http({
                method:'post',
                url:SYS.url+'load/records/subject/delete/'+id
            }).then(function(data){
                return data;
            });
        }

        this.timePlugin = function(tagName,projectName,refreshList){
            var that = this;
            $('input[name="'+tagName+'"]').datetimepicker({
                format: 'yyyy-mm-dd',
                language:"zh-CN",
                minView :2,
                autoclose: true,
                forceParse:true,
                todayBtn: true
            }).trigger('focus')
            // .on('changeDate', function(ev){
            //     refreshList();
            // });
        }

        //病例录入新建病例的保存按钮
        this.ajaxCasesSave = function(data,id,taskGroupId,projectName){
            return $http({
                method:'post',
                url:SYS.url+'load/records/'+projectName+'?groupId='+taskGroupId,
                data: data
            }).then(function(data){
                return data;
            });
        }

        //用户信息
        this.ajaxUserInfo = function(){
            return $http({
                method:'get',
                url:SYS.url+'subject/attend/detail/user'
            }).then(function(data){
                return data;
            });
        }

        //病例录入的列表页
        this.ajaxCasesList = function(data,filter,listStartTime,listEndTime,sourceValue,currentValue,setKeyword){
            if(!filter){
                filter = 1;
            }
            return $http({
                method:'get',
                url:SYS.url+'load/records/subject/'+data,
                params:{
                    'subjectGroupId':data,
                    'page_number':filter,
                    'page_size':10,
                    'searchWord':setKeyword,
                    'filter_IN_status':currentValue,
                    'filter_EQ_sourceType':sourceValue,
                    'filter_LTE_createTime':listEndTime,
                    'filter_GTE_createTime':listStartTime
                }
            }).then(function(data){
                return data;
            });
        }
        //病例列表数据内容
        this.ajaxCasesColumns = function(type,sourceType,profileName){
            return $http.get('data/cases.columns.json').then(function(data){
                return data.data;
            });
        }

        //主中心 分中心数据
        this.ajaxCenter = function(id){
            return $http({
                method:'get',
                url:SYS.url+'subject/'+id+'/offices'
            }).then(function(data){
                return data;
            });
        }

        //系统crf导航数据
        this.ajaxProjectList = function(){
            return $http({
                method:'get',
                url:SYS.url+'load/projects/disease'
            }).then(function(data){
                return data;
            });
        }

        //计算百分比
        this.percentage = function(molecular,Denominator){
            if(molecular == 0 || Denominator == 0){
                return 0;
            }
            var num = (molecular/Denominator)*100;
            var data = Math.round(num*100)/100;
            return data
        }

        //修改第一步
        this.ajaxInputData = function(id){
            return $http({
                method:'get',
                url:SYS.url+'subject/crud/'+id,
                params:{'subjectId':id}
            }).then(function(data){
                return data;
            });
        }

        //删除按钮
        this.ajaxInviteDelete = function(subjectId,attendUsers){
            return $http({
                method:'post',
                url:SYS.url+'subject/attend/'+subjectId+'/delete',
                data: attendUsers
            }).then(function(data){
                return data;
            });
        }

        //增加参与者
        this.ajaxInviteAdd = function(subjectId,attendUsers){
            return $http({
                method:'post',
                url:SYS.url+'subject/attend/'+subjectId+'/save',
                data: attendUsers
            }).then(function(data){
                return data;
            });
        }

        //课题概况中的全部数据
        this.ajaxOverviewData = function(id){
            return $http({
                method:'get',
                url:SYS.url+'subject/crud/'+id
            }).then(function(data){
                return data;
            });
        }

        //任务分配
        this.ajaxSetDist= function(id){
            return $http({
                method:'get',
                url:SYS.url+'subject/attend/'+id+'/office'
            }).then(function(data){
                return data;
            });
        }

        //第三步保存
        this.setSave = function(subjectId,subjectGroups){
            //url没发现在哪里
            return $http({
                method:'post',
                url:SYS.url+'subject/group/'+subjectId+'/update',
                data:subjectGroups
            }).then(function(data){
                return data;
            });
        }

        //第三部CRF模板列表请求的数据
        this.ajaxSetCrfList = function(filter_pageNo,filter_pageSize,type,sourceType,searchWord,projectName){
            if(!filter_pageNo){
                filter_pageNo = 1;
            }
            return $http({
                method:'get',
                url:SYS.url+'subject/profile/page',
                params:{
                    'filter_pageNo':filter_pageNo,
                    'filter_pageSize':filter_pageSize,
                    'type':type,
                    'sourceType':sourceType,
                    'searchWord':searchWord,
                    'projectName':projectName
                }
            }).then(function(data){
                return data;
            });
        }
        this.ajaxSetCrfColumn = function(type,sourceType,profileName){
            return $http.get('data/set.columns.json').then(function(data){
                return data.data;
            });
        }
        this.ajaxSetCrfColumns = function(type,sourceType,profileName){
            return $http.get('data/set.sys.columns.json').then(function(data){
                return data.data;
            });
        }

        //第二个下一步
        this.ajaxInviteNext=function(subjectId,attendUsers){
            return $http({
                method:'post',
                url:SYS.url+'subject/attend/'+subjectId+'/update',
                data: attendUsers
            }).then(function(data){
                return data;
            });
        }



        //课题研究中的合作课题
        this.ajaxAttendData = function(filter_pageNo,filter_pageSize){
            return $http({
                method:'get',
                url:SYS.url+'subject/attend/page',
                params:{
                    'filter_pageNo':filter_pageNo,
                    'filter_pageSize':filter_pageSize
                }
            }).then(function(data){
                return data;
            });
        }

        //课题研究中的我的课题
        this.ajaxCreateData = function(filter_pageNo,filter_pageSize){
            return $http({
                method:'get',
                url:SYS.url+'subject/create/page',
                params:{
                    'filter_pageNo':filter_pageNo,
                    'filter_pageSize':filter_pageSize
                }
            }).then(function(data){
                return data;
            });
        }

        //新建课题的第一步的下一步
        this.ajaxTopicsNext = function(medicalSubject){
            return $http({
                method:'post',
                url:SYS.url+'subject/object',
                data: medicalSubject,
            }).then(function(data){
                return data;
            });
        }

        //修改下一步
        this.ajaxTopicsModifyNext = function(medicalSubject){
            return $http({
                method:'post',
                url:SYS.url+'subject/update',
                data: medicalSubject
            }).then(function(data){
                return data;
            });
        }

        //课题成员邀请中的列表
        this.ajaxList = function(filter,subjectId){
            if(!filter){
                filter = 1;
            }
            return $http({
                method:'get',
                url:SYS.url+'subject/attend/'+subjectId+'/users',
                params:{
                    'filter_pageNo':filter,
                    'subjectId':subjectId
                }
            }).then(function(data){
                return data;
            });
        }

        //课题成员邀请中的新增邀请按钮
        this.ajaxInvitation = function(filter,dataKey,dataUse,id){
            if(!filter){
                filter = 1;
            }
            return $http({
                method:'get',
                url:SYS.url+'subject/attend/'+id+'/list',
                params:{
                    'filter_pageNo':filter,
                    'filter_pageSize':10,
                    'searchWord':dataKey
                }
            }).then(function(data){
                return data;
            });
        }

        //当前时间
        this.newTime = function(time){
            var date = null;
            if(time){
                date = new Date(time);
            }else {
                date = new Date();
            }
            // var date = new Date(time);
            var seperator1 = "-";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
            return currentdate
        }


        this.ajaxColumns = function(name){
            return $http.get('data/'+name+'.column.json').then(function(data){
                return data.data;
            });
        }

        this.ajaxInvitationList = function(){
            return $http.get('data/list.columns.json').then(function(data){
                return data.data;
            });
        }

        //excel
        this.ajaxSetList = function(filter){
            return $http.get('data/1.json').then(function(data){
                return data.data;
            });
        }

    }]);