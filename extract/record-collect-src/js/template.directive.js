angular.module('infi-basic').directive('choseTemplate', [function () {
    return {
        restrict: 'ECMA',
        templateUrl: './html/chose.template.html',
        scope: {
            workSpaceInfo:'='
        },
        link: function (scope,element,attrs) {
            console.log(scope.workSpaceInfo)


        }
    }
}]);

angular.module('infi-basic').directive('choseAttr', ['RecordCollectService',function (RecordCollectService) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/chose.attr.html',
        scope: {
            workSpaceInfo:'='
        },
        link: function (scope,element,attrs) {
            console.log(scope.workSpaceInfo,'attr')
            scope.attrTree = null;
            scope.searchVal = null;
            scope.searchResult=[];

            scope.search = function (labelKid) {
                RecordCollectService.search(labelKid,scope.searchVal,scope.workSpaceInfo).then(function (msg) {
                    scope.searchVal?scope.searchResult = msg.data:scope.searchResult = [];
                    scope.searchResult.forEach(function (ni,index) {
                        scope.workSpaceInfo.data.childs.forEach(function (nz,iz) {
                            nz.name == ni.name?ni['checked'] = true:'';
                        })
                    })
                })
            }

            scope.getAttr = function (params,moduleId) {
                RecordCollectService.getAttr(params,moduleId).then(function (msg) {
                    scope.attrTree = msg.data;
                    scope.attrTree[0].childs[0]['active'] = true;
                    scope.attrTree[0].childs.forEach(function (n,i) {
                        n.childs.forEach(function (ni,ii) {
                            scope.workSpaceInfo.data.childs?scope.workSpaceInfo.data.childs.forEach(function (nz,iz) {
                                nz.name == ni.name?ni['checked'] = true:'';
                            }):'';
                        })
                    })
                    console.log(scope.attrTree,'attrLists');
                })
            }
            scope.getAttr(scope.workSpaceInfo,scope.workSpaceInfo.data.moduleId);

            scope.addActive = function (attrs) {
                scope.attrTree.forEach(function(n,i){
                    n.childs.forEach(function(ni,ii){
                        ni['active'] = false;
                    })
                });
                attrs['active']=true;
            }

            scope.addAttr = function (attr) {
                var has;
                var targetAttr =attr;
                !scope.workSpaceInfo.data.childs?scope.workSpaceInfo.data.childs = []:'';
                scope.workSpaceInfo.data.childs.forEach(function(n,i){
                    n.kid == attr.kid?(has = true,targetAttr = scope.workSpaceInfo.data.childs[i]):''
                });
                !has?scope.workSpaceInfo.data.childs.push(attr):'';
                scope.addQuestion(scope.workSpaceInfo.data,targetAttr);
                attr['checked'] = true;
            }

            scope.addQuestion = function (attrs,attr) {
                if(attrs.moduleId == 8 || attrs.moduleId == 5) return;
                !attr.childs?RecordCollectService.addQuestion(attrs,attr,scope.workSpaceInfo):
                    RecordCollectService.addAttr(attrs,attr,scope.workSpaceInfo);
            };

            scope.$watch('workSpaceInfo.data.moduleId',function (newValue,oldValue) {
                newValue!==oldValue?scope.getAttr(scope.workSpaceInfo,scope.workSpaceInfo.data.moduleId):'';
            },true)

            scope.$watch('workSpaceInfo.data.childs.length',function (newValue,oldValue) {
                if(scope.workSpaceInfo.data.moduleId == 8 || scope.workSpaceInfo.data.moduleId == 5) return;
                scope.getAttr(scope.workSpaceInfo,scope.workSpaceInfo.data.moduleId);
            },true)

        }
    }
}]);

angular.module('infi-basic').directive('choseSpeAttr', ['RecordCollectService',function (RecordCollectService) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/chose.spe-attr.html',
        scope: {
            workSpaceInfo:'='
        },
        link: function (scope,element,attrs) {
            console.log(scope.workSpaceInfo,'spe-attr')
            scope.attrTree = null;
            scope.searchVal = null;
            scope.searchResult=[];

            scope.search = function (labelKid) {
                RecordCollectService.search(labelKid,scope.searchVal,scope.workSpaceInfo).then(function (msg) {
                    scope.searchVal?(function () {
                        msg.data.forEach(function (n,i) {
                            scope.workSpaceInfo.data.childs.forEach(function (nx,ix) {
                                nx.childs.forEach(function (ny,iy) {
                                    ny.kid == n.kid?n['checked'] = true:'';
                                })
                            })
                        })
                        scope.searchResult = msg.data;

                    })():scope.searchResult = [];
                })
            }

            scope.getAttr = function (params,moduleId) {
                RecordCollectService.getAttr(params,moduleId).then(function (msg) {

                    //一开始设计的不好，时间上也不允许，所以采取了四重循环，如需重构的话，重写项目吧
                    msg.data[0].childs.forEach(function (n,i) {
                        n.childs.forEach(function (ni,ii) {
                            scope.workSpaceInfo.data.childs.forEach(function (nx,ix) {
                                nx.childs.forEach(function (ny,iy) {
                                    ny.kid == ni.kid?ni['checked'] = true:'';
                                })
                            })
                        })
                    });
                    scope.attrTree = msg.data;
                    scope.attrTree[0].childs[0]['active'] = true;
                    console.log(scope.attrTree,'attrLists');
                })
            }
            scope.getAttr(scope.workSpaceInfo,scope.workSpaceInfo.data.moduleId);

            scope.addActive = function (attrs) {
                scope.attrTree.forEach(function(n,i){
                    n.childs.forEach(function(ni,ii){
                        ni['active'] = false;
                    })
                });
                attrs['active']=true;
            }

            scope.addSearchAttr = function (attr) {
                var copy = {
                    name:attr.parentName,
                    kid:attr.parentKid,
                    childs:[angular.copy(attr)]
                };
                scope.addAttr(copy,attr);
            };

            scope.addAttr = function (attrs,attr) {
                !scope.workSpaceInfo.data.childs?scope.workSpaceInfo.data.childs = []:'';
                var hasAttrs;
                scope.workSpaceInfo.data.childs.forEach(function(n,i){
                    n.kid == attrs.kid?(function () {
                        var hasAttr;
                        n.childs.forEach(function (ni,ii) {
                            ni.kid == attr.kid?hasAttr = true:'';
                        });
                        !hasAttr?n.childs.push(attr):'';
                        hasAttrs = true;
                    })():'';
                });

                !hasAttrs?(function () {
                    var copyAttrs = angular.copy(attrs);
                    copyAttrs.childs = [attr];
                    scope.workSpaceInfo.data.childs.push(copyAttrs)
                })():'';

                attr['checked'] = true;
            };

            scope.$watch('workSpaceInfo.data.moduleId',function (newValue,oldValue) {
                newValue!==oldValue?scope.getAttr(scope.workSpaceInfo,scope.workSpaceInfo.data.moduleId):'';
            },true)

            scope.$watch('workSpaceInfo.data.childs',function (newValue,oldValue) {
                scope.getAttr(scope.workSpaceInfo,scope.workSpaceInfo.data.moduleId);
            },true)

        }
    }
}]);

