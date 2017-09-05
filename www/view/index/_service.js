'use strict';
module.exports = angular.module('app.index', []).config(function ($stateProvider) {
    $stateProvider.state('index', {
        url: '',
        abstract: true,
        templateProvider: function ($q) {
            var deferred = $q.defer();
            require.ensure(['./index.html'], function (require) {
                var template = require('./index.html');
                deferred.resolve(template);
            }, 'index-tpl');
            return deferred.promise;
        },
        controller: 'indexCtrl',
        controllerAs: 'vm',
        resolve: {
            'app.index': function ($q, $ocLazyLoad) {
                var deferred = $q.defer();
                require.ensure(['./index.js'], function () {
                    var mod = require('./index.js');
                    $ocLazyLoad.load({
                        name: 'app.index'
                    });
                    deferred.resolve(mod.controller);
                }, 'index-ctl');
                return deferred.promise;
            }
        }
    });
}).name;
