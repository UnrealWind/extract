angular.module('infi-basic').service("ViewMapping",['$http','SYS',function ($http,SYS){
    //任务列表等页面的转化
    /**
     * 任务列表显示转化
     * @param data
     * @returns {*}
     */
    function contentMapping(data) {
        var contentData = data;
        var content=[];
        angular.forEach(data.page.content,function (page) {
            content.push({
                id:page.id,
                groupId:page.group.id,
                taskName:page.taskName,
                createUser:page.createUser,
                resource:SYS.GROUP_SOURE_TYPE[page.group.soureType],
                caseNumber:page.group?page.group.recordNumber:"",
                createTime:page.createTime,
                taskStatus:page.taskStatus,
                taskStatusLabel:SYS.TASK_STATUS[page.taskStatus]
            })
        });
        contentData.page.content = angular.copy(content);
        return contentData;
    }

    /**
     * 筛选条件在查看详情时的显示转化
     */
    function getScreeniCondition(list) {
        var screenData = [];
        angular.forEach(list,function (entity) {
            var screen = {
                label:entity.tagName,
                value:""
            }
            screen.value += getOptionsCondition(entity);
            screenData.push(screen)
        });

        return screenData;
    }

    /**
     * 导出属性在查看详情时的显示转化
     * @param list  导出属性json
     * @returns {string}
     */
    function getExtractCondition(list) {
        var extractData = [];
        angular.forEach(list,function (entity) {
            var extract = {
                label:entity.label,
                value:""
            }
            extract.value += getContextCondition(entity);
            extract.value += getOptionsCondition(entity);
            extract.value += getRelationCondition(entity);
            
            extractData.push(extract)
        });
        return extractData;
    }

    /**
     * 查看详情筛选条件和导出属性的options的转化
     * @param entity  options数据
     * @param relation  标识是否是前置条件中的options
     * @returns {string}
     */
    function getOptionsCondition(entity,relation){
        var extract = "";
        if((entity.options && entity.options.length > 0) || (entity.values && entity.values.length > 0)){
            //关联属性中的options加上提示字段
            if(relation){
                extract += "（属性值："
            }
            var options = entity.options?entity.options:entity.values;
            angular.forEach(options,function (original,index) {
                var tag = original.label;
                tag+=getContextCondition(original);
                extract+=tag;
                if(index < options.length-1){
                    extract += ",";
                }
            });
            if(relation){
                extract += "）"
            }
        }
        return extract;
    }

    /**
     * 查看详情筛选条件和导出属性的关联属性的转化
     * @param entity
     * @param relation
     * @returns {string}
     */
    function getRelationCondition(entity,relation) {
        var extract = "";
        if(entity.relation && entity.relation.length > 0){
            //区别是第一层级的关联属性还是关联属性中的关联属性
            if(relation){
                extract += "(关联属性：";
            }else{
                extract += "[关联属性：";
            }

            angular.forEach(entity.relation,function (original,index) {
                var tag = original.label;
                //关联属性包含关联属性和options
                tag+=getOptionsCondition(original,"relation");
                tag+=getRelationCondition(original,"relation");
                extract+=tag;
                if(index < entity.relation.length-1){
                    extract += ",";
                }
            });
            if(relation){
                extract += ")";
            }else{
                extract += "]";
            }
        }
        return extract;
    }

    /**
     * 查看详情筛选条件和导出属性的前置条件的转化
     * @param original
     * @returns {string}
     */
    function getContextCondition(original) {
        var tag = "";
        if((original.context && original.context.length > 0) || (original.contextRange && original.contextRange.length > 0)){
            tag += "";
            if(original.context){
                tag+=setContext(original.context);
            }
            if(original.contextRange) {
                angular.forEach(original.contextRange, function (range, idy) {
                    var isHave = false;
                    if(original.valueType == "term"){
                        if(range.text!=""){
                            tag += "(";
                            tag += range.text;
                            isHave = true;
                        }
                    }else if(original.valueType == "numberic"){
                        if(range.min!=""||range.max!=""){
                            tag += "(";
                            tag += range.min + "~" + range.max;
                            isHave = true;
                        }
                    }
                    if(range.context&&range.context.length>0){
                        tag += setContext(range.context);
                    }
                    tag += isHave?")":"";
                    tag += (idy == original.contextRange.length - 1) ? "" : "、";
                })
            }
            original.label = original.label + tag;
        }

        /**
         * 前置条件的title拼写
         * @param context
         * @param tag
         * @returns {*}
         */
        function setContext(context){
            var contextData = "[前置条件：";
            angular.forEach(context,function (tag,idx) {
                contextData += tag.eventType.label +"_";
                contextData += !tag.eventPosition?"":"_"+tag.eventPosition.label;
                contextData += !tag.eventNames?"":"_"+tag.eventNames.label;
                contextData += !tag.relationship?"":"_"+tag.relationship.label;
                contextData += !tag.customAttributes?"":"_"+tag.customAttributes.label;
                contextData += !tag.attributePosition?"":"_"+tag.attributePosition.label;
                contextData += (idx == context.length-1)?"":"、";
            });
            contextData +="]";
            return contextData;
        }
        return tag;
    }

    return {
        contentMapping:contentMapping,
        getScreeniCondition:getScreeniCondition,
        getExtractCondition:getExtractCondition
    }
}])
