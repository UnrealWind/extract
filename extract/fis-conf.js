fis.set('project.ignore', ['node_modules/**', 'output/**', 'fis-conf.js', '*.json', 'Dockerfile', '*.sh', '*.md', '*.lock']);
fis.config.set("project.watch.usePolling", true);
//scss转css
fis.match('/*src/**/*.scss', {
    parser: fis.plugin('node-sass'),
    rExt: '.css'
});
// 启用 fis-spriter-csssprites 插件
fis.match('::package', {
    spriter: fis.plugin('csssprites')
});
// 对 CSS 进行图片合并
fis.match('*.css', {
    // 给匹配到的文件分配属性 `useSprite`
    useSprite: true
});

fis.match('*.css', {
    // fis-optimizer-clean-css 插件进行压缩，已内置
    optimizer: fis.plugin('clean-css')
});
//使用开发配置
//这里要优先加载app.module.js个人看了一下，加载顺序的问题如果有特殊情况再特殊处理，如果没有问题直接这样既可
fis.media('develop')
    .match('::package', {
        packager: fis.plugin('map', {
            'env/env.js': [
                'env/env.dev.js'
            ],
            'study-src/all.js': [
                'study-src/*/app.module.js',
                'study-src/*/*.js',
                '!study-src/*/intranet-constant.jss',
                '!study-src/*/online-constant.jss'
            ],
            'scientific-research-src/all.js': [
                'scientific-research-src/*/app.module.js',
                'scientific-research-src/js/*.js',
                'scientific-research-src/form/*.js',
                '!scientific-research-src/*/intranet-constant.jss',
                '!scientific-research-src/*/online-constant.jss'
            ],
            'analysis-src/all.js': [
                'analysis-src/*/app.module.js',
                'analysis-src/*/*.js',
                '!analysis-src/*/intranet-constant.jss',
                '!analysis-src/*/online-constant.jss'
            ],
            'flow-chart-src/all.js': [
                'flow-chart-src/*/app.module.js',
                'flow-chart-src/js/*.js',
                '!flow-chart-src/js/init.fce.js',
                '!flow-chart-src/*/intranet-constant.jss',
                '!flow-chart-src/*/online-constant.jss'
            ],
            'cyjy-eleScreen-src/all.js': [
                'cyjy-eleScreen-src/js/app.module.js',
                'cyjy-eleScreen-src/js/*.js',
                '!cyjy-eleScreen-src/js/intranet-constant.jss',
                '!cyjy-eleScreen-src/js/online-constant.jss'
            ],
            'teleconsultation-src/all.js': [
                'teleconsultation-src/*/app.module.js',
                'teleconsultation-src/*/*.js',
                '!teleconsultation-src/*/intranet-constant.jss',
                '!teleconsultation-src/*/online-constant.jss'
            ],
            'extract-src/all.js': [
                'extract-src/*/app.module.js',
                'extract-src/*/*.js',
                '!extract-src/*/intranet-constant.js',
                '!extract-src/*/online-constant.js'
            ],
            'outpatient-src/all.js': [
                'outpatient-src/*/app.module.js',
                'outpatient-src/*/*.js',
                '!outpatient-src/*/intranet-constant.jss',
                '!outpatient-src/*/online-constant.jss'
            ],
            'clinic-src/all.js': [
                'clinic-src/*/app.module.js',
                'clinic-src/*/*.js',
                '!clinic-src/*/intranet-constant.jss',
                '!clinic-src/*/online-constant.jss'
            ],
            'temporaries-src/all.js': [
                'temporaries-src/*/app.module.js',
                'temporaries-src/*/*.js',
                '!temporaries-src/*/intranet-constant.jss',
                '!temporaries-src/*/online-constant.jss'
            ],
            'record-src/all.js': [
                'record-src/js2/app.module.js',
                'record-src/js2/*.js',
                '!record-src/js2/intranet-constant.jss',
                '!record-src/js2/online-constant.jss'
            ],
            'record-src-demo/all.js': [
                'record-src-demo/js/app.module.js',
                'record-src-demo/js/*.js'
            ],
            'record-collect-src/all.js': [
                'record-collect-src/js/app.module.js',
                'record-collect-src/js/*.js'
            ],
            'disease-analysis-src/all.js': [
                'disease-analysis-src/js/app.module.js',
                'disease-analysis-src/js/*.js',
                '!disease-analysis-src/js/intranet-constant.jss',
                '!disease-analysis-src/js/online-constant.jss'
            ],
            'record-obstetrics-src/all.js': [
                'record-obstetrics-src/js2/app.module.js',
                'record-obstetrics-src/js2/*.js',
                '!record-obstetrics-src/js2/intranet-constant.jss',
                '!record-obstetrics-src/js2/online-constant.jss'
            ],
            'record-ent-src/all.js': [
                'record-ent-src/*/app.module.js',
                'record-ent-src/*/*.js',
                '!record-ent-src/*/intranet-constant.jss',
                '!record-ent-src/*/online-constant.jss'
            ],
            'extract-service-src/all.js': [
                'extract-service-src/js/app.module.js',
                'extract-service-src/*/*.js',
                '!extract-service-src/*/intranet-constant.jss',
                '!extract-service-src/*/online-constant.jss'
            ],
            'system-management/all.js': [
                'system-management/js/app.module.js',
                'system-management/*/*.js',
                '!system-management/*/intranet-constant.jss',
                '!system-management/*/online-constant.jss'
            ],
            'nursing-src/all.js': [
                'nursing-src/js/app.module.js',
                'nursing-src/*/*.js',
                '!nursing-src/*/intranet-constant.jss',
                '!nursing-src/*/online-constant.jss'
            ],
            'mind-map/all.js': [
                'mind-map/js/app.module.js',
                'mind-map/*/*.js',
                '!mind-map/*/intranet-constant.jss',
                '!mind-map/*/online-constant.jss'
            ],
            'd3-src/all.js': [
                'd3-src/js/app.module.js',
                'd3-src/*/*.js',
                '!d3-src/*/intranet-constant.jss',
                '!d3-src/*/online-constant.jss'
            ],
            'diseases-plan-src/all.js': [
                'diseases-plan-src/js/app.module.js',
                'diseases-plan-src/*/*.js',
                '!diseases-plan-src/*/intranet-constant.jss',
                '!diseases-plan-src/*/online-constant.jss'
            ],
            'extract-src-CRF/all.js': [
                'extract-src-CRF/js/app.module.js',
                'extract-src-CRF/*/*.js'
            ],
            'extract-src-tags/all.js': [
                'extract-src-tags/js/app.module.js',
                'extract-src-tags/*/*.js'
            ],
            'adverse-event-src/all.js': [
                'adverse-event-src/js/app.module.js',
                'adverse-event-src/*/*.js',
                '!adverse-event-src/*/intranet-constant.jss',
                '!adverse-event-src/*/online-constant.jss'
            ],
            'health-view-src/all.js': [
                'health-view-src/js/app.module.js',
                'health-view-src/js/*.js',
                '!health-view-src/js/intranet-constant.jss',
                '!health-view-src/js/online-constant.jss'
            ]
            ,
            'portray-src/all.js': [
                'portray-src/js/app.module.js',
                'portray-src/js/*.js',
                '!portray-src/js/intranet-constant.jss',
                '!portray-src/js/online-constant.jss'
            ],
            'iDiagnosis-src/common.js': [
                'iDiagnosis-src/common/js/app.module.js',
                'iDiagnosis-src/common/**.js',
                '!iDiagnosis-src/common/js/intranet-constant.jss',
                '!iDiagnosis-src/common/js/online-constant.jss'
            ],
            'iDiagnosis-src/index/index.js': [
                'iDiagnosis-src/index/js/*.js',
            ],
            'iDiagnosis-src/config/config.js': [
                'iDiagnosis-src/config/js/*.js',
            ],
            'admission-regist-src/all.js': [
                'admission-regist-src/js/app.module.js',
                'admission-regist-src/js/*.js',
                '!admission-regist-src/fe-api-server/*.js',
                '!admission-regist-src/js/intranet-constant.js',
                '!admission-regist-src/js/online-constant.js'
            ],
            'pathology-src/all.js': [
                'pathology-src/js/app.module.js',
                'pathology-src/js/*.js',
                '!pathology-src/fe-api-server/*.js',
                '!pathology-src/js/intranet-constant.js',
                '!pathology-src/js/online-constant.js'
            ],
            'daily-shift-src/all.js': [
                'daily-shift-src/js/app.module.js',
                'daily-shift-src/js/*.js',
                '!daily-shift-src/fe-api-server/*.js',
                '!daily-shift-src/js/intranet-constant.js',
                '!daily-shift-src/js/online-constant.js'
            ],
            'chronic-disease-src/all.js': [
                'chronic-disease-src/js/app.module.js',
                'chronic-disease-src/js/*.js',
                'chronic-disease-src/form/*.js',
                '!chronic-disease-src/fe-api-server/*.js',
                '!chronic-disease-src/js/intranet-constant.jss',
                '!chronic-disease-src/js/online-constant.jss'
            ],
            'chronic-disease-V2-src/all.js': [
                'chronic-disease-V2-src/js/app.module.js',
                'chronic-disease-V2-src/js/*.js',
                'chronic-disease-V2-src/components/*/*.js',
                'chronic-disease-V2-src/form/*.js',
                '!chronic-disease-V2-src/fe-api-server/*.js',
            ]
        })
    });
