angular.module('infi-basic').service("ViewMapping",['$http','SYS','DataService',function ($http,SYS,DataService){
    /**
     * 机构列表中类型的转换
     * @param data
     */
    // this.matchMechanismType = function (original) {
    //     if(original.page&&original.page.content){
    //         angular.forEach(original.page.content,function (entity) {
    //             entity.type = entity.type == 1 ? "医院" :entity.type == 2 ? "科室":"病区";
    //         })
    //     }
    // }

    /**
     * 设置机构中‘新建’提交的内容
     */
    // this.setMechanismSubmit = function (viewDetail,hospital,department,area) {
    //     var submitData = {};
    //     if(viewDetail.id){
    //
    //     }else{
    //         var areas = {
    //             name : area.$name,
    //             code : "",
    //             parent:{
    //                 id:department.id?department.id:""
    //             },
    //             type:3
    //         },departments = {
    //             name : department.$name,
    //             code : "",
    //             parent:{
    //                 id:hospital.id?hospital.id:""
    //             },
    //             type:2
    //         },hospitals = {
    //             name : hospital.$name,
    //             code : "",
    //             parent:{
    //                 id:""
    //             },
    //             type:1
    //         };
    //
    //         if(department.name != department.$name){
    //             departments.childList = [];
    //             departments.childList.push(areas);
    //         }else{
    //             departments = areas;
    //         }
    //         if(hospital.name != hospital.$name){
    //             hospitals.childList = [];
    //             hospitals.childList.push(departments);
    //         }else{
    //             hospitals = departments;
    //         }
    //         submitData = hospitals;
    //     }
    //     return submitData;
    // }

    /**
     * 菜单列表用的source接口，将数据整理成扁平的提供表格显示
     * @param original
     * @returns {Array}
     */
    this.matchMenuList = function (original) {
        var menuList=[];
        angular.forEach(original.menus,function (first) {
            menuList.push(first);
            angular.forEach(first.menus,function (second) {
                menuList.push(second);
                angular.forEach((second.second,function (third) {
                    menuList.push(third);
                    angular.forEach(third.menus,function (force) {
                        menuList.push(force);
                    });
                }));
            });
        });
        return menuList;
    }

    /**
     * 设置复选框在修改时匹配选中
     * @param list  全部复选框选项
     * @param original  需要选中的复选框
     */
    this.getChangedListChecked = function (list,original) {
        //当全部复选框选项与需要选中的复选框选项两者都从后台调取成功后才进行匹配
        if(list&&original&&original.length>0&&list.length>0){
            angular.forEach(original,function (entity) {
                angular.forEach(list,function (menu) {
                    if(entity == menu.id){
                        menu.$checked = true;
                    }
                });
            });
            original.forEach(function (n,i) {
                (function fix(arr) {
                    arr.forEach(function (ni,yi) {
                        n == ni.id?ni['__ivhTreeviewExpanded'] = true:undefined;
                        n == ni.id && ni.children == null?ni['selected'] = true:undefined;
                        ni.children?(fix(ni.children)):undefined;
                    });
                })(list);
            });
        }
    }

    this.getMenuChanges = function (list,original) {
        //当全部复选框选项与需要选中的复选框选项两者都从后台调取成功后才进行匹配
        if(list&&original&&original.length>0&&list.length>0){
            original.forEach(function (n,i) {
                (function fix(arr) {
                    arr.forEach(function (ni,yi) {
                        n == ni.id?ni['__ivhTreeviewExpanded'] = true:undefined;
                        n == ni.id && ni.children == null?ni['selected'] = true:undefined;
                        ni.children?(fix(ni.children)):undefined;
                    });
                })(list);
            });
        }
    }
    /**
     * 将复选框选中的值加入到传递到后台的list中
     * @param list  所有复选框数据
     * @param container  盛放选中数据的list
     */
    this.getSubmitCheckedList = function (list) {
        var selectedMenu = [];
        angular.forEach(list,function (menu) {
            if(menu.$checked){
                selectedMenu.push(menu.id);   //此处角色选中有修改,注意其他的
            }
        });
        return selectedMenu;
    }

    this.getMenuSubmit = function (list) {
        var selectedMenu = [];
        (function getData(arr) {
            arr.forEach(function (n,i) {
                n.selected || n.__ivhTreeviewIndeterminate ? selectedMenu.push(n.id):undefined;
                n.children?getData(n.children):undefined;
            })
        })(list);
        return selectedMenu;
    }

    /**
     * 用户列表中显示的字段没有在主层级，整理到主层级中供使用
     * @param original
     */
    this.matchSpecialList = function (original,list) {
        if(original.page&&original.page.content){
            angular.forEach(original.page.content,function (entity) {
                angular.forEach(list,function (child) {
                    entity[child.label] ? entity[child.label+'Name'] = entity[child.label].name : undefined;
                })
            });
        }
    }

    /**
     * 保存成功后将选中的复选框置为不选中
     * @param original
     */
    this.setCheckedListEmpty = function (original) {
        angular.forEach(original,function (entity) {
            if(entity.$checked){
                entity.$checked = false;
            }
        });
    }

    /**
     * 刚刚进入修改页面,原先选的下拉框内容现在不存在了,此时将获取的特定的下拉框数据置空
     * @param list  下拉框数据
     * @param original  选中的数据
     * @param name  标示是机构或者子机构等
     */
    this.checkSelected = function (list,original,name) {
        if(list&&original[name].id&&original[name].id!=""){
            if(list.status == SYS.STATUS_SUCCESS){
                if(list.data&&list.data.length>0){
                    var hasValue = 0;
                    angular.forEach(list.data,function (data) {
                        if(original[name]&&original[name].id){
                            original[name].id == data.id ? hasValue=1 : undefined;
                        }
                    });
                    hasValue == 0 ? original[name]="" : undefined;
                }else if(list.data&&list.data.length==0){
                    original[name].id="";
                }
            }
        }
    }

    /**
     * 预览时有子集的属性显示箭头图标
     * @param original
     */
    this.viewShow = function (original) {
        function ergodicData(original) {
            angular.forEach(original,function (ori) {
                if(ori.children&&ori.children.length>0){
                    ori.$show=false;
                    ergodicData(ori.children);
                }
            });
        }
        ergodicData(original);
    }

    /**
     * 修改角色和用户是,匹配选择的机构
     * @param id
     * @param original
     */
    this.matchOffice = function (id,original) {
        var name = "";
        if(original&&id){
            function match(entity) {
                angular.forEach(entity,function (ori) {
                    if(ori.id==id){
                        name = ori.name;
                    }
                    if(ori.children){
                        match(ori.children);
                    }
                });
            }
            match(original.data);
        }
        return name;
    }
}]);