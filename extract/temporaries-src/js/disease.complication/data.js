
/**
 *
 * DATA SOURCE:  http://www.fec.gov/data/index.jsp/
 *
 */

/**
 * Daisy Chain Data Fetches to ensure all data is loaded prior to updates (async calls)
 */

// var dataDispatch=d3.dispatch("end");
var dataCalls=[];
var numCalls=0;

function fetchData(data) {
    linkGroup = undefined ;

    cns=[],  //data.nodes中数组形式转化成对象形式，cns[CAND_ID] = nodes中某条数据，多了一个与Amount数值相同的value属性
        cands=[],  //nodesById的数据数组，每条数据还包括relatedLinks空数组,currentAmount = Number(Amount)
        pacs=[],  //=pacsHouse,data.src的数据
        pacsHouse=[],   //data.src的数据
        pacsSentate=[],
        contr=[],  //=c_house,
        h_dems=[],  //data.nodes中PTY="DEM"的数据集合，多了一个与Amount数值相同的value属性
        h_reps=[],  //data.nodes中PTY="REP"的数据集合，多了一个与Amount数值相同的value属性
        h_others=[],  //data.nodes中PTY != "DEM" && PTY != "REP"的数据集合，多了一个与Amount数值相同的value属性
        house=[];   //data.nodes中数据的数组形式，多了一个与Amount数值相同的value属性
    s_dems=[],
        s_reps=[],
        s_others=[],
        senate=[],
        total_hDems=0,  //data.nodes中PTY="DEM"的数据中Amount的总和
        total_sDems=0,
        total_hReps=0,  //data.nodes中PTY="REP"的数据中Amount的总和
        total_sReps=0,
        total_hOthers=0,  //data.nodes中PTY != "DEM" && PTY != "REP"的数据中Amount的总和
        total_sOthers=0,
        contributions=[], //与c_house数据相同
        c_senate=[];
    c_house=[];  //data.links中数据，每条数据中多了一个key = "Hn",n是links数组中数据所在的index
    pacs=[],
        pacsById={},  //data.src中数组形式转化成对象形式，pacsById["house_1811000"] = CMTE_ID为1811000的那一条数据
        chordsById={}, //chordsById[CMTE_ID] 弧上的一些设置，包括位置，x、y等
        nodesById={},  //圆点的数据对象,h_dems和h_reps和h_others的数据组合，其中还包括圆点的x、y、r；即initialize中nodes里面depth=2的数据汇总
        chordCount=20,
        pText=null,
        pChords=null,
        nodes=[],  //nodes =[{root的值+depth：0 第一层}，{root里面的children的值+depth：1 第二层}，{nodes中各个数据的值+depth：2+x、y、r的坐标}]
        renderLinks=[],
        colorByName={},
        totalContributions=0,
        delay=2;

    dataCalls=[];
    
    onFetchPacsHouse(data.arcs);
    onFetchCandidatesHouse(data.nodes);
    onFetchContributionsHouse(data.links);
    main();
}

function onFetchCandidatesSenate(csv) {

    for (var i=0; i < csv.length; i++) {
        var r=csv[i];
        r.value=Number(r.Amount);
        cns[r.CAND_ID]=r;

        senate.push(r);
        if (r.PTY=="REP") {
            s_reps.push(r);
            total_sReps+= r.value;
        }
        else if (r.PTY=="DEM") {
            s_dems.push(r)
            total_sDems+= r.value;
        }
        else {
            s_others.push(r);
            total_sOthers+= r.value;
        }

    }

    log("onFetchCandidatesSenate()");
    endFetch();
}

function onFetchCandidatesHouse(csv) {
    for (var i=0; i < csv.length; i++) {
        var r=csv[i];
        r.value=Number(r.Amount);
        cns[r.CAND_ID]=r;
        house.push(r);
        if (r.PTY=="REP") {
            h_reps.push(r);
            total_hReps+= r.value;
        }
        else if (r.PTY=="DEM") {
            h_dems.push(r)
            total_hDems+= r.value;
        }
        else {
            h_others.push(r);
            total_hOthers+= r.value;
        }
    }
    log("onFetchCandidatesHouse()");
    endFetch();
}

function onFetchContributionsSenate(csv) {

    var i=0;
    csv.forEach(function (d) {
        d.Key="S"+(i++);
        contributions.push(d);
        c_senate.push(d);
    });

    log("onFetchContributionsSenate()");
    endFetch();

}

function onFetchContributionsHouse(csv) {
    var i=0;
    csv.forEach(function (d) {
        d.Key="H"+(i++);
        contributions.push(d);
        c_house.push(d);
    });

    log("onFetchContributionsHouse()");
    endFetch();

}

function onFetchPacsHouse(csv) {
    pacsHouse=csv;
    for (var i=0; i < pacsHouse.length; i++) {
        pacsById["house_" + pacsHouse[i].CMTE_ID]=pacsHouse[i];
    }

    log("onFetchPacsHouse()");
    endFetch();


}

function onFetchPacsSenate(csv) {

    pacsSenate=csv;
    for (var i=0; i < pacsSenate.length; i++) {
        pacsById["senate_" + pacsSenate[i].CMTE_ID]=pacsSenate[i];
    }

    log("onFetchPacsSenate()");
    endFetch();

}


function addStream(file,func) {
    var o={};
    o.file=file;
    o.function=func;
    dataCalls.push(o);
}

function startFetch() {
    numCalls=dataCalls.length;
    dataCalls.forEach(function (d) {
        d3.csv(d.file, d.function);
    })
}

function endFetch() {
    numCalls--;
    if (numCalls==0) {
        // dataDispatch.end();
        main();
    }
}