//使用内网配置
fis.media('intranet')
    .match('/*-src*/**.js', {
        // fis-optimizer-uglify-js 插件进行压缩，已内置
        optimizer: fis.plugin('uglify-js', {
            compress: {
                drop_console: true
            }
        }),
        parser: fis.plugin('babel-5.x', {   // es6 语法转义
            blacklist: ["useStrict"],
            compact: false
        })
    })
    .match('::package', {
        packager: fis.plugin('map', {
            'env/env.js': [
                'env/env.dev.js'
            ],
            'study-src/all.js': [
                'study-src/*/app.module.js',
                'study-src/*/*.js',
                '!study-src/*/constant.js',
                '!study-src/*/online-constant.jss'
            ],
            'scientific-research-src/all.js': [
                'scientific-research-src/*/app.module.js',
                'scientific-research-src/js/*.js',
                'scientific-research-src/form/*.js',
                '!scientific-research-src/*/constant.js',
                '!scientific-research-src/*/online-constant.jss'
            ],
            'analysis-src/all.js': [
                'analysis-src/*/app.module.js',
                'analysis-src/*/*.js',
                '!analysis-src/*/constant.js',
                '!analysis-src/*/online-constant.jss'
            ],
            'flow-chart-src/all.js': [
                'flow-chart-src/*/app.module.js',
                'flow-chart-src/js/*.js',
                '!flow-chart-src/js/init.fce.js',
                '!flow-chart-src/*/constant.js',
                '!flow-chart-src/*/online-constant.jss'
            ],
            'teleconsultation-src/all.js': [
                'teleconsultation-src/*/app.module.js',
                'teleconsultation-src/*/*.js',
                '!teleconsultation-src/*/constant.js',
                '!teleconsultation-src/*/online-constant.jss'
            ],
            'extract-src/all.js': [
                'extract-src/*/app.module.js',
                'extract-src/*/*.js'
            ],
            'outpatient-src/all.js': [
                'outpatient-src/*/app.module.js',
                'outpatient-src/*/*.js',
            ],
            'clinic-src/all.js': [
                'clinic-src/*/app.module.js',
                'clinic-src/*/*.js',
                '!clinic-src/*/constant.js',
                '!clinic-src/*/online-constant.jss'
            ],
            'temporaries-src/all.js': [
                'temporaries-src/*/app.module.js',
                'temporaries-src/*/*.js',
                '!temporaries-src/*/constant.js',
                '!temporaries-src/*/online-constant.jss'
            ],
            'record-src/all.js': [
                'record-src/js2/app.module.js',
                'record-src/js2/*.js',
                '!record-src/js2/constant.js',
                '!record-src/js2/online-constant.jss'
            ],
            'record-src-demo/all.js': [
                'record-src-demo/js/app.module.js',
                'record-src-demo/js/*.js'
            ],
            'disease-analysis-src/all.js': [
                'disease-analysis-src/js/app.module.js',
                'disease-analysis-src/*/*.js',
                '!disease-analysis-src/*/online-constant.jss',
                '!disease-analysis-src/*/constant.js'
            ],
            'record-obstetrics-src/all.js': [
                'record-obstetrics-src/js2/app.module.js',
                'record-obstetrics-src/js2/*.js',
                '!record-obstetrics-src/js2/constant.js',
                '!record-obstetrics-src/js2/online-constant.jss'
            ],
            'record-ent-src/all.js': [
                'record-ent-src/*/app.module.js',
                'record-ent-src/*/*.js',
                '!record-ent-src/*/constant.js',
                '!record-ent-src/*/online-constant.jss'
            ],

            'record-collect-src/all.js': [
                'record-collect-src/js/app.module.js',
                'record-collect-src/js/*.js'
            ],
            'extract-service-src/all.js': [
                'extract-service-src/js/app.module.js',
                'extract-service-src/*/*.js',
            ],
            'system-management/all.js': [
                'system-management/js/app.module.js',
                'system-management/*/*.js',
            ],
            'nursing-src/all.js': [
                'nursing-src/js/app.module.js',
                'nursing-src/*/*.js',
                '!nursing-src/*/constant.js',
                '!nursing-src/*/online-constant.jss'
            ],
            'mind-map/all.js': [
                'mind-map/js/app.module.js',
                'mind-map/*/*.js',
                '!mind-map/*/constant.js',
                '!mind-map/*/online-constant.jss'
            ],
            'diseases-plan-src/all.js': [
                'diseases-plan-src/js/app.module.js',
                'diseases-plan-src/*/*.js'
            ],
            'd3-src/all.js': [
                'd3-src/js/app.module.js',
                'd3-src/*/*.js',
                '!d3-src/*/constant.js',
                '!d3-src/*/online-constant.jss'
            ],
            'extract-src-CRF/all.js': [
                'extract-src-CRF/js/app.module.js',
                'extract-src-CRF/*/*.js'
            ],
            'adverse-event-src/all.js': [
                'adverse-event-src/js/app.module.js',
                'adverse-event-src/*/*.js',
                '!adverse-event-src/*/constant.js',
                '!adverse-event-src/*/online-constant.jss'
            ],
            'health-view-src/all.js': [
                'health-view-src/js/app.module.js',
                'health-view-src/js/*.js',
                '!health-view-src/js/constant.js',
                '!health-view-src/js/online-constant.jss'
            ]
            ,
            'portray-src/all.js': [
                'portray-src/js/app.module.js',
                'portray-src/js/*.js',
                '!portray-src/js/constant.js',
                '!portray-src/js/online-constant.jss'
            ],
            'cyjy-eleScreen-src/all.js': [
                'cyjy-eleScreen-src/js/app.module.js',
                'cyjy-eleScreen-src/js/*.js',
                '!cyjy-eleScreen-src/js/constant.js',
                '!cyjy-eleScreen-src/js/online-constant.jss'
            ],
            'iDiagnosis-src/common.js': [
                'iDiagnosis-src/common/js/app.module.js',
                'iDiagnosis-src/common/**.js',
                '!iDiagnosis-src/common/js/constant.js',
                '!iDiagnosis-src/common/js/online-constant.jss'
            ],
            'iDiagnosis-src/index/index.js': [
                'iDiagnosis-src/index/js/*.js',
            ],
            'iDiagnosis-src/config/config.js': [
                'iDiagnosis-src/config/js/*.js',
            ],
            'admission-regist-src/all.js': [
                'admission-regist-src/js/app.module.js',
                'admission-regist-src/js/*.js',
                '!admission-regist-src/fe-api-server/*.js',
            ],
            'pathology-src/all.js': [
                'pathology-src/js/app.module.js',
                'pathology-src/js/*.js',
                '!pathology-src/fe-api-server/*.js',
            ],
            'chronic-disease-src/all.js': [
                'chronic-disease-src/js/app.module.js',
                'chronic-disease-src/js/*.js',
                'chronic-disease-src/form/*.js',
                '!chronic-disease-src/fe-api-server/*.js',
                '!chronic-disease-src/js/constant.js',
                '!chronic-disease-src/js/online-constant.jss'
            ],
            'daily-shift-src/all.js': [
                'daily-shift-src/js/app.module.js',
                'daily-shift-src/js/*.js',
                '!daily-shift-src/fe-api-server/*.js',
            ],
            'chronic-disease-src/all.js': [
                'chronic-disease-src/js/app.module.js',
                'chronic-disease-src/js/*.js',
                'chronic-disease-src/form/*.js',
                '!chronic-disease-src/fe-api-server/*.js',
                '!chronic-disease-src/js/constant.js',
                '!chronic-disease-src/js/online-constant.jss'
            ],
            'chronic-disease-V2-src/all.js': [
                'chronic-disease-V2-src/js/app.module.js',
                'chronic-disease-V2-src/js/*.js',
                'chronic-disease-V2-src/components/*/*.js',
                'chronic-disease-V2-src/form/*.js',
                '!chronic-disease-V2-src/fe-api-server/*.js',
            ]
        })
    });