angular.module('infi-basic').directive('choseQuestion', ['RecordCollectService',function (RecordCollectService) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/chose.question.html',
        scope: {
            workSpaceInfo:'=',
            wholeInfo:'='
        },
        link: function (scope,element,attrs) {
            scope.workSpaceInfo.data.childs.forEach(function (n,i) {
                n.childs?n.childs.forEach(function (ni,ii) {
                    ni.name == '持续时间' && ni.type == 'smallText' && !ni.unitValue ? ni.unitValue = '年':'';
                }):'';
            })

            scope.addQuestion = function (attrs,attr) {
                RecordCollectService.saveLeft(angular.copy(scope.workSpaceInfo),scope.wholeInfo);
                !attr.childs?RecordCollectService.addQuestion(attrs,attr,scope.workSpaceInfo):
                    RecordCollectService.addAttr(attrs,attr,scope.workSpaceInfo);
            };

            //添加更多
            scope.addAttr = function (attrs) {
                scope.workSpaceInfo.mark = 'attr';
                scope.workSpaceInfo.data = attrs;
            };

            //增加关联症状
            scope.addAttrs = function (attr) {
                var has;
                !scope.workSpaceInfo.data.childs?scope.workSpaceInfo.data.childs = []:'';
                scope.workSpaceInfo.data.childs.forEach(function(n,i){
                    n.kid == attr.kid?has = true:''
                });
                !has?scope.workSpaceInfo.data.childs.push(attr):'';
            }

            scope.addVal =function(opt,question){
                var has;
                !question.values?question.values = []:'';
                question.values.forEach(function (n,i) {
                    n == opt.kid?(question.values.splice(i,1),has=true):'';
                });
                !has?(question.values.push(opt.kid)):'';
            }
        }
    }
}]);

angular.module('infi-basic').directive('chosePastHistory', ['RecordCollectService', 'Utils', function (RecordCollectService, Utils) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/chose.past.history.html',
        scope: {
            workSpaceInfo:'='
        },
        link: function (scope,element,attrs) {
            console.log(scope.workSpaceInfo,123123)
            scope.targetQuestion = null;
            scope.showChild = function(opt,mark){
                mark?scope.targetQuestion = opt:(function () {
                    !opt.something?(function () {
                        opt.childs.forEach(function (n,i) {
                            n.value = null;
                            n.unitValue = null;
                        })
                        scope.targetQuestion = null
                    })():scope.targetQuestion = opt;
                })()
            }

            scope.choseParent = function(){
                !scope.targetQuestion.something?($("input[mark='"+scope.targetQuestion.name+"']",element).click(),scope.targetQuestion.something = true):'';
            }

            scope.findObjectByKey = function(array, key, value) {
				if(array) {
					for (var i = 0; i < array.length; i++) {
						if (array[i][key] === value) {
								return {
									isIn: true,
									ind: i
								};
						}
					}
				}

				return {
					isIn: false,
				}
            }

            scope.searchFilter = function(labelKid, kw, secChild) {
                secChild.searchAbout['rst'] = null

                if(kw) {
                    RecordCollectService.searchFilter(labelKid, kw, scope.workSpaceInfo).then(function(data) {
                        var rst = null

                        if(data && data.length > 0) {
                            rst = []
                            angular.forEach(data, function(val, ind) {
                                rst.push(val)
                            })
                        } else if(!data) {
                            rst = []
                        }

                        secChild.searchAbout['rst'] = rst
                    })
                }
            }
        }
    }
}]);

angular.module('infi-basic').directive('basicInfo', [function () {
    return {
        restrict: 'ECMA',
        templateUrl: './html/basic.info.html',
        scope: {
            wholeInfo:'='
        },
        link: function (scope,element,attrs) {
            console.log(scope.wholeInfo,'basic.info')
            scope.close = true;
            scope.changeStatus = function () {
                scope.close = !scope.close;
            }
        }
    }
}]);

angular.module('infi-basic').directive('mainComplaint', ['RecordCollectService',function (RecordCollectService) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/main.complaint.html',
        scope: {
            mainComplaintData:'=',
            workSpaceInfo:'=',
            wholeInfo:'='
        },
        link: function (scope,element,attrs) {
            console.log(scope.mainComplaintData,'main.complaint');

            scope.delRemark = function (attrs) {
                attrs.remark = '';
                attrs['remarkShow'] = false;
            };

            scope.showRemark = function (attrs) {
                attrs['remarkShow'] = true;
            };

            scope.addAttr = function (attrs,title) {
                RecordCollectService.saveLeft(angular.copy(scope.workSpaceInfo),scope.wholeInfo);
                scope.workSpaceInfo.mark = 'attr';
                scope.workSpaceInfo.data = attrs;

                title?RecordCollectService.changeStatus(scope.wholeInfo.templateData,1):''
            };

            scope.addQuestion = function (attrs,attr) {
                RecordCollectService.saveLeft(angular.copy(scope.workSpaceInfo),scope.wholeInfo);
                !attr.childs?RecordCollectService.addQuestion(attrs,attr,scope.workSpaceInfo):
                    RecordCollectService.addAttr(attrs,attr,scope.workSpaceInfo);
            };

            scope.delAttr = function (attrs,idx) {
                attrs.childs.splice(idx,1);
                console.log(scope)
            }
        }
    }
}]);

