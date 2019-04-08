angular.module('infi-basic')
.service('reportService',[function(){
  /**
   * 拼接默认报告页默认值
   * @param {*} singleData 
   * @param {*} savedDir 
   */
  this.initValue = function(singleData, savedDir) {
    var pickVal = function(num) {
      return (savedDir[num] && savedDir[num].value) ? savedDir[num].value : ''
    }

    var tpl = {
      '440': {
        labelId: '440',
        value: `${pickVal(251)} 条皮质肾组织, ${pickVal(252)} 条髓质肾组织, ${pickVal(253)} 条皮髓交界肾组织, ${pickVal(254)} 个完整肾小球\n肾小球体积正常/增大. 全片见 ${pickVal(255)} 处全球硬化(${pickVal(256)}), ${pickVal(257)} 处节段硬化(${pickVal(258)}), ${pickVal(259)} 处球囊粘连(${pickVal(260)}), ${(pickVal(261))} 处新月体 (${pickVal(262)}), ${pickVal(507)} 处细胞性新月体, ${pickVal(508)} 处细胞纤维性新月体, ${pickVal(509)} 处纤维细胞性新月体, ${pickVal(510)} 处纤维性新月体. 肾小球系膜细胞未见/${pickVal(266)} /轻度增殖, 系膜基质未见(${pickVal(270)} ${pickVal(269)})/增宽, 内皮细胞未见/局灶/弥漫、节段/球性、${pickVal(282)} 增殖, 部分/毛细血管袢开放良好/不良, 壁层上皮细胞未见/节段增殖, 包曼式囊壁${pickVal(291)}增厚.\n肾小管：基底膜弥漫性增厚，见灶性/多灶性/片状/弥漫、${pickVal(292)}萎缩, 上皮细胞可见${pickVal(294)}, 管腔内见少量/中量/大量/${pickVal(392)}.\n间质见灶性/多灶性/片状/弥漫、${pickVal(300)}炎细胞浸润,炎细胞以淋巴/单核细胞为主, 见灶性/多灶性/片状/弥漫、${pickVal(304)}纤维化.\n肾动脉壁: 管壁增厚(${pickVal(310)}), 可见${pickVal(309)},可见${pickVal(311)} 的玻璃样变.`
      },
      '441': {
        // value: ``
        labelId: '441',
        value: `未见/可见${pickVal(312)}少量/中量/大量嗜复红物质沉积, 基底膜${pickVal(314)}增厚, 可见/未见${pickVal(313)}`
      },
      '442': {
        labelId: '442',
        value: `${pickVal(319)}${pickVal(320)}${pickVal(321)}${pickVal(322)}`
      },
      '461': {  // 免疫荧光
        // value: ``
        labelId: '461',
        value: `免疫荧光(${pickVal(323)} 个肾小球): IgG(${pickVal(324)})、C3(${pickVal(348)})、IgG1(${pickVal(412)})、IgG4(${pickVal(420)}),IgA(${pickVal(332)})、IgM(${pickVal(340)})、C4(${pickVal(356)})、C1q(${pickVal(364)})、Fib(${pickVal(372)}).\n免疫荧光(${pickVal(323)}个肾小球): IgA(${pickVal(332)})、C3(${pickVal(348)}) 系膜区${pickVal(334)}状沉积、IgG(${pickVal(324)})、IgM(${pickVal(340)})、C4(${pickVal(356)})、C1q(${pickVal(364)})、Fib(${pickVal(372)})、IgG1(${pickVal(412)})、IgG4(${pickVal(420)}).\n免疫荧光(${pickVal(323)}个肾小球): IgG(${pickVal(324)})、IgA(${pickVal(332)})、IgM(${pickVal(340)})、C3(${pickVal(348)})、C4(${pickVal(356)})、C1q(${pickVal(364)})、Fib(${pickVal(372)}), IgG1(${pickVal(412)})、IgG4(${pickVal(420)})\n免疫荧光(${pickVal(323)}个肾小球): IgG(${pickVal(324)})、IgA(${pickVal(332)})、IgM(${pickVal(340)})、C3(${pickVal(348)})、C4(${pickVal(356)})、C1q(${pickVal(364)})、Fib(${pickVal(372)}), IgG1(${pickVal(412)})、IgG4(${pickVal(420)}).\nHbcAg(${pickVal(388)})、HbsAg（${pickVal(380)}）毛细血管袢颗粒样沉积. \n轻链κ（${pickVal(396)}）、轻链λ（${pickVal(404)}）毛细血管袢、系膜区沉积.`
      },
      '452': {  // 上传图片
        labelId: '460',
        value: pickVal(460)
      },
      '443': {  // 病理诊断
        // value: ``
        labelId: '248',
        value: `${pickVal(248)}`
      },
      '444': {  // 报告日期
        // value: ``
        labelId: '249',
        value: `${pickVal(249)}`
      },
      '445': {  // 军医签名
        // value: ``
        labelId: '453',
        value: `${pickVal(453)}`
      }
    }

    return  tpl[singleData.labelId]
  }

}]);