//使用外网配置
fis.media('online')
    .match('/*-src*/**.js', {
        // fis-optimizer-uglify-js 插件进行压缩，已内置
        optimizer: fis.plugin('uglify-js', {
            compress: {
                drop_console: true
            }
        }),
        parser: fis.plugin('babel-5.x', {
            blacklist: ["useStrict"]
        })
    })
    .match('::package', {
        packager: fis.plugin('map', {
            'env/env.js': [
                'env/env.aliyun-weiyi.js'
            ],
            'study-src/all.js': [
                'study-src/*/app.module.js',
                'study-src/*/*.js',
                '!study-src/*/intranet-constant.jss',
                '!study-src/*/constant.js'
            ],
            'scientific-research-src/all.js': [
                'scientific-research-src/*/app.module.js',
                'scientific-research-src/js/*.js',
                'scientific-research-src/form/*.js',
                '!scientific-research-src/*/intranet-constant.jss',
                '!scientific-research-src/*/constant.js'
            ],
            'analysis-src/all.js': [
                'analysis-src/*/app.module.js',
                'analysis-src/*/*.js',
                '!analysis-src/*/intranet-constant.jss',
                '!analysis-src/*/constant.js'
            ],
            'flow-chart-src/all.js': [
                'flow-chart-src/*/app.module.js',
                'flow-chart-src/js/*.js',
                '!flow-chart-src/js/init.fce.js',
                '!flow-chart-src/*/intranet-constant.jss',
                '!flow-chart-src/*/constant.js'
            ],
            'teleconsultation-src/all.js': [
                'teleconsultation-src/*/app.module.js',
                'teleconsultation-src/*/*.js',
                '!teleconsultation-src/*/intranet-constant.jss',
                '!teleconsultation-src/*/constant.js'
            ],
            'record-ent-src/all.js': [
                'record-ent-src/*/app.module.js',
                'record-ent-src/*/*.js',
                '!record-ent-src/*/intranet-constant.jss',
                '!record-ent-src/*/constant.js'
            ],
            'temporaries-src/all.js': [
                'temporaries-src/*/app.module.js',
                'temporaries-src/*/*.js',
                '!temporaries-src/*/constant.js',
                '!temporaries-src/*/intranet-constant.jss'
            ],
            'extract-src/all.js': [
                'extract-src/*/app.module.js',
                'extract-src/*/*.js'
            ],
            'outpatient-src/all.js': [
                'outpatient-src/*/app.module.js',
                'outpatient-src/*/*.js',
                '!outpatient-src/*/intranet-constant.jss',
                '!outpatient-src/*/constant.js'
            ],
            'clinic-src/all.js': [
                'clinic-src/*/app.module.js',
                'clinic-src/*/*.js',
                '!clinic-src/*/intranet-constant.jss',
                '!clinic-src/*/constant.js'
            ],
            'record-src/all.js': [
                'record-src/js2/app.module.js',
                'record-src/js2/*.js',
                '!record-src/js2/intranet-constant.jss',
                '!record-src/js2/constant.js'
            ],
            'record-obstetrics-src/all.js': [
                'record-obstetrics-src/js2/app.module.js',
                'record-obstetrics-src/js2/*.js',
                '!record-obstetrics-src/js2/intranet-constant.jss',
                '!record-obstetrics-src/js2/constant.js'
            ],
            'record-src-demo/all.js': [
                'record-src-demo/js/app.module.js',
                'record-src-demo/js/*.js'
            ],
            'record-collect-src/all.js': [
                'record-collect-src/js/app.module.js',
                'record-collect-src/js/*.js'
            ],
            'disease-analysis-src/all.js': [
                'disease-analysis-src/js/app.module.js',
                'disease-analysis-src/*/*.js',
                '!disease-analysis-src/*/intranet-constant.jss',
                '!disease-analysis-src/*/constant.js'
            ],
            'extract-service-src/all.js': [
                'extract-service-src/js/app.module.js',
                'extract-service-src/*/*.js',
                '!extract-service-src/*/intranet-constant.jss',
                '!extract-service-src/*/constant.js'
            ],
            'system-management/all.js': [
                'system-management/js/app.module.js',
                'system-management/*/*.js',
                '!system-management/*/intranet-constant.jss',
                '!system-management/*/constant.js'
            ],
            'nursing-src/all.js': [
                'nursing-src/js/app.module.js',
                'nursing-src/*/*.js',
                '!nursing-src/*/intranet-constant.jss',
                '!nursing-src/*/constant.js'
            ],
            'extract-rule-src/all.js': [
                'extract-rule-src/js/app.module.js',
                'extract-rule-src/*/*.js',
                '!extract-rule-src/*/intranet-constant.jss',
                '!extract-rule-src/*/constant.js'
            ],
            'mind-map/all.js': [
                'mind-map/js/app.module.js',
                'mind-map/*/*.js',
                '!mind-map/*/intranet-constant.jss',
                '!mind-map/*/constant.js'
            ],
            'diseases-plan-src/all.js': [
                'diseases-plan-src/js/app.module.js',
                'diseases-plan-src/*/*.js',
                '!diseases-plan-src/*/intranet-constant.jss',
                '!diseases-plan-src/*/constant.js'
            ],
            'd3-src/all.js': [
                'd3-src/js/app.module.js',
                'd3-src/*/*.js',
                '!d3-src/*/intranet-constant.jss',
                '!d3-src/*/constant.js'
            ],
            'extract-src-CRF/all.js': [
                'extract-src-CRF/js/app.module.js',
                'extract-src-CRF/*/*.js'
            ],
            'adverse-event-src/all.js': [
                'adverse-event-src/js/app.module.js',
                'adverse-event-src/*/*.js',
                '!adverse-event-src/*/intranet-constant.jss',
                '!adverse-event-src/*/constant.js'
            ],
            'health-view-src/all.js': [
                'health-view-src/js/app.module.js',
                'health-view-src/js/*.js',
                '!health-view-src/*/intranet-constant.jss',
                '!health-view-src/*/constant.js'
            ]
            ,
            'portray-src/all.js': [
                'portray-src/js/app.module.js',
                'portray-src/js/*.js',
                '!portray-src/*/intranet-constant.jss',
                '!portray-src/*/constant.js'
            ],
            'cyjy-eleScreen-src/all.js': [
                'cyjy-eleScreen-src/js/app.module.js',
                'cyjy-eleScreen-src/js/*.js',
                '!cyjy-eleScreen-src/*/intranet-constant.jss',
                '!cyjy-eleScreen-src/*/constant.js'
            ],
            'iDiagnosis-src/common.js': [
                'iDiagnosis-src/common/js/app.module.js',
                'iDiagnosis-src/common/**.js',
                '!iDiagnosis-src/common/js/intranet-constant.jss',
                '!iDiagnosis-src/common/js/constant.js'
            ],
            'iDiagnosis-src/index/index.js': [
                'iDiagnosis-src/index/js/*.js'
            ],
            'iDiagnosis-src/config/config.js': [
                'iDiagnosis-src/config/js/*.js',
            ],
            'admission-regist-src/all.js': [
                'admission-regist-src/js/app.module.js',
                'admission-regist-src/js/*.js',
                '!admission-regist-src/fe-api-server/*.js',
                '!admission-regist-src/js/constant.js',
                '!admission-regist-src/js/intranet-constant'
            ],
            'pathology-src/all.js': [
                'pathology-src/js/app.module.js',
                'pathology-src/js/*.js',
                '!pathology-src/fe-api-server/*.js',
                '!pathology-src/js/constant.js',
                '!pathology-src/js/intranet-constant.jss'
            ],
            'chronic-disease-src/all.js': [
                'chronic-disease-src/js/app.module.js',
                'chronic-disease-src/js/*.js',
                'chronic-disease-src/form/*.js',
                '!chronic-disease-src/fe-api-server/*.js',
                '!chronic-disease-src/js/constant.js',
                '!chronic-disease-src/js/intranet-constant.jss'
            ],
            'daily-shift-src/all.js': [
                'daily-shift-src/js/app.module.js',
                'daily-shift-src/js/*.js',
                '!daily-shift-src/fe-api-server/*.js',
                '!daily-shift-src/js/intranet-constant.jss',
                '!daily-shift-src/js/constant.js'
            ],
            'chronic-disease-src/all.js': [
                'chronic-disease-src/js/app.module.js',
                'chronic-disease-src/js/*.js',
                'chronic-disease-src/form/*.js',
                '!chronic-disease-src/fe-api-server/*.js',
                '!chronic-disease-src/js/constant.js',
                '!chronic-disease-src/js/intranet-constant.jss'
            ],
            'chronic-disease-V2-src/all.js': [
                'chronic-disease-V2-src/js/app.module.js',
                'chronic-disease-V2-src/js/*.js',
                'chronic-disease-V2-src/components/*/*.js',
                'chronic-disease-V2-src/form/*.js',
                '!chronic-disease-V2-src/fe-api-server/*.js',
            ]
        })
    });//使用外网配置
