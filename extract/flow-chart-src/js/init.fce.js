var fce = new FCE({
    el: document.getElementById('flowCharts'),
    rightMenus: [{
        id: "id_alert",
        content: "弹出窗",
        tooltipText: "弹出窗",
        selector: "node,edge",
        //当在node,edge元素上右键时才显示
        onClickFunction: function(evt) { //点击后触发事件
            var target = evt.target || evt.cyTarget;
            alert('弹出信息！');
        },
        hasTrailingDivider: true
    }],
    toolbars: [
        {
            name: 'rectangle',
            icon: '/src/image/flow-chart/rectangle.png',
            className: '',
            title: '矩形',
            exec: function(evt, clickType, obj) {
                //const label = '';
                //tip('请输入分组名称');
                const label = prompt('请输入分组名称：');

                var parentId = new Date().getTime();
                const data = [
                    { group: "nodes", data: { id: parentId ,"label": label}, position: { x: evt.position.x, y: evt.position.y } },
                    { group: "nodes", data: { id: parentId+1 , parent:parentId}, position: { x: evt.position.x-100, y: evt.position.y-100 } ,classes:'fce-shape-rectangle' },
                    { group: "nodes", data: { id: parentId+2 , parent:parentId}, position: { x: evt.position.x+100, y: evt.position.y+100 },classes:'fce-shape-polygon'  }
                ];
                if (!label) return;
                if (clickType === 'node') {
                    data.parent = obj.id;
                }
                this.add(data);

                this.cy.style()
                    .selector('node.fce-shape-polygon')
                    .style({
                        'background-image': '/src/image/background-img-input.jpg'
                    })
                    .update();

                this.cy.style()
                    .selector('node.fce-shape-rectangle')
                    .style({
                        'background-image': '/src/image/background-img-input.jpg'
                    })
                    .update();

            }
        },
        {
            name: 'rounded_rectangle',
            icon: '/src/image/flow-chart/rounded_rectangle.png',
            className: '',
            title: '圆角矩形',
            exec: function(evt, clickType, obj) {
                const label = prompt('请输入节点名称：'),
                    data = {
                        id: new Date().getTime(),
                        label: label
                    };
                if (!label) return;
                if (clickType === 'node') {
                    data.parent = obj.id;
                }
                this.addNode(data, 'roundrectangle');
            },
        },
        {
            name: 'choice',
            icon: '/src/image/flow-chart/choice.png',
            className: '',
            title: '菱形',
            exec: function(evt, clickType, obj) {
                const label = prompt('请输入节点名称：'),
                    data = {
                        id: new Date().getTime(),
                        label: label
                    };
                if (!label) return;
                if (clickType === 'node') {
                    data.parent = obj.id;
                }
                this.addNode(data, 'diamond');
            },
        },
        {
            name: 'round',
            icon: '/src/image/flow-chart/round.png',
            className: '',
            title: '圆形',
            exec: function(evt, clickType, obj) {
                const label = prompt('请输入节点名称：'),
                    data = {
                        id: new Date().getTime(),
                        label: label
                    };
                if (!label) return;
                if (clickType === 'node') {
                    data.parent = obj.id;
                }
                this.addNode(data, 'ellipse');
            },
        },
        {
            name: 'download-json',
            icon: '/src/image/flow-chart/download.png',
            className: '',
            title: '下载json文件',
            click: function(bar) {
                this.exportFile('json', '导出JSON文件');
                bar.cancelActive(); //取消自身选中
            },
        },
        {
            name: 'download-png',
            icon: '/src/image/flow-chart/download.png',
            className: '',
            title: '下载png文件',
            click: function(bar) {
                this.exportFile('png');
                bar.cancelActive(); //取消自身选中
            },
        },
        {
            name: 'download-jpg',
            icon: '/src/image/flow-chart/download.png',
            className: '',
            title: '下载jpg文件',
            click: function(bar) {
                this.exportFile('jpg');
                bar.cancelActive(); //取消自身选中
            },
        },

        {
            name: 'import',
            icon: '/src/image/flow-chart/import.png',
            className: '',
            title: '导入JSON文件',
            click: function(bar) {
                bar.cancelActive(); //取消自身选中
                var file = document.createElement('input'),
                    self = this;
                file.setAttribute('type', 'file');
                file.onchange = function(evt) {
                    var target = evt.target;
                    if (target.files && target.files.length) {
                        var fileInfo = target.files[0],
                            name = fileInfo.name;
                        if (!name.toLowerCase().endsWith('.json')) {
                            alert('上传文件类型不符合要求！');
                        } else {
                            var reader = new FileReader();
                            reader.onload = function(evt) {
                                var json = JSON.parse(evt.target.result.toString());
                                self.import(json);
                            };
                            reader.readAsText(fileInfo);
                        }
                    }
                };
                file.click();
                // this.import(json);
                // bar.cancelActive(); //取消自身选中
            },
        },
        'animation', ],
});
fce.addListener('add_click',
    function() {
        console.log('编辑器被点击！');
    });
fce.addListener('context_menus_rename',
    function(evt, clickType, data) {
        const label = prompt('请输入节点新名称：', data.label);
        if (label) {
            data.label = label;
            this.rename(data);
        }
    });
fce.addListener('context_menus_remove',
    function(evt, clickType, data) {
        if (confirm('您确定要删除该节点吗？')) {
            this.remove(data.id);
        }
    });

function tip() {
    $('#tip').modal('show')

}

(function hidden() {
    $('#tip').on('hidden.bs.modal', function (e) {
        console.log(e)
    })
})();
// var fce
// window.onload = function() {
//   fce = new FCE({
//     rightMenu: [{//右键菜单

//     }],
//     toolbars: [{
//       //不写默认使用fce自带的render方法
//       render: function() {
//         return document.createElement('div')
//       },
//       icon: {
//         src: "img/xxx.png",
//         width: 12,
//         height: 12,
//       },
//       class: '', //样式

//       fce: null, //这里是fce的指针
//       id: 'point',
//       title: "指针",
//       onclick: function() {
//         //这里的this是当前bar
//       }
//     }]
//   })
//   window.fce = fce
// }

// var bar = fce.getToolbarById('id') //根据id获取组件
// bar.isShow() //true/false
// bar.hide()
// bar.show()
// bar.addClass()
// bar.removeClass() //空则为移除所有样式
//   //可以通过fire触发某事件，通过fce.on绑定某事件
// fce.on('click', function() {
//   //绑定事件
// })