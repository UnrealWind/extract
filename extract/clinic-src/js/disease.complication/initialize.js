function initialize() {

    totalContributions=0;
    renderLinks=[];
    cands=[]; //nodesById的数据数组，每条数据还包括relatedLinks空数组,currentAmount = Number(Amount)
    //为了在设置线的显示标题时方便查找，用此方法定义数据
    pacs=[];  //=pacsHouse,data.src的数据
    contr=[]; //=c_house,data.links中数据，每条数据中多了一个key = "Hn",n是links数组中数据所在的index

    if (office=="house") {
        var root={};
        var d={};
        d.value=total_hDems;
        d.children=h_dems;

        var r={};
        r.value=total_hReps;
        r.children=h_reps;

        var o={};
        o.value=total_hOthers;
        o.children=h_others;

        root.children=[r,d,o];
        root.PTY="root";

        // root={PTY:"root",children:[{value:total_hOthers,children:[h_reps的值]},{},{}]}
        //运用v3生成圆点，x,y为坐标，r为圆点的半径，r的大小由value的大小决定
        nodes=bubble.nodes(root);
        // nodes =[{root的值+depth：0 第一层}，{root里面的children的值+depth：1 第二层}，{nodes中各个数据的值+depth：2+x、y、r的坐标}]
        var totalCandAmount=0;  //nodes中depth=2的Amount的和
        nodes.forEach (function (d) {
            if (d.depth==2) {
                nodesById[d.CAND_ID]=d;  //nodes中depth=2的值
                d.relatedLinks=[];
                d.Amount=Number(d.Amount);
                d.currentAmount= d.Amount;
                cands.push(d); //nodes中depth=2的值+Amount、currentAmount
                totalCandAmount+= d.Amount;  //nodes中depth=2的Amount的和
            }
        })
        log("totalCandAmount=" + totalCandAmount);
        pacs=pacsHouse;
        c_house.forEach(function (d) {
            contr.push(d);
        });
    }
    else if (office=="senate") {
        var root={};
        var d={};
        d.value=total_sDems;
        d.children=s_dems;

        var r={};
        r.value=total_sReps;
        r.children=s_reps;

        var o={};
        o.value=total_sOthers;
        o.children=s_others;

        root.children=[r,d,o];
        root.PTY="root";

        nodes=bubble.nodes(root);

        var totalCandAmount=0;
        nodes.forEach (function (d) {
            if (d.depth==2) {
                nodesById[d.CAND_ID]=d;
                d.relatedLinks=[];
                d.Amount=Number(d.Amount);
                d.currentAmount= d.Amount;
                cands.push(d);
                // candsDatas[d.CAND_ID] = d;
                totalCandAmount+= d.Amount;
            }
        })

        log("totalCandAmount=" + totalCandAmount);
        pacs=pacsSenate;
        c_senate.forEach(function (d) {
            contr.push(d);
        });
    }

    //设置弧上的一些点
    buildChords();

    var totalContr=0;
    contr.forEach(function (d) {
        nodesById[d.CAND_ID].relatedLinks.push(d);   //nodesById[CAND_ID].relatedLinkscontr：nodesById中CAND_ID与contr中CAND_ID相同时，将此contr值放入relatedLinks
        chordsById[d.CMTE_ID].relatedLinks.push(d); //chordsById[CMTE_ID].relatedLinkscontr：chordsById中CMTE_ID与contr中CMTE_ID相同时，将此contr值放入relatedLinks
        totalContr+= Number(d.TRANSACTION_AMT);  //与totalPacAmount相等
    })

    log("totalContributions=" + totalContr);


    log("initialize()");

}