fis.media('aliyun-weiyi')
    .match('/*-src*/**.js', {
        // fis-optimizer-uglify-js 插件进行压缩，已内置
        optimizer: fis.plugin('uglify-js', {
            compress: {
                drop_console: true
            }
        }),
        parser: fis.plugin('babel-5.x', {
            blacklist: ["useStrict"]
        })
    })
    .match('::package', {
        packager: fis.plugin('map', {
            'env/env.js': [
                'env/env.aliyun-weiyi.js'
            ],
            'study-src/all.js': [
                'study-src/*/app.module.js',
                'study-src/*/*.js',
                '!study-src/*/intranet-constant.jss',
                '!study-src/*/constant.js'
            ],
            'scientific-research-src/all.js': [
                'scientific-research-src/*/app.module.js',
                'scientific-research-src/js/*.js',
                'scientific-research-src/form/*.js',
                '!scientific-research-src/*/intranet-constant.jss',
                '!scientific-research-src/*/constant.js'
            ],
            'analysis-src/all.js': [
                'analysis-src/*/app.module.js',
                'analysis-src/*/*.js',
                '!analysis-src/*/intranet-constant.jss',
                '!analysis-src/*/constant.js'
            ],
            'flow-chart-src/all.js': [
                'flow-chart-src/*/app.module.js',
                'flow-chart-src/js/*.js',
                '!flow-chart-src/js/init.fce.js',
                '!flow-chart-src/*/intranet-constant.jss',
                '!flow-chart-src/*/constant.js'
            ],
            'teleconsultation-src/all.js': [
                'teleconsultation-src/*/app.module.js',
                'teleconsultation-src/*/*.js',
                '!teleconsultation-src/*/intranet-constant.jss',
                '!teleconsultation-src/*/constant.js'
            ],
            'record-ent-src/all.js': [
                'record-ent-src/*/app.module.js',
                'record-ent-src/*/*.js',
                '!record-ent-src/*/intranet-constant.jss',
                '!record-ent-src/*/constant.js'
            ],
            'temporaries-src/all.js': [
                'temporaries-src/*/app.module.js',
                'temporaries-src/*/*.js',
                '!temporaries-src/*/constant.js',
                '!temporaries-src/*/intranet-constant.jss'
            ],
            'extract-src/all.js': [
                'extract-src/*/app.module.js',
                'extract-src/*/*.js'
            ],
            'outpatient-src/all.js': [
                'outpatient-src/*/app.module.js',
                'outpatient-src/*/*.js',
                '!outpatient-src/*/intranet-constant.jss',
                '!outpatient-src/*/constant.js'
            ],
            'clinic-src/all.js': [
                'clinic-src/*/app.module.js',
                'clinic-src/*/*.js',
                '!clinic-src/*/intranet-constant.jss',
                '!clinic-src/*/constant.js'
            ],
            'record-src/all.js': [
                'record-src/js2/app.module.js',
                'record-src/js2/*.js',
                '!record-src/js2/intranet-constant.jss',
                '!record-src/js2/constant.js'
            ],
            'record-obstetrics-src/all.js': [
                'record-obstetrics-src/js2/app.module.js',
                'record-obstetrics-src/js2/*.js',
                '!record-obstetrics-src/js2/intranet-constant.jss',
                '!record-obstetrics-src/js2/constant.js'
            ],
            'record-src-demo/all.js': [
                'record-src-demo/js/app.module.js',
                'record-src-demo/js/*.js'
            ],
            'record-collect-src/all.js': [
                'record-collect-src/js/app.module.js',
                'record-collect-src/js/*.js'
            ],
            'disease-analysis-src/all.js': [
                'disease-analysis-src/js/app.module.js',
                'disease-analysis-src/*/*.js',
                '!disease-analysis-src/*/intranet-constant.jss',
                '!disease-analysis-src/*/constant.js'
            ],
            'extract-service-src/all.js': [
                'extract-service-src/js/app.module.js',
                'extract-service-src/*/*.js',
                '!extract-service-src/*/intranet-constant.jss',
                '!extract-service-src/*/constant.js'
            ],
            'system-management/all.js': [
                'system-management/js/app.module.js',
                'system-management/*/*.js',
                '!system-management/*/intranet-constant.jss',
                '!system-management/*/constant.js'
            ],
            'nursing-src/all.js': [
                'nursing-src/js/app.module.js',
                'nursing-src/*/*.js',
                '!nursing-src/*/intranet-constant.jss',
                '!nursing-src/*/constant.js'
            ],
            'extract-rule-src/all.js': [
                'extract-rule-src/js/app.module.js',
                'extract-rule-src/*/*.js',
                '!extract-rule-src/*/intranet-constant.jss',
                '!extract-rule-src/*/constant.js'
            ],
            'mind-map/all.js': [
                'mind-map/js/app.module.js',
                'mind-map/*/*.js',
                '!mind-map/*/intranet-constant.jss',
                '!mind-map/*/constant.js'
            ],
            'diseases-plan-src/all.js': [
                'diseases-plan-src/js/app.module.js',
                'diseases-plan-src/*/*.js',
                '!diseases-plan-src/*/intranet-constant.jss',
                '!diseases-plan-src/*/constant.js'
            ],
            'd3-src/all.js': [
                'd3-src/js/app.module.js',
                'd3-src/*/*.js',
                '!d3-src/*/intranet-constant.jss',
                '!d3-src/*/constant.js'
            ],
            'extract-src-CRF/all.js': [
                'extract-src-CRF/js/app.module.js',
                'extract-src-CRF/*/*.js'
            ],
            'adverse-event-src/all.js': [
                'adverse-event-src/js/app.module.js',
                'adverse-event-src/*/*.js',
                '!adverse-event-src/*/intranet-constant.jss',
                '!adverse-event-src/*/constant.js'
            ],
            'health-view-src/all.js': [
                'health-view-src/js/app.module.js',
                'health-view-src/js/*.js',
                '!health-view-src/*/intranet-constant.jss',
                '!health-view-src/*/constant.js'
            ]
            ,
            'portray-src/all.js': [
                'portray-src/js/app.module.js',
                'portray-src/js/*.js',
                '!portray-src/*/intranet-constant.jss',
                '!portray-src/*/constant.js'
            ],
            'cyjy-eleScreen-src/all.js': [
                'cyjy-eleScreen-src/js/app.module.js',
                'cyjy-eleScreen-src/js/*.js',
                '!cyjy-eleScreen-src/*/intranet-constant.jss',
                '!cyjy-eleScreen-src/*/constant.js'
            ],
            'iDiagnosis-src/common.js': [
                'iDiagnosis-src/common/js/app.module.js',
                'iDiagnosis-src/common/**.js',
                '!iDiagnosis-src/common/js/intranet-constant.jss',
                '!iDiagnosis-src/common/js/constant.js'
            ],
            'iDiagnosis-src/index/index.js': [
                'iDiagnosis-src/index/js/*.js'
            ],
            'iDiagnosis-src/config/config.js': [
                'iDiagnosis-src/config/js/*.js',
            ],
            'admission-regist-src/all.js': [
                'admission-regist-src/js/app.module.js',
                'admission-regist-src/js/*.js',
                '!admission-regist-src/fe-api-server/*.js',
                '!admission-regist-src/js/constant.js',
                '!admission-regist-src/js/intranet-constant'
            ],
            'pathology-src/all.js': [
                'pathology-src/js/app.module.js',
                'pathology-src/js/*.js',
                '!pathology-src/fe-api-server/*.js',
                '!pathology-src/js/constant.js',
                '!pathology-src/js/intranet-constant.jss'
            ],
            'chronic-disease-src/all.js': [
                'chronic-disease-src/js/app.module.js',
                'chronic-disease-src/js/*.js',
                'chronic-disease-src/form/*.js',
                '!chronic-disease-src/fe-api-server/*.js',
                '!chronic-disease-src/js/constant.js',
                '!chronic-disease-src/js/intranet-constant.jss'
            ],
            'daily-shift-src/all.js': [
                'daily-shift-src/js/app.module.js',
                'daily-shift-src/js/*.js',
                '!daily-shift-src/fe-api-server/*.js',
                '!daily-shift-src/js/intranet-constant.jss',
                '!daily-shift-src/js/constant.js'
            ],
            'chronic-disease-src/all.js': [
                'chronic-disease-src/js/app.module.js',
                'chronic-disease-src/js/*.js',
                'chronic-disease-src/form/*.js',
                '!chronic-disease-src/fe-api-server/*.js',
                '!chronic-disease-src/js/constant.js',
                '!chronic-disease-src/js/intranet-constant.jss'
            ],
            'chronic-disease-V2-src/all.js': [
                'chronic-disease-V2-src/js/app.module.js',
                'chronic-disease-V2-src/js/*.js',
                'chronic-disease-V2-src/components/*/*.js',
                'chronic-disease-V2-src/form/*.js',
                '!chronic-disease-V2-src/fe-api-server/*.js',
            ]
        })
    });

// 178 服务器打包配置
fis.media('server178')
    .match('/*-src*/**.js', {
        // fis-optimizer-uglify-js 插件进行压缩，已内置
        optimizer: fis.plugin('uglify-js', {
            compress: {
                drop_console: true
            }
        }),
        parser: fis.plugin('babel-5.x', {
            blacklist: ["useStrict"]
        })
    })
    .match('::package', {
        packager: fis.plugin('map', {
            'env/env.js': [
                'env/env.server178.js'
            ],
            'study-src/all.js': [
                'study-src/*/app.module.js',
                'study-src/*/*.js',
                '!study-src/*/intranet-constant.jss',
                '!study-src/*/online-constant.jss'
            ],
            'scientific-research-src/all.js': [
                'scientific-research-src/*/app.module.js',
                'scientific-research-src/js/*.js',
                'scientific-research-src/form/*.js',
                '!scientific-research-src/*/intranet-constant.jss',
                '!scientific-research-src/*/online-constant.jss'
            ],
            'analysis-src/all.js': [
                'analysis-src/*/app.module.js',
                'analysis-src/*/*.js',
                '!analysis-src/*/intranet-constant.jss',
                '!analysis-src/*/online-constant.jss'
            ],
            'flow-chart-src/all.js': [
                'flow-chart-src/*/app.module.js',
                'flow-chart-src/js/*.js',
                '!flow-chart-src/js/init.fce.js',
                '!flow-chart-src/*/intranet-constant.jss',
                '!flow-chart-src/*/online-constant.jss'
            ],
            'cyjy-eleScreen-src/all.js': [
                'cyjy-eleScreen-src/js/app.module.js',
                'cyjy-eleScreen-src/js/*.js',
                '!cyjy-eleScreen-src/js/intranet-constant.jss',
                '!cyjy-eleScreen-src/js/online-constant.jss'
            ],
            'teleconsultation-src/all.js': [
                'teleconsultation-src/*/app.module.js',
                'teleconsultation-src/*/*.js',
                '!teleconsultation-src/*/intranet-constant.jss',
                '!teleconsultation-src/*/online-constant.jss'
            ],
            'extract-src/all.js': [
                'extract-src/*/app.module.js',
                'extract-src/*/*.js'
            ],
            'outpatient-src/all.js': [
                'outpatient-src/*/app.module.js',
                'outpatient-src/*/*.js',
                '!outpatient-src/*/intranet-constant.jss',
                '!outpatient-src/*/online-constant.jss'
            ],
            'clinic-src/all.js': [
                'clinic-src/*/app.module.js',
                'clinic-src/*/*.js',
                '!clinic-src/*/intranet-constant.jss',
                '!clinic-src/*/online-constant.jss'
            ],
            'temporaries-src/all.js': [
                'temporaries-src/*/app.module.js',
                'temporaries-src/*/*.js',
                '!temporaries-src/*/intranet-constant.jss',
                '!temporaries-src/*/online-constant.jss'
            ],
            'record-src/all.js': [
                'record-src/js2/app.module.js',
                'record-src/js2/*.js',
                '!record-src/js2/intranet-constant.jss',
                '!record-src/js2/online-constant.jss'
            ],
            'record-src-demo/all.js': [
                'record-src-demo/js/app.module.js',
                'record-src-demo/js/*.js'
            ],
            'record-collect-src/all.js': [
                'record-collect-src/js/app.module.js',
                'record-collect-src/js/*.js'
            ],
            'disease-analysis-src/all.js': [
                'disease-analysis-src/js/app.module.js',
                'disease-analysis-src/js/*.js',
                '!disease-analysis-src/js/intranet-constant.jss',
                '!disease-analysis-src/js/online-constant.jss'
            ],
            'record-obstetrics-src/all.js': [
                'record-obstetrics-src/js2/app.module.js',
                'record-obstetrics-src/js2/*.js',
                '!record-obstetrics-src/js2/intranet-constant.jss',
                '!record-obstetrics-src/js2/online-constant.jss'
            ],
            'record-ent-src/all.js': [
                'record-ent-src/*/app.module.js',
                'record-ent-src/*/*.js',
                '!record-ent-src/*/intranet-constant.jss',
                '!record-ent-src/*/online-constant.jss'
            ],
            'extract-service-src/all.js': [
                'extract-service-src/js/app.module.js',
                'extract-service-src/*/*.js',
                '!extract-service-src/*/intranet-constant.jss',
                '!extract-service-src/*/online-constant.jss'
            ],
            'system-management/all.js': [
                'system-management/js/app.module.js',
                'system-management/*/*.js',
                '!system-management/*/intranet-constant.jss',
                '!system-management/*/online-constant.jss'
            ],
            'nursing-src/all.js': [
                'nursing-src/js/app.module.js',
                'nursing-src/*/*.js',
                '!nursing-src/*/intranet-constant.jss',
                '!nursing-src/*/online-constant.jss'
            ],
            'mind-map/all.js': [
                'mind-map/js/app.module.js',
                'mind-map/*/*.js',
                '!mind-map/*/intranet-constant.jss',
                '!mind-map/*/online-constant.jss'
            ],
            'd3-src/all.js': [
                'd3-src/js/app.module.js',
                'd3-src/*/*.js',
                '!d3-src/*/intranet-constant.jss',
                '!d3-src/*/online-constant.jss'
            ],
            'diseases-plan-src/all.js': [
                'diseases-plan-src/js/app.module.js',
                'diseases-plan-src/*/*.js',
                '!diseases-plan-src/*/intranet-constant.jss',
                '!diseases-plan-src/*/online-constant.jss'
            ],
            'extract-src-CRF/all.js': [
                'extract-src-CRF/js/app.module.js',
                'extract-src-CRF/*/*.js'
            ],
            'extract-src-tags/all.js': [
                'extract-src-tags/js/app.module.js',
                'extract-src-tags/*/*.js'
            ],
            'adverse-event-src/all.js': [
                'adverse-event-src/js/app.module.js',
                'adverse-event-src/*/*.js',
                '!adverse-event-src/*/intranet-constant.jss',
                '!adverse-event-src/*/online-constant.jss'
            ],
            'health-view-src/all.js': [
                'health-view-src/js/app.module.js',
                'health-view-src/js/*.js',
                '!health-view-src/js/intranet-constant.jss',
                '!health-view-src/js/online-constant.jss'
            ]
            ,
            'portray-src/all.js': [
                'portray-src/js/app.module.js',
                'portray-src/js/*.js',
                '!portray-src/js/intranet-constant.jss',
                '!portray-src/js/online-constant.jss'
            ],
            'iDiagnosis-src/common.js': [
                'iDiagnosis-src/common/js/app.module.js',
                'iDiagnosis-src/common/**.js',
                '!iDiagnosis-src/common/js/intranet-constant.jss',
                '!iDiagnosis-src/common/js/online-constant.jss'
            ],
            'iDiagnosis-src/index/index.js': [
                'iDiagnosis-src/index/js/*.js',
            ],
            'iDiagnosis-src/config/config.js': [
                'iDiagnosis-src/config/js/*.js',
            ],
            'admission-regist-src/all.js': [
                'admission-regist-src/js/app.module.js',
                'admission-regist-src/js/*.js',
                '!admission-regist-src/fe-api-server/*.js',
                '!admission-regist-src/js/intranet-constant.jss',
                '!admission-regist-src/js/online-constant.jss'
            ],
            'pathology-src/all.js': [
                'pathology-src/js/app.module.js',
                'pathology-src/js/*.js',
                '!pathology-src/fe-api-server/*.js',
                '!pathology-src/js/intranet-constant.jss',
                '!pathology-src/js/online-constant.jss'
            ],
            'daily-shift-src/all.js': [
                'daily-shift-src/js/app.module.js',
                'daily-shift-src/js/*.js',
                '!daily-shift-src/fe-api-server/*.js',
                '!daily-shift-src/js/intranet-constant.jss',
                '!daily-shift-src/js/online-constant.jss'
            ],
            'chronic-disease-src/all.js': [
                'chronic-disease-src/js/app.module.js',
                'chronic-disease-src/js/*.js',
                'chronic-disease-src/form/*.js',
                '!chronic-disease-src/fe-api-server/*.js',
                '!chronic-disease-src/js/intranet-constant.jss',
                '!chronic-disease-src/js/online-constant.jss'
            ],
            'chronic-disease-V2-src/all.js': [
                'chronic-disease-V2-src/js/app.module.js',
                'chronic-disease-V2-src/js/*.js',
                'chronic-disease-V2-src/components/*/*.js',
                'chronic-disease-V2-src/form/*.js',
                '!chronic-disease-V2-src/fe-api-server/*.js',
            ]
        })
    });


