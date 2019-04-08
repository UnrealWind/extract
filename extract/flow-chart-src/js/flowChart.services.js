angular.module('infi-basic').service('FlowChartServices', ['$http', 'SYS',
 function ($http, SYS) {

    this.getBasicData = function () {
        return $http({
            url:SYS.url+'dragDatas',
            data:'',
            params:''
        }).then(function (msg) {
            (function fixData(arr) {
                arr.forEach(function (n,i) {
                    n.active = false;
                    n.group = "nodes";
                    n.data = { id: new Date().getTime() ,label:n.label};
                    n.classes = "fce-shape-rectangle";
                    n.type = "single";

                    n.classifyNodes ?fixData(n.classifyNodes):'';
                    n.valueNodes ?fixData(n.valueNodes):'';
                    n.relateNodes ?fixData(n.relateNodes):'';
                    n.attributeNodes ?fixData(n.attributeNodes):'';
                })
            })(msg.data.data);

            return msg.data
        })
    }

     this.getGroups = function () {
         return $http({
             url:SYS.url+'dragData',
             data:'',
             params:''
         }).then(function (msg) {
             return msg.data
         })
     }

    this.DropSortData = function ($event) {

        var data = JSON.parse($event.dataTransfer.getData("text"));

        if(data.type){
            data.data.id=randomChar(13);
            data.position = {
                x:$event.offsetX,
                y:$event.offsetY
            };
            fce.add(data);
            console.log($event)
            return;
        }

        var SortData = [];
        data.data.elements.nodes.forEach(function (n,i) {
            n.position?SortData.push(n):undefined;
        });

        //快速排序算法
        var quickSort = function(arr,target) {
            if (arr.length <= 1) { return arr; }
            var pivotIndex = Math.floor(arr.length / 2);
            var pivot = arr.splice(pivotIndex, 1)[0];
            var left = [];
            var right = [];
            for (var i = 0; i < arr.length; i++){
                if (arr[i].position[target] < pivot.position[target]) {
                    left.push(arr[i]);
                } else {
                    right.push(arr[i]);
                }
            }
            return quickSort(left,target).concat([pivot], quickSort(right,target));
        };
        var x = quickSort(angular.copy(SortData),'x');
        var y = quickSort(angular.copy(SortData),'y');

        //这里相当于拿到了中心点
        var midx = (x[0].position.x+x[x.length-1].position.x)/2;
        var midy = (y[0].position.y+y[y.length-1].position.y)/2;

        //这个是鼠标放入的位置，也就是放入数据后生成图像的中心点
        var originx = $event.offsetX;
        var originy = $event.offsetY;

        //生成要整体偏移的x，y
        var positionx = originx-midx;
        var positiony = originy-midy;

        data.data.elements.nodes.forEach(function (n,i) {
            n.position?(n.position.x +=positionx,n.position.y += positiony ):undefined;
        });


        function  randomChar(l) {
            var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
            var tmp = "";
            var timestamp = new Date().getTime();
            for (var i = 0; i < l; i++) {
                tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length);
            }
            return timestamp + tmp;
        }

        function resetId(arr1,arr2) {
            var obj = {};
            arr1.concat(arr2).forEach(function (n,i) {
                obj[n.data.id] = randomChar(13);
            });

            arr1.concat(arr2).forEach(function (n,i) {
                n.data.id = obj[n.data.id];
                n.data.parent?n.data.parent = obj[n.data.parent]:undefined;
                n.data.source?(n.data.source =obj[n.data.source],n.data.target =obj[n.data.target]):undefined;
            });
            return arr1.concat(arr2);
        }
        fce.add(resetId(data.data.elements.nodes,data.data.elements.edges));

    }

}]);
