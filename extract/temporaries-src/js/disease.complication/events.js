
function getWidth(array){
    if( array.length > 0 ){
        var num =0;
        for( var idx=0,length = array.length ; idx< length;idx++){
            if( num < array[idx].length ){
                num = array[idx].length;
            }
        }
        return num * 13+40 +'px';
    }
}

function node_onMouseOver(d,type) {
    if (type=="CAND") {// 点  cands里的数据
        if(d.depth < 2) return;
        toolTip.transition()
            .duration(200)
            .style("opacity", ".9");

        var name = d.CAND_NAME;
        var title = "疾病";
        ratio = (100*d.Amount/d.total).toFixed(2);
        // 各占' +(ratio)+'%';
        var text ="共: " + formatCurrency(Number(d.Amount)) +'人次';
        var height = '120px';
        var width = '300px';
        var names = name.split(',');
        if( names.length > 1 ){
            // text += '，每种1人次';
            name = names.slice(0,5).join(',');
            name += '<br />等'+names.length+'种';
            width = getWidth(names.slice(0,5));
            height = 'auto';
        }

        header1.text(title);
        header.html(name);
        header2.text( text );
        //d3.event.pageX相对于外层容器的position：relative来定位的，记住外层不要随意加relative，否则提示框会跑偏
        toolTip.style("left", (d3.event.pageX+15) + "px")
            .style("top", (d3.event.pageY) + "px")
            .style("height",height)
            .style("min-width","300px");
        headerChart.style("display","none");
        highlightLinks(d,true);
    }
    else if (type=="CONTRIBUTION") {
        // link 弧上的某一块或者弧到点上的线  links的数据
        /*
         Highlight chord stroke
         */
        toolTip.transition()
            .duration(200)
            .style("opacity", ".9");

        var titleTip = d.FILE_NUM || pacsById[office + "_" + d.CMTE_ID].CMTE_NM;
        // 设置图上线的显示title
        var title = creat_lineTip(d,titleTip)
        var width = 240;
        var height = 130;
        if( title.length > 13 ){
            width = title.length*13 + 30;
        }
        if( width > 400 ){
            height += ( width/400 -1 ) *15;
            width = 400;
        }
        title =  title.replace(/_/g,' , ');
        header1.text(title);
        header.text(d.CAND_NAME);
        header2.text(formatCurrency(Number(d.TRANSACTION_AMT)) +'人次 占’'+ titleTip+'‘多科疾病总人数的'
            +(Number(100*d.TRANSACTION_AMT)/d.Sum).toFixed(2)+'%');//+ " on " + d.Month + "/" + d.Day + "/" + d.Year
        toolTip.style("left", (d3.event.pageX+15) + "px")
            .style("top", (d3.event.pageY) + "px")
            .style("height",height+ "px")
            .style("width", width+"px")
            .style("min-width", "");
        headerChart.style("display","none");
        highlightLink(d,true);
    }
    else if (type=="PAC") {
        /*
         highlight all contributions and all candidates
         弧 块加上线的总数  chords里的数据
         */
        //控制toolTip的显隐
        toolTip.transition()
            .duration(200)
            .style("opacity", ".9");

        var _pacs = pacsById[office + "_" + d.label];
        var amount = +_pacs.Amount;
        var width = 235;
        var height = 150;
        var title = pacsById[office + "_" + d.label].CMTE_NM;
        if( title.length > 15 ){
            width = title.length*15 + 30;
        }
        if( width > 400 ){
            height += ( width/400 -1 ) *30;
            width = 400;
        }
        var tip = "";
        if(_pacs.Sum >= amount){
            ratio = (100 * amount / _pacs.Sum).toFixed(2);
            tip = amount+'人次  占' +ratio+'%';
        }else{
            tip = "暂无数据";
        }
        title =  title.replace(/_/g,' , ');

        header1.text('疾病');
        header.text( title ); //"Total Contributions: " +
        header2.text(tip);
        toolTip.style("left", (d3.event.pageX+15) + "px")
            .style("top", (d3.event.pageY) + "px")
            .style("height", height+ "px")
            .style("width", width+ "px");
        headerChart.style("display","inline-block");
        highlightLinks(chordsById[d.label],true);
    }
}

function node_onMouseOut(d,type) {
    if (type=="CAND") {
        highlightLinks(d,false);
    }
    else if (type=="CONTRIBUTION") {
        highlightLink(d,false);
    }
    else if (type=="PAC") {
        highlightLinks(chordsById[d.label],false);
    }


    toolTip.transition()									// declare the transition properties to fade-out the div
        .duration(500)									// it shall take 500ms
        .style("opacity", "0");							// and go all the way to an opacity of nil

}

function highlightLink(g,on) {
    var opacity=((on==true) ? .6 : .1);

    // console.log("fadeHandler(" + opacity + ")");
    // highlightSvg.style("opacity",opacity);

    var link=d3.select(document.getElementById("l_" + g.Key));
    link.transition((on==true) ? 0:0)
        .style("fill-opacity",opacity)
        .style("stroke-opacity",opacity);
    var arc=d3.select(document.getElementById("a_" + g.Key));
    arc.transition().style("fill-opacity",(on==true) ? opacity :.2);

    var circ=d3.select(document.getElementById("c_" + g.CAND_ID));
    circ.transition((on==true) ? 0:0)
        .style("opacity",((on==true) ?1 :0));

    var text=d3.select(document.getElementById("t_" + g.CMTE_ID));
    text.transition((on==true) ? 0:550)
        .style("fill",(on==true) ? "#000" : "#777")
        .style("font-size",(on==true) ? "14px" : "12px")
        .style("stroke-width",((on==true) ? 2 : 0));


}

function highlightLinks(d,on) {

    d.relatedLinks.forEach(function (d) {
        highlightLink(d,on);
    })

}


senateButton.on("click",function (d) {

    senateButton.attr("class","selected");
    houseButton.attr("class",null);
    office="senate";
    linksSvg.selectAll("g.links").remove();
    clearInterval(intervalId);
    main();

});

houseButton.on("click",function (d) {
//    linkGroup.selectAll("g.links").remove();
    senateButton.attr("class",null);
    houseButton.attr("class","selected");
    office="house";
//    linksSvg.selectAll("g.links").remove();
    clearInterval(intervalId);
    main();
});