// 178 服务器打包配置
fis.media('server180')
    .match('/*-src*/**.js', {
        // fis-optimizer-uglify-js 插件进行压缩，已内置
        optimizer: fis.plugin('uglify-js', {
            compress: {
                drop_console: true
            }
        }),
        parser: fis.plugin('babel-5.x', {
            blacklist: ["useStrict"]
        })
    })
    .match('::package', {
        packager: fis.plugin('map', {
            'env/env.js': [
                'env/env.server180.js'
            ],
            'study-src/all.js': [
                'study-src/*/app.module.js',
                'study-src/*/*.js',
                '!study-src/*/intranet-constant.jss',
                '!study-src/*/online-constant.jss'
            ],
            'scientific-research-src/all.js': [
                'scientific-research-src/*/app.module.js',
                'scientific-research-src/js/*.js',
                'scientific-research-src/form/*.js',
                '!scientific-research-src/*/intranet-constant.jss',
                '!scientific-research-src/*/online-constant.jss'
            ],
            'analysis-src/all.js': [
                'analysis-src/*/app.module.js',
                'analysis-src/*/*.js',
                '!analysis-src/*/intranet-constant.jss',
                '!analysis-src/*/online-constant.jss'
            ],
            'flow-chart-src/all.js': [
                'flow-chart-src/*/app.module.js',
                'flow-chart-src/js/*.js',
                '!flow-chart-src/js/init.fce.js',
                '!flow-chart-src/*/intranet-constant.jss',
                '!flow-chart-src/*/online-constant.jss'
            ],
            'cyjy-eleScreen-src/all.js': [
                'cyjy-eleScreen-src/js/app.module.js',
                'cyjy-eleScreen-src/js/*.js',
                '!cyjy-eleScreen-src/js/intranet-constant.jss',
                '!cyjy-eleScreen-src/js/online-constant.jss'
            ],
            'teleconsultation-src/all.js': [
                'teleconsultation-src/*/app.module.js',
                'teleconsultation-src/*/*.js',
                '!teleconsultation-src/*/intranet-constant.jss',
                '!teleconsultation-src/*/online-constant.jss'
            ],
            'extract-src/all.js': [
                'extract-src/*/app.module.js',
                'extract-src/*/*.js'
            ],
            'outpatient-src/all.js': [
                'outpatient-src/*/app.module.js',
                'outpatient-src/*/*.js',
                '!outpatient-src/*/intranet-constant.jss',
                '!outpatient-src/*/online-constant.jss'
            ],
            'clinic-src/all.js': [
                'clinic-src/*/app.module.js',
                'clinic-src/*/*.js',
                '!clinic-src/*/intranet-constant.jss',
                '!clinic-src/*/online-constant.jss'
            ],
            'temporaries-src/all.js': [
                'temporaries-src/*/app.module.js',
                'temporaries-src/*/*.js',
                '!temporaries-src/*/intranet-constant.jss',
                '!temporaries-src/*/online-constant.jss'
            ],
            'record-src/all.js': [
                'record-src/js2/app.module.js',
                'record-src/js2/*.js',
                '!record-src/js2/intranet-constant.jss',
                '!record-src/js2/online-constant.jss'
            ],
            'record-src-demo/all.js': [
                'record-src-demo/js/app.module.js',
                'record-src-demo/js/*.js'
            ],
            'record-collect-src/all.js': [
                'record-collect-src/js/app.module.js',
                'record-collect-src/js/*.js'
            ],
            'disease-analysis-src/all.js': [
                'disease-analysis-src/js/app.module.js',
                'disease-analysis-src/js/*.js',
                '!disease-analysis-src/js/intranet-constant.jss',
                '!disease-analysis-src/js/online-constant.jss'
            ],
            'record-obstetrics-src/all.js': [
                'record-obstetrics-src/js2/app.module.js',
                'record-obstetrics-src/js2/*.js',
                '!record-obstetrics-src/js2/intranet-constant.jss',
                '!record-obstetrics-src/js2/online-constant.jss'
            ],
            'record-ent-src/all.js': [
                'record-ent-src/*/app.module.js',
                'record-ent-src/*/*.js',
                '!record-ent-src/*/intranet-constant.jss',
                '!record-ent-src/*/online-constant.jss'
            ],
            'extract-service-src/all.js': [
                'extract-service-src/js/app.module.js',
                'extract-service-src/*/*.js',
                '!extract-service-src/*/intranet-constant.jss',
                '!extract-service-src/*/online-constant.jss'
            ],
            'system-management/all.js': [
                'system-management/js/app.module.js',
                'system-management/*/*.js',
                '!system-management/*/intranet-constant.jss',
                '!system-management/*/online-constant.jss'
            ],
            'nursing-src/all.js': [
                'nursing-src/js/app.module.js',
                'nursing-src/*/*.js',
                '!nursing-src/*/intranet-constant.jss',
                '!nursing-src/*/online-constant.jss'
            ],
            'mind-map/all.js': [
                'mind-map/js/app.module.js',
                'mind-map/*/*.js',
                '!mind-map/*/intranet-constant.jss',
                '!mind-map/*/online-constant.jss'
            ],
            'd3-src/all.js': [
                'd3-src/js/app.module.js',
                'd3-src/*/*.js',
                '!d3-src/*/intranet-constant.jss',
                '!d3-src/*/online-constant.jss'
            ],
            'diseases-plan-src/all.js': [
                'diseases-plan-src/js/app.module.js',
                'diseases-plan-src/*/*.js',
                '!diseases-plan-src/*/intranet-constant.jss',
                '!diseases-plan-src/*/online-constant.jss'
            ],
            'extract-src-CRF/all.js': [
                'extract-src-CRF/js/app.module.js',
                'extract-src-CRF/*/*.js'
            ],
            'extract-src-tags/all.js': [
                'extract-src-tags/js/app.module.js',
                'extract-src-tags/*/*.js'
            ],
            'adverse-event-src/all.js': [
                'adverse-event-src/js/app.module.js',
                'adverse-event-src/*/*.js',
                '!adverse-event-src/*/intranet-constant.jss',
                '!adverse-event-src/*/online-constant.jss'
            ],
            'health-view-src/all.js': [
                'health-view-src/js/app.module.js',
                'health-view-src/js/*.js',
                '!health-view-src/js/intranet-constant.jss',
                '!health-view-src/js/online-constant.jss'
            ]
            ,
            'portray-src/all.js': [
                'portray-src/js/app.module.js',
                'portray-src/js/*.js',
                '!portray-src/js/intranet-constant.jss',
                '!portray-src/js/online-constant.jss'
            ],
            'iDiagnosis-src/common.js': [
                'iDiagnosis-src/common/js/app.module.js',
                'iDiagnosis-src/common/**.js',
                '!iDiagnosis-src/common/js/intranet-constant.jss',
                '!iDiagnosis-src/common/js/online-constant.jss'
            ],
            'iDiagnosis-src/index/index.js': [
                'iDiagnosis-src/index/js/*.js',
            ],
            'iDiagnosis-src/config/config.js': [
                'iDiagnosis-src/config/js/*.js',
            ],
            'admission-regist-src/all.js': [
                'admission-regist-src/js/app.module.js',
                'admission-regist-src/js/*.js',
                '!admission-regist-src/fe-api-server/*.js',
                '!admission-regist-src/js/intranet-constant.jss',
                '!admission-regist-src/js/online-constant.jss'
            ],
            'pathology-src/all.js': [
                'pathology-src/js/app.module.js',
                'pathology-src/js/*.js',
                '!pathology-src/fe-api-server/*.js',
                '!pathology-src/js/intranet-constant.jss',
                '!pathology-src/js/online-constant.jss'
            ],
            'daily-shift-src/all.js': [
                'daily-shift-src/js/app.module.js',
                'daily-shift-src/js/*.js',
                '!daily-shift-src/fe-api-server/*.js',
                '!daily-shift-src/js/intranet-constant.jss',
                '!daily-shift-src/js/online-constant.jss'
            ],
            'chronic-disease-src/all.js': [
                'chronic-disease-src/js/app.module.js',
                'chronic-disease-src/js/*.js',
                'chronic-disease-src/form/*.js',
                '!chronic-disease-src/fe-api-server/*.js',
                '!chronic-disease-src/js/intranet-constant.jss',
                '!chronic-disease-src/js/online-constant.jss'
            ],
            'chronic-disease-V2-src/all.js': [
                'chronic-disease-V2-src/js/app.module.js',
                'chronic-disease-V2-src/js/*.js',
                'chronic-disease-V2-src/components/*/*.js',
                'chronic-disease-V2-src/form/*.js',
                '!chronic-disease-V2-src/fe-api-server/*.js',
            ]
        })
    });

