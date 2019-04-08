angular.module('infi-basic').
	service('DiseasePlanDetailServices'
	,['$http','SYS',function($http,SYS){
	
	this.getData = function(opt){
		return $http({
            url: opt.url,
            data:opt.data,
            method: opt.method
        }).then(function success(msg){
        	return msg.data;
        });
	}

	this.getLeftTab = function(diseaseParam,$routeParams){
		return $http({
	        'data':diseaseParam,
	        'url':SYS.url+$routeParams.type+'/recommendation?id='+$routeParams.recordId+'&class_id='+$routeParams.class_id,
	        'method':'get'
	    }).then(function success(msg){

            //去下重
            msg.data.data.relative_contraindication = contraindication(msg.data.data.relative_contraindication);
            msg.data.data.absolute_contraindication = contraindication(msg.data.data.absolute_contraindication);
            function contraindication(arr) {
                var map = {}
                arr.forEach(function (n,i) {
                    map[n.uuid] = n;
                })
                arr = [];
                for(var i in map){
                    arr.push(map[i]);
                }
                return arr;
            }

            var discribe = '推荐理由';
            msg.data.data.recom_scheme.forEach(function(n,i){
                n.uuid ==$routeParams.planId ? n.status="active":n.status='';
                n.color = 'green';
                n.recom_name = '';
                n.drug_names='';
                n.scheme.forEach(function (nx,ix) {
                    n.recom_name ==''?n.recom_name = nx.recom_name:n.recom_name += '，'+nx.recom_name;

                    if(n.drug_names =='' && n.drug_names&& nx.drug_names.label){
                        n.drug_names = '【'+nx.drug_names.label
                    }else if(n.drug_names !==''&& n.drug_names && nx.drug_names.label){
                        n.drug_names +='，'+nx.drug_names.label
                    }

                    if(ix+1 == n.scheme.length && n['drug_names']){
                        n['drug_names'] += '】'
                    }
                })
            })

        	msg.data.data.absolute_contraindication.forEach(function(n,i){
        		n.uuid ==$routeParams.planId ? n.status="active":n.status='';
                n.uuid ==$routeParams.planId ? discribe="相对禁忌理由":undefined;
        	});

            msg.data.data.relative_contraindication.forEach(function(n,i){
                n.uuid ==$routeParams.planId ? n.status="active":n.status='';
                n.uuid ==$routeParams.planId ? discribe="绝对禁忌理由":undefined;
            });

            return {
                data:msg.data,
                discribe:discribe
            };
        });
	}

	this.getPlanBasis = function(recordId,planId,defaultData,$routeParams){
		return $http({
            url:SYS.url+$routeParams.type+'/recommendation/reason?id='+recordId+'&uuid='+planId+'&class_id='+$routeParams.class_id,
            method: 'get'
        }).then(function success(msg){
            return msg.data;
        });
	}

    this.getBasicInfo = function(recordId,planId,defaultData,$routeParams){
        return $http({
            url:SYS.url+$routeParams.type+'/recommendation/arg?id='+recordId+'&uuid='+planId+'&class_id='+$routeParams.class_id,
            method: 'get'
        }).then(function success(msg){

            //肺炎和慢阻肺返回的数据结构不一样，处理成慢阻肺的格式

            if($routeParams.type == 'pneumonia'){
                var temp = {data:{}};
                for(var key in msg.data){
                    msg.data[key].forEach(function (n,i) {
                        temp.data[n.item_name] = n.value;
                    })
                }
                msg = angular.copy(temp);
                defaultData.forEach(function(n,i){
                    n.noVal = true;
                    n.data.forEach(function(ny,iy){
                        ny.value = msg.data[ny.label];
                        if(ny.value!=0 &&  ny.dimension || ny.type =="单选"){
                            ny.dimension.options.forEach(function(nz,iz){
                                nz.value == ny.value? ny.showValue = nz.label:undefined;
                            });
                        }
                        ny.value !=0?n.noVal =false:undefined;
                    });
                });
            }else{
                defaultData.forEach(function(n,i){
                    n.noVal = true;
                    n.data.forEach(function(ny,iy){
                        ny.value = msg.data[ny.name];
                        if(ny.value!=0 &&  ny.dimension || ny.type =="单选"){
                            ny.dimension.options.forEach(function(nz,iz){
                                nz.value == ny.value? ny.showValue = nz.label:undefined;
                            });
                        }
                        ny.value !=0?n.noVal =false:undefined;
                    });
                });
            }

            return msg.data;
        });
    }

	this.changeLeftTab = function(plan,opt){
		plan.recom_scheme.forEach(function(n,i){
			n.status = '';
		})

		plan.absolute_contraindication.forEach(function(n,i){
			n.status = '';
		})

        plan.relative_contraindication.forEach(function(n,i){
            n.status = '';
        })

		opt.status = 'active';
	}

	this.getStandardSource = function(recordId,$routeParams){
		return $http({
            url:SYS.url+$routeParams.type+'/guide?id='+$routeParams.recordId+'&uuid='+recordId,
            method: 'get'
        }).then(function success(msg){
            return msg.data;
        });
	}

	this.getPlanLiterature = function(recordId,$routeParams){
		return $http({
            url:SYS.url+$routeParams.type+'/scheme/literature?id='+$routeParams.recordId+'&uuid='+recordId,
            method: 'get'
        }).then(function success(msg){
            return msg.data;
        });
	}

	this.getDrugLiterature = function(recordId,$routeParams){
		return $http({
            url:SYS.url+$routeParams.type+'/drug/literature?id='+$routeParams.recordId+'&uuid='+recordId,
            method: 'get'
        }).then(function success(msg){
            return msg.data;
        });
    }

    this.getTypicalRecord = function(recordId,$routeParams){
        return $http({
            url:SYS.url+$routeParams.type+'/typical/cases?id='+$routeParams.recordId+'&uuid='+recordId,
            method: 'get'
        }).then(function success(msg){
            return msg.data;
        });
    }

    this.getDrugIntroduce = function(recordId,$routeParams){
		return $http({
            url:SYS.url+$routeParams.type+'/recommendation/introduce?uuid='+recordId+'&id='+$routeParams.recordId,
            method: 'get'
        }).then(function success(msg){

            if(msg.data.data !== null){
                msg.data.data.forEach(function (n,i) {
                    for(var ii in n){
                        if(typeof n[ii] == 'string'){
                            n[ii].indexOf('&&')>-1?n[ii] = n[ii].split('&&'):n[ii] = [n[ii]];
                        }
                    }
                });
            }
            return msg.data;
        });
    }

    this.getDangerInfo = function(id,$routeParams){
        return $http({
            url:SYS.url+$routeParams.type+'/danger/factor?id='+$routeParams.recordId,
            method: 'get'
        }).then(function success(msg){
            return msg.data;
        });
    }

    //降压目标
    this.getHyperAim = function(id,$routeParams){
        return $http({
            url:SYS.url+$routeParams.type+'/voltage?id='+id+'&class_id='+$routeParams.class_id,
            method: 'get'
        }).then(function success(msg){
            return msg.data;
        });
    }
}]);