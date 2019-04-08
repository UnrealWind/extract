angular.module('infi-basic').value('configValue',{
  addBtnMap: {
    'template': [
      {
        'type': 'tag',
        'txt': '添加标签'
      }
    ],

    'tag': [
      {
        'type': 'classify',
        'txt': '添加分类'
      }
    ],

    'classify': [
      {
        'type': 'value',
        'txt': '添加值'
      }
    ],

    'attribute': [
      {
        'type': 'value',
        'txt': '添加值'
      }
    ],

    'value': [
      {
        'type': 'attribute',
        'txt': '添加属性'
      },
      {
        'type': 'relate',
        'txt': '添加相关症状'       
      }
    ],

    'relate': [
      {
        'type': 'value',
        'txt': '添加值'
      }
    ]
  },
  saveDataMap: {
    'tag': {
      'id': null,
      'label': null,
      'value': null,
      'sort': null,
      'templateId': null,
      'clazz': null,
      'classifyNodes': null,
      'valueNodes': null
    },
    'classify': {
      'id': null,
      'label': null,
      'value': null,
      'sort': null,
      'clazz': null,
      'tagNodeId': null,
      'attributeNodeId': null,
      'valueNodes': null,
      'attributeNodes': null
    },
    'attribute': {
      'id': null,
      'label': null,
      'value': null,
      'sort': null,
      'options': null,
      'clazz': null,
      'valueNodeId': null,
      'classifyNodeId': null,
      'classifyNodes': null,
      'valueNodes': null
    },
    'value': {
      'id': null,
      'label': null,
      'value': null,
      'sort': null,
      'clazz': null,
      'tagNodeId': null,
      'classifyNodeId': null,
      'attributeNodeId': null,
      'attributeNodes': null,
      'relateNodes': null
    },
    'relate': {
      'id': null,
      'label': null,
      'value': null,
      'sort': null,
      'clazz': null,
      'tagNodeId': null,
      'classifyNodeId': null,
      'attributeNodeId': null,
      'attributeNodes': null,
      'relateNodes': null
    }
  }

});