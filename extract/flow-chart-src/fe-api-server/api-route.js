/**
 * API 接口路由全部在这里定义
 */

const express = require('express')
const mockjs = require('mockjs')

var router = express.Router()

router.get('/dragData', function(req, res, next) {
  patiId = req.query.patiId
  patiId = req.body.patiId

  var data = mockjs.mock({
    "data|2": [{
        "label":'@ctitle(1, 4)-流程图',
        "data":{
            "elements": {
                "nodes": [
                    {
                        "data": {
                            "id": "3",
                            "parent": "1",
                            "label": "术后血红蛋白"
                        },
                        "position": {
                            "x": 330,
                            "y": 250
                        },
                        "group": "nodes",
                        "removed": false,
                        "selected": false,
                        "selectable": true,
                        "locked": false,
                        "grabbable": true,
                        "classes": "fce-shape-triangle eh-preview-active"
                    },
                    {
                        "data": {
                            "id": "2",
                            "parent": "1",
                            "label": "术前血红蛋白"
                        },
                        "position": {
                            "x": 330,
                            "y": 190
                        },
                        "group": "nodes",
                        "removed": false,
                        "selected": false,
                        "selectable": true,
                        "locked": false,
                        "grabbable": true,
                        "classes": "fce-shape-triangle eh-preview-active"
                    },
                    {
                        "data": {
                            "id": "1",
                            "label": "纵隔血压"
                        },
                        "position": {
                            "x": 330,
                            "y": 220
                        },
                        "group": "nodes",
                        "removed": false,
                        "selected": false,
                        "selectable": true,
                        "locked": false,
                        "grabbable": true,
                        "classes": "fce-shape-rectangle eh-preview-active"
                    },
                    {
                        "data": {
                            "id": "1533657027726",
                            "parent": "1",
                            "label": "-"
                        },
                        "position": {
                            "x": 450,
                            "y": 230
                        },
                        "group": "nodes",
                        "removed": false,
                        "selected": false,
                        "selectable": true,
                        "locked": false,
                        "grabbable": true,
                        "classes": "fce-shape-triangle eh-preview-active"
                    },
                    {
                        "data": {
                            "id": "1533657084420",
                            "parent": "1",
                            "label": "血红蛋白差"
                        },
                        "position": {
                            "x": 530,
                            "y": 230
                        },
                        "group": "nodes",
                        "removed": false,
                        "selected": false,
                        "selectable": true,
                        "locked": false,
                        "grabbable": true,
                        "classes": "fce-shape-rectangle"
                    },
                    {
                        "data": {
                            "id": "1533657091797",
                            "parent": "1",
                            "label": ">"
                        },
                        "position": {
                            "x": 590,
                            "y": 230
                        },
                        "group": "nodes",
                        "removed": false,
                        "selected": false,
                        "selectable": true,
                        "locked": false,
                        "grabbable": true,
                        "classes": "fce-shape-triangle eh-preview-active"
                    },
                    {
                        "data": {
                            "id": "1533657096204",
                            "parent": "1",
                            "label": "3"
                        },
                        "position": {
                            "x": 670,
                            "y": 230
                        },
                        "group": "nodes",
                        "removed": false,
                        "selected": false,
                        "selectable": true,
                        "locked": false,
                        "grabbable": true,
                        "classes": "fce-shape-ellipse"
                    },
                    {
                        "data": {
                            "id": "1533657118656",
                            "parent": "1",
                            "label": "Y"
                        },
                        "position": {
                            "x": 770,
                            "y": 230
                        },
                        "group": "nodes",
                        "removed": false,
                        "selected": false,
                        "selectable": true,
                        "locked": false,
                        "grabbable": true,
                        "classes": "fce-shape-diamond"
                    },
                    {
                        "data": {
                            "id": "1533657132227",
                            "label": "血红蛋白偏高"
                        },
                        "position": {
                            "x": 870,
                            "y": 230
                        },
                        "group": "nodes",
                        "removed": false,
                        "selected": false,
                        "selectable": true,
                        "locked": false,
                        "grabbable": true,
                        "classes": "fce-shape-star eh-preview-active"
                    }
                ],
                "edges": [
                    {
                        "data": {
                            "source": "2",
                            "target": "1533657027726",
                            "parent": "1",
                            "id": "cc31511a-72e6-4506-88b1-9012ea20e3c4"
                        },
                        "position": {},
                        "group": "edges",
                        "removed": false,
                        "selected": false,
                        "selectable": true,
                        "locked": false,
                        "grabbable": true,
                        "classes": ""
                    },
                    {
                        "data": {
                            "source": "3",
                            "target": "1533657027726",
                            "parent": "1",
                            "id": "8f16643f-f117-4697-900d-32f020e2bb1f"
                        },
                        "position": {},
                        "group": "edges",
                        "removed": false,
                        "selected": false,
                        "selectable": true,
                        "locked": false,
                        "grabbable": true,
                        "classes": ""
                    },
                    {
                        "data": {
                            "source": "1533657027726",
                            "target": "1533657084420",
                            "parent": "1",
                            "id": "42a9231f-e75e-4fff-a5ec-cec566307f3a"
                        },
                        "position": {},
                        "group": "edges",
                        "removed": false,
                        "selected": false,
                        "selectable": true,
                        "locked": false,
                        "grabbable": true,
                        "classes": ""
                    },
                    {
                        "data": {
                            "source": "1533657084420",
                            "target": "1533657091797",
                            "parent": "1",
                            "id": "a59900df-8725-48cd-82e4-0199c606ccbb"
                        },
                        "position": {},
                        "group": "edges",
                        "removed": false,
                        "selected": false,
                        "selectable": true,
                        "locked": false,
                        "grabbable": true,
                        "classes": ""
                    },
                    {
                        "data": {
                            "source": "1533657091797",
                            "target": "1533657096204",
                            "parent": "1",
                            "id": "4c39ecba-45e0-482f-9293-7763605c3fae"
                        },
                        "position": {},
                        "group": "edges",
                        "removed": false,
                        "selected": false,
                        "selectable": true,
                        "locked": false,
                        "grabbable": true,
                        "classes": ""
                    },
                    {
                        "data": {
                            "source": "1533657096204",
                            "target": "1533657118656",
                            "parent": "1",
                            "id": "bfdb0a52-9ac7-48da-870c-bf807e1cc941"
                        },
                        "position": {},
                        "group": "edges",
                        "removed": false,
                        "selected": false,
                        "selectable": true,
                        "locked": false,
                        "grabbable": true,
                        "classes": ""
                    },
                    {
                        "data": {
                            "source": "1",
                            "target": "1533657132227",
                            "id": "8f290eb7-51ef-48ae-8f63-389c3c260f47"
                        },
                        "position": {},
                        "group": "edges",
                        "removed": false,
                        "selected": false,
                        "selectable": true,
                        "locked": false,
                        "grabbable": true,
                        "classes": ""
                    }
                ]
            },
            "style": [
                {
                    "selector": "node",
                    "style": {
                        "label": "data(label)",
                        "text-valign": "center"
                    }
                },
                {
                    "selector": "node.fce-shape-ellipse",
                    "style": {
                        "shape": "ellipse"
                    }
                },
                {
                    "selector": "node.fce-shape-triangle",
                    "style": {
                        "shape": "triangle"
                    }
                },
                {
                    "selector": "node.fce-shape-rectangle",
                    "style": {
                        "shape": "rectangle"
                    }
                },
                {
                    "selector": "node.fce-shape-roundrectangle",
                    "style": {
                        "shape": "roundrectangle"
                    }
                },
                {
                    "selector": "node.fce-shape-bottomroundrectangle",
                    "style": {
                        "shape": "bottomroundrectangle"
                    }
                },
                {
                    "selector": "node.fce-shape-cutrectangle",
                    "style": {
                        "shape": "cutrectangle"
                    }
                },
                {
                    "selector": "node.fce-shape-barrel",
                    "style": {
                        "shape": "barrel"
                    }
                },
                {
                    "selector": "node.fce-shape-rhomboid",
                    "style": {
                        "shape": "rhomboid"
                    }
                },
                {
                    "selector": "node.fce-shape-diamond",
                    "style": {
                        "shape": "diamond"
                    }
                },
                {
                    "selector": "node.fce-shape-pentagon",
                    "style": {
                        "shape": "pentagon"
                    }
                },
                {
                    "selector": "node.fce-shape-hexagon",
                    "style": {
                        "shape": "hexagon"
                    }
                },
                {
                    "selector": "node.fce-shape-concavehexagon",
                    "style": {
                        "shape": "concavehexagon"
                    }
                },
                {
                    "selector": "node.fce-shape-heptagon",
                    "style": {
                        "shape": "heptagon"
                    }
                },
                {
                    "selector": "node.fce-shape-octagon",
                    "style": {
                        "shape": "octagon"
                    }
                },
                {
                    "selector": "node.fce-shape-star",
                    "style": {
                        "shape": "star"
                    }
                },
                {
                    "selector": "node.fce-shape-tag",
                    "style": {
                        "shape": "tag"
                    }
                },
                {
                    "selector": "node.fce-shape-vee",
                    "style": {
                        "shape": "vee"
                    }
                },
                {
                    "selector": "node.fce-shape-polygon",
                    "style": {
                        "shape": "polygon"
                    }
                },
                {
                    "selector": "node:selected",
                    "style": {
                        "border-width": "6px",
                        "border-color": "#AAD8FF",
                        "border-opacity": "0.5",
                        "background-color": "#77828C",
                        "text-outline-color": "#77828C"
                    }
                },
                {
                    "selector": "edge",
                    "style": {
                        "label": "data(label)",
                        "font-size": "10px",
                        "curve-style": "bezier",
                        "line-style": "solid",
                        "target-arrow-shape": "triangle"
                    }
                },
                {
                    "selector": "edge:selected",
                    "style": {
                        "border-width": "6px",
                        "border-color": "#AAD8FF",
                        "border-opacity": "0.5",
                        "background-color": "yellow",
                        "text-outline-color": "#77828C"
                    }
                },
                {
                    "selector": ".eh-handle",
                    "style": {
                        "background-color": "red",
                        "width": "10px",
                        "height": "10px",
                        "shape": "ellipse",
                        "overlay-opacity": "0",
                        "border-width": "12px",
                        "border-opacity": "0"
                    }
                },
                {
                    "selector": "._gridParentPadding",
                    "style": {
                        "compound-sizing-wrt-labels": "exclude",
                        "padding": "20px"
                    }
                },
                {
                    "selector": "._gridParentPadding",
                    "style": {
                        "compound-sizing-wrt-labels": "exclude",
                        "padding": "20px"
                    }
                },
                {
                    "selector": ".edgebendediting-hasbendpoints",
                    "style": {
                        "curve-style": "segments",
                        "segment-distances": "fn",
                        "segment-weights": "fn",
                        "edge-distances": "node-position"
                    }
                },
                {
                    "selector": "node.highlighted",
                    "style": {}
                },
                {
                    "selector": "node.unhighlighted",
                    "style": {
                        "opacity": "0.3"
                    }
                },
                {
                    "selector": "edge.highlighted",
                    "style": {}
                },
                {
                    "selector": "edge.unhighlighted",
                    "style": {
                        "opacity": "0.3"
                    }
                }
            ],
            "zoomingEnabled": true,
            "userZoomingEnabled": false,
            "zoom": 1,
            "minZoom": 0.1,
            "maxZoom": 9,
            "panningEnabled": true,
            "userPanningEnabled": true,
            "pan": {
                "x": 0,
                "y": 0
            },
            "boxSelectionEnabled": true,
            "renderer": {
                "name": "canvas"
            }
        }
    }]
  })

  res.json(data)
})