// 179 服务器打包配置
fis.media('server179')
    .match('::package', {
        packager: fis.plugin('map', {
            'env/env.js': [
                'env/env.179.js'
            ],
            'study-src/all.js': [
                'study-src/*/app.module.js',
                'study-src/*/*.js'
            ],
            'scientific-research-src/all.js': [
                'scientific-research-src/*/app.module.js',
                'scientific-research-src/js/*.js',
                'scientific-research-src/form/*.js',
                '!scientific-research-src/*/intranet-constant.jss',
                '!scientific-research-src/*/online-constant.jss'
            ],
            'analysis-src/all.js': [
                'analysis-src/*/app.module.js',
                'analysis-src/*/*.js',
                '!analysis-src/*/intranet-constant.jss',
                '!analysis-src/*/online-constant.jss'
            ],
            'flow-chart-src/all.js': [
                'flow-chart-src/*/app.module.js',
                'flow-chart-src/js/*.js',
                '!flow-chart-src/js/init.fce.js',
                '!flow-chart-src/*/intranet-constant.jss',
                '!flow-chart-src/*/online-constant.jss'
            ],
            'cyjy-eleScreen-src/all.js': [
                'cyjy-eleScreen-src/js/app.module.js',
                'cyjy-eleScreen-src/js/*.js',
                '!cyjy-eleScreen-src/js/intranet-constant.jss',
                '!cyjy-eleScreen-src/js/online-constant.jss'
            ],
            'teleconsultation-src/all.js': [
                'teleconsultation-src/*/app.module.js',
                'teleconsultation-src/*/*.js',
                '!teleconsultation-src/*/intranet-constant.jss',
                '!teleconsultation-src/*/online-constant.jss'
            ],
            'extract-src/all.js': [
                'extract-src/*/app.module.js',
                'extract-src/*/*.js'
            ],
            'outpatient-src/all.js': [
                'outpatient-src/*/app.module.js',
                'outpatient-src/*/*.js',
                '!outpatient-src/*/intranet-constant.jss',
                '!outpatient-src/*/online-constant.jss'
            ],
            'clinic-src/all.js': [
                'clinic-src/*/app.module.js',
                'clinic-src/*/*.js',
                '!clinic-src/*/intranet-constant.jss',
                '!clinic-src/*/online-constant.jss'
            ],
            'temporaries-src/all.js': [
                'temporaries-src/*/app.module.js',
                'temporaries-src/*/*.js',
                '!temporaries-src/*/intranet-constant.jss',
                '!temporaries-src/*/online-constant.jss'
            ],
            'record-src/all.js': [
                'record-src/js2/app.module.js',
                'record-src/js2/*.js',
                '!record-src/js2/intranet-constant.jss',
                '!record-src/js2/online-constant.jss'
            ],
            'record-src-demo/all.js': [
                'record-src-demo/js/app.module.js',
                'record-src-demo/js/*.js'
            ],
            'record-collect-src/all.js': [
                'record-collect-src/js/app.module.js',
                'record-collect-src/js/*.js'
            ],
            'disease-analysis-src/all.js': [
                'disease-analysis-src/js/app.module.js',
                'disease-analysis-src/js/*.js',
                '!disease-analysis-src/js/intranet-constant.jss',
                '!disease-analysis-src/js/online-constant.jss'
            ],
            'record-obstetrics-src/all.js': [
                'record-obstetrics-src/js2/app.module.js',
                'record-obstetrics-src/js2/*.js',
                '!record-obstetrics-src/js2/intranet-constant.jss',
                '!record-obstetrics-src/js2/online-constant.jss'
            ],
            'record-ent-src/all.js': [
                'record-ent-src/*/app.module.js',
                'record-ent-src/*/*.js',
                '!record-ent-src/*/intranet-constant.jss',
                '!record-ent-src/*/online-constant.jss'
            ],
            'extract-service-src/all.js': [
                'extract-service-src/js/app.module.js',
                'extract-service-src/*/*.js'
            ],
            'system-management/all.js': [
                'system-management/js/app.module.js',
                'system-management/*/*.js',
                '!system-management/*/intranet-constant.jss',
                '!system-management/*/online-constant.jss'
            ],
            'nursing-src/all.js': [
                'nursing-src/js/app.module.js',
                'nursing-src/*/*.js',
                '!nursing-src/*/intranet-constant.jss',
                '!nursing-src/*/online-constant.jss'
            ],
            'mind-map/all.js': [
                'mind-map/js/app.module.js',
                'mind-map/*/*.js',
                '!mind-map/*/intranet-constant.jss',
                '!mind-map/*/online-constant.jss'
            ],
            'd3-src/all.js': [
                'd3-src/js/app.module.js',
                'd3-src/*/*.js',
                '!d3-src/*/intranet-constant.jss',
                '!d3-src/*/online-constant.jss'
            ],
            'diseases-plan-src/all.js': [
                'diseases-plan-src/js/app.module.js',
                'diseases-plan-src/*/*.js',
                '!diseases-plan-src/*/intranet-constant.jss',
                '!diseases-plan-src/*/online-constant.jss'
            ],
            'extract-src-CRF/all.js': [
                'extract-src-CRF/js/app.module.js',
                'extract-src-CRF/*/*.js'
            ],
            'extract-src-tags/all.js': [
                'extract-src-tags/js/app.module.js',
                'extract-src-tags/*/*.js'
            ],
            'adverse-event-src/all.js': [
                'adverse-event-src/js/app.module.js',
                'adverse-event-src/*/*.js',
                '!adverse-event-src/*/intranet-constant.jss',
                '!adverse-event-src/*/online-constant.jss'
            ],
            'health-view-src/all.js': [
                'health-view-src/js/app.module.js',
                'health-view-src/js/*.js',
                '!health-view-src/js/intranet-constant.jss',
                '!health-view-src/js/online-constant.jss'
            ]
            ,
            'portray-src/all.js': [
                'portray-src/js/app.module.js',
                'portray-src/js/*.js',
                '!portray-src/js/intranet-constant.jss',
                '!portray-src/js/online-constant.jss'
            ],
            'iDiagnosis-src/common.js': [
                'iDiagnosis-src/common/js/app.module.js',
                'iDiagnosis-src/common/**.js',
                '!iDiagnosis-src/common/js/intranet-constant.jss',
                '!iDiagnosis-src/common/js/online-constant.jss'
            ],
            'iDiagnosis-src/index/index.js': [
                'iDiagnosis-src/index/js/*.js',
            ],
            'iDiagnosis-src/config/config.js': [
                'iDiagnosis-src/config/js/*.js',
            ],
            'admission-regist-src/all.js': [
                'admission-regist-src/js/app.module.js',
                'admission-regist-src/js/*.js',
                '!admission-regist-src/fe-api-server/*.js',
                '!admission-regist-src/js/intranet-constant.jss',
                '!admission-regist-src/js/online-constant.jss'
            ],
            'pathology-src/all.js': [
                'pathology-src/js/app.module.js',
                'pathology-src/js/*.js',
                '!pathology-src/fe-api-server/*.js',
                '!pathology-src/js/intranet-constant.jss',
                '!pathology-src/js/online-constant.jss'
            ],
            'daily-shift-src/all.js': [
                'daily-shift-src/js/app.module.js',
                'daily-shift-src/js/*.js',
                '!daily-shift-src/fe-api-server/*.js',
                '!daily-shift-src/js/intranet-constant.jss',
                '!daily-shift-src/js/online-constant.jss'
            ],
            'chronic-disease-src/all.js': [
                'chronic-disease-src/js/app.module.js',
                'chronic-disease-src/js/*.js',
                'chronic-disease-src/form/*.js',
                '!chronic-disease-src/fe-api-server/*.js',
                '!chronic-disease-src/js/intranet-constant.jss',
                '!chronic-disease-src/js/online-constant.jss'
            ],
            'chronic-disease-V2-src/all.js': [
                'chronic-disease-V2-src/js/app.module.js',
                'chronic-disease-V2-src/js/*.js',
                'chronic-disease-V2-src/components/*/*.js',
                'chronic-disease-V2-src/form/*.js',
                '!chronic-disease-V2-src/fe-api-server/*.js',
            ]
        })
    });




