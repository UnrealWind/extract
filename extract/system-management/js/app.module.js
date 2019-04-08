angular.module('infi-basic',['ngRoute', 'ui.bootstrap','ivh.treeview'])
    .config(["$httpProvider", function ($httpProvider) {
        $httpProvider.interceptors.push("httpInterceptor");
    }]);
