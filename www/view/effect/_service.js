'use strict';
module.exports = angular.module('app.effect', [])
    .config(function ($stateProvider) {
        $stateProvider.state('main.effect', {
            url: '/effect',
            templateProvider: function ($q) {
                var deferred = $q.defer();
                require.ensure(['./effect.html'], function (require) {
                    var template = require('./effect.html');
                    deferred.resolve(template);
                }, 'effect-tpl');
                return deferred.promise;
            },
            controller: 'effectCtrl',
            controllerAs: 'vm',
            resolve: {
                'app.effect': function ($q, $ocLazyLoad) {
                    var deferred = $q.defer();
                    require.ensure(['./effect.js'], function () {
                        var mod = require('./effect.js');
                        $ocLazyLoad.load({
                            name: 'app.effect'
                        });
                        deferred.resolve(mod.controller);
                    }, 'effect-ctl');
                    return deferred.promise;
                }
            }
        });
    }).name;
