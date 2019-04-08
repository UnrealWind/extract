/**
 * 
 */
angular.module("infi-basic").service('TreeService',['$http','Event',function($http,Event){

	/**
	 * 获取带下标的父节点名称
	 * 这边需要区分是否虚拟菜单
	 */
	function getIndexedParentName(node,nameHolder){
		var index = nameHolder.depth -1;
		if( isVirtualCategory(node) ){
			index = index -1;
		}
		var indexedParentName = nameHolder.getIndexedName(0,index);
		return indexedParentName;
	}
	
	function isVirtualCategory(node){
		return node && node.type && node.type == '虚拟菜单';
	}
	
	/**
	 * 获取节点应该添加的位置,下标
	 * @param parent
	 * @param child
	 * @return
	 */
	function getPreNodeIndex(parent,child,nameHolder){
		var children = parent.children;
		var index = 0;
		var indexedPreviewNodeName;
		if( children && children instanceof Array ){
			indexedPreviewNodeName = nameHolder.indexedName;
			index = doGetPreviewNodeIndex(children,child.name,true);
			
			if( index == -1){
				indexedPreviewNodeName = getPreviewNodeName(child,nameHolder);
				index = doGetPreviewNodeIndex(children,indexedPreviewNodeName,true);
			}
		}
		index = index==-1?0:index;
		return index;
	}
	
	function doGetPreviewNodeIndex(array,name,earse){
		var index = -1;
		var length = array.length -1;
		var node;
		var targetName;
		var currentName;
		for( var idx=length;idx>=0;idx--){
			node = array[idx];
			targetName = earse && name.indexOf('[')>=0?name.substring(0,name.lastIndexOf('[')):name;
			currentName = earse && node.name.indexOf('[')>=0?node.name.substring(0,node.name.lastIndexOf('[')):node.name;
			if( targetName == currentName ){
				index = idx;
				return index;
			}
		}
		return index;
	}
	
	function getPreviewNodeName(child,nameHolder){
		if( isVirtualCategory(child) ){
			var index = nameHolder.depth -1;
			var indexedName = nameHolder.getIndexedName(0,index);
			return indexedName;
		}
	}
	
	function getNewNodeName(array,nameHolder){
		var index = getNodeIndex(array,nameHolder);
		var indexedCanonicalName = nameHolder.indexedCanonicalName;
		if( index != 0 ){
			indexedCanonicalName += '['+index+']';
		}
		return indexedCanonicalName;
	}
	
	function getNodeIndex(array,nameHolder){
		var indexedCanonicalName = nameHolder.indexedCanonicalName;
		var tempNameHolder ;
		var index;
		if( array && array instanceof Array ){
			for( var idx=array.length-1;idx>=0;idx--){
				if( array[idx].name.indexOf( indexedCanonicalName )>=0 ){
					tempNameHolder = getNameHolder(array[idx].name);
					// 获取的是新节点的index,所以需要加1
					index = (!index||index<+tempNameHolder.getLastIndex())?+tempNameHolder.getLastIndex():index;
				}
			}
		}
		// 如果index为0,则判断为false,不会加1
		index = index!=undefined?+index+1:0;
		return index;
	}
	/**
	 * 单选，级联时添加节点
	 */
	this.addVirtualCategoryNodes = function(tree,category,canonicalName,targetName){
		var newName = canonicalName;
		var oldName = category.name;
		var newNode = clone(category);
		updateName(newNode,oldName,newName);
		
		addNode2(tree,newNode);
	};
	
	this.removeVirtualCategoryNodes = function(scope,tree,vcanonicalName){
		for( var idx in scope.formIndex){
			if( idx.indexOf(vcanonicalName) >= 0){
				scope.formIndex[idx] = undefined;
			}
		}
		deleteNode(tree,vcanonicalName,true);
	};
	
	this.setValueToTree = function (targetTree,standardTree,valueNode){
		copyValue(targetTree,standardTree,valueNode);
	};
	
	/**
	 * 添加模块
	 * 因为模块时第一级,所以这边需要特殊处理,没有使用addNode api
	 */
	this.addModule = function(scope,targetTree,standardTree,module){
		var standardName =  getNameHolder(module.name);
		
		module = getNode(standardTree,standardName.name,false);
		var newNode = clone(module);
		var previewNodeIndex = 0;
		var parentIndex=0;
		for( var idx=targetTree.length-1;idx>=0;idx-- ){
			var node = targetTree[idx];
			if( node.name.indexOf(standardName.indexedCanonicalName)>=0 ){
				previewNodeIndex = idx;
				break;
			}
		}
		if( previewNodeIndex!=undefined ){
			parentIndex = +previewNodeIndex +1;
		}
		var newNodeName = getNewNodeName(targetTree,standardName);
		updateName(newNode,standardName.name,newNodeName);
		targetTree.splice(parentIndex,0,newNode);
		
		console.log(newNodeName);
		console.log(newNode);
	};
	
	
	this.addCategory = function(scope,targetTree,standardTree,node){
		var nameHolder = getNameHolder(node.name);
		var newNode = getNode(standardTree,nameHolder.name,true);
		
		addNode2(targetTree,newNode);
	};
	
	function addNode2(targetTree,newNode){
		newNode = clone(newNode);
		var nameHolder = getNameHolder(newNode.name);
		
		var indexedParentName = getIndexedParentName(newNode,nameHolder);
		var parent = getNode(targetTree,indexedParentName , false);
		var parentIndex = getPreNodeIndex(parent,newNode,nameHolder);
		parentIndex += 1;
		
		var newNodeName = getNewNodeName(parent.children,nameHolder);
		updateName(newNode,nameHolder.name,newNodeName);
		parent.children.splice(parentIndex,0,newNode);
		console.log(newNodeName);
		console.log(newNode);
	}
	this.removeAllVirtualCategories = function(tree){
		remove(tree);
		
		function remove(array,type){
			if( array && array instanceof Array ){
				for( var idx=0;idx<array.length;idx++){
					if( array[idx] && array[idx].type && array[idx].type == '虚拟菜单' && type!= '菜单'){
						array.splice(idx,1,null);
					}
					if( array[idx] && array[idx].children ){
						remove(array[idx].children,array[idx].type);
					}
				}
			}
		}
	}
	
	this.getCanonicalName = function(name){
		return getNameHolder(name);
	}
	
	this.getNode = function(array,name,checkVC){
		return getNode(array,name,checkVC);
	}
	
	this.cloneNode = function(object){
		return clone(object);
	}
	
	this.updateName = function(node,oldName,newName){
		return updateName(node,oldName,newName);
	}
	
	var NAME_SPLITTER = '_a_';
	function getNode(array,name,checkVC){
		var length = array.length;
		if( array instanceof Array && length > 0){
			for(var idx=0;idx<length;idx++){
				var node = array[idx];
				// checkVC 为true时,才查找虚拟菜单下的节点
				if( node   ){ //&& ( checkVC ||  node.type!='虚拟菜单') 
					if( node.name == name){
						//console.log(node);
						return node;
					}
					var childNode = getNode(node.children,name,checkVC);
					if( childNode ){
						//console.log(childNode);
						return childNode;
					}
				}
			}
		}
	};
	
	/**
	* 去除下标获取原始name,一并返回每一级的下标
	*/
	function getNameHolder(name){
		if( !name ) return false;
		var splitedNames = name.split(NAME_SPLITTER);
		var result = {name: '',names: [],indexes: [],depth: 0};
		for( var idx=0;idx<splitedNames.length;idx++ ){
			var levelName = splitedNames[idx];
			var originalName = levelName;
			var index = 0;
			if( levelName.indexOf('[') >0 ){
				originalName = levelName.substring(0,levelName.indexOf('['));
				index = levelName.substring(levelName.indexOf('[')+1,levelName.indexOf(']'));
			}
			
			result.names.push(originalName);
			result.indexes.push({label: originalName,value: index});
		}
		result.name = result.names.join(NAME_SPLITTER);
		
		var indexedName = [];
		for( var idy=0;idy<result.indexes.length;idy++){
			var entity = result.indexes[idy];
			var entityToString = entity.label;
			if( idy<result.indexes.length-1 && entity.value!=0){
				entityToString += '[' + entity.value + ']';
			}
			indexedName.push(entityToString);
		}
		
		result.indexedName = indexedName.join(NAME_SPLITTER);
		result.depth = result.names.length;
		
		result.getIndexedName = function(start,end){
			return indexedName.slice(start,end).join(NAME_SPLITTER);
		}
		result.getLastIndex = function(){
			return result.indexes[result.indexes.length-1].value;
		}
		
		// Day0_a_临床表现[2]_a_中枢性低通气 -> Day0_a_临床表现[2]_a_中枢性低通气[3] - >Day0_a_临床表现[2]_a_中枢性低通气 -> Day0_a_临床表现[2]_a_中枢性低通气
		var indexedCanonicalName = result.indexedName;
		if( indexedCanonicalName.charAt(indexedCanonicalName.length-1)==']'){
			indexedCanonicalName = indexedCanonicalName.substring(0,indexedCanonicalName.lastIndexOf('['));
		}
		result.indexedCanonicalName = indexedCanonicalName;
		return result;
	}
	
	function deleteNode(array,name,isStartWidth){
		var length = array.length;
		if( array instanceof Array && length > 0){
			var nodes = [];
			for(var idx=length-1;idx>=0;idx--){
				var node = array[idx];
				//　虚拟菜单下的不删除
				if( node  ){ //改为返回数组
					if( node.name == name || (isStartWidth && node.name.indexOf(name)>=0)){
						node.index = idx;
						nodes.push(node);
					}
					var childNodes = deleteNode(node.children,name,isStartWidth);
					if( childNodes && childNodes.length>0 ){
						for( var idy=0;idy<childNodes.length;idy++){
							var childNode = childNodes[idy];
							var children = node.children;
							node.children = children.slice(0,childNode.index).concat(children.slice(childNode.index+1,children.length));
							// zjl_debug 用splice删除时,数组里会出现null,这样angular会报错,临时解决下
//							node.children.splice(childNode.index,1,null);
						}
					}
				}
			}
			return nodes;
		}
	}
	
	function addNode(array,newNode,targetName){
		console.log(targetName);
		var length = array.length;
		if( array instanceof Array && length > 0){
			for(var idx=0;idx<length;idx++){
				var node = array[idx];
				if( node ){
					if( node.name == targetName){
						node.index = idx;
						return node;
					}
					var childNode = addNode(node.children,newNode,targetName);
					if( childNode ){
					//	if( node.type == '菜单' ){
							// zjl_debug 这边有问题
						console.log(childNode.index);
						console.log(node);
							node.children.splice(childNode.index+1,0,newNode);
							return false;
					//	} 
					//	return childNode;
					}
				}
			}
		}
	}
	
	function clone(o){
	    var k, ret= o, b;
	    if(o && ((b = (o instanceof Array)) || o instanceof Object)) {
	        ret = b ? [] : {};
	        for(k in o){
	            if(o.hasOwnProperty(k) && k!='$$hashKey'){ 
	                ret[k] = clone(o[k]);
	            }
	        }
	    }
	    return ret;
	}
	
	function convertValue(standardTree,valueNode){
		var detail = getNameHolder(valueNode.name);
		var formNode = getNode(standardTree,detail.name,true);
		if(!formNode || !valueNode.value){
			return false;
		}
		
		if( ( formNode.type == '多选+扩充输入' || formNode.type == '多选'  ) ){
			var values = valueNode.value.split(',');
			valueNode.value = {};
			for( var idx=0;idx<values.length;idx++ ){
				valueNode.value[values[idx]] = true;
			}
		}
		if( formNode.type.indexOf('-多张')>0 || formNode.type.indexOf('-多个')>0 ){
			// zjl_debug 请求file info
			var values = valueNode.value.split(',');
			valueNode.value = values;
			console.log(valueNode);
		}
	}
	
	function constructName(array,index){
		var result = [];
		for(var idx=0;idx<array.length&&idx<=index;idx++){
			if( array[idx].value && array[idx].value>0){
				result.push(array[idx].label +'['+array[idx].value+']');
			} else {
				result.push(array[idx].label);
			}
		}
		return result.join(NAME_SPLITTER);
	}
	
	function updateName(node,oldName,newName){
		node.name = newName;
		
		update(node.children);
		function update(array){
			var length = array.length;
			if( array instanceof Array && length > 0){
				for(var idx=0;idx<length;idx++){
					var node = array[idx];
					if( node ){
						node.name = node.name.replace(oldName,newName);
						update(node.children,oldName,newName);
					}
				}
			}
		}
	}
	
}]);