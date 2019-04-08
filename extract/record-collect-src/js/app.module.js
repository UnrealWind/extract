angular.module('infi-basic', ['ngRoute', 'ui.bootstrap'])
    .config(["$httpProvider", function ($httpProvider) {
        $httpProvider.interceptors.push("httpInterceptor");
    }]);
            