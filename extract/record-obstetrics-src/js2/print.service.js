angular.module('infi-basic').service('PrintService',['$http',function ($http) {
    // 打印
    function bindPrint(id){
        jqprintDiv();
        var HKEY_Root, HKEY_Path, HKEY_Key;
        HKEY_Root = "HKEY_CURRENT_USER";
        HKEY_Path = "\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
        function jqprintDiv() {
            $("#"+id+"").print();
        }

        function PageSetup_Null() {
            try {
                var Wsh = new ActiveXObject("WScript.Shell");
                HKEY_Key = "header";
                Wsh.RegWrite(HKEY_Root + HKEY_Path + HKEY_Key, "");
                HKEY_Key = "footer";
                Wsh.RegWrite(HKEY_Root + HKEY_Path + HKEY_Key, "");
            }
            catch (e) { }
        }
    }

    return {
        bindPrint:bindPrint
    }
}]);