angular.module('infi-basic').directive('presentHistory', ['RecordCollectService',function (RecordCollectService) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/present.history.html',
        scope: {
            mainComplaintData:'=',
            workSpaceInfo:'=',
            wholeInfo:'='
        },
        link: function (scope,element,attrs) {
            console.log(scope.mainComplaintData,'present.history');

            scope.findObjectByKey = function(array, key, value) {
				if(array) {
					for (var i = 0; i < array.length; i++) {
						if (array[i][key] === value) {
								return {
									isIn: true,
									ind: i
								};
						}
					}
				}

				return {
					isIn: false,
				}
            }

            scope.delRemark = function (attrs) {
                attrs.remark = '';
                attrs['remarkShow'] = false;
            };

            scope.showRemark = function (attrs) {
                attrs['remarkShow'] = true;
            };

            scope.addAttr = function (attrs,title) {
                RecordCollectService.saveLeft(angular.copy(scope.workSpaceInfo),scope.wholeInfo);
                scope.workSpaceInfo.mark = 'attr';
                scope.workSpaceInfo.data = attrs;

                title?RecordCollectService.changeStatus(scope.wholeInfo.templateData,2):'';
            };

            scope.addQuestion = function (attrs,attr) {
                RecordCollectService.saveLeft(angular.copy(scope.workSpaceInfo),scope.wholeInfo);
                !attr.childs?RecordCollectService.addQuestion(attrs,attr,scope.workSpaceInfo):
                    RecordCollectService.addAttr(attrs,attr,scope.workSpaceInfo);
            };

            scope.delAttr = function (attrs,idx) {
                attrs.childs.splice(idx,1);
            }

            /**
             * 点击右侧元素左侧模板变为对应内容
             */
            scope.switchTemp = (function() {

                var lastClickItem = null

                return function(item) {
                    RecordCollectService.saveLeft(angular.copy(scope.workSpaceInfo),scope.wholeInfo);

                    scope.workSpaceInfo.mark = 'drugState'
                    scope.workSpaceInfo.data = scope.mainComplaintData

                    if(item.active) return                                                      // 点击的为当前激活的无需重复下方逻辑

                    lastClickItem ? lastClickItem.active = false : undefined                    // 取消上次点击元素的 active 状态

                    lastClickItem = item                                                        // 将上次点击的元素置为当前点击的元素

                    item.active = true                                                          // 为当前点击元素添加 active 状态
                }
            })()

        }
    }
}]);

// 既往史
angular.module('infi-basic').directive('pastHistory', ['RecordCollectService',function (RecordCollectService) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/past.history.html',
        scope: {
            mainComplaintData:'=',
            workSpaceInfo:'=',
            wholeInfo:'='
        },
        link: function (scope,element,attrs) {
            console.log(scope.mainComplaintData,'pasthistory')
            scope.findObjectByKey = function(array, key, value) {
				if(array) {
					for (var i = 0; i < array.length; i++) {
						if (array[i][key] === value) {
								return {
									isIn: true,
									ind: i
								};
						}
					}
				}

				return {
					isIn: false,
				}
            }



            scope.delRemark = function (attrs) {
                attrs.remark = '';
                attrs['remarkShow'] = false;
            };

            scope.showRemark = function (attrs) {
                attrs['remarkShow'] = true;
            };

            /**
             * 点击右侧元素左侧模板变为对应内容
             */
            scope.switchTemp = (function() {

                var lastClickItem = null

                return function(item,title) {
                    RecordCollectService.saveLeft(angular.copy(scope.workSpaceInfo),scope.wholeInfo);

                    if(title){
                        RecordCollectService.changeStatus(scope.wholeInfo.templateData,3);
                        return;
                    }

                    scope.workSpaceInfo.mark = 'pastHistory'
                    scope.workSpaceInfo.data = scope.mainComplaintData
                    if(item.active) return                                                      // 点击的为当前激活的无需重复下方逻辑

                    lastClickItem ? lastClickItem.active = false : undefined                    // 取消上次点击元素的 active 状态

                    lastClickItem = item                                                        // 将上次点击的元素置为当前点击的元素

                    item.active = true                                                          // 为当前点击元素添加 active 状态
                }
            })()
        }
    }
}]);

//过敏史
angular.module('infi-basic').directive('anaphylaxis', ['RecordCollectService',function (RecordCollectService) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/anaphylaxis.html',
        scope: {
            mainComplaintData:'=',
            workSpaceInfo:'=',
            wholeInfo:'='
        },
        link: function (scope,element,attrs) {
            console.log(scope.mainComplaintData,'anaphylaxis')

            scope.delRemark = function (attrs) {
                attrs.remark = '';
                attrs['remarkShow'] = false;
            };

            scope.showRemark = function (attrs) {
                attrs['remarkShow'] = true;
            };

            /**
             * 点击右侧元素左侧模板变为对应内容
             */
            scope.switchTemp = (function() {
                var lastClickItem = null
                return function(item,title) {
                    RecordCollectService.saveLeft(angular.copy(scope.workSpaceInfo),scope.wholeInfo);

                    scope.workSpaceInfo.mark = 'anaphylaxis'
                    scope.workSpaceInfo.data = scope.mainComplaintData

                    if(title){
                        RecordCollectService.changeStatus(scope.wholeInfo.templateData,4);
                        return;
                    }

                    if(item.active) return                                                      // 点击的为当前激活的无需重复下方逻辑

                    lastClickItem ? lastClickItem.active = false : undefined                    // 取消上次点击元素的 active 状态

                    lastClickItem = item                                                        // 将上次点击的元素置为当前点击的元素

                    item.active = true                                                          // 为当前点击元素添加 active 状态
                }
            })()

        }
    }
}]);

//体格检查
angular.module('infi-basic').directive('checkBody', ['RecordCollectService',function (RecordCollectService) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/check.body.html',
        scope: {
            mainComplaintData:'=',
            workSpaceInfo:'=',
            wholeInfo:'='
        },
        link: function (scope,element,attrs) {
            console.log(scope.mainComplaintData,'check.body')
            scope.mainComplaintData.data[0].childs[0].min =='null'?scope.mainComplaintData.data[0].childs[0].min = '':'';
            scope.mainComplaintData.data[0].childs[0].max =='null'?scope.mainComplaintData.data[0].childs[0].max = '':'';
            scope.addAttr = function (attrs) {
                RecordCollectService.saveLeft(angular.copy(scope.workSpaceInfo),scope.wholeInfo);
                scope.workSpaceInfo.mark = 'attr';
                scope.workSpaceInfo.data = attrs;

            };

            scope.changeStatus = function(){
                RecordCollectService.changeStatus(scope.wholeInfo.templateData,5)
            }

            scope.delAttr = function (idx,attrs) {
                attrs.childs.splice(idx,1)
            }

            scope.delRemark = function (attrs) {
                attrs.remark = '';
                attrs['remarkShow'] = false;
            };

            scope.showRemark = function (attrs) {
                attrs['remarkShow'] = true;
            };

        }
    }
}]);

