angular.module("infi-basic").controller('MindController',['$scope','SYS','$routeParams',function ($scope,SYS,$routeParams) {
    $scope.mindType = 'inPatient';
    $scope.child = {  //特殊属性值属性查看导图需要这些数据
        id:$routeParams.id,
        name:$routeParams.name,
        tableName:$routeParams.tableName
    }

    $scope.getMindData = function () {
        $("#mindChart").text("");  //将盛放图形的div清空,否则图形选择不同类型图形会重复
        drawChart();
    };
    
    function init() {
        //标示三角形,圆形,正方形代表的意义
        var svg = d3.select('#chartDemo').append("svg").style("height","30px");
        svg.append('rect').attr("x", "2").attr("y", "1").style({"width":"15","height":"15"});
        svg.append('text').text("分类").attr("x", "25").attr("y", "14");
        svg.append('polygon').attr("points", "70,0 60,15 79,15");
        svg.append('text').text("属性").attr("x", "90").attr("y", "14");
        svg.append('circle').attr('r','8').attr("cx","135").attr("cy","10");
        svg.append('text').text("属性值").attr("x", "150").attr("y", "14");
        $scope.getMindData();
    }
    
    init();

    /**
     * 用svg开始绘图
     * @param data
     */
    function drawChart(data) {
        // var users = Session.getUser();
        //整个导图链接:mind/show?used="inPatient".  used区分是住院还是门诊
        //特殊属性值属性查看导图:mind/showChildMind?id=12&name=GGG&tableName=DDD
        var url = $scope.child.id ? 'mind/showChildMind?id='+$scope.child.id+'&name='+$scope.child.name+'&tableName='+$scope.child.tableName
            :"mind/show?used="+$scope.mindType;

        //调取数据进行绘图
        d3.json(SYS.url + url, function ( error,root) {
            if(root.status == 'ok'){  //成功返回数据则绘图
                var xyIndex = setXYIndex(root.data),
                    xInterval = 200,  //设置左右圆圈之间的距离
                    yInterval = 25;  //设置上下圆圈的大小
                var width = xyIndex.xChilds * xInterval + 200,  //动态设置屏幕的宽度
                    height = xyIndex.yChilds * yInterval;  //动态设置图形的高度
                var toolTip = d3.select("#toolTipContainer");

                //边界空白
                var padding = {left: 100, right: 0, top: 0, bottom: 0};
                var svg = d3.select("#mindChart")
                    .append("svg")
                    .attr("width", width + padding.left + padding.right)
                    .attr("height", height + padding.top + padding.bottom)
                    .append("g").attr("transform", "translate(" + padding.left + "," + padding.top + ")");
                //树状图布局
                var tree = d3.layout.tree().size([height, width]);
                //对角线生成器
                var diagonal = d3.svg.diagonal()
                    .projection(function (d) {
                        return [d.y, d.x];
                    });

                //给第一个节点添加初始坐标x0和x1
                root.x0 = height / 2;
                root.y0 = 0;

                //以第一个节点为起始节点，重绘
                redraw(root);
            }else{  //否则给出提示
                $("#mindChart").text('未查询到数据');
            }

            //重绘函数
            function redraw(source) {
                //（1)计算节点和连线的位置
                //应用布局，计算节点和连线
                var nodes = tree.nodes(root.data);  //将最内部的数据放入nodes中,返回节点数组
                var links = tree.links(nodes);  //返回连线数组

                //重新计算节点的y坐标
                nodes.forEach(function (d) {
                    d.y = d.depth * xInterval;  //depth为节点的层级,同一层级的y相同,YInterval为两个相邻层级之间的间隔
                });

                //（2）节点的处理
                //获取节点的update部分
                var nodeUpdate = svg.selectAll(".node")
                    .data(nodes, function (d) {
                        return d.name;
                    });

                //获取节点的enter部分
                var nodeEnter = nodeUpdate.enter();

                //获取节点的exit部分
                var nodeExit = nodeUpdate.exit();
                //1. 节点的 Enter 部分的处理办法,本人感觉是将所有节点设置到初始节点位置
                var enterNodes = nodeEnter.append("g")
                    .attr('class',function (d) {
                        //通过数据中不同的type值生成不同形状的图形,数据中不同的valueType值显示不同的颜色
                        var valueType = d.valueType?d.valueType:'noValue',
                            nodeClass = d.type+' '+valueType+' node',
                            pointer = d.children || d.tableName ? " pointer" : "";
                        return nodeClass+pointer;  //有子集的图形才会出现小手形状,才是可点击的
                    })
                    .attr("transform", function (d) {
                        return "translate(" + source.y0 + "," + source.x0 + ")";
                    })
                    .on("click", function (d) {  //给添加的节点绑定click事件
                        if(d.children||d._children){  //有子集的点击展开或者收起子集
                            toggle(d);  //开关切换,控制子节点的显示与不显示
                            redraw(d);  //切换后重新绘图
                        }else if(d.tableName){  //需要展示属性值或者特殊属性值的,打开新页面展示列表
                            if(d.flag){  //flag存在则跳转到主程序的页面
                                window.open(SYS.parentUrl+SYS.PARENT_HREF[d.flag],'_parent')
                            }else{
                                //特殊属性值属性查看导图再次进入属性值或者特殊属性值属性列表,要传入此属性的id
                                var url = $scope.child.id ? d.id+'/': "";
                                // window.open('#mind-detail/'+url+d.key+'/'+d.tableName,'_parent');
                                window.location.href = '#mind-detail/'+url+d.key+'/'+d.tableName;
                            }
                        }
                    })
                    .on("mouseenter", function (d) {  //给添加的节点绑定悬浮事件,显示描述
                        if(d.characterization){
                            toolTip.select('#toolTip').text(d.characterization);
                            toolTip.transition()
                                .duration(200)
                                .style({"display":"inline-block","left":(d3.event.pageX-10)+"px","top":(d3.event.pageY+15)+"px"});
                        }
                    })
                    .on("mouseleave", function (d) {  //解除悬浮事件
                        toolTip.transition().duration(200).style("display", "none");
                    });

                //给带有不同class的g分别添加初始化的图形
                svg.selectAll(".category").append("rect")
                    .attr("width","0").attr("height","0")
                    .style("fill", function (d) {
                        return d._children ? "lightsteelblue" : "#fff";
                    });
                svg.selectAll(".tag").append("polygon")
                    .attr({"points":"0,0 0,0 0,0"})
                    .style("fill", function (d) {
                        return d._children ? "lightsteelblue" : "#fff";
                    });
                svg.selectAll(".value").append("circle")
                    .attr("r", 0)
                    .style("fill", function (d) {
                        return d._children ? "lightsteelblue" : "#fff";
                    });

                enterNodes.append("text")
                    .attr("x", function (d) {
                        return d.children || d._children ? -14 : 14;  //有子元素,将文字放到小圆圈的左面
                    })
                    .attr("dy", ".35em").style({"fill-opacity":0})
                    .attr("text-anchor", function (d) {
                        return d.children || d._children ? "end" : "start";
                    })
                    .text(function (d) {
                        return d.name;
                    });

                //2. 节点的 Update 部分的处理办法,本人认为是将其他节点按照自己的x,y坐标向外延伸
                var updateNodes = nodeUpdate.transition()
                    .duration(500)
                    .attr("transform", function (d) {
                        return "translate(" + d.y + "," + d.x + ")";
                    });

                //更新时给各个图形设置正确的长宽等,目的是点击图形收起\展开时看着比较流畅
                updateNodes.select("circle")
                    .attr("r", 8)
                    .style("fill", function (d) {
                        return d._children ? "lightsteelblue" : "#fff";
                    });
                updateNodes.select("rect")
                    .attr("width","15").attr("height","15")
                    .style("fill", function (d) {
                        return d._children ? "lightsteelblue" : "#fff";
                    });
                updateNodes.select("polygon")
                    .attr("points", "0,-8 -10,7 9,7")
                    .style("fill", function (d) {
                        return d._children ? "lightsteelblue" : "#fff";
                    });
                updateNodes.select("text").style("fill-opacity", 1);

                //3. 节点的 Exit 部分的处理办法,本人认为需要删除的节点的位置缓缓过渡到其父节点处,变成全透明
                var exitNodes = nodeExit.transition()
                    .duration(500)
                    .attr("transform", function (d) {
                        return "translate(" + source.y + "," + source.x + ")";
                    })
                    .remove();

                //给不显示的节点长\宽等设置为0
                exitNodes.select("circle").attr("r", 0);  //变成全透明
                exitNodes.select("rect").attr("width","0").attr("height","0");  //变成全透明
                exitNodes.select("polygon").attr("points", "0,0 0,0 0,0");  //变成全透明
                exitNodes.select("text").style("fill-opacity", 0);  //变成全透明

                //（3）连线的处理
                //获取连线的update部分
                var linkUpdate = svg.selectAll(".link")
                    .data(links, function (d) {
                        return d.target.name;
                    });

                //获取连线的enter部分
                var linkEnter = linkUpdate.enter();

                //获取连线的exit部分
                var linkExit = linkUpdate.exit();

                //1. 连线的 Enter 部分的处理办法
                linkEnter.insert("path", ".node")
                    .attr("class", function (d) {
                        //给可点击的属性值和特殊属性值的属性前面的线添加其他颜色
                        var className = d.target.tableName? "linkColor link" : "link";
                        return className;
                    })
                    .attr("d", function (d) {
                        var o = {x: source.x0, y: source.y0};
                        return diagonal({source: o, target: o});
                    })
                    .transition().duration(500).attr("d", diagonal);

                //2. 连线的 Update 部分的处理办法
                linkUpdate.transition().duration(500).attr("d", diagonal);

                //3. 连线的 Exit 部分的处理办法,令其缓缓过渡到当前的source点，再移除
                linkExit.transition()
                    .duration(500)
                    .attr("d", function (d) {
                        var o = {x: source.x, y: source.y};
                        return diagonal({source: o, target: o});
                    })
                    .remove();

                //（4）将当前的节点坐标保存在变量x0、y0里，以备更新时使用
                nodes.forEach(function (d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });
            }

            //切换开关，d 为被点击的节点
            function toggle(d) {
                if (d.children) { //如果有子节点
                    d._children = d.children; //将该子节点保存到 _children,显示子节点时可以获取到数据
                    d.children = null;  //将子节点设置为null
                } else {  //如果没有子节点
                    d.children = d._children; //从 _children 取回原来的子节点 
                    d._children = null; //将 _children 设置为 null
                }
            }
        });
    }

    /**
     * 获取绘图所需y轴方向上最底层子集之和与x轴方向上最大的子集层级
     * @param data
     * @returns {number}
     */
    function setXYIndex(data) {
        var xyIndex = {
                yChilds:0,  //y轴方向上最底层子集之和
                xChilds : 0  //x轴方向上最大的子集层级
            },
            xIndex = 0,
            mapping = {};  //由于循环到最底层,防止数据个数重复
        findChildren(data,xIndex);

        function findChildren(entity,index) {
            //resourceTableName存在,可点击查看属性值列表
            //specialResourceTableName存在,可点击查看特殊属性值的属性
            if(entity.resourceTableName||entity.specialResourceTableName){
                entity.children = entity.children ? entity.children : [];
                entity.specialResourceTableName?entity.children.unshift(
                    {
                        id:entity.value,  //特殊属性值属性查看导图点击进入属性值列表,需要的id
                        name:"特殊属性值的属性",  //用于页面显示
                        tableName:entity.specialResourceTableName,  //用于向下传递,获得列表
                        key:"special"  //标示是属性值列表还是特殊属性值属性列表
                    }):undefined;
                entity.resourceTableName?entity.children.unshift(
                    {id:entity.value,name:"属性值",tableName:entity.resourceTableName,key:"resource",
                        flag:entity.flag  //用于标识是否跳转到主程序的详情列表页
                    }):undefined;
            }
            setOnlyName(entity);
            if(entity.children){
                xIndex = ++index;
                angular.forEach(entity.children,function (child) {
                    findChildren(child,index)
                })
            }else{
                xyIndex.xChilds = xIndex > xyIndex.xChilds ? xIndex : xyIndex.xChilds;
                xIndex = 0;
                xyIndex.yChilds++;
            }
        }

        //相同name的加一个空格,防止相同name在页面显示不好
        function setOnlyName(names) {
            if(mapping[names.name]){
                var n = ++mapping[names.name];
                for(var i = 1;i<n;i++){
                    names.name += " ";
                }
            }else{
                mapping[names.name] = 1;
            }
        }
        return xyIndex;
    }
}]);