router.get('/dragDatas', function(req, res, next) {
    var data = mockjs.mock({
            "data|2": [{
                "id": 3,
                "label": "症状",
                "value": "11",
                "sort": 1,
                "templateId": 1,
                "clazz": "tag",
                "classifyNodes": [
                    {
                        "id": 1,
                        "label": "常见症状",
                        "value": "11",
                        "sort": 1,
                        "clazz": "classify",
                        "tagNodeId": 3,
                        "attributeNodeId": null,
                        "valueNodes": [
                            {
                                "id": 6,
                                "label": "失眠",
                                "value": "16",
                                "sort": 6,
                                "clazz": "value",
                                "tagNodeId": null,
                                "classifyNodeId": 1,
                                "attributeNodeId": null,
                                "attributeNodes": [],
                                "relateNodes": [
                                    {
                                        "id": 1,
                                        "label": "心痛",
                                        "value": "11",
                                        "sort": 1,
                                        "clazz": "value",
                                        "tagNodeId": null,
                                        "classifyNodeId": 3,
                                        "attributeNodeId": null,
                                        "attributeNodes": [],
                                        "relateNodes": null
                                    }
                                ]
                            },
                            {
                                "id": 9,
                                "label": "眼痛",
                                "value": "19",
                                "sort": 9,
                                "clazz": "value",
                                "tagNodeId": null,
                                "classifyNodeId": 1,
                                "attributeNodeId": null,
                                "attributeNodes": [],
                                "relateNodes": []
                            }
                        ],
                        "attributeNodes": []
                    },
                    {
                        "id": 2,
                        "label": "头部",
                        "value": "12",
                        "sort": 2,
                        "clazz": "classify",
                        "tagNodeId": 3,
                        "attributeNodeId": null,
                        "valueNodes": [
                            {
                                "id": 3,
                                "label": "头晕",
                                "value": "13",
                                "sort": 3,
                                "clazz": "value",
                                "tagNodeId": null,
                                "classifyNodeId": 2,
                                "attributeNodeId": null,
                                "attributeNodes": [],
                                "relateNodes": []
                            },
                            {
                                "id": 5,
                                "label": "恶心",
                                "value": "15",
                                "sort": 5,
                                "clazz": "value",
                                "tagNodeId": null,
                                "classifyNodeId": 2,
                                "attributeNodeId": null,
                                "attributeNodes": [],
                                "relateNodes": [
                                    {
                                        "id": 1,
                                        "label": "心痛",
                                        "value": "11",
                                        "sort": 1,
                                        "clazz": "value",
                                        "tagNodeId": null,
                                        "classifyNodeId": 3,
                                        "attributeNodeId": null,
                                        "attributeNodes": [],
                                        "relateNodes": null
                                    }
                                ]
                            }
                        ],
                        "attributeNodes": []
                    },
                    {
                        "id": 3,
                        "label": "腹部",
                        "value": "13",
                        "sort": 3,
                        "clazz": "classify",
                        "tagNodeId": 3,
                        "attributeNodeId": null,
                        "valueNodes": [
                            {
                                "id": 1,
                                "label": "心痛",
                                "value": "11",
                                "sort": 1,
                                "clazz": "value",
                                "tagNodeId": null,
                                "classifyNodeId": 3,
                                "attributeNodeId": null,
                                "attributeNodes": [],
                                "relateNodes": [
                                    {
                                        "id": 5,
                                        "label": "恶心",
                                        "value": "15",
                                        "sort": 5,
                                        "clazz": "value",
                                        "tagNodeId": null,
                                        "classifyNodeId": 2,
                                        "attributeNodeId": null,
                                        "attributeNodes": [],
                                        "relateNodes": [
                                            {
                                                "id": 1,
                                                "label": "心痛",
                                                "value": "11",
                                                "sort": 1,
                                                "clazz": "value",
                                                "tagNodeId": null,
                                                "classifyNodeId": 3,
                                                "attributeNodeId": null,
                                                "attributeNodes": [],
                                                "relateNodes": null
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "id": 2,
                                "label": "胸痛",
                                "value": "12",
                                "sort": 2,
                                "clazz": "value",
                                "tagNodeId": null,
                                "classifyNodeId": 3,
                                "attributeNodeId": null,
                                "attributeNodes": [],
                                "relateNodes": []
                            },
                            {
                                "id": 7,
                                "label": "腹痛",
                                "value": "17",
                                "sort": 7,
                                "clazz": "value",
                                "tagNodeId": null,
                                "classifyNodeId": 3,
                                "attributeNodeId": null,
                                "attributeNodes": [],
                                "relateNodes": []
                            }
                        ],
                        "attributeNodes": []
                    },
                    {
                        "id": 4,
                        "label": "四肢",
                        "value": "14",
                        "sort": 4,
                        "clazz": "classify",
                        "tagNodeId": 3,
                        "attributeNodeId": null,
                        "valueNodes": [
                            {
                                "id": 4,
                                "label": "斑块",
                                "value": "14",
                                "sort": 4,
                                "clazz": "value",
                                "tagNodeId": null,
                                "classifyNodeId": 4,
                                "attributeNodeId": null,
                                "attributeNodes": [],
                                "relateNodes": []
                            },
                            {
                                "id": 8,
                                "label": "肩痛",
                                "value": "18",
                                "sort": 8,
                                "clazz": "value",
                                "tagNodeId": null,
                                "classifyNodeId": 4,
                                "attributeNodeId": null,
                                "attributeNodes": [],
                                "relateNodes": []
                            },
                            {
                                "id": 10,
                                "label": "手脚麻木",
                                "value": "20",
                                "sort": 10,
                                "clazz": "value",
                                "tagNodeId": null,
                                "classifyNodeId": 4,
                                "attributeNodeId": null,
                                "attributeNodes": [
                                    {
                                        "id": 1,
                                        "label": "部位",
                                        "value": null,
                                        "sort": 1,
                                        "options": "checkbox",
                                        "clazz": "attribute",
                                        "valueNodeId": 10,
                                        "classifyNodeId": null,
                                        "classifyNodes": [],
                                        "valueNodes": [
                                            {
                                                "id": 12,
                                                "label": "腹部",
                                                "value": "112",
                                                "sort": 2,
                                                "clazz": "value",
                                                "tagNodeId": null,
                                                "classifyNodeId": null,
                                                "attributeNodeId": 1,
                                                "attributeNodes": [],
                                                "relateNodes": []
                                            }
                                        ]
                                    }
                                ],
                                "relateNodes": [
                                    {
                                        "id": 3,
                                        "label": "头晕",
                                        "value": "13",
                                        "sort": 3,
                                        "clazz": "value",
                                        "tagNodeId": null,
                                        "classifyNodeId": 2,
                                        "attributeNodeId": null,
                                        "attributeNodes": [],
                                        "relateNodes": []
                                    }
                                ]
                            }
                        ],
                        "attributeNodes": []
                    }
                ],
                "valueNodes": []
            }],
            "status": "ok",
            "description": "数据请求成功"
        }
    );
    res.json(data)
})


module.exports =  router