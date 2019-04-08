app.controller('InputController', ['$scope','DataService','InputService','$routeParams','Utils','SYS','Session','PrintService','$filter',function ($scope,DataService,InputService,$routeParams,Utils,SYS,Session,PrintService,$filter) {

  $scope.entity = {};
  $scope.record = {
    recordId:$routeParams.recordId
  };
  //区分是录入界面还是生成页面，默认录入界面
  $scope.generateType = "entering";
  $scope.xbsOption = "";
  //ｚｙｚ＿ｄｅｂｕｇ　　待优化
  $scope.drugOptions = null;

  function init() {
    //设置诊断时间
    var nows = new Date();
    if($scope.entity.name_5021 === undefined || $scope.entity.name_5021==""){
      $scope.entity.name_5021 = nows.getTime();
    }
    if($scope.entity.name_10 === undefined || $scope.entity.name_10==""){
      $scope.entity.name_10 = $filter('date')(new Date(),'yyyy-MM-dd hh:mm');
    }
    if($scope.entity.name_1069 === undefined || $scope.entity.name_1069==""){
      $scope.entity.name_1069 = Session.getUser().name;
    }
    angular.forEach($scope.dimensions,function (dimension,key) {
      if(dimension.label == "药物治疗-药物名称"){
        if($scope.drugOptions==null){
          query(key);
        }else{
          dimension.options = $scope.drugOptions;
        }
      }
    })
  }
  // init();

  /**
   * 预览方法
   * @param type
   */
  $scope.preview = function(type){
    $scope.outputText[type].show = true;

    if(type == 'nature' || type == 'family' || type == 'menstruation' || type == 'Marital' || type == 'bodyExam'){
      $scope.outputText[type].text = "";
      getText(type);
    }
    if(type == 'main'){
      $scope.outputText[type].text = $scope.entity.name_15;
    }
    if(type == 'always'){
      genJws($scope.outputText[type]);
    }
    if(type == 'personal'){
      genGrs($scope.outputText[type]);
    }
    if(type == 'nowDisease'){
      $scope.outputText[type].text = "";
      $scope.genXbsOption();
    }
    if(type == 'test'){
      $scope.genHyjtsjc(type);
    }
  };
  //用于输出
  $scope.outputText = {
    nature:{
      show:false,
      name:"naturalInfo",
      tplStatus:"view",
      text:""
    },
    main:{
      show:false,
      name:"actionInChief",
      tplStatus:"view",
      text:""
    },
    nowDisease:{
      show:false,
      name:"presentIllHistory",
      tplStatus:"view",
      text:""
    },
    always:{
      show:false,
      name:"pastHistory",
      tplStatus:"view",
      text:""
    },
    personal:{
      show:false,
      name:"personalHistory",
      tplStatus:"view",
      text:""
    },
    Marital:{
      show:false,
      name:"obstericalHistory",
      tplStatus:"view",
      text:""
    },
    menstruation:{
      show:false,
      name:"menstrualHistory",
      tplStatus:"view",
      text:""
    },
    family:{
      show:false,
      name:"familyHistory",
      tplStatus:"view",
      text:""
    },
    bodyExam:{
      show:false,
      name:"physicalCheck",
      tplStatus:"view",
      text:""
    },
    specialized:{
      show:false,
      name:"specializedExam",
      data:[],
      tplStatus:"view",
      text:""
    },
    test:{
      show:false,
      tplStatus:"view",
      text:""
    },
    diagnosis:{
      show:false,
      tplStatus:"view",
      text:""
    },
    endTime:{
      show:false,
      tplStatus:"view",
      text:""
    }
  };

  //专科检查主题展开收起
  $scope.specialtyTheme = {
    ear:{
      active:false
    },
    neck:{
      active:false
    },
    skull:{
      active:false
    },
    nose:{
      active:false
    },
    throat:{
      active:false
    },
    swallow:{
      active:false
    }
  };
  /**
   * 生成文本页面和录入页面切换
   * @param type
   */
  $scope.generateTab = function(type){
    if(type != $scope.generateType){
      $scope.generateType = type;
      if(type == 'generate'){
        var now = new Date();
        $scope.entity.name_1070 = now.getTime();
      }
    }
  };

  /**
   * 现病史多选生成的文字，分为伴有和不伴有
   */
  $scope.genXbsOption = function(){
    var entity = $scope.entity.name_16;
    var string1,string2 = "";
    var data = [];
    string1 = "";
    string2 = "";
    //如果没有选择前面四项，就要有一项放在前面做主要症状
    var mianDisease = true;
    //如果听力下降，耳鸣，眩晕，耳漏四项没有被选中，其余项有选中，则第一项作为主要症状，放在“伴有”前面
    //剩下的放在伴有后面
    var string1Arr = [];
    angular.forEach($scope.dimensions.name_16.options,function(option){
      if(entity && entity[option.name] && entity[option.name]==true){
        if(exclude(option)){
          string1 = "";
          string1 += option.label;
          if(option.note && $scope.entity[option.note]){
            string1 += "[" + $scope.entity[option.note] + "]";
          }
          string1 += ",";
          string1Arr.push(string1);
        }else{
          mianDisease = false;
        }
      }else{
        if(!exclude(option)){
          if(entity && entity[option.name] && entity[option.name]==true){}else{
            string2 += option.label;
            string2 += ",";
          }
        }else{
          string2 += option.label;
          string2 += ",";
        }
      }
    });
    if(string1!=""){
      var strings = "";
      if(mianDisease){
        strings += string1Arr[0];
        strings += "伴有:";
        for(var idx=1;idx<string1Arr.length;idx++){
          strings += string1Arr[idx];
        }
        if(strings!=""){
          data.push(strings.substring(0,strings.length-1));
        }
      }else{
        strings = "伴有:";
        for(var idx=0;idx<string1Arr.length;idx++){
          strings += string1Arr[idx];
        }
        if(strings!=""){
          data.push(strings.substring(0,strings.length-1));
        }
      }
    }
    if(string2!=""){
      data.push("不伴有:" + string2.substring(0,string2.length-1));
    }
    $scope.xbsOption = data.join(",");
    getXbsText($scope.xbsOption);
  };

  /**
   * 现病史的伴有和不伴有中不包括听力下降，耳鸣，眩晕，耳漏
   * @param option
   * @returns {boolean}
   */
  function exclude(option){
    var flag = true;
    if(option.label== '听力下降' || option.label=='耳鸣' || option.label=='眩晕' || option.label=='耳漏'){
      flag = false;
    }
    return flag;
  }
  /**
   * 获取左侧json数据
   */
  DataService.getNavList().then(function(msg){
      $scope.tabList = msg;
      $scope.tabList[0].active=true;
      $scope.leftDataType = $scope.tabList[0].value;
  });
  
  /**
   * tab切换
   * @param tab
   */
  $scope.leftTabChoice = function(tab){
      angular.forEach($scope.tabList,function(entity){
          entity.active = false;
      });
      tab.active = true;
      $scope.leftDataType=tab.value;
  };

  //存放自动添加的选项，因为这三个是页面写死的，所以迭代只迭代多出来的选项，其他不需要是因为页面迭代全部
  $scope.optionMore = {
    //症状名称
    name_16:[],
    //既往史
    name_105:[],
    //个人史
    name_136:[]
  };

  /**
   * 保存病历信息
   */
  $scope.saveRecord = function(){
    var status1,status2 = SYS.STATUS_ERROR;
    var msg = {
      status:"",
      description:""
    };
    $scope.record.text = {
      "naturalInfo":$scope.outputText.nature.text,
      "actionInChief":$scope.outputText.main.text,
      "presentIllHistory":$scope.outputText.nowDisease.text,
      "pastHistory":$scope.outputText.always.text,
      "personalHistory":$scope.outputText.personal.text,
      "obstericalHistory":$scope.outputText.Marital.text,
      "menstrualHistory":$scope.outputText.menstruation.text,
      "familyHistory":$scope.outputText.family.text,
      "physicalCheck":$scope.outputText.bodyExam.text,
      "specializedExam":$scope.outputText.specialized.text
    };
    InputService.saveRecord({
      id:$scope.record.recordId,
      record:$scope.entity
    }).then(function(data){
      status1 = data.status;
      InputService.saveRecordText({
        id:$scope.record.recordId,
        text:$scope.record.text
      }).then(function(data){
        status2 = data.status;
        if(status1 == SYS.STATUS_SUCCESS && status2 == SYS.STATUS_SUCCESS){
          msg.status = SYS.STATUS_SUCCESS;
          msg.description = "保存成功";
          if(msg.status == SYS.STATUS_SUCCESS){
            setTimeout(function(){
              window.location.href = '#/list';
            },1500);
          }
        }else {
          msg.status = SYS.STATUS_ERROR;
          msg.description = "保存失败";
        }
        Utils.sysTip($scope,msg);
      });
    });

  };

  /**
   * 获取病历信息
   */
  $scope.getRecord = function(){
    InputService.getRecord({
      id:$scope.record.recordId
    }).then(function(data){
      if(data!=null && data!=""){
        angular.forEach(data,function(value,key){
          //判断新添的多选项添加进dimension中
          if(typeof(value) == 'object'){
            angular.forEach(value,function(value2,key2){
              if(!matchOption(key2,key)){//如果在原来的options中没有，执行以下操作
                var arr = key2.split('_');
                if(key == 'name_1055'){
                  var option = {
                    label:arr[1],
                    name:key2,
                    entityName:key2
                  };
                  $scope.dimensions.options.push(option);
                }else{
                  var option = {
                    label:arr[1],
                    name:key2
                  };
                  $scope.dimensions[key].options.push(option);
                  if($scope.optionMore[key]){//只有既往史，现病史，个人史有，因为一般的可以迭代显示，这三个是固定布局的
                    $scope.optionMore[key].push(option);
                  }
                }

              }
            })
          }
        });
        // $scope.entity = InputService.getMoreOptions(data,$scope.dimensions,$scope.optionMore);
        $scope.entity = data;
        defaultValue();
        init();

      }
    });
    InputService.getTextArea({
      id:$scope.record.recordId
    }).then(function(data){
      //此处判断获取的状态
      if(data.status == SYS.STATUS_SUCCESS){
        angular.forEach($scope.outputText,function(value,key){
          if(value.name){
            value.text = data.data[value.name];
          }
        })
      }
    })
  };
  defaultValue();

  /**
   * 查找dimension中是否有这一多选项
   * @param value
   * @param key
   * @returns {boolean}
     */
  function matchOption(value,key){
    var flag = false;
    if(key == 'name_1055'){
      angular.forEach($scope.dimensions.options,function(option){
        if(option.entityName == value){
          flag = true;
        }
      });
    }else{
      angular.forEach($scope.dimensions[key].options,function(option){
        if(option.name == value){
          flag = true;
        }
      });
    }
    return flag;
  }

  $scope.getRecord();

  /**
   * 默认值初始化（单选和下拉的默认值）
   */
  function defaultValue(){
    DataService.getDefaultValue().then(function success(msg){
      var defaultValue = msg;
      var idx,wrap;
      for (idx=0;idx<defaultValue.length;idx++){
        wrap = defaultValue[idx];
        if($scope.entity[wrap.name] === undefined || $scope.entity[wrap.name]==""){
          $scope.entity[wrap.name] = wrap.value;
        }
      }
    });
  }

  /**
   * 添加-其他 方法
   * @param key         对应的key>>name_key
   * @param entityName  页面上绑定的对象
   * @param options     迭代的对象
   * @param more        输入框绑定的值
   * @param optionMore  存放添加的值
   * @returns {boolean}
     */
  $scope.addEntity = function(key,entityName,options,more,optionMore){
    //去除输入框中前后空格,防止添加空数据的情况
    if(more){
      more  = more.replace(/(^\s*)|(\s*$)/g, "");
    }
    if(more != undefined&&more.length>0){
      if(entityName == undefined){//为什么会有undefined的情况呢，是因为初始页面绑定的entity的值是没有定义的，是通过页面定义+赋值的
        $scope.entity[key] = {};
      }else{
        $scope.entity[key] = entityName;
      }

      var idx,entitys,optionLength = $scope.entity[key].length;
      for(idx = 0 ;idx<optionLength;idx++){
        entitys = options[idx];
        if(more == entitys.label){
          $scope.entity[key][entitys.name] = true;
          $scope.entity[key+'other'] = "";
          if(key == 'name_16'){
            $scope.entity[key+'more'] = "";
          }
          return false;
        }
      }
      if(key == 'name_1055'){
        var mores = {
          label:more,
          name:'value_'+more,
          entityName:'value_'+more
        };
      }else{
        var mores = {
          label:more,
          name:'value_'+more
        };
      }
      //如果key==name_1055，是化验及特殊检查，用的是entityName字段
      if(key == 'name_1055'){
        $scope.entity[mores.entityName] = true;
      }else{
        $scope.entity[key][mores.name] = true;
      }
      $scope.dimensions[key].options.push(mores);
      if($scope.optionMore[key]){
        $scope.optionMore[key].push(mores);
      }
      $scope.entity[key+'other'] = "";//添加完成后当前文本框置空
      if(key == 'name_16'){
        $scope.entity[key+'more'] = "";
      }
    }
  };

  /**
   * 辅助检查多选
   * @param entitys
   * @param keys
     */
  $scope.auxiliaryExam = function(entitys,keys){
    $scope.entity[keys] = "";
    var arr = [];
    angular.forEach($scope.entity.name_79other,function(value,key){
      if(value){
        angular.forEach($scope.dimensions.name_79.options,function(option){
          if(option.name == key){
            arr.push(option.label);
          }
        })
      }
    });
    $scope.entity[keys] = arr.join(',');
  };

  /**
   * 专科检查的输出
   */
  $scope.checkOutput = function(){
    $scope.outputText.specialized.show = true;
    var html = "";
    var arr = [];
    arr = checkOutRadio();
    angular.forEach($scope.dimensions,function(dimension,key){
      if(dimension.first == "专科检查" && dimension.remark == '1级'){
        if(dimension.type = "radio"){
          angular.forEach(dimension.options,function(option){
            if($scope.entity[key] && $scope.entity[key] == option.name){
              var html = "";
              html += option.label;
              html += "。";
              arr.push(html);
            }
          })
        }
      }
      else if(dimension.first == "专科检查" && dimension.remark == '2级'){
        if(dimension.options.length>0 && checkParent(dimension)){
          angular.forEach(dimension.options,function(option){
            var html = "";
            if($scope.entity[key] && $scope.entity[key][option.name] && $scope.entity[key][option.name] == true){
              html += dimension.label;
              html += ":";
              html += angular.copy(option.label);
              html += "，";
              angular.forEach($scope.dimensions,function(dim,key2){
                if(dim.first == "专科检查" &&　dim.parentValue == option.label && dim.parentLabel == dimension.label){
                  if(dim.options.length>0){
                    if(dim.type == "radio"){
                      angular.forEach(dim.options,function(opt){
                        if(opt.name == $scope.entity[key2]){
                          html += dim.label;
                          html += ":";
                          html += angular.copy(opt.label);
                          html += "，";
                        }
                      });
                    }
                    if(dim.type == "checkbox"){
                      angular.forEach(dim.options,function(opt){
                        if($scope.entity[key2] && $scope.entity[key2][opt.name] && $scope.entity[key2][opt.name]==true){
                          html += dim.label;
                          html += ":";
                          html += angular.copy(opt.label);
                          html += "，";
                        }
                      })
                    }
                  }
                  if(dim.type == "text"){
                    if($scope.entity[key2]!="" && $scope.entity[key2]!=null){
                      html += dim.label;
                      html += ":";
                      html += angular.copy($scope.entity[key2]);
                      html += "，";
                    }
                  }
                }
              })
            }
            if(html !="" && html!=null){
              html = html.substring(0,html.length -1);
              html += "。";
              arr.push(html);
            }
          });
        }
        if(dimension.type == "radioIndi"){
          if($scope.entity[key] && $scope.entity[key]!=null && $scope.entity[key]!=""){
            var html = "";
            html += dimension.label;
            html += ":";
            html += $scope.entity[key];
            html += "。";
            arr.push(html);
          }
        }
      }
    });
    $scope.outputText.specialized.data = arr;
    $scope.outputText.specialized.text = "";
    angular.forEach(arr,function(data){
      $scope.outputText.specialized.text += data;
    });
  };

  /**
   *　检查专科检查中选择异常才会弹出交互
   * @param dimension
   */
  function checkParent(dimension){
    var flag = false;
    var parent = $scope.dimensions["name_" + dimension.parentId];
    var parentEntity = $scope.entity["name_" + dimension.parentId];
    var parentValue = dimension.parentValue;
    var checkValue = "";
    angular.forEach(parent.options,function(dim){
      if(dim.name == parentEntity){
        checkValue = dim.label;
        if(checkValue == dimension.parentValue){
          flag = true;
        }
      }
    });
    return flag;
  }

  /**
   * 输出专科检查的三个radio
   * @returns {Array}
   */
  function checkOutRadio(){
    var ary = [];
    var html = "";
    if($scope.entity.name_215){
      html = "林纳实验（RT左耳）：";
      angular.forEach($scope.dimensions.name_215.options,function(option){
        if(option.name == $scope.entity.name_215){
          html += option.label;
        }
      });
      html += "。";
      ary.push(html);
    }
    if($scope.entity.name_216){
      html = "林纳试验（RT右耳）:";
      angular.forEach($scope.dimensions.name_216.options,function(option){
        if(option.name == $scope.entity.name_216){
          html += option.label;
        }
      });
      html += "。";
      ary.push(html);
    }
    if($scope.entity.name_217){
      html = "韦伯实验（WT）:";
      angular.forEach($scope.dimensions.name_217.options,function(option){
        if(option.name == $scope.entity.name_217){
          html += option.label;
        }
      });
      html += "。";
      ary.push(html);
    }
    return ary;
  }

  /**
   * 生成既往史输出
   * @param obj
   */
  function genJws(obj){
    var data = [],
        entity,value,
        dimension,options,
        idx,idy,length,yLength,flag;
    var tpls = [
      {
        tpl: 'tpl',
        name: 'name_105',
        tip: '【既往疾病史】'
      },{
        tpl: '曾做tpl',
        name: 'name_130',
        tip: '【手术名称】'
      },{
        tpl: 'tpl',
        name: 'name_131',
        tip: '【手术说明】'
      },{
        tpl: '近一个月手术',
        name: 'name_132',
        tip: '【是否为近一个月手术】'
      },{
        tpl: 'tpl',
        name: 'name_133',
        tip: '【麻醉方式】'
      }
    ];
    for(idx=0,length=tpls.length;idx<length;idx++) {
      entity = tpls[idx];
      value = $scope.entity[entity.name];
      dimension = $scope.dimensions[entity.name];
      if(entity.name == 'name_105'){
        var string1,string2 = "";
        string1 = "";
        string2 = "";
        angular.forEach(dimension.options,function(option){
          if(value && value[option.name] ){
            string1 += option.label;
            if(option.note){
              string1 += "[" + $scope.entity[option.note] + "]";
            }
            string1 += ",";
          }else{
            string2 += option.label;
            string2 += ",";
          }
        });
        if(string1!=""){
          string1 = "有" + string1;
          data.push(string1.substring(0,string1.length-1));
        }
        if(string2!=""){
          string2 = "否认" + string2;
          data.push(string2.substring(0,string2.length-1));
        }
      }
      else{
        if( dimension && dimension.options ){
          options = dimension.options;
          for(idy=0,yLength=options.length;idy<yLength;idy++){
            if( value == options[idy].name ){
              value = options[idy].label;
            }
          }
        }
        if(entity.name == 'name_132'){
          if( value == '是' ){
            value = '近一个月手术';
          }else{
            value = "";
          }
        }
        if( value!=undefined && value!=''){
          data.push(entity.tpl.replace('tpl',value));
        }
      }
    }
    obj.text = data.join(',');
    obj.text += "。";
  }

  /**
   * 个人史预览
   * @param obj
   */
  function genGrs(obj) {
    var data = [],
        entity,value,dimension,
        length,idx;
    var tpls = [
      {
        tpl: "出生于tpl",
        name: "name_134",
        tip: "出生于【出生地】"
      }, {
        tpl: "久居于tpl",
        name: "name_135",
        tip: "久居于【现居地】"
      }, {
        tpl: "tpl",
        name: "name_136",
        tip: "【个人史】"
      }
    ];
    for (idx = 0, length = tpls.length; idx < length; idx++) {
      entity = tpls[idx];
      value = $scope.entity[entity.name];
      dimension = $scope.dimensions[entity.name];
      if (entity.name == 'name_136') {
        var string1, string2 ,string3 ,string4 = "";
        string1 = "";
        string2 = "";
        string3 = "";
        angular.forEach(dimension.options, function (option) {
          //zyz_deubg 现在有一个问题,一定要选中值一个才能正常输出值,否则会报value_0undefined问题
          //原因，选中值才会创建entity
          if (value && value[option.name] && option.name!='value_13' && option.name!='value_14') {
            string1 += option.label;
            if (option.note && $scope.entity[option.note]) {
              string1 += "[" + $scope.entity[option.note] + "]";
            }
            string1 += ",";
          }else if(value && option.name=='value_13'){
            if(value[option.name]){
              string3 += "有" + option.label;
              if($scope.entity.name_149){
                string3 += "[" + $scope.entity.name_149 + $scope.entity.name_149unit + "],";
              }
              if($scope.entity.name_150 == 'value_0' && $scope.entity.name_151){
                string3 += "已戒烟" + $scope.entity.name_151 + $scope.entity.name_151unit;
              }else if($scope.entity.name_150 == 'value_1' && $scope.entity.name_152){
                string3 += "每日吸烟量：" + $scope.entity.name_152 + "根";
              }
            }else{
              string3 += "否认" + option.label;
            }
          } else if (value && option.name=='value_14'){
            if(value[option.name]){
              string4 += "有" + option.label;
              if($scope.entity.name_153){
                string4 += "[" + $scope.entity.name_153 + $scope.entity.name_153unit + "],";
              }
              if($scope.entity.name_154 == 'value_0' && $scope.entity.name_155){
                string4 += "已戒酒" + $scope.entity.name_155 + $scope.entity.name_155unit;
              }else if($scope.entity.name_154 == 'value_1' && $scope.entity.name_156){
                string4 += "每日饮酒量：" + $scope.entity.name_156 + "两";
              }
            }else{
              string4 += "否认" + option.label;
            }
          }else {
            string2 += option.label;
            string2 += ",";
          }
        });
        if (string1 != "") {
          string1 = "有" + string1;
          data.push(string1.substring(0, string1.length - 1));
        }
        if (string2 != "") {
          string2 = "否认" + string2;
          data.push(string2.substring(0, string2.length - 1));
        }
        if (string3 != ""){
          data.push(string3);
        }
        if (string4 != ""){
          data.push(string4);
        }
      }else if( value!=undefined && value!=''){
        data.push(entity.tpl.replace('tpl',value));
      }
    }
    obj.text = data.join('。');
    obj.text += "。";
  }

  /**
   * 输出的修改操作
   * @param obj
   */
  $scope.modifyText = function(type){
    $scope.outputText[type].tplStatus = "modify";
    if($scope.outputText[type].text == "" || $scope.outputText[type].text == null){
      getText(type);
    }
  };

  /**
   * 将文本转成输出文本
   * @param type
   */
  function getText(type){
    if(type == 'bodyExam'){
      var ary = $("#"+type+" div div div");
      var examString = [];
      for(var i=0;i<ary.length;i++){
        var string = $(ary[i]).text();
        string = string.replace(/[\r\n\t]/g,'');//去掉换行和回车
        string = string.replace(/[ ]/g, "");//去掉空格
        string = "    " + string;
        examString.push(string);
      }
      $scope.outputText[type].text = examString.join("\r\n");
    }else if(type == 'Marital'){
      var string = $("#"+type+" div div div").text();
      string = string.replace(/[\r\n\t]/g,'');//去掉换行和回车
      string = string.replace(/[ ]/g, "");//去掉空格
      $scope.outputText[type].text = string;
    }else if(type == 'family'){
      var string = $("#"+type+" div div div span i").text();
      $scope.outputText[type].text = string;
    }else{
      $scope.outputText[type].text = $("#"+type+" div div span i").text();
    }
  }

  /**
   * 现病史的输出一部分是获取表单中的文字，一部分是js生成，所以特殊处理
   * @param text
   */
  function getXbsText(text){
    var ary = $("#nowDisease div div div div");
    var examString = [];
    for(var i=0;i<ary.length;i++){
      if($(ary[i]).attr('id') == 'make'){
        examString.push(text);
      }else{
        var string = $(ary[i]).text();
        string = string.replace(/[\r\n\t]/g,'');//去掉换行和回车
        string = string.replace(/[ ]/g, "");//去掉空格
        if(string!=""){
          examString.push(string);
        }
      }
    }
    $scope.outputText.nowDisease.text = examString.join("。");
    $scope.outputText.nowDisease.text += "。";
  }

  /**
   * 输出的修改后的完成操作
   * @param obj
   */
  $scope.viewText = function(type){
    $scope.outputText[type].tplStatus = "view";
  };

  /**
   * 输出的返回操作
   * @param type
   */
  $scope.goBackView = function(type){
    $scope.outputText[type].show = false;
  };

  /**
   * 输出
   */
  $scope.print = function(){
    PrintService.bindPrint();
  };

  /**
   * 检查是否填写了化验及特殊检查的内容，检测输出文本中是否显示
   * @returns {boolean}
   */
  $scope.checkHyjtsjc = function(){
    var flag = false;
    angular.forEach($scope.dimensions.name_1055.options,function(option){
      if($scope.entity[option.entityName] && $scope.entity[option.entityName]==true){
        flag = true;
      }
    });
    return flag;
  };

  /**
   * 检查是否填写了诊断表格中的内容，检测输出文本中是否显示
   * @returns {boolean}
   */
  $scope.checkZd = function(){
    var flag = false;
    if(($scope.entity.name_1067 && $scope.entity.name_1067!="") || ($scope.entity.name_1068 && $scope.entity.name_1068!="")){
      flag = true;
    }
    return flag;
  };

  /**
   * 输出时药物治疗后面要加“等治疗”。
   * @returns {boolean}
   */
  $scope.checkWoyuanDrug = function(){
    if($scope.entity.name_66 || $scope.entity.name_67 || $scope.entity.name_68 || $scope.entity.name_69 || $scope.entity.name_70 ||
        $scope.entity.name_66_1 || $scope.entity.name_67_1 || $scope.entity.name_68_1 || $scope.entity.name_69_1 || $scope.entity.name_70_1 ||
        $scope.entity.name_66_2 || $scope.entity.name_67_2 || $scope.entity.name_68_2 || $scope.entity.name_69_2 || $scope.entity.name_70_2){
      return true;
    }else{
      return false;
    }
  };

  /**
   * 输出时药物治疗后面要加“等治疗”。
   * @returns {boolean}
   */
  $scope.checkOtherDrug =function(){
    if($scope.entity.name_90 || $scope.entity.name_91 || $scope.entity.name_92 || $scope.entity.name_93 || $scope.entity.name_94 ||
        $scope.entity.name_90_1 || $scope.entity.name_91_1 || $scope.entity.name_92_1 || $scope.entity.name_93_1 || $scope.entity.name_94_1 ||
        $scope.entity.name_90_2 || $scope.entity.name_91_2 || $scope.entity.name_92_2 || $scope.entity.name_93_2 || $scope.entity.name_94_2){
      return true;
    }else{
      return false;
    }
  };

  $scope.genHyjtsjc = function(type){
    $scope.outputText[type].text = "";
    var arr = [];
    if(type == 'test'){
      angular.forEach($scope.dimensions.name_1055.options,function(option){
        if($scope.entity[option.entityName] && $scope.entity[option.entityName]){
          arr.push(option.label);
        }
      })
    }
    $scope.outputText[type].text = arr.join(',');
    $scope.outputText[type].text += "。";
  };

  /**
   * 展开收起按钮
   * @param type 主题类型
   * @param active 是否显示
     */
  $scope.showSpecialtyTheme = function(type,active){
    $scope.specialtyTheme[type].active = active;
  };

  var oMultiDiff = "";
  function query(name){
    InputService.getCodePy().then(function(msg){
      oMultiDiff= msg;
      var dimensions = $scope.dimensions[name].options;
      angular.forEach(dimensions,function(dimension){
        var label = angular.copy(dimension.label);
        dimension.pyName = InputService.makePy(label,oMultiDiff);//给每一个加上拼音首字母
      });
      $scope.drugOptions = dimensions.options;
    });
  }

  /**
   * 计算ＢＭＩ
   * @param height　身高
   * @param weight　体重
     */
  $scope.getBmi = function(height,weight){
    var hh = 0;
    var ww = 0;
    if(height && weight && height!="" && weight!=""){
      if(!isNaN(height) && !isNaN(weight)){
        hh = parseInt(height)/100;
        ww = parseInt(weight);
        $scope.entity.name_195 = $filter('number')(ww/(hh*hh),2);
      }
      else{
        $scope.entity.name_195 = "";
      }
    }
  };

  /**
   * 计算左耳ＰＴＡ
   */
  $scope.calculation = function(){
    var param = ["","","","","","","","",""];
    angular.forEach(arguments,function(argument,index){
      if(argument){
        param[index] = argument;
      }
    });
    var type = param[0];
    param.splice(0,1);
    if(type == 'left'){
      $scope.entity.name_ze_pta = average(angular.copy(param));
      $scope.entity.name_ze_sspl = damageFrequency(angular.copy(param));
    }else{
      $scope.entity.name_ye_pta = average(angular.copy(param));
      $scope.entity.name_ye_sspl = damageFrequency(angular.copy(param));
    }
  };

  function average(){
    var value = 0;
    var sum = 0;
    var arr = [];
    var param = arguments[0].splice(2,4);
    angular.forEach(param,function (argument) {
      if(argument && argument!="" && !isNaN(argument)){
        arr.push(argument);
      }
    });
    angular.forEach(arr,function(count){
      sum += parseInt(count);
    });
    value = $filter('number')(parseInt(sum)/parseInt(arr.length),2);
    return value;
  }

  function damageFrequency(){
    var value = 0;
    var sum = 0;
    var arr = [];
    var param = arguments[0];
    angular.forEach(param,function (argument) {
      if(argument && argument!="" && !isNaN(argument)){
        if(parseInt(argument)>25){
          arr.push(argument);
        }
      }
    });
    angular.forEach(arr,function(count){
      sum += parseInt(count);
    });
    value = $filter('number')(parseInt(sum)/parseInt(arr.length),2);
    return value;
  }
}]);
