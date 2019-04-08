angular.module('infi-basic',['ngRoute','ui.bootstrap','ngFileUpload'])
.config(["$httpProvider", function ($httpProvider) {
    $httpProvider.interceptors.push("httpInterceptor");
}]);