// 178 服务器打包配置
fis.media('aliyun')
    .match('/*-src*/**.js', {
        // fis-optimizer-uglify-js 插件进行压缩，已内置
        optimizer: fis.plugin('uglify-js', {
            compress: {
                drop_console: true
            }
        }),
        parser: fis.plugin('babel-5.x', {
            blacklist: ["useStrict"]
        })
    })
    .match('::package', {
        packager: fis.plugin('map', {
            'env/env.js': [
                'env/env.aliyun.js'
            ],
            'study-src/all.js': [
                'study-src/*/app.module.js',
                'study-src/*/*.js',
                '!study-src/*/intranet-constant.jss',
                '!study-src/*/online-constant.jss'
            ],
            'scientific-research-src/all.js': [
                'scientific-research-src/*/app.module.js',
                'scientific-research-src/js/*.js',
                'scientific-research-src/form/*.js',
                '!scientific-research-src/*/intranet-constant.jss',
                '!scientific-research-src/*/online-constant.jss'
            ],
            'analysis-src/all.js': [
                'analysis-src/*/app.module.js',
                'analysis-src/*/*.js',
                '!analysis-src/*/intranet-constant.jss',
                '!analysis-src/*/online-constant.jss'
            ],
            'flow-chart-src/all.js': [
                'flow-chart-src/*/app.module.js',
                'flow-chart-src/js/*.js',
                '!flow-chart-src/js/init.fce.js',
                '!flow-chart-src/*/intranet-constant.jss',
                '!flow-chart-src/*/online-constant.jss'
            ],
            'cyjy-eleScreen-src/all.js': [
                'cyjy-eleScreen-src/js/app.module.js',
                'cyjy-eleScreen-src/js/*.js',
                '!cyjy-eleScreen-src/js/intranet-constant.jss',
                '!cyjy-eleScreen-src/js/online-constant.jss'
            ],
            'teleconsultation-src/all.js': [
                'teleconsultation-src/*/app.module.js',
                'teleconsultation-src/*/*.js',
                '!teleconsultation-src/*/intranet-constant.jss',
                '!teleconsultation-src/*/online-constant.jss'
            ],
            'extract-src/all.js': [
                'extract-src/*/app.module.js',
                'extract-src/*/*.js'
            ],
            'outpatient-src/all.js': [
                'outpatient-src/*/app.module.js',
                'outpatient-src/*/*.js',
                '!outpatient-src/*/intranet-constant.jss',
                '!outpatient-src/*/online-constant.jss'
            ],
            'clinic-src/all.js': [
                'clinic-src/*/app.module.js',
                'clinic-src/*/*.js',
                '!clinic-src/*/intranet-constant.jss',
                '!clinic-src/*/online-constant.jss'
            ],
            'temporaries-src/all.js': [
                'temporaries-src/*/app.module.js',
                'temporaries-src/*/*.js',
                '!temporaries-src/*/intranet-constant.jss',
                '!temporaries-src/*/online-constant.jss'
            ],
            'record-src/all.js': [
                'record-src/js2/app.module.js',
                'record-src/js2/*.js',
                '!record-src/js2/intranet-constant.jss',
                '!record-src/js2/online-constant.jss'
            ],
            'record-src-demo/all.js': [
                'record-src-demo/js/app.module.js',
                'record-src-demo/js/*.js'
            ],
            'record-collect-src/all.js': [
                'record-collect-src/js/app.module.js',
                'record-collect-src/js/*.js'
            ],
            'disease-analysis-src/all.js': [
                'disease-analysis-src/js/app.module.js',
                'disease-analysis-src/js/*.js',
                '!disease-analysis-src/js/intranet-constant.jss',
                '!disease-analysis-src/js/online-constant.jss'
            ],
            'record-obstetrics-src/all.js': [
                'record-obstetrics-src/js2/app.module.js',
                'record-obstetrics-src/js2/*.js',
                '!record-obstetrics-src/js2/intranet-constant.jss',
                '!record-obstetrics-src/js2/online-constant.jss'
            ],
            'record-ent-src/all.js': [
                'record-ent-src/*/app.module.js',
                'record-ent-src/*/*.js',
                '!record-ent-src/*/intranet-constant.jss',
                '!record-ent-src/*/online-constant.jss'
            ],
            'extract-service-src/all.js': [
                'extract-service-src/js/app.module.js',
                'extract-service-src/*/*.js',
                '!extract-service-src/*/intranet-constant.jss',
                '!extract-service-src/*/online-constant.jss'
            ],
            'system-management/all.js': [
                'system-management/js/app.module.js',
                'system-management/*/*.js',
                '!system-management/*/intranet-constant.jss',
                '!system-management/*/online-constant.jss'
            ],
            'nursing-src/all.js': [
                'nursing-src/js/app.module.js',
                'nursing-src/*/*.js',
                '!nursing-src/*/intranet-constant.jss',
                '!nursing-src/*/online-constant.jss'
            ],
            'mind-map/all.js': [
                'mind-map/js/app.module.js',
                'mind-map/*/*.js',
                '!mind-map/*/intranet-constant.jss',
                '!mind-map/*/online-constant.jss'
            ],
            'd3-src/all.js': [
                'd3-src/js/app.module.js',
                'd3-src/*/*.js',
                '!d3-src/*/intranet-constant.jss',
                '!d3-src/*/online-constant.jss'
            ],
            'diseases-plan-src/all.js': [
                'diseases-plan-src/js/app.module.js',
                'diseases-plan-src/*/*.js',
                '!diseases-plan-src/*/intranet-constant.jss',
                '!diseases-plan-src/*/online-constant.jss'
            ],
            'extract-src-CRF/all.js': [
                'extract-src-CRF/js/app.module.js',
                'extract-src-CRF/*/*.js'
            ],
            'extract-src-tags/all.js': [
                'extract-src-tags/js/app.module.js',
                'extract-src-tags/*/*.js'
            ],
            'adverse-event-src/all.js': [
                'adverse-event-src/js/app.module.js',
                'adverse-event-src/*/*.js',
                '!adverse-event-src/*/intranet-constant.jss',
                '!adverse-event-src/*/online-constant.jss'
            ],
            'health-view-src/all.js': [
                'health-view-src/js/app.module.js',
                'health-view-src/js/*.js',
                '!health-view-src/js/intranet-constant.jss',
                '!health-view-src/js/online-constant.jss'
            ]
            ,
            'portray-src/all.js': [
                'portray-src/js/app.module.js',
                'portray-src/js/*.js',
                '!portray-src/js/intranet-constant.jss',
                '!portray-src/js/online-constant.jss'
            ],
            'iDiagnosis-src/common.js': [
                'iDiagnosis-src/common/js/app.module.js',
                'iDiagnosis-src/common/**.js',
                '!iDiagnosis-src/common/js/intranet-constant.jss',
                '!iDiagnosis-src/common/js/online-constant.jss'
            ],
            'iDiagnosis-src/index/index.js': [
                'iDiagnosis-src/index/js/*.js',
            ],
            'iDiagnosis-src/config/config.js': [
                'iDiagnosis-src/config/js/*.js',
            ],
            'admission-regist-src/all.js': [
                'admission-regist-src/js/app.module.js',
                'admission-regist-src/js/*.js',
                '!admission-regist-src/fe-api-server/*.js',
                '!admission-regist-src/js/intranet-constant.jss',
                '!admission-regist-src/js/online-constant.jss'
            ],
            'pathology-src/all.js': [
                'pathology-src/js/app.module.js',
                'pathology-src/js/*.js',
                '!pathology-src/fe-api-server/*.js',
                '!pathology-src/js/intranet-constant.jss',
                '!pathology-src/js/online-constant.jss'
            ],
            'daily-shift-src/all.js': [
                'daily-shift-src/js/app.module.js',
                'daily-shift-src/js/*.js',
                '!daily-shift-src/fe-api-server/*.js',
                '!daily-shift-src/js/intranet-constant.jss',
                '!daily-shift-src/js/online-constant.jss'
            ],
            'chronic-disease-src/all.js': [
                'chronic-disease-src/js/app.module.js',
                'chronic-disease-src/js/*.js',
                'chronic-disease-src/form/*.js',
                '!chronic-disease-src/fe-api-server/*.js',
                '!chronic-disease-src/js/intranet-constant.jss',
                '!chronic-disease-src/js/online-constant.jss'
            ],
            'chronic-disease-V2-src/all.js': [
                'chronic-disease-V2-src/js/app.module.js',
                'chronic-disease-V2-src/js/*.js',
                'chronic-disease-V2-src/components/*/*.js',
                'chronic-disease-V2-src/form/*.js',
                '!chronic-disease-V2-src/fe-api-server/*.js',
            ]
        })
    });

