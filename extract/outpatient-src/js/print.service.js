angular.module('infi-basic').service('PrintService',['$http',function ($http) {
    // 打印
    function bindPrint(id){
        jqprintDiv();
        var HKEY_Root, HKEY_Path, HKEY_Key;
        HKEY_Root = "HKEY_CURRENT_USER";
        HKEY_Path = "\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
        function jqprintDiv() {
            $("#"+id).print();
        }

        function PageSetup_Null() {
            try {
                var Wsh = new ActiveXObject("WScript.Shell");//ActiveXObject只有IE浏览器能识别
                HKEY_Key = "header";
                Wsh.RegWrite(HKEY_Root + HKEY_Path + HKEY_Key, "");
                HKEY_Key = "footer";
                Wsh.RegWrite(HKEY_Root + HKEY_Path + HKEY_Key, "");
            }
            catch (e) { }
        }
    }

    //得到canvas转换成base64位的urlData
    //不采用echarts的API,因为getDataURL方法需要在setoptions时调用,否则获取不到此方法
    function getCanvasDataURL(divId){
        //将第一个画布作为基准。
        var baseCanvas = $("#"+divId).find("canvas").first()[0];
        if(!baseCanvas){
            return false;
        }
        var width = baseCanvas.width;
        var height = baseCanvas.height;
        var ctx = baseCanvas.getContext("2d");
        //遍历，将后续的画布添加到在第一个上
        $("#"+divId).find("canvas").each(function(i,canvasObj){
            if(i>0){
                var canvasTmp = $(canvasObj)[0];
                ctx.drawImage(canvasTmp,0,0,width,height);
            }
        });
        //获取base64位的url
        return baseCanvas.toDataURL();
    } 

    return {
        bindPrint:bindPrint,
        getCanvasDataURL:getCanvasDataURL
    }
}]);