//检查
angular.module('infi-basic').directive('checkResult',  ['RecordCollectService',function (RecordCollectService) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/check.result.html',
        scope: {
            mainComplaintData:'=',
            workSpaceInfo:'=',
            wholeInfo:'='
        },
        link: function (scope,element,attrs) {
            console.log(scope.mainComplaintData,'check.Result');

            scope.delRemark = function (attrs) {
                attrs.remark = '';
                attrs['remarkShow'] = false;
            };

            scope.showRemark = function (attrs) {
                attrs['remarkShow'] = true;
            };

            scope.addAttr = function (attrs,title) {
                RecordCollectService.saveLeft(angular.copy(scope.workSpaceInfo),scope.wholeInfo);
                scope.workSpaceInfo.mark = 'attr';
                scope.workSpaceInfo.data = attrs;

                title?RecordCollectService.changeStatus(scope.wholeInfo.templateData,7):''
            };

            scope.addQuestion = function (attrs,attr) {
                RecordCollectService.saveLeft(angular.copy(scope.workSpaceInfo),scope.wholeInfo);
                !attr.childs?RecordCollectService.addQuestion(attrs,attr,scope.workSpaceInfo):
                    RecordCollectService.addAttr(attrs,attr,scope.workSpaceInfo);
            };

            scope.delAttr = function (attrs,idx) {
                attrs.childs.splice(idx,1);
            }
        }
    }
}]);

//检验
angular.module('infi-basic').directive('examResult', ['RecordCollectService',function (RecordCollectService) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/exam.result.html',
        scope: {
            mainComplaintData:'=',
            workSpaceInfo:'=',
            wholeInfo:'='
        },
        link: function (scope,element,attrs) {
            console.log(scope.mainComplaintData,'exam.Result')

            scope.delRemark = function (attrs) {
                attrs.remark = '';
                attrs['remarkShow'] = false;
            };

            scope.showRemark = function (attrs) {
                attrs['remarkShow'] = true;
            };

            scope.addAttr = function (attrs,title) {
                RecordCollectService.saveLeft(angular.copy(scope.workSpaceInfo),scope.wholeInfo);
                scope.workSpaceInfo.mark = 'spe-attr';
                scope.workSpaceInfo.data = attrs;

                title?RecordCollectService.changeStatus(scope.wholeInfo.templateData,6):'';
            };

            scope.addQuestion = function (attrs,attr) {
                RecordCollectService.saveLeft(angular.copy(scope.workSpaceInfo),scope.wholeInfo);
                !attr.childs?RecordCollectService.addQuestion(attrs,attr,scope.workSpaceInfo):
                    RecordCollectService.addAttr(attrs,attr,scope.workSpaceInfo);
            };

            scope.delAttr = function (attrs,idx) {
                attrs.childs.splice(idx,1);
            }
        }
    }
}]);



