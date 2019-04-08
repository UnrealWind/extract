/**
 * Created by geqimeng on 17-11-13.
 */
angular.module('infi-basic', ['ngRoute','ui.bootstrap'])
    .config(["$httpProvider", function ($httpProvider) {
        $httpProvider.interceptors.push("httpInterceptor");
    }]);
