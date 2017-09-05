'use strict';
module.exports = angular.module('app.controllers', [
    require('view/home/_service.js'),
    require('view/main/_service.js'),
    require('view/login/_service.js'),
    require('view/index/_service.js'),
    require('view/effect/_service.js'),
]).name;