// 门诊处方
angular.module('infi-basic').directive('prescription', ['RecordCollectService', '$http', '$routeParams', 'SYS', 'Utils',function (RecordCollectService, $http, $routeParams, SYS, Utils) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/prescription.html',
        scope: {
            mainComplaintData:'=',
            workSpaceInfo:'=',
            wholeInfo:'='
        },
        link: function (scope,element,attrs) {
            scope.findObjectByKey = Utils.findObjectByKey

            scope.changeStatus = function(){
                RecordCollectService.changeStatus(scope.wholeInfo.templateData,9)
            };

            //不想优化了。先这样吧，烦
            (function getCNMedicalList() {
                $http.get(SYS.prescriptUrl+'template/chinese/prescription').then(function (msg) {
                    scope.CNMedicalList = msg.data.data
                })
                $http.get(SYS.prescriptUrl+'template/exam').then(function (msg) {
                    scope.examList = msg.data.data
                })
                $http.get(SYS.prescriptUrl+'template/drug').then(function (msg) {
                    scope.drugList = msg.data.data
                })
                $http.get(SYS.prescriptUrl+'template/test').then(function (msg) {
                    scope.testList = msg.data.data
                })
            })()

            scope.addCNMedical = function (opt) {
                var arr = ['freqId','usagesId','decoctionId'];
                for(var i = scope.orgDataAbout.rst.chinesePrescription.chineseDrugs.length;i>0;i--){
                    scope.orgDataAbout.rst.chinesePrescription.chineseDrugs.pop();
                }
                opt.chineseDrugs.forEach(function (n,i) {
                    scope.orgDataAbout.rst.chinesePrescription.chineseDrugs.push(n)
                })
                for(var n in scope.orgDataAbout.rst.chinesePrescription){
                    n != 'chineseDrugs'?scope.orgDataAbout.rst.chinesePrescription[n] = opt[n]:'';
                }
                arr.forEach(function (n,i) {
                    scope.orgDataAbout.rst.chinesePrescription[n] = scope.orgDataAbout.rst.chinesePrescription[n].toString();
                })
            }

            //....
            scope.addTable = function (opt,num,mark,mark1) {
                opt[mark].forEach(function (n,i) {
                    for(var i in n){
                        n[i]?n[i] = n[i].toString():'';
                    }
                })
                var length = scope.orgDataAbout.rst[mark1].length;
                for(var i = 0;i<length;i++){
                    scope.orgDataAbout.rst[mark1].pop();
                }
                opt[mark].forEach(function (n,i) {
                    scope.orgDataAbout.rst[mark1].push(n)
                })
            }

            // 状态管理实例
            var StateMan = function() {
                this.currState = 'init'
                this.stateMachine = {
                    'init': {
                        fetch: 'fetching'
                    },
                    'fetching': {
                        success: 'showRst',
                        failure: 'showErr',
                    },
                    'showRst': {
                        refetch: 'init'
                    },
                    'showErr': {
                        refetch: 'init'
                    }
                }
            }

            StateMan.prototype = {
                changeState: function(name) {                       // 修改状态
                    var state = this.currState

                    if(this.stateMachine[state][name]) {
                        this.currState = this.stateMachine[state][name]
                    }

                    console.log(`${state} + ${name} --> ${this.currState}`)
                }
            }


            // 页面数据的状态实例
            scope.orgDataState = {
                state: new StateMan()
            }

            // 页面数据缓存变量
            scope.orgDataAbout = {
                rst: null
            }

            // 查看检查弹层的状态实例
            scope.viewDetailState = {
                state: new StateMan()
            }

            // 查看检查弹层数据缓存
            scope.viewExamAbout = {
                rst: null
            }

            // 查看检验弹层数据缓存
            scope.viewTestAbout = {
                rst: null
            }

            // 检查、检验弹出层数据接口匹配
            var viewDetailPop = {
                'exam': {
                    url: `${SYS.prescriptUrl}exam/`,
                    dataBind: 'viewExamAbout',
                    paramBind: 'examNo'
                },
                'test': {
                    url: `${SYS.prescriptUrl}test/report/`,
                    dataBind: 'viewTestAbout',
                    paramBind: 'testNo'
                }
            }

            // 当前弹窗的类型
            scope.currViewDetailType = null

            /**
             * 查看检查、检验详情
             */
            scope.viewExamDetail = function(lineData, type) {
                $('.view-exam-model').modal('toggle')
                scope.currViewDetailType = type                              // 更改当前查看详情模态框的类型，以方便选择展示的内容模板
                scope.viewDetailState.state.changeState('fetch')             // 更改当前状态为 fetching
                $http.get(`${viewDetailPop[type].url}${lineData[viewDetailPop[type]['paramBind']]}`).then(function(msg) {
                    if(msg.data.status == 'ok') {
                        scope.viewDetailState.state.changeState('success')
                        scope[viewDetailPop[type].dataBind].rst = msg.data.data
                    } else if(msg.data.status == 'blank') {
                        scope.viewDetailState.state.changeState('success')
                        scope[viewDetailPop[type].dataBind].rst = []
                    }
                    else {
                        scope.viewDetailState.state.changeState('failure')
                        scope[viewDetailPop[type].dataBind].rst = null
                    }
                }, function(error) {
                    scope.viewDetailState.state.changeState('failure')
                    scope[viewDetailPop[type].dataBind].rst = null
                })
            }

            // 存储每个模块请求 select range 的对应关系
            scope.modelSelectKey = [
                { tempInd: 1, apiKey: 'tset', rst: null },
                { tempInd: 0, apiKey: 'exam', rst: null },
                { tempInd: 2, apiKey: 'drug', rst: null },
                { tempInd: 3, apiKey: 'prescription', rst: null }
            ]

            // 前台维护的模板数据
            scope.setTempData = function() {
                scope.tempModal = [
                    {
                        label: "检查",
                        searchType: 'exam',
                        isSpecific: false,
                        hasTab: false,
                        secondSelected: scope.orgDataAbout.rst.exams,
                        inlineSearch: true,
                        searchShowField: ['name'],
                        searchRstTh: ['名称'],
                        secondSelectedTable: {
                            thead: [                                                    // type 0: 纯文本, 1: 文本输入, 2: select
                                { title: '检查项目', dataBind: 'name', type: 0 },
                                { title: '检查部位', dataBind: 'positionId', type: 2, selectRange: scope.modelSelectKey[1].rst['position'] || ['暂无数据'] },
                                { title: '执行科室', dataBind: 'executeDeptId', type: 2, selectRange: scope.modelSelectKey[1].rst['depts'] || ['暂无数据'] },
                                { title: '费用(元)', dataBind: 'price', type: 0 }
                            ]
                        }
                    },
                    {
                        label: "检验",
                        searchType: 'test',
                        isSpecific: false,
                        hasTab: false,
                        secondSelected: scope.orgDataAbout.rst.tests,
                        inlineSearch: true,
                        searchShowField: ['name'],
                        searchRstTh: ['名称'],
                        secondSelectedTable: {
                            thead: [
                                { title: '检验项目', dataBind: 'name', type: 0 },
                                { title: '样本', dataBind: 'sampleId', type: 2, selectRange: scope.modelSelectKey[0].rst['samples'] || ['暂无数据'] },
                                { title: '执行科室', dataBind: 'executeDeptId', type: 2, selectRange: scope.modelSelectKey[0].rst['depts'] || ['暂无数据'] },
                                { title: '费用(元)', dataBind: 'price', type: 0 }
                            ]
                        },
                        secondTabOpts: [
                            { name: '删除', sign: 'local', classes: ['text-danger', 'glyphicon', 'glyphicon-trash', 'cursor'], clickHandle: 'deleteItem' },
                        ]

                    },
                    {
                        label: "西药",
                        searchType: 'drug',
                        isSpecific: false,
                        hasTab: false,
                        inlineSearch: true,
                        searchShowField: ['name', 'spec', 'producer'],
                        searchRstTh: ['名称', '规格', '生产商'],
                        secondSelected: scope.orgDataAbout.rst.drugs,
                        secondSelectedTable: {
                            thead: [
                                { title: '药品名称', dataBind: 'name', type: 0 },
                                { title: '用法', dataBind: 'usagesId', type: 2, selectRange: scope.modelSelectKey[2].rst['usages'] || ['暂无数据']  },
                                { title: '单次剂量', dataBind: ['singleDose', 'singleDoseUnitId'], type: 3, selectRange: scope.modelSelectKey[2].rst['singleDoseUnits'] || ['暂无数据'] },
                                { title: '用药频率', dataBind: 'freqId', type: 2, selectRange: scope.modelSelectKey[2].rst['freqs'] || ['暂无数据']  },
                                { title: '开药量', dataBind: ['totalDose', 'totalDoseUnitId'], type: 3, selectRange: scope.modelSelectKey[2].rst['totalDoseUnits'] || ['暂无数据'] },
                                { title: '费用(元)', dataBind: 'price', type: 0 }
                            ]
                        },
                        secondTabOpts: [
                            { name: '删除', sign: 'local', classes: ['text-danger', 'glyphicon', 'glyphicon-trash', 'cursor'], clickHandle: 'deleteItem' },
                        ]
                    },
                    {
                        label: "中药",
                        searchType: 'cdrug',
                        isSpecific: true,
                        hasTab: false,
                        inlineSearch: true,
                        searchShowField: ['name'],
                        searchRstTh: ['名称'],
                        firstSelected: scope.orgDataAbout.rst.chinesePrescription,
                        firstSelectedTable: {
                            thead: [
                                { title: '剂数', dataBind: 'totalDose', type: 3, unit: '剂' },  // 1:纯文本; 2:纯select 3:input + 单位
                                { title: '每日剂量', dataBind: 'singleDose', type: 3, unit: '剂' },
                                { title: '用药频率', dataBind: 'freqId', type: 2, selectRange: scope.modelSelectKey[3].rst['freqs'] || ['暂无数据'] },
                                { title: '用法', dataBind: 'usagesId', type: 2, selectRange: scope.modelSelectKey[3].rst['usages'] || ['暂无数据'] },
                                { title: '煎法', dataBind: 'decoctionId', type: 2, selectRange: scope.modelSelectKey[3].rst['decoctions'] || ['暂无数据'] },
                                { title: 'ml/次 (煎)', dataBind: 'decoctingWater', type: 3, unit: 'ml' },
                                { title: 'ml/次 (服)', dataBind: 'takeWater', type: 3, unit: 'ml' }/*,
                                { title: '费用(元)', dataBind: 'price', type: 0 }*/
                            ]
                        },
                        secondSelected: 'chineseDrugs',
                        secondSelectedTable: {
                            thead: [
                                { title: '药品名称', dataBind: 'name', type: 0 },
                                { title: '数量', dataBind: 'totalDose', type: 3, unit: 'g' },
                                { title: '费用(元)', dataBind: 'price', type: 0 }
                            ]
                        }
                    },
                    // {
                    //     label: "手术",
                    //     searchType: 'oper',
                    //     isSpecific: false,
                    //     hasTab: false,
                    //     inlineSearch: true,
                    //     searchShowField: ['name'],
                    //     secondSelected: scope.orgDataAbout.rst.operations,
                    //     secondSelectedTable: {
                    //         thead: [
                    //             { title: '手术名称', dataBind: 'name', type: 0 }
                    //         ]
                    //     }
                    // },
                    // {
                    //     label: "处置",
                    //     searchType: 'disp',
                    //     isSpecific: false,
                    //     hasTab: false,
                    //     inlineSearch: true,
                    //     searchShowField: ['name'],
                    //     secondSelected: scope.orgDataAbout.rst.dispositions,
                    //     secondSelectedTable: {
                    //         thead: [
                    //             { title: '处置名称', dataBind: 'name', type: 0 }
                    //         ]
                    //     }
                    // }
                ]
            }

            /**
             * 数据请求失败后重新请求
             */
            scope.refetch = function() {
                fetchOrgData()
            }

            /**
             * 获取门诊处方区域数据
             */
            function fetchOrgData() {
                scope.orgDataState.state.changeState('fetch')             // 更改当前状态为 fetching
                var params = `?xlPatientId=${$routeParams.xlPatientId}&xlVisitId=${$routeParams.xlVisitId}`
                initSaveMark == 1?params = `${params}&init=${initSaveMark}`:'';
                return $http.get(`${SYS.prescriptUrl}prescribe${params}`).then(function(msg) {
                    if(msg.data.status == 'ok') {
                        initSaveMark++;
                        scope.orgDataState.state.changeState('success')
                        scope.orgDataAbout.rst = msg.data.data
                        scope.wholeInfo['prescription'] = scope.orgDataAbout.rst
                    } else {
                        scope.orgDataState.state.changeState('failure')
                        scope.orgDataAbout.rst = null
                    }
                }, function(error) {
                    scope.orgDataState.state.changeState('failure')
                    scope.orgDataAbout.rst = null
                })
            }

            /**
             * 初始化
             */
            ;(function() {
                // 1. 先请求已保存数据 2.请求每个模块 select 的范围
                fetchOrgData().then(function(data) {
                    var count = 0
                    scope.modelSelectKey.forEach(function(val, ind) {
                        $http.get(`${SYS.prescriptUrl}kno/${val.apiKey}`).then(function(msg) {
                            val.rst = msg.data.data
                            count++
                            if(count == scope.modelSelectKey.length) scope.setTempData() // 赋值给模板数据
                        })
                    })
                })

                // 弹出层设置事件监听
                $('.view-exam-model').on('hidden.bs.modal', function (e) {
                    scope.viewDetailState.state.changeState('refetch')     // 重置模态框数据请求状态的状态
                })
            })();


        }
    }
}]);

