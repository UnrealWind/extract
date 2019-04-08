angular.module('infi-basic')
    .controller('RuleSaveController', ['$scope','SYS','$routeParams','Utils','$location','TaskService','$timeout',function ($scope,SYS,$routeParams,Utils,$location,TaskService,$timeout) {
        $scope.SYS = SYS;
        $scope.ruleId = $routeParams.groupId;
        $scope.recordData = null;
        // $scope.selectedSect = "in";  //标示内外科的选中情况
        $scope.dept = {  //科室数据
            mapping:{},  //选中的科室匹配函数
            range:[]   //选中的数据
        }

        $scope.showHide = {
            winToggle: false
        }

        $scope.showChild = function(room) {
            room['show'] = room['show'] ? false : true;
        }

        
        $scope.allRD = {}       // 所有的医生和科室，原始数据用于展示

        $scope.sendAllRD = {
            sendArray: [],
            sendObj: {},
            feedBackObj: []    // 传回后台的数据格式
        }   

        function init() {
            //获取所有科室
            // TaskService.getAllDept().then(function (msg) {
            //     if(msg.status == SYS.STATUS_SUCCESS){
            //         msg.$data = {};
            //         msg.$data.interSect = [];
            //         msg.$data.surgerySect = [];
            //         transformSect(msg.data.interSect,msg.$data.interSect);
            //         transformSect(msg.data.surgerySect,msg.$data.surgerySect)
            //     }
            //     $scope.deptList = msg;  //科室列表
            // });
            // TaskService.getSerachData('sect-search.json').then(function (msg) {
            //     //给科室排序
            //     if(msg&&msg.data){
            //         msg.data.content.sort(function (a,b) {
            //             var aList = a.split('|'),
            //                 bList = b.split('|');
            //             return aList[2] > bList[2]?1 : aList[2] < bList[2]?-1:0;  //返回数值,sort自动排序
            //         })
            //         $scope.cityData = msg;  //科室列表
            //     }
            // });

            // 获取科室和医生原始信息
            TaskService.getAllDR('rule/doctor/tree').then(function(msg) {
                if(msg.status == $scope.SYS.STATUS_SUCCESS){
                    $scope.allRD = msg.data
                } else {
                    Utils.sysTip($scope,msg);
                }
            })

            // TaskService.getSerachData('doctor-tree.json').then(function (msg) {
            //     $scope.allRD = msg.data.sect
            // });

            // 选择医生
            $scope.selectDoctor = function(room, doctor){
                $scope.sendAllRD = TaskService.selectDoctor(room, doctor, $scope.sendAllRD)
            }
            // 删除医生
            $scope.deleteObj = function(obj){
                delete $scope.sendAllRD.sendObj[obj]
                $scope.sendAllRD.sendArray.splice($scope.sendAllRD.sendArray.indexOf(obj), 1)
            }
            
            function transformSect(original,dect) {
                angular.forEach(original,function (dept) {
                    dect.push({name:dept});
                });
            }
        }
        
        init();

        /**
         * directive获取的保存数据,需要将directive反向传回controller
         */
        $scope.$on('setDatas',function (event,datas) {
            $scope.recordData = datas;
        });

        /**
         * 保存规则
         */
        $scope.saveRule = function () {
            // var depts = [];
            // if($scope.deptList.status == SYS.STATUS_SUCCESS){
            //     submitSect($scope.deptList.$data.interSect,depts);
            //     submitSect($scope.deptList.$data.surgerySect,depts);
            // }

            // 拼接返回给后台的数据格式
            angular.forEach($scope.sendAllRD.sendObj, function(value, key) {
                $scope.sendAllRD.feedBackObj.push($scope.sendAllRD.sendObj[key])
            })

            TaskService.creatRule({
                id:$scope.ruleId,
                name:$scope.taskName,
                remark:$scope.taskRemark,
                recommendDoctor: $scope.sendAllRD.feedBackObj
                // recommendSector:$scope.dept.range.length == 0 ? "" : $scope.dept.range.length == 1 ? $scope.dept.range[0]: $scope.dept.range.join(',')
            }).then(function (msg) {
                if(msg.status == $scope.SYS.STATUS_SUCCESS){
                    var tip = {
                        status:$scope.SYS.STATUS_SUCCESS,
                        description:"规则保存成功"
                    }
                    Utils.sysTip($scope,tip);
                    $timeout(function () {
                        $('#exportBox').modal('hide');
                        //必须设置延时，没有延时模态框外面的灰色背景去不掉
                        $timeout(function (){
                            $location.path("rule-list");
                        },500)
                    },1000);
                }else{
                    Utils.sysTip($scope,msg); //数据没有导出成功后的提示
                }
            })
        }
        //推荐科室内外科选中保存
        function submitSect(original,depts) {
            angular.forEach(original,function (dept) {
                dept.$checked ? depts.push(dept.name) : undefined;
            });
        }
        
        $scope.showSept = function (type) {
            // $scope.selectedSect = type;
        }

        /**
         * 展示选择的科室
         * @param sect
         */
        $scope.selectedSect = function (sect) {
            $("#sectSelect").val('');  //选中科室后将科室框清空
            if(!$scope.dept.mapping[sect]){
                $scope.dept.range.push(sect);
                $scope.dept.mapping[sect] = sect;
            }
            $scope.$apply();  //涉及到javascript,必须重绘页面
        }

        /**
         * 删除选择的科室
         * @param sect
         */
        $scope.removeSect = function (sect) {
            angular.forEach($scope.dept.range,function (range,index) {
                if(range == sect){
                    $scope.dept.range.splice(index,1);
                }
            })
            delete $scope.dept.mapping[sect];
        }

        /**
         * 控制页面切换header的显示效果
         * @type {number}
         */
        $scope.step = 3;
    }])