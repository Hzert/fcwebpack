import angular from 'angular';

import angularUiRouter from 'angular-ui-router';

import oclazyload from 'oclazyload';

import routing from './routing';

import directive from './directive';

import '../css/reset.styl';

import '../css/iconfont.css';

angular.module('app', [
    angularUiRouter,
    oclazyload,
    routing,
    directive
])
    .config(['$urlRouterProvider', function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('home');
        // $locationProvider.html5Mode(true);
    }]);