// 门诊处方单项已选内容表格
angular.module('infi-basic').directive('selectedCollect', ['SYS', '$http', 'Utils','RecordCollectService','$timeout','$routeParams','$q',
    function (SYS, $http, Utils,RecordCollectService,$timeout,$routeParams,$q) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/prescription.selected.html',
        scope: {
            tmpData: "=",
            viewExamDetail: '&',
            wholeInfo:'=',
            targetData:"=",
            workSpaceInfo:'='
        },
        link: function (scope,element,attrs) {

            /**
             * 删除表单条目
             * @param index 数据索引
             */
            scope.deleteItem = function(index, data) {
                data.splice(index, 1)
            }

            /**
             * 添加结果到已选择
             * @param rst 行数据
             */
            scope.addToSelected = function(rst, saveto, callback) {
                var has =false;
                saveto.forEach(function (n,i) {
                    n.kid == rst.kid?has = true:'';
                })
                if(has) return;
                saveto.push(rst)
                // 调用回调函数
                callback?callback():'';
            }

            scope.print = function (index,sign) {

                //  保存操作
                sign == 'exam'?(function () {

                    $q.all({
                        'saveBasicInfo': RecordCollectService.saveBasicInfo(scope.workSpaceInfo,scope.wholeInfo.basicInfo),
                        'saveAll': RecordCollectService.saveAll(scope.workSpaceInfo,scope.wholeInfo.templateData,scope.wholeInfo,undefined),
                        'savePrescript': RecordCollectService.savePrescript(scope.wholeInfo.prescription, {'xlPatientId': $routeParams.xlPatientId, 'xlVisitId': $routeParams.xlVisitId})
                    }).then(function(obj) {
                        //scope.targetData.pop();

                        scope.targetData = [];
                        $timeout(function () {
                            //scope.targetData.push(obj.savePrescript.data.exams[ obj.savePrescript.data.exams.length-1])
                            scope.targetData = obj.savePrescript.data.exams;
                            $http.get(SYS.prescriptUrl+'exam/request/form/'+scope.targetData[index].examNo).then(function (msg) {
                                !scope.wholeInfo.checkPrintData ?scope.wholeInfo.checkPrintData= [msg.data.data] :scope.wholeInfo.checkPrintData[0] = msg.data.data;
                                scope.wholeInfo.checkPrintData.push('');
                            })

                        },0,true)
                    }, function(error) {

                    })
                })():'';
            }
        }
    }
}]);