// 301 医院内网
fis.media('hospital301')
    .match('/*-src*/**.js', {
        // fis-optimizer-uglify-js 插件进行压缩，已内置
        optimizer: fis.plugin('uglify-js', {
            compress: {
                drop_console: true
            }
        }),
        parser: fis.plugin('babel-5.x', {   // es6 语法转义
            blacklist: ["useStrict"],
            compact: false
        })
    })
    .match('::package', {
        packager: fis.plugin('map', {
            'env/env.js': [
                'env/env.hospital301.js'
            ],
            'study-src/all.js': [
                'study-src/*/app.module.js',
                'study-src/*/*.js',
                '!study-src/*/constant.js',
                '!study-src/*/online-constant.jss'
            ],
            'scientific-research-src/all.js': [
                'scientific-research-src/*/app.module.js',
                'scientific-research-src/js/*.js',
                'scientific-research-src/form/*.js',
                '!scientific-research-src/*/constant.js',
                '!scientific-research-src/*/online-constant.jss'
            ],
            'analysis-src/all.js': [
                'analysis-src/*/app.module.js',
                'analysis-src/*/*.js',
                '!analysis-src/*/constant.js',
                '!analysis-src/*/online-constant.jss'
            ],
            'flow-chart-src/all.js': [
                'flow-chart-src/*/app.module.js',
                'flow-chart-src/js/*.js',
                '!flow-chart-src/js/init.fce.js',
                '!flow-chart-src/*/constant.js',
                '!flow-chart-src/*/online-constant.jss'
            ],
            'teleconsultation-src/all.js': [
                'teleconsultation-src/*/app.module.js',
                'teleconsultation-src/*/*.js',
                '!teleconsultation-src/*/constant.js',
                '!teleconsultation-src/*/online-constant.jss'
            ],
            'extract-src/all.js': [
                'extract-src/*/app.module.js',
                'extract-src/*/*.js'
            ],
            'outpatient-src/all.js': [
                'outpatient-src/*/app.module.js',
                'outpatient-src/*/*.js',
            ],
            'clinic-src/all.js': [
                'clinic-src/*/app.module.js',
                'clinic-src/*/*.js',
                '!clinic-src/*/constant.js',
                '!clinic-src/*/online-constant.jss'
            ],
            'temporaries-src/all.js': [
                'temporaries-src/*/app.module.js',
                'temporaries-src/*/*.js',
                '!temporaries-src/*/constant.js',
                '!temporaries-src/*/online-constant.jss'
            ],
            'record-src/all.js': [
                'record-src/js2/app.module.js',
                'record-src/js2/*.js',
                '!record-src/js2/constant.js',
                '!record-src/js2/online-constant.jss'
            ],
            'record-src-demo/all.js': [
                'record-src-demo/js/app.module.js',
                'record-src-demo/js/*.js'
            ],
            'disease-analysis-src/all.js': [
                'disease-analysis-src/js/app.module.js',
                'disease-analysis-src/*/*.js',
                '!disease-analysis-src/*/online-constant.jss',
                '!disease-analysis-src/*/constant.js'
            ],
            'record-obstetrics-src/all.js': [
                'record-obstetrics-src/js2/app.module.js',
                'record-obstetrics-src/js2/*.js',
                '!record-obstetrics-src/js2/constant.js',
                '!record-obstetrics-src/js2/online-constant.jss'
            ],
            'record-ent-src/all.js': [
                'record-ent-src/*/app.module.js',
                'record-ent-src/*/*.js',
                '!record-ent-src/*/constant.js',
                '!record-ent-src/*/online-constant.jss'
            ],

            'record-collect-src/all.js': [
                'record-collect-src/js/app.module.js',
                'record-collect-src/js/*.js'
            ],
            'extract-service-src/all.js': [
                'extract-service-src/js/app.module.js',
                'extract-service-src/*/*.js',
            ],
            'system-management/all.js': [
                'system-management/js/app.module.js',
                'system-management/*/*.js',
            ],
            'nursing-src/all.js': [
                'nursing-src/js/app.module.js',
                'nursing-src/*/*.js',
                '!nursing-src/*/constant.js',
                '!nursing-src/*/online-constant.jss'
            ],
            'mind-map/all.js': [
                'mind-map/js/app.module.js',
                'mind-map/*/*.js',
                '!mind-map/*/constant.js',
                '!mind-map/*/online-constant.jss'
            ],
            'diseases-plan-src/all.js': [
                'diseases-plan-src/js/app.module.js',
                'diseases-plan-src/*/*.js',
                '!diseases-plan-src/*/constant.js',
                '!diseases-plan-src/*/online-constant.jss'
            ],
            'd3-src/all.js': [
                'd3-src/js/app.module.js',
                'd3-src/*/*.js',
                '!d3-src/*/constant.js',
                '!d3-src/*/online-constant.jss'
            ],
            'extract-src-CRF/all.js': [
                'extract-src-CRF/js/app.module.js',
                'extract-src-CRF/*/*.js'
            ],
            'adverse-event-src/all.js': [
                'adverse-event-src/js/app.module.js',
                'adverse-event-src/*/*.js',
                '!adverse-event-src/*/constant.js',
                '!adverse-event-src/*/online-constant.jss'
            ],
            'health-view-src/all.js': [
                'health-view-src/js/app.module.js',
                'health-view-src/js/*.js',
                '!health-view-src/js/constant.js',
                '!health-view-src/js/online-constant.jss'
            ]
            ,
            'portray-src/all.js': [
                'portray-src/js/app.module.js',
                'portray-src/js/*.js',
                '!portray-src/js/constant.js',
                '!portray-src/js/online-constant.jss'
            ],
            'cyjy-eleScreen-src/all.js': [
                'cyjy-eleScreen-src/js/app.module.js',
                'cyjy-eleScreen-src/js/*.js',
                '!cyjy-eleScreen-src/js/constant.js',
                '!cyjy-eleScreen-src/js/online-constant.jss'
            ],
            'iDiagnosis-src/common.js': [
                'iDiagnosis-src/common/js/app.module.js',
                'iDiagnosis-src/common/**.js',
                '!iDiagnosis-src/common/js/constant.js',
                '!iDiagnosis-src/common/js/online-constant.jss'
            ],
            'iDiagnosis-src/index/index.js': [
                'iDiagnosis-src/index/js/*.js',
            ],
            'iDiagnosis-src/config/config.js': [
                'iDiagnosis-src/config/js/*.js',
            ],
            'admission-regist-src/all.js': [
                'admission-regist-src/js/app.module.js',
                'admission-regist-src/js/*.js',
                '!admission-regist-src/fe-api-server/*.js',
                '!admission-regist-src/js/constant.js',
                '!admission-regist-src/js/online-constant.js'
            ],
            'pathology-src/all.js': [
                'pathology-src/js/app.module.js',
                'pathology-src/js/*.js',
                '!pathology-src/fe-api-server/*.js',
                '!pathology-src/js/constant.js',
                '!pathology-src/js/online-constant.js'
            ],
            'chronic-disease-src/all.js': [
                'chronic-disease-src/js/app.module.js',
                'chronic-disease-src/js/*.js',
                'chronic-disease-src/form/*.js',
                '!chronic-disease-src/fe-api-server/*.js',
                '!chronic-disease-src/js/constant.js',
                '!chronic-disease-src/js/online-constant.jss'
            ],
            'daily-shift-src/all.js': [
                'daily-shift-src/js/app.module.js',
                'daily-shift-src/js/*.js',
                '!daily-shift-src/fe-api-server/*.js',
                '!daily-shift-src/js/constant.js',
                '!daily-shift-src/js/online-constant.js'
            ],
            'chronic-disease-src/all.js': [
                'chronic-disease-src/js/app.module.js',
                'chronic-disease-src/js/*.js',
                'chronic-disease-src/form/*.js',
                '!chronic-disease-src/fe-api-server/*.js',
                '!chronic-disease-src/js/constant.js',
                '!chronic-disease-src/js/online-constant.jss'
            ],
            'chronic-disease-V2-src/all.js': [
                'chronic-disease-V2-src/js/app.module.js',
                'chronic-disease-V2-src/js/*.js',
                'chronic-disease-V2-src/components/*/*.js',
                'chronic-disease-V2-src/form/*.js',
                '!chronic-disease-V2-src/fe-api-server/*.js',
            ]
        })
    });

// server181
fis.media('server181')
    .match('/*-src*/**.js', {
        // fis-optimizer-uglify-js 插件进行压缩，已内置
        optimizer: fis.plugin('uglify-js', {
            compress: {
                drop_console: true
            }
        }),
        parser: fis.plugin('babel-5.x', {   // es6 语法转义
            blacklist: ["useStrict"],
            compact: false
        })
    })
    .match('::package', {
        packager: fis.plugin('map', {
            'env/env.js': [
                'env/env.server181.js'
            ],
            'system-management/all.js': [
                'system-management/js/app.module.js',
                'system-management/*/*.js',
                '!system-management/*/intranet-constant.jss',
                '!system-management/*/online-constant.jss'
            ],
            'record-src-demo/all.js': [
                'record-src-demo/js/app.module.js',
                'record-src-demo/js/*.js'
            ],
            'chronic-disease-V2-src/all.js': [
                'chronic-disease-V2-src/js/app.module.js',
                'chronic-disease-V2-src/js/*.js',
                'chronic-disease-V2-src/components/*/*.js',
                'chronic-disease-V2-src/form/*.js',
                '!chronic-disease-V2-src/fe-api-server/*.js',
            ]
        })
    });

// server182
fis.media('server182')
.match('/*-src*/**.js', {
    // fis-optimizer-uglify-js 插件进行压缩，已内置
    optimizer: fis.plugin('uglify-js', {
        compress: {
            drop_console: true
        }
    }),
    parser: fis.plugin('babel-5.x', {   // es6 语法转义
        blacklist: ["useStrict"],
        compact: false
    })
})
.match('::package', {
    packager: fis.plugin('map', {
        'env/env.js': [
            'env/env.server182.js'
        ],
        'system-management/all.js': [
            'system-management/js/app.module.js',
            'system-management/*/*.js',
            '!system-management/*/intranet-constant.jss',
            '!system-management/*/online-constant.jss'
        ],
        'record-src-demo/all.js': [
            'record-src-demo/js/app.module.js',
            'record-src-demo/js/*.js'
        ],
        'chronic-disease-V2-src/all.js': [
            'chronic-disease-V2-src/js/app.module.js',
            'chronic-disease-V2-src/js/*.js',
            'chronic-disease-V2-src/components/*/*.js',
            'chronic-disease-V2-src/form/*.js',
            '!chronic-disease-V2-src/fe-api-server/*.js',
        ]
    })
});

// server175
fis.media('server175')
    .match('/*-src*/**.js', {
        // fis-optimizer-uglify-js 插件进行压缩，已内置
        optimizer: fis.plugin('uglify-js', {
            compress: {
                drop_console: true
            }
        }),
        parser: fis.plugin('babel-5.x', {   // es6 语法转义
            blacklist: ["useStrict"],
            compact: false
        })
    })
    .match('::package', {
        packager: fis.plugin('map', {
            'env/env.js': [
                'env/env.server175.js'
            ],
            'system-management/all.js': [
                'system-management/js/app.module.js',
                'system-management/*/*.js',
                '!system-management/*/intranet-constant.jss',
                '!system-management/*/online-constant.jss'
            ],
            'pathology-src/all.js': [
                'pathology-src/js/app.module.js',
                'pathology-src/js/*.js',
                '!pathology-src/fe-api-server/*.js',
            ],
            'admission-regist-src/all.js': [
                'admission-regist-src/js/app.module.js',
                'admission-regist-src/js/*.js',
                '!admission-regist-src/fe-api-server/*.js',
                '!admission-regist-src/js/intranet-constant.js',
                '!admission-regist-src/js/online-constant.js'
            ],
            'daily-shift-src/all.js': [
                'daily-shift-src/js/app.module.js',
                'daily-shift-src/js/*.js',
                '!daily-shift-src/fe-api-server/*.js',
                '!daily-shift-src/js/intranet-constant.js',
                '!daily-shift-src/js/online-constant.js'
            ]
        })
    });