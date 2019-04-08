angular.module('infi-basic').
	service('DiseasePlanListServices'
	,['$http','SYS',function($http,SYS){
	
	this.getAdviceData = function(pageNo, pageSize,$routeParams){
		return $http({
	        'url':SYS.url+$routeParams.type+'/advice/doctorAdvice?'+'filter_pageNo='+pageNo+'&filter_pageSize='+pageSize
	        +'&filter_patiId='+$routeParams.pati_id+'&filter_patiVisitId='+$routeParams.pati_visit_id
            +'&class_id='+$routeParams.class_id,
	        //'url':'../diseases-plan-src/data/doctorAdvice.json',
	        'method':'get'
	    }).then(function success(msg){
	    	msg.data.page!==null?msg.data.page.number++:undefined;
	        return msg.data;
	    });
	}

	this.prosess = function (plan,schemeOpt) {

        //去下重
        plan.relative_contraindication = contraindication(plan.relative_contraindication);
        plan.absolute_contraindication = contraindication(plan.absolute_contraindication);

        //由于数据以及层级关系，需要在数据这边拼接出title
        changeRecomScheme(plan.recom_scheme);
        changeContraindication(plan.relative_contraindication);
        changeContraindication(plan.absolute_contraindication);

        //后面这仨方法应提到factory中
		function changeRecomScheme(arr) {
            arr.forEach(function (n,i) {
                !n['title']?n['title'] = JSON.parse(JSON.stringify(schemeOpt)):undefined;
                n.title.forEach(function (nx,ix) {
                    typeof n.frequency == "number" ?  n.frequency+='' : '';
                    nx.label == '相似病例' && n.frequency?nx['recom_name'] =  n.frequency:undefined;
                    n.scheme.forEach(function (ny,iy) {
                        if(ny.type == nx.label && !nx['recom_name']){
                            nx['recom_name'] = ny.recom_name;
                        }else if(ny.type == nx.label && nx['recom_name']){
                            nx['recom_name'] += '，'+ny.recom_name
                        }

                        if(ny.type == nx.label && !nx['drug_names']&& ny.drug_names && ny.drug_names.label && ny.drug_names.label !=='' && ny.drug_names.label!==null){
                            nx['drug_names'] = '【'+ny.drug_names.label;
                        }else if(ny.type == nx.label && nx['drug_names']&& ny.drug_names && ny.drug_names.label && ny.drug_names.label !=='' && ny.drug_names.label!==null){
                            nx['drug_names'] += '，'+ny.drug_names.label
                        }

                        if(iy+1 == n.scheme.length && nx['drug_names']){
                            nx['drug_names'] += '】'
                        }
                    })
                });
            });
        }

        //这两个方法虽然有相似之处，可以继续抽但是感觉有点吹毛求疵了，实质上差别还是蛮大的
        function changeContraindication(arr) {
            arr.forEach(function (n,i) {
                !n['title']?n['title'] = JSON.parse(JSON.stringify(schemeOpt)):undefined;
                n.title.forEach(function (nx,ix) {
                    nx.label == '相似病例' && n.frequency?nx['drug_name'] =  n.frequency:undefined;

					if(n.type == nx.label && !nx['drug_name']){
						nx['drug_name'] = n.drug_name;
					}else if(n.type == nx.label && nx['drug_name']){
						nx['drug_name'] += '，'+n.drug_name
					}

					if(n.type == nx.label && !nx['drug_names']&& n.drug_names.label && n.drug_names.label !=='' && n.drug_names.label!==null){
						nx['drug_names'] = '【'+n.drug_names.label;
					}else if(n.type == nx.label && nx['drug_names']&& n.drug_names.label && n.drug_names.label !=='' && n.drug_names.label!==null){
						nx['drug_names'] += '，'+n.drug_names.label
					}

                    if(i+1 == arr.length && nx['drug_names']){
                        nx['drug_names'] += '】'
                    }

                });
            });
        }


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
    }

}]); 