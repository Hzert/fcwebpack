'use strict';
// require('./title.css');
module.exports = angular.module('directive.title', []).directive('fengTitle', function () {
    return {
        restrict: 'EA',
        template: require('./title.html'),
        link: function ($scope, elem, attr) {
        }
    };
}).name;
