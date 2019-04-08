angular.module('infi-basic').value('tplValue',{
  entryDataCopy: [
    {
      type: "plain",
      label: "患者姓名",
      value: "name",
      id: "entry-pName"
    },
    {
      type: "plain",
      label: "年龄",
      value: "age",
      id: "entry-age"
    },
    {
      type: "plain",
      label: "性别",
      // valMap: [
      //   {"label": "男", "value": "0", "name": "entry-sex"},
      //   {"label": "女", "value": "1", "name": "entry-sex"}
      // ],
      value: "sex",
      name: "entry-sex"
    },
    {
      type: "plain",
      label: "ID 号",
      value: "patiId",
    },
    {
      type: "plain",
      label: "住院号",
      value: "inHospNo",
    },
    // {
    //   type: "text",
    //   label: "床号",
    //   value: "bedNo",
    // },
    {
      type: "plain",
      label: "费别",
      value: "chargeType",
    },
    {
      type: "plain",
      label: "病区",
      value: "deptAdmissionTo"
    },
    {
      type: "list",
      value: "admDiag",
    },
    {
      type: "plain",
      label: "入院时间",
      value: "admissionDateTime",
      id: "entry-entryDate"
    },
    {
      isEmpty: true,
      type: "plain",
      label: "",
      value: "",
      id: ""
    },
    {
      type: "plain",
      label: "登记者",
      value: "registrar",
    },
    {
      type: "plain",
      label: "登记时间",
      value: "registTime",
      id: "entry-registDate"
    }
  ],

  exitDataCopy: [
    {
      type: "plain",
      label: "住院天数",
      value: "inHospDays",
    },
    {
      type: "text",
      label: "住院花费",
      placeholder: "请输入住院花费",
      value: "charge"
    },
    {
      type: "list",
      value: "discDiag",
    },
    {
      type: "text",
      label: "微信",
      placeholder: "请输入微信",
      value: "weChat"
    },
    {
      type: "text",
      label: "QQ 号",
      placeholder: "请输入住 QQ 号",
      value: "qq"
    },
    {
      type: "plain",
      label: "通信地址",
      value: "mailingAddress"
    },
    {
      type: "plain",
      label: "邮政编码",
      value: "zipCode"
    },
    {
      type: "plain",
      label: "单位邮编",
      value: "unitZipCode"
    },
    {
      type: "plain",
      label: "家庭电话号码",
      value: "phoneNumberHome"
    },
    {
      type: "plain",
      label: "单位电话号码",
      value: "phoneNumberBusiness"
    },
    {
      type: "plain",
      label: "联系人姓名",
      value: "nextOfKin"
    },
    {
      type: "plain",
      label: "与联系人关系",
      value: "relationship"
    },
    {
      type: "plain",
      label: "联系人地址",
      value: "nextOfKinAddr"
    },
    {
      type: "plain",
      label: "联系人邮政编码",
      value: "nextOfKinZipCode"
    },
    {
      type: "plain",
      label: "联系人电话号码",
      value: "nextOfKinPhone"
    },
    {
      type: "plain",
      label: "出院时间",
      value: "dischargeTime"
    },
    {
      type: "datetime",
      label: "复诊预约时间",
      value: "reappointTime",
      title: "点击选择复诊预约时间",
      id: "exit-reappointTime"
    },
    {
      type: "plain",
      label: "登记者",
      value: "registrar"
    },
    {
      type: "plain",
      label: "登记时间",
      value: "registTime"
    }
  ]
});