// 门诊处方单项已选内容表格 (tab 形式)
angular.module('infi-basic').directive('tabSelectedCollect',  [function () {
    return {
        restrict: 'ECMA',
        templateUrl: './html/tab.prescription.selected.html',
        scope: {
            tabLabels: "="
        },
        link: function (scope,element,attrs) {
            scope.tab = {
                currActiveInd: 0,
                changeInd: function(ind) {
                    this.currActiveInd = ind
                }
            }
        }
    }
}]);


//智能推荐右侧长条
angular.module('infi-basic').directive('rightInfoArea',  ['RecordCollectService', '$routeParams',function (RecordCollectService, $routeParams) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/right.area.html',
        scope: {
            wholeInfo:'=',
            workSpaceInfo:'='
        },
        link: function (scope,element,attrs) {
            // xlPatientId
            scope.xlId = $routeParams.xlPatientId
            scope.wholeInfo.templateData?scope.wholeInfo.templateData[7].data[0].childs.forEach(function (n,i) {
                scope.wholeInfo.diagnosisData.confirmed.forEach(function (ni,ii) {
                    ni.illn_id == n.kid ? ni['has'] = true:'';
                })
                scope.wholeInfo.diagnosisData.include.forEach(function (ni,ii) {
                    ni.illn_id == n.kid ? ni['has'] = true:'';
                })
            }):'';

            scope.topTab = {
                txt: [{label:'患者病情',icon:'glyphicon glyphicon-user'},{label:'智能推荐',icon:'glyphicon glyphicon-education'}],
                currActiveInd: 1
            }

            // 顶部 tab 切换
            scope.switchTab = function(ind) {
                scope.topTab.currActiveInd = ind
            }

            scope.change = function (opt) {
                opt['active']?opt['active'] = false:opt['active'] = true;
            };

            scope.chose = function (mark,opt) {
                opt.discribe = mark;
            };

            scope.addResult = function (opt) {
                opt['has'] = true;
                scope.wholeInfo.templateData[7].data[0].childs.push({
                    kid:opt.illn_id,
                    name:opt.label
                });
            };
            scope.modalPlanIntroduct = function (plan) {

                scope.workSpaceInfo.planId = plan.id;

                RecordCollectService.getPlanData(plan.id).then(function (msg) {
                    scope.wholeInfo.plan.introduct = msg.data;
                    for(var i=scope.wholeInfo.plan.introduct.length;i>0;i--){
                        if(!scope.wholeInfo.plan.introduct[i]){
                            scope.wholeInfo.plan.introduct.splice(i,1);
                        }
                    }
                    console.log(scope.wholeInfo.plan.introduct,'Introduct')
                });

                RecordCollectService.getPlanTarget(plan.id).then(function (msg) {
                    scope.wholeInfo.plan.target = msg.data
                    console.log(scope.wholeInfo.plan.target,'target')
                });

                var arr = ['guide','drug','disease']
                arr.forEach(function (n,i) {
                    RecordCollectService.getPage(n,plan.id).then(function (msg) {
                        scope.wholeInfo.plan[n] = msg.data
                        console.log(scope.wholeInfo.plan[n],n)
                    });
                })

                $('.plan').modal('show');
            }

        }
    }
}]);

//诊断结果
angular.module('infi-basic').directive('digResult',  ['RecordCollectService','$routeParams',function (RecordCollectService,$routeParams) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/dig.result.html',
        scope: {
            mainComplaintData:'=',
            workSpaceInfo:'=',
            wholeInfo:'='
        },
        link: function (scope,element,attrs) {
            console.log(scope.mainComplaintData,'dig.result');
            scope.routeParams = $routeParams;
            scope.chosedDig = [];

            scope.addDig = function(attr){
                var has;
                scope.chosedDig.forEach(function (n,i) {
                    n == attr.kid?has=i:''
                })

                !has?scope.chosedDig.push(attr.kid):scope.chosedDig.splice(has,1);
            }

            scope.delRemark = function (attrs) {
                attrs.remark = '';
                attrs['remarkShow'] = false;
            };

            scope.showRemark = function (attrs) {
                attrs['remarkShow'] = true;
            };

            scope.addAttr = function (attrs,title) {
                RecordCollectService.saveLeft(angular.copy(scope.workSpaceInfo),scope.wholeInfo);
                scope.workSpaceInfo.mark = 'attr';
                scope.workSpaceInfo.data = attrs;

                title?RecordCollectService.changeStatus(scope.wholeInfo.templateData,8):'';
            };

            scope.addQuestion = function (attrs,attr) {
                !attr.childs?RecordCollectService.addQuestion(attrs,attr,scope.workSpaceInfo):
                    RecordCollectService.addAttr(attrs,attr,scope.workSpaceInfo);
            };

            scope.delAttr = function (attrs,idx) {
                scope.wholeInfo.diagnosisData?(function () {
                    scope.wholeInfo.diagnosisData.confirmed.forEach(function (ni,ii) {
                        ni.illn_id == attrs.childs[idx].kid ? ni['has'] = false:'';
                    });
                    scope.wholeInfo.diagnosisData.include.forEach(function (ni,ii) {
                        ni.illn_id == attrs.childs[idx].kid ? ni['has'] = false:'';
                    });
                })():'';
                attrs.childs.splice(idx,1);
            };

            scope.ill = function () {
                console.log(scope.chosedDig)
                RecordCollectService.getIllModalData(scope.chosedDig).then(function (msg) {
                    msg.data.variableModules.forEach(function (n,i) {
                        n.variables.forEach(function (ni,ii) {
                            ni.type == 'switch' && ni.value?ni.switchChecked = 'checked':'';
                        })
                    })
                    scope.wholeInfo.illModalData = msg.data
                    console.log(scope.wholeInfo.illModalData,'illmodalData')
                    $('.ill').modal('show');
                })
            }
        }
    }
}]);

