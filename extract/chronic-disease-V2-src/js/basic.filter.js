angular.module('infi-basic')
  .filter('filtGender', function() {
    return function(value) {
      switch(value) {
        case 0: 
          return '女'
        case 1: 
          return '男'
        case null: 
          return '-'
      }
    }
  })
  .filter('filtMarrage', function() {
    return function(value) {
      switch(value) {
        case 0: 
          return '未婚'
        case 1: 
          return '已婚'
        case null: 
          return '-'
      }
    }
  })
  .filter('filtdustAndSoot', function() {
    return function(value) {
      switch(value) {
        case 0: 
          return '否'
        case 1: 
          return '是'
        case null: 
          return '-'
      }
    }
  })
  .filter('filtInterviewStatus', function() {
    return function(value) {
      switch(value) {
        case 'ready': 
          return '未执行'
        case 'finish': 
          return '已执行'
      }
    }
  })
  .filter('null2array', function() {
    return function(value) {
      switch(value) {
        case null:
         return []
      }
    }
  })