/**
 * 建立angular.module
 */
define(['angular'], function (angular) {
    return angular.module('dcApp', ['ngRoute','ui.router','ui.sortable','ngFileUpload','ngSanitize']);
});