//治疗弹框
angular.module('infi-basic').directive('illModal',  ['RecordCollectService',function (RecordCollectService) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/ill.modal.html',
        scope: {
            wholeInfo:'=',
            workSpaceInfo:'='
        },
        link: function (scope,element,attrs) {



            scope.save = function () {
                $('.saveIllTip').modal('show');
                RecordCollectService.getIllData(scope.wholeInfo.illModalData).then(function (msg) {
                    scope.wholeInfo.illData = msg.data
                    console.log(scope.wholeInfo.illData,'illData')
                    $('.saveIllTip').modal('hide');
                    $('.ill').modal('hide');
                    setTimeout(function () {
                        var tag= $('.tarScroll')
                        $('.right-area').animate({scrollTop:
                            tag.offset().top-$('.right-area').offset().top+$('.right-area').scrollTop()-20},
                        800);
                    },0)
                })
            }

            scope.changeSwitch = function (opt) {
                !opt['switchChecked']?(opt.switchChecked = 'checked',opt.value='是'):(opt.switchChecked = false,opt.value=null);
            }

        }
    }
}]);

//方案介绍
angular.module('infi-basic').directive('planIntroduct',  ['RecordCollectService',function (RecordCollectService) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/plan.introduct.html',
        scope: {
            wholeInfo:'=',
            workSpaceInfo:'='
        },
        link: function (scope,element,attrs) {

            function init(planId) {
                RecordCollectService.getPlanData(planId).then(function (msg) {
                    scope.wholeInfo.plan.introduct = msg.data
                    for(var i=scope.wholeInfo.plan.introduct.length;i>0;i--){
                        if(!scope.wholeInfo.plan.introduct[i]){
                            scope.wholeInfo.plan.introduct.splice(i,1);
                        }
                    }
                    console.log(scope.wholeInfo.plan.introduct,'Introduct')
                });

                RecordCollectService.getPlanTarget(planId).then(function (msg) {
                    scope.wholeInfo.plan.target = msg.data
                    console.log(scope.wholeInfo.plan.target,'target')
                });

                var arr = ['guide','drug','disease']
                arr.forEach(function (n,i) {
                    RecordCollectService.getPage(n,planId).then(function (msg) {
                        scope.wholeInfo.plan[n] = msg.data
                        console.log(scope.wholeInfo.plan[n],n)
                    });
                })
            };

            scope.changeLeftTab = function(plan){
                init(plan.id);
                scope.workSpaceInfo.planId = plan.id;
            }

            scope.tagTab = '方案说明'

            scope.choseTab = function (str) {
                scope.tagTab = str
            }

            scope.scroll = function (opt,mark) {
                var tag;
                if($('#'+mark+'-'+opt.recom_id).length != 0){
                    tag = $('#'+mark+'-'+opt.recom_id)
                }else if(opt.scheme && opt.scheme[0] && $('#'+mark+'-'+opt.scheme[0].id).length!=0){
                    tag = $('#'+mark+'-'+opt.scheme[0].id)
                }else if($('#'+mark+'-'+opt.id).length != 0){
                    tag = $('#'+mark+'-'+opt.id)
                }
                if(!tag) return;
                $('.plan-introduction').animate({scrollTop:
                    tag.offset().top-$('.plan-introduction').offset().top+$('.plan-introduction').scrollTop()},
                800);
            }
        }
    }
}]);

//异常视图
angular.module('infi-basic').directive('patiProfile', ['SYS', '$http', function (SYS, $http) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/pati-profile.directive.html',
        scope: {
            patiId:'='
        },
        link: function (scope,element,attrs) {
            scope.hasData = 'init'          // 是否获取到异常视图渲染数据

            var GetData = function(patiId) {
                this.param = {
                    xlPatientId: patiId
                }
            }

            GetData.prototype = {
                getOrgData: function() {
                    var sendParam = {
                        patient_id: this.param.xlPatientId
                    };

                    return $http.post(SYS.abnormalUrl + `view/data`, sendParam).then(
                        function(msg) {
                            if(msg.data.status == 'ok') {
                                return {
                                    data: JSON.parse(msg.data.data),
                                    status: 'ok'
                                }
                            } else {
                                return {
                                    status: "error",
                                };
                            }
                        },
                        function(error) {
                            return {
                                status: "error",
                            };
                        }
                    );
                }
            }



            ;(function init() {
                var getDataObj = new GetData(scope.patiId)

                getDataObj.getOrgData().then(function(flatData) {
                    if(flatData.status == 'ok') {
                        scope.hasData = true
                        scope.flatOrgData = flatData.data

                    } else {
                        scope.hasData = false
                    }
                }, function(error) {
                    scope.hasData = false
                })
            })()
        }
    }
}]);


//star
angular.module('infi-basic').directive('star', ['SYS', '$http', function (SYS, $http) {
    return {
        restrict: 'ECMA',
        template: '<span ng-repeat="opt in arr" class="glyphicon glyphicon-star orange" aria-hidden="true"></span>',
        scope: {
            des:'='
        },
        link: function (scope,element,attrs) {
            scope.arr = [];
            for(var i = 0;i<scope.des.desc;i++){
                scope.arr.push(i);
            }
        }
    }
}]);

//打印
angular.module('infi-basic').directive('printArea', ['SYS', '$http','RecordCollectService','$timeout', function (SYS, $http,RecordCollectService,$timeout) {
    return {
        restrict: 'ECMA',
        templateUrl: './html/print.html',
        scope: {
            wholeInfo:'=',
            workSpaceInfo:'='
        },
        link: function (scope,element,attrs) {

        }
    }
}]);

angular.module('infi-basic').directive('randerOver', ['SYS', '$http','RecordCollectService','$timeout', function (SYS, $http,RecordCollectService,$timeout) {
    return {
        restrict: 'ECMA',
        link: function (scope,element,attrs) {
            scope.$last && !scope.opt?$timeout(function () {
                RecordCollectService.bindPrint()
            },10):'';
        }
    }
}]);
