angular.module('infi-basic', ['ngRoute', 'ui.bootstrap','ngFileUpload','ngSanitize'])
    .config(["$httpProvider", function ($httpProvider) {
        $httpProvider.interceptors.push("httpInterceptor");
    }]);
