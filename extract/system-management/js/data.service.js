angular.module('infi-basic')
    .service('DataService',['$http','SYS',function($http,SYS){
        //获取左侧菜单
        this.getMenus = function(){
            return $http.get(SYS.url +'menu/platfrom/tree').then(function(msg){
                return msg.data;
            });
        }
        //获取列表表头
        this.getColumn = function(column){
            return $http.get(SYS.infiUrl + column+'.column.json').then(function(msg){
                return msg.data;
            });
        }
        
        //获取分页列表数据
        this.getPage = function(pageNum,pageSize,type){
            return $http.get(SYS.url+type+'/page?filter_pageNo='+pageNum+'&filter_pageSize='+pageSize).then(function(msg){
                if(msg.data.page){
                    ++msg.data.page.number;
                }
                return msg.data;
            });
        }

        //获取无分页列表数据
        this.getList = function(type,filter){
            var listUrl = filter ? type+'/list'+filter : type+'/list';
            return $http.get(SYS.url+listUrl).then(function(data){
                return data.data;
            });
        }
        
        //保存新建的信息
        this.saveCreatedData = function (data,type) {
            var data = JSON.stringify(data);
            return $http.post(SYS.url +type+"/save",data).then(function(msg){
                return msg.data;
            });
        }

        //保存修改的信息
        // this.saveChangedData = function (data,type) {
        //     var datas = JSON.stringify(data);
        //     return $http.post(SYS.url +type+"/update/"+data.id,datas).then(function(msg){
        //         return msg.data;
        //     });
        // }

        //通过id查询某个信息
        this.getDetail = function (id,type) {
            return $http.get(SYS.url + type+"/one?id=" + id).then(function(msg){
                return msg.data;
            });
        }

        //删除某个信息
        this.deleteDetail = function (id,type) {
            return $http.delete(SYS.url +type+"/"+id).then(function(msg){
                return msg.data;
            });
        }
        
        //删除前做教研
        this.deleteValit = function (id,type) {
            return $http.get(SYS.url +type+"/delete/valit/"+id).then(function(msg){
                return msg.data;
            });
        }
// ==============================以上是增删改查公共方法======================================================
        //获取机构里面医院的下拉框列表
        this.getMechanismHospital = function () {
            return $http.get(SYS.url + "office/list").then(function(msg){
                return msg.data;
            });
        }

        //获取机构里面某个医院下科室下拉列表
        this.getMechanismDepartment = function (id) {
            return $http.get(SYS.url + "office/sect?hospitalId=" + id).then(function(msg){
                return msg.data;
            });
        }
// =============================以上是机构的方法===================================================================
        //新建菜单时获取菜单列表数据
        this.getMenuSource = function(type,parent){
            var url;
            parent?url = SYS.url+type+'/tree?parentId='+parent:url= SYS.url+type+'/tree';
            return $http.get(url).then(function(data){
                return data.data;
            });
        }
// ==========================以上是菜单的方法=============================================================
        //校验角色英文名是否存在
        this.checkRoleName = function (name,companyId) {
            return $http.get(SYS.url + "role/valid?companyId="+companyId+"&enname="+name).then(function(msg){
                return msg.data;
            });
        }
// ==========================以上是角色的方法==============================================================
        //获取科室和病区信息
        this.getUserSect = function (id) {
            return $http.get(SYS.url + "office/children/list?filter_parentId="+id).then(function(msg){
                return msg.data;
            });
        }
        
        //校验用户名是否存在
        this.checkUserName = function (name,companyId,userId) {
            return $http.get(SYS.url + "user/valid?companyId="+companyId+"&loginName="+name+'&userId='+userId).then(function(msg){
                return msg.data;
            });
        }

        //修改密码确认功能
        this.changePwd = function (filter) {
            return $http.get(SYS.url + "user/password/password/update?filter_oldPassword="+filter.oldPwd+"&filter_newPassword="+filter.newPwd).then(function(msg){
                return msg.data;
            });
        }

        //重置密码功能是否可用的校验和重置密码
        this.resetPwd = function (key,loginName) {
            var name = key == 'validate' ? 'filter_loginName=' : 'filter_userName=';
            return $http.get(SYS.url + "user/password/reset/"+key+'?'+name+loginName).then(function(msg){
                return msg.data;
            });
        }
// ==========================以上是用户的方法=============================================================
    }]);