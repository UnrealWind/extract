angular.module('infi-basic').service('RecordService', ['$http', 'SYS', function ($http, SYS) {
    // 所有页面的数据请求的service 文件
    this.ajaxData = function (num) {
        return $http.get(SYS.titleUrl + num+'.json').then(function (data) {
            return data.data;
        });
    };

    this.getResults = function (filter__xlPatientId,filter__xlMedicalId) {
        return $http.get(SYS.url + '/checkup/special'+params).then(function (data) {
            return data.data;
        });
    }

    this.getNumApi = function (filter__xlPatientId,filter__xlMedicalId,api,recordTime) {
        !recordTime?recordTime = '':undefined;
        var params = '?filter__xlPatientId='+filter__xlPatientId
            +'&filter__xlMedicalId=' + filter__xlMedicalId
            +'&filter__recordTime=' +recordTime;
        return $http.get(SYS.url + '/unite/resource/single/'+api+params).then(function (data) {
            return data.data;
        });
    };

    this.getSpecialityCheckDatas = function (filter__xlPatientId,filter__xlMedicalId,recordTime) {
        !recordTime?recordTime = '':undefined;
        var params = '?filter__xlPatientId='+filter__xlPatientId
            +'&filter__xlMedicalId=' + filter__xlMedicalId
            +'&filter__recordTime=' +recordTime;
        return $http.get(SYS.url + '/checkup/special'+params).then(function (data) {
            return data.data;
        });
    };

    this.getNaviData = function (filter__xlPatientId) {
        return $http.get(SYS.url + '/basic/patient/menu?filter__xlPatientId='+filter__xlPatientId)
            .then(function (msg) {
                return msg.data;
        });
    }

    this.getPage = function (page, num, keyWords) {
        var url = SYS.url + 'basic/patient/page?filter__pageNo=' + page + '&filter__pageSize=' + num;
        if (keyWords) {
            if (keyWords.startDate && keyWords.startDate == '') {
                url += '&filter__patiId=' + keyWords.patiId + '&filter__name=' + keyWords.name + '&filter__endDate=' + keyWords.endDate;
            } else if (keyWords.startDate == '' && keyWords.startDate) {
                url += '&filter__patiId=' + keyWords.patiId + '&filter__name=' + keyWords.name + '&filter__startDate=' + keyWords.startDate;
            } else if (keyWords.startDate == '' && keyWords.startDate == '') {
                url += '&filter__patiId=' + keyWords.patiId + '&filter__name=' + keyWords.name;
            } else {
                url += '&filter__patiId=' + keyWords.patiId + '&filter__name=' + keyWords.name + '&filter__startDate=' + keyWords.startDate + '&filter__endDate=' + keyWords.endDate;
            }
        }
        return $http.get(url).then(function success(msg) {
            msg.data.number++;
            return msg.data;
        })
    };

    this.ajaxColumns = function (name) {
        return $http.get(SYS.titleUrl + name + '.columns.json').then(function (data) {
            return data.data;
        });
    };

    this.showChild= function (target,parent){
        var oriTarget = angular.copy(target);
        var idx = null;
        (function resetActive(arr) {
            arr.forEach(function(n,i){
                n.label == target.label?idx = i:undefined;
                n.active = false;
                n.children?resetActive(n.children):undefined;
            })
        })(parent)
        target.active = !oriTarget.active;

        if(target.parent == '手术信息'&& target && target.operationNo!=null && target.children!==null && target.children.length>0){
            $('article').animate({
                scrollTop: $('h2[scrollMark='+target.operationNo+']').offset().top - $('article').offset().top + $('article').scrollTop()-130
            }, 400);
            return false;
        }else if(target.parent == '专科检查'){
            $('article').animate({
                scrollTop: $('h3[scrollMark='+target.label+']').offset().top - $('article').offset().top + $('article').scrollTop()-130
            }, 400);
            return false;
        }

        //不是顶级菜单并且有id说明需要定位
        if(!target.type){
            var mainContainer = $('article');
            var scrollToContainer = $('#template');
            $('.infi-wj-title').each(function (i,n) {
                $(this).text().indexOf(target.label)>-1?scrollToContainer = $(this):undefined;
            });
            mainContainer.animate({
                scrollTop: scrollToContainer.offset().top - mainContainer.offset().top + mainContainer.scrollTop()-130
            }, 400);
        }

        if(target.label == '基本信息'){
            return false;
        }


    }
}]);
